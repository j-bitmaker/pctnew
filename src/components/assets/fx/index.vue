<template>
<div id="fx">
	<div class="container" ref="container" v-if="!loading">
	</div>
</div>
</template>

<style scoped lang="sass">
.container
	position: fixed
	left: 0%
	right: 0%
	top : 0%
	bottom : 0%
	z-index: 20000
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'fx',
	props: {
		
	},
	data : function(){
		return {
			loading : true
		}
	},
	computed: mapState({
		auth : state => state.auth,
		fx : state => state.fx,
		position : function(){
			if(!this.fx) return {}

			return this.fx.place
		}
	}),

	watch : {
		fx : {
			immediate : true,
			handler : function(){
				this.make()
			}
		}
	},

	methods: {
		make(){

			if(!this.core.fx){
				this.$store.commit('FX')
			}
			
			this.core.fx.prepare(() => {
				this.loading = false

				setTimeout(() => {
					this.core.fx.effect(this.$refs.container, this.fx.name, this.fx.parameters, () => {
						this.$store.commit('FX')
					})
				},50)
			})

			
		}
	},
}
</script>
