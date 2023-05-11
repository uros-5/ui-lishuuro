export const useShuuroHead = (title: string) => {

  return {
    title: headTitle(`${title}`),
    meta: [
      { name: "description", content: `Shuuro game` },
      { name: "author", content: "Uros" },
    ],
  }
}
