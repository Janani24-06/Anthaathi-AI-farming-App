
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Speech from 'expo-speech';

export const automationService = {
    // Daily Digital Twin Refresh Simulation
    async runDailyMonitoring() {
        console.log("Running Daily Digital Twin Automation...");
        // Simulation: Detect a stress event
        const stressEvents = [
            { type: 'PEST', field: 'North Sector', risk: 'High' },
            { type: 'WEATHER', field: 'All Fields', risk: 'Frost Alert' }
        ];

        for (const event of stressEvents) {
            await this.triggerAlert(event);
        }
    },

    async triggerAlert(event: any) {
        const title = `🚨 ${event.type} ALERT`;
        const message = `${event.risk} detected in ${event.field}. Take immediate action.`;

        // 1. App Alert Dialog
        Alert.alert(title, message, [
            { text: 'View in AR', onPress: () => console.log('Navigating to AR...') },
            { text: 'OK' }
        ]);

        // 2. Push Notification (Mock request)
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body: message,
                data: { data: 'goes here' },
            },
            trigger: null, // trigger immediately
        });

        // 3. Voice Alert Option
        Speech.speak(`${title}. ${message}`, {
            language: 'en',
            pitch: 1.0,
            rate: 0.9,
        });
    }
};

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});
