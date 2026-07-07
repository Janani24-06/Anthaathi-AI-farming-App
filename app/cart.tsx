import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useCart } from '@/lib/CartContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function CartScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
    const [step, setStep] = useState<'cart' | 'payment' | 'success'>('cart');
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setStep('payment');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handlePlaceOrder = () => {
        if (!selectedMethod) {
            Alert.alert("Payment Method", "Please select a payment method to proceed.");
            return;
        }
        setStep('success');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // In a real app, clearCart would happen after API success
        setTimeout(() => clearCart(), 1500);
    };

    const renderCartItem = (item: any) => (
        <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.displayPrice}</Text>
                <View style={styles.qtyContainer}>
                    <Pressable onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>
                        <Ionicons name="remove" size={20} color={Colors.light.primary} />
                    </Pressable>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <Pressable onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>
                        <Ionicons name="add" size={20} color={Colors.light.primary} />
                    </Pressable>
                    <Pressable onPress={() => removeFromCart(item.id)} style={styles.deleteBtn}>
                        <Ionicons name="trash-outline" size={18} color="#FF5252" />
                    </Pressable>
                </View>
            </View>
        </View>
    );

    const renderPaymentMethod = (id: string, name: string, icon: any) => (
        <Pressable
            key={id}
            onPress={() => setSelectedMethod(id)}
            style={[styles.paymentOption, selectedMethod === id && styles.selectedPayment]}
        >
            <View style={styles.paymentIconContainer}>
                <Ionicons name={icon} size={24} color={selectedMethod === id ? Colors.light.primary : '#666'} />
            </View>
            <Text style={[styles.paymentName, selectedMethod === id && styles.selectedPaymentText]}>{name}</Text>
            {selectedMethod === id && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} />
            )}
        </Pressable>
    );

    if (step === 'success') {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.successContainer}>
                    <LinearGradient
                        colors={[Colors.light.primary, '#66BB6A']}
                        style={styles.successIcon}
                    >
                        <Ionicons name="checkmark" size={60} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.successTitle}>Order Placed!</Text>
                    <Text style={styles.successMsg}>Your farming supplies are on their way. You will receive an update shortly.</Text>
                    <Pressable style={styles.backHomeBtn} onPress={() => router.replace('/(tabs)/home')}>
                        <Text style={styles.backHomeText}>Back to Home</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => step === 'payment' ? setStep('cart') : router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>{step === 'cart' ? 'My Cart' : 'Checkout'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {step === 'cart' ? (
                    <>
                        {cart.length > 0 ? (
                            cart.map(renderCartItem)
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="cart-outline" size={80} color="#ccc" />
                                <Text style={styles.emptyText}>Your cart is empty</Text>
                                <Pressable onPress={() => router.back()} style={styles.browseBtn}>
                                    <Text style={styles.browseText}>Browse Deals</Text>
                                </Pressable>
                            </View>
                        )}
                    </>
                ) : (
                    <View style={styles.paymentContainer}>
                        <Text style={styles.sectionTitle}>Select Payment Method</Text>
                        {renderPaymentMethod('upi', 'UPI / GPay / PhonePe', 'qr-code-outline')}
                        {renderPaymentMethod('card', 'Credit / Debit Card', 'card-outline')}
                        {renderPaymentMethod('cod', 'Cash on Delivery', 'cash-outline')}

                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Bill Details</Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Items Total</Text>
                                <Text style={styles.summaryValue}>₹{totalAmount}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                                <Text style={styles.summaryValue}>₹40</Text>
                            </View>
                            <View style={[styles.summaryRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Grand Total</Text>
                                <Text style={styles.totalValue}>₹{totalAmount + 40}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {cart.length > 0 && (
                <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                    <View style={styles.footerInfo}>
                        <Text style={styles.footerLabel}>Total Amount</Text>
                        <Text style={styles.footerAmount}>₹{totalAmount + (step === 'payment' ? 40 : 0)}</Text>
                    </View>
                    <Pressable
                        style={styles.actionBtn}
                        onPress={step === 'cart' ? handleCheckout : handlePlaceOrder}
                    >
                        <Text style={styles.actionBtnText}>
                            {step === 'cart' ? 'Proceed to Checkout' : 'Place Order'}
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    scrollContent: {
        padding: 20,
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
    },
    itemPrice: {
        fontSize: 15,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.light.primary,
        marginTop: 4,
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        marginHorizontal: 12,
        fontSize: 15,
        fontFamily: 'Nunito_700Bold',
    },
    deleteBtn: {
        marginLeft: 'auto',
        padding: 5,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'Nunito_600SemiBold',
        color: '#999',
        marginTop: 20,
    },
    browseBtn: {
        marginTop: 30,
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    browseText: {
        color: '#fff',
        fontFamily: 'Nunito_700Bold',
    },
    footer: {
        backgroundColor: '#fff',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    footerInfo: {
        flex: 1,
    },
    footerLabel: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
    },
    footerAmount: {
        fontSize: 22,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    actionBtn: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 12,
        flex: 1.5,
        alignItems: 'center',
    },
    actionBtnText: {
        color: '#fff',
        fontFamily: 'Nunito_700Bold',
        fontSize: 16,
    },
    paymentContainer: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        marginBottom: 8,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        gap: 15,
    },
    selectedPayment: {
        borderColor: Colors.light.primary,
        backgroundColor: '#F1F8E9',
    },
    paymentIconContainer: {
        width: 40,
        alignItems: 'center',
    },
    paymentName: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Nunito_600SemiBold',
    },
    selectedPaymentText: {
        color: Colors.light.primary,
        fontFamily: 'Nunito_700Bold',
    },
    summaryBox: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    summaryTitle: {
        fontSize: 16,
        fontFamily: 'Nunito_800ExtraBold',
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        color: '#666',
        fontFamily: 'Nunito_600SemiBold',
    },
    summaryValue: {
        fontFamily: 'Nunito_700Bold',
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 16,
        fontFamily: 'Nunito_800ExtraBold',
    },
    totalValue: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: Colors.light.primary,
    },
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    successTitle: {
        fontSize: 28,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        marginBottom: 15,
    },
    successMsg: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
        lineHeight: 24,
        marginBottom: 40,
    },
    backHomeBtn: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
    },
    backHomeText: {
        color: '#fff',
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
    },
});
