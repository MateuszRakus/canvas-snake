export function leftPad(string, length, char) {
  let result = string;
  for (let i = 0; i < (length - string.length); i++) {
    result = char + '' + result;
  }
  return result;
}