import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressLayouts from 'express-ejs-layouts';
import flash from 'connect-flash';
import * as _ from 'lodash';

import {Configuration} from './Configuration';
import {EventEmitter} from './events/EventEmitter';
import {Responses} from './Responses';
import {Event} from './events/Event';
import {Middleware} from './Middleware';
import {Session} from './Session';
import {Validator} from './Validator';
import {Logger} from './Logger';
import {DbConnection} from './DbConnection';

export class Atos {
    constructor() {
        this.app = express();

        //load configs
        (new Configuration(this.app)).load();
        this.config = this.app.get('config');

        //load events
        this.eventEmitter = (new EventEmitter(this.app)).load();

        //load logger
        this.logger = (new Logger(this.app));

        //load dependencies
        this.validator = Validator;
        this.dbConnection = DbConnection;
        global.atos = this;
    }

    run() {
        if(_.isEmpty(this.routerPath)) {
            throw new Error('Please set router path');
        }
        const {Router} = require(this.routerPath);
        this.router = new Router(this.app, new Middleware(this.app));

        // view engine setup
        this.app.set('views', path.join(process.cwd(), 'views'));
        this.app.set('view engine', 'ejs');
        this.app.use(expressLayouts);
        this.app.set("layout extractScripts", true);

        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(process.cwd(), 'public')));

        //load session
        (new Session(this.app)).load();
        this.app.use(flash());

        this.eventEmitter.emit(Event.BEFORE_ROUTER, this.app);
        //load router
        this.router.load();

        //load responses
        (new Responses(this.app)).load();

        //load schedule tasks
        if(!_.isEmpty(this.schedulerPath)) {
            require(this.schedulerPath)();
        }

        this.eventEmitter.emit(Event.APP_LOADED, this.app);
    }

    setRouterPath(path) {
        this.routerPath = path;
    }

    setSchedulerPath(path) {
        this.schedulerPath = path;
    }
}





