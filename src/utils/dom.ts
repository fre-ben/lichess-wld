import type { BoardOrientation } from "../types/lichess";

/**
 * Gets the current orientation of the board. The return value is the color which is at the bottom of the board.
 * @returns {string} "black" or "white"
 */
export function getBoardOrientation(): BoardOrientation {
  if (document.querySelector(".orientation-black")) {
    return "black";
  } else {
    return "white";
  }
}

/**
 * Gets the DOM element where the user name is located.
 * @param {string} userName
 * @returns {Element}
 */
export function getPlayerDOMElement(userName: string): Element {
  const linkElements = Array.from(document.querySelectorAll("a"));
  const nameElements = Array.from(document.querySelectorAll("name"));

  const userNameElement = linkElements.filter(
    (element) =>
      element.textContent?.includes(userName) &&
      element.className.includes("text")
  );

  if (!userNameElement.length && nameElements.length === 1) {
    return nameElements[0];
  } else {
    return userNameElement[0];
  }
}

/**
 * Creates a div Element used as Root for React to be injected into.
 * @param userNameElement DOM Element of a user
 * @param rootId ID used for targeting the DOM Element
 * @returns {Element} Root Element
 */
export function injectReactRootIntoDOM(
  userNameElement: Element | undefined,
  rootId: string
): Element {
  const root = document.createElement("div");
  root.id = rootId;

  userNameElement?.insertAdjacentElement("afterend", root);

  return root;
}
