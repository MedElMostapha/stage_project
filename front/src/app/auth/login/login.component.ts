import {Component, OnInit, TemplateRef, ViewChild, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import {Users} from '../../models/users.model';
import {UsersService} from '../../services/users.service';
import {isBoolean} from 'ngx-bootstrap/chronos/utils/type-checks';
import {HttpClient} from "@angular/common/http";
import { AuthenticationService } from 'src/app/services/authentication.service';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {SaisieService} from "../../services/saisie.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {MyToasterService} from "../../services/my-toaster.service";
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  //encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  getItem;
  userId: any;
  userNom: any;
  roless;
  selected;
  usernamecnx;
  resiltCnx;
  profilSelection;
  modalRef: BsModalRef;
  modalRefChild: BsModalRef;
  public isAuthLoading = false;
  //modalService: BsModalService;


  public position: PositionDataModel = { X: 600, Y: 200 };
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;
  public targetElement: HTMLElement;
  constructor(
    private fb: FormBuilder,
    private toastr: MyToasterService,
    private router: Router,
    private auth: AuthService,
    private uhttp: UsersService,
    private http: HttpClient,
    private authService: AuthenticationService,
   private modalService: BsModalService,
    private service: SaisieService,
    private activatedRoute: ActivatedRoute

  ) {
  }

  get matricule() {
    return this.register.get('matricule');
  }

  get password() {
    return this.register.get('password');
  }
  CheckCon = false;
  iconPassword = 'bi bi-eye';
  typePassword = false;
  errormessage: string;
  alerts: any[] = [{}];
  errorMessage = 'Invalid Credentials';
  successMessage: string;
  invalidLogin = false;
  loginSuccess = false;

  register = this.fb.group({
    matricule: ['', [Validators.required, ], ],
    password: ['', [Validators.required, ], ]
  });
  btnValider = false;
  msj = false;
  mserreur = false
  add(typem: any, msg: any, timem: number): void {
    this.alerts.push({
      type: typem,
      msg: msg + `( ${new Date().toLocaleTimeString()})`,
      timeout: timem
    });
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
  voirPassword(): void {
    this.typePassword = !this.typePassword;

    if (this.iconPassword == 'bi bi-eye') {
      this.iconPassword = 'bi bi-eye-slash';
    } else {
      this.iconPassword = 'bi bi-eye';
    }
  }
  // voirPassword() {
  //   this.typePassword = !this.typePassword;
  // }

  ngOnInit(){
    this.getItem = localStorage.getItem('token');
    console.log(localStorage.getItem('token'))
    //let res =  this.authService.login('data').toPromise();modal-xm
    //console.log(res)
  }
  public onOpenDialog = (event: any): void =>{
    this.ejDialog.show();
  };
  openModal2(template2: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template2,{class: 'modalChild  modal-xm',ignoreBackdropClick: true});
  }
  openModal(template: TemplateRef<any>) {
    this.modalRefChild = this.modalService.show(template,{class: 'modal-xm'});
  }
  decline(): void {
    this.modalService.hide();
  }
  onLogin2(data: any) {
    console.log(JSON.stringify(data)); // Le deuxième paramètre ajoute un espacement pour une meilleure lisibilité
    
    this.CheckCon = true;
    console.log(data);
    this.authService.login(data)
      .subscribe(resp => {
        
        console.log("donnee returnee "+JSON.stringify(resp)); // Le deuxième paramètre ajoute un espacement pour une meilleure lisibilité
        
        // let jwt =resp.headers.get('Authorization');
        // this.authService.saveToken(jwt);
        // this.router.navigateByUrl("/Consultation Personnel");
      },err=>{
        if (err.error === null){
          this.add('danger', 'Informations Incorrectes ! ', 3000);
          // console.log(err.error);
          this.CheckCon = false;
        }
      })
  }

  async getProfil(){
    this.profilSelection=this.selected
    localStorage.setItem('profilSelection',this.profilSelection) ;
    this.authService.GetUserRoles(this.userId).subscribe({
      next: (value) => {

        


        if (Array.isArray(value)) {
          // Utilisation de map si value est un tableau
          this.roless = value.map((item: { authority: string }) => item.authority);
          console.log(this.roless); // ["ADMIN", "USER"]
        }

    
      }
    });
  
    await this.modalService.hide();
    //this.router.navigateByUrl("/Accueil");
    this.isAuthLoading = false;
    this.router.navigate(['/Accueil'])
      // .then(() => {
      //   location.reload(false);
     // });
    console.log(this.profilSelection)
  }

  async isUserActived(username){
    try {
      const res = await this.authService.isActived(username).toPromise();
      return res;
    }catch (e) {
      return e
    }
  }

  // setTimeout(() => {

  //   const data = localStorage.getItem("data");
  //   let res = await this.authService.login(data).toPromise();

  //   if (res) {
  //     this.authService.saveToken(res["access-token"]);
      
  //   }





    
  // }, 60000);

  async onLogin(data: any, temp) {
  
    
    console.log(JSON.stringify(data)); // Le deuxième paramètre ajoute un espacement pour une meilleure lisibilité
    
    this.CheckCon = true;
    try {
      this.isAuthLoading = true;
      let res = await this.authService.login(data).toPromise();
      this.isAuthLoading = false;
      this.resiltCnx =(res);
      if (res) {

        localStorage.setItem("data", data);
        // console.log("user authenfied : "+ JSON.stringify(res));

        console.log("le tocken : " + res["access-token"]);

        this.authService.saveToken(res["access-token"]);
        this.userId = res["userId"];
        localStorage.setItem("username", res["nom"])
        localStorage.setItem("nom",res["prenom"])

        this.authService.GetUserRoles(res["userId"]).subscribe({
          next: (value) => {

            


            if (Array.isArray(value)) {
              // Utilisation de map si value est un tableau
              this.roless = value.map((item: { authority: string }) => item.authority);
              console.log(this.roless); // ["ADMIN", "USER"]
          } 

          
            this.modalService.show(temp, Object.assign({}, {
              class: 'modalParent  modal-xm',
              ignoreBackdropClick: true
            }));
            this.openModal2(temp);

            this.router.navigate(['/Accueil'])
                

            

            
            
            // console.log("les roles "+JSON.stringify(value));
          }
        });

        
        

        
        
        // await this.isUserActived(data.username).then(response=> {
        //   if (response.status===200) {
        //     console.log(response);
        //     localStorage.setItem('username', data.username);
        //     let jwt = res.headers.get('Authorization');
        //     this.usernamecnx = data.username;
        //     let jwtHelper = new JwtHelperService();
        //     let objJWT = jwtHelper.decodeToken(jwt);
        //     console.log("le toddddd :"+objJWT.sub);

        //     if (objJWT.roles.length > 1) {
        //       // this.modalService.show(temp, Object.assign({}, {
        //       //   class: 'modalParent  modal-xm',
        //       //   ignoreBackdropClick: true
        //       // }))
        //       this.openModal2(temp)
        //       this.roless = objJWT.roles;
        //     } else {
        //       this.profilSelection = objJWT.roles[0];
        //        this.authService.saveToken(jwt);
        //       //console.log(objJWT.roles[0]);
        //       localStorage.setItem('profilSelection', this.profilSelection)
              
        //       this.isAuthLoading = false;
        //       this.router.navigate(['/Accueil'])
        //         // .then(() => {
        //         //   location.reload(false);
        //         // });
        //     }
        //   }
        //   if (response.status===400){
        //     // this.element.show({
        //     //   title: 'Error   !', content: 'Compte Inactif ! Attendre la validation .', cssClass: 'e-toast-warning'
        //     // });

        //     this.toastr.showToast('Authentification', "Compte Inactif ! Contacter L'administrateur", 4000,'error')
        //     this.isAuthLoading = false;
        //   }
        // })
      }
    }catch (e){
      console.log(this.alerts.splice(0))
        //this.add('danger', 'Informations Incorrectes ! ', 3000);
      this.toastr.showToast('Authentification', "Informations Incorrectes !", 4000,'error')
      this.isAuthLoading = false;
    }finally {
      this.CheckCon = false;
      this.isAuthLoading = false;
    }

  }
  async VerifeUserPass(data:any){
    this.mserreur = false;
    let res = await this.authService.login({username:data.username,password:data.password}).toPromise();
    return res;
  }

  async onChange(data:any){
    const resp = await this.VerifeUserPass({username:data.username,password:data.password}).catch(reason => {
      console.log(reason.status);
      if (reason.status===403){
        this.mserreur = true;
      }
    });
    if (resp){
      await this.updateUser({username: data.username, password: data.npassword}).catch(reason => {
        console.log(reason.status);
        if (reason.status===200){
          console.log(this.alerts.splice(0))
         // this.add('success', 'Mise à Jour Reussi ! ', 3000);
          this.toastr.showToast('Changement Mot de Passe', "Mise à Jour Reussi !!", 4000,'success')
          this.modalRef.hide();
        } 
      })
    }
  }
  async updateUser(data){
    let res =  await this.service.updatePassword(data).toPromise();
     return res;
  }
}
