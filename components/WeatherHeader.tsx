import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '@/lib/LanguageContext';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface WeatherHeaderProps {
    userName?: string;
    weather: {
        temp: number;
        condition: string;
        icon: string;
    } | null;
}

export default function WeatherHeader({ userName, weather }: WeatherHeaderProps) {
    const { t, language } = useLanguage();

    const getDateString = () => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        return date.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', options);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (language === 'ta') {
            return "வணக்கம்"; // Vanakkam is general, but let's stick to simple "Vanakkam"
        }
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=2536&auto=format&fit=crop' }} // Generic pleasant morning/farm sky
                style={styles.bgImage}
                imageStyle={{ borderRadius: 24 }}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                    style={styles.gradient}
                >
                    <View style={styles.topRow}>
                        <View>
                            <Text style={styles.greeting}>{getGreeting()} {userName || (language === 'ta' ? 'விவசாயி' : 'Farmer')} 🙏</Text>
                            <Text style={styles.date}>{getDateString()}</Text>
                        </View>
                        <Pressable style={styles.calendarLink} onPress={() => router.push('/calendar')}>
                            <Ionicons name="calendar-outline" size={24} color="#fff" />
                        </Pressable>
                    </View>

                    <View style={styles.weatherRow}>
                        <Text style={styles.temp}>{weather?.temp || '--'}°C</Text>
                        <View style={styles.conditionBox}>
                            {/* Icon can be dynamic based on prop, for now hardcoded style to match screenshot idea */}
                        </View>
                    </View>

                    <View style={styles.bottomRow}>
                        <View style={{ flex: 1 }} />
                        <Pressable style={styles.detailBtn} onPress={() => router.push('/weather')}>
                            <Text style={styles.detailBtnText}>{t.weather || "View detailed weather forecast"}</Text>
                            <Ionicons name="arrow-forward" size={16} color={Colors.light.primary} />
                        </Pressable>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 24,
        overflow: 'hidden',
        height: 200,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    bgImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between'
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    greeting: {
        fontSize: 22,
        fontFamily: 'Nunito_700Bold',
        color: '#fff',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        fontFamily: 'Nunito_400Regular',
        color: 'rgba(255,255,255,0.9)',
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    temp: {
        fontSize: 48,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#fff',
    },
    conditionBox: {
        marginLeft: 10
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    detailBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailBtnText: {
        fontSize: 12,
        fontFamily: 'Nunito_700Bold',
        color: Colors.light.primary,
    },
    calendarLink: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
