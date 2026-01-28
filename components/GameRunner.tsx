
import React, { useState, useEffect, useRef } from 'react';
import { Deck, GameType, Flashcard } from '../types';
import { GAMES } from '../constants';
import { geminiService } from '../services/geminiService';

interface GameRunnerProps {
  deck: Deck;
  gameType: GameType;
  onExit: () => void;
}

const GameRunner: React.FC<GameRunnerProps> = ({ deck, gameType, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastPointChange, setLastPointChange] = useState<{ value: number, id: number } | null>(null);

  useEffect(() => {
    setShuffledCards([...deck.cards].sort(() => Math.random() - 0.5));
  }, [deck]);

  if (shuffledCards.length === 0) return <div>Không có thẻ để chơi!</div>;

  const currentCard = shuffledCards[currentIndex];

  const handleNext = (correct: boolean) => {
    if (correct) {
        const points = 100 + (streak * 10);
        setScore(s => s + points);
        setStreak(s => s + 1);
        setLastPointChange({ value: points, id: Date.now() });
    } else {
        const penalty = -50;
        setScore(s => Math.max(0, s + penalty));
        setStreak(0);
        setLastPointChange({ value: penalty, id: Date.now() });
    }
    
    // Đợi một chút để người dùng thấy feedback trước khi chuyển câu (nếu game có feedback riêng)
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      (window as any).confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#d946ef', '#8b5cf6', '#ffffff']
      });
    }
  };

  const handleScoreOnly = (correct: boolean) => {
    if (correct) {
        const points = 100 + (streak * 10);
        setScore(s => s + points);
        setStreak(s => s + 1);
        setLastPointChange({ value: points, id: Date.now() });
    } else {
        const penalty = -50;
        setScore(s => Math.max(0, s + penalty));
        setStreak(0);
        setLastPointChange({ value: penalty, id: Date.now() });
    }
  };

  const renderGame = () => {
    switch (gameType) {
      case GameType.BATTLE: return <BattleGame cards={shuffledCards} onScoreChange={handleScoreOnly} onComplete={() => setIsFinished(true)} />;
      case GameType.FLIP: return <FlipGame cards={shuffledCards} onComplete={() => setIsFinished(true)} />;
      case GameType.QUIZ: return <QuizGame cards={shuffledCards} currentIndex={currentIndex} onNext={handleNext} />;
      case GameType.MATCH: return <MatchGame cards={deck.cards} onScoreChange={handleScoreOnly} onComplete={() => setIsFinished(true)} />;
      case GameType.MEMORY: return <MemoryGame cards={deck.cards.slice(0, 8)} onScoreChange={handleScoreOnly} onComplete={() => setIsFinished(true)} />;
      case GameType.SCRAMBLE: return <ScrambleGame card={currentCard} onNext={handleNext} />;
      case GameType.TYPE: return <TypeGame card={currentCard} onNext={handleNext} />;
      case GameType.TRUTH: return <TruthGame cards={shuffledCards} currentIndex={currentIndex} onNext={handleNext} />;
      case GameType.VOICE: return <VoiceGame card={currentCard} onNext={handleNext} />;
      case GameType.STORY: return <StoryGame cards={deck.cards} />;
      case GameType.GRAVITY: return <GravityGame cards={shuffledCards} onScoreChange={handleScoreOnly} onComplete={() => setIsFinished(true)} />;
      default: return <div>Game chưa sẵn sàng!</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <div className="w-full max-w-6xl px-4">
        <div className="flex justify-between items-center mb-12">
            <button onClick={onExit} className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-2xl text-white font-black transition-all">
            ✕ EXIT
            </button>
            {!isFinished && (
            <div className="flex gap-10 items-center">
                <div className="text-center relative">
                    <div className="text-fuchsia-400 text-[10px] font-black uppercase tracking-[0.3em]">POINTS</div>
                    <div className="text-4xl font-bungee text-white">{score}</div>
                    {lastPointChange && (
                        <div 
                          key={lastPointChange.id}
                          className={`absolute -top-8 left-1/2 -translate-x-1/2 font-bungee text-2xl animate-bounce-fade-out ${lastPointChange.value > 0 ? 'text-emerald-400' : 'text-rose-500'}`}
                        >
                            {lastPointChange.value > 0 ? `+${lastPointChange.value}` : lastPointChange.value}
                        </div>
                    )}
                </div>
                {streak > 1 && (
                    <div className="bg-gradient-to-r from-orange-500 to-fuchsia-600 px-6 py-2 rounded-2xl animate-bounce shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                        <span className="font-bungee text-white text-lg">{streak} STREAK! 🔥</span>
                    </div>
                )}
            </div>
            )}
        </div>

        <div className="w-full">
            {!isFinished && (
                <div className="w-full h-4 bg-black/40 rounded-full mb-12 overflow-hidden border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                    <div 
                        className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-600 progress-bar-fill neon-glow transition-all duration-500"
                        style={{ width: `${((currentIndex) / shuffledCards.length) * 100}%` }}
                    />
                </div>
            )}

            {isFinished ? (
            <div className="gaming-card p-20 rounded-[5rem] text-center border-t-8 border-t-indigo-500 shadow-[0_0_100px_rgba(139,92,246,0.2)] animate-in zoom-in duration-500">
                <h2 className="text-9xl mb-12 animate-pulse">👑</h2>
                <h3 className="text-7xl font-bungee mb-4 text-white tracking-tighter italic text-neon uppercase">VICTORY</h3>
                <p className="text-indigo-200 text-3xl mb-16 font-bold uppercase tracking-widest">TOTAL SCORE: <span className="text-fuchsia-400 font-bungee">{score}</span></p>
                <button 
                  onClick={onExit}
                  className="bg-indigo-600 text-white px-20 py-8 rounded-[3rem] font-bungee text-4xl shadow-[0_12px_0_#1e1b4b] active:translate-y-2 active:shadow-none hover:bg-indigo-500 transition-all"
                >
                  CONTINUE
                </button>
            </div>
            ) : (
            renderGame()
            )}
        </div>
      </div>
      <style>{`
        @keyframes bounce-fade-out {
          0% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -40px); }
        }
        .animate-bounce-fade-out {
          animation: bounce-fade-out 1s ease-out forwards;
        }
        .card-flip { perspective: 1000px; }
        .card-inner { transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
        .card-inner.flipped { transform: rotateY(180deg); }
        .card-front, .card-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; }
        .card-back { transform: rotateY(180deg); }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

const FlipGame = ({ cards, onComplete }: { cards: Flashcard[], onComplete: () => void }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const current = cards[index];

  const next = () => {
    setFlipped(false);
    setTimeout(() => {
        if (index < cards.length - 1) {
            setIndex(index + 1);
        } else {
            onComplete();
        }
    }, 150);
  };

  return (
    <div className="flex flex-col items-center gap-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div onClick={() => setFlipped(!flipped)} className="card-flip w-full max-w-2xl h-[450px] cursor-pointer group">
        <div className={`card-inner relative w-full h-full ${flipped ? 'flipped' : ''}`}>
          {/* MẶT TRƯỚC: Thuật ngữ & Phiên âm */}
          <div className="card-front bg-white text-indigo-950 rounded-[5rem] flex flex-col items-center justify-center p-16 shadow-2xl border-b-[24px] border-slate-200">
            <div className="absolute top-10 left-10 bg-indigo-50 px-4 py-2 rounded-full text-[10px] font-black text-indigo-300 tracking-[0.3em]">ENGLISH (US)</div>
            <h3 className="text-7xl font-black uppercase italic tracking-tighter text-indigo-900 group-hover:scale-105 transition-transform duration-500">{current.term}</h3>
            {current.phonetic && (
              <div className="mt-10 flex items-center gap-4 bg-cyan-50 px-8 py-4 rounded-[2rem] border border-cyan-100 shadow-sm animate-pulse">
                <span className="text-3xl">🔊</span>
                <span className="text-cyan-700 font-bold text-3xl italic font-serif">
                  {current.phonetic}
                </span>
              </div>
            )}
            <p className="mt-12 text-slate-300 font-bold text-sm tracking-widest animate-bounce">TAP TO FLIP</p>
          </div>

          {/* MẶT SAU: Định nghĩa */}
          <div className="card-back bg-gradient-to-br from-indigo-600 to-fuchsia-600 rounded-[5rem] flex flex-col items-center justify-center p-16 shadow-2xl border-b-[24px] border-indigo-950 text-white italic">
             <div className="absolute top-10 left-10 bg-white/10 px-4 py-2 rounded-full text-[10px] font-black text-white/50 tracking-[0.3em]">VIETNAMESE</div>
             <h3 className="text-7xl font-black tracking-tighter drop-shadow-lg text-center">{current.definition}</h3>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
          <button 
            onClick={next}
            className="bg-white text-indigo-900 px-24 py-10 rounded-[3rem] font-bungee text-3xl shadow-[0_12px_0_#cbd5e1] active:translate-y-2 active:shadow-none hover:bg-slate-50 transition-all flex items-center gap-6"
          >
            NEXT CARD <span className="text-4xl">➜</span>
          </button>
      </div>
      
      <div className="text-indigo-300/50 font-black tracking-[0.5em] text-xs">
        {index + 1} / {cards.length}
      </div>
    </div>
  );
};

const TruthGame = ({ cards, currentIndex, onNext }: { cards: Flashcard[], currentIndex: number, onNext: (correct: boolean) => void }) => {
    const [isMatch, setIsMatch] = useState(false);
    const [displayDef, setDisplayDef] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const currentCard = cards[currentIndex];

    useEffect(() => {
        const match = Math.random() > 0.5;
        setIsMatch(match);
        if (match) {
            setDisplayDef(currentCard.definition);
        } else {
            const others = cards.filter(c => c.id !== currentCard.id);
            setDisplayDef(others[Math.floor(Math.random() * others.length)]?.definition || "Học tập vui vẻ");
        }
        setFeedback(null);
    }, [currentIndex, cards]);

    const handleChoice = (choice: boolean) => {
        const isCorrect = choice === isMatch;
        setFeedback(isCorrect ? 'correct' : 'wrong');
        
        // Đợi 0.6s để người dùng thấy feedback màu sắc rồi mới qua câu tiếp theo
        setTimeout(() => {
            onNext(isCorrect);
        }, 600);
    };

    return (
        <div className={`bg-white p-16 rounded-[5rem] text-center shadow-2xl border-b-[24px] transition-all duration-300 animate-in zoom-in duration-300 ${feedback === 'correct' ? 'border-emerald-500 scale-95 shadow-[0_0_60px_rgba(16,185,129,0.3)]' : feedback === 'wrong' ? 'border-rose-500 animate-shake shadow-[0_0_60px_rgba(244,63,94,0.3)]' : 'border-slate-100'}`}>
            <div className="flex flex-col items-center">
                <div className="text-indigo-400 font-black mb-6 uppercase tracking-[0.4em] text-sm">DOES THIS MATCH?</div>
                <h2 className="text-8xl font-black text-indigo-950 mb-8 italic tracking-tighter">"{currentCard.term}"</h2>
                
                {currentCard.phonetic && (
                    <div className="text-cyan-600 font-serif text-3xl italic mb-10 opacity-50">{currentCard.phonetic}</div>
                )}

                <div className="text-5xl text-slate-500 mb-20 font-medium">
                    nghĩa là <span className="text-fuchsia-600 font-black italic border-b-4 border-fuchsia-100">"{displayDef}"</span>?
                </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
                <button 
                    disabled={feedback !== null}
                    onClick={() => handleChoice(false)} 
                    className="btn-3d bg-rose-500 hover:bg-rose-400 text-white px-20 py-12 rounded-[3.5rem] font-black text-4xl flex flex-col items-center gap-2 transition-all active:translate-y-2 uppercase"
                    style={{ '--shadow-color': '#9f1239' } as any}
                >
                    <span className="text-5xl">✕</span>
                    <span className="text-xl font-bungee">FALSE</span>
                </button>
                <button 
                    disabled={feedback !== null}
                    onClick={() => handleChoice(true)} 
                    className="btn-3d bg-emerald-500 hover:bg-emerald-400 text-white px-20 py-12 rounded-[3.5rem] font-black text-4xl flex flex-col items-center gap-2 transition-all active:translate-y-2 uppercase"
                    style={{ '--shadow-color': '#064e3b' } as any}
                >
                    <span className="text-5xl">✓</span>
                    <span className="text-xl font-bungee">TRUE</span>
                </button>
            </div>
        </div>
    );
};

const QuizGame = ({ cards, currentIndex, onNext }: { cards: Flashcard[], currentIndex: number, onNext: (correct: boolean) => void }) => {
  const current = cards[currentIndex];
  const [options, setOptions] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    const correct = current.definition;
    const others = cards.filter(c => c.definition !== correct).map(c => c.definition);
    setOptions([...others.sort(() => 0.5 - Math.random()).slice(0, 3), correct].sort(() => 0.5 - Math.random()));
    setSelectedIdx(null);
  }, [current, cards]);

  const select = (opt: string, idx: number) => {
    setSelectedIdx(idx);
    if (opt === current.definition) {
        setTimeout(() => onNext(true), 300);
    } else {
        setShake(true);
        setTimeout(() => {
            setShake(false);
            onNext(false);
        }, 500);
    }
  };

  return (
    <div className={`space-y-12 ${shake ? 'animate-shake' : ''}`}>
      <div className="bg-white p-20 rounded-[5rem] shadow-2xl text-center border-b-[24px] border-slate-100 flex flex-col items-center">
        <div className="text-indigo-300 font-black mb-4 uppercase tracking-[0.4em] text-xs">WHAT IS THE MEANING OF</div>
        <h2 className="text-7xl font-black text-indigo-900 tracking-tighter italic">"{current.term}"</h2>
        {current.phonetic && <div className="text-cyan-500 font-serif italic text-2xl mt-4">{current.phonetic}</div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => select(opt, i)} 
            className={`quizizz-btn p-12 rounded-[3rem] text-3xl font-black text-center shadow-xl transition-all uppercase tracking-tighter border-b-[12px] hover:scale-105 ${selectedIdx === i ? (opt === current.definition ? 'bg-emerald-500 text-white border-emerald-700' : 'bg-rose-500 text-white border-rose-700') : 'bg-white text-indigo-900 border-slate-200'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

const BattleGame = ({ cards, onScoreChange, onComplete }: { cards: Flashcard[], onScoreChange: (correct: boolean) => void, onComplete: () => void }) => {
    const [userIdx, setUserIdx] = useState(0);
    const [aiIdx, setAiIdx] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        generateOptions();
        const aiTimer = setInterval(() => {
            setAiIdx(prev => (prev < cards.length) ? prev + 1 : prev);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(aiTimer);
    }, [userIdx]);

    useEffect(() => {
        if (userIdx >= cards.length || aiIdx >= cards.length) {
            onComplete();
        }
    }, [userIdx, aiIdx]);

    const generateOptions = () => {
        if (!cards[userIdx]) return;
        const currentDef = cards[userIdx].definition;
        const others = cards.filter(c => c.definition !== currentDef).map(c => c.definition);
        const shuffled = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
        setOptions([...shuffled, currentDef].sort(() => 0.5 - Math.random()));
    };

    const handleAnswer = (opt: string) => {
        if (opt === cards[userIdx].definition) {
            onScoreChange(true);
            setUserIdx(prev => prev + 1);
            (window as any).confetti({ particleCount: 20, spread: 30, origin: { x: 0.5, y: 0.8 } });
        } else {
            onScoreChange(false);
            setShake(true);
            setTimeout(() => setShake(false), 300);
        }
    };

    return (
        <div className="space-y-16">
            <div className="gaming-card p-12 rounded-[4rem] border-2 border-indigo-500/20">
                <div className="flex justify-between items-end mb-6">
                    <div className="text-left"><span className="text-white font-bungee text-3xl">YOU 👩‍🚀</span></div>
                    <div className="text-right"><span className="text-fuchsia-400 font-bungee text-3xl">GEMINI 🤖</span></div>
                </div>
                <div className="relative h-16 bg-black/40 rounded-full border-4 border-indigo-900 overflow-hidden shadow-inner">
                    <div className="absolute h-full bg-gradient-to-r from-cyan-400 to-indigo-500 z-10 transition-all duration-500" style={{ width: `${(userIdx / cards.length) * 100}%` }} />
                    <div className="absolute h-full bg-fuchsia-600/30 z-0 transition-all duration-1000 border-r-4 border-fuchsia-500" style={{ width: `${(aiIdx / cards.length) * 100}%` }} />
                </div>
            </div>

            {cards[userIdx] && (
                <div className={`space-y-10 ${shake ? 'animate-shake' : ''}`}>
                    <div className="bg-white rounded-[4rem] p-20 text-center shadow-2xl border-b-[20px] border-slate-200">
                        <h2 className="text-7xl font-black text-indigo-950 tracking-tighter italic">"{cards[userIdx].term}"</h2>
                        {cards[userIdx].phonetic && <div className="text-cyan-500 italic text-2xl mt-4">{cards[userIdx].phonetic}</div>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt)} className="quizizz-btn p-12 rounded-[2.5rem] text-3xl font-black text-center shadow-2xl transition-all hover:scale-[1.03] uppercase tracking-tighter">
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ... Các thành phần game khác (MatchGame, MemoryGame, ScrambleGame, TypeGame, StoryGame, GravityGame, VoiceGame)
// được giữ nguyên logic nhưng có thể thêm hiển thị phiên âm khi cần thiết.

const MatchGame = ({ cards, onScoreChange, onComplete }: { cards: Flashcard[], onScoreChange: (correct: boolean) => void, onComplete: () => void }) => {
  const [selected, setSelected] = useState<{ id: string, type: 'term' | 'def' } | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [items, setItems] = useState<{ id: string, text: string, type: 'term' | 'def' }[]>([]);
  useEffect(() => {
    const terms = cards.map(c => ({ id: c.id, text: c.term, type: 'term' as const }));
    const defs = cards.map(c => ({ id: c.id, text: c.definition, type: 'def' as const }));
    setItems([...terms, ...defs].sort(() => Math.random() - 0.5));
  }, [cards]);
  const handleClick = (id: string, type: 'term' | 'def') => {
    if (matched.includes(id)) return;
    if (!selected) setSelected({ id, type });
    else {
      if (selected.id === id && selected.type !== type) {
        setMatched([...matched, id]);
        onScoreChange(true);
        if (matched.length + 1 === cards.length) onComplete();
      } else {
        onScoreChange(false);
      }
      setSelected(null);
    }
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {items.map((item, i) => (
        <button key={i} onClick={() => handleClick(item.id, item.type)} className={`p-8 h-48 rounded-[2.5rem] shadow-2xl transition-all font-black text-xl tracking-tighter ${matched.includes(item.id) ? 'bg-emerald-500/20 text-emerald-500 scale-90 opacity-40 grayscale' : selected?.id === item.id && selected?.type === item.type ? 'bg-fuchsia-600 text-white ring-8 ring-fuchsia-500/50 scale-105' : 'bg-white text-indigo-900 hover:scale-[1.02]'}`}>
          {item.text}
        </button>
      ))}
    </div>
  );
};

const MemoryGame = ({ cards, onScoreChange, onComplete }: { cards: Flashcard[], onScoreChange: (correct: boolean) => void, onComplete: () => void }) => {
    const [tiles, setTiles] = useState<{ id: string, text: string, type: string, solved: boolean }[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    useEffect(() => {
        const duals = cards.flatMap(c => [{ id: c.id, text: c.term, type: 'term', solved: false }, { id: c.id, text: c.definition, type: 'def', solved: false }]).sort(() => Math.random() - 0.5);
        setTiles(duals);
    }, [cards]);
    const handleTileClick = (index: number) => {
        if (flipped.length === 2 || tiles[index].solved || flipped.includes(index)) return;
        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);
        if (newFlipped.length === 2) {
            if (tiles[newFlipped[0]].id === tiles[newFlipped[1]].id && tiles[newFlipped[0]].type !== tiles[newFlipped[1]].type) {
                setTimeout(() => { 
                    setTiles(prev => prev.map((t, i) => (i === newFlipped[0] || i === newFlipped[1]) ? { ...t, solved: true } : t)); 
                    onScoreChange(true);
                    setFlipped([]); 
                    if (tiles.filter(t => !t.solved).length === 2) onComplete(); 
                }, 500);
            } else {
                setTimeout(() => {
                    onScoreChange(false);
                    setFlipped([]);
                }, 1000);
            }
        }
    };
    return (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {tiles.map((tile, i) => (
                <div key={i} onClick={() => handleTileClick(i)} className={`h-40 rounded-[2.5rem] cursor-pointer flex items-center justify-center p-6 text-center font-black transition-all ${flipped.includes(i) || tile.solved ? 'bg-indigo-600 text-white shadow-2xl' : 'bg-white/5 text-transparent border-2 border-white/10'}`}>
                    {(flipped.includes(i) || tile.solved) ? tile.text : '💎'}
                </div>
            ))}
        </div>
    );
};

const ScrambleGame = ({ card, onNext }: { card: Flashcard, onNext: (correct: boolean) => void }) => {
    const [scrambled, setScrambled] = useState<{char: string, id: number}[]>([]);
    const [answer, setAnswer] = useState<{char: string, id: number}[]>([]);
    useEffect(() => {
        setScrambled(card.term.split('').map((c, i) => ({char: c, id: i})).sort(() => 0.5 - Math.random()));
        setAnswer([]);
    }, [card]);
    const addLetter = (item: {char: string, id: number}) => { setAnswer([...answer, item]); setScrambled(scrambled.filter(s => s.id !== item.id)); };
    const clear = () => { setScrambled(card.term.split('').map((c, i) => ({char: c, id: i})).sort(() => 0.5 - Math.random())); setAnswer([]); };
    return (
        <div className="gaming-card p-16 rounded-[4rem] text-center">
            <h2 className="text-3xl text-indigo-200 mb-10 font-bold uppercase tracking-widest">SCRAMBLE: <span className="text-white text-5xl font-black block mt-4 italic tracking-tighter">"{card.definition}"</span></h2>
            <div className="flex flex-wrap justify-center gap-4 mb-12 min-h-[5rem]">
                {answer.map((item, i) => ( <div key={i} className="w-16 h-16 bg-fuchsia-600 text-white rounded-2xl flex items-center justify-center text-4xl font-black shadow-xl border-b-4 border-fuchsia-800">{item.char}</div> ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
                {scrambled.map((item, i) => ( <button key={i} onClick={() => addLetter(item)} className="w-16 h-16 bg-white text-indigo-950 rounded-2xl flex items-center justify-center text-4xl font-black shadow-xl">{item.char}</button> ))}
            </div>
            <div className="flex justify-center gap-10">
                <button onClick={clear} className="text-indigo-200 font-black uppercase">RESET</button>
                <button onClick={() => onNext(answer.map(a => a.char).join('') === card.term)} className="bg-indigo-600 text-white px-16 py-5 rounded-3xl font-bungee text-2xl shadow-xl">CHECK</button>
            </div>
        </div>
    );
};

const TypeGame = ({ card, onNext }: { card: Flashcard, onNext: (correct: boolean) => void }) => {
    const [input, setInput] = useState('');
    return (
        <div className="bg-white p-20 rounded-[5rem] text-center shadow-2xl border-b-[24px] border-indigo-100">
            <h2 className="text-2xl font-black text-indigo-300 mb-6 uppercase tracking-widest italic">"{card.definition}"</h2>
            <input autoFocus type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onNext(input.toLowerCase().trim() === card.term.toLowerCase().trim())} className="w-full text-center text-6xl font-black p-10 border-b-8 border-fuchsia-500 outline-none bg-transparent placeholder-slate-200 text-indigo-900 uppercase tracking-tighter" placeholder="..." />
            <p className="mt-12 text-indigo-300 font-black tracking-widest">PRESS ENTER</p>
        </div>
    );
};

const StoryGame = ({ cards }: { cards: Flashcard[] }) => {
    const [story, setStory] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const generate = async () => { setLoading(true); const res = await geminiService.generateStory(cards.slice(0, 5).map(c => c.term)); setStory(res); setLoading(false); };
    useEffect(() => { generate(); }, []);
    return (
        <div className="bg-white p-16 rounded-[5rem] text-center shadow-2xl text-indigo-950">
            <h2 className="text-2xl font-black mb-12 uppercase text-indigo-200 tracking-[0.5em]">AI STORY</h2>
            {loading ? <div className="animate-pulse text-4xl font-black italic">GEMINI IS WRITING...</div> : <div className="text-3xl leading-relaxed italic font-medium" dangerouslySetInnerHTML={{ __html: story.replace(/\*\*(.*?)\*\*/g, '<b class="text-fuchsia-600">$1</b>') }}></div>}
            <button onClick={generate} disabled={loading} className="mt-16 bg-indigo-600 text-white px-12 py-6 rounded-[2rem] font-bungee text-2xl shadow-xl">REFRESH STORY</button>
        </div>
    );
};

const GravityGame = ({ cards, onScoreChange, onComplete }: { cards: Flashcard[], onScoreChange: (correct: boolean) => void, onComplete: () => void }) => {
    const [activeCard, setActiveCard] = useState<Flashcard | null>(null);
    const [input, setInput] = useState('');
    const [pos, setPos] = useState(0);
    const timerRef = useRef<any>(null);
    useEffect(() => {
        const nextCard = () => { setActiveCard(cards[Math.floor(Math.random() * cards.length)]); setPos(0); };
        nextCard();
        timerRef.current = setInterval(() => { 
            setPos(p => { 
                if (p > 95) { 
                    onScoreChange(false);
                    nextCard(); 
                    return 0; 
                } 
                return p + 1.8; 
            }); 
        }, 100);
        return () => clearInterval(timerRef.current);
    }, [cards]);
    const check = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim().toLowerCase() === activeCard?.term.toLowerCase()) { 
            setInput(''); 
            onScoreChange(true);
            setPos(0); 
            setActiveCard(cards[Math.floor(Math.random() * cards.length)]); 
        } else {
            onScoreChange(false);
            setInput('');
        }
    };
    return (
        <div className="relative h-[75vh] bg-[#0c0216] rounded-[5rem] overflow-hidden border-[12px] border-indigo-950 shadow-2xl">
            <div className="absolute w-full flex justify-center transition-all duration-100 px-6" style={{ top: `${pos}%` }}>
                <div className="bg-amber-400 text-indigo-950 px-12 py-6 rounded-[3rem] font-black text-3xl shadow-2xl">{activeCard?.definition}</div>
            </div>
            <form onSubmit={check} className="absolute bottom-16 left-0 w-full px-16 z-20">
                <input autoFocus value={input} onChange={e => setInput(e.target.value)} className="w-full bg-indigo-950/90 text-white text-center text-5xl font-black p-10 rounded-[3rem] border-4 border-indigo-500 focus:border-cyan-400 outline-none uppercase" placeholder="TYPE FAST..." />
            </form>
        </div>
    );
};

const VoiceGame = ({ card, onNext }: { card: Flashcard, onNext: (correct: boolean) => void }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [aiResult, setAiResult] = useState<any>(null);
    const [transcript, setTranscript] = useState('');

    const startRecording = () => {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        if (!SpeechRecognition) {
            alert("Trình duyệt không hỗ trợ nhận diện giọng nói.");
            return;
        }
        setAiResult(null);
        setTranscript('');
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onstart = () => { setIsRecording(true); setFeedback('ĐANG NGHE...'); };
        recognition.onresult = async (event: any) => {
            const result = event.results[0][0].transcript;
            setTranscript(result);
            setFeedback('AI ĐANG KIỂM TRA...');
            try {
                const evaluation = await geminiService.evaluateSpeaking(card.term, result);
                setAiResult(evaluation);
            } catch (e) { 
                setFeedback('LỖI KẾT NỐI AI'); 
            }
        };
        recognition.onend = () => setIsRecording(false);
        recognition.start();
    };

    return (
        <div className="flex flex-col items-center gap-10">
            <div className="gaming-card w-full max-w-3xl p-20 rounded-[5rem] text-center border-t-[16px] border-indigo-500">
                <div className="text-indigo-400 font-black mb-8 uppercase tracking-[0.4em] text-sm">PRONOUNCE THIS</div>
                <h3 className="text-8xl font-black mb-16 text-white italic tracking-tighter drop-shadow-2xl">"{card.term}"</h3>
                
                <div className="flex flex-col items-center gap-10">
                    <button 
                        onClick={startRecording}
                        disabled={isRecording}
                        className={`w-48 h-48 rounded-full flex items-center justify-center text-7xl shadow-2xl transition-all ${isRecording ? 'bg-rose-500 animate-pulse ring-[20px] ring-rose-500/20' : 'bg-gradient-to-br from-fuchsia-600 to-indigo-600 hover:scale-110 active:scale-95'} text-white ring-[16px] ring-white/5 relative`}
                    >
                        {isRecording ? '⏺' : '🎤'}
                        {!isRecording && <div className="absolute inset-0 rounded-full animate-ping bg-fuchsia-400/20"></div>}
                    </button>
                    <p className="text-indigo-200 font-black text-2xl tracking-widest">{feedback || 'TAP TO START'}</p>
                </div>
            </div>

            {transcript && (
                <div className="w-full max-w-3xl bg-black/40 p-8 rounded-[3rem] border border-white/5 text-center">
                    <span className="text-white/40 font-bold uppercase text-xs tracking-widest">Bạn đã nói:</span>
                    <h4 className="text-3xl font-black text-white mt-2">"{transcript}"</h4>
                </div>
            )}

            {aiResult && (
                <div className={`w-full max-w-3xl p-12 rounded-[4rem] text-center shadow-2xl animate-in slide-in-from-bottom-10 duration-500 border-b-[16px] ${aiResult.score >= 80 ? 'bg-emerald-500 border-emerald-700' : aiResult.score >= 50 ? 'bg-amber-500 border-amber-700' : 'bg-rose-600 border-rose-900'} text-white`}>
                    <div className="text-8xl font-bungee mb-4">{aiResult.score}%</div>
                    <div className="text-2xl font-black mb-2 uppercase tracking-tight">{aiResult.feedback}</div>
                    {aiResult.correction && <div className="text-white/80 font-medium italic mt-4 opacity-80">Mẹo: {aiResult.correction}</div>}
                    
                    <button 
                        onClick={() => onNext(aiResult.score >= 70)}
                        className="mt-10 bg-white text-indigo-900 px-16 py-5 rounded-[2rem] font-bungee text-2xl hover:bg-slate-100 transition-all active:translate-y-1"
                    >
                        {aiResult.score >= 70 ? 'TIẾP TỤC ➜' : 'THỬ LẠI'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default GameRunner;
