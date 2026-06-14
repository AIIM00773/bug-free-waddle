import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Users, Hash, Shield, Search, Circle, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../Providers.tsx/AdminAuthAndProfileContext';
// import type{ Message, ChatRoom } from '../Providers.tsx/AdminCommsContext';

import { useOperationsChat } from '../Providers.tsx/AdminCommsContext';

export default function AdminChatWorkspaceView() {
  const { adminUser } = useAdminAuth();
  const {
    rooms,
    activeRoomId,
    setActiveRoomId,
    roomMessages,
    sendMessage,
    unreadCounts,
    isConnecting
  } = useOperationsChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract array structures safely out of localized dictionary contexts
  const currentMessages = useMemo(() => {
    return roomMessages[activeRoomId] || [];
  }, [roomMessages, activeRoomId]);

  // Efficient room search filtering
  const filteredRooms = useMemo(() => {
    return rooms.filter(room =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  const activeRoomDetail = useMemo(() => {
    return rooms.find(r => r.id === activeRoomId);
  }, [rooms, activeRoomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when room shifts or a new message prints
  useEffect(() => {
    if (!isConnecting) {
      scrollToBottom();
    }
  }, [currentMessages, activeRoomId, isConnecting]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const outboundPayload = inputMessage;
      setInputMessage(''); // Pessimistic view clearance for raw UX speed
      await sendMessage(outboundPayload);
    } catch (err) {
      console.error("Failed to commit network message transmission out:", err);
    } finally {
      setIsSending(false);
    }
  };

  if (isConnecting) {
    return (
      <div className="h-[calc(100vh-7rem)] lg:h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl">
        <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
        <span className="text-xs text-slate-400 font-medium mt-2 tracking-wide">Syncing secure gateway sync nodes...</span>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] lg:h-[calc(100vh-4rem)] flex bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">

      {/* ROOMS / CHANNELS SIDEBAR */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 hidden md:flex flex-col select-none">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-hidden focus:border-slate-400 transition-colors placeholder:text-slate-400 text-slate-800"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Communication Rooms</h4>
            <nav className="space-y-0.5">
              {filteredRooms.map((room) => {
                const isSelected = activeRoomId === room.id;
                const unreadCount = unreadCounts[room.id] || 0;

                return (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                      }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {room.type === 'secure' ? (
                        <Shield size={12} className={isSelected ? 'text-blue-400' : 'text-slate-400'} />
                      ) : (
                        <Hash size={12} className="text-slate-400" />
                      )}
                      <span className="truncate">{room.name}</span>
                    </div>

                    {!isSelected && unreadCount > 0 && (
                      <span className="bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-full text-[9px] min-w-[16px] text-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
              {filteredRooms.length === 0 && (
                <p className="text-[11px] text-slate-400 text-center py-4">No matching rooms located</p>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* CHAT TIMELINE CANVAS */}
      <div className="flex-1 flex flex-col h-full bg-white min-w-0">

        {/* Active Header Workspace info bar */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 select-none">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-900 truncate">
                #{activeRoomDetail?.name || 'unknown-context'}
              </span>
              <Circle size={6} className="fill-emerald-500 text-emerald-500 shrink-0" />
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">
              {activeRoomDetail?.description}
            </p>
          </div>
          <div className="flex items-center text-slate-400 gap-1 text-[11px] font-medium shrink-0">
            <Users size={12} /> <span className="text-slate-600 font-semibold">3</span> Online
          </div>
        </div>

        {/* Message stream track */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-white">
          {currentMessages.map((msg) => {
            const isMe = msg.sender_username === (adminUser?.username || 'operator');

            if (msg.is_system_log) {
              return (
                <div key={msg.id} className="flex flex-col items-center my-2 select-text">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5 max-w-2xl text-center font-mono text-[10px] text-slate-500 leading-relaxed shadow-2xs">
                    <span className="font-bold text-slate-400 mr-1.5">[{msg.timestamp}]</span>
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex flex-col select-text ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-700">@{msg.sender_username}</span>
                  <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                </div>
                <div className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words ${isMe
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                  }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
          {currentMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center select-none opacity-60">
              <p className="text-xs text-slate-400 font-medium">Timeline clean. No entries committed here yet.</p>
            </div>
          )}
        </div>

        {/* Input Bar Form controls */}
        <form onSubmit={handleFormSubmit} className="p-4 border-t border-slate-200 bg-slate-50/50 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSending}
            placeholder={isSending ? "Syncing timeline..." : `Message #${activeRoomDetail?.name || 'room'}...`}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-400 shadow-xs transition-colors text-slate-800"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-sm flex items-center justify-center cursor-pointer group"
          >
            {isSending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Send size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </form>
      </div>

    </div>
  );
}