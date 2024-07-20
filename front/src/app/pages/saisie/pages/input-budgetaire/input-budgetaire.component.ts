import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GridComponent, RowDeselectEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import { EtablissementService } from 'src/app/services/etablissement.service';
import { InputBudgetaireService } from 'src/app/services/input-budgetaire.service';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-input-budgetaire',
  templateUrl: './input-budgetaire.component.html',
  styleUrls: ['./input-budgetaire.component.scss']
})
export class InputBudgetaireComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  public positionModal: PositionDataModel = { X: 450, Y: 100 };
  public targetElement: HTMLElement;
  validerFormDeclanchement: FormGroup;

  inputSelected: any;
  public pageSettings: Object;
  data: any;
  contrats: any;
  modes: any;
  message: string;
  cpass: any;
  public isVisible: boolean = false;
  items: any;
  selectedItem: any;
  copiedBudgetNumber: boolean[] = [];

  years: number[] = [];
  selectedYear: number;

  constructor(private fb: FormBuilder, private http: HttpClient, private input: InputBudgetaireService, private etablissementService: EtablissementService) {
    this.pageSettings = { pageSize: 10 };
  }

  ngOnInit(): void {
    this.validerFormDeclanchement = this.fb.group({
      etablissementId: [null, Validators.required],
      typeMarcherid: [null, Validators.required],
      typeSelectionid: [null, Validators.required]
    });

    this.getInputs();
    this.getContrats();
    this.getModes();
    this.initilaizeTarget();
    this.loadEtablissements();

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2000; year--) {
      this.years.push(year);
    }
  }

  onSubmit(): void {
    if (this.validerFormDeclanchement.valid) {
      const token = localStorage.getItem('token');

      const formValues = this.validerFormDeclanchement.value;
      const body = new HttpParams()
        .set('typeSelectionid', formValues.typeSelectionid)
        .set('typeMarcherid', formValues.typeMarcherid)
        .set('etablissementId', formValues.etablissementId);

      this.http.post('http://localhost:8081/api/rest/input', body.toString(), {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', `Bearer ${token}`)
      }).subscribe(response => {
        this.validerFormDeclanchement.reset();
        this.ejDialog.hide();

        this.getInputs();

        console.log('Données envoyées avec succès', response);
      }, error => {
        console.error('Erreur lors de l\'envoi des données', error);
      });
    } else {
      console.log('Formulaire invalide');
    }
  }

  onSelect(item: any): void {
    // Logique pour gérer la sélection des éléments
  }

  rowSelected(args: RowSelectEventArgs): void {
    console.log(this.grid.getSelectedRecords());
    this.inputSelected = this.grid.getSelectedRecords()[0]; // Sélectionner le premier élément si plusieurs sont sélectionnés
  }

  rowDeselected($event: RowDeselectEventArgs): void {
    this.inputSelected = null;
  }

  deleteInput(): void {
    if (this.inputSelected && this.inputSelected.id) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const id = this.inputSelected.id;
      this.http.delete(`http://localhost:8081/api/rest/input/${id}`, { headers }).subscribe(response => {
        console.log('Donnée supprimée avec succès', response);
        this.getInputs();  // Rafraîchir les données après suppression
        this.inputSelected = null; // Réinitialiser la sélection
      }, error => {
        console.error('Erreur lors de la suppression de la donnée', error);
      });
    }
  }

  editInput(): void {
    if (this.inputSelected) {
      this.isVisible = true;
      this.validerFormDeclanchement.patchValue(this.inputSelected);
      this.ejDialog.show();
    }
  }

  getInputs(): void {
    this.input.getInputs().subscribe({
      next: (value) => {
        this.data = value;
        this.copiedBudgetNumber = new Array(this.data.length).fill(false);
        console.log(value);
      }
    });
  }

  getContrats(): void {
    this.input.getContrats().subscribe({
      next: (value) => {
        this.contrats = value.map((item: any) => ({
          ...item,
          typeMarche: item.nom
        }));
      }
    });
  }

  getModes(): void {
    this.input.getModes().subscribe({
      next: (value) => {
        this.modes = value.map((item: any) => ({
          ...item,
          typemode: item.nom
        }));
        console.log(value);
      }
    });
  }

  public initilaizeTarget: any = () => {
    this.targetElement = document.body;
  };

  public declancherProcedure(): void {
    this.isVisible = true;
    this.ejDialog.show();
  }

  loadEtablissements(): void {
    this.etablissementService.getEtablissements().subscribe(data => {
      this.items = data.map((item: any) => ({
        ...item,
        displayName: `${item.id} - ${item.nom}`
      }));
      console.log("Les établissements :", this.items);
    });
  }

  copyToClipboard(value: string, index: number, field: string): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    // Met à jour l'état du bouton
    switch (field) {
      case 'budgetNumber':
        this.copiedBudgetNumber[index] = true;
        break;
      default:
        break;
    }

    // Swal.fire({
    //   title: 'Copié!',
    //   text: 'Le texte a été copié dans le presse-papiers.',
    //   icon: 'success',
    //   timer: 2000,
    //   showConfirmButton: false
    // });


    // Réinitialise le texte après quelques secondes
    setTimeout(() => {
      switch (field) {
        case 'budgetNumber':
          this.copiedBudgetNumber[index] = false;
          break;
        default:
          break;
      }
    }, 2000); // Réinitialise après 2 secondes
  }
}
