<template>
  <div class="movelist-block">
    <div id="movelist">
      <div class="move counter">1</div
      ><div class="move" ply="1"><san>N@b1</san><eval id="ply1"></eval></div
      ><div class="move" ply="2"><san>R@c8</san><eval id="ply2"></eval></div
      ><div class="move counter">2</div>
      <div class="move" ply="3"><san>R@d1</san><eval id="ply3"></eval></div
      ><div class="move" ply="4"><san>R@h8</san><eval id="ply4"></eval></div
      ><div class="move counter">3</div
      ><div class="move" ply="5"><san>Q@e1</san><eval id="ply5"></eval></div>
      <div class="move" ply="6"><san>Q@d8</san><eval id="ply6"></eval></div
      ><div class="move counter">4</div
      ><div class="move" ply="7"><san>R@f1</san><eval id="ply7"></eval></div
      ><div class="move" ply="8"><san>K@g8</san><eval id="ply8"></eval></div>
      <div class="move counter">5</div
      ><div class="move" ply="9"><san>K@g1</san><eval id="ply9"></eval></div
      ><div class="move" ply="10"><san>B@f8</san><eval id="ply10"></eval></div
      ><div class="move counter">6</div> <div class="counter">53</div
      ><div class="active" ply="105"
        ><san>Rh8#</san><eval id="ply105"></eval
      ></div>
      <div id="result">Checkmate, 1-0</div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.move.counter {
  color: Gray;
  flex: 0 0 13%;
  background-color: var(--bg-color2);
  text-align: center;
}

.move {
  line-height: 1.9em;
  float: left;
  flex: 0 0 43.5%;
  padding-left: 6px;
  box-sizing: border-box;
  justify-content: center;
}
</style>
