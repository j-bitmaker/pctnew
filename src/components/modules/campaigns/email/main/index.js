import { mapState } from 'vuex';

import f from "@/application/shared/functions.js"

import htmleditor from '@/components/common/htmleditor/index.vue'

export default {
    name: 'campaigns_template_main',
    props: {
        emailTemplate : Object,
        clone : Boolean
    },

    components : {
        htmleditor
    },
    data : function(){

        return {
            prev : '',
            name : '',
            subject : '',
            body : ''
        }

    },

    created() {
        this.name = this.emailTemplate.Name || ""
        this.subject = this.emailTemplate.Subject || ""
        this.body = this.emailTemplate.Body || ""


        
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        valid : function(){

            if(this.name && this.subject && this.body) return true

            return false
        },
        haschanges : function(){
            return this.name != this.emailTemplate.Name || 
                this.subject != this.emailTemplate.Subject || 
                this.body != this.emailTemplate.Body
        },
        auth : state => state.auth
    }),

    methods : {

        save : function(){

            var promise = null

            

            if (this.emailTemplate.Id){
                promise = this.core.campaigns.updateEmailTemplate({
                    Name : this.name,
                    Subject : this.subject,
                    Body : this.body,
                    Id : this.emailTemplate.Id
                })
            }
            else{
                promise = this.core.campaigns.createEmailTemplate({
                    Name : this.name,
                    Subject : this.subject,
                    Body : this.body
                }).then(r => {
                    this.$router.replace('/campaigns/emailtemplate/' + r.Id).catch(e => {})
                })
            }

            
        },
        cancel : function(){

            if(!this.haschanges){

                this.close()
                return
            }

            return this.$dialog.confirm(
                this.$t('campaigns.labels.emailTemplateCancel'), {
                okText: this.$t('yes'),
                cancelText : this.$t('no')
            })
    
            .then((dialog) => {

                this.name = this.emailTemplate.Name
                this.subject = this.emailTemplate.Subject
                this.body = this.emailTemplate.Body

            })
            
        },

        close : function(){
            this.$emit('close')
        },

        keyupSubject(evt) {
            this.core.campaigns.varhelper(evt.target, () => {
                //this.$refs['subject'].change()
                this.subject = evt.target.value

                
            })
        },
        keyupEditor(evt) {
            this.core.campaigns.varhelper(document.getSelection().focusNode, () => {
                this.$refs.htmleditor.sync()
            })
        },
    },
}