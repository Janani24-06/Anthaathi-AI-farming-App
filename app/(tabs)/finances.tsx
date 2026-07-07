import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

import ExpenseCard from '@/components/finances/ExpenseCard';
import MarketPriceList from '@/components/finances/MarketPriceList';
import TransactionList from '@/components/finances/TransactionList';

export default function FinancesScreen() {
    const insets = useSafeAreaInsets();
    const webTopInset = Platform.OS === "web" ? 20 : 0;

    return (
        <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Finances</Text>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <ExpenseCard />
                <MarketPriceList />
                <TransactionList />
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
        paddingHorizontal: 16,
        paddingBottom: 8,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
});
