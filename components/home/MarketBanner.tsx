import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/lib/LanguageContext';

export default function MarketBanner() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                { transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
            onPress={() => router.push('/market')}
        >
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop' }}
                style={styles.bgImage}
                imageStyle={{ borderRadius: 16 }}
            >
                <View style={styles.overlay}>
                    <View style={styles.content}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{t.marketPrices || "Know Your Market"}</Text>
                            <Text style={styles.subtitle}>Live mandi prices & trends</Text>
                        </View>
                        <View style={styles.arrowCircle}>
                            <Ionicons name="trending-up" size={20} color="#fff" />
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 20,
        height: 100,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bgImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Nunito_600SemiBold',
        color: 'rgba(255,255,255,0.9)',
    },
    arrowCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
});
