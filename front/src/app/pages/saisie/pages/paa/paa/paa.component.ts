import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
// import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {GridComponent, RowDeselectEventArgs, RowSelectEventArgs} from "@syncfusion/ej2-angular-grids";
import {PaaService} from "../../../../../services/paa.service";
import {DialogComponent, PositionDataModel} from '@syncfusion/ej2-angular-popups';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileService} from "../../../../../services/file.service";
import {HttpClient, HttpEventType, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
// import Stepper from 'bs-stepper';
import {DatePipe} from '@angular/common';
import {GED_TBL, REPORTS} from '../../../../../enums/constants';
import {DirectoryService} from "../../../../../services/directory.service";
import {saveAs} from "file-saver";
import { OffcanvasComponent } from 'src/app/components/offcanvas/offcanvas.component';
import { EtablissementSelectComponent } from '../../etablissement-select/etablissement-select.component';
import { EtablissementService } from 'src/app/services/etablissement.service';
import { SERVER_URL_BE } from 'src/environments/environment';
@Component({
  selector: 'app-paa',
  templateUrl: './paa.component.html',
  styleUrls: ['./paa.component.scss'],
  providers: [DatePipe]
})


export class PaaComponent implements OnInit {
  cpass = false;
  @ViewChild('container', {read: ElementRef, static: true}) container: ElementRef;
  public positionModal: PositionDataModel = {X: 450, Y: 100};
  public positionModalDetail: PositionDataModel = {X: 330, Y: 50};
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('dialogDossier') dialogDossier: DialogComponent;
  @ViewChild('dialogDetail') dialogDetail: DialogComponent;
  public targetElement: HTMLElement;
  public DialogObj;
  public dialogDossierObj;
  public dialogDossierDetail;
  public pageSettings: Object;


  @ViewChild('fileInput') fileInput!: ElementRef;


  @ViewChild('grid') public grid: GridComponent;
  selectedPaaId: number | null = null;

  GED_TBL = GED_TBL;
  REPORTS = REPORTS;
  data: any;
  selectedPaa: Object[] = null;
  errorMsg = '';
  showNewRow: boolean = false;
  modifierRow: boolean = false;
  newRowForm: FormGroup;
  modifierForm: FormGroup;
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  selectedItem: any;

  fileInfos: Observable<any>;
  btnValider=false;
  idDir: any;
  PaaFile: any;

  detaille: any;

  paaId: any;
  items: any;

  constructor(
    private datePipe: DatePipe,
    private paaService: PaaService,
    private directoryService: DirectoryService,
    private fileService: FileService,
    private fb: FormBuilder,
    private etablissementService: EtablissementService,
    private http: HttpClient
    
  ) {
    this.pageSettings = { pageSize: 10 };
    this.myDateYear = this.datePipe.transform(this.myDateYear, 'yyyy');
    this.newRowForm = this.fb.group({
      inpuBudgetaire: [this.paaId, Validators.required],
      mntEstimatif: ['', Validators.required],
      objetDepense: ['', Validators.required],
      datePreviLancement: ['', Validators.required],
      datePreviAttribution: ['', Validators.required]
    });
    this.modifierForm = this.fb.group({
      id: ['', Validators.required],
      inpuBudgetaire: ['', Validators.required],
      mntEstimatif: ['', Validators.required],
      objetDepense: ['', Validators.required],
      datePreviLancement: ['', Validators.required],
      datePreviAttribution: ['', Validators.required]
    });

  }


  ngOnInit(): void {

    this.getPaa();
    this.initFormDeclanchement();
    this.initFormCreateDir();
    this.fileInfos = this.fileService.getFiles();
      this.loadEtablissements();
    

    // console.log(this.etablisementSelect.selected());

    
  }

  @ViewChild(OffcanvasComponent) offcanvas: OffcanvasComponent;
  @ViewChild(EtablissementSelectComponent) etablisementSelect: EtablissementSelectComponent;
  // detaille(id: any) {
  //   this.offcanvas.detaille(id);
  // }
  

  toggleOffcanvas(id:any) {
    this.offcanvas.toggleOffcanvas();
    console.log("l'id du paa : " + id);
    this.offcanvas.detaillePaa(id);
    
    
  }

  onFileInputClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // console.log('File selected:', file.name);
      this.paaService.uploadFile(file).subscribe(
        response => {
          this.message = 'File uploaded successfully!';
          this.getPaa();

        },
        error => {
          this.message = 'Failed to upload file: ' + error;
        }
      );
    } else {
      this.message = 'Please select a file first.';
    }
      // Ajoutez ici votre code pour gérer le fichier sélectionné
    }
  

    onDataBound() {
      this.grid.groupModule.collapseAll();
    }




  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
  onSelectPaa(paa: any) {
    this.selectedPaaId = paa.id;
  }


  upload(gedTbl: any,idElmn:any) {
    this.message = '';
    this.errorMsg = '';
    this.progress = 0;
    this.currentFile = this.selectedFiles.item(0);
    this.fileService.upload(this.currentFile, idElmn, 4,gedTbl).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.fileInfos = this.fileService.getFiles();
          if (this.progress === 100) {
            //this.message = '';
            this.btnValider = true
            this.currentFile = null;
            if(gedTbl === GED_TBL.EXPRESSION_BESOIN){
              this.btnValiderDeclanchement()
            }  else {
              this.formCreationDir.reset();
              this.dialogDossier.hide();
              this.getPaa();
            }


          }
        }
      },
      err => {
        this.progress = 0;
        console.log(err)
        this.errorMsg = err.error.message;
        this.currentFile = undefined;

      });

    //this.selectedFiles = undefined;

  }

  btnValiderDeclanchement() {
    Object.assign(this.validerFormDeclanchement.value, {id: this.selectedPaa[0]['id']})
    this.paaService.declancchementPost(this.validerFormDeclanchement.value).subscribe(
      {
        next: (value) => {
          console.log(value);
          this.getPaa();
          this.ejDialog.hide();
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.validerFormDeclanchement.reset();
        }
      })
  }

  getPaa() {
    const res = this.paaService.getPaa().subscribe({
      next: (value) => {
        // this.stepper = new Stepper(document.querySelector('#stepper1'), {
        //   linear: false,
        //   animation: true
        // });
        console.log(value)
        this.data = value
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  onSelect(item: any): void {
    if (item) {
      const token = localStorage.getItem('token');

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.get(`http://localhost:8089/api/rest/Paa/${item.id}`,{headers}).subscribe({
        // this.paaData = data;
        next: (value) => {
          this.data = value;

        },
        error: () => {
          
          this.data = "pas des donnees";
        }
      });
    }

    // this.itemselected = item;
    // console.log(item);
    
    
  }

  // selected() {
  //   return this.itemselected;
  // }

  loadEtablissements(): void {
    this.etablissementService.getEtablissements().subscribe(data => {
      // Ajouter une propriété combinée pour afficher à la fois l'ID et le nom
      this.items = data.map((item: any) => ({
        ...item,
        displayName: `${item.id}  | ${item.nom} `
      }));
      console.log("Les établissements :", this.items);
    });
  }

  validerPaa(id: any) {
    const res = this.paaService.validerPaa(id).subscribe({

      next: () => {
        // Rafraîchir la page après la suppression
        this.getPaa(); // Actualiser la liste des PAA après l'ajout
      }

    });
  }


  private cancelClick(): void {
    this.DialogObj.hide();
    this.validerFormDeclanchement.reset();
    this.dialogDossierObj.hide();
    this.dialogDossierDetail.hide();
  }

  public declancherProcedure = (event: any): void => {
    this.btnValider = false;
    this.cpass = true;
    this.ejDialog.show();
  };
  public declancherDetail = (event: any): void => {
    this.cpass = true;
   this.getFilesForPaa();
  };

  getFilesForPaa(){
    console.log(this.selectedPaa[0]['id'],GED_TBL.EXPRESSION_BESOIN);
    this.fileService.getDirPaa(this.selectedPaa[0]['id'],GED_TBL.EXPRESSION_BESOIN).subscribe(
      {
        next: (value) => {
          console.log(value)
          this.PaaFile =value;
          this.dialogDetail.show();

        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  validation(e) {
    this.message=''
    if (this.cpass) {
      e.cancel = false;
    } else {
      e.cancel = true;
    }
  }

  rowSelected(args: RowSelectEventArgs) {
    console.log(this.grid.getSelectedRecords())
    this.selectedPaa = this.grid.getSelectedRecords();
    console.log("le paa : " + this.selectedPaa[0]["id"]);
    this.paaId = this.selectedPaa[0]["id"];

// Exemple pour mettre à jour un seul champ du formulaire
  this.modifierForm.get('id')?.patchValue(this.selectedPaa[0]["id"]);
  this.modifierForm.get('inpuBudgetaire')?.patchValue(this.selectedPaa[0]["inpuBudgetaire"]);
  this.modifierForm.get('mntEstimatif')?.patchValue(this.selectedPaa[0]["mntEstimatif"]);
  this.modifierForm.get('objetDepense')?.patchValue(this.selectedPaa[0]["objetDepense"]);
  this.modifierForm.get('datePreviLancement')?.patchValue(this.selectedPaa[0]["datePreviLancement"]);
  this.modifierForm.get('datePreviAttribution')?.patchValue(this.selectedPaa[0]["datePreviAttribution"]);

    

    this.initFormCreateDir();
  }

  rowDeselected($event: RowDeselectEventArgs) {
    this.selectedPaa = null;
    console.log(this.selectedPaa)
  }

  validerFormDeclanchement: FormGroup;

  initFormDeclanchement() {
    this.validerFormDeclanchement = this.fb.group({
      file: [null, Validators.required],
      origine: [null, Validators.required],
      destinataire: [null, Validators.required],
    });
  }


  imprimer(id,idTbl) {
    this.paaService.telechargerPieceJointe(id,idTbl).subscribe((value: Blob) => {
      console.log(value);
      const blob = new Blob([value], {type: 'application/pdf'});
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    }, (error) => {
      console.log(error);
    }, () => {
      console.log('completed');
    });
  }
  downloadFile(fileData: any): void {
    this.directoryService
      .download(fileData.fileNameOnDisc, fileData.fileSubFolder)
      .subscribe(blob => saveAs(blob, fileData.fileNameOnDisc));
  }
  CreationDossier($event: MouseEvent) {
    this.cpass = true;
    this.message = '';
    this.errorMsg = '';
    this.dialogDossier.show();
    this.btnValider = false;
  }
  addNewRow() {
    if (this.newRowForm.valid) {
      this.ajouterPaa(); // Appel de la méthode ajouterPaa() pour envoyer les données à l'API
      console.log('Nouvelle ligne ajoutée :', this.newRowForm.value);
      this.newRowForm.reset();
      this.showNewRow = false;
    }
  }

  modifierPaa(id:any) {

    console.log("le paa a modifier : " + id);
    
    const nouveauPaa = {
      inpuBudgetaire: this.modifierForm.get('inpuBudgetaire').value,
      mntEstimatif: this.modifierForm.get('mntEstimatif').value,
      objetDepense: this.modifierForm.get('objetDepense').value,
      datePreviLancement: this.modifierForm.get('datePreviLancement').value,
      datePreviAttribution: this.modifierForm.get('datePreviAttribution').value
    };

    this.paaService.modifierPaa(id, nouveauPaa).subscribe({

      next: (value) => {
        console.log("modifier avec succee");
        this.getPaa(); // Actualiser la liste des PAA après l'ajout
      }
      
    });
    
  }

  ajouterPaa(): void {
    const nouveauPaa = {
      inpuBudgetaire: this.newRowForm.get('inpuBudgetaire').value,
      mntEstimatif: this.newRowForm.get('mntEstimatif').value,
      objetDepense: this.newRowForm.get('objetDepense').value,
      datePreviLancement: this.newRowForm.get('datePreviLancement').value,
      datePreviAttribution: this.newRowForm.get('datePreviAttribution').value
    };

    this.paaService.addPaa(nouveauPaa).subscribe(
      (response) => {
        console.log('PAA ajouté avec succès:', response);
        // Réinitialiser le formulaire ou faire autre chose après l'ajout
        this.newRowForm.reset();
        this.showNewRow = false;
        this.getPaa(); // Actualiser la liste des PAA après l'ajout
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du PAA:', error);
      }
    );
  }
  supprimerPaa(id: number): void {
    this.paaService.supprimerPaa(id).subscribe(
      (response) => {
        console.log('PAA supprimée avec succès:', response);
        // Rafraîchir la page après la suppression
        this.getPaa(); // Actualiser la liste des PAA après l'ajout
      },
      (error) => {
                // Rafraîchir la page après la suppression
       this.getPaa(); // Actualiser la liste des PAA après l'ajout

        console.error('Erreur lors de la suppression de la PAA:', error);
      }
    );
  }




  // public stepper: Stepper;
  formCreationDir: FormGroup;
  myDateYear: any = new Date();

  // next() {
  //   this.stepper.next();
  // }

  // previous() {
  //   this.stepper.previous();
  // }

  initFormCreateDir() {
    if (this.selectedPaa != null) {
      this.formCreationDir = this.fb.group({
        reference: [this.selectedPaa[0]['id'] + '/' + this.myDateYear, Validators.required],
        objetDepense: [this.selectedPaa[0]['objetDepense'], Validators.required],
        inpuBudgetaire: [this.selectedPaa[0]['inpuBudgetaire'], Validators.required],
        file: ['', Validators.required],

      });
    } else {
      this.formCreationDir = this.fb.group({
        reference: ['/' + this.myDateYear, Validators.required],
        objetDepense: ['', Validators.required],
        inpuBudgetaire: ['', Validators.required],
        file: ['', Validators.required],
      });
    }

  }


  validerCreationDir() {
    const obj = {reference: this.formCreationDir.get('reference').value, idPaa: this.selectedPaa[0]['id'],fkIduser:4};
    this.paaService.validateCreateDir(obj).subscribe(
      {
        next: (value) => {
          this.idDir = value.id;
          this.upload(GED_TBL.INITIATION_PROCEDURE, this.idDir);
          this.message = '';
          this.errorMsg = '';
        },
        error: (error) => {
          console.log(error);
        },
      });
    // this.next();
  }
}
