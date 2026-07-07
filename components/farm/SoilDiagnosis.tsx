import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface SoilDiagnosisProps {
    moisture: number;
    temp: number; // Kelvin
    ndvi?: number;
    onRefresh?: () => void;
}

export default function SoilDiagnosis({ moisture, temp, ndvi, onRefresh }: SoilDiagnosisProps) {
    const tempC = temp - 273.15;

    const getMoistureAlert = () => {
        if (moisture < 0.2) return { label: "Low Moisture", color: "#F44336", icon: "water-off" };
        if (moisture > 0.4) return { label: "High Moisture", color: "#2196F3", icon: "water" };
        return { label: "Ideal Moisture", color: "#4CAF50", icon: "water-outline" };
    };

    const getTempAlert = () => {
        if (tempC < 10) return { label: "Cold Soil", color: "#2196F3", icon: "thermometer" };
        if (tempC > 35) return { label: "High Heat", color: "#F44336", icon: "thermometer" };
        return { label: "Ideal Temperature", color: "#4CAF50", icon: "thermometer-outline" };
    };

    const moistureStatus = getMoistureAlert();
    const tempStatus = getTempAlert();

    const getAIInterpretation = () => {
        if (moisture < 0.2) return "The soil is significantly dry. Consider immediate irrigation to prevent crop wilting.";
        if (tempC > 35) return "Soil temperatures are high. Ensure adequate water cover to avoid root stress.";
        if (ndvi && ndvi < 0.4) return "Vegetation health is below average. Check for nutrient deficiencies or pest issues.";
        return "Soil conditions are currently optimal for growth. Maintain normal schedule.";
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ffffff', '#f1f8e9']}
                style={styles.card}
            >
                <View style={styles.header}>
                    <MaterialCommunityIcons name="molecule" size={20} color={Colors.light.primary} />
                    <Text style={styles.title}>Soil Diagnosis</Text>
                    {onRefresh && (
                        <Pressable onPress={onRefresh} style={styles.refreshBtn}>
                            <Ionicons name="refresh" size={18} color={Colors.light.primary} />
                        </Pressable>
                    )}
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Live</Text>
                    </View>
                </View>

                <View style={styles.grid}>
                    <View style={styles.item}>
                        <View style={[styles.iconCircle, { backgroundColor: moistureStatus.color + '20' }]}>
                            <Ionicons name={moistureStatus.icon as any} size={20} color={moistureStatus.color} />
                        </View>
                        <Text style={styles.valText}>{(moisture * 100).toFixed(1)}%</Text>
                        <Text style={[styles.statusLabel, { color: moistureStatus.color }]}>{moistureStatus.label}</Text>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.item}>
                        <View style={[styles.iconCircle, { backgroundColor: tempStatus.color + '20' }]}>
                            <Ionicons name={tempStatus.icon as any} size={20} color={tempStatus.color} />
                        </View>
                        <Text style={styles.valText}>{tempC.toFixed(1)}°C</Text>
                        <Text style={[styles.statusLabel, { color: tempStatus.color }]}>{tempStatus.label}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.insightBox}>
                    <View style={styles.insightHeader}>
                        <Ionicons name="bulb" size={16} color="#E65100" />
                        <Text style={styles.insightTitle}>AI Insight</Text>
                    </View>
                    <Text style={styles.insightText}>{getAIInterpretation()}</Text>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 20,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        flex: 1,
    },
    statusBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    statusText: {
        color: '#2E7D32',
        fontSize: 10,
        fontFamily: 'Nunito_800ExtraBold',
        textTransform: 'uppercase',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    item: {
        alignItems: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    valText: {
        fontSize: 20,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    statusLabel: {
        fontSize: 12,
        fontFamily: 'Nunito_700Bold',
        marginTop: 2,
    },
    separator: {
        width: 1,
        height: 40,
        backgroundColor: '#eee',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 16,
    },
    insightBox: {
        backgroundColor: '#FFF3E0',
        padding: 12,
        borderRadius: 12,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    insightTitle: {
        fontSize: 14,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#E65100',
    },
    insightText: {
        fontSize: 13,
        fontFamily: 'Nunito_600SemiBold',
        color: '#5D4037',
        lineHeight: 18,
    },
    refreshBtn: {
        padding: 4,
        marginRight: 8,
    },
});
