import { ReactNode } from "react";
import { PasswordScene } from "../components/scenes/PasswordScene";
import { RobberyScene } from "../components/scenes/RobberyScene";
import { GameStateController, GameStateVariable } from "../story-store";

export interface Scene {
  release: {
    options:
      | "start"
      | "Say thanks to the officer"
      | "Wish the officer a good day";
  };
  vincent: {
    options:
      | "Leave the prison"
      | "Ignore the whispering noise"
      | "Pretend you know Vincent from school"
      | "Pretend you know Vincent from the gym"
      | "Investigate the whispering noise"
      | "I don't know what you're talking about."
      | "Yeah... that's me.";
  };
  flyer: {
    options:
      | "Take the flyer from Vincent's hands"
      | "Agree to Vincent's scheme"
      | "How do you know that?"
      | "In that case, that sounds pretty safe to me.";
  };
  debt: {
    options:
      | "Check the notification on your prison mandated phone."
      | "Put your prison mandated phone away."
      | "Ask Vincent what he's looking for in the house"
      | "Ask Vincent why he has a fruity drink"
      | "Ask to try the fruity drink";
  };
  arrival: {
    options: "Drink the fruity drink.";
  };
  security: {
    options:
      | "Accept that you've been kidnapped and look closer at the security system panel"
      | "You successfully break into the house";
  };
  house: {
    options:
      | "Go to the kitchen"
      | "Go to the bedroom"
      | "Go to the living area"
      | "Go to the office"
      | "Take sculptures"
      | "Take gold coins"
      | "Search through cabinets"
      | "Search through office drawers"
      | "Take desk lamp"
      | "Eat the second gold coin"
      | "Try doing the heimlich maneuver on yourself"
      | "Eat some of the candy"
      | "Tell Vincent you're ready to leave"
      | "Continue to let Vincent know you're ready to go";
  };
  final: {
    options:
      | "Hide and overhear conversation"
      | "Pretend you didn't hear anything and walk to Vincent as normal"
      | "Prepare a pineapple attack"
      | "Accept that you lost, and continue to the bad ending"
      | "Revel in your victory!";
  };
}

export type SceneDictionary<T extends keyof Scene> = {
  [key in T]: string | ReactNode;
};

export const sceneDictionary: SceneDictionary<keyof Scene> = {
  release: "release.png",
  vincent: "release-leave.png",
  flyer: "flyer.png",
  debt: "text-convo.png",
  arrival: "richard-outside.png",
  security: <PasswordScene />,
  house: <RobberyScene />,
  final: "",
};

export type Character =
  | "police"
  | "vincent"
  | "unknown"
  | "inner"
  | "outer"
  | "narration";

export const characterDictionary: {
  [key in Character]: { img?: string; name: string };
} = {
  police: { img: "police.png", name: "Officer" },
  vincent: { img: "vincent.png", name: "Vincent" },
  unknown: { img: "unknown.png", name: "Unknown" },
  inner: { name: "You (thinking)" },
  outer: { name: "You" },
  narration: { name: "" },
};

export type PassageId<T extends keyof Scene> = Scene[T]["options"];

export type PassageOptionType<U extends keyof GameStateVariable> =
  | PassageId<keyof Scene>
  | {
      id: PassageId<keyof Scene>;
      showIfChosenAlready?: boolean;
      label?: string;
      condition?: {
        key: U;
        callback: (variable: GameStateVariable[U]) => boolean;
      };
    };

export type PassageTrigger<K extends keyof GameStateController> =
  K extends keyof GameStateController
    ? { key: K; callback: GameStateController[K] }
    : undefined;

export type Passage<
  T extends keyof Scene,
  K extends keyof GameStateController,
  U extends keyof GameStateVariable
> = {
  [key in PassageId<T>]: {
    scene?: keyof Scene;
    hasBackButton?: boolean;
    options?: PassageOptionType<U>[];
    trigger?: PassageTrigger<K>;
    conversation?: {
      type: Character;
      dialogue: string;
    }[];
  };
};

function createPassages<T extends keyof Scene>(
  arg: Passage<T, keyof GameStateController, keyof GameStateVariable>
) {
  return arg;
}

const release: Passage<
  "release",
  keyof GameStateController,
  keyof GameStateVariable
> = {
  start: {
    scene: "release",
    conversation: [
      { type: "inner", dialogue: "I can't believe it's been 2 years..." },
      {
        type: "police",
        dialogue:
          "The exit is to the right. I don't want to see you back here.",
      },
    ],
    options: [
      "Say thanks to the officer",
      "Wish the officer a good day",
      "Leave the prison",
    ],
  },
  "Say thanks to the officer": {
    scene: "release",
    conversation: [
      { type: "outer", dialogue: "Okay thanks!" },
      {
        type: "police",
        dialogue: "...",
      },
    ],
    options: [
      "Say thanks to the officer",
      "Wish the officer a good day",
      "Leave the prison",
    ],
  },
  "Wish the officer a good day": {
    scene: "release",
    conversation: [
      { type: "outer", dialogue: "Have a good day" },
      {
        type: "police",
        dialogue: "...",
      },
    ],
    options: [
      "Say thanks to the officer",
      "Wish the officer a good day",
      "Leave the prison",
    ],
  },
};

const vincent: Passage<
  "vincent",
  keyof GameStateController,
  keyof GameStateVariable
> = {
  "Leave the prison": {
    scene: "vincent",
    conversation: [
      {
        type: "inner",
        dialogue: "It looks the exact same as two years ago.",
      },
      {
        type: "narration",
        dialogue: "You hear a faint whispering in the background",
      },
    ],
    options: [
      "Ignore the whispering noise",
      "Investigate the whispering noise",
    ],
  },
  "Investigate the whispering noise": {
    scene: "vincent",
    conversation: [
      {
        type: "outer",
        dialogue: "Hello? Do I know you?",
      },
      {
        type: "unknown",
        dialogue: "Yes! I know you!",
      },
      {
        type: "outer",
        dialogue: "That wasn't my question?",
      },
      {
        type: "vincent",
        dialogue: "I'm Vincent! ",
      },
    ],
    options: [
      "Pretend you know Vincent from school",
      "Pretend you know Vincent from the gym",
    ],
  },
  "Ignore the whispering noise": {
    scene: "vincent",
    conversation: [
      {
        type: "inner",
        dialogue: "I'm going to ignore the random whispering",
      },
      {
        type: "unknown",
        dialogue: "PSSTTT",
      },
      { type: "inner", dialogue: "Well, I can't ignore loud whispering" },
    ],
    options: ["Investigate the whispering noise"],
  },
  "Pretend you know Vincent from school": {
    scene: "vincent",
    conversation: [
      {
        type: "outer",
        dialogue:
          "Vincent! I know you from our second grade class with Miss White!",
      },
      { type: "vincent", dialogue: "Oh, huh maybe?" },
      {
        type: "vincent",
        dialogue:
          "Anyways, I heard you're the one that can break into Serenity System locks!",
      },
    ],
    options: ["I don't know what you're talking about.", "Yeah... that's me."],
  },
  "Pretend you know Vincent from the gym": {
    scene: "vincent",
    conversation: [
      { type: "outer", dialogue: "Vincent! I know you from the gym!" },
      { type: "vincent", dialogue: "What... I don't go to the gym." },
      {
        type: "vincent",
        dialogue:
          "Anyways, I heard you're the one that can break into Serenity System locks!",
      },
    ],
    options: ["I don't know what you're talking about.", "Yeah... that's me."],
  },
  "I don't know what you're talking about.": {
    scene: "vincent",
    conversation: [
      {
        type: "outer",
        dialogue:
          "I really think you have the wrong person. I don't know what you're talking about.",
      },
      {
        type: "vincent",
        dialogue: "Oh, I think you do.",
      },
      {
        type: "vincent",
        dialogue: "I need your help.",
      },
      {
        type: "vincent",
        dialogue: "I have your flyer too!",
      },
      {
        type: "narration",
        dialogue:
          "Vincent holds up a disgusting, nasty, flyer that you originally thought was a used tissue",
      },
    ],
    options: ["Take the flyer from Vincent's hands"],
  },
  "Yeah... that's me.": {
    scene: "vincent",
    conversation: [
      { type: "outer", dialogue: "That's me." },
      {
        type: "outer",
        dialogue: "Vincent, I just got out of prison for doing just that",
      },
      {
        type: "outer",
        dialogue: "Like 2 minutes ago.",
      },
      {
        type: "vincent",
        dialogue: "Listen, I need your help.",
      },
      {
        type: "vincent",
        dialogue: "I have your flyer too!",
      },
      {
        type: "narration",
        dialogue:
          "Vincent holds up a disgusting, nasty, flyer that you originally thought was a used tissue",
      },
    ],
    options: ["Take the flyer from Vincent's hands"],
  },
};

const flyer: Passage<
  "flyer",
  keyof GameStateController,
  keyof GameStateVariable
> = {
  "Take the flyer from Vincent's hands": {
    scene: "flyer",
    conversation: [
      {
        type: "narration",
        dialogue:
          "You take the repulsive flyer tainted with filth and an unpleasant odor.",
      },
      {
        type: "narration",
        dialogue:
          "Vincent is holding one of the flyers you made 2 days ago to advertise your lock breaking services that you let fly through a crack in the window.",
      },
      {
        type: "outer",
        dialogue: "Vincent I made this two days ago. How did it get so gross?",
      },
      {
        type: "outer",
        dialogue: "I actually don't want to know.",
      },
    ],
    options: ["Agree to Vincent's scheme"],
  },
  "Agree to Vincent's scheme": {
    conversation: [
      {
        type: "outer",
        dialogue: "So, what do you need help with?",
      },
      {
        type: "vincent",
        dialogue: "I want to break into Richard Thanyou's house.",
      },
      {
        type: "outer",
        dialogue:
          "You want to break into the head of security for Serenity System...?",
      },
      {
        type: "vincent",
        dialogue: "Yeah, he's going to Cabos over the weekend.",
      },
    ],
    options: [
      "In that case, that sounds pretty safe to me.",
      "How do you know that?",
    ],
  },
  "How do you know that?": {
    conversation: [
      {
        type: "outer",
        dialogue: "How in the world do you know that?",
      },
      {
        type: "vincent",
        dialogue: "We're in the same country club?",
      },
      {
        type: "vincent",
        dialogue: "You should ask less questions and just trust me.",
      },
    ],
    options: ["In that case, that sounds pretty safe to me."],
  },
  "In that case, that sounds pretty safe to me.": {
    conversation: [
      {
        type: "outer",
        dialogue: "Sounds perfectly reasonable.",
      },
      {
        type: "outer",
        dialogue: "What's in it for me?",
      },
      {
        type: "vincent",
        dialogue:
          "I just want access to his computer. Anything else in the house is for you.",
      },
      {
        type: "vincent",
        dialogue:
          "I heard you're still in major debt to Deb Kohl'Lector. So, you might find this helpful",
      },
      {
        type: "narration",
        dialogue: "Your prison mandated phone buzzes.",
      },
    ],
    options: ["Check the notification on your prison mandated phone."],
  },
};

const debt: Passage<
  "debt",
  keyof GameStateController,
  keyof GameStateVariable
> = {
  "Check the notification on your prison mandated phone.": {
    scene: "debt",
    conversation: [
      {
        type: "narration",
        dialogue: "You open the prison mandated iPhone 203",
      },
      {
        type: "inner",
        dialogue: "Wow, Deb did not forget my debt",
      },
      {
        type: "vincent",
        dialogue:
          "Deb did not forget your debt if that's what you're thinking.",
      },
    ],
    options: ["Put your prison mandated phone away."],
  },
  "Put your prison mandated phone away.": {
    conversation: [
      {
        type: "narration",
        dialogue: "You close the prison mandated iPhone 203.",
      },
      {
        type: "vincent",
        dialogue:
          "I am assuming your silence means you're onboard with the robbery.",
      },
      {
        type: "vincent",
        dialogue:
          "Richard has 1 master lock on his front door. Once you break into the lock, we can spend the rest of the time taking what we both need.",
      },
      {
        type: "narration",
        dialogue:
          "Vincent pulls out a refreshing, orange fruity drink from under his trench coat.",
      },
    ],
    options: [
      "Ask Vincent what he's looking for in the house",
      "Ask Vincent why he has a fruity drink",
    ],
  },
  "Ask Vincent why he has a fruity drink": {
    conversation: [
      {
        type: "outer",
        dialogue:
          "Vincent, why did you pull out a fruity drink from your trench coat?",
      },
      {
        type: "outer",
        dialogue: "Were you holding that drink the entire time?",
      },
      {
        type: "vincent",
        dialogue: "Yeah, I'm starting a fruit drink business.",
      },
      {
        type: "outer",
        dialogue: "What's in your drink? Pineapple?",
      },
      { type: "vincent", dialogue: "No, I'm highly allergic to pineapple." },
      {
        type: "vincent",
        dialogue:
          "It's a refreshing tropical orange drink, crafted from a blend of zesty mandarins, succulent mangoes, sun-kissed oranges, vibrant passion fruit, juicy guavas, exotic papayas, luscious apricots, invigorating tangerines, citrusy lemons, and tantalizing kiwis, resulting in a flavorful symphony of tropical delight.",
      },
      {
        type: "narration",
        dialogue:
          "Vincent pauses and looks at you, waiting for you to ask to try the drink.",
      },
    ],
    options: ["Ask to try the fruity drink"],
  },
  "Ask Vincent what he's looking for in the house": {
    conversation: [
      {
        type: "vincent",
        dialogue:
          "Let's stop with the questions. You really need to just trust me.",
      },
    ],
    options: ["Ask Vincent why he has a fruity drink"],
  },
  "Ask to try the fruity drink": {
    conversation: [
      {
        type: "vincent",
        dialogue: "Of course you can try the fruity drink!",
      },
      {
        type: "narration",
        dialogue: "Vincent hands you the fruit drink.",
      },
      {
        type: "narration",
        dialogue: "The fruit drink is surprisingly cold still.",
      },
    ],
    options: ["Drink the fruity drink."],
  },
};

const arrival: Passage<
  "arrival",
  keyof GameStateController,
  keyof GameStateVariable
> = {
  "Drink the fruity drink.": {
    scene: "arrival",
    conversation: [
      {
        type: "narration",
        dialogue:
          "You take a sip of the fruity drink, and fall to the ground. You wake up to find yourself in front of an apartment complex. You recognize the Serenity System alarm on the door.",
      },
      {
        type: "narration",
        dialogue: "Vincent is right next to you waving.",
      },
      {
        type: "vincent",
        dialogue: "We're here! Now please break in for me.",
      },
      {
        type: "outer",
        dialogue: "Vincent, did you drug me?",
      },
      {
        type: "vincent",
        dialogue: "Yes! It made for a super clean scene change!",
      },
    ],
    options: [
      "Accept that you've been kidnapped and look closer at the security system panel",
    ],
  },
};

const securty: Passage<
  "security",
  keyof GameStateController,
  keyof GameStateVariable
> = {
  "Accept that you've been kidnapped and look closer at the security system panel":
    {
      scene: "security",
    },
  "You successfully break into the house": {
    conversation: [
      {
        type: "narration",
        dialogue:
          "You easily bypass the Serenity Security system, and disable all alarms and traps in the house too.",
      },
      {
        type: "vincent",
        dialogue: "WOOOOOOOOOOO!",
      },
      {
        type: "vincent",
        dialogue: "I always knew you were good enough to get in.",
      },
      {
        type: "vincent",
        dialogue:
          "Meet me in the his office when you're finished getting what you need.",
      },
    ],
    options: [
      {
        id: "Go to the living area",
        label: "Enter the house",
        showIfChosenAlready: true,
      },
    ],
  },
};

const house: Passage<
  "house",
  keyof GameStateController,
  keyof GameStateVariable
> = {
  "Go to the office": {
    scene: "house",
    options: [
      "Take desk lamp",
      "Search through office drawers",
      { id: "Tell Vincent you're ready to leave", showIfChosenAlready: true },
    ],
  },
  "Go to the bedroom": {
    scene: "house",
    options: [
      "Take gold coins",
      { id: "Tell Vincent you're ready to leave", showIfChosenAlready: true },
    ],
  },
  "Go to the kitchen": {
    scene: "house",
    options: [
      "Search through cabinets",
      { id: "Tell Vincent you're ready to leave", showIfChosenAlready: true },
    ],
  },
  "Go to the living area": {
    scene: "house",
    options: [
      "Take sculptures",
      { id: "Tell Vincent you're ready to leave", showIfChosenAlready: true },
    ],
  },
  "Take sculptures": {
    conversation: [
      {
        type: "narration",
        dialogue: "You take the jagged statues you found on the table",
      },
      {
        type: "inner",
        dialogue: "I could probably sell this at a pawn shop.",
      },
    ],
    trigger: {
      key: "addBitcoin",
      callback: (prev) => prev + 10,
    },
    hasBackButton: true,
  },
  "Take desk lamp": {
    conversation: [
      {
        type: "narration",
        dialogue:
          "The lamp is nailed to the table. Ignoring that, you rip the lamp off the table and part of the table rips off as well.",
      },
      {
        type: "narration",
        dialogue:
          "In the process of the forcefully ripping the lamp out, you get three splinters in your left hand.",
      },
      {
        type: "inner",
        dialogue: "OUCH!",
      },
      {
        type: "narration",
        dialogue:
          "You'll need to buy band aids for your splinters. -10 bitcoins",
      },
    ],
    trigger: {
      key: "subtractBitcoin",
      callback: (prev) => prev - 10,
    },
    hasBackButton: true,
  },
  "Take gold coins": {
    conversation: [
      {
        type: "narration",
        dialogue:
          "You pick up some gold coins you saw on the ground. The first coin is pretty light and airy. You realize the gold is foil from a chocolate coin.",
      },
      {
        type: "narration",
        dialogue:
          "You eat the coin, feeling refreshed and rejuvenated. You can probably run a marathon if you were not robbing someone's house",
      },
    ],
    hasBackButton: true,
    options: ["Eat the second gold coin"],
  },
  "Eat the second gold coin": {
    conversation: [
      {
        type: "narration",
        dialogue:
          "The second coin doesn't have the same foil as the first. It takes you three times to start swallowing the second gold coin",
      },
      {
        type: "narration",
        dialogue: "It's metallic and doesn't taste as good as the first one.",
      },
      {
        type: "narration",
        dialogue:
          "You continue to try and swallow the coin, and manage to get it pass your airway",
      },
      {
        type: "narration",
        dialogue: "It can't go any further, so you end up choking on the coin",
      },
    ],
    options: ["Try doing the heimlich maneuver on yourself"],
  },
  "Try doing the heimlich maneuver on yourself": {
    conversation: [
      {
        type: "narration",
        dialogue:
          "You try doing the heimlich maneuver on yourself. However, you're unsure if you can do it on yourself?",
      },
      {
        type: "narration",
        dialogue:
          "You stumble into the hallway, knocking over a vase and gasping for air.",
      },
      {
        type: "narration",
        dialogue:
          "You manage to get the coin out of your airlock, and put the coin back into your pocket.",
      },
      {
        type: "narration",
        dialogue: "Why did you swallow the second coin? Are you stupid?",
      },
      {
        type: "narration",
        dialogue: "Go back to the bedroom to to think about what you just did",
      },
    ],
    options: [{ id: "Go to the bedroom", showIfChosenAlready: true }],
    trigger: {
      key: "addBitcoin",
      callback: (prev) => prev + 2000,
    },
  },
  "Search through cabinets": {
    conversation: [
      {
        type: "narration",
        dialogue:
          "You search through the cabinets and find a bottle of pineapple juice.",
      },
      {
        type: "inner",
        dialogue: "Hmm, this might come in handy later.",
      },
    ],
    trigger: {
      key: "takesPineappleJuice",
      callback: (prev) => !prev,
    },
    hasBackButton: true,
  },
  "Search through office drawers": {
    conversation: [
      {
        type: "narration",
        dialogue: "You find a mixed bag assorted of sour candies",
      },
    ],
    options: ["Eat some of the candy"],
    hasBackButton: true,
  },
  "Eat some of the candy": {
    conversation: [
      {
        type: "narration",
        dialogue:
          "You open the candy and start enjoying some of the sweet treats.",
      },
      {
        type: "narration",
        dialogue:
          "While biting into one of the candies, you knock your teeth on a diamond ring worth precisely 4052 bitcoin.",
      },
      {
        type: "inner",
        dialogue: "I guess eating random foods always leads to treaure!",
      },
    ],
    trigger: {
      key: "addBitcoin",
      callback: (prev) => prev + 4052,
    },
    options: [
      { id: "Go to the office", label: "Back", showIfChosenAlready: true },
    ],
  },
  "Tell Vincent you're ready to leave": {
    conversation: [
      {
        type: "inner",
        dialogue: "Should I leave? Did I forget anything?",
      },
    ],
    options: [
      "Continue to let Vincent know you're ready to go",
      {
        id: "Go to the living area",
        label: "Return to robbery",
        showIfChosenAlready: true,
      },
    ],
  },
  "Continue to let Vincent know you're ready to go": {
    conversation: [
      {
        type: "narration",
        dialogue:
          "You hear Vincent in the hallway making a phone call. He doesn't notice you quite yet.",
      },
    ],
    options: ["Hide and overhear conversation"],
  },
};

const final: Passage<
  "final",
  keyof GameStateController,
  keyof GameStateVariable
> = {
  "Hide and overhear conversation": {
    conversation: [
      {
        type: "vincent",
        dialogue: "Yeah, I'm going to do a betrayal or whatever.",
      },
      {
        type: "vincent",
        dialogue:
          "I just got Richard's pina colada recipe, and it'll be a great addition to my fruit selling business",
      },
      {
        type: "vincent",
        dialogue:
          "Eh, yeah I have my tracks covered. It'll look like just a normal robbery. I even have someone scrambling around taking things.",
      },
      {
        type: "vincent",
        dialogue: "Haha",
      },
    ],
    options: [
      "Pretend you didn't hear anything and walk to Vincent as normal",
      {
        id: "Prepare a pineapple attack",
        condition: {
          key: "hasPineappleJuice",
          callback: (hasPineappleJuice) => hasPineappleJuice === true,
        },
      },
    ],
  },
  "Prepare a pineapple attack": {
    conversation: [
      {
        type: "narration",
        dialogue:
          "You charge up an attack with the pineapple juice you found in the kitchen.",
      },
      {
        type: "narration",
        dialogue: "You unlock the cap of the juice and give it a throw.",
      },
      {
        type: "narration",
        dialogue: "The juice gets all over Vincent. His skins starts melting.",
      },
      {
        type: "vincent",
        dialogue: "AHHHHHHHHHH",
      },
      {
        type: "narration",
        dialogue: "Vincent turns into a puddle",
      },
    ],
    options: ["Revel in your victory!"],
  },
  "Pretend you didn't hear anything and walk to Vincent as normal": {
    conversation: [
      {
        type: "narration",
        dialogue: "As you walk closer, Vincent ends the phone call real quick",
      },
      {
        type: "vincent",
        dialogue: "Hey... just got a phone call from my landlord.",
      },
      {
        type: "narration",
        dialogue:
          "Before you can even react, Vincent does a flip and knocks you out with one swift kick.",
      },
    ],
    options: ["Accept that you lost, and continue to the bad ending"],
  },
  "Revel in your victory!": {
    conversation: [
      {
        type: "narration",
        dialogue:
          "You step over the Vincent puddle, and walk out of Richard's house",
      },
      {
        type: "narration",
        dialogue:
          "You tell Deb that Vincent is now just a puddle. Deb is actually debted to Vincent, so she forgets about your debt.",
      },
      {
        type: "narration",
        dialogue: "You are now free and rich with bitcoins.",
      },
    ],
  },
  "Accept that you lost, and continue to the bad ending": {
    conversation: [
      {
        type: "narration",
        dialogue: "To be transparent, you got the bad ending.",
      },
      {
        type: "narration",
        dialogue:
          "Vincent leaves you at the house unconscious once again and calls the cops. You're sentenced for an additional 15 years in prison for the robbery.",
      },
    ],
  },
};

export const passages: Passage<
  keyof Scene,
  keyof GameStateController,
  keyof GameStateVariable
> = createPassages({
  ...release,
  ...vincent,
  ...flyer,
  ...debt,
  ...arrival,
  ...securty,
  ...house,
  ...final,
});
