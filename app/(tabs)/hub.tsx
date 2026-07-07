import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, RefreshControl, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

import AIChatPreview from '@/components/hub/AIChatPreview';
import TrendingTopics from '@/components/hub/TrendingTopics';
import CommunityPost from '@/components/hub/CommunityPost';

import { fetchRedditPosts, RedditPost } from '@/lib/services/reddit';

export default function HubScreen() {
    const insets = useSafeAreaInsets();
    const webTopInset = Platform.OS === "web" ? 20 : 0;

    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState<RedditPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    const loadPosts = async (topic?: string | null) => {
        setLoading(true);
        const redditPosts = await fetchRedditPosts(topic || undefined);
        setPosts(redditPosts);
        setLoading(false);
    };

    React.useEffect(() => {
        loadPosts(selectedTopic);
    }, [selectedTopic]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadPosts(selectedTopic);
        setRefreshing(false);
    }, [selectedTopic]);

    const handleTopicPress = (topic: string | null) => {
        setSelectedTopic(topic);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Community Hub</Text>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.primary} />
                }
            >
                <AIChatPreview />

                <TrendingTopics
                    selectedTopic={selectedTopic}
                    onTopicPress={handleTopicPress}
                />

                <View style={styles.feedLabelContainer}>
                    <Text style={styles.feedLabel}>
                        {selectedTopic ? `${selectedTopic} Discussions` : 'r/IndiaHomeStead Discussions'}
                    </Text>
                </View>

                {loading ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Nunito_400Regular', color: '#666' }}>Loading conversations...</Text>
                    </View>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <CommunityPost key={post.id} {...post} />
                    ))
                ) : (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Nunito_400Regular', color: '#666', textAlign: 'center' }}>
                            {selectedTopic
                                ? `No results found for "${selectedTopic}". Try another topic.`
                                : "Could not load discussions. Please check your internet connection and try refreshing."}
                        </Text>
                    </View>
                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
    feedLabelContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    feedLabel: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#333',
    },
});
