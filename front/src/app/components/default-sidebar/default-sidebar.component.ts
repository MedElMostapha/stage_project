import {Component, OnInit, ViewChild, Inject, AfterViewInit, ViewEncapsulation} from '@angular/core';
import {SelectEventArgs, SidebarComponent} from '@syncfusion/ej2-angular-navigations';
// import { NgxSpinnerService } from "ngx-spinner";
import {
  CanActivate,
  Route,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  ActivatedRoute
} from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { state } from '@angular/animations';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Observable } from 'rxjs';
import {JwtHelperService} from "@auth0/angular-jwt";
import {LoaderService} from "../../services/loader.service";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-default-sidebar',
  templateUrl: './default-sidebar.component.html',
  styleUrls: ['./default-sidebar.component.scss'],
  //encapsulation: ViewEncapsulation.None,
})
export class DefaultSidebarComponent implements OnInit{
  token;
  usernamecnx;
  url
  roles
  profilSelection
  constructor( public loaderService:LoaderService ,private spinner: NgxSpinnerService, private router:Router, private authServ:AuthenticationService,private Can:AuthGuardService,
                private activatedRoute: ActivatedRoute) {


  }


  ngOnInit(): void {
    this.isAuthenticated();
   // window.location.reload()
    this.token = localStorage.getItem('token');
    //this.profilSelection = localStorage.getItem('profilSelection');

    console.log(this.profilSelection);
    this.usernamecnx = localStorage.getItem('username');
    this.roles =localStorage.getItem('roles');
    this.authServ.loadToken();
  }


  isAdmin(){
    return this.authServ.isAdmin();
  }
  isDGB(){
    return this.authServ.isDGB();
  }
  isUser(){
    return this.authServ.isUser();
  }
  isAuthenticated(){
    this.usernamecnx =  localStorage.getItem('username');
    this.profilSelection = localStorage.getItem('profilSelection');
    let jwtHelper = new JwtHelperService();
   if(localStorage.getItem('token')!=null){
    //  let objJWT =jwtHelper.decodeToken(localStorage.getItem('token'))
    //  if(objJWT.roles.length>0){
    //    return true
    //  }else {
    //    console.log("Vous n'avez pas de profil")
    //    return false
     //  }
     return true
   }

  }

  logOut(){
    this.authServ.logout();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.authServ.redirectUrl = state.url;
    console.log(state.url)
    return undefined;
  }

  // ngAfterViewInit(): void {
  //   this.token = localStorage.getItem('token');
  //   this.profilSelection = localStorage.getItem('profilSelection');
  //   this.url =localStorage.getItem('url');
  //   console.log(this.profilSelection);
  //   this.usernamecnx = localStorage.getItem('username');
  //   this.roles =localStorage.getItem('roles');
  //   this.authServ.loadToken();
  // }

  }
