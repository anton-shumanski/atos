import validate from 'validate.js';
import * as _ from 'lodash';

export class Validator {
	response(errors, req, res, next) {
		if (errors) {
			if (req.xhr) {//isAjaxRequest
				return res.status(400).json(errors);
			}

			for(let i in errors){
				req.flash('error', errors[i])
			}

			return res.redirect('back');
		}
		return next();
	}

	/**
	 * Should return this.response(...)
	 * @param req
	 * @param res
	 * @param next
     */
	handle(req, res, next) {
		if (_.isEmpty(this.constraints)) {
			throw new Error('Please define constraints property');
		}
		
		return this.response(this.validate(req.body), req, res, next);
	}

	validate(body) {
		return validate(body, this.constraints);
	}
}
