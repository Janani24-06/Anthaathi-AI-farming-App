import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Platform, Alert, KeyboardAvoidingView } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/lib/AuthContext";
import { firebaseConfig, auth } from "@/lib/firebase";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const { bypassLogin } = useAuth();

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      Alert.alert("Invalid", "Please enter a valid 10-digit phone number");
      return;
    }

    setErrorStatus(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const fullPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      const vid = await phoneProvider.verifyPhoneNumber(
        fullPhone,
        recaptchaVerifier.current!
      );
      setVerificationId(vid);
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      console.error("Firebase SMS send failed:", error);
      let errorMsg = "Failed to send OTP. Please check your network and try again.";

      if (error.code === 'auth/configuration-not-found') {
        errorMsg = "Firebase Phone Authentication is not enabled. Please enable it in your Firebase Console (Authentication > Sign-in method).";
      } else if (error.code === 'auth/billing-not-enabled') {
        errorMsg = "Firebase billing might be required for real SMS. Use a Test Number (+91 99999 99999) to skip this.";
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMsg = "The phone number entered is invalid. Please check and try again.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = "Too many attempts. Please try again later or use a Test Number.";
      }

      setErrorStatus(errorMsg);
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) { // Firebase OTPs are usually 6 digits
      Alert.alert("Invalid", "Please enter the 6-digit OTP");
      return;
    }

    if (!verificationId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        otp
      );
      await signInWithCredential(auth, credential);
      // AuthContext listener will handle the user state and navigation
      setLoading(false);
      router.replace("/language");
    } catch (error: any) {
      console.error("Firebase OTP verification failed:", error);
      Alert.alert("Error", "Invalid OTP code. Please try again.");
      setLoading(false);
    }
  };

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification={true}
        />
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.primaryLight]}
          style={styles.header}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="leaf" size={40} color="#fff" />
          </View>
          <Text style={styles.appName}>ANTHAATHI</Text>
          <Text style={styles.appSub}>AI Farming Companion</Text>
        </LinearGradient>

        <View style={styles.formArea}>
          <Text style={styles.formTitle}>
            {verificationId ? "Verify OTP" : "Phone Login"}
          </Text>
          <Text style={styles.formDesc}>
            {verificationId
              ? "Enter the 6-digit code sent to your phone"
              : "Enter your phone number to get started"}
          </Text>

          {!verificationId ? (
            <View style={styles.inputRow}>
              <View style={styles.prefixBox}>
                <Text style={styles.prefix}>+91</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={Colors.light.textLight}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          ) : (
            <View style={styles.otpRow}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={styles.otpBox}>
                  <Text style={styles.otpDigit}>{otp[i] || ""}</Text>
                </View>
              ))}
              <TextInput
                style={styles.hiddenInput}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                autoFocus
              />
            </View>
          )}

          {errorStatus && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={Colors.light.error} />
              <Text style={styles.errorText}>{errorStatus}</Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: (pressed || loading) ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
            onPress={verificationId ? handleVerifyOtp : handleSendOtp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Please wait..." : verificationId ? "Verify OTP" : "Send OTP"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </Pressable>

          {verificationId && (
            <Pressable onPress={() => setVerificationId(null)} style={styles.resend}>
              <Text style={styles.resendText}>Change Phone Number</Text>
            </Pressable>
          )}

          {!verificationId && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                bypassLogin();
                router.replace("/language");
              }}
              style={styles.skipBtn}
            >
              <Text style={styles.skipBtnText}>Skip for Now →</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => {
              setPhone("9999999999");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={styles.demoLink}
          >
            <Text style={styles.demoLinkText}>Use Test Number (+91 99999 99999)</Text>
          </Pressable>

          <Text style={styles.demoNote}>
            Real SMS may be delayed or requires billing. For testing, use the number above with the fixed OTP configured in your Firebase Console.
          </Text>
        </View>

        <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 16 }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingVertical: 48,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontFamily: "Nunito_800ExtraBold",
    color: "#fff",
    letterSpacing: 3,
  },
  appSub: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
  },
  formArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  formDesc: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  prefixBox: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  prefix: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    fontSize: 18,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.text,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: Colors.light.border,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
    position: "relative",
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  otpDigit: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  resend: {
    alignSelf: "center",
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.primary,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.error,
  },
  skipBtn: {
    alignSelf: "flex-end",
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  skipBtnText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#666",
  },
  demoLink: {
    alignSelf: "center",
    marginTop: 20,
    padding: 8,
  },
  demoLinkText: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.primary,
    textDecorationLine: "underline",
  },
  demoNote: {
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textLight,
  },
});
