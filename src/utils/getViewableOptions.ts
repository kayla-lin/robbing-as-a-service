import { PassageId, PassageOptionType, Scene } from "../consts/story";
import { GameState, GameStateVariable } from "../story-store";

export const getViewableOptions = (
  options: PassageOptionType<keyof GameStateVariable>[],
  passageHistory: string[],
  gameState: GameState
) => {
  return options.filter((option) => {
    const isAdvancedOption =
      typeof option === "object" && option !== null && "id" in option;
    const id: PassageId<keyof Scene> = (
      isAdvancedOption ? option.id : option
    ) as PassageId<keyof Scene>;
    if (
      (isAdvancedOption &&
        passageHistory.includes(id) &&
        !option.showIfChosenAlready) ||
      (isAdvancedOption &&
        option.condition &&
        !option.condition.callback(gameState[option.condition.key])) ||
      (!isAdvancedOption && passageHistory.includes(id))
    ) {
      return false;
    }
    return true;
  });
};
