// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // baseUrl: 'http://148.72.213.34/SpoorthyAPI/api/',
  // baseUrl2: 'http://148.72.213.34/SpoorthyAPI/',
  // docUrl: 'http://51.132.254.49/',
  // baseUrl3: 'http://51.132.254.49/',
  // production: true,
  // costDivision: 100000,

  baseUrl: 'http://localhost:8100/api/',       //LocalHost URL// 
  baseUrl2: 'http://localhost:8100/',          //LocalHost URL//
  docUrl: 'http://localhost:8100/',           //LocalHost URL//

  // baseUrl: 'http://208.109.10.239:8500/api/',
  // baseUrl2: 'http://208.109.10.239:8500/',
  // docUrl: 'http://208.109.10.239:8500/',
  production: false,
  costDivision: 100000,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
