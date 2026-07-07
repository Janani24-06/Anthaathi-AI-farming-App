import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Platform, KeyboardAvoidingView } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLanguage } from "@/lib/LanguageContext";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

import { getChatResponse, ChatMessage } from "@/lib/services/chat";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I am UZHAVAN, your AI farming assistant. Ask me anything about crops, soil, weather, pest management, or farming techniques.",
      isUser: false,
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: Date.now(),
    };

    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    const userText = inputText.trim();
    setInputText("");
    setIsTyping(true);

    try {
      // Convert history for Gemini (excluding the welcome message id "welcome" if needed, but Gemini handles it well)
      const history: ChatMessage[] = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.isUser ? "user" : "model",
          parts: [{ text: m.text }]
        }));

      const aiResponse = await getChatResponse(userText, history);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages([...currentMessages, botMsg]);
    } catch (error: any) {
      console.error(error);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error?.message || "Connection failed. Please check your data or try again later."}`,
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages([...currentMessages, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.isUser ? styles.userBubble : styles.botBubble,
    ]}>
      {!item.isUser && (
        <View style={styles.botAvatar}>
          <MaterialCommunityIcons name="robot" size={18} color={Colors.light.primary} />
        </View>
      )}
      <View style={[
        styles.bubbleContent,
        item.isUser ? styles.userBubbleContent : styles.botBubbleContent,
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.botText,
        ]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <View style={styles.headerAvatar}>
              <MaterialCommunityIcons name="robot" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>{t.aiChat}</Text>
              <Text style={styles.headerSub}>AI Farming Assistant</Text>
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={[...messages].reverse()}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            isTyping ? (
              <View style={[styles.messageBubble, styles.botBubble]}>
                <View style={styles.botAvatar}>
                  <MaterialCommunityIcons name="robot" size={18} color={Colors.light.primary} />
                </View>
                <View style={[styles.bubbleContent, styles.botBubbleContent]}>
                  <View style={styles.typingDots}>
                    <View style={[styles.dot, { opacity: 0.4 }]} />
                    <View style={[styles.dot, { opacity: 0.7 }]} />
                    <View style={[styles.dot, { opacity: 1 }]} />
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        <View style={[
          styles.inputArea,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 8 },
        ]}>
          <TextInput
            style={styles.textInput}
            placeholder={t.typeMessage}
            placeholderTextColor={Colors.light.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              !inputText.trim() && styles.sendBtnDisabled,
              { transform: [{ scale: pressed ? 0.9 : 1 }] },
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubble: {
    flexDirection: "row",
    marginBottom: 12,
    maxWidth: "85%",
  },
  userBubble: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  botBubble: {
    alignSelf: "flex-start",
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 2,
  },
  bubbleContent: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "90%",
  },
  userBubbleContent: {
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  botBubbleContent: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    lineHeight: 22,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: Colors.light.text,
  },
  typingDots: {
    flexDirection: "row",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.light.inputBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.light.textLight,
  },
});
