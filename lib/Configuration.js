import fs from 'fs';
import * as _ from 'lodash'

export class Configuration {
	constructor(app) {
		this.app = app;
		this.config = {};
		this.enviroments = [
				'development',
				'production'
		];
		this.mainFolders = [
			'configs',
			...this.enviroments
		];
	}

	load() {
		this.setAppVariables();
		this.setConfigByDir(this.app.set('rootPath') + '/configs/');
		this.setConfigByDir(this.app.set('rootPath') + '/configs/'+this.app.get('env')+'/');
		this.appendEnvFile();

		this.app.set('config', this.config);
	}

	setConfigByDir(dir) {
		const self = this;
		let folderName = _.trimEnd(dir, '/').split('/').pop();
		let files = fs.readdirSync(dir);

		['.env.json', ...this.enviroments].forEach(function (item) {

			let index = files.indexOf(item);
			if (index >= 0) {
				files.splice( index, 1 );
			}
		});

		files.forEach(function(item) {
			if (fs.statSync(dir + item).isFile()) {
				let definitions = {};
				let key = item.slice(0, -5);

				if (_.includes(self.mainFolders, folderName) && key == 'default') {
 					definitions = require(dir + item);
				} else {
					if (!_.includes(self.mainFolders, folderName)) {
						definitions[folderName] = self.config[folderName] || {};
						definitions[folderName][key] = require(dir + item);
					} else {
						definitions[key] = require(dir + item);
					}
				}

				_.extend(self.config, definitions, self.config);
			} else {
				self.setConfigByDir(dir+item+'/');
			}
			
		});
	}

	appendEnvFile() {
		let file = this.app.set('rootPath') + '/configs/.env.json';
		if (!fs.existsSync(file)) {
			return false;
		}
		let definitions = require(file);
		_.extend(this.config, definitions, this.config);
	}

	setAppVariables() {
		this.app.set('rootPath', process.env.PWD);
		this.app.set('isProduction', this.app.get('env') == 'production');
		if (this.app.get('isProduction')) {
			this.app.set('sourcePath', this.app.set('rootPath') + '/src-es5/');
		} else {
			this.app.set('sourcePath', this.app.get('rootPath') + '/src/');
		}
		this.app.set('isSilentMode', process.argv.indexOf('--silent') > -1);
	}
}