import { mapState } from 'vuex';

export default {
	name: 'bigmainbutton',

	props: {
		icon : String,
		label : String,
		blabel : [String, Number],
		nlabel : [String, Number],
		active: Boolean
	},

	data : function(){

		return {
			loading : false
		}

	},

	created : () => {

	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
	}),

	methods : {
		
	},
}