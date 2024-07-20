// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true
}
export const SERVER_URL_FE = 'http://localhost:4200';
export const SERVER_URL_BE = 'http://localhost:8081/';
export const SERVER_URL_BE2 = 'http://localhost:8081';
export const SERVER_URL_BE3 = 'http://localhost:8081/api/rest/';
export const SERVER_URL_BEPing = 'http://localhost:8081/api/rest/TypeEcheancier/ping';


let port: '8081';
let ip: 'localhost';

export const genEnp = 'http://' + ip + ':' + port + '/api/rest/';

//creer poour faire des test lors de l'authentification
export const host2 = 'http://' + ip + ':' + port;
