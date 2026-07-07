import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Platform, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import Colors from "@/constants/colors";
import WeatherHeader from "@/components/WeatherHeader";
import HealCropCard from "@/components/home/HealCropCard";
import MarketBanner from "@/components/home/MarketBanner";
import DealsSection from "@/components/home/DealsSection";
import HelpSection from "@/components/home/HelpSection";
import HubBanner from "@/components/home/HubBanner";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { user } = useAuth();
  const webTopInset = Platform.OS === "web" ? 20 : 0;

  const [refreshing, setRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState<{ temp: number; condition: string; icon: string } | null>(null);

  const fetchWeather = async () => {
    try {
      // Default to Madurai, TN
      const defaultLat = 9.9252;
      const defaultLon = 78.1198;

      // Importing locally to avoid top-level issues if file pending
      const { getWeather } = require('@/lib/services/weather');
      const data = await getWeather(defaultLat, defaultLon);

      if (data) {
        setWeatherData(data);
      }
    } catch (error) {
      console.log("Error loading weather:", error);
    }
  };

  React.useEffect(() => {
    fetchWeather();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchWeather().then(() => setRefreshing(false));
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.primary} />
        }
      >
        {/* Weather Header */}
        <View style={styles.headerContainer}>
          <WeatherHeader
            userName={user?.name || (t as any).farmer}
            weather={weatherData || {
              temp: 28,
              condition: "Cloudy",
              icon: "cloud"
            }}
          />
        </View>

        {/* Heal Your Crop (Pest Detection) */}
        <HealCropCard />

        {/* Market Banner */}
        <MarketBanner />

        {/* Deals of the Day */}
        <DealsSection />

        {/* Help Section */}
        <HelpSection />

        {/* Community Banner */}
        <HubBanner />

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollArea: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 0,
  },
  footerSpacer: {
    height: 40,
  }
});
