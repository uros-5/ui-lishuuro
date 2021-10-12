<script lang="ts">
import { each } from "svelte/internal";
import { Board } from "./board";
import { MoveGenerator } from "./move";
let board = new Board();
let mG = new MoveGenerator(54, board);
let b = mG.run();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<h1> { b } </h1>
