export function simplifyNumber(num: number): string {
  if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    // Remove trailing zero if the decimal part is .0
    return formattedNum.endsWith(".0") ?
        `${parseInt(formattedNum)}k`
      : `${formattedNum}k`;
  }
  return num.toString();
}
