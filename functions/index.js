const functions = require('firebase-functions');
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;

const GpsUtils = require('./utils/GpsUtils').GpsUtils;
const FrenchStringUtils = require('./utils/FrenchStringUtils').FrenchStringUtils;
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.database();

const BORDEAUX = {latitude: 44.833328, longitude: -0.56667};

const getDistance = function(coordinates){
    let distance = Math.round(GpsUtils.getDistance(coordinates, BORDEAUX));
    return "Bordeaux se situe à " + distance + " kilomètres de votre position actuelle";
};

const getDirection = function(coordinates){
    let direction = FrenchStringUtils.getPrefixedDirection(GpsUtils.getDirection(coordinates, BORDEAUX));
    return "Bordeaux se situe " + direction + " de votre position actuelle";
};

const ACTIONS = [
    {
        name: "distance",
        action: getDistance
    },
    {
        name: "direction",
        action: getDirection
    }
];

const getRequestResponse = function (speech, coordinates) {
    speech = speech.toLowerCase().trim();
    let result = "Désolé, je n'ai pas compris si vous souhaitiez la distance ou bien la direction";
    ACTIONS.forEach(function(action){
        if(speech.indexOf(action.name) !== -1){
            result = action.action(coordinates);
        }
    });
    return result;
};

const mainIntent = function (app) {
    app.ask("Souhaitez-vous connaître la direction ou bien la distance avec Bordeaux ?");
};

const textIntent = function (app) {
    db.ref("requests/"+app.getConversationId()).set({
        speech: app.getRawInput()
    }).then(function () {
        let preciseLocationPermission = app.SupportedPermissions.DEVICE_PRECISE_LOCATION;
        app.askForPermission("Pour effectuer ce calcul", preciseLocationPermission);
    }).catch(function (error) {
        app.tell("Et là, c'est le bug !");
    });
};

const permissionIntent = function (app) {
    if (app.isPermissionGranted()) {
        let coordinates = app.getDeviceLocation().coordinates;
        db.ref("requests/"+app.getConversationId()).once("value").then(function (snapshot) {
            if (snapshot.val()) {
                app.tell(getRequestResponse(snapshot.val().speech, coordinates));
            }
            else {
                app.tell("Désolé, je ne me souviens plus du début de notre conversation");
            }
        }).catch(function (error) {
            app.tell("Et là, c'est le bug !");
        });
    }
    else {
        app.tell("Désolé, mais je ne peux pas vous répondre sans connaître votre position.");
    }
};

exports.gHome = functions.https.onRequest((req, res) => {
    let app = new ActionsSdkApp({request: req, response: res});
    let actionMap = new Map();

    actionMap.set(app.StandardIntents.MAIN, mainIntent);
    actionMap.set(app.StandardIntents.TEXT, textIntent);
    actionMap.set(app.StandardIntents.PERMISSION, permissionIntent);

    app.handleRequest(actionMap);
});
