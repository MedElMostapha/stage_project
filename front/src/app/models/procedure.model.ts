export interface ProcedurePaa {
  id: number;
  origin: string;
  destinataire: string;
  sourceFinanciere: string;
  description: string;
  deadlineEstime: string;
  montant: number;
  pathInitialProcedure: string;
  pathBesoin: string;
  paa: { id: number };
  verdicts?: any[];
}
