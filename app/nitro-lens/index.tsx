import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Alert, Modal, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import NitroCard from '@/components/nitro/NitroCard';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

export default function NitroLensScreen() {
    const router = useRouter();

    const [showPicker, setShowPicker] = useState(false);

    const pickImage = async (useCamera: boolean) => {
        setShowPicker(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        let result;
        if (useCamera) {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') return;
            result = await ImagePicker.launchCameraAsync({
                quality: 0.7,
                allowsEditing: true,
            });
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') return;
            result = await ImagePicker.launchImageLibraryAsync({
                quality: 0.7,
                allowsEditing: true,
            });
        }

        if (!result.canceled) {
            Alert.alert("Analysis Started", "We are analyzing your nitrogen levels...");
        }
    };

    const handleNewReading = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setShowPicker(true);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: "Leaf Health Monitor",
                    headerShown: true,
                    headerBackTitle: "Back",
                    headerTintColor: Colors.light.primary,
                }}
            />

            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <NitroCard onPress={handleNewReading} />

                    <View style={styles.historySection}>
                        <Text style={styles.sectionTitle}>Recent Readings</Text>
                        {/* Placeholder for history */}
                        <View style={styles.emptyState}>
                            <Ionicons name="leaf-outline" size={48} color="#ddd" />
                            <Text style={styles.emptyText}>No readings yet. Start scanning!</Text>
                        </View>
                    </View>

                    <Pressable
                        style={styles.arButton}
                        onPress={() => router.push('/nitro-lens/ar-view')}
                    >
                        <Ionicons name="scan-circle" size={24} color="#fff" />
                        <Text style={styles.arButtonText}>Open Digital Twin (AR)</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <Modal
                visible={showPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowPicker(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHandle} />
                            <Text style={styles.modalTitle}>New Reading</Text>
                            <Text style={styles.modalSubtitle}>How would you like to take a reading?</Text>
                        </View>

                        <View style={styles.pickerOptions}>
                            <Pressable
                                style={({ pressed }) => [styles.pickerOption, pressed && styles.pressedOption]}
                                onPress={() => pickImage(true)}
                            >
                                <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                                    <Ionicons name="camera" size={32} color="#2E7D32" />
                                </View>
                                <Text style={styles.optionLabel}>Camera</Text>
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [styles.pickerOption, pressed && styles.pressedOption]}
                                onPress={() => pickImage(false)}
                            >
                                <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                                    <Ionicons name="images" size={32} color="#1976D2" />
                                </View>
                                <Text style={styles.optionLabel}>Gallery</Text>
                            </Pressable>
                        </View>

                        <Pressable
                            style={styles.cancelBtn}
                            onPress={() => setShowPicker(false)}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        paddingTop: 20,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    historySection: {
        paddingHorizontal: 16,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        marginBottom: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'dashed',
    },
    emptyText: {
        marginTop: 12,
        color: '#999',
        fontFamily: 'Nunito_600SemiBold',
    },
    arButton: {
        margin: 16,
        backgroundColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 10,
    },
    arButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 300,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#ddd',
        borderRadius: 2,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: 'Nunito_400Regular',
        color: '#666',
    },
    pickerOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 32,
    },
    pickerOption: {
        alignItems: 'center',
        gap: 12,
    },
    pressedOption: {
        opacity: 0.7,
    },
    iconBox: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    optionLabel: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
    },
    cancelBtn: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: '#666',
    },

});
