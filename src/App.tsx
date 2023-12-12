import { PassageContainer } from "./components/PassageContainer";
import { passages } from "./consts/story";
import { useStoryStore } from "./story-store";

function App() {
  const { currentPassageId } = useStoryStore();

  return (
    <>
      <PassageContainer passageId={currentPassageId} passages={passages} />
    </>
  );
}

export default App;
