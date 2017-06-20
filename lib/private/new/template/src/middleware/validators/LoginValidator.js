import loginForm from '../../../public/js/validation/constraints/loginForm';
const Validator = atos.validator;

export class LoginValidator extends Validator {
	constructor () {
		super();
        this.constraints = loginForm;
	}

	/**
	 * If you want to add external backend logic to validator (makes query to DB if user is unique)
	 * you should use:
	 * <code>
	 *     validate(body) {
	 *     		let errors = this.validate(body);
	 *     		...your custom logic for validation...
	 *     }
	 * </code>
	 */

}
