
import React, { useState } from 'react';
import { Deck, Flashcard } from '../types';

interface DeckEditorProps {
  deck: Deck;
  onSave: (deck: Deck) => void;
  onBack: () => void;
  onDelete: (id: string) => void;
}

const DeckEditor: React.FC<DeckEditorProps> = ({ deck, onSave, onBack, onDelete }) => {
  const [localDeck, setLocalDeck] = useState<Deck>(deck);

  const addCard = () => {
    const newCard: Flashcard = {
      id: `card-${Date.now()}`,
      term: '',
      definition: '',
      phonetic: ''
    };
    const updated = { ...localDeck, cards: [...localDeck.cards, newCard] };
    setLocalDeck(updated);
    onSave(updated);
  };

  const updateCard = (id: string, field: keyof Flashcard, value: string) => {
    const updatedCards = localDeck.cards.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    const updated = { ...localDeck, cards: updatedCards };
    setLocalDeck(updated);
    onSave(updated);
  };

  const removeCard = (id: string) => {
    const updatedCards = localDeck.cards.filter(c => c.id !== id);
    const updated = { ...localDeck, cards: updatedCards };
    setLocalDeck(updated);
    onSave(updated);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-16">
        <button 
          onClick={onBack} 
          className="bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl text-indigo-400 font-bold flex items-center gap-3 transition-all border border-white/5"
        >
          ← BACK TO ARCADE
        </button>
        <button 
          onClick={() => { if(confirm('Xóa bộ thẻ này?')) onDelete(deck.id); }}
          className="text-rose-500 font-bold text-sm hover:text-rose-400 transition-colors bg-rose-500/10 px-6 py-4 rounded-2xl border border-rose-500/20"
        >
          DELETE DECK
        </button>
      </div>

      <div className="space-y-6 mb-16 bg-white/5 p-12 rounded-[3.5rem] border border-white/10 shadow-2xl">
        <div className="space-y-2">
            <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] ml-2">Deck Title</label>
            <input 
              type="text"
              value={localDeck.title}
              onChange={(e) => {
                const updated = { ...localDeck, title: e.target.value };
                setLocalDeck(updated);
                onSave(updated);
              }}
              className="text-5xl font-bungee bg-transparent border-none outline-none focus:ring-0 w-full placeholder-white/10 text-white"
              placeholder="TITLE..."
            />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] ml-2">Description</label>
            <textarea 
              value={localDeck.description}
              onChange={(e) => {
                const updated = { ...localDeck, description: e.target.value };
                setLocalDeck(updated);
                onSave(updated);
              }}
              className="text-xl text-indigo-200/60 bg-transparent border-none outline-none focus:ring-0 w-full h-16 resize-none placeholder-white/5"
              placeholder="About this deck..."
            />
        </div>
      </div>

      <div className="space-y-8">
        {localDeck.cards.map((card) => (
          <div key={card.id} className="gaming-card p-10 rounded-[3rem] flex flex-col gap-6 relative group overflow-hidden border-l-8 border-l-fuchsia-500">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                 <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Term / Question</label>
                 <input 
                   type="text"
                   value={card.term}
                   onChange={(e) => updateCard(card.id, 'term', e.target.value)}
                   className="input-glass w-full p-6 rounded-2xl font-bold text-2xl focus:scale-[1.01] transition-transform text-white"
                   placeholder="English word..."
                 />
              </div>
              <div className="flex-1 space-y-4">
                 <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Definition / Answer</label>
                 <input 
                   type="text"
                   value={card.definition}
                   onChange={(e) => updateCard(card.id, 'definition', e.target.value)}
                   className="input-glass w-full p-6 rounded-2xl font-bold text-2xl focus:scale-[1.01] transition-transform text-white"
                   placeholder="Vietnamese meaning..."
                 />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-end gap-6">
              <div className="flex-1 space-y-4 w-full">
                 <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Phonetic (US IPA)</label>
                 <input 
                   type="text"
                   value={card.phonetic || ''}
                   onChange={(e) => updateCard(card.id, 'phonetic', e.target.value)}
                   className="input-glass w-full p-4 rounded-xl font-medium text-lg border-cyan-500/20 text-cyan-200"
                   placeholder="/IPA Transcription/"
                 />
              </div>
              <button 
                onClick={() => removeCard(card.id)}
                className="bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white w-full md:w-16 h-16 rounded-2xl transition-all flex items-center justify-center text-3xl font-bold border border-rose-500/20"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={addCard}
          className="w-full border-4 border-dashed border-white/5 p-16 rounded-[4rem] text-indigo-400 font-bungee text-2xl hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all flex flex-col items-center gap-4 group"
        >
          <span className="text-6xl text-white/10 group-hover:text-fuchsia-500 transition-colors">+</span>
          ADD NEW CARD
        </button>
      </div>
    </div>
  );
};

export default DeckEditor;
