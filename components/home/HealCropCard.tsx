import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useLanguage } from '@/lib/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function HealCropCard() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#E8F5E9', '#FFFFFF']}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>{t.pestDetection || "Heal your crop"}</Text>
                        <Text style={styles.subtitle}>Get things fixed with AI magic scan</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Ionicons name="bug-outline" size={24} color={Colors.light.primary} />
                    </View>
                </View>

                <View style={styles.stepsContainer}>
                    <View style={styles.step}>
                        <View style={styles.stepIconBg}>
                            <Ionicons name="camera" size={20} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.stepText}>Snap</Text>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.step}>
                        <View style={styles.stepIconBg}>
                            <Ionicons name="scan" size={20} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.stepText}>Diagnose</Text>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.step}>
                        <View style={styles.stepIconBg}>
                            <Ionicons name="medkit" size={20} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.stepText}>Heal</Text>
                    </View>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
                    ]}
                    onPress={() => router.push('/pest')}
                >
                    <Text style={styles.buttonText}>{t.takePhoto || "Initiate Scan"}</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                </Pressable>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 12,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    gradient: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#2E7D32',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Nunito_600SemiBold',
        color: '#555',
        maxWidth: 200,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    step: {
        alignItems: 'center',
    },
    stepIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C8E6C9',
        marginBottom: 6,
    },
    stepText: {
        fontSize: 12,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#C8E6C9',
        marginHorizontal: 8,
        top: -10,
    },
    button: {
        backgroundColor: Colors.light.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
    },
});
