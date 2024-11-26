export interface ElementStyle {
  classes: string[];
  styles: { [style: string]: string }
}

export interface StyleMap { [identifier: string]: ElementStyle }


export const applyStyle = (element: HTMLElement, style: ElementStyle) => {
  style.classes.forEach((c) => element.classList.add(c))
  Object.entries(style.styles).forEach((style) => {
    element.style.setProperty(style[0], style[1])
  })
}




