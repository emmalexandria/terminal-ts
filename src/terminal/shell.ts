import { applyStyle, StyleMap } from "./elements.js"
import { Terminal } from "./terminal.js"

const defaultShellStyles: StyleMap = {
  "prompt-character": {
    classes: ["prompt-character"],
    styles: { "user-select": "none" }
  },
  "prompt-input": {
    classes: ["prompt-input"],
    styles: { "resize": "none" }
  },
  "shell-container": {
    classes: ["shell-container"],
    styles: {}
  }
}


export class Shell {
  parent: HTMLElement
  element: HTMLDivElement
  inputElement: HTMLTextAreaElement
  styleMap: StyleMap
  terminal: Terminal

  constructor(element: HTMLElement, terminal: Terminal, styleMap?: StyleMap) {
    this.styleMap = { ...defaultShellStyles, ...styleMap }
    this.parent = element
    this.element = document.createElement('div')
    this.inputElement = document.createElement("textarea")
    this.terminal = terminal
    this.#initElement()
  }

  #initElement() {
    const promptTextSpan = document.createElement("span")
    applyStyle(promptTextSpan, this.styleMap["prompt-character"])
    promptTextSpan.textContent = ">"
    applyStyle(this.inputElement, this.styleMap["prompt-input"])
    this.inputElement.addEventListener("keypress", this.inputHandler)
    applyStyle(this.element, this.styleMap["shell-container"])
    this.element.replaceChildren(promptTextSpan, this.inputElement)
    this.parent.appendChild(this.element)
  }

  inputHandler = (ev: KeyboardEvent) => {
    if (ev.key == "Enter" && !ev.getModifierState("Shift")) {
      ev.preventDefault()
      this.terminal.input(this.inputElement.value);
      this.inputElement.value = "";
    }
  }

  update() {

  }
}
