import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface AROverlayProps {
    onCapture: () => void;
    is3DMode: boolean;
    onToggleMode: () => void;
    crops: any[];
    selectedCrop: string;
    onSelectCrop: (type: any) => void;
}

export default function AROverlay({
    onCapture,
    is3DMode,
    onToggleMode,
    crops,
    selectedCrop,
    onSelectCrop
}: AROverlayProps) {
    return (
        <View style={styles.overlay} pointerEvents="box-none">
            {/* Top Tooltip */}
            <View style={styles.tooltipContainer}>
                <View style={styles.tooltip}>
                    <Ionicons name="sparkles" size={20} color="#FFD700" />
                    <Text style={styles.tooltipText}>
                        Tap anywhere on the ground to place your Digital Twin.
                    </Text>
                </View>
            </View>

            <View pointerEvents="box-none">
                {/* Crop Selection Bar */}
                <View style={styles.cropBarContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cropScroll}>
                        {crops.map((crop) => (
                            <Pressable
                                key={crop.id}
                                style={[
                                    styles.cropItem,
                                    selectedCrop === crop.id.toUpperCase() && styles.selectedCropItem
                                ]}
                                onPress={() => onSelectCrop(crop.id.toUpperCase())}
                            >
                                <View style={styles.cropIconBg}>
                                    <Image source={{ uri: crop.icon }} style={styles.cropIcon} />
                                </View>
                                <Text style={[
                                    styles.cropName,
                                    selectedCrop === crop.id.toUpperCase() && styles.selectedCropName
                                ]}>
                                    {crop.name}
                                </Text>
                                {selectedCrop === crop.id.toUpperCase() && <View style={styles.activeDot} />}
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Bottom Action Bar */}
                <View style={styles.actionBar}>
                    <Pressable style={styles.iconButton} onPress={onToggleMode}>
                        <Ionicons
                            name={is3DMode ? "cube" : "camera-reverse"}
                            size={24}
                            color="#fff"
                        />
                    </Pressable>

                    <Pressable style={styles.captureButton} onPress={onCapture}>
                        <View style={styles.captureInner} />
                    </Pressable>

                    <Pressable style={styles.iconButton}>
                        <MaterialCommunityIcons name="layers-outline" size={24} color="#fff" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    tooltipContainer: {
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    tooltip: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 12,
        borderRadius: 20,
        alignItems: 'center',
        gap: 8,
    },
    tooltipText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Nunito_700Bold',
        textAlign: 'center',
    },
    cropBarContainer: {
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 12,
    },
    cropScroll: {
        paddingHorizontal: 20,
        gap: 20,
    },
    cropItem: {
        alignItems: 'center',
        gap: 6,
        width: 70,
    },
    selectedCropItem: {
        transform: [{ scale: 1.1 }],
    },
    cropIconBg: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    selectedCropItemIconBg: {
        borderColor: '#fff',
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    cropIcon: {
        width: 32,
        height: 32,
    },
    cropName: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontFamily: 'Nunito_700Bold',
    },
    selectedCropName: {
        color: '#fff',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#fff',
        marginTop: 2,
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    captureButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
    },
    captureInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
    },
    iconButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 24,
    },
});
