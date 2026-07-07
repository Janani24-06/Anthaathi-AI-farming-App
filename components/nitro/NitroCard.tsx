import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface NitroCardProps {
    onPress?: () => void;
}

export default function NitroCard({ onPress }: NitroCardProps) {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push('/nitro-lens');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ffffff', '#E8F5E9']}
                style={styles.card}
            >
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/628/628283.png' }}
                            style={styles.plantIcon}
                        />
                    </View>

                    <Text style={styles.title}>Nitro Lens</Text>
                    <Text style={styles.description}>
                        Analyze your Nitrogen Levels instantly with just an Image
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            { transform: [{ scale: pressed ? 0.95 : 1 }] }
                        ]}
                        onPress={handlePress}
                    >
                        <Ionicons name="camera" size={20} color="#fff" />
                        <Text style={styles.buttonText}>New Reading</Text>
                    </Pressable>
                </View>

                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={20} color={Colors.light.primary} />
                    <Text style={styles.infoText}>
                        Regularly measuring Nitrogen level helps to increase the yield by <Text style={styles.bold}>27%</Text> and save cost up to <Text style={styles.bold}>43%</Text>
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    plantIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        padding: 16,
        gap: 12,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        fontFamily: 'Nunito_500Medium',
        color: '#2E7D32',
        lineHeight: 18,
    },
    bold: {
        fontFamily: 'Nunito_800ExtraBold',
    },
});
