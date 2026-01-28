
import React from 'react';
import { GameType, GameInfo } from './types';

export const GAMES: GameInfo[] = [
  { type: GameType.BATTLE, title: "Đấu AI", description: "Cuộc đua tốc độ với Gemini AI.", icon: "⚔️", color: "bg-fuchsia-600" },
  { type: GameType.FLIP, title: "Lật Thẻ", description: "Ôn tập cơ bản.", icon: "🎴", color: "bg-blue-500" },
  { type: GameType.QUIZ, title: "Trắc Nghiệm", description: "Chọn đáp án đúng.", icon: "📝", color: "bg-purple-500" },
  { type: GameType.MATCH, title: "Nối Từ", description: "Nối thuật ngữ.", icon: "🔗", color: "bg-emerald-500" },
  { type: GameType.MEMORY, title: "Trí Nhớ", description: "Tìm các cặp thẻ.", icon: "🧠", color: "bg-pink-500" },
  { type: GameType.SCRAMBLE, title: "Sắp Xếp", description: "Sắp xếp chữ cái.", icon: "🔠", color: "bg-amber-500" },
  { type: GameType.TYPE, title: "Chính Tả", description: "Gõ từ vựng.", icon: "⌨️", color: "bg-orange-500" },
  { type: GameType.TRUTH, title: "Đúng/Sai", description: "Kiểm tra nhanh.", icon: "✅", color: "bg-rose-500" },
  { type: GameType.VOICE, title: "Luyện Nói AI", description: "Phát âm chuẩn.", icon: "🗣️", color: "bg-indigo-600" },
  { type: GameType.STORY, title: "Kể Chuyện AI", description: "Học qua ngữ cảnh.", icon: "📖", color: "bg-cyan-500" },
];

export const INITIAL_DECKS = [
  {
    id: 'deck-1',
    title: 'Tiếng Anh Giao Tiếp',
    description: 'Các cụm từ phổ biến hàng ngày.',
    cards: [
      { id: '1', term: 'Hello', definition: 'Xin chào', phonetic: '/həˈloʊ/' },
      { id: '2', term: 'Thank you', definition: 'Cảm ơn', phonetic: '/ˈθæŋk juː/' },
      { id: '3', term: 'Goodbye', definition: 'Tạm biệt', phonetic: '/ˌɡʊdˈbaɪ/' },
      { id: '4', term: 'Excellent', definition: 'Xuất sắc', phonetic: '/ˈeksələnt/' },
      { id: '5', term: 'Delicious', definition: 'Ngon miệng', phonetic: '/dɪˈlɪʃəs/' },
      { id: '6', term: 'Success', definition: 'Thành công', phonetic: '/səkˈses/' },
      { id: '7', term: 'Knowledge', definition: 'Kiến thức', phonetic: '/ˈnɑːlɪdʒ/' },
      { id: '8', term: 'Experience', definition: 'Kinh nghiệm', phonetic: '/ɪkˈspɪriəns/' },
    ]
  }
];
