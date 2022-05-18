import f from './functions'
var sha1 = require('sha1');
var { parseerror } = require('./error')

import dbstorage from "./dbstorage";
import _ from 'underscore';


var Request = function (core = {}, url, system) {
	var self = this

	var timeout = function (ms, promise, controller) {

		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {

				if (controller.signal.dontabortable) {
					return
				}

				if (controller) {
					controller.abort()
				}
			}, ms)

			promise.then(value => {

				clearTimeout(timer)
				resolve(value)

			}).catch(reason => {

				clearTimeout(timer)
				reject(reason)

			})
		})
	}

	var direct = function (url, data, p) {

		if (!p) p = {}

		if (typeof AbortController != 'undefined') {
			var controller = p.controller || (new AbortController())

			var time = p.timeout || 30000

			if (window.cordova) {
				time = time * 2
			}

			return timeout(time, directclear(url, data, controller.signal, p), controller)
		}
		else {
			return directclear(url, data, null, p)
		}


	}

	var directclear = function (url, data, signal, p) {

		if (!p) p = {}

		if (!data)
			data = {}

		var headers = _.extend({
			'Accept': 'application/json',
			'Content-Type': 'application/json;charset=utf-8'
		}, p.headers || {})

		var er = false
		var status = 0
		var token  = ''


		return core.user.extendA({ headers, data, system }).then(r => {

			var parameters = {

				method: p.method || 'POST',
				mode: 'cors',
				headers: headers,
				signal: signal
			}

			if (parameters.method == 'POST') parameters.body = JSON.stringify(data)
			if (parameters.method == 'GET') url = url + (url.indexOf('?') > -1 ? '&' : '?') + new URLSearchParams(data)

			return fetch(url, parameters)

		}).then(response => {

			if (signal)
				signal.dontabortable = true

			if (!response.ok) {
				er = true
			}

			var json = {}

			status = response.status

			const contentType = response.headers.get("content-type");

			token = response.headers.get("Token");


			if (contentType && contentType.indexOf("application/json") !== -1) {

				return response.json()

			} else {
				return response.text().then(text => {

					return {
						Message: text,
					}

				});
			}

		}).then(result => {

			result.code = status


			if (result.AuthSession && result.AuthSession.Error){ /// oldpct
				result.code = 500
				result.Error = result.AuthSession.Error
				er = true
			}

			if (er) {


				return Promise.reject(parseerror(result))
			}

			else {

				if(!result.token)
					result.token = token

				core.user.extendU(result, system)
			}

			var data = (result || {}).data || result || {}

			return Promise.resolve(data)

		}).catch(e => {

			return Promise.reject(e)
		})
	}

	self.fetch = function (path, data, p) {

		if(!path) path = ''

		return direct(url ? (url + (path.indexOf('?') == 0 ? '' : '/') + path) : path, data, p)
	}

	return self
}

var ApiWrapper = function (core) {

	var self = this;

	var cache = {}
	var loading = {}
	var storages = {}
	var requests = {
		pct: new Request(core, "https://rixtrema.net/RixtremaWS/AJAXPCT.aspx", 'pct'),
		pctapi: new Request(core, "https://rixtrema.net/api/pct", 'pctapi'),
		api: new Request(core, "https://rixtrema.net/api", 'api'),
		default: new Request(core)
	}

	var liststorage = {}

	var waitonline = function () {

		if (!core || !core.waitonline) {
			return Promise.resolve()
		}

		return core.waitonline()

	}

	var prepareliststorage = function(data, system, to, p){

		liststorage[system] || (liststorage[system] = {})
		liststorage[system][to] || (liststorage[system][to] = {})

		var datahash = ''

		_.each(data, function(v, k){
			if(k != p.from && k != p.to && v && k != p.includeCount) datahash += JSON.stringify(v)
		})

		datahash = sha1(datahash)

		liststorage[system][to][datahash] || (liststorage[system][to][datahash] = {
			count : undefined,
			data : {}
		})


		return datahash
	}

	var getloaded = function(datahash, data, system, to, p){

		var _fr = data[p.from] || 0
		var _count = data[p.count] || 100

		if(p.bypages) _fr = (_fr * _count)

		var storage = liststorage[system][to][datahash]

		var loaded = _.filter(storage.data, function(e, i){
			if(i >= _fr && (i < _count + _fr) ){
				return true
			}
		})

		var r = {
			data : 	loaded,
			count : storage.count,
			last : 	_.isEmpty(storage.data) ? undefined : _.max(_.map(Object.keys(storage.data), v => Number(v))),
			first : _.isEmpty(storage.data) ? undefined : _.min(_.map(Object.keys(storage.data), v => Number(v)))
		}

		if(loaded.length == storage.count) return r

		if(_count && _count == loaded.length) return r

		return null

	}

	var paginatedrequest = function(data, system, to, p){



		if(!p) p = {}
		if(!data) data = {}

		p.from || (p.from = "From")
		p.count || (p.count = "To")
		p.includeCount || (p.includeCount = "Count")

		var datahash = prepareliststorage(data, system, to, p)

		if (p.refresh) {

			liststorage[system][to][datahash].data = []
			liststorage[system][to][datahash].count = undefined

		}

		var loaded = getloaded(datahash, data, system, to, p)

		if (loaded) return Promise.resolve(loaded)

		if(!liststorage[system][to][datahash].count) data[p.includeCount] = true
		
		

		return request(data, system, to, p).then(r => {


			if(r.pagination) r.count = r.pagination.total

			prepareliststorage(data, system, to, p) /// async. maybe clear

			if(!data[p.from]) data[p.from] = 0

			_.each(r.records || [], (e, i) => {
				var c = 0
				
				if(p.bypages){c = data[p.from] * data[p.count] + i}else{c = data[p.from] + i}

				liststorage[system][to][datahash].data[c] = e
			})

			if (typeof r.count != 'undefined' && data[p.includeCount])
				liststorage[system][to][datahash].count = r.count

			var loaded = getloaded(datahash, data, system, to, p)

			if(!loaded) return Promise.reject('notloaded')

			return Promise.resolve(loaded)
		})

	}

	var getstorage = function (p) {

		if (!storages[p.storage]) {
			return dbstorage(p.storage, p.version || 1, p.time).then(storage => {

				storages[p.storage] = storage

				return Promise.resolve(storage)
			})
		}

		return Promise.resolve(storages[p.storage])
	}

	var scasheAct = function (ids, key, resultsKey, reload, storageparameters) {

		if (!_.isArray(ids)) ids = [ids]

		var waitLoading = {}

		if (!resultsKey)
			resultsKey = key

		if (!cache[key]) {
			cache[key] = {}
		}

		if (!loading[key]) {
			loading[key] = {}
		}

		return (storageparameters ? getstorage(storageparameters) : f.ep()).then(storage => {

			if (storage) {

				return Promise.all(_.map(ids, (id) => {

					if (cache[key][id]) {
						return Promise.resolve()
					}

					return storage.get(id).then((stored) => {
						cache[key][stored[resultsKey]] = stored

						return Promise.resolve()
					}).catch(e => {
						return Promise.resolve()
					})

				}))

			}

			return Promise.resolve()


		}).then(r => {

			var idtoloadPrev = _.uniq(_.filter(ids, function (id) {
				return reload || !cache[key][id] || cache[key][id].nocache
			}))

			var idtoload = _.filter(idtoloadPrev, function (id) {

				if (!loading[key][id]) {
					loading[key][id] = true
					return true
				}

				waitLoading[id] = true
			})

			var handleResults = function (result, _ids) {

				return (storageparameters ? getstorage(storageparameters) : f.ep()).then(storage => {

					if (storage) {
						return Promise.all(_.map(result, (row) => {

							if (!row[resultsKey]) {
								return Promise.resolve()
							}

							return storage.set(row[resultsKey], row)

						}))
					}

					return Promise.resolve()

				}).then(() => {

					_.each(result, function (row) {

						if (row[resultsKey]) {
							cache[key][row[resultsKey]] = row
						}

					})

					_.each(_ids, function (id) {
						delete loading[key][id]
						delete waitLoading[id]

						if (!cache[key][id])
							cache[key][id] = 'error'
					})

					var nresult = {};

					return f.pretry(() => {

						_.each(ids, function (id) {

							if (cache[key][id]) {

								if (cache[key][id] != 'error')

									nresult[id] = (cache[key][id])

								delete loading[key][id]
								delete waitLoading[id]
							}

						})

						return _.toArray(waitLoading).length == 0

					}).then(() => {
						return Promise.resolve(nresult)
					})

				})



			}

			return Promise.resolve({
				id: idtoload,
				handle: handleResults
			})
		})
	}

	var crequest = function (ids, key, rkey, reload, storageparameters) {

		return scasheAct(ids, key, rkey, reload, storageparameters).then(sh => {

			if (!sh.id.length) {
				return sh.handle([])
			}

			return Promise.reject(sh)

		})


	}

	var dbrequest = function(data, system, to, p){

		var _storage = null
		var datahash = sha1(system + to + JSON.stringify(data))
		
		return (p.storageparameters ? getstorage(p.storageparameters) : f.ep()).then(storage => {

			_storage = storage

			if (storage && !p.refresh) {
				return storage.get(datahash).catch(e => {
					return Promise.resolve()
				})
			}
			return Promise.resolve()

		}).then(cached => {

			if(!cached){
				return request(data, system, to, p).then(r => {

					if(_storage){
						return _storage.set(datahash, r).then(() => {

							return Promise.resolve(r)
	
						})
					}
					return Promise.resolve(r)
					

				})
			}

			return Promise.resolve(cached)

		})
	}	

	var request = function (data, system, to, p = {}, attempt) {

		var alreadyLoaded = []


		if (!attempt) attempt = 0

		if (p.preloader){
			core.store.commit('globalpreloader', true)
		}

		if (p.vxstorage && p.vxstorage.index){
			var r = core.vxstorage.get(p.vxstorage.index, p.vxstorage.type)

			if (r) return Promise.resolve(r)
		}

		if (p.vxstorage && p.vxstorage.getloaded){

			alreadyLoaded = _.filter(_.map(data[p.vxstorage.getloaded], function(index){
				return core.vxstorage.get(index, p.vxstorage.type)
			}), (r) => {
				return r
			})

			data[p.vxstorage.getloaded] = _.filter(data[p.vxstorage.getloaded], (index) => {
				return !_.find(alreadyLoaded, (obj) => {
					return obj.index[core.vxstorage.index(p.vxstorage.type)] == index
				})
			})

		}

		return waitonline().then(() => {

			data || (data = {})

			return (requests[system] || requests['default']).fetch(to, data, p).then(r => {

				if (p.vxstorage){

					var ds = r

					if(p.vxstorage.path) ds = f.deep(ds, p.vxstorage.path) || []

					var stored = core.vxstorage.sets(ds, p.vxstorage.type)

					stored = stored.concat(alreadyLoaded)

					if (p.vxstorage.path){
						f.deepInsert(r, p.vxstorage.path, stored)
					}	
					else{
						r = stored
					}

				}

				if (p.showStatus){
					core.store.commit('icon', {
						icon: 'success',
					})
				}

				return Promise.resolve(r)

			}).catch(e => {


				if (attempt < 3 && e && e.code == 20) {

					return new Promise((resolve, reject) => {

						attempt++

						setTimeout(function () {
							request(data, to, p, attempt).then(r => {
								return resolve(r)
							}).catch(e => {
								return reject(e)
							})

						}, 1000)
					})

				}

				if (p.showStatus){
					core.store.commit('icon', {
                        icon: 'error',
                        message: e.error
                    })
				}

				return Promise.reject(e)

			}).finally(() => {
				if (p.preloader){
					core.store.commit('globalpreloader', false)
				}
			})


		})


	}
	

	self.clearCache = function (key) {
		var keys = []

		_.each(cache, function(c,i){
			keys.push(i)
		})

		_.each(storages, function(c,i){
			keys.push(i)
		})

		keys = _.uniq(keys)

		_.each(self.clearCacheKey, function(k){
			self.clearCacheKey(k)
		})

	}

	self.clearCacheKey = function(){

		if (cache[key]) delete cache[key]

		if (storages[key]) {
			storage[key].clearall().catch(e => {console.error(e)})
			delete storage[key]
		}
	}

	self.pct = {
		tickers : {
			search : function(d){

				if(!d.value) return Promise.resolve([])

				d.count || (d.count = 7)

				return dbrequest({RowsToReturn : d.count, SearchStr : d.value}, 'pct', '?Action=GETINCREMENTALSEARCHONTICKERS', {
					method: "POST"
				}).then(r => {

					return Promise.resolve(f.deep(r, 'IncrementalSearch.c') || [])
				})
			}
		},

		portfolio : {
			getassets : function(){
				return request({
				
					Portfolio: 'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover'

				}, 'pct', '?Action=GETPORTFOLIOASSETS', {
					method: "GET"
				}).then(r => {
					return Promise.resolve(r.PortfolioAssets.c)
				})
			},

			standartDeviation : function(){
				return request({
					Portfolio: 'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover'
				}, 'pct', '?Action=GETPORTFOLIOSTANDARDDEVIATION', {
					method: "GET"
				}).then(r => {
					return Promise.resolve(r.GetPortfolioStandardDeviation)
				})
			},

			fromfile : function(data = {}, p = {}){

				/*

				data.File
				data.FileType

				*/

				data.JustParse = 1
				data.Portfolio = 'uploadtemp'

				p.method = "GET"

				return request(data, 'pct', '?Action=LOADPORTFOLIOFROMFILE', p).then(r => {
					return Promise.resolve(r.LoadPortfolioFromFile.Position)
				})

			}
		},

		settings : {
			get : function(){
				return dbrequest({Type : 'UserSettings', ValStr : ''}, 'pct', '?Action=GETUSERDATA', {
					method: "GET"
				}).then(r => {

					var data = {}	
					
					try{
						data = JSON.parse(f.deep(r, 'GetUserData.ValObj') || "{}")
					}
					catch(e){}
					

					return Promise.resolve(data)
				})
			}
		},

		crashtest : {
			get : function(){

				////temp

				return request({
					UseIntegration: 0,
					CalculateSW: 0,
					CountPlausibility: 0,
					Portfolio: 'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover'

				}, 'pct', '?Action=GETPCT', {
					method: "GET"
				}).then(r => {
					return Promise.resolve(r.PCT)
				})


			}
		},

		contributors : {
			get : function(id){
				return request({
					ScenarioID: id,
					ContributorsCnt: 10000,
					ModelType: 'RIXTREMA',
					WeightType: 'HBWPORTFOLIO',
					Portfolio: 'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover'

				}, 'pct', '?Action=GETPCTCONTRIBUTORSWITHOPTIONS', {
					method: "GET"
				}).then(r => {
					return Promise.resolve(r.PCTContributors.c)
				})

			}
		}

	}

	self.pctapi = {
		portfolios : {
			list : function(data = {}, p = {}){

				p.method = "POST"
				p.count = 'pageSize'
				p.from = 'pageNumber'
				p.bypages = true
				p.includeCount = "includeCount"


				p.vxstorage = {
					type : 'portfolio',
					path : 'records'
				}

				data.statusesFilter || (data.statusesFilter = ["ACTIVE"])


				return paginatedrequest(data, 'pctapi', 'Portfolio/List', p)

			},
			add : function(data, p = {}){

				p.method = "POST"

				return request(data, 'pctapi', 'Portfolio/Add', p)
			},
			update : function(data, p = {}){
				p.method = "POST"

				return request(data, 'pctapi', 'Portfolio/Update', p)
			},

			get : function(id, p = {}){

				p.method = "POST"

				var data = {
					id, 
					includePositions : true
				}

				p.vxstorage = {
					type : 'portfolio',
					index : id
				}

				return request(data, 'pctapi', 'Portfolio/GetById', p)
			},

			gets : function(ids = [], p = {}){


				if(!ids.length) return Promise.resolve([])

				var data = {
					pageSize : ids.length,
					idsFilter : ids
				}

				p.method = "POST"
				p.vxstorage = {
					type : 'portfolio',
					path : 'records',
					getloaded : 'idsFilter'
				}

				return request(data, 'pctapi', 'Portfolio/List', p).then(r => {
					return r.records
				})

			}, 

			delete : function(ids, p = {}){

				if(!_.isArray(ids)) ids = [ids]

				p.method = "POST"

				var data = {
					ids 
				}

				return request(data, 'pctapi', 'Portfolio/DeleteByIds', p).then(r => {

					_.each(ids, (id) => {
						core.vxstorage.update({
							status : "DELETED",
							id
						}, 'portfolio')
					})

					return Promise.resolve(r)
					
				})
			},

			recover : function(ids, p = {}){

				if(!_.isArray(ids)) ids = [ids]

				p.method = "POST"

				var data = {
					ids 
				}

				return request(data, 'pctapi', 'Portfolio/RecoverByIds', p).then(r => {
					_.each(ids, (id) => {
						core.vxstorage.update({
							status : "ACTIVE",
							id
						}, 'portfolio')
					})

					return Promise.resolve(r)
					
				})
			},
		}
	}

	self.crm = {
		contacts : {
			list : function(data, p = {}){

				p.method = "POST"

				return paginatedrequest(data, 'api', 'crm/Contacts/List', p)

			},

			gets : function(data, p = {}){
				p.method = "POST"

				return request(data, 'api', 'crm/Contacts/List', p).then(r => {
					return f.deep(r, 'data.records')
				})
			},

			update : function(data = {}, p = {}){
				p.method = "POST"

				return request(data, 'api', 'crm/Contacts/Update', p)
			},

			get : function(id, p = {}){
				p.method = "GET"

				return request({}, 'api', 'crm/Contacts/' + id, p)
			},

			scheme : function(p = {}){
				p.method = "GET"

				p.storageparameters = {
					storage : 'system',
					time : 60 * 60 * 48 
				}

				return dbrequest({}, 'api', 'crm/Contacts/Scheme', p).then(r => {
					return r.Contacts
				})
			},
		}
	}

	self.notifications = {
		list : function(data, p){
			if(!p) p = {}

			p.method = "POST"
			p.count = 'pageSize'
			p.from = 'pageNumber'
			p.bypages = true
			p.includeCount = "includeCount"

			return paginatedrequest(data, 'api', 'notifier/Event/webSocketsList', p)
		}
	}

	self.filesystem = {
		/* {root} */
		get : function(rootid, p = {}){

			p.method = "POST"

			return request({
				id : rootid || '0'
			}, 'pctapi', '/Catalog/GetCatalogContent', p).then(r => {

				var result = {
					name : r.name,
					content : [],
					id : r.id
				}

				_.each(r.catalogs, (c) => {
					result.content.push({
						type : 'folder',
						id : c.id,
						name : c.name
					})
				})

				_.each(r.portfolios, (p) => {
					result.content.push({
						type : 'portfolio',
						id : p.id,
						name : p.name
					})
				})

				return result
			})
		},

		create : {
			/* {root, name} */
			folder : function(data, p){
				return request(data, 'pctapi', '/Catalog/Add', p)
			}
		},

		move : {
			folder : function({id, to}, p){

				var data = {
					id,
					destinationCatalogId : to
				}

				return request(data, 'pctapi', '/Catalog/MoveCatalog', p)
			},
			portfolio : function({id, to}, p){

				var data = {
					id,
					destinationCatalogId : to
				}

				return request(data, 'pctapi', '/Catalog/MovePortfolio', p)
			}
		},

		delete : {
			folder : function({id}, p){

				var data = {
					id
				}

				return request(data, 'pctapi', '/Catalog/DeleteCatalog', p)
			},

			portfolio : function({id}, p){
				return self.pctapi.portfolios.delete([id], p)
			}
		}
	}

	self.user = {
		signin: function (headers) {
			return request({}, 'api', 'userdata/user/SignIn', {
				method: "GET",
				headers
			})
		},

		sendFcmInfo: function (data) {

			return Promise.resolve()

			return request(data, 'api', 'userdata/user/SignIn', {
				method: "POST",
			})
		},
	}

	return self;
}

export default ApiWrapper

