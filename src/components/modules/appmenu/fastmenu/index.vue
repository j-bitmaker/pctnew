<template>
<div id="fastmenu" @click="close">
    <div class="items">

        <transition-group name="menu" tag="div">
            <div class="item" v-for="item in items" :key="item.id" @click="e => open(item)">
                <div>
                    <i v-if="item.icon" :class="item.icon"/>
                    <img :src="require('@/assets/' + item.svg)" v-if="item.svg"/>
                </div>
                <div class="label"><span>{{ $t(item.text) }}</span></div>
            </div>
        </transition-group>

    </div>

    <div class="help" @click="tohelp">
        <span>Help & getting started</span>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
