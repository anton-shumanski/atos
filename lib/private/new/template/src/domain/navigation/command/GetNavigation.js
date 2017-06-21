import * as _ from 'lodash';

export class GetNavigation {
    constructor(req, res, navKey) {
        this.req = req;
        this.res = res;
        this.app = req.app;
        this.navKey = navKey;
        this.navigation = this.app.get('config').navigation;

        if (_.isEmpty(this.navigation[navKey])) {
            throw new Error('Navigation '+navKey+' does not exists');
        }
    }

    execute(callback) {
        this.loopThrough(this.navigation[this.navKey]);
        this.app.render('partials/'+this.navKey, _.merge(this.res.locals, {nav: this.navigation[this.navKey]}), callback);
    }

    static get MAIN_NAV() {
        return 'mainNav';
    }

    loopThrough(nav, parent = '') {
        const self = this;
        nav.forEach(function(item) {
            if (!_.isEmpty(item.submenu)) {
                self.loopThrough(item.submenu, item);
            } else {
                if(parent) item.parent = parent;
                if (item.uri == self.req._parsedUrl.pathname) {
                    item.active = true;
                } else {
                    item.active = false;
                }
            }

        });
    }
}