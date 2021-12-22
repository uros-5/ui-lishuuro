<template>
  <div class="my-games-container">
    <div class="userinfo">userinfo</div>
    <div class="username"><h1>-username-</h1></div>
    <div class="matches">
      <table>
        <tr>
          <th>VS</th>
          <th>RESULT</th>
          <th>DATE</th>
        </tr>
        <tr v-for="i in 10" :key="i">
          <td class="vs-url">Hikaru</td>
          <td class="result-url">1-0</td>
          <td>05-10-2021</td>
        </tr>
      </table>
      <div class="options">
        <p>&lt;</p>
        <p>&gt;</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style>
.my-games-container {
  display: grid;
  grid-template-areas: ". username ." " . userinfo ." "matches matches matches" "matches matches matches";
  grid-template-columns: 2fr 3fr 2fr;
  gap: 1em;
  width: 100%;
}

.all-games {
  grid-area: matches;
  display: flex;
  flex-wrap: wrap;
  max-width: 1080px;
  background-color: #e6e6e652;
  padding: 0.5em;
  gap: 1em;
}

.userinfo {
  grid-area: userinfo;
  color: white;
}

.username {
  grid-area: username;
  text-align: center;
  font-size: 0.95em;
  color: var(--primary-color);
  padding: 0.1em;
  border-bottom: 5px double black;
}

.matches {
  grid-area: matches;
  text-align: center;
  font-family: "Zilla Slab", serif;
  font-size: 1.5em;
  background-color: var(--primary-light);
  margin-right: 0.5em;
}
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
@media (max-width: 970px) {
  .matches {
    margin-right: 0;
  }
}
table {
  width: 85%;
  padding: 0.5em;
  margin: 1.5em auto;
}
th {
  background: var(--primary-dark);
  padding: 0.2em;
}

td {
  padding: 0.2em;
}

.result-url,
.vs-url {
  cursor: pointer;
  transition: transform 0.3s;
}

.result-url:hover {
  transform: scale(1.2);
}

.vs-url {
  text-decoration: underline;
}

tr:hover {
  color: white;
  background-color: var(--primary-dark);
}

.options {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1.5em;
}

.options p {
  color: white;
  font-size: 1.2em;
}
.options p:hover {
  color: black;
  cursor: pointer;
}
</style>
