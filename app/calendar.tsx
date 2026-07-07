import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/lib/LanguageContext';
import Colors from '@/constants/colors';

// Helper to determine season
function getSeason(month: number, t: any) {
  // Month is 0-indexed (0 = Jan, 11 = Dec)
  if (month >= 5 && month <= 9) { // June - Oct
    return {
      name: t.kharif,
      color: '#4CAF50',
      type: 'kharif',
      growing: 'Rice, Maize, Sorghum, Cotton, Groundnut',
      harvesting: 'Bajra, Pulses'
    };
  }
  if (month >= 10 || month <= 2) { // Nov - March
    return {
      name: t.rabi,
      color: '#2196F3',
      type: 'rabi',
      growing: 'Wheat, Barley, Mustard, Peas, Gram',
      harvesting: 'Rice, Maize'
    };
  }
  return { // April - May
    name: t.zaid,
    color: '#FFC107',
    type: 'zaid',
    growing: 'Cucumber, Watermelon, Muskmelon, Bitter Gourd',
    harvesting: 'Wheat'
  };
}

// Simple moon phase calculator (Approximate)
function getMoonPhase(date: Date, t: any) {
  const lp = 2551443;
  const now = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 20, 35, 0);
  const new_moon = new Date(1970, 0, 7, 20, 35, 0);
  const phase = ((now.getTime() - new_moon.getTime()) / 1000) % lp;
  const age = Math.floor(phase / ((24 * 3600)) + 1);

  if (age < 15) return { name: t.shuklaPaksha, icon: 'moon-waxing-crescent' };
  return { name: t.krishnaPaksha, icon: 'moon-waning-crescent' };
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const season = getSeason(month, t);
  const moonPhase = getMoonPhase(selectedDate, t);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const renderCalendar = () => {
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Header
    const header = weekDays.map((day, index) => (
      <Text key={index} style={styles.weekDayText}>{day.charAt(0)}</Text>
    ));

    // Empty slots
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <Pressable
          key={i}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isToday && styles.todayCell
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            isToday && styles.todayText
          ]}>
            {i}
          </Text>
          {isSelected && <View style={[styles.dot, { backgroundColor: season.color }]} />}
        </Pressable>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.weekHeader}>{header}</View>
        <View style={styles.daysGrid}>{days}</View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.primaryDark]}
        style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 20 : 10) }]}
      >
        <View style={styles.headerContent}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>{t.calendar}</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <Pressable onPress={prevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
          </Pressable>
          <Text style={styles.monthTitle}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <Pressable onPress={nextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={24} color={Colors.light.text} />
          </Pressable>
        </View>

        {/* Calendar Grid */}
        {renderCalendar()}

        {/* Info Cards */}
        <View style={styles.infoSection}>
          {/* Season Card */}
          <View style={[styles.infoCard, { borderLeftColor: season.color, borderLeftWidth: 4 }]}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="sprout" size={24} color={season.color} />
              <Text style={[styles.cardTitle, { color: season.color }]}>{season.name}</Text>
            </View>
            <Text style={styles.cardDesc}>
              <Text style={styles.bold}>{t.growing}:</Text> {season.growing}
            </Text>
            <Text style={styles.cardDesc}>
              <Text style={styles.bold}>{t.harvesting}:</Text> {season.harvesting}
            </Text>
          </View>

          {/* Panchang Card */}
          <View style={[styles.infoCard, { borderLeftColor: '#673AB7', borderLeftWidth: 4 }]}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name={moonPhase.icon as any} size={24} color="#673AB7" />
              <Text style={[styles.cardTitle, { color: '#673AB7' }]}>{t.panchang}</Text>
            </View>
            <Text style={styles.cardDesc}>
              {selectedDate.toDateString()}
            </Text>
            <Text style={styles.cardSubText}>
              {moonPhase.name}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  navBtn: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: Colors.light.text,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekDayText: {
    width: 40,
    textAlign: 'center',
    fontFamily: 'Nunito_600SemiBold',
    color: '#9E9E9E',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: Colors.light.primary,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  dayText: {
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.light.text,
  },
  selectedDayText: {
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
  },
  todayText: {
    color: Colors.light.primary,
    fontFamily: 'Nunito_700Bold',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 4,
  },
  infoSection: {
    gap: 16,
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  cardDesc: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.light.text,
  },
  bold: {
    fontFamily: 'Nunito_800ExtraBold',
  }
});
