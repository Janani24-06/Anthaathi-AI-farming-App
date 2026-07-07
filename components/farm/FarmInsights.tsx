import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const screenWidth = Dimensions.get('window').width;

interface InsightTabProps {
    data: number[];
    labels: string[];
    color: string;
}

const Chart = ({ data, labels, color }: InsightTabProps) => (
    <View style={styles.chartContainer}>
        <LineChart
            data={{
                labels,
                datasets: [{ data }]
            }}
            width={screenWidth - 64}
            height={180}
            chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 2,
                color: (opacity = 1) => color,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: color
                }
            }}
            bezier
            style={styles.chart}
        />
    </View>
);

export default function FarmInsights() {
    const [activeTab, setActiveTab] = useState<'soil' | 'veg' | 'weather'>('soil');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'soil':
                return (
                    <View>
                        <Chart
                            data={[0.15, 0.18, 0.14, 0.13, 0.16, 0.13]}
                            labels={['10am', '12pm', '2pm', '4pm', '6pm', '8pm']}
                            color="#2E7D32"
                        />
                        <View style={styles.tabMetrics}>
                            <View style={styles.conditionRow}>
                                <Text style={styles.conditionLabel}>Condition:</Text>
                                <View style={[styles.conditionBadge, { backgroundColor: '#FFF3E0' }]}>
                                    <Text style={[styles.conditionText, { color: '#E65100' }]}>Alert ⚠️</Text>
                                </View>
                            </View>
                            <Text style={styles.insightText}>
                                Soil moisture has dropped by 15% in the last 4 hours. High evaporation detected due to rising temperatures.
                            </Text>
                            <View style={styles.metricGrid}>
                                <View style={styles.metricItem}>
                                    <Text style={styles.mValue}>0.13 m³/m³</Text>
                                    <Text style={styles.mLabel}>Moisture</Text>
                                </View>
                                <View style={styles.metricItem}>
                                    <Text style={styles.mValue}>0.01</Text>
                                    <Text style={styles.mLabel}>Temp Gradient</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            case 'veg':
                return (
                    <View>
                        <Chart
                            data={[0.75, 0.78, 0.82, 0.85, 0.84, 0.85]}
                            labels={['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']}
                            color="#4CAF50"
                        />
                        <View style={styles.tabMetrics}>
                            <Text style={styles.insightText}>
                                Normalized Difference Vegetation Index (NDVI) shows stable growth. Your crop is in the peak vegetative stage.
                            </Text>
                        </View>
                    </View>
                );
            case 'weather':
                return (
                    <View>
                        <Chart
                            data={[28, 30, 32, 31, 29, 27]}
                            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                            color="#2196F3"
                        />
                        <View style={styles.tabMetrics}>
                            <Text style={styles.insightText}>
                                Average weekly temperature is 29.5°C. Low chance of precipitation for the next 3 days.
                            </Text>
                        </View>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Farm Insights Today</Text>
                <Text style={styles.subtitle}>Track Soil, Weather, and Crop Growth in Real-Time</Text>
            </View>

            <View style={styles.tabBar}>
                <Pressable
                    onPress={() => setActiveTab('soil')}
                    style={[styles.tab, activeTab === 'soil' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, activeTab === 'soil' && styles.activeTabText]}>Soil Health</Text>
                </Pressable>
                <Pressable
                    onPress={() => setActiveTab('veg')}
                    style={[styles.tab, activeTab === 'veg' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, activeTab === 'veg' && styles.activeTabText]}>Vegetation</Text>
                </Pressable>
                <Pressable
                    onPress={() => setActiveTab('weather')}
                    style={[styles.tab, activeTab === 'weather' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, activeTab === 'weather' && styles.activeTabText]}>Weather</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                {renderTabContent()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
        marginTop: 2,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#888',
    },
    activeTabText: {
        color: Colors.light.primary,
        fontFamily: 'Nunito_700Bold',
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    chart: {
        borderRadius: 16,
    },
    tabMetrics: {
        marginTop: 12,
    },
    conditionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    conditionLabel: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
    },
    conditionBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    conditionText: {
        fontSize: 12,
        fontFamily: 'Nunito_800ExtraBold',
    },
    insightText: {
        fontSize: 13,
        fontFamily: 'Nunito_500Medium',
        color: '#666',
        lineHeight: 18,
        marginBottom: 16,
    },
    metricGrid: {
        flexDirection: 'row',
        gap: 20,
    },
    metricItem: {
        flex: 1,
    },
    mValue: {
        fontSize: 16,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    mLabel: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#999',
    },
});
