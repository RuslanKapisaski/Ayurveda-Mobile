import { useEffect, useRef, useState } from "react";
import {
    addNotificationReceivedListener,
    addNotificationResponseReceivedListener,
    AndroidImportance,
    getPermissionsAsync,
    requestPermissionsAsync,
    scheduleNotificationAsync,
    setNotificationChannelAsync,
    setNotificationHandler,
    cancelScheduledNotificationAsync,
    SchedulableTriggerInputTypes,
} from "expo-notifications"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device"
import { Platform } from "react-native";
import { NotificationContext } from "./NotificationContext"
import { navigationRef } from "../../navigation/navigationRef";

setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    })
})

const HOUR = 60 * 60
const DAYS_UNTIL_FOLLOW_UP = 20;
const SECONDS_IN_DAY = 24 * 60 * 60;

export function NotificationsProvider({ children }) {
    const [permission, setPermission] = useState(null)

    const notificationListener = useRef()
    const responseListener = useRef()

    useEffect(() => {
        requestNotificationPermissions();

        notificationListener.current = addNotificationReceivedListener(
            (notification) => {
                console.log("Notification received: ", notification)
            }
        )

        responseListener.current = addNotificationResponseReceivedListener(
            (response) => {
                const data = response.notification.request.content.data;

                console.log("Notification tapped: ", data);

                if (!navigationRef.isReady()) return;

                if (data.type === "daily_recommendation_reminder") {
                    navigationRef.navigate("HomeScreen");
                }

                if (data.type === "appointment_reminder") {
                    navigationRef.navigate("HomeScreen");
                }

                if (data.type === "checkup_follow_up") {
                    navigationRef.navigate("HomeScreen", {
                        screen: "Checkup",
                    });
                }
            }
        );


        return () => {
            notificationListener.current?.remove()
            responseListener.current?.remove()
        }
    }, [])

    const requestNotificationPermissions = async () => {
        if (!Device.isDevice) return;

        const { status: existingStatus } =
            await getPermissionsAsync();

        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } =
                await requestPermissionsAsync();

            finalStatus = status;
        }

        setPermission(finalStatus);

        if (Platform.OS === "android") {
            await setNotificationChannelAsync("default", {
                name: "default",
                importance: AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
            });
        }
    };

    const sendLocalNotification = async (title, body, trigger = null, data = {}) => {
        const notificationId = await scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
                data,
            },
            trigger,
        });

        return notificationId;
    };

    const scheduleCheckupFollowUpReminder = async () => {

        return await sendLocalNotification(
            "Second consultation reminder",
            "It is recommended to have a second consultation with a doctor.",
            {
                type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: SECONDS_IN_DAY * DAYS_UNTIL_FOLLOW_UP,
                repeats: false,
            },
            {
                type: "checkup_follow_up",
            }
        );
    };

    const scheduleAppointmentReminder = async (appointmentDate, type) => {
        const reminderDate = new Date(appointmentDate);

        reminderDate.setDate(reminderDate.getDate() - 1);

        let trigger

        if (reminderDate <= new Date()) {
            trigger = {
                type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: HOUR,
                repeats: false,
            };
        } else {
            trigger = {
                type: SchedulableTriggerInputTypes.DATE,
                date: reminderDate,
            };
        }

        return await sendLocalNotification(
            "Upcoming appointment",
            `You have Ayurveda ${type} tommorow.`,
            trigger,
            {
                type: "appointment_reminder",
            }
        );
    };

    const scheduleRecommendationsReminder = async () => {
        const existingId = await AsyncStorage.getItem("dailyRecommendationNotificationId");

        if (existingId) {
            return existingId;
        }

        const notificationId = await sendLocalNotification(
            "Daily Ayurveda recommendation",
            "Your personalized recommendation for today is ready.",
            {
                type: SchedulableTriggerInputTypes.CALENDAR,
                hour: 9,
                minute: 0,
                repeats: true,
            },
            {
                type: "daily_recommendation_reminder",
            }
        );

        await AsyncStorage.setItem(
            "dailyRecommendationNotificationId",
            notificationId
        );

        return notificationId;
    };

    const cancelNotification = async (notificationId) => {
        if (!notificationId) return;

        await cancelScheduledNotificationAsync(notificationId);
    };


    return (
        <NotificationContext.Provider
            value={{
                permission,
                sendLocalNotification,
                scheduleAppointmentReminder,
                cancelNotification,
                scheduleCheckupFollowUpReminder,
                scheduleRecommendationsReminder,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}