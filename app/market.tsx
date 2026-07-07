import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, TextInput, Platform, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/LanguageContext";
import Colors from "@/constants/colors";
import { fetchMarketPrices, MarketPrice } from "@/lib/services/market";

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const { data: prices = [], isLoading, error, refetch } = useQuery({
    queryKey: ['marketPrices'],
    queryFn: () => fetchMarketPrices(),
  });

  const filtered = useMemo(() => {
    if (!prices) return [];
    if (!search.trim()) return prices;
    const q = search.toLowerCase();
    return prices.filter(
      (p) => p.crop.toLowerCase().includes(q) || p.market.toLowerCase().includes(q)
    );
  }, [search, prices]);

  const renderItem = ({ item }: { item: MarketPrice }) => (
    <View style={styles.priceCard}>
      <View style={styles.priceHeader}>
        <View style={styles.cropBadge}>
          <Ionicons name="leaf" size={14} color={Colors.light.primary} />
        </View>
        <View style={styles.cropInfo}>
          <Text style={styles.cropName}>{item.crop}</Text>
          <Text style={styles.marketName}>{item.market}</Text>
        </View>
      </View>
      <View style={styles.priceRow}>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Min</Text>
          <Text style={styles.priceValue}>{item.minPrice}</Text>
        </View>
        <View style={styles.priceDivider} />
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Modal</Text>
          <Text style={[styles.priceValue, styles.modalPrice]}>{item.modalPrice}</Text>
        </View>
        <View style={styles.priceDivider} />
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Max</Text>
          <Text style={styles.priceValue}>{item.maxPrice}</Text>
        </View>
      </View>
      <Text style={styles.perUnit}>{t.pricePerQuintal} (INR)</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.marketPrices}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={20} color={Colors.light.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder={t.searchCrop}
          placeholderTextColor={Colors.light.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color={Colors.light.textLight} />
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Fetching live prices...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color="#D32F2F" />
          <Text style={styles.errorText}>Failed to load prices</Text>
          <Pressable onPress={() => refetch()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16),
          }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={filtered.length > 0}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="search" size={40} color={Colors.light.textLight} />
              <Text style={styles.emptyText}>{t.noResults}</Text>
            </View>
          }
          ListHeaderComponent={
            <View style={styles.apiNote}>
              <Ionicons name="cloud-done" size={16} color={Colors.light.primary} />
              <Text style={styles.apiNoteText}>Live data from AGMARKNET (Mock)</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.text,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.light.textSecondary,
  },
  errorText: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.light.text,
    fontSize: 16,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
  },
  priceCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  priceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  cropBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  marketName: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceCol: {
    flex: 1,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textLight,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  modalPrice: {
    color: Colors.light.primary,
  },
  priceDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.light.border,
  },
  perUnit: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textLight,
    textAlign: "center",
    marginTop: 10,
  },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.textSecondary,
  },
  apiNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  apiNoteText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.primary,
  },
});
