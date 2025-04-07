import { Card, Container, Heading } from "@radix-ui/themes";
import { DiceRoller } from "../../components/client/DiceRoller/DiceRoller";
import { getTheme } from "../../domains/utils/getTheme";

const themeProps = getTheme({});

export function DiceRoute() {
  return (
    <Container
      maxWidth={"600px"}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <Card className="p-0">
        <div className="flex flex-col gap-4 bg-(--gray-1)">
          <div className="px-6 pt-6">
            <Heading>Dice Roller</Heading>
          </div>
          <DiceRoller button={false} theme={themeProps} />
        </div>
      </Card>
    </Container>
  );
}
