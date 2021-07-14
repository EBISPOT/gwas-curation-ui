// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// This is for the fake json-server backend.

export const environment = {
  production: false,
  AAPURL: 'https://api.aai.ebi.ac.uk',
  BAD_AAPURL: 'https://api.aai.ebi.ac.uk-TEST',
  TEMPLATE_DOWNLOAD_API_URL: 'https://api.aai.ebi.ac.uk-TEST',
  APP_LOCAL_BASE_URI: '',
  REACT_APP_GWAS_DOC_BASE: 'https://www.ebi.ac.uk/gwas/docs',
  DATA_URL: '',
  API_URL: 'http://localhost:3000',
  ANOTHER_API_SECRET: '__ANOTHER__SECRET__'
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
