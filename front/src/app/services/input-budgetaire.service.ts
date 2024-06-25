import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_URL_BE } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InputBudgetaireService {

  constructor(private http: HttpClient) { }
  
  creatInput(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(SERVER_URL_BE + "input", { headers });
  }
  getInputs(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(SERVER_URL_BE + "input", { headers });
  }
  getContrats(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(SERVER_URL_BE + "input/contrat", { headers });
  }
  
  getModes(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(SERVER_URL_BE + "input/mode", { headers });
  }
}
