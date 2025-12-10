package main

import (
	"context"
	"encoding/json"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"fmt"
	"google.golang.org/api/option"
	"log"
	"os"
	"path/filepath"
)

type TestPush struct {
	messaging.Notification
	FCMToken string
}

type TestConfig struct {
	ServiceAccountName string     `json:"serviceAccountName"`
	Tests              []TestPush `json:"tests"`
}

func loadConfig[T any](cfgFileName string) (*T, error) {
	exePath, err := os.Executable()
	if err != nil {
		log.Println("Error getting executable path:", err)
	}

	exeDir := filepath.Dir(exePath)
	path := filepath.Join(exeDir, cfgFileName)

	rawConfig, err := os.ReadFile(path)
	if err != nil {
		log.Println("Error reading test config from binary dir:", err)
		log.Println("Trying to read the config from current directory")

		rawConfig, err = os.ReadFile(cfgFileName)
		if err != nil {
			log.Println("Error reading config from pwd:", err)
			return nil, err
		}
	}

	var cfg T
	if err := json.Unmarshal(rawConfig, &cfg); err != nil {
		return nil, fmt.Errorf("error parsing config JSON: %w", err)
	}

	return &cfg, nil
}

func sendTestPushes(cfg *TestConfig) {
	opt := option.WithCredentialsFile(cfg.ServiceAccountName)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	ctx := context.Background()
	client, err := app.Messaging(ctx)
	if err != nil {
		log.Fatalf("error getting Messaging client: %v\n", err)
	}

	for _, notification := range cfg.Tests {
		message := &messaging.Message{
			Notification: &messaging.Notification{
				Title:    notification.Title,
				Body:     notification.Body,
				ImageURL: notification.ImageURL,
			},
			Token: notification.FCMToken,
		}

		response, err := client.Send(ctx, message)
		if err != nil {
			log.Printf("Failed to send notification to %s: %v\n", notification.FCMToken, err)
		}

		fmt.Printf("Successfully sent message to %s: %s\n", notification.FCMToken, response)

	}
}

func main() {
	cfg, err := loadConfig[TestConfig]("push-config.json")
	if err != nil {
		log.Println("Failed to load test config", err)
		return
	}

	sendTestPushes(cfg)
}
