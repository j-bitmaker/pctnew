<template>
<div id="root" :class="{summaryview, anim}">

    <div class="cameramoduleWrapper" v-if="camera">
        <camera v-bind="camera.data || {}" v-on="camera.events" @close="closeCamera" />
    </div>

    <div class="topheader mn" v-show="!camera">
        <topmenu />
    </div>

    <div class="rootapp" v-show="!camera">

        <div class="refresher" :style="{opacity : refreshPosition > 0 ? 1 : 0, transform : 'translateY('+refreshPosition+'%)'}">
            <div>
                <i class="fas fa-spinner" :class="{'fa-spin' : refreshPosition > 0}"></i>
            </div>
        </div>

        <appmenu v-if="auth == 1" />

        <vue-page-transition name="fade-in-right">

            <swipable :directions="directions" @end="refresh">
                <router-view v-if="isRouterAlive"></router-view>
            </swipable>
            
        </vue-page-transition>

    </div>

    <gallery v-if="gallery && !camera" :images="gallery.images" :index="gallery.index" @close="closeGallery" />

    <modals v-if="!camera" />

    <actual />

    <fx v-if="fx" />

    <transition name="fade" v-if="iconshow">
        <fixedmessageicon />
    </transition>

    <div class="dropFile" v-if="dropfile">
        <div>
            <span>Drop files here</span>
        </div>
    </div>

    <!-- and other modals -->

    <preloader v-if="globalpreloader" />

</div>
</template>

<script src="./index.js"></script>

<style lang="sass" src="./index.sass"></style>
