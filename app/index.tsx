import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/lib/AuthContext";
import Colors from "@/constants/colors";

export default function SplashScreen() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (user) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/login");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [user, isLoading]);

  return (
    <LinearGradient
      colors={[Colors.light.primaryDark, Colors.light.primary, Colors.light.primaryLight]}
      style={styles.container}
    >
      <View style={styles.iconWrap}>
        <View style={styles.leafIcon}>
          <View style={styles.leafLeft} />
          <View style={styles.leafRight} />
          <View style={styles.stem} />
        </View>
      </View>
      <Text style={styles.title}>ANTHAATHI</Text>
      <Text style={styles.subtitle}>AI Farming Companion</Text>
      <ActivityIndicator size="large" color="#fff" style={styles.loader} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  leafIcon: {
    width: 50,
    height: 60,
    alignItems: "center",
  },
  leafLeft: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#A5D6A7",
    top: 4,
    left: 2,
    transform: [{ rotate: "-30deg" }],
  },
  leafRight: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#81C784",
    top: 4,
    right: 2,
    transform: [{ rotate: "30deg" }],
  },
  stem: {
    position: "absolute",
    bottom: 0,
    width: 4,
    height: 30,
    backgroundColor: "#A5D6A7",
    borderRadius: 2,
  },
  title: {
    fontSize: 36,
    fontFamily: "Nunito_800ExtraBold",
    color: "#fff",
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255,255,255,0.85)",
    marginTop: 8,
  },
  loader: {
    marginTop: 40,
  },
});
