import { styled } from "../../styled-system/jsx";
import { useStoryStore } from "../story-store";
const PassageBackButton = () => {
  const passageHistory = useStoryStore((state) => state.passageHistory);
  const setCurrentPassage = useStoryStore((state) => state.setCurrentPassage);

  const onMoveBackwards = () => {
    setCurrentPassage(passageHistory[passageHistory.length - 2]);
  };

  return (
    <styled.button
      w="100%"
      py={2}
      px={4}
      bg="slate.900"
      _hover={{ bg: "slate.800" }}
      border={`1px solid token(colors.slate.800)`}
      onClick={onMoveBackwards}
    >
      Back
    </styled.button>
  );
};

export default PassageBackButton;
