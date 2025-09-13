export async function waitSec(sec = 2) {
  return new Promise((r) => setTimeout(r, sec * 1000));
}
