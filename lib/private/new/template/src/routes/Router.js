import index from './index';

export class Router {
    constructor(app, middleware) {
        this.app = app;
        this.middleware = middleware;
    }

    load() {
        this.app.use('/', index(this.app, this.middleware));

        this.app.use(...this.middleware.load('404Controller.getIndex'));
        this.app.use(...this.middleware.load('500Controller.getIndex'));
    }

}
