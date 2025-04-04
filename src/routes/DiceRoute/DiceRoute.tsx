import { Container, Heading } from "@radix-ui/themes";
import { DiceRoller } from "../../components/client/DiceRoller/DiceRoller";

export function DiceRoute() {
  return (
    <Container
      maxWidth={"600px"}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-col gap-4 rounded-sm border border-gray-200 bg-gray-50 pt-6 dark:bg-gray-900 [body]:bg-gray-50">
        <div className="px-6">
          <Heading>Dice Roller</Heading>
        </div>
        <DiceRoller button={false} />
      </div>
    </Container>
  );
}
