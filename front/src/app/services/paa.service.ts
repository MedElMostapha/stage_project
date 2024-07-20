import { Injectable } from '@angular/core';
import { SERVER_URL_BE2,SERVER_URL_BE3, SERVER_URL_BE, SERVER_URL_FE,SERVER_URL_BEPing } from '../../environments/environment';
import {HttpClient, HttpHeaders,HttpErrorResponse } from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PaaService {

  constructor(private http: HttpClient,) { }
  
  getDetaillPaa(id:any): Observable<any> {

    const headers = this.getHeaders();

    return this.http.get(`http://localhost:8081/api/rest/Paa/detaill/${id}`,{ headers });
  }

  getPaa(): Observable<any> {

    const headers = this.getHeaders();

    return this.http.get("http://localhost:8081/api/rest/Paa/latest",{ headers });
  }
  getPaaOne(id: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.get(`http://localhost:8081/api/rest/Paa/${id}`,{ headers });
  }
  
  addPaa(paa: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post(SERVER_URL_BE3 + 'Paa/addPaa', paa,{headers});
  }
  modifierPaa(id: number, paaData: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.put(`${SERVER_URL_BE3}Paa/modifier/${id}`, paaData,{headers});
  }
  validerPaa(id: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.put(SERVER_URL_BE3 + `Paa/valider/${id}`, id,{headers});
  }
  supprimerPaa(id: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http.delete(`http://localhost:8081/api/rest/Paa/deletePaa/${id}`,{headers});
  }

  declancchementPost(data: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post(SERVER_URL_BE3+ 'Paa/updatePaa',data,{headers});
  }

  validateCreateDir(data: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post(SERVER_URL_BE3+ 'Dossier/create',data,{headers});
  }

  private apiUrl = 'http://localhost:8081/api/rest/Paa/upload';

 
  uploadFile(file: File): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = this.getHeaders();

    return this.http.post(this.apiUrl, formData, {headers}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }



//   generateReport(id:any){
//     const headers = new HttpHeaders({
//       responseType: 'blob'
//     });
//   return this.http.get(SERVER_URL_BE+ 'Paa/report/'+id, {headers});
// }
  telechargerPieceJointe(id: string,reportName:any): Observable<any> {
    const url =SERVER_URL_BE3+ 'Dossier/report/'+id;
    const headers = new HttpHeaders({
      Accept: 'application/pdf'
    });

    return this.http.get(url, {headers, responseType: 'blob',  params:{'report-name':reportName}});
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

}
