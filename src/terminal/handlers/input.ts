import { Terminal } from "terminal/terminal";
import { getCursorPosition, setCursorPosition } from "./util";

export function keyboardInputHandler(
  ev: KeyboardEvent,
  terminal: Terminal,
  input: HTMLElement,
) {
  ev.preventDefault();
  if (!handleSpecialKeys(ev, terminal, input)) {
    input.textContent += ev.key;
    let position = getCursorPosition(input);
    if (!position) {
      position = 0;
    }

    setCursorPosition(input, position + 1);
  }
}

function handleSpecialKeys(
  ev: KeyboardEvent,
  terminal: Terminal,
  input: HTMLElement,
): boolean {
  switch (ev.key) {
    case "Enter":
      console.log("Hello");
      if (input.textContent) {
        terminal.input(input.textContent);
      }
      input.textContent = "";
      setCursorPosition(input, 0);
      return true;
      break;
  }

  return false;
}
