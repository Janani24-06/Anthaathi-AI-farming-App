import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Platform, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t, language, setLanguage } = useLanguage();
  const { user, isLoading, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [location, setLocation] = useState(user?.location || "");
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  // Sync local state when user data is loaded from Firestore
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setLocation(user.location);
    }
  }, [user]);

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await updateProfile({ name: name.trim(), location: location.trim() });
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(t.logout, "Are you sure?", [
      { text: t.cancel, style: "cancel" },
      {
        text: t.logout,
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const toggleLanguage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newLang = language === "en" ? "ta" : "en";
    await setLanguage(newLang);
    await updateProfile({ language: newLang });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopInset, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: 'Nunito_600SemiBold', color: Colors.light.textSecondary }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.profile}</Text>
        <Pressable
          onPress={() => editing ? handleSave() : setEditing(true)}
          style={styles.editBtn}
        >
          <Ionicons
            name={editing ? "checkmark" : "create-outline"}
            size={22}
            color={Colors.light.primary}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Feather name="user" size={40} color={Colors.light.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || t.farmer}</Text>
          <Text style={styles.userPhone}>{user?.phone || "+91 XXXXXXXXXX"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>

          <View style={styles.fieldRow}>
            <Feather name="user" size={20} color={Colors.light.textSecondary} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>{t.name}</Text>
              {editing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.light.textLight}
                />
              ) : (
                <Text style={styles.fieldValue}>{user?.name || "Not set"}</Text>
              )}
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Ionicons name="call-outline" size={20} color={Colors.light.textSecondary} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>{t.phone}</Text>
              <Text style={styles.fieldValue}>{user?.phone || "Not set"}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Ionicons name="location-outline" size={20} color={Colors.light.textSecondary} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>{t.location}</Text>
              {editing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location"
                  placeholderTextColor={Colors.light.textLight}
                />
              ) : (
                <Text style={styles.fieldValue}>{user?.location || "Not set"}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <Pressable style={styles.settingRow} onPress={toggleLanguage}>
            <Ionicons name="language" size={20} color={Colors.light.textSecondary} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>{t.language}</Text>
              <Text style={styles.fieldValue}>
                {language === "en" ? "English" : "Tamil"}
              </Text>
            </View>
            <View style={styles.langBadge}>
              <Text style={styles.langBadgeText}>
                {language === "en" ? "EN" : "TA"}
              </Text>
            </View>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutBtn,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.light.error} />
          <Text style={styles.logoutText}>{t.logout}</Text>
        </Pressable>

        <View style={styles.versionWrap}>
          <Text style={styles.versionText}>Anthaathi v1.0.0</Text>
          <Text style={styles.versionText}>AI Farming Companion</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  editBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  userName: {
    fontSize: 22,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  userPhone: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.textLight,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textLight,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.text,
  },
  fieldInput: {
    backgroundColor: Colors.light.inputBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.text,
  },
  langBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langBadgeText: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#FFEBEE",
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.error,
  },
  versionWrap: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 2,
  },
  versionText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textLight,
  },
});
