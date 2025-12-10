const admin = require('firebase-admin')
const path = require('path');
const fs = require('fs');

function loadJsonConfig(fileName){
	try {
		const filePath = path.join(__dirname, fileName);
		const fileContent = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(fileContent);
	} catch (err) {
		console.error(`Error loading config file ${fileName}:`, err.message);
		return null;
	}
}

async function sendTestPushes(cfg, serviceAccount){

	// If sendTestPushes ever used twice, prevents crashing
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount)
		});
	}

	// Filter incorrect tests
	const validTests = cfg.tests.filter(t => {
		const isValid = t.title && t.body && t.fcmToken;
		if(!isValid) console.log("Skipping invalid test:", t);
		return isValid;
	})

	// Map all pushes to Promise all
	const pushes = validTests.map(async (testNotification, i) => {
		try {
			console.log(`Sending test push ${i+1}`)
			const payload = {
				token: testNotification.fcmToken,
				notification: {
					"title": testNotification.title,
					"body": testNotification.body
				}
			}
			if (testNotification.image) {
				payload.notification.image = testNotification.image;
			}
			const res = await admin.messaging().send(payload);
			console.log(`[Success] sent test push #${i+1}`);
			return res;
		} catch (error) {
			console.error(`[Error] Failed to send push #${i+1} to ${testNotification.fcmToken}:`, error);
			return null
		}
	})

	return Promise.all(pushes)

}

(async function main(){
	try {
		const cfg = loadJsonConfig("push-config.json");

		if (!cfg || !cfg.serviceAccountName) {
			throw new Error('Config missing or serviceAccountName not specified');
		}

		const serviceAccount = loadJsonConfig(cfg.serviceAccountName);
		if (!serviceAccount) {
			throw new Error(`Error loading service account: ${cfg.serviceAccountName}`);
		}

		await sendTestPushes(cfg, serviceAccount);
		console.log("All test notifications processed");

		process.exit(0);

	} catch (e) {
		console.error("General error", e);
		process.exit(1);
	}
})();
