const controlCharactersExceptWhitespace = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeTextInput(value: string): string {
  return value
    .normalize("NFKC")
    .replace(controlCharactersExceptWhitespace, "")
    .replace(/\r\n?/g, "\n")
    .trim();
}

export function sanitizeSingleLineTextInput(value: string): string {
  return sanitizeTextInput(value).replace(/\s+/g, " ");
}
