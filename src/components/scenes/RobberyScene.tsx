import { PassageId, passages } from "../../consts/story";
import { useStoryControls } from "../../hook/useStoryControls";
import { HStack, VStack } from "../../../styled-system/jsx";
import { styled } from "../../../styled-system/jsx";
import { useStoryStore } from "../../story-store";
import { getViewableOptions } from "../../utils/getViewableOptions";

const ROOMS: { id: PassageId<"house">; img: string }[] = [
  { id: "Go to the living area", img: "living-area.png" },
  { id: "Go to the bedroom", img: "bedroom-area.png" },
  { id: "Go to the kitchen", img: "kitchen-area.png" },
  { id: "Go to the office", img: "office-area.png" },
];

export const RobberyScene = () => {
  const currentPassageId = useStoryStore((state) => state.currentPassageId);
  const passage = passages[currentPassageId];
  const bitcoin = useStoryStore((state) => state.gameState.bitcoin);
  const passageHistory = useStoryStore((state) => state.passageHistory);
  const gameState = useStoryStore((state) => state.gameState);

  const currentRoomIdx = ROOMS.findIndex(
    (passage) => passage.id === currentPassageId
  );
  const currentRoom = ROOMS[currentRoomIdx];
  const { selectStoryPassage } = useStoryControls();

  const viewableOptions = getViewableOptions(
    passage.options ?? [],
    passageHistory,
    gameState
  );

  const moveLeft = () => {
    if (currentRoomIdx > 0) {
      selectStoryPassage(ROOMS[currentRoomIdx - 1].id);
    } else {
      selectStoryPassage(ROOMS[ROOMS.length - 1].id);
    }
  };

  const moveRight = () => {
    if (currentRoomIdx < ROOMS.length - 1) {
      selectStoryPassage(ROOMS[currentRoomIdx + 1].id);
    } else {
      selectStoryPassage(ROOMS[0].id);
    }
  };

  return (
    <VStack>
      <HStack w="100%" justify="center">
        <styled.button
          py={2}
          px={4}
          h="100%"
          bg="purple.500"
          _hover={{ bg: "purple.700" }}
          onClick={moveLeft}
        >
          Left
        </styled.button>
        <styled.img w="90%" src={currentRoom?.img} />
        <styled.button
          py={2}
          px={4}
          h="100%"
          bg="purple.500"
          _hover={{ bg: "purple.700" }}
          onClick={moveRight}
        >
          Right
        </styled.button>
      </HStack>
      <styled.p fontSize="2xl">{bitcoin} bitcoin collected</styled.p>
      {viewableOptions?.length === 0 && (
        <styled.p fontSize="2xl" color="slate.500">
          There are no more actions to do in this room
        </styled.p>
      )}
    </VStack>
  );
};
