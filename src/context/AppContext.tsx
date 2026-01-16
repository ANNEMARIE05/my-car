import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Vehicule, Piece, Client, Allocation, Facture, Approvisionnement } from '../types';

interface AppContextType {
  estConnecte: boolean;
  connecter: (email: string, motDePasse: string) => void;
  deconnecter: () => void;
  vehicules: Vehicule[];
  setVehicules: React.Dispatch<React.SetStateAction<Vehicule[]>>;
  pieces: Piece[];
  setPieces: React.Dispatch<React.SetStateAction<Piece[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  allocations: Allocation[];
  setAllocations: React.Dispatch<React.SetStateAction<Allocation[]>>;
  factures: Facture[];
  setFactures: React.Dispatch<React.SetStateAction<Facture[]>>;
  approvisionnements: Approvisionnement[];
  setApprovisionnements: React.Dispatch<React.SetStateAction<Approvisionnement[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [estConnecte, setEstConnecte] = useState(false);
  
  // Données de test initiales
  const [vehicules, setVehicules] = useState<Vehicule[]>([
    {
      id: '1',
      marque: 'Tesla',
      modele: 'Model 3',
      annee: 2023,
      immatriculation: 'AB-123-CD',
      kilometrage: 15000,
      statut: 'disponible',
      carburant: 'electrique',
      prixLocation: 120,
      assuranceValide: true,
      photo: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop',
    },
    {
      id: '2',
      marque: 'BMW',
      modele: 'Série 3',
      annee: 2022,
      immatriculation: 'EF-456-GH',
      kilometrage: 35000,
      statut: 'loue',
      carburant: 'diesel',
      prixLocation: 150,
      assuranceValide: true,
      photo: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    },
    {
      id: '3',
      marque: 'Peugeot',
      modele: '208',
      annee: 2023,
      immatriculation: 'IJ-789-KL',
      kilometrage: 8000,
      statut: 'disponible',
      carburant: 'essence',
      prixLocation: 60,
      assuranceValide: true,
      photo: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    },
  ]);
  
  const [pieces, setPieces] = useState<Piece[]>([
    {
      id: '1',
      nom: 'Plaquette de frein avant',
      reference: 'PF-001',
      numeroSerie: 'PF0012024001',
      categorie: 'freinage',
      qtyStock: 3,
      seuilAlerte: 5,
      prixUnit: 45.99,
      fournisseur: 'AutoParts France',
      dateEntree: new Date('2024-01-15'),
      photo: 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      nom: 'Filtre à air',
      reference: 'FA-002',
      numeroSerie: 'FA0022024002',
      categorie: 'moteur',
      qtyStock: 15,
      seuilAlerte: 10,
      prixUnit: 12.50,
      fournisseur: 'Moteur Express',
      dateEntree: new Date('2024-01-10'),
    },
  ]);
  
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.com',
      telephone: '06 12 34 56 78',
      adresse: '123 Rue de Paris, 75001 Paris',
      numeroPermis: '12345678901234',
      dateExpirationPermis: new Date('2029-12-31'),
      dateInscription: new Date('2023-01-15'),
    },
    {
      id: '2',
      nom: 'Martin',
      prenom: 'Marie',
      email: 'marie.martin@email.com',
      telephone: '06 98 76 54 32',
      adresse: '456 Avenue des Champs, 69001 Lyon',
      numeroPermis: '98765432109876',
      dateExpirationPermis: new Date('2028-06-30'),
      dateInscription: new Date('2023-03-20'),
    },
  ]);
  
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [approvisionnements, setApprovisionnements] = useState<Approvisionnement[]>([]);

  const connecter = (email: string, motDePasse: string) => {
    // Simulation de connexion
    if (email && motDePasse) {
      setEstConnecte(true);
    }
  };

  const deconnecter = () => {
    setEstConnecte(false);
  };

  return (
    <AppContext.Provider
      value={{
        estConnecte,
        connecter,
        deconnecter,
        vehicules,
        setVehicules,
        pieces,
        setPieces,
        clients,
        setClients,
        allocations,
        setAllocations,
        factures,
        setFactures,
        approvisionnements,
        setApprovisionnements,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé dans AppProvider');
  }
  return context;
};
