<template>
<div class="campaign_step_ifstep" >

    <smeta :step="step" :editing="editing">

        <template v-slot:content>
            <div>
                <div class="caption">

                    <div class="header">

                        <linepreloader v-if="loading"/>
                        <template v-else>
                            <div class="iconwrapper">
                                <div class="icon">
                                    <i class="fas fa-map-signs"></i>
                                </div>
                            </div>

                            <div class="txt" v-if="refer">
                                <span v-if="template"> The email &ldquo;{{template.Name}}&rdquo; has been read?</span>
                                <span v-else>Email template for statement hasn't loaded</span>
                            </div>

                            <div class="txt" v-if="!refer">
                                <span>Please select email for statement</span>
                            </div>
                        </template>
                    </div>

                 
                    
                </div>

                <div class="ifbody" :class="result" v-if="refer">

                    <div class="ifbridge enter start">
                        <div class="inner">
                            <div class="left cb"><div class="bridge"></div></div>
                            <div class="right cb"><div class="bridge"></div></div>
                        </div>
                    </div>

                    <div class="successpart">
                        <div class="iftime">
                            <div class="timeline">
                                <div class="stepfill"></div>
                            </div>
                        </div>
                        <div class="listWrapper" >
                            <div class="ifcaption">
                                <span>Yes</span>
                            </div>
                            <campaignsStepsList :campaign="campaign" @change="list => changeList('success', list)" :editing="editing" v-if="(step.success && step.success.length) || editing" :level="level + 1" :steps="step.success || []"/>
                        </div>
                    </div>

                    <div class="ifbridge beetween leave">
                        <div class="inner">
                            <div class="left cb"><div class="bridge"></div></div>
                            <div class="right cb"><div class="bridge"></div></div>
                        </div>
                    </div>

                    <div class="ifbridge beetween enter">
                        <div class="inner">
                            <div class="left cb"><div class="bridge"></div></div>
                            <div class="right cb"><div class="bridge"></div></div>
                        </div>
                    </div>

                    <div class="failedpart" >
                        <div class="iftime">
                            <div class="timeline">
                                <div class="stepfill"></div>
                            </div>
                        </div>
                        <div class="listWrapper">
                            <div class="ifcaption">
                                <span>No</span>
                            </div>
                            <campaignsStepsList :campaign="campaign" @change="list => changeList('fail', list)" :editing="editing" v-if="(step.fail && step.fail.length) || editing" :level="level + 1" :steps="step.fail || []"/>
                        </div>
                        
                    </div>

                    <div class="ifbridge leave end">
                        <div class="inner">
                            <div class="left cb"><div class="bridge"></div></div>
                            <div class="right cb"><div class="bridge"></div></div>
                        </div>
                    </div>
                </div>
                
            </div>
        </template>

        <template v-slot:menu>
            <slot name="menu"></slot>
        </template>

    </smeta>

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
