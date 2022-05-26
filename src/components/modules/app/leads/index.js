import { mapState } from 'vuex';
import f from "@/application/functions.js";
import lead from './lead/index.vue'
import _ from 'underscore';

export default {
	name: 'app_leads',
	props: {
		actions : Array,
		select : Object,

		hasmenu : {
			type : Boolean,
			default : true
		}
	},

	components : {lead},

	data : function(){

		return {
			loading : false,
			searchvalue : '',
			count : 0,
		   
			sort : 'FName_asc',
			sorting : {
				FName_asc : {
					text : 'fname_asc',
					field : 'FName',
					sort : 'asc'
				},
				FName_desc : {
					text : 'fname_desc',
					field : 'FName',
					sort : 'desc'
				}
			},



		}

	},

	created : function() {
	
	},

	watch: {
		tscrolly : function(){


			if (this.$refs['list']){


				if (this.$refs['list'].height() - 1000 < this.tscrolly + this.dheight){
					this.$refs['list'].next()
				}
				
			}
			
		}
	},

	computed: mapState({
		auth : state => state.auth,
		tscrolly : state => state.tscrolly,
		dheight : state => state.dheight,
		
		payload : function(){

			var orderBy = {}

			orderBy[this.sorting[this.sort].field] = this.sorting[this.sort].sort

			return {
				orderBy,
				query : this.core.crm.query('simplesearch', {search : this.searchvalue, type : "LEAD"})
			}
		},

		elheight : function(){

			return f.mobileview() ? 195 : 120
		},

		menu : function(){
			return this.actions ? this.actions : [

				{
					text : 'labels.leadstocontacts',
					icon : 'fas fa-user-friends',
					action : this.leadstocontacts
				},
			   
				{
					text : 'labels.deleteleads',
					icon : 'fas fa-trash',
					action : this.deletecontacts
				},

			]
		}
	}),

	methods : {

		search : function(v){

			this.searchvalue = v
		},

		setcount : function(v){
			this.count = v
		},

		sortchange : function(v){
			this.sort = v
		},

		edit : function(profile){
			if(this.$refs['list']) this.$refs['list'].datachanged(profile, "ID")
		},

		reload : function(){
			if(this.$refs['list']) this.$refs['list'].reload()
		},

		open : function(client){

			if (this.select){
				this.$emit('selected', [client])
				this.$emit('close')
			}
			else{
				this.$store.commit('OPEN_MODAL', {
					id : 'modal_client_page',
					module : "lead_page",
					caption : "",
					mclass : 'withoutheader',
					data : {
						
						leadid : client.ID
					},
	
					events : {
						leadtocontact : (lead) => {
							this.deletelead(lead)
						}
					}
				})
			}

		},

		leadstocontacts : function(leads){

			this.$store.commit('globalpreloader', true)

			return this.core.crm.leadtocontacts(_.map(leads, (s) => {return s.ID})).then(r => {

				this.deleteleads(leads)

				//this.$router.push('/clients')

			}).catch(e => {

				this.$store.commit('icon', {
					icon: 'error',
					message: e.error
				})

			}).finally(() => {
				this.$store.commit('globalpreloader', false)
			})

		},

		deletecontacts : function(contacts){
			///

			this.deleteleads(contacts)
		},	
		////////////


		deleteleads : function(cc){
			_.each(cc, (profile) => {
				if(this.$refs['list']) this.$refs['list'].datadeleted(profile, "ID")
			})
		},

		deletelead : function(c){
			return this.deleteleads([c])
		},

		leadtocontactClbk : function(profile){
			this.deletelead(profile) /// from list
		}

	},
}