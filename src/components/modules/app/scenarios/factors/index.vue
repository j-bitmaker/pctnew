<template>
<div class="scenarios_factors">
        
    <div class="mobp infopt">
        <div class="caption">
            <span>Factors</span>
        </div>
    </div>

    <div class="factors ">
        <list :items="info.factors">
            <template v-slot:default="slotProps">

                <div class="factor mobp" :negative="slotProps.item.value < 0">
                    <div class="name">
                        <span>{{slotProps.item.name}}</span>
                    </div>
                    <div class="value">
                        <div class="valwrapper">
                            <value v-if="!inbps(slotProps.item)" :value="value(slotProps.item)" mode="p" />

                            <span v-else>{{value(slotProps.item)}}</span>
                        </div>
                    </div>
                </div>

            </template>
        </list>
    </div>
    

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
