// Types for deck visualization components

export interface Sample {
  id: string;
  userMessage: string;
  assistantResponse: string;
  score: number;
  description: string;
}

export interface Spec {
  text: string;
  samples?: Array<Sample>;
}

export interface Card {
  name: string;
  specs: Array<Spec>;
  cards?: Array<Card>;
}

export interface DeckData {
  name: string;
  specs: Array<Spec>;
  cards: Array<Card>;
}
