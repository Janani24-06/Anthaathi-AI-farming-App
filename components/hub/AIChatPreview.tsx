import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function AIChatPreview() {
    const router = useRouter();

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                { transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
            onPress={() => router.push('/chat')}
        >
            <LinearGradient
                colors={[Colors.light.primary, '#1B5E20']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <View style={styles.iconBg}>
                        <Ionicons name="sparkles" size={20} color={Colors.light.primary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Uzhavan AI</Text>
                        <Text style={styles.subtitle}>Ask anything about farming...</Text>
                    </View>
                    <View style={styles.arrow}>
                        <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
                    </View>
                </View>
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 16,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    gradient: {
        padding: 16,
        borderRadius: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBg: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: 'rgba(255,255,255,0.8)',
    },
    arrow: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 12,
    },
});
