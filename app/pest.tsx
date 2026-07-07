import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Platform, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Speech from 'expo-speech';
import { useLanguage } from "@/lib/LanguageContext";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";
import { analyzeCropImage, AnalysisResult, DetailedAnalysis } from "@/lib/services/pest";

export default function PestScreen() {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage(); // Get current language code (en/ta)
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [fullResult, setFullResult] = useState<AnalysisResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  // Derived state for current language result
  const result: DetailedAnalysis | null = fullResult
    ? (fullResult[language as keyof AnalysisResult] || fullResult.en)
    : null;

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const pickImage = async (useCamera: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let pickerResult;

    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") return;
      pickerResult = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: true,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return;
      pickerResult = await ImagePicker.launchImageLibraryAsync({
        quality: 0.7,
        allowsEditing: true,
      });
    }

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      setImageUri(pickerResult.assets[0].uri);
      setFullResult(null);
      Speech.stop();
      setIsSpeaking(false);
      handleAnalysis(pickerResult.assets[0].uri);
    }
  };

  const handleAnalysis = async (uri: string) => {
    setAnalyzing(true);
    try {
      const data = await analyzeCropImage(uri);
      setFullResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      if (!result?.speechText) return;
      const langCode = language === 'ta' ? 'ta-IN' : 'en-US';
      Speech.speak(result.speechText, {
        language: langCode,
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => { Speech.stop(); router.back(); }} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.pestDetection}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }}
        showsVerticalScrollIndicator={false}
      >
        {!imageUri ? (
          <View style={styles.uploadArea}>
            <View style={styles.uploadIcon}>
              <MaterialCommunityIcons name="image-search" size={48} color={Colors.light.primary} />
            </View>
            <Text style={styles.uploadTitle}>{t.uploadImage}</Text>
            <Text style={styles.uploadDesc}>
              {language === 'ta'
                ? "பயிர் நோய்களைக் கண்டறிய புகைப்படம் எடுக்கவும் அல்லது கேலரியில் இருந்து தேர்ந்தெடுக்கவும்"
                : "Take a photo or pick from gallery to detect crop diseases"}
            </Text>

            <View style={styles.buttonRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionBtn,
                  styles.cameraBtn,
                  { transform: [{ scale: pressed ? 0.95 : 1 }] },
                ]}
                onPress={() => pickImage(true)}
              >
                <Ionicons name="camera" size={22} color="#fff" />
                <Text style={styles.actionBtnText}>{t.takePhoto}</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionBtn,
                  styles.galleryBtn,
                  { transform: [{ scale: pressed ? 0.95 : 1 }] },
                ]}
                onPress={() => pickImage(false)}
              >
                <Ionicons name="images" size={22} color={Colors.light.primary} />
                <Text style={[styles.actionBtnText, { color: Colors.light.primary }]}>{t.pickGallery}</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} contentFit="cover" />
              <Pressable
                style={styles.retakeBtn}
                onPress={() => {
                  setImageUri(null);
                  setFullResult(null);
                  Speech.stop();
                  setIsSpeaking(false);
                }}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </Pressable>
            </View>

            {analyzing ? (
              <View style={styles.analyzingWrap}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.analyzingText}>UZHAVAN AI is scanning your crop...</Text>
                <Text style={styles.analyzingSub}>{language === 'ta' ? 'AI உங்கள் பயிரை ஆய்வு செய்கிறது...' : 'Searching for pests and disease symptoms'}</Text>
              </View>
            ) : result ? (
              <View style={styles.resultArea}>

                {/* 1. Diagnosis Header */}
                <View style={styles.diagnosisCard}>
                  <View style={styles.diagnosisHeader}>
                    <Text style={styles.sectionTitle}>🪲 {language === 'ta' ? 'கண்டறியப்பட்டது' : 'Diagnosis'}</Text>
                    <Pressable onPress={toggleSpeech} style={styles.speakBtn}>
                      <Ionicons name={isSpeaking ? "stop-circle" : "volume-high"} size={24} color={Colors.light.primary} />
                      <Text style={styles.speakText}>{isSpeaking ? (language === 'ta' ? "நிறுத்து" : "Stop") : (language === 'ta' ? "கேட்க" : "Listen")}</Text>
                    </Pressable>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>{language === 'ta' ? 'பயிர்:' : 'Crop:'}</Text>
                    <Text style={styles.value}>{result.diagnosis.cropName}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>{language === 'ta' ? 'பிரச்சனை:' : 'Issue:'}</Text>
                    <Text style={[styles.value, styles.highAlert]}>{result.diagnosis.issue}</Text>
                  </View>
                  {result.diagnosis.scientificName && (
                    <Text style={styles.scientificName}>({result.diagnosis.scientificName})</Text>
                  )}
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>{language === 'ta' ? 'நம்பகத்தன்மை:' : 'Confidence:'} {result.diagnosis.confidence}</Text>
                  </View>
                  <Text style={styles.symptomsText}>
                    <Text style={{ fontWeight: 'bold' }}>{language === 'ta' ? 'அறிகுறிகள்: ' : 'Symptoms: '}</Text>{result.diagnosis.symptoms}
                  </Text>
                </View>

                {/* 2. Cause */}
                <View style={[styles.card, { backgroundColor: '#FFF3E0' }]}>
                  <Text style={[styles.sectionTitle, { color: '#E65100' }]}>🔍 {language === 'ta' ? 'காரணம்' : 'Cause'}</Text>
                  <Text style={styles.bodyText}>{result.cause.reason}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.subLabel}>{language === 'ta' ? 'சுற்றுச்சூழல் காரணிகள்:' : 'Environmental Factors:'}</Text>
                  <Text style={styles.bodyText}>{result.cause.environmentalFactors}</Text>
                </View>

                {/* 3. Recommended Actions */}
                <View style={styles.card}>
                  <Text style={[styles.sectionTitle, { color: '#2E7D32' }]}>🌿 {language === 'ta' ? 'பரிந்துரைக்கப்படும் தீர்வுகள்' : 'Recommended Actions'}</Text>

                  <Text style={styles.groupTitle}>{language === 'ta' ? 'உடனடி நடவடிக்கை:' : 'Immediate Actions:'}</Text>
                  {result.actions.immediate.map((action, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bodyText}>{action}</Text>
                    </View>
                  ))}

                  <Text style={[styles.groupTitle, { marginTop: 12 }]}>{language === 'ta' ? 'இயற்கை முறை:' : 'Organic Control:'}</Text>
                  {result.actions.organic.map((action, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bodyText}>{action}</Text>
                    </View>
                  ))}

                  {result.actions.chemical && (
                    <View style={styles.chemicalBox}>
                      <Text style={[styles.groupTitle, { color: '#D32F2F' }]}>{language === 'ta' ? 'ரசாயன முறை (தீவிர நிலையில்):' : 'Chemical Control (If Severe):'}</Text>
                      <Text style={styles.chemLabel}>{language === 'ta' ? 'மருந்து:' : 'Product:'} <Text style={styles.chemValue}>{result.actions.chemical.productName}</Text></Text>
                      <Text style={styles.chemLabel}>{language === 'ta' ? 'செயலில் உள்ள மூலப்பொருள்:' : 'Active Ingredient:'} <Text style={styles.chemValue}>{result.actions.chemical.activeIngredient}</Text></Text>
                      <Text style={styles.chemLabel}>{language === 'ta' ? 'அளவு:' : 'Dosage:'} <Text style={styles.chemValue}>{result.actions.chemical.dosage}</Text></Text>
                      <Text style={styles.warningText}>⚠️ {language === 'ta' ? `அறுவடைக்கு ${result.actions.chemical.waitingPeriod} நாட்களுக்கு முன் நிறுத்தவும்.` : `Wait ${result.actions.chemical.waitingPeriod} before harvest.`}</Text>
                    </View>
                  )}
                </View>

                {/* 4. Prevention */}
                <View style={[styles.card, { backgroundColor: '#E0F7FA' }]}>
                  <Text style={[styles.sectionTitle, { color: '#006064' }]}>🛡️ {language === 'ta' ? 'தடுப்பு முறைகள்' : 'Prevention for Future'}</Text>
                  {result.prevention.map((item, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bodyText}>{item}</Text>
                    </View>
                  ))}
                </View>

              </View>
            ) : null}
          </View>
        )}
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
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  uploadArea: {
    alignItems: "center",
    paddingTop: 40,
  },
  uploadIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 22,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  uploadDesc: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  buttonRow: {
    gap: 12,
    width: "100%",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  cameraBtn: {
    backgroundColor: Colors.light.primary,
  },
  galleryBtn: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  actionBtnText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
  },
  retakeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  analyzingWrap: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  analyzingText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.primary,
  },
  analyzingSub: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  resultArea: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  diagnosisCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  diagnosisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
  },
  speakText: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.light.primary,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  label: {
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.light.textSecondary,
    width: 60,
  },
  value: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.light.text,
    fontSize: 16,
    flex: 1,
  },
  highAlert: {
    color: '#D32F2F',
    fontSize: 18,
  },
  scientificName: {
    fontStyle: 'italic',
    color: Colors.light.textSecondary,
    marginBottom: 8,
    marginLeft: 68,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  confidenceText: {
    color: '#2E7D32',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  symptomsText: {
    fontFamily: 'Nunito_400Regular',
    color: Colors.light.text,
    lineHeight: 20,
  },
  bodyText: {
    fontFamily: 'Nunito_400Regular',
    color: Colors.light.text,
    lineHeight: 22,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 12,
  },
  subLabel: {
    fontFamily: 'Nunito_700Bold',
    color: '#E65100',
    marginBottom: 4,
  },
  groupTitle: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.light.text,
    fontSize: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 10,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.light.textSecondary,
  },
  chemicalBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  chemLabel: {
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  chemValue: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.light.text,
  },
  warningText: {
    marginTop: 8,
    fontFamily: 'Nunito_700Bold',
    color: '#D32F2F',
    fontSize: 13,
  },
});
