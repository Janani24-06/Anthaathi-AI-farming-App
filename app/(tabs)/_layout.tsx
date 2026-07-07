import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useLanguage } from "@/lib/LanguageContext";
import { Platform } from "react-native";

export default function TabLayout() {
    const { t } = useLanguage();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#000",
                    borderTopWidth: 0,
                    height: Platform.OS === "web" ? 70 : (Platform.OS === "ios" ? 85 : 60),
                    paddingBottom: Platform.OS === "web" ? 12 : (Platform.OS === "ios" ? 30 : 8),
                    paddingTop: 8,
                },
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "#888",
                tabBarLabelStyle: {
                    fontFamily: "Nunito_600SemiBold",
                    fontSize: 10,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: t.home || "Home",
                    tabBarIcon: ({ color, size }) => (
                        // @ts-ignore
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="farm"
                options={{
                    title: "Farm",
                    tabBarIcon: ({ color, size }) => (
                        // @ts-ignore
                        <MaterialCommunityIcons name="barley" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="hub"
                options={{
                    title: "Hub",
                    tabBarIcon: ({ color, size }) => (
                        // @ts-ignore
                        <Ionicons name="grid" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="finances"
                options={{
                    title: "Finances",
                    tabBarIcon: ({ color, size }) => (
                        // @ts-ignore
                        <Ionicons name="wallet" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
