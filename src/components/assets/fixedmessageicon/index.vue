<template>
  <div
    id="wai-fixedmessageicon"
  >
    <div class="wrapper">
        <div class="cell">
          <div class="iconWrapper" v-if="icon">
            <sweetalert :icon="icon" />
          </div>

          <div class="message" v-if="message">
            <div>{{ message }}</div>
          </div>
        </div>
      </div>
  </div>
</template>

<script src="./index.js"></script>
<style scoped lang="sass" src="./index.sass"></style>

<!-- THEMES BEGIN -->
<!-- THEMES END -->



































