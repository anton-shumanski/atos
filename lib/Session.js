import session from 'express-session';
import * as _ from 'lodash';

export class Session {
    constructor(app) {
        this.app = app;
        this.config = app.get('config');
        this.redisStore = require('connect-redis')(session);
    }

    load() {
        let data = this.config.sessionData;
        if (!_.isEmpty(data.store) && data.store.type == Session.REDIS_STORE && !_.isEmpty(this.config.database)) {
            if (!this.config.database.hasOwnProperty(data.store.connection)) {
                throw new Error('Db connection `'+data.store.connection+'` not found');
            }

            const connectionData = this.config.database[data.store.connection];
            data.store = new this.redisStore(connectionData)
        } else {
           delete data.store;
        }

        this.app.use(session(data));
    }

    static get REDIS_STORE() {
        return 'redis';
    }
}
