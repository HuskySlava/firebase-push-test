### Firebase Push Notification Tester

Simple Node.js javascript tool for sending test Firebase Cloud Messaging notifications using a Service Account.

#### Prerequisites
* Node.js (v22 or higher)
* npm 
* Service account connected to properly configured firebase project

### Installation 
 * Install the required dependency:
```bash
npm install
 * ```

### Configuration
You need two files in the root directory 
* Service Account JSON 
* Configuration JSON file, example:
```json
{
    "serviceAccountName": "example-service-account.json",
    "tests": [
        {
            "fcmToken": "DEVICE_FCM_TOKEN_HERE",
            "title": "Test Title",
            "body": "Test Message"
        },
        {
            "fcmToken": "OTHER_DEVICE_FCM_TOKEN_HERE",
            "title": "Test Title",
            "body": "Test Message"
        }
    ]
}
```

### Usage 
```bash
npm start
```
