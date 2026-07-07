import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, TextInput, Platform, Modal, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "@/lib/LanguageContext";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const CATEGORIES = ["seeds", "fertilizer", "labour", "equipment", "transport", "other"] as const;

const CATEGORY_ICONS: Record<string, { name: string; color: string; bg: string }> = {
  seeds: { name: "seed", color: "#2E7D32", bg: "#E8F5E9" },
  fertilizer: { name: "flask", color: "#E65100", bg: "#FFF3E0" },
  labour: { name: "account-hard-hat", color: "#1565C0", bg: "#E3F2FD" },
  equipment: { name: "wrench", color: "#6A1B9A", bg: "#F3E5F5" },
  transport: { name: "truck", color: "#00695C", bg: "#E0F2F1" },
  other: { name: "dots-horizontal", color: "#757575", bg: "#F5F5F5" },
};

export default function ExpensesScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("seeds");
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = await AsyncStorage.getItem("expenses");
    if (data) setExpenses(JSON.parse(data));
  };

  const saveExpenses = async (list: Expense[]) => {
    await AsyncStorage.setItem("expenses", JSON.stringify(list));
    setExpenses(list);
  };

  const addExpense = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert("Required", "Please fill in all fields");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newExpense: Expense = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [newExpense, ...expenses];
    await saveExpenses(updated);
    setTitle("");
    setAmount("");
    setCategory("seeds");
    setShowModal(false);
  };

  const deleteExpense = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updated = expenses.filter((e) => e.id !== id);
    await saveExpenses(updated);
  };

  const total = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const renderItem = ({ item }: { item: Expense }) => {
    const catInfo = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.other;
    return (
      <View style={styles.expenseCard}>
        <View style={[styles.expenseIcon, { backgroundColor: catInfo.bg }]}>
          <MaterialCommunityIcons name={catInfo.name as any} size={22} color={catInfo.color} />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expenseDate}>{item.date}</Text>
        </View>
        <Text style={styles.expenseAmount}>-{item.amount.toLocaleString()}</Text>
        <Pressable
          onPress={() => deleteExpense(item.id)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.light.error} />
        </Pressable>
      </View>
    );
  };

  const getCategoryLabel = (cat: string) => {
    return (t as any)[cat] || cat;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.expenses}</Text>
        <Pressable
          onPress={() => setShowModal(true)}
          style={styles.addBtn}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>{t.totalExpenses}</Text>
        <Text style={styles.totalValue}>INR {total.toLocaleString()}</Text>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16),
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={expenses.length > 0}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="wallet-outline" size={44} color={Colors.light.textLight} />
            <Text style={styles.emptyText}>{t.noExpenses}</Text>
          </View>
        }
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.addExpense}</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </Pressable>
            </View>

            <Text style={styles.fieldLabel}>{t.title}</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="e.g. Urea Fertilizer"
              placeholderTextColor={Colors.light.textLight}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.fieldLabel}>{t.amount} (INR)</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="e.g. 500"
              placeholderTextColor={Colors.light.textLight}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.fieldLabel}>{t.category}</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const catInfo = CATEGORY_ICONS[cat] || CATEGORY_ICONS.other;
                return (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.categoryChipActive,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <MaterialCommunityIcons
                      name={catInfo.name as any}
                      size={16}
                      color={category === cat ? "#fff" : catInfo.color}
                    />
                    <Text style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextActive,
                    ]}>
                      {getCategoryLabel(cat)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
              onPress={addExpense}
            >
              <Text style={styles.saveBtnText}>{t.save}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  totalCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 28,
    fontFamily: "Nunito_800ExtraBold",
    color: "#fff",
  },
  expenseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  expenseIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.text,
  },
  expenseDate: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textLight,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.error,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  fieldInput: {
    backgroundColor: Colors.light.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.text,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.inputBg,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.text,
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  saveBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnText: {
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
});
