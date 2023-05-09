export default defineNuxtRouteMiddleware((to, from) => {
  useState('username',() => to.params.username)
})
