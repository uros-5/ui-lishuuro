export default defineNuxtRouteMiddleware((to, from) => {
  useState("game", () => {
    if(to.params.id && to.params.stage) {
      return {id: to.params.id, stage: to.params.stage};
    }
    else if(to.params.slug) {
      return {id: to.params.slug[1], stage: to.params.slug[0]}
    }
    else {
      return {id: null, stage: null}
    }
  })
})
