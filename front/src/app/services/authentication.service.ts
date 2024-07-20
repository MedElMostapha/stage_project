import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {SERVER_URL_BE} from "../../environments/environment";
import {genEnp,host2} from "../../environments/environment-local";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit {
  host2:string="http://localhost:8081/auth";
  jwt: any;
  userId: any;
  username:any;
  roles:any;
  redirectUrl='localhost:4200/#/login';
  exp:any;

  constructor(private http:HttpClient, private router:Router) { }

  ngOnInit(): void {
    this.test();
    throw new Error("Method not implemented.");
  }

  login(data:any){
    return this.http.post(this.host2+"/login",data)
  }

  GetUserRoles(id: any) {
    return this.http.get(`http://localhost:8081/users/roles/${id}`)

    
  }


  test(){
    return this.http.post(this.host2+"/login",'',{observe:'response'})
  }

  isActived(username): Observable<any>{
    return this.http.get(this.host2+ '/api/rest/AppUsers/isUserActived/'+username);
  }

  saveUser(data:any): Observable<any>{
    // const headers = new HttpHeaders()
    //   .append(
    //     'Content-Type',
    //     'application/json'
    //   );
    // const body=JSON.parse(JSON.stringify(data));

    return  this.http.post(this.host2+'/api/rest/AppRigister/register/',data).pipe();
  }

  getAllUsers(): Observable<any>{
    return  this.http.get("http://localhost:8081/users").pipe();
  }
  getAllRoles(): Observable<any>{
    return  this.http.get(this.host2+'/api/rest/AppRigister/getAllRoles/').pipe();
  }
  updateActivation(data): Observable<any> {
    return this.http.patch(this.host2+"/api/rest/AppRigister/updateActivation",data,{observe:'response'})
  }

  saveToken(jwt:any) {
    localStorage.setItem('token',jwt);
    this.jwt = jwt;
    console.log("token : "+jwt);

    this.parseJWT();
  }

  parseJWT(){
    let jwtHelper = new JwtHelperService();
    
    let objJWT = jwtHelper.decodeToken(this.jwt);
    this.userId = objJWT.id;
    this.username=objJWT.obj;
    this.roles=objJWT.roles;
    this.exp = objJWT.exp;
    console.log(objJWT)
    
  }
  isAdmin(){
    return true;
    // return this.roles.indexOf('SAISIE')>=0;
    // return this.roles.indexOf('CONSULTATION')>=0;
    // return this.roles.indexOf('VALIDATION')>=0;

  }

  isUser(){
    return this.roles.indexOf('CONSULTATION')>=0;
    return this.roles.indexOf('SAISIE')>=0;
  }
  isDGB(){
    return this.roles.indexOf('CONSULTATION')>=0;
  }

  isAuthenticated(){
    return this.roles;
  }

  isExpired(){
    return this.exp;
  }

  loadToken() {
    this.jwt=localStorage.getItem('token');
    this.parseJWT();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('profilSelection');
    this.initParams();
  }
  initParams(){
    this.jwt=undefined;
    this.username=undefined;
    this.roles=undefined;
    this.exp = undefined;
    this.router.navigateByUrl("/login");
  }
}
