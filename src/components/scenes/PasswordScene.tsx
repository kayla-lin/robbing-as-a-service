import { ChangeEvent, useState } from "react";
import { HStack, VStack, styled } from "../../../styled-system/jsx";
import { useStoryControls } from "../../hook/useStoryControls";

const PASSWORD_ANSWER = "1234";

export const PasswordScene = () => {
  const [password, setPassword] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const { selectStoryPassage } = useStoryControls();

  const onPasscodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setPassword(value);
  };

  const onPasscodeEnter = () => {
    if (password === PASSWORD_ANSWER) {
      selectStoryPassage("You successfully break into the house");
    } else {
      setPassword("");
      setIsWrong(true);
    }
  };

  return (
    <VStack w="2xl" gap={8} pos="relative">
      <styled.p
        fontSize="2xl"
        fontFamily="cursive"
        color={isWrong ? "red.400" : "slate.800"}
        pos="absolute"
        bottom={-36}
        left={-8}
        transform="rotate(-10deg)"
        maxW="md"
      >
        {isWrong
          ? "The passcode is literally 1234"
          : "Richard, the default password is 1234. Please change this ASAP! - Maintenance "}
      </styled.p>
      <styled.h1 fontSize="5xl">Richard Thanyou's Residence</styled.h1>
      <styled.h1 fontSize="2xl">Enter Password</styled.h1>
      <HStack w="100%" h="50px">
        <styled.input
          w="100%"
          color="black"
          h="100%"
          value={password}
          onChange={onPasscodeChange}
        />
        <styled.button
          py={2}
          px={4}
          h="100%"
          bg="purple.500"
          onClick={onPasscodeEnter}
          _hover={{ bg: "purple.700" }}
        >
          Enter
        </styled.button>
      </HStack>
    </VStack>
  );
};
