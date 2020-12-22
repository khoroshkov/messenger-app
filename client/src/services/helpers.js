export default function arrayEquality(a, b) {
  if (a.lenght !== b.lenght) return false;

  a.sort();
  b.sort();

  return a.every((element, index) => {
    return element === b[index];
  });
}
