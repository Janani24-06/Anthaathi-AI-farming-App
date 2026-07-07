import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const TRANSACTIONS = [
    { id: '1', title: 'Sold 50kg Tomatoes', date: 'Today, 10:30 AM', amount: '+ ₹1,200', type: 'income' },
    { id: '2', title: 'Bought Urea (2 bags)', date: 'Yesterday, 4:00 PM', amount: '- ₹540', type: 'expense' },
    { id: '3', title: 'Labor Payment', date: '15 Feb, 6:00 PM', amount: '- ₹2,000', type: 'expense' },
    { id: '4', title: 'Sold Brinjals', date: '14 Feb, 9:00 AM', amount: '+ ₹800', type: 'income' },
];

export default function TransactionList() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Recent Transactions</Text>
                <Text style={styles.seeAll}>See All</Text>
            </View>

            {TRANSACTIONS.map((item) => (
                <View key={item.id} style={styles.item}>
                    <View style={[styles.iconContainer, { backgroundColor: item.type === 'income' ? '#E8F5E9' : '#FFEBEE' }]}>
                        <Ionicons
                            name={item.type === 'income' ? 'arrow-down' : 'arrow-up'}
                            size={20}
                            color={item.type === 'income' ? '#2E7D32' : '#C62828'}
                        />
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.date}>{item.date}</Text>
                    </View>
                    <Text style={[styles.amount, { color: item.type === 'income' ? '#2E7D32' : '#C62828' }]}>
                        {item.amount}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    seeAll: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: Colors.light.primary,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    details: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#999',
    },
    amount: {
        fontSize: 16,
        fontFamily: 'Nunito_800ExtraBold',
    },
});
