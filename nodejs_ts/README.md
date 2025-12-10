### Firebase Push Notification Tester

Simple Node.js TypeScript tool for sending test Firebase Cloud Messaging notifications using a Service Account.

> Note: Note: No Compile Required This tool runs TypeScript natively. It does not require a build step (tsc) or a third-party loader (ts-node). It utilizes the modern Node.js runtime (v22.6+) to execute .ts files directly.

#### Prerequisites
* Node.js (v22 or higher)
* npm
* Service account connected to properly configured firebase project

### Installation
* Install the required dependency (ensure typescript and @types/node are installed):

```bash
npm install
```

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
