import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useLanguage();
  const { updateProfile } = useAuth();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const handleSelect = async (lang: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setLanguage(lang);
    await updateProfile({ language: lang });
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/home");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset + 24 }]}>
      <View style={styles.iconWrap}>
        <Ionicons name="language" size={48} color={Colors.light.primary} />
      </View>

      <Text style={styles.title}>Select Language</Text>
      <Text style={styles.titleTa}>மொழி தேர்வு</Text>

      <View style={styles.options}>
        <Pressable
          style={({ pressed }) => [
            styles.langCard,
            language === "en" && styles.langCardActive,
            { transform: [{ scale: pressed ? 0.97 : 1 }] },
          ]}
          onPress={() => handleSelect("en")}
        >
          <Text style={styles.langEmoji}>A</Text>
          <View style={styles.langInfo}>
            <Text style={[styles.langName, language === "en" && styles.langNameActive]}>
              English
            </Text>
            <Text style={styles.langDesc}>Continue in English</Text>
          </View>
          {language === "en" && (
            <Ionicons name="checkmark-circle" size={28} color={Colors.light.primary} />
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.langCard,
            language === "ta" && styles.langCardActive,
            { transform: [{ scale: pressed ? 0.97 : 1 }] },
          ]}
          onPress={() => handleSelect("ta")}
        >
          <Text style={styles.langEmoji}>த</Text>
          <View style={styles.langInfo}>
            <Text style={[styles.langName, language === "ta" && styles.langNameActive]}>
              Tamil
            </Text>
            <Text style={styles.langDesc}>தமிழில் தொடரவும்</Text>
          </View>
          {language === "ta" && (
            <Ionicons name="checkmark-circle" size={28} color={Colors.light.primary} />
          )}
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.continueBtn,
          { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
        ]}
        onPress={handleContinue}
      >
        <Text style={styles.continueBtnText}>Continue</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </Pressable>

      <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
    textAlign: "center",
  },
  titleTa: {
    fontSize: 20,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 32,
  },
  options: {
    gap: 16,
  },
  langCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    gap: 16,
  },
  langCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: "#E8F5E9",
  },
  langEmoji: {
    fontSize: 28,
    fontFamily: "Nunito_800ExtraBold",
    color: Colors.light.primary,
    width: 44,
    height: 44,
    textAlign: "center",
    lineHeight: 44,
    backgroundColor: "rgba(46,125,50,0.1)",
    borderRadius: 12,
    overflow: "hidden",
  },
  langInfo: {
    flex: 1,
  },
  langName: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  langNameActive: {
    color: Colors.light.primaryDark,
  },
  langDesc: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  continueBtn: {
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    marginTop: 32,
  },
  continueBtnText: {
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
});
