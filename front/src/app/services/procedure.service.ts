import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProcedurePaa } from '../models/procedure.model';

@Injectable({
  providedIn: 'root'
})
export class ProcedurePaaService {
  private apiUrl = 'http://localhost:8089/api/rest/procedure';

  constructor(private http: HttpClient) {}

  getAllProcedures(): Observable<ProcedurePaa[]> {
    const headers = this.getHeaders();
    return this.http.get<ProcedurePaa[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getProcedureById(id: number): Observable<ProcedurePaa> {
    const headers = this.getHeaders();
    return this.http.get<ProcedurePaa>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createProcedure(procedure: ProcedurePaa, file: File): Observable<ProcedurePaa> {
    return this.saveProcedure('POST', this.apiUrl, procedure, file);
  }

  updateProcedure(id: number, procedure: ProcedurePaa, file: File): Observable<ProcedurePaa> {
    return this.saveProcedure('PUT', `${this.apiUrl}/${id}`, procedure, file);
  }

  deleteProcedure(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private saveProcedure(method: 'POST' | 'PUT', url: string, procedure: ProcedurePaa, file: File): Observable<ProcedurePaa> {
    const formData = new FormData();
    formData.append('procedure', new Blob([JSON.stringify(procedure)], { type: 'application/json' }));
    formData.append('file', file);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.request<ProcedurePaa>(method, url, { body: formData, headers }).pipe(
      catchError(this.handleError)
    );
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
