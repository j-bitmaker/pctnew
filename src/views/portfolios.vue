<template>
<div class="page">

	<topheader>
		<template v-slot:info>
			<span>Portfolios</span>
		</template>
		<template v-slot:right>
			<div class="buttonpanel">
				<i class="fas fa-plus" @click="newportfolio"></i>
			</div>
		</template>
	</topheader>

	<maincontent>
		<template v-slot:content>
			<portfoliosmainlist @directoryChange="directoryChange" ref="portfolios" :scroll="scroll" @open="open"/>
		</template>
	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

import portfoliosmainlist from "@/components/modules/app/portfolios/main/index.vue";

export default {
	name: 'portfolios_page',
	components: {
		portfoliosmainlist
	},

	computed: mapState({
		mobileview : state => state.mobileview,
	}),

	props : {
		scroll : Number
	},

	data : function(){
		return {
			currentroot : 0
		}
		
	},

	methods: {

		directoryChange : function(v){
			this.currentroot = v
		},
		newportfolio : function(){
			this.$store.commit('OPEN_MODAL', {
				id : 'modal_portfolios_edit',
				module : "portfolio_edit",
				caption : "New Portfolio",

				data : {
					currentroot : this.currentroot
				},

				events : {
					edit : (data) => {
						this.$refs.portfolios.reload(data)
					}
				}
			})
		},

		open : function(portfolio){


			if(this.mobileview){
				this.$router.push('/portfolio/' + portfolio.id).catch(e => {})
			}
			else{
				this.$router.push('/summary?id=' + portfolio.id).catch(e => {})
			}

		}
	},

	mounted() {

	}
}
</script>
