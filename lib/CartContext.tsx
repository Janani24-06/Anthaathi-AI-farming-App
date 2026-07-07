import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CartItem = {
    id: number;
    name: string;
    price: number; // Numeric price for calculations
    displayPrice: string; // Formatting like ₹240
    img: string;
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, delta: number) => void;
    clearCart: () => void;
    totalAmount: number;
    itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from storage
    useEffect(() => {
        const loadCart = async () => {
            try {
                const savedCart = await AsyncStorage.getItem('shopping_cart');
                if (savedCart) {
                    setCart(JSON.parse(savedCart));
                }
            } catch (e) {
                console.error('Failed to load cart', e);
            }
        };
        loadCart();
    }, []);

    // Save cart to storage
    useEffect(() => {
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem('shopping_cart', JSON.stringify(cart));
            } catch (e) {
                console.error('Failed to save cart', e);
            }
        };
        saveCart();
    }, [cart]);

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const clearCart = () => setCart([]);

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalAmount,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
