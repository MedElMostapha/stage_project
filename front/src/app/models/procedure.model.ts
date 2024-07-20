export interface ProcedurePaa {
  origin: string;
  destinataire: string;
  sourceFinanciere: string;
  description: string;
  deadlineEstime: string;
  montant: number;

  paa: { id: number };
  verdicts?: any[];
}
