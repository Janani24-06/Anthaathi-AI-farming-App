import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExpenseCard() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.light.primary, '#1B5E20']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <Text style={styles.label}>Total Balance</Text>
                <Text style={styles.balance}>₹ 24,500</Text>

                <View style={styles.row}>
                    <View style={styles.item}>
                        <View style={[styles.iconBg, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Ionicons name="arrow-down" size={16} color="#4CAF50" />
                        </View>
                        <View>
                            <Text style={styles.itemLabel}>Income</Text>
                            <Text style={styles.itemValue}>₹ 45,000</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.item}>
                        <View style={[styles.iconBg, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Ionicons name="arrow-up" size={16} color="#FF5252" />
                        </View>
                        <View>
                            <Text style={styles.itemLabel}>Expense</Text>
                            <Text style={styles.itemValue}>₹ 20,500</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    card: {
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    label: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontFamily: 'Nunito_600SemiBold',
        marginBottom: 4,
    },
    balance: {
        color: '#fff',
        fontSize: 32,
        fontFamily: 'Nunito_800ExtraBold',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 12,
        padding: 12,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        justifyContent: 'center',
    },
    iconBg: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
    },
    itemValue: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
    },
    divider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 10,
    },
});
