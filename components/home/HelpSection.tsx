import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

export default function HelpSection() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Need Help?</Text>
            <View style={styles.grid}>
                <Pressable style={styles.item}>
                    <View style={[styles.iconBg, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="chatbubbles" size={24} color="#2196F3" />
                    </View>
                    <Text style={styles.label}>Chat with Us</Text>
                </Pressable>
                <Pressable style={styles.item}>
                    <View style={[styles.iconBg, { backgroundColor: '#FFF3E0' }]}>
                        <Ionicons name="help-circle" size={24} color="#FF9800" />
                    </View>
                    <Text style={styles.label}>FAQs</Text>
                </Pressable>
                <Pressable style={styles.item}>
                    <View style={[styles.iconBg, { backgroundColor: '#FFEBEE' }]}>
                        <Ionicons name="call" size={24} color="#F44336" />
                    </View>
                    <Text style={styles.label}>Call Support</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    item: {
        alignItems: 'center',
        width: '30%',
    },
    iconBg: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#555',
    },
});
