import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HubBanner() {
    const router = useRouter();

    return (
        <Pressable style={styles.container} onPress={() => router.push('/hub')}>
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1595837018335-d86419bc16c4?q=80&w=2070&auto=format&fit=crop' }}
                style={styles.bg}
                imageStyle={{ borderRadius: 16 }}
            >
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
                    <Text style={styles.title}>Community Hub</Text>
                    <Text style={styles.subtitle}>Connect with 5000+ farmers</Text>
                    <View style={styles.button}>
                        <Text style={styles.btnText}>Join Now</Text>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 100, // Bottom padding for scroll
        height: 140,
        borderRadius: 16,
        overflow: 'hidden',
    },
    bg: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    gradient: {
        padding: 16,
        height: '100%',
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Nunito_600SemiBold',
        color: '#eee',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    btnText: {
        fontSize: 12,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
    },
});
