import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { PassageId, Scene } from "./consts/story";

export interface GameStateController {
  addBitcoin: (bitcoin: number) => number;
  subtractBitcoin: (bitcoin: number) => number;
  takesPineappleJuice: (prev: boolean) => boolean;
}

export interface GameStateVariable {
  bitcoin: number;
  hasPineappleJuice: boolean;
}

export type GameState = GameStateVariable & {
  addBitcoin: (callback: GameStateController["addBitcoin"]) => void;
  subtractBitcoin: (callback: GameStateController["subtractBitcoin"]) => void;
  takesPineappleJuice: (
    callback: GameStateController["takesPineappleJuice"]
  ) => void;
};

interface StoryStore {
  currentPassageId: PassageId<keyof Scene>;
  cash: number;
  gameState: GameState;
  passageHistory: PassageId<keyof Scene>[];
  setCurrentPassage: (passageId: PassageId<keyof Scene>) => void;
  addPassageHistory: (passageId: PassageId<keyof Scene>) => void;
  removePassageHistory: (passageId: PassageId<keyof Scene>) => void;
}

export const useStoryStore = create<StoryStore>()(
  devtools(
    persist(
      (set) => ({
        cash: 0,
        gameState: {
          bitcoin: 0,
          takesPineappleJuice: (by) =>
            set((prev) => ({
              gameState: {
                ...prev.gameState,
                hasPineappleJuice: by(prev.gameState.hasPineappleJuice),
              },
            })),
          hasPineappleJuice: false,
          addBitcoin: (by) =>
            set((prev) => ({
              gameState: {
                ...prev.gameState,
                bitcoin: by(prev.gameState.bitcoin),
              },
            })),
          subtractBitcoin: (by) => {
            return set((prev) => ({
              gameState: {
                ...prev.gameState,
                bitcoin: by(prev.gameState.bitcoin),
              },
            }));
          },
        },
        passageHistory: ["start"],
        currentPassageId: "start",
        setCurrentPassage: (by) => set(() => ({ currentPassageId: by })),
        addPassageHistory: (by) =>
          set((state) => ({ passageHistory: [...state.passageHistory, by] })),
        removePassageHistory: (by) =>
          set((state) => ({
            passageHistory: state.passageHistory.filter((pass) => pass !== by),
          })),
      }),
      {
        name: "story-twine-store",
        partialize: (state) => ({ cash: state.cash }),
      }
    )
  )
);
