export function checkGameOver(arr) {
  return arr.length === 1;
}

export function checkWinner(arr, player) {
  return arr.length === 1 ? player : "";
}
