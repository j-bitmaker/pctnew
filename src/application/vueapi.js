class Vueapi {
    constructor(core){

        this.core = core
        this.store = this.core.store
        this.router = this.core.vm.$router
        this.vm = core.vm

    }

    selectClients = function(success, p = {}){

        if (p.selected){
            this.store.commit('select', {
                context : 'client',
                items : p.selected
            })
        }

        this.store.commit('OPEN_MODAL', {
            id : 'modal_clients',
            module : "clients",
            caption : "Select Client",
            data : {
                select : {
                    context : 'client',
                    filter : p.filter,
                    disabled : p.one ? true : false
                },

                hasmenu : false
            },

            events : {
                selected : (clients) => {
                    if(success) success(clients)
                }
            }
        })
    }

    selectClientToPortfolios = function(portfolios, success){

        this.selectClients((clients) => {
            var client = clients[0]

            this.core.pct.setPortfoliosToClient(client.ID, portfolios, {
                preloader : true,
                showStatus : true
            }).then(r => {

                if (success)
                    success(client)

            })
        })

    }

    selectPortfolios = function(success, p = {}){


        if (p.selected){
            this.store.commit('select', {
                context : 'portfolio',
                items : p.selected
            })
        }

        this.store.commit('OPEN_MODAL', {
            id : 'modal_portfolios_main',
            module : "portfolios_main",
            caption : "Select Portfolios", /// TODO captions
    
            data : {
                
                select : {
                    context : "portfolio",
                    filter : p.filter,
                    disabled : p.one ? true : false
                },

                hasmenu : false

            },
    
            events : {
                selected : (portfolios) => {
                    if(success) success(portfolios)
                }
            }
        })
    }

    selectPortfoliosToClient = function(profile, success){

        var set = (portfolios) => {
            this.core.pct.setPortfoliosToClient(profile.ID, portfolios, {
                preloader : true,
                showStatus : true
            }).then(r => {

                if(success) success(portfolios)

            }).catch(e => {

            })
        }

        this.selectPortfolios((portfolios) => {


            var portfoliosWithContact = _.filter(portfolios, portfolio => {
                return portfolio.crmContactId && portfolio.crmContactId != profile.ID
            })

            if(!portfoliosWithContact.length){
                set(portfolios)
            }
            else{

                return this.vm.$dialog.confirm(
                    this.vm.$t('labels.portfolioswithclientq'), {
                    okText: this.vm.$t('labels.portfolioswithclientyes'),
                    cancelText : 'No'
                })
        
                .then((dialog) => {

                    set(portfolios)

                }).catch( e => {
                    
                })
            }

            

        }, {
            filter : (portfolio) => {
                return portfolio.crmContactId && portfolio.crmContactId != profile.ID
            }
        })

       
    }

    editPortfolio = function (portfolio, success) {
        this.store.commit('OPEN_MODAL', {
            id : 'modal_portfolio_edit',
            module : "portfolio_edit",
            caption : "Edit Portfolio",
            data : {
                edit : {
                    name : portfolio.name,
                    assets : portfolio.positions,
                    id : portfolio.id
                }
            },
    
            events : {
                edit : (portfolio) => {
                    if(success) success(portfolio)
                }
            }
        })
    }

    selectFolder = function(success){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_filesystem',
            module : "filesystem",
            caption : "Select folder",
            data : {

                fclass : 'expanded',
                purpose : 'selectFolder'
                
            },
            events : {
                selected : (items) => {
                    var item = items[0]

                    if(success) success(item)

                }
            }
        })
    }

    editClient = function(profile, success){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_client_edit',
            module : "client_edit",
            caption : "Edit client",
    
            data : {
                edit : profile
            },
    
            events : {
                success : (data) => {
                    var profile = _.extend(profile, data)
                    
                    success(profile)
                    //this.$emit('edit', profile)
                }
            }
        })
    }

    createContact = function(payload, success, p = {}){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_client_edit',
            module : "client_edit",
            caption : p.caption || "New contact",
    
            data : {
                payload : payload || {}
            },
    
            events : {
                success : (data) => {
                    success(data)
                }
            }
        })
    }

    sharequestionnaire = function(){

        this.core.api.crm.questionnaire.getlink(null, {
            preloader : true
        }).then(url => {

            this.share({url}, {
                caption: "Share Questionnaire"
            })

        }).catch(e => {
            
            this.store.commit('icon', {
                icon: 'error',
                message: e.error
            })

        })

    }

    share = function(data, p = {}){

        this.store.commit('OPEN_MODAL', {
            id: 'modal_share',
            module: "share",
            caption: p.caption || "Share",
            mclass : 'small',
            data : data
        })

    }
    

    scenarioManager = function(success, p = {}){


        this.store.commit('OPEN_MODAL', {
            id : 'modal_scenarios_list',
            module : "scenarios_list",
            caption : "Scenario manager", /// TODO captions
    
            data : {

            },
    
            events : {
               
            }
        })
    }

    newPortfolio = function () {
        this.store.commit('OPEN_MODAL', {
            id : 'modal_portfolio_edit',
            module : "portfolio_edit",
            caption : "New Portfolio",
            data : {
            },
    
            events : {
                edit : (portfolio) => {
                    this.router.push('portfolio/' + portfolio.id)
                }
            }
        })
    }

    newClient = function () {
        this.createContact({type : "CLIENT"}, (data) => {
            if (data.ID)
                this.router.push('client/' + data.ID)
        }, {
            caption : "New client"
        })

    }

    newLead = function () {
        this.createContact({type : "LEAD"}, (data) => {

            if (data.ID)
                this.router.push('lead/' + data.ID)

        }, {
            caption : "New lead"
        })

    }

    fileManager = function(data, events, p = {}){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_filemanager',
            module : "filemanager",
            caption : "File manager",
    
            data : data || {},
            events : events
        })
    }

    fileManager_File = function(file, events, p = {}){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_filemanager_file',
            module : "filemanager_file",
            caption : p.name || "File",
            mclass : 'withoutheader',
            data : {
                file
            },
            events : events
        })
    }

    pdfviewer = function(file, events = {}, p = {}){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_pdfviewer',
            module : "pdfviewer",
            caption : "Pdf viewer",
            mclass : 'withoutheader',
            data : {
                file
            },
            events : events
        })
    }

    pincode = function(mode = 'create', attemp, check){

        var hascode = false

        return new Promise((resolve, reject) => {

            this.store.commit('OPEN_MODAL', {
                id : 'modal_pincode',
                module : "pincode",
                caption : mode == 'create' ? 'Create pincode' : "Enter pincode",
                mclass : 'cover withoutheader',
                data : {
                    confirm : mode == 'create',
                    mode,
                    attemp,
                    check
                },
                events : {
                    success : function(pin){

                        hascode = true

                        resolve(pin)
                    },
                    close : function(){

                        if(!hascode){
                            hascode = true
                            reject()
                        }

                    }
                }
            })

        })

        
    }

    camera = function(success, p = {}){
        this.store.commit('OPEN_CAMERA', {
            data : {
                multiple : true,
                mask : {
                    title : p.title || ""
                }
            },
            events : {
                selected : (images) => {
                    success(images)
                }
            }
        })
    }

    searchAssets = function(success, multiple){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_assets_search',
            module : "assets_search",
            mclass : "topsearching",
            caption : "",
    
            data : {
                
            },
            events : {
                selected : function(a){
                    if(success) success(a)
                },
                multiple : function(as){
                    if(multiple) multiple(as)
                }
            }
        })
    }

    portfoliopdf = function(data, success){
        this.store.commit('OPEN_MODAL', {
            
            id : 'modal_portfoliopdf',
            module : "portfoliopdf",
            caption : "Create PDF report",
    
            data : data,
            events : {
                success : function(a){
                    if(success) success(a)
                }
            }
        })
    }

    fx = function({place, name, parameters = {}}){


        var dp = {}

        if (name == 'stars') 
            dp = {
                opacity : 0.8,
                scatter : 20,
                duration : 900,
                color : '#ffa000'
            }

            

        this.store.commit('FX', {place, name, parameters : {
            ...dp,
            ...parameters
        }})
    }
}

export default Vueapi