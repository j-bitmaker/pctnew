<template>
<div class="settings_pdf">

    <linepreloader v-if="loading"/>

    <template v-else>
        <div class="row">
            <div class="label">
                <span>Disclosure</span>
            </div>
            <div class="setting">
                <button class="button small black" @click="editDisclosure"><i class="fas fa-edit"></i> Edit</button>
            </div>
        </div>

        <div class="row">
            <div class="label">
                <span>Logo</span> <i v-if="this.logotype" class="fas fa-check-circle good"></i>
            </div>
            <div class="setting">
                <upload :extensions="extensions" :images="images" @uploaded="imageChanged" @error="uploadError">
                    <template v-slot:content>
                        <button class="button small black" :style="logotypestyle">Upload logo</button>
                    </template>
                </upload>
                
                
            </div>
        </div>
    </template>

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
