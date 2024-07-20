import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridComponent, RowDeselectEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PaaService } from 'src/app/services/paa.service';
import { ProcedurePaaService } from 'src/app/services/procedure.service';

@Component({
  selector: 'app-offcanvas',
  templateUrl: './offcanvas.component.html',
  styleUrls: ['./offcanvas.component.scss']
})
export class OffcanvasComponent implements OnInit {

  detaille: any;
  user: any;
  viewType: string = 'PAA'; // Default view type


  public pageSettings: Object;
  selectedPaa: any;

  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;

  modifierForm: FormGroup;


  etablissement: any;
  btnValider = false;
  modifierRow: boolean = false;
  newRowForm: FormGroup;
  showNewRow: boolean = false;



  cpass = false;

  validerFormDeclanchement: FormGroup;

  




  constructor(private paaService: PaaService, private auth: AuthenticationService, private procedureService: ProcedurePaaService, private http: HttpClient,    private fb: FormBuilder,
  ) {
    this.pageSettings = { pageSize: 10 };

    this.modifierForm = this.fb.group({
      id: ['', Validators.required],
      inpuBudgetaire: ['', Validators.required],
      mntEstimatif: ['', Validators.required],
      objetDepense: ['', Validators.required],
      datePreviLancement: ['', Validators.required],
      datePreviAttribution: ['', Validators.required]
    });

   }

  ngOnInit(): void { }

  showOffcanvas = false;

  toggleOffcanvas(viewType: string) {
    this.showOffcanvas = !this.showOffcanvas;
    this.viewType = viewType;
  }


  rowSelected(args: RowSelectEventArgs) {
    console.log(this.grid.getSelectedRecords());
    this.selectedPaa = this.grid.getSelectedRecords();
    console.log("le paa : " + this.selectedPaa[0]["id"]);
   
  }

  rowDeselected($event: RowDeselectEventArgs) {
    this.selectedPaa = null;
    console.log(this.selectedPaa);
  }

  public declancherProcedure = (event: any): void => {
    this.btnValider = false;
    this.cpass = true;
    this.ejDialog.show();

    // this.validerFormDeclanchement.get("destinataire").patchValue(this.nom)
    // this.validerFormDeclanchement.get("sourceFinanciere").patchValue(this.selectedPaa[0]['inpuBudgetaire'])
  };

  addNewRow() {
    if (this.newRowForm.valid) {
      this.ajouterPaa();
      console.log('Nouvelle ligne ajoutée :', this.newRowForm.value);
      this.newRowForm.reset();
      this.showNewRow = false;
    }
  }

  modifierPaa(id: any) {
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
        // this.getPaa();
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
        this.newRowForm.reset();
        this.showNewRow = false;
        // this.getPaa();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du PAA:', error);
      }
    );
  }

  detaillePaa(id: any): any {
    this.paaService.getDetaillPaa(id).subscribe({
      next: (value) => {

        let found = false;
        this.detaille = value;
        this.viewType = 'PAA';
        value.forEach(v => {

          
          if (!found) {
            this.etablissement = v.etablissement.nom;
            console.log("l'etablissement : "+this.etablissement);
            
            found = true;
            
          }

          
          
        });
        found = false;
        console.log("les detail de paa : "+JSON.stringify(value));
      },
      error: (e) => {
        console.log(e);
      }
    });
    this.user = this.auth.isAdmin();
  }

  validerPaa(id: any) {
    const res = this.paaService.validerPaa(id).subscribe();
  }

  supprimerPaa(id: number): void {
    this.paaService.supprimerPaa(id).subscribe(
      (response) => {
        console.log('PAA supprimée avec succès:', response);
        // this.getPaa();
        this.detaillePaa(this.selectedPaa[0]["id"]);
      },
      (error) => {
        // this.getPaa();
        console.error('Erreur lors de la suppression de la PAA:', error);
      }
    );
  }

  detailleProcedure(id: any): any {
    this.procedureService.getProcedureById(id).subscribe({
      next: (value) => {
        this.detaille = value;
        this.viewType = 'Procedure';
        console.log("la procedure : " + value);
      }
    });
  }

  getFileName(path: string): string {
    return path ? path.split('/').pop() : '';
  }
  
  download(filePath: any,dossier:any): void {
    this.procedureService.downloadFile(filePath,dossier).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('File download error:', error);
      }
    );
  }
  
  removeBeforeLastUnderscore(filename) {
    const lastUnderscoreIndex = filename.lastIndexOf('_');
    if (lastUnderscoreIndex === -1) {
        return filename; // Return the original string if no underscore is found
    }
    return filename.substring(lastUnderscoreIndex + 1);
}
  
}
