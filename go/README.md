# Push Notification Sender

Go CLI tool for sending test Firebase Cloud Messaging notifications using a Service Account.

## Configuration

Create a `test-config.json` file in the binary's directory or your working directory:

```json
{
  "serviceAccountName": "service-account.json",
  "tests": [
    {
      "FCMToken": "DEVICE_TOKEN_HERE",
      "title": "Test Title",
      "body": "Test Body",
      "imageURL": ""
    },
    {
      "FCMToken": "OTHER_DEVICE_TOKEN_HERE",
      "title": "Test Title",
      "body": "Test Body",
      "imageURL": ""
    }
  ]
}
```
* serviceAccountName: Name of your Firebase private key file (Should be placed in the bin folder).
* FCMToken: Target device registration token.

## Build & Run

Use the included Makefile to manage dependencies and build.

```bash
# 1. Install dependencies
make dep

# 2. Run locally (without building)
make run

# 3. Build for specific OS (output in /bin)
make macos      # Apple Silicon
make windows    # Windows 64-bit
make linux      # Linux 64-bit
make all        # Build all
make clean      # Cleanup bin folder
```


