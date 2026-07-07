import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, useWindowDimensions, Alert } from 'react-native';
import Colors from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/lib/CartContext';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

const MOCK_DEALS = [
    {
        id: 1,
        name: 'Organic Urea',
        price: 240,
        displayPrice: '₹240',
        oldPrice: '₹300',
        off: '20% OFF',
        img: 'https://media.istockphoto.com/id/1296785870/photo/urea-fertilizer-in-a-bowl-on-agricultural-field.jpg?s=1024x1024&w=is&k=20&c=qHora4g8I6jxEEd2c90-dpnpd16YA_MGIKPvq9y1aqM='
    },
    {
        id: 2,
        name: 'Drip Kit (50m)',
        price: 4500,
        displayPrice: '₹4500',
        oldPrice: '₹5500',
        off: '18% OFF',
        img: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=800&auto=format&fit=crop'
    },
    {
        id: 4,
        name: 'Manual Sprayer',
        price: 850,
        displayPrice: '₹850',
        oldPrice: '₹1200',
        off: '30% OFF',
        img: 'https://plus.unsplash.com/premium_photo-1661367673895-4c80ee00da5f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 3,
        name: 'Seed Pack (12)',
        price: 150,
        displayPrice: '₹150',
        oldPrice: '₹200',
        off: '25% OFF',
        img: 'https://plus.unsplash.com/premium_photo-1664301330786-b49b12038b67?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 5,
        name: 'Neem Oil (1L)',
        price: 420,
        displayPrice: '₹420',
        oldPrice: '₹499',
        off: '15% OFF',
        img: 'https://media.istockphoto.com/id/922033732/photo/medicinal-neem-leaves-with-essential-oil.jpg?s=1024x1024&w=is&k=20&c=OUeelwDfKYO5qPI5ru2fPdyZ2p5WIL4xrfZJLQTe0A4='
    },
    {
        id: 6,
        name: 'Soil PH Kit',
        price: 350,
        displayPrice: '₹350',
        oldPrice: '₹450',
        off: '22% OFF',
        img: 'https://media.istockphoto.com/id/1371960479/photo/soil-ph-meter-using-for-cultivation.jpg?s=1024x1024&w=is&k=20&c=uvUOXEOgQTHzyW8i2AzKKWnx5lxJCnMeX5liNimawtw='
    },
    {
        id: 7,
        name: 'Garden Pruner',
        price: 199,
        displayPrice: '₹199',
        oldPrice: '₹299',
        off: '33% OFF',
        img: 'https://plus.unsplash.com/premium_photo-1680322468906-d3ed1fb060d4?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 8,
        name: 'Coco Peat (5kg)',
        price: 299,
        displayPrice: '₹299',
        oldPrice: '₹399',
        off: '25% OFF',
        img: 'https://media.istockphoto.com/id/2180772614/photo/hands-holding-coco-peat.webp?a=1&b=1&s=612x612&w=0&k=20&c=IuRzFTvYJxLhIzUP4E5350wDvzJXGjX6cb8OPMm_aiQ='
    }
];

export default function DealsSection() {
    const { width } = useWindowDimensions();
    const { addToCart, itemCount } = useCart();
    const router = useRouter();

    // Calculate card width: (Total width - padding - gap) / items shown
    const cardWidth = (width - 32 - 12) / 2.2;

    const handleAddToCart = (deal: any) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        addToCart({
            id: deal.id,
            name: deal.name,
            price: deal.price,
            displayPrice: deal.displayPrice,
            img: deal.img
        });

        // Brief alert or toast would be better, but Alert for now
        // Alert.alert("Added!", `${deal.name} added to cart.`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Deals of the Day</Text>
                    {itemCount > 0 && (
                        <Pressable style={styles.cartBadge} onPress={() => router.push('/cart')}>
                            <Ionicons name="cart" size={16} color="#fff" />
                            <Text style={styles.badgeText}>{itemCount}</Text>
                        </Pressable>
                    )}
                </View>
                <Pressable onPress={() => router.push('/cart')}>
                    <Text style={styles.viewAll}>Go to Cart</Text>
                </Pressable>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={cardWidth + 12}
            >
                {MOCK_DEALS.map((deal) => (
                    <Pressable key={deal.id} style={[styles.card, { width: cardWidth }]}>
                        <Image source={{ uri: deal.img }} style={styles.image} />
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{deal.off}</Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.name} numberOfLines={1}>{deal.name}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>{deal.displayPrice}</Text>
                                <Text style={styles.oldPrice}>{deal.oldPrice}</Text>
                            </View>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.addButton,
                                    { backgroundColor: pressed ? '#E8F5E9' : '#F1F8E9' }
                                ]}
                                onPress={() => handleAddToCart(deal)}
                            >
                                <Text style={styles.addText}>ADD TO CART</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    cartBadge: {
        backgroundColor: Colors.light.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        gap: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Nunito_700Bold',
    },
    viewAll: {
        fontSize: 14,
        fontFamily: 'Nunito_600SemiBold',
        color: Colors.light.primary,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingRight: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
    },
    image: {
        width: '100%',
        height: 110,
        backgroundColor: '#f5f5f5',
    },
    tag: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#E65100',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 10,
        fontFamily: 'Nunito_700Bold',
        color: '#fff',
    },
    details: {
        padding: 10,
    },
    name: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
        marginBottom: 12,
    },
    price: {
        fontSize: 16,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.light.primary,
    },
    oldPrice: {
        fontSize: 12,
        fontFamily: 'Nunito_400Regular',
        color: '#999',
        textDecorationLine: 'line-through',
    },
    addButton: {
        backgroundColor: '#F1F8E9',
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    addText: {
        fontSize: 11,
        fontFamily: 'Nunito_700Bold',
        color: Colors.light.primary,
        letterSpacing: 0.5,
    },
});
