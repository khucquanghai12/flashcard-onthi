
export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  phonetic?: string;
  example?: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  userId?: string; // Liên kết với người dùng
}

export enum GameType {
  FLIP = 'FLIP',
  QUIZ = 'QUIZ',
  MATCH = 'MATCH',
  MEMORY = 'MEMORY',
  SCRAMBLE = 'SCRAMBLE',
  TYPE = 'TYPE',
  TRUTH = 'TRUTH',
  VOICE = 'VOICE',
  STORY = 'STORY',
  GRAVITY = 'GRAVITY',
  BATTLE = 'BATTLE'
}

export interface GameInfo {
  type: GameType;
  title: string;
  description: string;
  icon: string;
  color: string;
}
