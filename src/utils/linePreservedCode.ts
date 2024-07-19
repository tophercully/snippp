export const linePreservedCode = (code: string) => {
  return code.replace(
    /\r\n/g,
    String.fromCharCode(13) + String.fromCharCode(10),
  ) as string;
};
