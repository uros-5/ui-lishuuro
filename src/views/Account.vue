<template>
  <center-layout class="form-container">
    <router-link to="/my_games"> My games</router-link>
    <div class="account-part">
      <span class="form-label"> Username: </span>
      <BaseInput v-model="store.$state.username" desc="Username" disabled />
    </div>
    <div class="account-part">
      <span class="form-label">Email: &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; </span>
      <BaseInput type="email" v-model="store.$state.email" desc="email" />
      <div>
        <i class="fas fa-arrow-up icon-bigger"></i>
      </div>
    </div>
    <div class="account-part">
      <span class="form-label" style="margin-left: -0.28em"
        >Password: &nbsp;
      </span>

      <BaseInput
        type="password"
        v-model="store.$state.password"
        desc="password"
      />
      <div>
        <i class="fas fa-arrow-up icon-bigger"></i>
      </div>
    </div>

    <div class="account-part">
      <span class="form-label"> Country</span>
      <select
        name="countries"
        id="countries"
        style="
          font-size: 1em;
          border: 0;
          background-color: var(--primary-color);
        "
      >
        <option name="USA">USA</option>
      </select>
    </div>
    <div class="account-part">
      <span class="form-label"> About me:</span>
      <textarea
        rows="10"
        width="35"
        cols="max"
        style="font-size: 1.5em"
      ></textarea>
      <div>
        <i class="fas fa-arrow-up icon-bigger"></i>
      </div>
    </div>
    <div class="account-part">
      <BaseButton text="Delete account" style="font-size: 1.25em" />
    </div>
  </center-layout>
</template>
<script setup lang="ts">
import { useStore } from "@/store";
const store = useStore();
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import CenterLayout from "@/components/CenterLayout.vue";
</script>
<style scoped>
.form-container {
  display: flex;
  align-items: flex-start;
  padding: 1.75em;
  background-color: var(--primary-dark);
  border-radius: 0.35em;
  font-family: "Zilla Slab", serif;
  margin-bottom: 1.5em;
}

.account-part {
  display: inline-flex;
  flex-direction: row;
  gap: 0.5em;
}

a,
.form-label {
  color: var(--primary-light);
  font-size: 2.5rem;
  text-decoration: none;
}

.icon-bigger {
  font-size: 2rem;
  color: var(--primary-light);
  cursor: pointer;
  border: 1px solid black;
  border-radius: 0.3em;
  padding: 0.5em;
  transition: color 0.35s;
}

.icon-bigger:hover {
  color: var(--primary-darker);
  cursor: pointer;
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 970px) {
  .account-part {
    flex-direction: column;
  }

  .form-label {
    margin-left: 0;
  }
}
</style>
