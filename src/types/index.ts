export type StatutVehicule = 'disponible' | 'loue' | 'maintenance' | 'hors_service';
export type TypeCarburant = 'essence' | 'diesel' | 'electrique' | 'hybride';
export type StatutLocation = 'en_attente' | 'en_cours' | 'termine' | 'annule';
export type StatutFacture = 'paye' | 'impaye' | 'partiel';
export type StatutApprovisionnement = 'en_attente' | 'en_cours' | 'livre' | 'annule';

export interface Vehicule {
  id: string;
  marque: string;
  modele: string;
  annee: number;
  immatriculation: string;
  kilometrage: number;
  statut: StatutVehicule;
  carburant: TypeCarburant;
  photo?: string;
  prixLocation: number;
  assuranceValide: boolean;
  carteGrise?: string;
}

export interface Piece {
  id: string;
  nom: string;
  reference: string;
  numeroSerie: string;
  categorie: string;
  qtyStock: number;
  seuilAlerte: number;
  prixUnit: number;
  fournisseur: string;
  dateEntree: Date;
  photo?: string;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  numeroPermis: string;
  dateExpirationPermis: Date;
  dateInscription: Date;
  photoPermis?: string;
}

export interface Allocation {
  id: string;
  clientId: string;
  vehiculeId: string;
  dateDebut: Date;
  dateFin: Date;
  kmDepart: number;
  kmRetour?: number;
  statut: StatutLocation;
  tarifTotal: number;
  optionsSupplementaires: string[];
  signatureClient?: string;
  photosDepart?: string[];
  photosRetour?: string[];
  fraisSupplementaires?: number;
  motifFrais?: string;
}

export interface Facture {
  id: string;
  numero: string;
  allocationId: string;
  clientId: string;
  dateEmission: Date;
  totalHT: number;
  tva: number;
  totalTTC: number;
  statut: StatutFacture;
  datePaiement?: Date;
}

export interface LigneApprovisionnement {
  pieceId: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export interface Approvisionnement {
  id: string;
  numero: string;
  fournisseur: string;
  dateCommande: Date;
  dateLivraisonPrevue?: Date;
  dateLivraison?: Date;
  statut: StatutApprovisionnement;
  lignes: LigneApprovisionnement[];
  totalHT: number;
  tva: number;
  totalTTC: number;
  notes?: string;
}
