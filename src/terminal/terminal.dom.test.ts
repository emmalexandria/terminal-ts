import { test, expect } from "vitest"
import { Ansi16, Attribute, Color, renderTerminalText } from "./terminal.js";

test("Test basic rendering", () => {
  const text = "Hello"
  const expected = document.createElement("p")
  expected.style.display = "inline-block";
  expected.style.margin = "0";
  expected.style.whiteSpace = "pre-wrap";
  expected.textContent = text;
  expected.classList.add("fg-red bg-bright-green bold")

  const rendered = renderTerminalText({ text: text, fg: new Color({ ansi16: Ansi16.RED }), bg: new Color({ ansi16: Ansi16.BRIGHTGREEN }), attributes: [Attribute.BOLD] })
  expect(rendered).toEqual(expected)
})

test("Test link rendering", () => {
  const text = "Hello"
  const expected = document.createElement("a")
  expected.href = "/hello";
  expected.target = "_blank";
  expected.style.display = "inline-block";
  expected.style.margin = "0";
  expected.style.whiteSpace = "pre-wrap";
  expected.textContent = text;
  expected.classList.add("fg-red bg-bright-green bold")

  const rendered = renderTerminalText({
    text: text, fg: new Color({ ansi16: Ansi16.RED }), bg: new Color({ ansi16: Ansi16.BRIGHTGREEN }), attributes: [Attribute.BOLD], link: {
      href: "/hello",
      target: "_blank"
    }
  })
  expect(rendered).toEqual(expected)
})
