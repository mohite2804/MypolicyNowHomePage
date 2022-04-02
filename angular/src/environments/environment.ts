// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //baseUrl: 'http://13.126.180.115/~hibuat/api/api/',
  //baseUrl: 'https://103.87.174.22/hib/api/api/',
  baseUrl: 'http://localhost:8000/api/',
  baseUrl_angular: 'http://localhost:4200/',
  //baseurl for process note
  apiurl: 'http://localhost:8000/',

  mainJsPath: '/assets/front/js/main.js',
  CaptchaSiteKey:'6LcERLcZAAAAAGl6z-ABhYOpJ3Mm7Kewp541OMYw',
  minPasswordLength: 8,
  maxPasswordLength: 12,
  permissionDeniedMsg: 'You do not have privilege for this page.',
  sessionTimeoutInSeconds: 3600,
  razorpayKey : 'rzp_test_GbZxIg33hR1fNc'


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
