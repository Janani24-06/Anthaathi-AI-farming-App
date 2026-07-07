import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import AgroMonitoringMap from './AgroMonitoringMap';

// API Key for AgroMonitoring
const AGRO_API_KEY = "237411666cf0a04cb89fe9ae693ea7a3";

interface VirtualFarmCardProps {
    farmName: string;
    cropType: string;
    acres: string;
    sowingDate: string;
    harvestDate: string;
    stage: string;
    locationLabel: string;
    satelliteImageUrl?: string;
    latitude?: number;
    longitude?: number;
    polyId?: string;
    onEdit?: () => void;
}

export default function VirtualFarmCard({
    farmName = "Main Paddy Field",
    cropType = "Wheat",
    acres = "6.34",
    sowingDate = "12 Oct 2025",
    harvestDate = "15 Feb 2026",
    stage = "Vegetative",
    locationLabel = "SSN Cricket Ground area, Madurai",
    satelliteImageUrl,
    latitude,
    longitude,
    polyId,
    onEdit
}: VirtualFarmCardProps) {

    // Default satellite image if none provided
    const displayImage = satelliteImageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Virtual Farm</Text>
                    <Text style={styles.subtitle}>Unlock Precision Farming with Satellite Insights</Text>
                </View>
                <Pressable onPress={onEdit} style={styles.editBtn}>
                    <Ionicons name="pencil" size={16} color={Colors.light.primary} />
                </Pressable>
            </View>

            <View style={styles.card}>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="crop-free" size={20} color={Colors.light.primary} />
                        <Text style={styles.statText}>{acres} acres</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="sprout" size={20} color={Colors.light.primary} />
                        <Text style={styles.statText}>{cropType}</Text>
                    </View>
                </View>

                <View style={styles.pillsContainer}>
                    <View style={[styles.pill, { backgroundColor: '#FFF3E0' }]}>
                        <Text style={[styles.pillLabel, { color: '#E65100' }]}>Sowed at</Text>
                        <Text style={[styles.pillValue, { color: '#E65100' }]}>{sowingDate}</Text>
                    </View>
                    <View style={[styles.pill, { backgroundColor: '#FFFDE7' }]}>
                        <Text style={[styles.pillLabel, { color: '#FBC02D' }]}>Current Stage</Text>
                        <Text style={[styles.pillValue, { color: '#FBC02D' }]}>{stage}</Text>
                    </View>
                    <View style={[styles.pill, { backgroundColor: '#E8F5E9' }]}>
                        <Text style={[styles.pillLabel, { color: '#2E7D32' }]}>Expected Harvest</Text>
                        <Text style={[styles.pillValue, { color: '#2E7D32' }]}>{harvestDate}</Text>
                    </View>
                </View>

                <View style={styles.mapContainer}>
                    {latitude && longitude ? (
                        <AgroMonitoringMap
                            latitude={latitude}
                            longitude={longitude}
                            apiKey={AGRO_API_KEY}
                            polyId={polyId}
                            readOnly={true}
                        />
                    ) : (
                        <>
                            <Image
                                source={{ uri: displayImage }}
                                style={styles.mapImage}
                            />
                            <View style={styles.markerContainer}>
                                <Ionicons name="location" size={32} color={Colors.light.error} />
                            </View>
                        </>
                    )}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={styles.mapOverlay}
                    >
                        <Text style={styles.locationText} numberOfLines={1}>
                            {locationLabel}
                        </Text>
                    </LinearGradient>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
        marginTop: 2,
    },
    editBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
    },
    pillsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 16,
    },
    pill: {
        flex: 1,
        padding: 8,
        borderRadius: 12,
        alignItems: 'flex-start',
    },
    pillLabel: {
        fontSize: 10,
        fontFamily: 'Nunito_700Bold',
        marginBottom: 2,
    },
    pillValue: {
        fontSize: 11,
        fontFamily: 'Nunito_800ExtraBold',
    },
    mapContainer: {
        height: 150,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -16,
        marginTop: -32,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
    },
    locationText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
    },
});
