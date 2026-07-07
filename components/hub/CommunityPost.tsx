import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Linking, Share, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

interface CommunityPostProps {
    id: string;
    user: string;
    time: string;
    avatar: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    url: string;
}

export default function CommunityPost({ id, user, time, avatar, content, image, likes, comments, url }: CommunityPostProps) {
    const [liked, setLiked] = useState(false);
    const [localLikes, setLocalLikes] = useState(likes);

    const handleLike = () => {
        if (liked) {
            setLocalLikes(prev => prev - 1);
        } else {
            setLocalLikes(prev => prev + 1);
        }
        setLiked(!liked);
    };

    const handleComment = () => {
        Linking.openURL(url);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${content}\n\nRead more on r/IndiaHomeStead: ${url}`,
                url: url, // iOS only
                title: 'Check out this post on Uzhavan AI',
            });
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <View>
                    <Text style={styles.userName}>{user}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
                <Pressable style={styles.moreBtn} onPress={handleComment}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
                </Pressable>
            </View>

            <Text style={styles.content}>{content}</Text>

            {image && (
                <Image source={{ uri: image }} style={styles.postImage} />
            )}

            <View style={styles.footer}>
                <Pressable style={styles.action} onPress={handleLike}>
                    <Ionicons
                        name={liked ? "heart" : "heart-outline"}
                        size={22}
                        color={liked ? "#e74c3c" : "#666"}
                    />
                    <Text style={[styles.actionText, liked && { color: "#e74c3c" }]}>{localLikes}</Text>
                </Pressable>
                <Pressable style={styles.action} onPress={handleComment}>
                    <Ionicons name="chatbubble-outline" size={20} color="#666" />
                    <Text style={styles.actionText}>{comments}</Text>
                </Pressable>
                <Pressable style={styles.action} onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={20} color="#666" />
                    <Text style={styles.actionText}>Share</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: 12,
        padding: 16,
        borderRadius: 16, // Rounded corners for modern feed look
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#eee',
    },
    userName: {
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
        color: '#333',
    },
    time: {
        fontSize: 12,
        fontFamily: 'Nunito_400Regular',
        color: '#999',
    },
    moreBtn: {
        marginLeft: 'auto',
        padding: 4,
    },
    content: {
        fontSize: 14,
        fontFamily: 'Nunito_400Regular',
        color: '#333',
        lineHeight: 20,
        marginBottom: 12,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: '#f0f0f0',
    },
    footer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
        gap: 24,
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 12,
        fontFamily: 'Nunito_600SemiBold',
        color: '#666',
    },
});
