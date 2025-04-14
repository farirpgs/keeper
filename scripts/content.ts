import Bun, { Glob } from "bun";
import kebabCase from "lodash/kebabCase";
import startCase from "lodash/startCase";
import path from "path";
import prompts from "prompts";
import { Colors } from "../src/domains/colors/colors";
import { constants } from "../src/domains/utils/constants";
import { getLogger } from "../src/domains/utils/getLogger";

const logger = getLogger("Content");
const contenetTypes = ["creator", "game", "asset", "resource"] as const;
type ContentType = (typeof contenetTypes)[number];

const site = constants.site({ localhost: true });
const contentResult = await prompts({
  type: "select",
  name: "value",
  message: "What type of content do you want to create?",
  choices: contenetTypes.map((content) => {
    return {
      title: startCase(content),
      value: content,
    };
  }),
});

const type = contentResult.value as ContentType;

switch (type) {
  case "creator":
    await createCreator();
    break;
  case "game":
    await createGame();
    break;
  case "asset": {
    await createAsset();
    break;
  }
  case "resource":
    await createResource();
    break;
}

async function createCreator() {
  // NAME
  const nameForm = await prompts({
    type: "text",
    name: "value",
    message: "What is the name of the creator?",
  });
  if (!nameForm.value) {
    logger.error("Operation cancelled, no name provided");
    return;
  }

  const creatorSlug = kebabCase(nameForm.value);

  await saveFileAndOpenInEditor(
    path.join(process.cwd(), `src/content/creators/${creatorSlug}.mdx`),
    `---
name: ${nameForm.value}
---`,
  );

  logger.log(`✨ Creator created. ${site}/creators/${creatorSlug}`);
}

async function createGame() {
  // CREATOR
  const creatorSlugs = await getAllCreatorSlugs();
  const creatorForm = await prompts({
    type: "autocomplete",
    name: "value",
    message: "Who is the creator of the game?",
    choices: creatorSlugs.map((creatorSlug) => {
      return {
        title: startCase(creatorSlug),
        value: creatorSlug,
      };
    }),
  });
  if (!creatorForm.value) {
    logger.error("Operation cancelled, no creator provided");
    return;
  }

  // NAME
  const nameForm = await prompts({
    type: "text",
    name: "value",
    message: "What is the name of the game?",
  });
  if (!nameForm.value) {
    logger.error("Operation cancelled, no name provided");
    return;
  }

  // ACCENT COLOR
  const accentColorForm = await prompts({
    type: "autocomplete",
    name: "value",
    message: "What is the accent color of the game?",
    choices: Colors.getAccentColors().map((color) => {
      return {
        title: startCase(color),
        value: color,
      };
    }),
  });

  const gameSlug = kebabCase(nameForm.value);

  await saveFileAndOpenInEditor(
    path.join(
      process.cwd(),
      `src/content/games/${creatorForm.value}/${gameSlug}/index.mdx`,
    ),
    `---
name: ${nameForm.value}
creator: ${creatorForm.value}
theme:
  accentColor: ${accentColorForm.value}
---

`,
  );

  logger.log(`✨ Game created. ${site}/games/${creatorForm.value}/${gameSlug}`);
}

async function createAsset() {
  // CREATOR
  const creatorSlugs = await getAllCreatorSlugs();
  const creatorForm = await prompts({
    type: "autocomplete",
    name: "value",
    message: "Who is the creator of the asset?",
    choices: creatorSlugs.map((creatorSlug) => {
      return {
        title: startCase(creatorSlug),
        value: creatorSlug,
      };
    }),
  });
  if (!creatorForm.value) {
    logger.error("Operation cancelled, no creator provided");
    return;
  }

  // GAME
  const gameSlugs = await getAllGameSlugs(creatorForm.value);
  const gameForm = await prompts({
    type: "autocomplete",
    name: "value",
    message: "What game is this asset for?",
    choices: gameSlugs.map((gameSlug) => {
      return {
        title: startCase(gameSlug),
        value: gameSlug,
      };
    }),
  });
  if (!gameForm.value) {
    logger.error("Operation cancelled, no game provided");
    return;
  }

  // NAME
  const nameForm = await prompts({
    type: "text",
    name: "value",
    message: "What is the name of the asset?",
  });
  if (!nameForm.value) {
    logger.error("Operation cancelled, no name provided");
    return;
  }

  const nameSlug = kebabCase(nameForm.value);

  await saveFileAndOpenInEditor(
    path.join(
      process.cwd(),
      `src/content/assets/${creatorForm.value}/${gameForm.value}/${nameSlug}.mdx`,
    ),
    `---
name: ${nameForm.value}
game: ${creatorForm.value}/${gameForm.value}
---

`,
  );

  logger.log(
    `✨ Asset created. ${site}/games/${creatorForm.value}/${gameForm.value}/${nameSlug}`,
  );
}

async function createResource() {
  // CREATOR
  const creatorSlugs = await getAllCreatorSlugs();
  const creatorForm = await prompts({
    type: "autocomplete",
    name: "value",
    message: "Who is the creator of the resource?",
    choices: creatorSlugs.map((creatorSlug) => {
      return {
        title: startCase(creatorSlug),
        value: creatorSlug,
      };
    }),
  });
  if (!creatorForm.value) {
    logger.error("Operation cancelled, no creator provided");
    return;
  }

  // NAME
  const nameForm = await prompts({
    type: "text",
    name: "value",
    message: "What is the name of the resource?",
  });
  if (!nameForm.value) {
    logger.error("Operation cancelled, no name provided");
    return;
  }

  // ACCENT COLOR
  const accentColorForm = await prompts({
    type: "autocomplete",
    name: "value",
    message: "What is the accent color of the game?",
    choices: Colors.getAccentColors().map((color) => {
      return {
        title: startCase(color),
        value: color,
      };
    }),
  });

  const nameSlug = kebabCase(nameForm.value);

  await saveFileAndOpenInEditor(
    path.join(
      process.cwd(),
      `src/content/resources/${creatorForm.value}/${nameSlug}/index.mdx`,
    ),
    `---
name: ${nameForm.value}
creator: ${creatorForm.value}
theme:
  accentColor: ${accentColorForm.value}
---

`,
  );

  logger.log(
    `✨ Resource created. ${site}/resources/${creatorForm.value}/${nameSlug}`,
  );
}

async function getAllCreatorSlugs() {
  const creatorGlob = new Glob(
    path.join(process.cwd(), `src/content/creators/**`),
  );
  const directories: Array<string> = [];
  for await (const file of creatorGlob.scan({
    cwd: process.cwd(),
    onlyFiles: false,
  })) {
    const fileExtension = path.extname(file);

    const isDirectory = fileExtension === "";
    if (!isDirectory) {
      directories.push(file.split(".").slice(0, -1).join(""));
    }
  }
  const creatorSlugs = directories.map((directory) => {
    return directory.split("/").pop();
  });
  return creatorSlugs;
}

async function getAllGameSlugs(creatorSlug: string) {
  const creatorGlob = new Glob(
    path.join(process.cwd(), `src/content/games/${creatorSlug}/**/*.mdx`),
  );
  const directories: Array<string> = [];
  for await (const file of creatorGlob.scan({
    cwd: process.cwd(),
    onlyFiles: false,
  })) {
    const fileExtension = path.extname(file);

    const isDirectory = fileExtension === "";
    if (!isDirectory) {
      const sections = file.split("/");
      sections.pop();
      const name = sections.pop();
      directories.push(name as string);
    }
  }
  return directories.map((directory) => {
    return directory.split("/").pop();
  });
}

async function saveFileAndOpenInEditor(filePath: string, content: string) {
  await Bun.write(filePath, content);
  Bun.openInEditor(filePath);
}
