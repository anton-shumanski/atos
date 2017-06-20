import * as _ from 'lodash';
import fs from 'fs';

const ValidatorType = 'validator';
const PolicyType = 'policy';
const MiddlewareType = 'middleware';
const GlobalMiddlewareType = 'global-middleware';

export class Middleware {
	constructor(app) {
		this.app = app;
		this.config = app.get('config');
		

	}

	load(path) {
		const self = this;
		let [controllerPath, method] = path.split('.');
		let controller = controllerPath.split('/').slice(-1).pop();
		let data = [];
		this.middlewareList = [];

		if (!_.isEmpty(this.config.middleware)) {

			if (!_.isEmpty(this.config.middleware.default.beforePolicies)) {
				data.push({
					path: this.app.get('sourcePath')+'middleware/',
					list: this.config.middleware.default.beforePolicies,
					type: MiddlewareType
				});
			}

			if (!_.isEmpty(this.config.middleware.policy)) {
				data.push({
					path: this.app.get('sourcePath')+'middleware/policies/',
					list: this.config.middleware.policy,
					type: PolicyType
				});
			}

			if (!_.isEmpty(this.config.middleware.validator)) {
				data.push({
					path: this.app.get('sourcePath')+'middleware/validators/',
					list: this.config.middleware.validator,
					type: ValidatorType
				});
			}

			if (!_.isEmpty(this.config.middleware.default.afterValidators)) {
				data.push({
					path: this.app.get('sourcePath')+'middleware/',
					list: this.config.middleware.default.afterValidators,
					type: MiddlewareType
				});
			}

			data.forEach(function (item) {
				self.loadMiddlewareByConfiguration(item, controller, method)
			});

			atos.logger.log('Middleware for '+controllerPath+', '+method+': ', this.middlewareList);
			atos.logger.log('------------------');
		}

		return this.requireAllMiddwares(controllerPath, method);
	}

	requireAllMiddwares(controllerPath, method) {
		let middlewareMethods = [];

		//set request extra data
		middlewareMethods.push(function (req, res, next) {
			req.target = {
				controller : controllerPath,
				action: method
			}

			if (!req.headers['content-type'] || req.headers['content-type'].indexOf('application/json') !== 0){
				req.wantsJson = false;
			} else {
				req.wantsJson = true
			}
			return next();
		});

		//add all middleware
		this.middlewareList.forEach(function(item){
			let validator = new (require(item.path))[item.name]();
			middlewareMethods.push(validator.handle.bind(validator));
		});

		//add controller at the end
		middlewareMethods.push(require(this.app.get('sourcePath')+'controllers/'+controllerPath)[method]);
		return middlewareMethods;
	}

	loadMiddlewareByConfiguration(item, controller, method) {
		const self = this;
		let loadCommonMiddleware = function() {
			if (!_.isEmpty(item.list['*'])) {
				item.list['*'].forEach(function (midd) {
					self.setMiddleware(item, midd);
				});
			}
		};
		if (!_.isEmpty(item.list[controller])) {
			if (!_.isEmpty(item.list[controller]['*'])) {
				
				if (item.list[controller]['*'] !== false) {
					loadCommonMiddleware();
				}

				if (typeof item.list[controller]['*'] == 'object'){
					item.list[controller]['*'].forEach(function (midd) {
						self.setMiddleware(item, midd);
					});
				}
			} else {
				loadCommonMiddleware()
			}

			if (!_.isEmpty(item.list[controller][method])
				&& typeof item.list[controller][method] == 'object') {
				item.list[controller][method].forEach(function (midd) {
					self.setMiddleware(item, midd);
				});
			}
		} else {
			loadCommonMiddleware()
		}
	}

	setMiddleware(item, midd) {
		if (midd.startsWith('!')) { //unset middleware
			let index = -1;
			for (let i in this.middlewareList) {
				if (this.middlewareList[i].path == item.path + midd.substr(1)) {
					index = i;
					break;
				}
			}
			if (index >= 0) {
				this.middlewareList.splice( index, 1 );
			}
		} else { //set middleware
			if (fs.existsSync(item.path+midd+'.js')) { //if middleware is a global
				this.middlewareList.push({
					path: item.path+midd,
					name: _.upperFirst(midd),
					type: item.type
				});
			} else {
				this.middlewareList.push({
					path: midd,
					type: GlobalMiddlewareType
				});
			}

		}
	}
}