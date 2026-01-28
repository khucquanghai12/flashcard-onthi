
import React, { useState } from 'react';
import { Deck, GameType, User } from '../types';
import { GAMES } from '../constants';

interface DashboardProps {
  user: User;
  decks: Deck[];
  onCreate: () => void;
  onSelect: (deck: Deck) => void;
  onPlay: (deck: Deck, game: GameType) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, decks, onCreate, onSelect, onPlay, onLogout }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [pendingGame, setPendingGame] = useState<GameType | null>(null);

  const handleArcadeClick = (gameType: GameType) => {
    setPendingGame(gameType);
    setShowSelector(true);
  };

  const selectDeckAndStart = (deck: Deck) => {
    if (pendingGame && deck.cards.length > 0) {
      onPlay(deck, pendingGame);
      setShowSelector(false);
      setPendingGame(null);
    } else {
      alert("Bộ thẻ này trống, hãy thêm ít nhất 1 thẻ!");
    }
  };

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-700">
      {/* Deck Selection Modal */}
      {showSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300" onClick={() => setShowSelector(false)}></div>
          <div className="gaming-card relative z-10 w-full max-w-2xl p-10 rounded-[4rem] border-t-[12px] border-fuchsia-600 shadow-[0_0_80px_rgba(217,70,239,0.3)] animate-in zoom-in duration-300">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bungee text-white mb-2 text-neon">CHOOSE DECK</h2>
              <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs opacity-60">To play {GAMES.find(g => g.type === pendingGame)?.title}</p>
            </div>
            
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {decks.map(deck => (
                <button
                  key={deck.id}
                  onClick={() => selectDeckAndStart(deck)}
                  className="w-full bg-white/5 hover:bg-fuchsia-600/20 p-8 rounded-3xl text-left border border-white/10 transition-all flex justify-between items-center group active:scale-95"
                >
                  <div>
                    <h4 className="text-2xl font-black text-white group-hover:text-fuchsia-300">{deck.title}</h4>
                    <p className="text-indigo-300/60 text-sm font-bold mt-1 uppercase tracking-[0.2em]">{deck.cards.length} THẺ</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:bg-fuchsia-500 group-hover:text-white transition-all">
                    ▶
                  </div>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setShowSelector(false)}
              className="mt-8 w-full py-4 text-white/30 font-black hover:text-white transition-colors uppercase tracking-widest text-sm"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}

      {/* Top Header Navigation */}
      <nav className="flex justify-between items-center bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
            {user.avatar}
          </div>
          <div>
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Player Profile</div>
            <div className="text-xl font-bold text-white tracking-tight">{user.username}</div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="bg-white/5 hover:bg-rose-500/20 text-indigo-300 hover:text-rose-500 px-8 py-3 rounded-2xl font-bold text-sm transition-all border border-white/10"
        >
          LOGOUT
        </button>
      </nav>

      <header className="flex flex-col md:flex-row justify-between items-center gap-8 pt-4">
        <div className="text-center md:text-left">
          <h1 className="text-8xl font-bungee text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-400 tracking-tighter text-neon leading-none">
            FUNQUIZZIZ
          </h1>
          <p className="text-indigo-300 mt-4 text-2xl font-bold italic tracking-tighter opacity-70">THE ULTIMATE AI ARENA</p>
        </div>
        <button 
          onClick={onCreate}
          style={{ '--shadow-color': '#701a75' } as any}
          className="btn-3d bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-14 py-7 rounded-[2rem] font-bungee text-2xl flex items-center gap-4 shadow-[0_10px_0_#701a75] hover:shadow-[0_12px_0_#701a75] transition-all"
        >
          <span className="text-4xl">💎</span> TẠO BỘ THẺ
        </button>
      </header>

      {/* Main Decks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {decks.map(deck => (
          <div key={deck.id} className="gaming-card p-10 rounded-[3.5rem] relative group border-t-8 border-t-indigo-500/50">
            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-cyan-400 to-indigo-600 w-20 h-20 rounded-3xl rotate-12 flex items-center justify-center text-4xl shadow-2xl group-hover:rotate-[24deg] transition-all">
              ⚡
            </div>
            
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-white mb-3 tracking-tighter">{deck.title}</h3>
              <p className="text-indigo-200/50 mb-8 font-medium line-clamp-2 h-12 leading-relaxed">{deck.description}</p>
              
              <div className="flex items-center justify-between mb-10">
                <span className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-2 rounded-2xl text-indigo-300 font-black text-xs uppercase tracking-[0.2em]">
                  {deck.cards.length} CARDS
                </span>
                <button 
                  onClick={() => onSelect(deck)} 
                  className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all"
                >
                  <span className="text-2xl">⚙️</span>
                </button>
              </div>

              <div className="space-y-4">
                <button 
                  disabled={deck.cards.length < 1}
                  onClick={() => onPlay(deck, GameType.BATTLE)}
                  className="w-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:brightness-125 text-white p-6 rounded-3xl font-bungee text-xl flex items-center justify-center gap-4 transition-all shadow-xl disabled:opacity-20"
                >
                  ⚔️ BATTLE AI
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arcade Section */}
      <section className="bg-white/5 p-16 rounded-[5rem] border-2 border-dashed border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-bungee">ARCADE</div>
        <h2 className="text-5xl font-bungee mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">MINI GAME ARCADE</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {GAMES.map(game => (
            <button 
              key={game.type} 
              onClick={() => handleArcadeClick(game.type)}
              className="gaming-card p-10 rounded-[3rem] text-center group transition-all hover:bg-fuchsia-600 hover:scale-105 active:scale-95 border-b-[12px] border-black/40 hover:border-fuchsia-800 flex flex-col items-center"
            >
               <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">{game.icon}</div>
               <div className="font-bungee text-white text-[11px] tracking-[0.2em] leading-tight opacity-80 group-hover:opacity-100">{game.title}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
