import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

interface FertilizerItem {
    brand: string;
    qty: number; // in kg
    type: 'Solid' | 'Liquid';
}

const MOCK_FERTILIZERS: Record<string, FertilizerItem[]> = {
    'Vegetative': [
        { brand: 'Urea (46-0-0)', qty: 45, type: 'Solid' },
        { brand: 'DAP (18-46-0)', qty: 25, type: 'Solid' },
    ],
    'Fruiting': [
        { brand: 'Potash (MOP)', qty: 30, type: 'Solid' },
        { brand: 'NPK 19-19-19', qty: 10, type: 'Liquid' },
    ],
    'Harvest': [
        { brand: 'Boron', qty: 2, type: 'Solid' },
    ]
};

export default function FertilizerCalculator() {
    const [selectedStage, setSelectedStage] = useState<'Harvest' | 'Vegetative' | 'Fruiting'>('Vegetative');
    const [displayInBags, setDisplayInBags] = useState(false);
    const [viewMode, setViewMode] = useState<'Stage' | 'Total'>('Stage');

    const acres = "3.71";
    const plantedDate = "15 Oct 2025";
    const targetYield = "2500"; // kgs

    const convertQty = (qty: number) => {
        if (displayInBags) {
            return `${(qty / 50).toFixed(1)} bag${qty / 50 !== 1 ? 's' : ''}`;
        }
        return `${qty} kgs`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Fertilizer Calculator</Text>
                <Pressable style={styles.editBtn}>
                    <Text style={styles.editBtnText}>Edit twin info</Text>
                </Pressable>
            </View>

            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryVal}>{acres}</Text>
                        <Text style={styles.summaryLabel}>Field Size (Acres)</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryVal}>{targetYield}</Text>
                        <Text style={styles.summaryLabel}>Target Yield (kg)</Text>
                    </View>
                </View>
                <View style={styles.dateBox}>
                    <Ionicons name="calendar-outline" size={14} color="#666" />
                    <Text style={styles.dateText}>Planted on: {plantedDate}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Stages to remind</Text>
            <View style={styles.chipRow}>
                {(['Vegetative', 'Fruiting', 'Harvest'] as const).map(stage => (
                    <Pressable
                        key={stage}
                        onPress={() => setSelectedStage(stage)}
                        style={[styles.chip, selectedStage === stage && styles.activeChip]}
                    >
                        <Text style={[styles.chipText, selectedStage === stage && styles.activeChipText]}>{stage}</Text>
                    </Pressable>
                ))}
            </View>

            <View style={styles.controlsRow}>
                <View style={styles.toggleTabs}>
                    <Pressable
                        onPress={() => setViewMode('Stage')}
                        style={[styles.tab, viewMode === 'Stage' && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, viewMode === 'Stage' && styles.activeTabText]}>Crop Stage</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setViewMode('Total')}
                        style={[styles.tab, viewMode === 'Total' && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, viewMode === 'Total' && styles.activeTabText]}>Total</Text>
                    </Pressable>
                </View>

                <View style={styles.bagToggle}>
                    <Text style={styles.bagLabel}>Display in bags</Text>
                    <Switch
                        value={displayInBags}
                        onValueChange={setDisplayInBags}
                        trackColor={{ true: Colors.light.primary, false: '#ccc' }}
                    />
                </View>
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.listHeader}>
                    {selectedStage} Stage Recommendations
                </Text>
                {MOCK_FERTILIZERS[selectedStage].map((item, index) => (
                    <View key={index} style={styles.fertilizerItem}>
                        <View style={styles.fInfo}>
                            <Text style={styles.fBrand}>{item.brand}</Text>
                            <Text style={styles.fType}>{item.type}</Text>
                        </View>
                        <View style={styles.fQtyBox}>
                            <Text style={styles.fQty}>{convertQty(item.qty * parseFloat(acres))}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    editBtn: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    editBtnText: {
        fontSize: 12,
        fontFamily: 'Nunito_700Bold',
        color: Colors.light.primary,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryVal: {
        fontSize: 20,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    summaryLabel: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#999',
    },
    separator: {
        width: 1,
        height: 30,
        backgroundColor: '#eee',
    },
    dateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
        marginBottom: 12,
    },
    chipRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
    },
    activeChip: {
        backgroundColor: Colors.light.primary,
    },
    chipText: {
        fontSize: 13,
        fontFamily: 'Nunito_700Bold',
        color: '#666',
    },
    activeChipText: {
        color: '#fff',
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    toggleTabs: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 2,
    },
    tab: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: '#fff',
    },
    tabText: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#888',
    },
    activeTabText: {
        color: '#333',
        fontFamily: 'Nunito_700Bold',
    },
    bagToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bagLabel: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
    },
    listContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    listHeader: {
        fontSize: 14,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        marginBottom: 16,
    },
    fertilizerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    fInfo: {
        flex: 1,
    },
    fBrand: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
    },
    fType: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#999',
    },
    fQtyBox: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    fQty: {
        color: '#2E7D32',
        fontSize: 13,
        fontFamily: 'Nunito_800ExtraBold',
    },
});
