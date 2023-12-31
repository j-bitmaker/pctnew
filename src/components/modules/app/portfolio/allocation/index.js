import { mapState } from 'vuex';

import allocationMain from "./main/index.vue"

import { Allocation } from '@/application/charts/index';

var allocation = new Allocation()

export default {
	name: 'allocation',
	props: {
		assets : Array,
		portfolio : Object
	},

	components : {
		allocationMain
	},
	data : function(){

		return {

			loading : false,
			activegrouping : 'group',
			groups : allocation.groups()

		}

	},

   

	created : () => {

	},

	watch: {
        
    },
	computed: mapState({
		auth : state => state.auth
	}),

	methods : {
		grouping : function(e){
			this.activegrouping = e.target.value
		},
	},
}