import { mapState } from 'vuex';
import {Chart} from 'highcharts-vue'

import summarybutton from '@/components/delements/summarybutton/index.vue'
import { Distribution } from '@/application/charts/index';

var distribution = new Distribution()

export default {
    name: 'distribution_main',
    props: {
        portfolio : Object,
        period : Number,
        current_std : Number
    },

    components : {
        highcharts : Chart,
		summarybutton
    },

    data : function(){

        return {
            loading : false,

            deviation : {},

			summary : [

				{
					text : 'labels.sharperatio',
					index : 'sharpeRatio'
				},
				{
					text : 'labels.standartdeviation',
					index : 'standardDeviation'
				}
			],
        }

    },

    created : () => {

    },

    watch: {
        portfolio : {
			immediate : true,
			handler : function(){
				this.load()
			}
		}
    },
    computed: mapState({
        auth : state => state.auth,

        series : function(){

			return distribution.series({
				total : this.portfolio.total(),
				locale : this.core.user.locale,
				deviation : this.deviation,
				period : this.period,
				current_std : this.current_std
			})

		},

		chartOptions: function(){

			return distribution.chartOptions(this.series)

		}
    }),

    methods : {
        load : function(){
			this.loading = true

			this.core.pct.standartDeviation(this.portfolio.id).then(r => {
				this.deviation = r

				return Promise.resolve(r)
			}).finally(() => {
				this.loading = false
			})
		},
    },
}