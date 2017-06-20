import Events from 'events';
import * as _ from 'lodash';

export class EventEmitter extends Events {
    constructor(app) {
        super();
        this.app = app;
    }

    addListener(event, listener) {
        this.on(event, require(this.app.get('sourcePath') +'listeners/'+listener));
    }

    load() {
        if (_.isEmpty(this.app.get('config').events)) {
            return;
        }

        const events = this.app.get('config').events;
        for (let event in events) {
            for (let listener in events[event]) {
                this.addListener(event, events[event][listener])
            }
        }
        return this;
    }
}

