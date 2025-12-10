import * as Admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// firebase-admin is a commonJS module, Can't enable esModuleInterop in compilerOptions since we use TS directly, a workaround
// @ts-ignore
const admin = Admin.default;

interface TestNotification {
	title: string;
	body: string;
	fcmToken: string;
	image?: string;
}

interface PushConfig {
	serviceAccountName: string;
	tests: TestNotification[];
}

function loadJsonConfig(fileName: string): any {
	try {
		const filePath = path.join(__dirname, fileName);
		const fileContent = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(fileContent);
	} catch (err: any) {
		console.error(`Error loading config file ${fileName}:`, err.message);
		return null;
	}
}

async function sendTestPushes(cfg: PushConfig, serviceAccount: admin.ServiceAccount): Promise<(string | null)[]> {
	// If sendTestPushes ever used twice, prevents crashing
	if (!admin?.apps?.length) {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount)
		});
	}

	// Filter incorrect tests
	const validTests: TestNotification[] = cfg.tests.filter((t: TestNotification) => {
		// Preserving original truthiness check logic
		const isValid = t.title && t.body && t.fcmToken;
		if (!isValid) console.log("Skipping invalid test:", t);
		return isValid;
	});

	// Map all pushes to Promise all
	const pushes: Promise<string>[] = validTests.map(async (testNotification: TestNotification, i: number) => {
		try {
			console.log(`Sending test push ${i + 1}`);

			// Constructing payload matching firebase-admin Message type
			const payload: admin.messaging.Message = {
				token: testNotification.fcmToken,
				notification: {
					title: testNotification.title,
					body: testNotification.body
				}
			};

			if (testNotification.image && payload.notification) {
				payload.notification.imageUrl = testNotification.image;
				(payload.notification as any).image = testNotification.image;
			}

			const res = await admin.messaging().send(payload);
			console.log(`[Success] sent test push #${i + 1}`);
			return res;
		} catch (error) {
			console.error(`[Error] Failed to send push #${i + 1} to ${testNotification.fcmToken}:`, error);
			return null;
		}
	});

	return Promise.all(pushes);
}

(async function main() {
	try {
		const cfg: PushConfig = loadJsonConfig("push-config.json") as PushConfig;

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
