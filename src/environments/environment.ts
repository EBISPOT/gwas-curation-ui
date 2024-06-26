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
  API_URL: 'http://hh-rke-wp-webadmin-09-worker-2.caas.ebi.ac.uk:30183/gwas/deposition/api/v1',
  CURATION_API_URL: 'http://localhost:3000',
  ANOTHER_API_SECRET: '__ANOTHER__SECRET__',
  DEPOSITION_URL: 'https://wwwdev.ebi.ac.uk/gwas/deposition',
  AUDIT_API_URL: 'http://localhost:8085/v1',
  WHITELISTED_CURATORS: ['alaofgwas@gmail.com', 'sajo.gwas@gmail.com', 'santhir.gwas@gmail.com', 'elliot.gwas@gmail.com', 'earlofgwas@gmail.com', 'lauraharrisgwas75@gmail.com']
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
