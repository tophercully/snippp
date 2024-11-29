export function simplifyNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) {
    return "0";
  }
  if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return formattedNum.endsWith(".0") ?
        `${parseInt(formattedNum)}k`
      : `${formattedNum}k`;
  }
  return num.toString();
}
