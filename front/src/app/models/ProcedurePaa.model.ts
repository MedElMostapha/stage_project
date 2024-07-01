// src/app/models/ProcedurePaa.model.ts
export interface ProcedurePaa {
  id: number;
  deadline_estime: string;
  description: string;
  montant: number;
  origin: string;
  destinataire: string;
  path_besoin: string;
  path_initial_procedure: string;
  source_financiere: string;
  paaid: number;
}
