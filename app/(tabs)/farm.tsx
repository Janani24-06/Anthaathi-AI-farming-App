// Refresh trigger
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

import VirtualFarmCard from '@/components/farm/VirtualFarmCard';
import FarmInsights from '@/components/farm/FarmInsights';
import FertilizerCalculator from '@/components/farm/FertilizerCalculator';
import MapSelector from '@/components/farm/MapSelector';
import SoilDiagnosis from '@/components/farm/SoilDiagnosis';
import { agromonitoring, Polygon, SoilData } from '@/lib/services/agromonitoring';
import { automationService } from '@/lib/services/ai-automation';

type ScreenState = 'NO_FARM' | 'MAPPING' | 'DASHBOARD';

export default function FarmScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [screenState, setScreenState] = useState<ScreenState>('NO_FARM');
    const [loading, setLoading] = useState(false);
    const [polygon, setPolygon] = useState<Polygon | null>(null);
    const [soilData, setSoilData] = useState<SoilData | null>(null);
    const [locationName, setLocationName] = useState("My Farm Field");

    useEffect(() => {
        if (screenState === 'DASHBOARD') {
            automationService.runDailyMonitoring();
        }
    }, [screenState]);


    const handleConfirmPlot = async (coords: [number, number][], name: string) => {
        setLoading(true);
        try {
            const poly = await agromonitoring.createPolygon(name, coords);

            // Wait a moment for the backend to initialize the new polygon
            await new Promise(resolve => setTimeout(resolve, 1500));

            const soil = await agromonitoring.getSoilData(poly.id);
            setPolygon(poly);
            setSoilData(soil);
            setLocationName(name);
            setScreenState('DASHBOARD');
        } catch (err) {
            console.error("Failed to register field", err);
            alert("Error: " + (err instanceof Error ? err.message : "Failed to connect to AgroMonitoring API. Please check your field boundaries."));
        } finally {
            setLoading(false);
        }
    };

    const refreshSoilData = async () => {
        if (!polygon) return;
        setLoading(true);
        try {
            const soil = await agromonitoring.getSoilData(polygon.id);
            setSoilData(soil);
        } catch (err) {
            console.error("Failed to refresh soil data", err);
        } finally {
            setLoading(false);
        }
    };

    const renderHeader = () => (
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 10 : 0) }]}>
            <View style={styles.headerLeft}>
                <Ionicons name="arrow-back" size={24} color="#333" />
                <View style={styles.titleContainer}>
                    <View style={styles.dropdownRow}>
                        <Text style={styles.farmName}>{locationName}</Text>
                        <Ionicons name="chevron-down" size={16} color="#333" />
                    </View>
                    <Text style={styles.cropTag}>Wheat</Text>
                </View>
            </View>
            <View style={styles.headerRight}>
                <Pressable style={styles.iconBtn}>
                    <MaterialCommunityIcons name="scanner" size={22} color="#333" />
                </Pressable>
                <Pressable style={styles.iconBtn}>
                    <Ionicons name="notifications-outline" size={22} color="#333" />
                </Pressable>
                <Pressable style={styles.iconBtn} onPress={() => setScreenState('MAPPING')}>
                    <Ionicons name="map-outline" size={22} color="#333" />
                </Pressable>
            </View>
        </View>
    );

    if (screenState === 'NO_FARM') {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.noFarmContainer}>
                    <MaterialCommunityIcons name="map-marker-path" size={80} color={Colors.light.primary} />
                    <Text style={styles.noFarmTitle}>No Farm Field Connected</Text>
                    <Text style={styles.noFarmSub}>Plot your farm field on the map to unlock satellite health insights and soil diagnostics.</Text>
                    <Pressable
                        style={styles.primaryBtn}
                        onPress={() => setScreenState('MAPPING')}
                    >
                        <Text style={styles.primaryBtnText}>Start Mapping Now</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    if (screenState === 'MAPPING') {
        return <MapSelector onConfirm={handleConfirmPlot} onCancel={() => setScreenState(polygon ? 'DASHBOARD' : 'NO_FARM')} />;
    }

    return (
        <View style={styles.container}>
            {renderHeader()}

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {loading && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={Colors.light.primary} />
                        <Text style={styles.loaderText}>Processing Soil Diagnosis...</Text>
                    </View>
                )}

                {!loading && (
                    <>
                        <VirtualFarmCard
                            farmName={locationName}
                            cropType="Wheat"
                            acres={polygon?.area ? (polygon.area / 4046.86).toFixed(2) : "6.34"}
                            sowingDate="12 Oct 2025"
                            harvestDate="15 Feb 2026"
                            stage="Vegetative"
                            locationLabel={locationName}
                            latitude={polygon?.center[0]}
                            longitude={polygon?.center[1]}
                            polyId={polygon?.id}
                        />

                        {/* Soil Diagnosis appears after plotting */}
                        <SoilDiagnosis
                            moisture={soilData?.moisture || 0.13}
                            temp={soilData?.t10 || 301.15}
                            onRefresh={refreshSoilData}
                        />

                        {/* Digital Twin Section */}
                        <View style={styles.twinSection}>
                            <Text style={styles.sectionTitle}>Digital Twin Engine</Text>
                            <View style={styles.twinRow}>
                                <Pressable
                                    style={[styles.twinCard, { backgroundColor: '#E8F5E9' }]}
                                    onPress={() => router.push({
                                        pathname: '/nitro-lens/ar-view',
                                        params: { mode: 'INSPECTION', farmId: polygon?.id }
                                    })}
                                >
                                    <View style={styles.twinIconCircle}>
                                        <MaterialCommunityIcons name="augmented-reality" size={32} color={Colors.light.primary} />
                                    </View>
                                    <Text style={styles.twinCardTitle}>Live AR Inspection</Text>
                                    <Text style={styles.twinCardSub}>Overlay health data onto field</Text>
                                </Pressable>

                                <Pressable
                                    style={[styles.twinCard, { backgroundColor: '#F3E5F5' }]}
                                    onPress={() => router.push('/farm/vr-view')}
                                >
                                    <View style={[styles.twinIconCircle, { backgroundColor: '#9C27B020' }]}>
                                        <MaterialCommunityIcons name="google-glass" size={32} color="#9C27B0" />
                                    </View>
                                    <Text style={styles.twinCardTitle}>VR Walkthrough</Text>
                                    <Text style={styles.twinCardSub}>Explore virtual future growth</Text>
                                </Pressable>
                            </View>
                        </View>


                        <FarmInsights />

                        <FertilizerCalculator />
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    titleContainer: {
        gap: 2,
    },
    dropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    farmName: {
        fontSize: 16,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    cropTag: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        padding: 40,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
    },
    noFarmContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
    },
    noFarmTitle: {
        fontSize: 22,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        marginTop: 20,
    },
    noFarmSub: {
        fontSize: 16,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 24,
    },
    primaryBtn: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 30,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
    },
    twinSection: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        marginBottom: 16,
    },
    twinRow: {
        flexDirection: 'row',
        gap: 12,
    },
    twinCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    twinIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    twinCardTitle: {
        fontSize: 14,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    twinCardSub: {
        fontSize: 11,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
        textAlign: 'center',
    },
});
