
import React, { useState, useEffect } from 'react';
import { Deck, Flashcard, GameType, User } from './types';
import { INITIAL_DECKS, GAMES } from './constants';
import Dashboard from './components/Dashboard';
import DeckEditor from './components/DeckEditor';
import GameRunner from './components/GameRunner';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('quizziz_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'editor' | 'game'>('dashboard');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  // Tải dữ liệu khi currentUser thay đổi
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('quizziz_session', JSON.stringify(currentUser));
      const savedDecks = localStorage.getItem(`quizziz_decks_${currentUser.id}`);
      if (savedDecks) {
        setDecks(JSON.parse(savedDecks));
      } else {
        // Nếu là người dùng mới, cho họ bộ thẻ mặc định
        setDecks(INITIAL_DECKS);
      }
    } else {
      localStorage.removeItem('quizziz_session');
      setDecks([]);
    }
  }, [currentUser]);

  // Lưu dữ liệu mỗi khi bộ thẻ thay đổi
  useEffect(() => {
    if (currentUser && decks.length > 0) {
      localStorage.setItem(`quizziz_decks_${currentUser.id}`, JSON.stringify(decks));
    }
  }, [decks, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  const handleCreateDeck = () => {
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      title: 'Bộ Thẻ Mới',
      description: 'Nhấn để chỉnh sửa mô tả...',
      cards: [],
      userId: currentUser?.id
    };
    setDecks([...decks, newDeck]);
    setSelectedDeck(newDeck);
    setActiveView('editor');
  };

  const handleUpdateDeck = (updatedDeck: Deck) => {
    setDecks(decks.map(d => d.id === updatedDeck.id ? updatedDeck : d));
  };

  const handleDeleteDeck = (id: string) => {
    setDecks(decks.filter(d => d.id !== id));
    setActiveView('dashboard');
  };

  const startGame = (deck: Deck, gameType: GameType) => {
    setSelectedDeck(deck);
    setSelectedGame(gameType);
    setActiveView('game');
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {activeView === 'dashboard' && (
        <Dashboard 
          user={currentUser}
          decks={decks} 
          onCreate={handleCreateDeck} 
          onSelect={(d) => { setSelectedDeck(d); setActiveView('editor'); }} 
          onPlay={startGame}
          onLogout={handleLogout}
        />
      )}
      
      {activeView === 'editor' && selectedDeck && (
        <DeckEditor 
          deck={selectedDeck} 
          onSave={handleUpdateDeck} 
          onBack={() => setActiveView('dashboard')} 
          onDelete={handleDeleteDeck}
        />
      )}

      {activeView === 'game' && selectedDeck && selectedGame && (
        <GameRunner 
          deck={selectedDeck} 
          gameType={selectedGame} 
          onExit={() => setActiveView('dashboard')} 
        />
      )}
    </div>
  );
};

export default App;
