import { Injectable } from '@angular/core';
import {Users} from '../models/users.model';
import {SERVER_URL_BE} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private route: Router) { }

  getAll(): Observable<Users[]> {
    return this.http.get<Users[]>(SERVER_URL_BE + 'users').pipe();
  }
}
