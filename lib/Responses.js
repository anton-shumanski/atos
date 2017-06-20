import fs from 'fs';

export class Responses {
    constructor(app) {
        this.app = app;
    }

    load() {
        const self = this;
        /**
         * Adds all files to the express response object
         * @param responsesDir Path to directory containing the response files
         */
       const addResponses = function (responsesDir) {
            // Check if directory exists
            if (!fs.existsSync(responsesDir)) {
                throw Error('The custom responses directory does not exist.');
            }

            // Get user responses
            var userResponses = fs.readdirSync(responsesDir);

            // Add user responses to the express response object
            userResponses.forEach(function (reponseFileName) {
                let responseName = reponseFileName.split('.')[0];
                self.app.response[responseName] = require(responsesDir + '/' + reponseFileName);
            });

        };


        addResponses(this.app.get('sourcePath')+'responses');
    }
}
