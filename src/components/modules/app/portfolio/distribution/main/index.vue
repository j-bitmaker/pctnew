<template>
<div id="distribution_main">

    <linepreloader v-if="loading"/>

    <div v-else>
        <div class="summary mobp">
            <summarybutton v-for="item in summary" :key="item.index" :text="item.text" :number="deviation[item.index]" />
        </div>
        <div class="chartWrapper mobp">
            <highcharts :options="chartOptions"></highcharts>
        </div>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
