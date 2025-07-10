/**
 * Returns a string of class names based on the input array of strings and objects.
 * @param items An array of strings and objects. If an object is provided, the key is used as the class name if the value is truthy.
 * @returns A string of class names.
 *
 * @example
 * const className = classnames([
 *   'class1',
 *   'class2',
 *   { active: true },
 *   { selected: false }
 * ]);
 */

export function classnames(
  items: Array<string | { [key: string]: boolean | null | undefined }>,
) {
  let className = "";

  items.forEach((item) => {
    if (typeof item === "string") {
      className += ` ${item}`;
    } else if (typeof item === "object") {
      Object.entries(item).forEach(([key, value]) => {
        if (value) {
          className += ` ${key}`;
        }
      });
    }
  });

  return className.trim();
}
