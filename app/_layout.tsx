import "@/lib/firebase"; // Initialize Firebase early
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { LanguageProvider } from "@/lib/LanguageContext";
import { AuthProvider } from "@/lib/AuthContext";
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="language" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="weather" />
      <Stack.Screen name="pest" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="market" />
      <Stack.Screen name="expenses" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}

import { CartProvider } from "@/lib/CartContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <AuthProvider>
              <LanguageProvider>
                <CartProvider>
                  <StatusBar style="dark" />
                  <RootLayoutNav />
                </CartProvider>
              </LanguageProvider>
            </AuthProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
