export function resultMessage(
  result: string,
  status: number,
  players: [string, string]
): string {
  switch (status) {
    case -2:
      return "Playing right now";
    case -1:
      return "Playing right now";
    case 0:
      return "Game aborted";
    case 1:
      return `Checkmate, ${winner(result)}`;
    case 2:
      return `${result === "1-0" ? players[0] : players[1]}, resigned`;
    case 3:
      return "Stalemate";
    case 4:
      return "Draw by repetition";
    case 5:
      return "Draw";
    case 6:
      return "Draw by material";
    case 7:
      return `${resignedWinner(result, players)} resigned.`;
    case 8:
        return `Timeout, ${resignedWinner(result, players)} ${isDraw(result)}`;
    default:
      return "";
  }
}

export function winner(result: string): string {
  return result.endsWith("w") ? "1 - 0" : "0 - 1";
}

export function resignedWinner(result: string, players: [string, string]): string {
    if (result == "") { return "" }
    return result.startsWith("w") ? players[0] : players[1];
}

export function isDraw(result: string): string {
    return result == "" ? "draw" : "lost.";
}
