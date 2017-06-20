export class Logger {
	constructor(app) {
		this.app = app;
	}

	log() {
		if (this.app.get('isSilentMode')) {
			return;
		}
		console.log(...arguments);
	}
}