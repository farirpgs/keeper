export const DiceCommands = {
  coin: {
    label: "Coin",
    roll() {
      const coin = ["H", "T"];
      return coin[getRandomIndex(2)].toString();
    },
  },
  d4: {
    label: "1d4",
    roll() {
      const d4 = makeNormalDie(4);
      return d4[getRandomIndex(4)].toString();
    },
  },
  d6: {
    label: "1d6",
    roll() {
      const d6 = makeNormalDie(6);
      return d6[getRandomIndex(6)].toString();
    },
  },
  d8: {
    label: "1d8",
    roll() {
      const d8 = makeNormalDie(8);
      return d8[getRandomIndex(8)].toString();
    },
  },
  d10: {
    label: "1d10",
    roll() {
      const d10 = makeNormalDie(10);
      return d10[getRandomIndex(10)].toString();
    },
  },
  d12: {
    label: "1d12",
    roll() {
      const d12 = makeNormalDie(12);
      return d12[getRandomIndex(12)].toString();
    },
  },
  d20: {
    label: "1d20",
    roll() {
      const d20 = makeNormalDie(20);
      return d20[getRandomIndex(20)].toString();
    },
  },
  d100: {
    label: "1d100",
    roll() {
      const d100 = makeNormalDie(100);
      return d100[getRandomIndex(100)].toString();
    },
  },
  "2d6": {
    label: "2d6",
    roll() {
      const d6 = makeNormalDie(6);
      return (d6[getRandomIndex(6)] + d6[getRandomIndex(6)]).toString();
    },
  },
  "4dF": {
    label: "4dF",
    roll() {
      const fudge = [-1, 0, 1];
      return (
        fudge[getRandomIndex(3)] +
        fudge[getRandomIndex(3)] +
        fudge[getRandomIndex(3)] +
        fudge[getRandomIndex(3)]
      ).toString();
    },
  },
  dF: {
    label: "1dF",
    roll() {
      const fudge = [-1, 0, 1];
      return fudge[getRandomIndex(3)].toString();
    },
  },
} as const;

export type DiceCommandsType = keyof typeof DiceCommands;
export const diceCommandList = Object.keys(DiceCommands) as DiceCommandsType[];

function getRandomIndex(arrayLength: number): number {
  return Math.trunc(Math.random() * arrayLength);
}

function makeNormalDie(sides: number) {
  return new Array(sides).fill(0).map((el, i) => {
    return i + 1;
  });
}
