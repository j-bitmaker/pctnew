<template>
<div class="portfolios_analysis">

	<!--<div class="navwrapper mobp">
		<linenavigation :items="navigation" :navdefault="navdefault" :buttons="true" :navkey="navkey" />
	</div>-->

	<linepreloader v-if="loading" />

	<component v-else :is="module" :assets="assets" :assetsinfo="assetsinfo" :portfolio="portfolio"/>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
