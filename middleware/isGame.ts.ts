export default defineNuxtRouteMiddleware((to, from) => {
  useState('gameid', () => to.params.id)
})
