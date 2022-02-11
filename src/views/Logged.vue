<template>
    <p> user is logged </p>
</template>

<script lang="ts" setup>
import { useUser } from '@/store/useUser';
import router from '@/router';
import { onMounted } from 'vue';

const store = useUser();

onMounted ( () => { store.updateAnonCookie(); router.push("/") });
</script>


