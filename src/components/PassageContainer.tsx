import { VStack, styled } from "../../styled-system/jsx";
import { motion } from "framer-motion";
import { css } from "../../styled-system/css";
import { ReactNode, useEffect } from "react";
import {
  Passage,
  PassageId,
  PassageOptionType,
  Scene,
  characterDictionary,
  sceneDictionary,
} from "../consts/story";
import { PassageOption } from "./PassageOption";
import { useStoryControls } from "../hook/useStoryControls";
import PassageBackButton from "./PassageBackButton";
import {
  GameStateController,
  GameStateVariable,
  useStoryStore,
} from "../story-store";
import { getViewableOptions } from "../utils/getViewableOptions";

// const container = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 1,
//       delayChildren: 0.2,
//     },
//   },
// };

const item = {
  hidden: { opacity: 0, y: [0, 5], transition: { duration: 0.2 } },
  show: {
    opacity: [0, 1],
    y: [5, 0],
    type: "spring",
    stiffness: 100,
    mass: 0.3,
    transition: {
      duration: 0.5,
    },
  },
};

interface Props {
  passages: Passage<
    keyof Scene,
    keyof GameStateController,
    keyof GameStateVariable
  >;
  passageId: PassageId<keyof Scene>;
}

export const PassageContainer = ({ passages, passageId }: Props) => {
  const passage = passages[passageId]!;
  const sceneId: keyof Scene | undefined = passage?.scene;
  const scene: string | ReactNode | null = sceneId
    ? sceneDictionary[sceneId]
    : null;
  const { selectStoryPassage } = useStoryControls();
  const gameState = useStoryStore((state) => state.gameState);
  const passageHistory = useStoryStore((state) => state.passageHistory);

  //const [debug, setDebug] = useState("");

  useEffect(() => {
    if (passage.trigger) {
      const trigger = gameState[passage.trigger.key];
      const callback = passage.trigger.callback;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      trigger(callback as unknown as any);
    }
  }, [passage.trigger]);

  const viewableOptions = getViewableOptions(
    passage?.options ?? [],
    passageHistory,
    gameState
  );

  return (
    <styled.div minH="100svh" w="100%" bg="slate.950" color="white" p={8}>
      {/* <styled.div pos="absolute" top={0} left={0}>
        <input
          color="black"
          value={debug}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setDebug(value);
          }}
        />
        <button
          onClick={() => {
            selectStoryPassage(debug as PassageId<keyof Scene>);
          }}
        >
          send
        </button>
      </styled.div> */}

      <VStack w={{ sm: "90%", md: "60%" }} mx="auto">
        <motion.div
          // initial="show"
          // animate="show"
          // exit="hidden"
          // variants={{
          //   hidden: { opacity: 0 },
          //   show: {
          //     opacity: [0, 1],
          //     transition: {
          //       duration: 1,
          //     },
          //   },
          // }}
          key={sceneId}
        >
          {scene && typeof scene === "string" ? (
            <styled.img alt={passageId} src={scene} w="50%" mx="auto" />
          ) : (
            scene
          )}
        </motion.div>
        <motion.ol
          // initial="show"
          // animate="show"
          // exit="hidden"
          // variants={container}
          className={css({
            display: "flex",
            justifyContent: "center",
            gap: 4,
            flexDir: "column",
            py: 8,
            w: "100%",
          })}
          key={`${passage?.conversation?.length} * ${Math.random() * 100}`}
        >
          {passage?.conversation?.map((conversation, idx) => {
            const character = characterDictionary[conversation.type];
            const isProtagonist =
              conversation.type === "inner" ||
              conversation.type === "outer" ||
              conversation.type === "narration";

            return (
              <motion.div
                variants={item}
                className={css({
                  display: "flex",
                  justifyContent: isProtagonist ? "flex-end" : "flex-start",
                })}
                key={`${idx}+${conversation.dialogue}+${Math.random() * 100}`}
              >
                <styled.p
                  fontSize="0.9rem"
                  display="flex"
                  gap={4}
                  p={3}
                  bg={
                    conversation.type === "narration"
                      ? "green.900"
                      : isProtagonist
                      ? "green.500"
                      : "gray.600"
                  }
                  alignItems="center"
                  borderRadius="sm"
                >
                  {!isProtagonist && (
                    <styled.img
                      h="50px"
                      w="50px"
                      borderRadius="300px"
                      border={`1px solid token(colors.slate.800)`}
                      bg="slate.800"
                      src={character?.img}
                      alt={`${character.name}`}
                    />
                  )}
                  <styled.div>
                    <styled.div fontWeight="extrabold">
                      {character.name}
                    </styled.div>
                    {conversation.dialogue}
                  </styled.div>
                </styled.p>
              </motion.div>
            );
          })}
        </motion.ol>
        <motion.div
          // initial="show"
          // animate="show"
          // exit="hidden"
          // variants={{
          //   hidden: { opacity: 0 },
          //   show: {
          //     opacity: [0, 1],
          //     transition: {
          //       duration: 1,
          //     },
          //   },
          // }}
          key={Math.random() * 10000}
          style={{ width: "100%" }}
        >
          <styled.ol display="flex" gap={4} flexDir="column" w="100%">
            {viewableOptions?.map(
              (
                optionPassage: PassageOptionType<keyof GameStateVariable>,
                idx
              ) => {
                return (
                  <PassageOption
                    onOptionSelect={selectStoryPassage}
                    option={optionPassage}
                    key={idx}
                  />
                );
              }
            )}
            {passage?.hasBackButton && <PassageBackButton />}
          </styled.ol>
        </motion.div>
      </VStack>
    </styled.div>
  );
};
