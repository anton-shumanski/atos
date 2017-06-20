const modelPath = atos.app.get('sourcePath')+'models/';
const db = new atos.dbConnection(__filename, modelPath);

module.exports = function () {
    return db.connect();
}