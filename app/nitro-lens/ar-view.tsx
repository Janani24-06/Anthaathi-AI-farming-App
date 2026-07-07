import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Image, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import AROverlay from '@/components/nitro/AROverlay';
import Colors from '@/constants/colors';
import { digitalTwinService } from '@/lib/services/digital-twin';

const CROP_MODELS = {
    WHEAT: {
        id: 'wheat',
        name: 'Wheat',
        icon: 'https://cdn-icons-png.flaticon.com/512/3004/3004655.png',
        color: '#FDD835'
    },
    RICE: {
        id: 'rice',
        name: 'Rice',
        icon: 'https://cdn-icons-png.flaticon.com/512/2347/2347318.png',
        color: '#E0E0E0'
    },
    CORN: {
        id: 'corn',
        name: 'Corn',
        icon: 'https://cdn-icons-png.flaticon.com/512/1126/1126607.png',
        color: '#FFEA00'
    }
};

interface PlacedCrop {
    id: string;
    type: keyof typeof CROP_MODELS;
    x: number;
    y: number;
    scale: number;
}

export default function ARViewScreen() {
    const { mode, farmId } = useLocalSearchParams();
    const [permission, requestPermission] = useCameraPermissions();
    const [is3DMode, setIs3DMode] = useState(true);
    const [selectedCrop, setSelectedCrop] = useState<keyof typeof CROP_MODELS>('WHEAT');
    const [placedCrops, setPlacedCrops] = useState<PlacedCrop[]>([]);
    const [hotspots, setHotspots] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }

        if (mode === 'INSPECTION') {
            loadInspectionData();
        }
    }, [permission, mode]);

    const loadInspectionData = async () => {
        const spots = await digitalTwinService.getHealthHotspots(farmId as string);
        setHotspots(spots.map((s, i) => ({
            id: `hot_${i}`,
            type: s.type,
            severity: s.severity,
            x: 100 + i * 150, // Mock layout for inspection
            y: 300 + (i % 2) * 100,
            scale: 1.2
        })));
    };

    const handleTouch = (event: any) => {
        if (mode === 'INSPECTION') return; // Selection disabled in inspection

        const { locationX, locationY } = event.nativeEvent;
        const newCrop: PlacedCrop = {
            id: Math.random().toString(36).substr(2, 9),
            type: selectedCrop,
            x: locationX - 50,
            y: locationY - 50,
            scale: 0.8 + Math.random() * 0.4,
        };
        setPlacedCrops([...placedCrops, newCrop]);
    };

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', marginTop: 50 }}>We need your permission to show the camera</Text>
                <Text style={{ textAlign: 'center', color: 'blue', marginTop: 10 }} onPress={requestPermission}>Grant Permission</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <Pressable
                style={styles.touchArea}
                onPress={handleTouch}
            >
                {Platform.OS === 'web' ? (
                    <View style={styles.cameraPlaceholder}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1599587402636-2244249a2067?q=80&w=2070&auto=format&fit=crop' }}
                            style={styles.webCameraImage}
                        />
                        <View style={styles.webOverlay}>
                            <Text style={styles.webText}>
                                {mode === 'INSPECTION' ? 'Live Crop Inspection Mode' : `Tap to Place ${CROP_MODELS[selectedCrop].name}`}
                            </Text>
                            {mode === 'INSPECTION' && (
                                <View style={styles.inspectInfo}>
                                    <Text style={styles.inspectText}>Health Index: 72%</Text>
                                    <Text style={styles.inspectText}>Pest Risk: LOW</Text>
                                </View>
                            )}
                        </View>
                    </View>
                ) : (
                    <CameraView style={styles.camera} facing="back" />
                )}

                {/* Render Placed Crops Or Inspection Hotspots */}
                {(mode === 'INSPECTION' ? hotspots : placedCrops).map((item) => (
                    <View
                        key={item.id}
                        style={[
                            styles.placedModelContainer,
                            {
                                left: item.x,
                                top: item.y,
                                transform: [{ scale: item.scale }]
                            }
                        ]}
                    >
                        {mode === 'INSPECTION' ? (
                            <View style={[styles.hotspotMarker, { borderColor: item.severity === 'HIGH' ? '#f44336' : '#FF9800' }]}>
                                <MaterialCommunityIcons
                                    name={(item.type === 'PEST' ? "bug" : "leaf-off") as any}
                                    size={40}
                                    color={item.severity === 'HIGH' ? '#f44336' : '#FF9800'}
                                />
                                <View style={styles.hotspotLabel}>
                                    <Text style={styles.hotspotLabelText}>{item.type}</Text>
                                    <Text style={styles.hotspotSubText}>{item.severity}</Text>
                                </View>
                            </View>
                        ) : (
                            <>
                                <Image
                                    source={{ uri: CROP_MODELS[item.type as keyof typeof CROP_MODELS].icon }}
                                    style={styles.mock3DModel}
                                />
                                <View style={styles.modelShadow} />
                            </>
                        )}
                    </View>
                ))}
            </Pressable>

            <AROverlay
                onCapture={() => console.log('Capture!')}
                is3DMode={is3DMode}
                onToggleMode={() => setIs3DMode(!is3DMode)}
                selectedCrop={selectedCrop}
                onSelectCrop={setSelectedCrop}
                crops={Object.values(CROP_MODELS)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchArea: {
        flex: 1,
    },
    webCameraImage: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8,
    },
    webOverlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 16,
        borderRadius: 12,
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
    },
    webText: {
        color: '#fff',
        fontFamily: 'Nunito_700Bold',
        fontSize: 16,
    },
    inspectInfo: {
        marginTop: 10,
        gap: 4,
    },
    inspectText: {
        color: '#fff',
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 14,
    },
    hotspotMarker: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hotspotLabel: {
        position: 'absolute',
        bottom: -40,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignItems: 'center',
        minWidth: 80,
    },
    hotspotLabelText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Nunito_800ExtraBold',
    },
    hotspotSubText: {
        color: '#ddd',
        fontSize: 10,
        fontFamily: 'Nunito_600SemiBold',
    },
    placedModelContainer: {
        position: 'absolute',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mock3DModel: {
        width: 100,
        height: 100,
        zIndex: 2,
    },
    modelShadow: {
        width: 60,
        height: 15,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 30,
        marginTop: -10,
        transform: [{ scaleX: 2 }],
        zIndex: 1,
    },
});
