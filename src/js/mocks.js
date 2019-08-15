const mockTemplate = (strings, ...args) =>
  strings.reduce(
    (currentString, nextString, nextIndex) =>
      (currentString += (args[nextIndex - 1] || '') + nextString)
  );

export const css = mockTemplate;
export const html = mockTemplate;
