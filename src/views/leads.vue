<template>
<div class="page">

	<topheader>
		<template v-slot:info>
			<span>Leads</span>
		</template>
		<template v-slot:right>

			<div class="buttonpanel" @click="newlead">
				<i class="fas fa-plus"></i>
			</div>

			<div class="buttonpanel" @click="sharequestionnaire">
				<i class="fas fa-link"></i>
			</div>
		</template>
	</topheader>

	<maincontent>

		<template v-slot:content>
			<leads ref="list" type="lead"/>
		</template>

	</maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import leads from "@/components/modules/app/contacts/index.vue";

export default {
	name: 'leads_page',
	components: {
		leads

	},

	computed: {

	},

	methods: {
		sharequestionnaire: function () {

			this.core.activity.template('action', this.core.activity.actions.sharequestionnaire())
			this.core.vueapi.sharequestionnaire()
			
		},

		newlead : function(){

			this.core.vueapi.createContact({
				Type : "LEAD"
			}, (data) => {

				if(this.$refs['list']) this.$refs['list'].search(data.FName + " " + data.LName)

			}, {
				caption : "New lead"
			})
		},

		reload(){
			if(this.$refs['list']) this.$refs['list'].reload()
		}
	},

	mounted() {
		//if(this.$refs['list']) this.$refs['list'].search("max grishkov")
	}
}
</script>
