Charts-on-FHIR provides an Angular service (`FhirDataService`) that wraps the [SMART Health IT FHIR Client](http://docs.smarthealthit.org/client-js/) and makes it easier to integrate with Angular applications. This service should be initialized during the Angular bootstrap process so it can handle the SMART launch authorization flow before the application starts up.

```ts
// app.module.ts
function initializeFhirClientFactory(service: FhirDataService): () => Promise<void> {
  return () => service.initialize(environment.clientState);
}

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFhirClientFactory,
      deps: [FhirDataService],
      multi: true,
    },
  ],
})
export class AppModule {}
```

## Open FHIR Servers

Applications can connect to an open FHIR server by passing a [ClientState](http://docs.smarthealthit.org/client-js/typedoc/interfaces/types.fhirclient.ClientState.html) object into the `FhirDataService.initialize()` method. The `ClientState` object must include a `serverUrl` property that contains the URL of the FHIR server. It can also include a `tokenResponse` property to simulate the response from an EHR's token endpoint. For testing purposes, a patient ID can be hard-coded in the `tokenResponse`.

```ts
// environment.ts
export const environment = {
  production: false,
  clientState: {
    serverUrl: "https://api.logicahealth.org/chartsonfhir/open",
    tokenResponse: {
      patient: "12345",
    },
  },
};
```

> **Warning**
> ClientState should **NOT** be used in a production environment. Applications that use Angular environment files should set clientState to undefined in `environment.prod.ts`

```ts
// environment.prod.ts
export const environment = {
  production: true,
  clientState: undefined,
};
```

## Protected FHIR Servers

In a production environment, applications are typically launched from an within an EHR and obtain the FHIR server URL from the launch context. `FhirDataService` will handle this automatically if it detects a SMART launch context during initialization. But applications also need to include a `launch.html` page that starts the authorization flow. See the [SMART API](http://docs.smarthealthit.org/client-js/api.html) for details. To optimize load times, `launch.html` should be a simple HTML page that does not load Angular. The browser will redirect to the main Angular application when `FHIR.oauth2.authorize()` is called.

```html
<!-- launch.html -->
<script src="fhirclient.js"></script>
<script>
  FHIR.oauth2.authorize({
    clientId: "CLIENT_ID_THAT_IS_REGISTERED_WITH_THE_EHR",
    scope: "launch openid patient/*.rs profile",
  });
</script>
```

Update `angular.json` to include `launch.html` in the assets array and the fhir-client library in the scripts array.

```json
// angular.json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "assets": [..., "projects/my-app/src/launch.html"],
            "scripts": [
              {
                "input": "node_modules/fhirclient/build/fhir-client.js",
                "inject": false,
                "bundleName": "fhirclient"
              }
            ]
          }
        }
      }
    }
  }
}
```
