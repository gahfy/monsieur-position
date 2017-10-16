# Monsieur Position

Application présentée lors du GDG du 16 Octobre.

* Stockage du contexte de la conversion à l'aide de `app.getConversationId()`
* Demande de permission de la localisation avec `app.askForPermission((string), app.SupportedPermissions.DEVICE_PRECISE_LOCATION);` et `app.StandardIntents.PERMISSION`

## Déploiement des functions Firebase

`firebase deploy --only functions`

## Déploiement du projet Google Actions
`gactions update --action_package=action.json --project=[PROJECT_ID]`
