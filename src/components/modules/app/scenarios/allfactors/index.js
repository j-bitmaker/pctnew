import { mapState } from 'vuex';
import f from "@/application/shared/functions.js"
export default {
    name: 'allfactors',
    props: {
        select : {
            type : Object,
            default : () => {
                return {
                    context : 'factors'
                }
            }
        }
    },

    data : function(){

        return {
            loading : false,
            searchvalue : '',
            factors : []
        }

    },

    created (){
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        filtered : function(){
            if(this.searchvalue){

                return f.clientsearch(this.searchvalue, this.factors, (factor) => {
                    return (factor.name + ' ' + factor.type)
                })
            }
            else{
                return this.factors
            }
        },

        grouped : function(){

            return f.group(this.filtered, (f) => {
                return f.type
            })
        }
    }),

    methods : {
        search : function(v){
            this.searchvalue = v
        },

        load : function(){

            this.loading = true
            this.core.api.pctapi.stress.factors().then(r => {
                this.factors = r
            }).finally(() => {
                this.loading = false
            })
        },

        selected : function(factors){
            this.$emit('selected', factors)
            this.$emit('close')
        },

        selectFactor : function(factor){
            this.selected([factor])
        }
    },
}