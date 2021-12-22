<template>
	<div>
		<p>Choose variant</p>
		<select id="variants">
			<option selected value="Shuuro">Shuuro</option>
		</select>
	</div>
</template>

<style scoped>
p {
	font-family: Signika;
	font-size: 2em;
	color: var(--primary-light);
}
select {
	text-align: center;
	font-size: 1.75em;
	font-family: Zilla-slab;
	width: 100%;
}
option {
	background-color: var(--primary-color);
	text-align: center;
}
option:active {
	background-color: var(--primary-color);
}
</style>
