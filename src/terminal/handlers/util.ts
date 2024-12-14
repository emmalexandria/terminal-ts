export const getCursorPosition = (el: HTMLElement) => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  if (!range) {
    return;
  }

  const clonedRange = range.cloneRange();
  if (!clonedRange) {
    return;
  }

  clonedRange.selectNodeContents(el);
  clonedRange.setEnd(range.endContainer, range.endOffset);
  const cursorPosition = clonedRange.toString().length;
  return cursorPosition;
};

export const setCursorPosition = (el: HTMLElement, position: number) => {
  const selection = window.getSelection();
  const range = document.createRange();
  range.setStart(el, position);
  range.setEnd(el, position);

  range.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(range);
};
