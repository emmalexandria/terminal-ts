import { Terminal } from "terminal/terminal";
import { getCursorPosition, setCursorPosition } from "./util";
import { boolUndefinedDefault } from "./util.js";

interface Binding {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: (t: Terminal, input: HTMLElement, ev: KeyboardEvent) => void;
}

const bindings: Binding[] = [
  {
    key: "Enter",
    action: (t, input, ev) => {
      if (input.textContent) {
        t.input(input.textContent);
      }
      input.textContent = "";
      setCursorPosition(input, 0);
      return true;
    },
  },
];

export function keyboardInputHandler(
  ev: KeyboardEvent,
  terminal: Terminal,
  input: HTMLElement,
) {
  handleSpecialKeys(ev, terminal, input);
}

function matchBinding(ev: KeyboardEvent, b: Binding): boolean {
  //This is ugly but it leads to a nice API for bindings so tis fine
  if (
    matchModifier(b.altKey, ev.altKey) &&
    matchModifier(b.ctrlKey, ev.ctrlKey) &&
    matchModifier(b.metaKey, ev.metaKey) &&
    matchModifier(b.shiftKey, ev.shiftKey)
  ) {
    if (b.key == ev.key) {
      return true;
    }
  }

  return false;
}

function matchModifier(b: boolean | undefined, ev: boolean): boolean {
  return boolUndefinedDefault(b) == ev;
}

function handleSpecialKeys(
  ev: KeyboardEvent,
  terminal: Terminal,
  input: HTMLElement,
): boolean {
  for (const b of bindings) {
    if (matchBinding(ev, b)) {
      ev.preventDefault();
      b.action(terminal, input, ev);
      return true;
    }
  }
  return false;
}
