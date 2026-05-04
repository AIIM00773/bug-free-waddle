import { Conversation, useChat } from "@/Providers/VendorCustomerChat";
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, MessageSquareOff, MoreVertical, Send, ShieldCheck, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView,
    StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME = {
    primary: "#10B981",    // Emerald
    bg: "#022c2a",         // Deep Dark Green
    surface: "rgba(255, 255, 255, 0.05)",
    textMain: "#F3F4F6",
    textMuted: "#94A3B8",
    glass: "rgba(255, 255, 255, 0.08)",
    accentBorder: "rgba(16, 185, 129, 0.2)"
};

export default function UserConversationsPage() {
    const { conversations, activeConversation, messages, setActiveConversation, sendMessage, markAsRead } = useChat();
    const [modalVisible, setModalVisible] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    const handleSelectConversation = (conversation: Conversation) => {
        setActiveConversation(conversation);
        markAsRead(conversation.id);
        setModalVisible(true);
    };

    const handleSendMessage = async () => {
        if (messageInput.trim() && activeConversation) {
            await sendMessage(activeConversation.id, messageInput.trim());
            setMessageInput('');
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setActiveConversation(null);
        setMessageInput('');
    };

    const currentMessages = activeConversation ? messages[activeConversation.id] || [] : [];

    const renderItem = ({ item }: { item: Conversation }) => (
        <TouchableOpacity style={styles.convCard} onPress={() => handleSelectConversation(item)} activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
                <LinearGradient colors={[THEME.primary, '#059669']} style={styles.avatarCircle}>
                    <Text style={styles.avatarInitial}>{item.participantName.charAt(0)}</Text>
                </LinearGradient>
                <View style={styles.onlineDot} />
            </View>

            <View style={styles.convInfo}>
                <View style={styles.row}>
                    <Text style={styles.merchantName} numberOfLines={1}>{item.participantName}</Text>
                    <Text style={styles.timeText}>12:45 PM</Text> 
                </View>
                <View style={styles.row}>
                    <Text style={styles.lastMsg} numberOfLines={1}>
                        {item.lastMessage || "Establish connection..."}
                    </Text>
                    <ChevronRight size={16} color={THEME.primary} />
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderMessage = (item: any) => {
        const isMe = item.senderId === 'current_user';
        return (
            <View style={[styles.messageWrapper, isMe ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
                <View style={[
                    styles.messageBubble,
                    isMe ? styles.sentBubble : styles.receivedBubble
                ]}>
                    <Text style={[styles.messageText, isMe ? styles.sentText : styles.receivedText]}>
                        {item.content}
                    </Text>
                </View>
                <Text style={styles.messageTime}>
                    {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>InBox</Text>
                        <View style={styles.headerSubRow}>
                            <View style={styles.activePulse} />
                            <Text style={styles.subtitle}>{conversations.length} chats </Text>
                        </View>
                    </View>
                </View>

                {conversations.length > 0 ? (
                    <FlatList
                        data={conversations}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconCircle}>
                            <MessageSquareOff size={32} color={THEME.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>NO ACTIVE SIGNALS</Text>
                        <Text style={styles.emptySub}>Initialize a discussion with a vendor to begin transacting.</Text>
                    </View>
                )}

                <Modal visible={modalVisible} animationType="slide" presentationStyle="fullScreen">
                    <View style={styles.modalContainer}>
                        <LinearGradient colors={['#033e3b', '#022c2a']} style={styles.modalHeader}>
                            <SafeAreaView edges={['top']} style={styles.modalHeaderInner}>
                                <TouchableOpacity onPress={handleCloseModal} style={styles.iconButton}>
                                    <X size={20} color={THEME.textMain} />
                                </TouchableOpacity>
                                
                                <View style={styles.modalHeaderCenter}>
                                    <Text style={styles.modalTitle}>{activeConversation?.participantName.toUpperCase()}</Text>
                                    <View style={styles.statusRow}>
                                        <View style={styles.statusDot} />
                                        <Text style={styles.modalSubtitle}>Link Active</Text>
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.iconButton}>
                                    <MoreVertical size={20} color={THEME.textMain} />
                                </TouchableOpacity>
                            </SafeAreaView>
                        </LinearGradient>

                        <ScrollView 
                            style={styles.chatArea} 
                            contentContainerStyle={styles.chatContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.encryptionNotice}>
                                <ShieldCheck size={12} color={THEME.primary} />
                                <Text style={styles.encryptionText}>END-TO-END ENCRYPTED CHANNEL</Text>
                            </View>

                            {currentMessages.map((msg, idx) => (
                                <View key={msg.id || idx}>{renderMessage(msg)}</View>
                            ))}
                        </ScrollView>

                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            <View style={styles.inputSection}>
                                <View style={styles.inputInner}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Transmit message..."
                                        placeholderTextColor={THEME.textMuted}
                                        value={messageInput}
                                        onChangeText={setMessageInput}
                                        multiline
                                    />
                                    <TouchableOpacity 
                                        onPress={handleSendMessage}
                                        disabled={!messageInput.trim()}
                                        style={[styles.sendCircle, !messageInput.trim() && styles.sendDisabled]}
                                    >
                                        <Send size={18} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.bg },
    header: { paddingHorizontal: 25, paddingVertical: 20 },
    title: { fontSize: 24, fontWeight: '900', color: THEME.textMain, letterSpacing: 2 },
    headerSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 8 },
    activePulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.primary },
    subtitle: { fontSize: 11, color: THEME.primary, fontWeight: '800', letterSpacing: 1 },

    listContent: { paddingHorizontal: 20, paddingBottom: 40 },
    convCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 16, 
        backgroundColor: THEME.surface,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.03)"
    },
    avatarContainer: { position: 'relative', marginRight: 15 },
    avatarCircle: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarInitial: { fontSize: 20, fontWeight: '900', color: '#000' },
    onlineDot: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: THEME.primary,
        borderWidth: 3,
        borderColor: THEME.bg
    },
    convInfo: { flex: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    merchantName: { fontSize: 16, fontWeight: '800', color: THEME.textMain },
    timeText: { fontSize: 11, color: THEME.textMuted, fontWeight: '600' },
    lastMsg: { fontSize: 13, color: THEME.textMuted, fontWeight: '500', flex: 1, marginRight: 10 },

    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyIconCircle: { width: 80, height: 80, borderRadius: 30, backgroundColor: 'rgba(16, 185, 129, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: THEME.accentBorder },
    emptyTitle: { fontSize: 18, fontWeight: '900', color: THEME.textMain, letterSpacing: 1 },
    emptySub: { fontSize: 13, color: THEME.textMuted, textAlign: 'center', marginTop: 10, lineHeight: 20 },

    modalContainer: { flex: 1, backgroundColor: THEME.bg },
    modalHeader: { borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
    modalHeaderInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 },
    modalHeaderCenter: { flex: 1, alignItems: 'center' },
    modalTitle: { fontSize: 15, fontWeight: '900', color: THEME.textMain, letterSpacing: 1 },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: THEME.primary, marginRight: 6 },
    modalSubtitle: { fontSize: 10, color: THEME.primary, fontWeight: '800', textTransform: 'uppercase' },
    iconButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: THEME.glass, justifyContent: 'center', alignItems: 'center' },

    chatArea: { flex: 1 },
    chatContent: { padding: 20 },
    encryptionNotice: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16, 185, 129, 0.05)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, marginBottom: 25 },
    encryptionText: { fontSize: 9, color: THEME.primary, fontWeight: '800' },

    messageWrapper: { marginBottom: 18, width: '100%' },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        maxWidth: '82%',
    },
    sentBubble: {
        backgroundColor: THEME.primary,
        borderBottomRightRadius: 4
    },
    receivedBubble: {
        backgroundColor: THEME.surface,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)"
    },
    messageText: { fontSize: 15, lineHeight: 22 },
    sentText: { color: '#000', fontWeight: '700' },
    receivedText: { color: THEME.textMain },
    messageTime: { fontSize: 9, color: THEME.textMuted, marginTop: 5, marginHorizontal: 4, fontWeight: '600' },

    inputSection: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 35 : 20,
        backgroundColor: THEME.bg,
        borderTopWidth: 1,
        borderColor: "rgba(255,255,255,0.05)"
    },
    inputInner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.surface,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)"
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: THEME.textMain,
        maxHeight: 100,
        paddingTop: 0
    },
    sendCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: THEME.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    },
    sendDisabled: { backgroundColor: THEME.textMuted, opacity: 0.5 }
});