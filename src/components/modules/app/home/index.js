import { mapState } from 'vuex';


import bigmainbutton from "@/components/delements/bigmainbutton/index.vue";
import notifications from "@/components/modules/notifications/index.vue";
import homeAdd from "@/components/modules/app/home/add/index.vue";

export default {
	name: 'home',
	props: {
	},

	components : {
		bigmainbutton,
		notifications,
		homeAdd
	},

	data : function(){

		return {
			loading : false
		}

	},

	created () {
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
        mobileview : state => state.mobileview,

		checkLicenceCRM : function(state){
			return state.features['CRM'] && state.features['CRM'].valid
		},
		
		features : function(state){
			return state.features
		}
		
	}),

	methods : {
		notifications : function(id){
			
			var c = this.$store.state.updates[id] || 0

			return Math.min(c, 99)
		},

		lbl : function(id){
			return this.$store.state.updates[id] || 0
		}
	},
}