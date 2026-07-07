
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    Platform,
    ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import AgroMonitoringMap from './AgroMonitoringMap';

/**
 * ✅ AgroMonitoring API Key
 * Loaded securely from Expo config (app.json / app.config.js)
 */
const AGRO_API_KEY = "bd1fc4a60cacccbba6648d10f89b8d0b";

interface MapSelectorProps {
    onConfirm: (coordinates: [number, number][], locationName: string) => void;
    onCancel: () => void;
}

export default function MapSelector({ onConfirm, onCancel }: MapSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [points, setPoints] = useState<[number, number][]>([]);
    const [area, setArea] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [locationName] = useState('Main Farm Plot');

    const [region, setRegion] = useState({
        latitude: 10.7905, // Tamil Nadu default
        longitude: 78.7047,
    });

    const handleSearch = async () => {
        if (!searchQuery) return;

        setLoading(true);
        try {
            if (Platform.OS === 'web') {
                // Web geocoding using OpenStreetMap
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        searchQuery
                    )}&limit=1`
                );
                const data = await response.json();

                if (data?.length > 0) {
                    setRegion({
                        latitude: parseFloat(data[0].lat),
                        longitude: parseFloat(data[0].lon),
                    });
                }
            } else {
                const results = await Location.geocodeAsync(searchQuery);
                if (results.length > 0) {
                    setRegion({
                        latitude: results[0].latitude,
                        longitude: results[0].longitude,
                    });
                }
            }
        } catch (error) {
            console.error('Location search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!AGRO_API_KEY) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    AgroMonitoring API key is missing.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* 🔍 Search Bar */}
            <View style={styles.searchBar}>
                <Pressable onPress={onCancel} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Search address (e.g. Madurai)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />

                <Pressable onPress={handleSearch}>
                    <Ionicons name="search" size={24} color="#333" />
                </Pressable>
            </View>

            {/* 🗺️ Map */}
            <View style={styles.mapWrapper}>
                <AgroMonitoringMap
                    latitude={region.latitude}
                    longitude={region.longitude}
                    apiKey={AGRO_API_KEY}
                    onPointsChange={(newPoints, newArea) => {
                        setPoints(newPoints);
                        setArea(newArea);
                    }}
                />

                {loading && (
                    <View style={styles.overlayLoading}>
                        <ActivityIndicator size="large" color={Colors.light.primary} />
                    </View>
                )}
            </View>

            {/* ✅ Footer */}
            <View style={styles.footer}>
                <View style={styles.infoRow}>
                    <Text style={styles.helpText}>
                        {points.length === 0
                            ? 'Tap on map to start marking'
                            : `${points.length} points marked`}
                    </Text>
                    {area > 0 && (
                        <Text style={[styles.areaText, area < 1 && { color: '#ff5252' }]}>
                            Area: {area.toFixed(2)} ha {area < 1 ? '(Too Small)' : ''}
                        </Text>
                    )}
                </View>

                <View style={styles.btnRow}>
                    <Pressable
                        style={[styles.btn, styles.clearBtn]}
                        onPress={() => setPoints([])}
                    >
                        <Text style={styles.clearBtnText}>Clear</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.btn, styles.confirmBtn, (points.length < 3 || area < 1) && { opacity: 0.6 }]}
                        onPress={() => {
                            if (points.length < 3) {
                                alert('Please mark at least 3 points for a valid field.');
                                return;
                            }
                            if (area < 1) {
                                alert('Farm area must be at least 1 hectare for satellite analysis.');
                                return;
                            }
                            onConfirm(points, searchQuery || locationName);
                        }}
                    >
                        <Text style={styles.confirmBtnText}>Confirm Field</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    backBtn: {
        paddingRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    mapWrapper: {
        flex: 1,
    },
    overlayLoading: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        backgroundColor: '#fff',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    helpText: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'Nunito_600SemiBold',
    },
    areaText: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: '#2E7D32',
    },
    btnRow: {
        flexDirection: 'row',
        gap: 12,
    },
    btn: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearBtn: {
        backgroundColor: '#F5F5F5',
    },
    confirmBtn: {
        backgroundColor: '#2E7D32',
    },
    clearBtnText: {
        color: '#333',
        fontWeight: '600',
    },
    confirmBtnText: {
        color: '#fff',
        fontWeight: '700',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        fontWeight: '600',
    },
});

