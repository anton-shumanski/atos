import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

export class DbConnection {
	constructor(filename, modelPath) {
		let fileName = path.basename(filename, '.js');
		if (!atos.app.get('config').hasOwnProperty('database')
				|| !atos.app.get('config').database.hasOwnProperty(fileName)) {
			throw new Error('Database configuration is missing');
		}

		let dbConfig = atos.app.get('config').database[fileName];

		this.dbConfig = dbConfig;
		this.modelPath = modelPath;
		this.db = {};
	}

	connect() {
		if (Object.keys(this.db).length !== 0) {
			return this.db;
		}

		const self = this;
		const sequelize = new Sequelize(
				this.dbConfig.database,
				this.dbConfig.username,
				this.dbConfig.password,
				this.dbConfig.config
		);

		fs.readdirSync(this.modelPath)
		.filter(function(file) {
			return fs.statSync(self.modelPath + file).isFile();
		})
		.forEach(function(file) {
			var model = sequelize.import(path.join(self.modelPath, file));
			self.db[model.name] = model;
		});

		Object.keys(this.db).forEach(function(modelName) {
			if ("associate" in self.db[modelName]) {
				self.db[modelName].associate(self.db);
			}
		});

		this.db.sequelize = sequelize;
		this.db.Sequelize = Sequelize;

		return this.db;
	}
}