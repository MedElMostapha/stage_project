// src/app/pages/procedure/procedure.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogComponent, PositionDataModel } from '@syncfusion/ej2-angular-popups';
import { GridComponent, RowDeselectEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';
import { ProcedurePaaService } from 'src/app/services/procedure.service';
import { ProcedurePaa } from 'src/app/models/procedure.model';
import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';
import { OffcanvasComponent } from '../components/offcanvas/offcanvas.component';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.scss']
})
export class ProcedureComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild(OffcanvasComponent) offcanvas: OffcanvasComponent;


  public isVisible: boolean = false;
  public procedureForm: FormGroup;
  public procedures: ProcedurePaa[] = [];
  public selectedProcedure: any;
  public selectedFile: File = null;
  detaille: any;

  public positionModal: PositionDataModel = { X: 'center', Y: 'top' };
  public targetElement: HTMLElement;
  public pageSettings: any = { pageSize: 10 };

  constructor(private fb: FormBuilder, private procedurePaaService: ProcedurePaaService, private http: HttpClient) {}

  ngOnInit(): void {
    this.procedureForm = this.fb.group({
      deadlineEstime: ['', Validators.required],
      description: ['', Validators.required],
      destinataire: ['', Validators.required],
      montant: ['', Validators.required],
      origin: ['', Validators.required],
      sourceFinanciere: ['', Validators.required],
      paa: ['', Validators.required],
      file: [null, Validators.required]
    });
    this.loadProcedures();
    this.targetElement = document.body;
  }

  loadProcedures(): void {
    this.procedurePaaService.getAllProcedures().subscribe(
      (data: ProcedurePaa[]) => {
        this.procedures = data;
      },
      (error) => {
        console.error('Error fetching procedures', error);
      }
    );
  }

  triggerAddEdit(add: boolean, procedure?: ProcedurePaa): void {
    this.selectedProcedure = add ? null : procedure;
    if (add) {
      this.procedureForm.reset();
    } else {
      this.procedureForm.patchValue({
        deadlineEstime: procedure.deadlineEstime,
        description: procedure.description,
        destinataire: procedure.destinataire,
        montant: procedure.montant,
        origin: procedure.origin,
        sourceFinanciere: procedure.sourceFinanciere,
        paa: procedure.paa.id,
        file: null
      });
    }
    this.isVisible = true;
  }

  selectFile(event: any): void {
    this.selectedFile = event.target.files[0];
    this.procedureForm.patchValue({ file: this.selectedFile });
  }

  onSubmit(): void {
    if (this.procedureForm.valid) {
      const formData = this.procedureForm.value;
      const procedure: ProcedurePaa = {
        deadlineEstime: formData.deadlineEstime,
        description: formData.description,
        destinataire: formData.destinataire,
        montant: formData.montant,
        origin: formData.origin,
    
        sourceFinanciere: formData.sourceFinanciere,
        paa: { id: formData.paa },
        verdicts: []
      };

      const file = this.selectedFile;
      if (file) {
        // procedure.pathInitialProcedure = `C:\\Users\\lapto\\Desktop\\stage_project_old\\uploads\\procedures\\report_${this.selectedPaa[0]['id']}.pdf`;
      }

      if (this.selectedProcedure) {
        // this.updateProcedure(procedure);
      } else {
        this.createProcedure(procedure);
      }
    } else {
      console.error('Form is invalid');
    }
  }

  private createProcedure(procedure: ProcedurePaa): void {
    if (this.selectedFile) {
      this.procedurePaaService.createProcedure(procedure, this.selectedFile).subscribe({
        next: (value) => {
          console.log('Procedure created successfully', value);
          this.loadProcedures();
          this.ejDialog.hide();
        },
        error: (error) => {
          console.error('Failed to create procedure', error);
        }
      });
    } else {
      console.error('No file selected');
    }
  }

   deleteProcedure(id: any) {
    this.procedurePaaService.deleteProcedure(id).subscribe({
      next: () => {
        this.loadProcedures();

      }
    });
  }

  // private updateProcedure(procedure: ProcedurePaa): void {
  //   if (this.selectedFile) {
  //     this.procedurePaaService.updateProcedure( procedure, this.selectedFile).subscribe({
  //       next: (response) => {
  //         console.log('Update successful', response);
  //         this.loadProcedures();
  //         this.ejDialog.hide();
  //       },
  //       error: (error) => {
  //         console.error('Failed to update procedure', error);
  //       }
  //     });
  //   } else {
  //     console.error('No file selected');
  //   }
  // }

  rowSelected(args: RowSelectEventArgs): void {
    this.selectedProcedure = this.grid.getSelectedRecords();;
    // console.log("la procedure selectionnee : "+this.selectedProcedure[0]["id"]);
    
  }

  rowDeselected(args: RowDeselectEventArgs): void {
    this.selectedProcedure = null;
  }


  toggleOffcanvas(id: any) {
    this.offcanvas.toggleOffcanvas("Procedure");
    // console.log("l'id de la procedure : " + id);
    this.offcanvas.detailleProcedure(id);
  }

  // download(file: any) {
  //   this.procedurePaaService.downloadFile(file).subscribe();
  // }
}
