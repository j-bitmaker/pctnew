<template>
<div class="page">

    <topheader back="/">
        <template v-slot:info>
            <span></span>
        </template>
        <template v-slot:right>
			<div class="buttonpanel">
				<router-link to="/support">
					<i class="fas fa-headset"></i>
				</router-link>
			</div>
		</template>
    </topheader>

    <maincontent>
        <template v-slot:content>
            <profile />
        </template>
    </maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import profile from "@/components/modules/profile/index.vue";

export default {
    name: 'profile_page',
    components: {
        profile
    },

    methods: {

    },

    mounted() {

    }
}
</script>
