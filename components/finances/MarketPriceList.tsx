import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { fetchMarketPrices, MarketPrice } from '@/lib/services/market';

export default function MarketPriceList() {
    const [prices, setPrices] = useState<MarketPrice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPrices = async () => {
            try {
                const data = await fetchMarketPrices(0, 15);
                setPrices(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadPrices();
    }, []);

    if (loading && prices.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Live Market Prices</Text>
                <View style={styles.center}>
                    <ActivityIndicator size="small" color={Colors.light.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Live Market Prices</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {prices.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cropName} numberOfLines={1}>{item.crop}</Text>
                        </View>

                        <Text style={styles.price}>₹{item.modalPrice}/q</Text>
                        <Text style={styles.market} numberOfLines={1}>{item.market}</Text>
                    </View>
                ))}
                {prices.length === 0 && !loading && (
                    <Text style={styles.emptyText}>No live prices available</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    scroll: {
        paddingHorizontal: 16,
        paddingRight: 8,
    },
    center: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
        marginLeft: 16,
        fontFamily: 'Nunito_600SemiBold',
    },
    card: {
        backgroundColor: '#fff',
        width: 140,
        padding: 12,
        borderRadius: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    cropName: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
    },
    trendBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.light.primary,
        marginBottom: 4,
    },
    market: {
        fontSize: 11,
        fontFamily: 'Nunito_600SemiBold',
        color: '#999',
    },
});
