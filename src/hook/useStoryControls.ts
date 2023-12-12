import { PassageId, Scene } from "../consts/story";
import { useStoryStore } from "../story-store";

export const useStoryControls = () => {
  const setCurrentPassage = useStoryStore((state) => state.setCurrentPassage);
  const addPassageHistory = useStoryStore((state) => state.addPassageHistory);

  const selectStoryPassage = (passageId: PassageId<keyof Scene>) => {
    addPassageHistory(passageId);
    setCurrentPassage(passageId);
  };

  return { selectStoryPassage };
};
