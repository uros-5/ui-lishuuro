export const useShuuroHead = () => {
  const id = useState("gameid");

  return {
    title: headTitle(`Player1 vs Player2 - Live Shuuro Game - ${id}`),
    meta: [
      { name: "description", content: `Shuuro game` },
      { name: "author", content: "Uros" },
    ],
  }
}
