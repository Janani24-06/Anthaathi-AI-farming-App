import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Colors from '@/constants/colors';

const TOPICS = [
    '#OrganicFarming',
    '#PaddyPrices',
    '#MonsoonUpdate',
    '#FertilizerSubsidy',
    '#NewTractor',
    '#DairyFarming'
];

interface TrendingTopicsProps {
    selectedTopic: string | null;
    onTopicPress: (topic: string | null) => void;
}

export default function TrendingTopics({ selectedTopic, onTopicPress }: TrendingTopicsProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Trending Topics</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Pressable
                    onPress={() => onTopicPress?.(null)}
                    style={[styles.tag, !selectedTopic && styles.activeTag]}
                >
                    <Text style={[styles.tagText, !selectedTopic && styles.activeTagText]}>All</Text>
                </Pressable>
                {TOPICS.map((topic, index) => (
                    <Pressable
                        key={index}
                        style={[styles.tag, selectedTopic === topic && styles.activeTag]}
                        onPress={() => onTopicPress?.(topic)}
                    >
                        <Text style={[styles.tagText, selectedTopic === topic && styles.activeTagText]}>{topic}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    scroll: {
        paddingHorizontal: 16,
        paddingRight: 8,
    },
    tag: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    tagText: {
        fontSize: 12,
        fontFamily: 'Nunito_700Bold',
        color: Colors.light.primary,
    },
    activeTag: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    activeTagText: {
        color: '#fff',
    },
});
