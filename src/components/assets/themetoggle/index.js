import { mapState } from 'vuex';

export default {
    name: 'themeToggle',
    props: {
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
        theme : state => state.theme
    }),

    methods : {
        set : function(v){
            this.$store.commit('theme', v)

            this.core.activity.template('action', this.core.activity.actions.themeToggle())
        },

        seta : function(){
            var v = 'white'

            if(this.theme == 'white') v = 'black'

            this.set(v)
        }
    },
}