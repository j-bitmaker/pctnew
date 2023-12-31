import { mapState } from 'vuex';

export default {
    name: 'assets_asset',
    props: {
        asset : Object,
        info : {
            type : Object,
            default : () => {
                return {}
            }
        },

        mode : {
            type : String,
            default : 'd'
        },

        portfolio : Object
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