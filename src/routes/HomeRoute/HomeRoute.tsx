import type { CollectionEntry } from "astro:content";
import { motion } from "motion/react";
import { Card } from "../../components/client/AppCard/AppCard";
import { MDXH1, MDXH2 } from "../../components/client/MDX/MDX";
import { UI } from "../../components/ui/ui";
import { AppUrl } from "../../domains/app-url/AppUrl";
import { Colors, type ColorType } from "../../domains/colors/colors";
import { getRandomElement } from "../../domains/utils/random";
import { Blinker } from "./components/Blinker";

export function HomeRoute(props: {
  topGames: Array<{
    game: CollectionEntry<"games">;
    creator: CollectionEntry<"creators">;
    assets: Array<CollectionEntry<"assets">>;
  }>;
  topResources: Array<{
    resource: CollectionEntry<"resources">;
    creator: CollectionEntry<"creators">;
  }>;
}) {
  return (
    <>
      {renderHeader()}
      <motion.div
        className="flex flex-col gap-5"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {renderResources()}
        {renderGames()}
      </motion.div>
    </>
  );

  function renderHeader() {
    return (
      <UI.Container size="4">
        <div className="my-3 flex flex-col items-center gap-3 md:flex-row lg:my-9">
          <div className="w-full md:w-[70%]">
            <div className="flex flex-col items-start justify-center gap-4">
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 0 }}
              >
                <MDXH1 className="xs:text-[3rem] text-[2rem] leading-[normal] md:text-[4rem]">
                  The best TTRPG
                  <br />
                  <span className="block bg-gradient-to-r from-zinc-900 to-zinc-300 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-600">
                    <Blinker
                      texts={[
                        "resource collection",
                        "dice roller",
                        "character keeper",
                      ]}
                    />
                  </span>
                </MDXH1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <UI.Text
                  color="gray"
                  size={{
                    initial: "3",
                    md: "4",
                  }}
                  mb="5"
                >
                  Roll dice, store characters, and design your own worlds.
                  <br /> Accessible, fast, and free.
                </UI.Text>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex flex-col gap-4 md:flex-row">
                  <a href="#get-started">
                    <UI.Button size="4" radius="full" className="">
                      Get Started
                    </UI.Button>
                  </a>
                  <a href={AppUrl.search({})}>
                    <UI.Button
                      size="4"
                      radius="full"
                      variant="outline"
                      className=""
                    >
                      Search for content
                    </UI.Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="relative hidden w-[40%] items-center justify-center md:flex">
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <div
                className="animate-blur absolute z-[-1] hidden h-[calc(100%+4rem)] w-[calc(100%+4rem)] rounded-lg opacity-60 dark:block"
                style={{
                  backgroundImage:
                    "linear-gradient(to right top, var(--accent-10), var(--accent-7), var(--accent-8), var(--accent-9), var(--accent-11))",
                }}
              />
              <img
                loading={"eager"}
                src={"/keeper/logo (bg-black).svg"}
                alt="Keeper"
                width={1000}
                height={1000}
                className={"rounded-2xl"}
              />
            </motion.div>
          </div>
        </div>
      </UI.Container>
    );
  }

  function renderResources() {
    return (
      <>
        <div className="pt-4" id="get-started">
          <MDXH2>Resources</MDXH2>
          <UI.Text color="gray" size="3" mb="4">
            Explore list of free and open resources to use in your games or to
            use to make your own.
          </UI.Text>
        </div>
        <div className="grid w-auto grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {props.topResources.map((item) => {
            return (
              <Card
                key={item.resource.id}
                href={AppUrl.resource({
                  id: item.resource.id,
                })}
                title={item.resource.data.name}
                subtitle={item.creator.data.name}
                accentColor={
                  item.resource.data.image === undefined
                    ? getRandomElement<ColorType>(
                        Colors.getAccentColors() as any,
                        item.resource.data.name,
                      )
                    : undefined
                }
              >
                {item.resource.data.image ? (
                  <img
                    loading={"eager"}
                    src={item.resource.data._optimizedImageSrc}
                    alt={item.resource.data.name}
                    style={{
                      position: "absolute",
                      objectFit: "cover",
                      objectPosition: "left",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : null}
              </Card>
            );
          })}
        </div>

        <a
          href={AppUrl.search({
            type: "resources",
          })}
          className="flex justify-center align-middle"
        >
          <UI.Button size="4" className="">
            View all
          </UI.Button>
        </a>
      </>
    );
  }

  function renderGames() {
    return (
      <>
        <div className="flex flex-col gap-2 pt-4" id="get-started">
          <MDXH2>Games</MDXH2>
          <UI.Text color="gray" size="3" mb="4">
            Play free TTRPGs and campaigns made using templates from the
            community.
          </UI.Text>
        </div>
        <div className="grid w-auto grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {props.topGames.map((item) => {
            return (
              <Card
                key={item.game.id}
                href={AppUrl.game({
                  id: item.game.id,
                })}
                title={item.game.data.name}
                subtitle={item.creator.data.name}
                accentColor={
                  item.game.data.image === undefined
                    ? getRandomElement<ColorType>(
                        Colors.getAccentColors() as any,
                        item.game.data.name,
                      )
                    : undefined
                }
              >
                {item.game.data.image ? (
                  <img
                    loading={"eager"}
                    src={item.game.data._optimizedImageSrc}
                    alt={item.game.data.name}
                    style={{
                      position: "absolute",
                      objectFit: "cover",
                      objectPosition: "left",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : null}
              </Card>
            );
          })}
        </div>
        <a
          href={AppUrl.search({
            type: "games",
          })}
          className="flex justify-center align-middle"
        >
          <UI.Button size="4" className="">
            View all
          </UI.Button>
        </a>
      </>
    );
  }
}
