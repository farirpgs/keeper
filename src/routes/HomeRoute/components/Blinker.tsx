import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { wait } from "../../../domains/utils/wait";

export function Blinker(props: { texts: Array<string> }) {
  const indexRef = useRef(0);
  const [text, setText] = useState(props.texts[indexRef.current]);
  const [blinkVisible, setBlinkVisible] = useState(true);
  const timeoutRef = useRef<Timer | null>(null);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    clearTimeout(timeoutRef.current!);
    setText(props.texts[indexRef.current]);

    switcher();

    return () => clearTimeout(timeoutRef.current!);
  }, [props.texts]);

  async function switcher() {
    timeoutRef.current = setTimeout(async () => {
      setTyping(true);
      const nextIndex =
        indexRef.current + 1 >= props.texts.length ? 0 : indexRef.current + 1;
      const oldText = props.texts[indexRef.current];
      const newText = props.texts[nextIndex];

      // remove old text
      for (const char of oldText) {
        await wait(30);
        flushSync(() => {
          setText((prev) => prev.slice(0, prev.length - 1));
        });
      }

      // add new text
      for (const char of newText) {
        await wait(30);
        flushSync(() => {
          setText((prev) => prev + char);
        });
      }

      await wait(500);
      setTyping(false);
      indexRef.current = nextIndex;
      switcher();
    }, 3000);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <span>
      {text || <>&nbsp;</>}
      <span
        className={clsx({
          visible: blinkVisible || typing,
          hidden: !blinkVisible && !typing,
        })}
      >
        |
      </span>
    </span>
  );
}
