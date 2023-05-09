<template>
  <UserProfile />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "user-profile",
});

const username = useState("username");
useHead({
  title: headTitle(username.value as string),
  meta: [
    {
      name: "description",
      content: `Check all the games by ${username.value}`,
    },
    { name: "keywords", content: `${username.value} shuuro` },
  ],
});
</script>
