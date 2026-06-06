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
import * as Device from "expo-device"
import { Platform } from "react-native";
import { NotificationContext } from "./NotificationContext"

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
                console.log("Notification tapped: ", response)
            }
        )


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

            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}