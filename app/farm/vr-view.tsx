
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, Animated, ScrollView, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DeviceMotion } from 'expo-sensors';
import { digitalTwinService } from '@/lib/services/digital-twin';

const TIMELINE = [
    { label: 'Past', date: 'Oct 2025', desc: 'Planting Season', scenario: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000' },
    { label: 'Present', date: 'Feb 2026', desc: 'Vegetative Growth', scenario: 'https://images.unsplash.com/photo-1523348830342-d31610942d3e?q=80&w=2000' },
    { label: 'Future', date: 'May 2026', desc: 'Harvest Prediction', scenario: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=2000' }
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function VRViewScreen() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(1); // Present
    const [fadeAnim] = useState(new Animated.Value(1));
    const [isSBSMode, setIsSBSMode] = useState(false);
    const [rotationX] = useState(new Animated.Value(0));

    useEffect(() => {
        DeviceMotion.setUpdateInterval(16);
        const subscription = DeviceMotion.addListener(({ rotation }) => {
            if (rotation) {
                // Map gamma (side tilt) to X translation
                // Sensitivity multiplier for panoramic effect
                const panX = rotation.gamma * (SCREEN_WIDTH * 0.5);
                rotationX.setValue(-panX);
            }
        });

        return () => subscription.remove();
    }, []);

    const switchTime = (index: number) => {
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start();
        setCurrentTime(index);
    };

    const renderVRContent = (isLeftEye: boolean = true) => (
        <Animated.View style={[
            styles.eyeContainer,
            isSBSMode && (isLeftEye ? styles.leftEye : styles.rightEye),
            { opacity: fadeAnim }
        ]}>
            <Animated.Image
                source={{ uri: TIMELINE[currentTime].scenario }}
                style={[
                    styles.backgroundImage,
                    {
                        transform: [
                            { translateX: rotationX },
                            { scale: 1.5 } // Keep it larger to support panning
                        ]
                    }
                ]}
            />
            <View style={styles.overlay}>
                {!isSBSMode || isLeftEye ? (
                    <View style={styles.header}>
                        <Pressable style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="close" size={28} color="#fff" />
                        </Pressable>
                        <Pressable style={styles.vrsToggle} onPress={() => setIsSBSMode(!isSBSMode)}>
                            <MaterialCommunityIcons
                                name={(isSBSMode ? "google-glass" : "eye-outline") as any}
                                size={28}
                                color="#fff"
                            />
                        </Pressable>
                    </View>
                ) : <View style={styles.headerSpacer} />}

                <View style={[styles.vrCenter, isSBSMode && { transform: [{ scale: 0.7 }] }]}>
                    <View style={styles.reticle}>
                        <View style={styles.reticleDot} />
                    </View>
                    <View style={styles.inspectCard}>
                        <Text style={styles.inspectTitle}>{TIMELINE[currentTime].desc}</Text>
                        <Text style={styles.inspectDate}>{TIMELINE[currentTime].date}</Text>
                        {currentTime === 2 && (
                            <View style={styles.predictionBadge}>
                                <Ionicons name="trending-up" size={14} color="#4CAF50" />
                                <Text style={styles.predictionText}>92% Yield Prediction</Text>
                            </View>
                        )}
                    </View>
                </View>

                {!isSBSMode || isLeftEye ? (
                    <View style={styles.controls}>
                        <View style={styles.timelineBar}>
                            {TIMELINE.map((item, index) => (
                                <Pressable
                                    key={index}
                                    style={[styles.timeBtn, currentTime === index && styles.activeTimeBtn]}
                                    onPress={() => switchTime(index)}
                                >
                                    <Text style={[styles.timeLabel, currentTime === index && styles.activeLabel]}>
                                        {item.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ) : <View style={styles.controlsSpacer} />}
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.mainView, isSBSMode && styles.row]}>
                {renderVRContent(true)}
                {isSBSMode && renderVRContent(false)}
            </View>
            {isSBSMode && <View style={styles.centerDivider} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#1A1A1A', // Fallback color
    },
    overlay: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeTag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    timeTagText: {
        color: '#fff',
        fontFamily: 'Nunito_700Bold',
        fontSize: 14,
    },
    vrCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reticle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reticleDot: {
        width: 4,
        height: 4,
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    inspectCard: {
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    inspectTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
    },
    inspectDate: {
        color: '#ccc',
        fontSize: 14,
        fontFamily: 'Nunito_600SemiBold',
        marginTop: 4,
    },
    predictionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 10,
        gap: 4,
    },
    predictionText: {
        color: '#81C784',
        fontSize: 12,
        fontFamily: 'Nunito_700Bold',
    },
    controls: {
        marginBottom: 40,
        alignItems: 'center',
    },
    timelineBar: {
        flexDirection: 'row',
        padding: 6,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.6)',
        overflow: 'hidden',
    },
    mainView: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    eyeContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    leftEye: {
        borderRightWidth: 1,
        borderColor: '#000',
    },
    rightEye: {
        borderLeftWidth: 1,
        borderColor: '#000',
    },
    centerDivider: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        width: 2,
        backgroundColor: '#000',
        zIndex: 10,
    },
    vrsToggle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerSpacer: {
        height: 44,
    },
    controlsSpacer: {
        height: 60,
    },
    timeBtn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 25,
    },
    activeTimeBtn: {
        backgroundColor: '#fff',
    },
    timeLabel: {
        color: '#fff',
        fontFamily: 'Nunito_700Bold',
        fontSize: 14,
    },
    activeLabel: {
        color: '#000',
    }
});
