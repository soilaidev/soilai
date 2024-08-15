export function createStyledElement<K extends keyof HTMLElementTagNameMap>(
  elementType: K,
  styles: Partial<CSSStyleDeclaration>,
  attributes: Partial<HTMLElementTagNameMap[K]> = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(elementType);

  // Apply styles
  Object.assign(element.style, styles);

  // Apply attributes
  Object.assign(element, attributes);

  return element;
}
