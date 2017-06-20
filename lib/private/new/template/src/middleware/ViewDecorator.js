import * as _ from 'lodash';
import fs from 'fs';
import {GetNavigation} from '../domain/navigation/command/GetNavigation';

const GET_HTTP_METHOD = 'get';

export class ViewDecorator {
	handle(req, res, next) {
		res.locals = res.locals || {};
		res.locals.req = req;

		this.setActionScriptByRequest(req, res);
		this.setNavigation(req, res);
		return next();
	}

	/**
	 * Set javascript depends of controller and method
	 * @param req
	 * @param res
     */
	setActionScriptByRequest(req, res) {
		let httpMethod = _.lowerCase(req.method);
		if(GET_HTTP_METHOD != httpMethod) {
			return;
		}

		let action = req.target.action;
		let controllerPath = _.replace(req.target.controller, 'Controller', '');
		let controllerName = controllerPath.split('/').pop();
		controllerPath = _.lowerCase(controllerPath);
		var method = _.replace(action, httpMethod, '');

		if (fs.existsSync(req.app.get('rootPath')+'/public/js/actions/'+controllerPath+'/'+controllerName+method+'.js')) {
			res.locals.actionScript = controllerPath+'/'+controllerName+method+'.js';
		}

	}

	/**
	 * Set navigation bar
	 * @param req
	 * @param res
     */
	setNavigation(req, res) {
		(new GetNavigation(req, res, GetNavigation.MAIN_NAV)).execute(function (err, html) {
			if (err) {
				console.log(err);
				return;
			}

			res.locals.mainNav = html;
		});
	}
}
