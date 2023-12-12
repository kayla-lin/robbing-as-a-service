import { styled } from "../../styled-system/jsx";
import { PassageId, PassageOptionType, Scene } from "../consts/story.tsx";
import { GameStateVariable, useStoryStore } from "../story-store.ts";

interface Props {
  option: PassageOptionType<keyof GameStateVariable>;
  onOptionSelect: (id: PassageId<keyof Scene>) => void;
}

export const PassageOption = ({ option, onOptionSelect }: Props) => {
  const isAdvancedOption =
    typeof option === "object" && option !== null && "id" in option;
  const id: PassageId<keyof Scene> = (
    isAdvancedOption ? option.id : option
  ) as PassageId<keyof Scene>;

  const storyStore = useStoryStore();

  if (
    isAdvancedOption &&
    option.condition &&
    !option.condition.callback(storyStore.gameState[option.condition.key])
  ) {
    return null;
  }
  return (
    <styled.li
      w="100%"
      onClick={() => {
        onOptionSelect(id);
      }}
    >
      <styled.button
        w="100%"
        py={2}
        px={4}
        bg="slate.900"
        _hover={{ bg: "slate.800" }}
        border={`1px solid token(colors.slate.800)`}
      >
        {isAdvancedOption && option.label ? option.label : id}
      </styled.button>
    </styled.li>
  );
};
