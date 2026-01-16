import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Download,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import type { Facture, StatutFacture } from '../types';
import toast from 'react-hot-toast';
import { Pagination } from '../components/Pagination';

export const Facturation = () => {
  const { factures, setFactures, allocations, clients, vehicules } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(factures.length / itemsPerPage);

  // S'assurer que la page actuelle est valide
  const validCurrentPage = useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      return 1;
    }
    return currentPage;
  }, [currentPage, totalPages]);

  const facturesPaginees = useMemo(() => {
    const pageToUse = validCurrentPage;
    const startIndex = (pageToUse - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return factures.slice(startIndex, endIndex);
  }, [factures, validCurrentPage, itemsPerPage]);

  const getStatutBadge = (statut: StatutFacture) => {
    const configs = {
      paye: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Payé' },
      impaye: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Impayé' },
      partiel: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700', label: 'Partiel' },
    };
    const config = configs[statut];
    const Icon = config.icon;
    return (
      <span className={`badge ${config.color} flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const genererFacture = useCallback((allocationId: string) => {
    const allocation = allocations.find((a) => a.id === allocationId);
    if (!allocation) {
      toast.error('Allocation non trouvée');
      return;
    }

    const client = clients.find((c) => c.id === allocation.clientId);
    const vehicule = vehicules.find((v) => v.id === allocation.vehiculeId);
    if (!client || !vehicule) {
      toast.error('Données incomplètes');
      return;
    }

    const now = Date.now();
    const numeroFacture = `FAC-${now.toString().slice(-8)}`;
    const totalHT = allocation.tarifTotal;
    const tva = totalHT * 0.2;
    const totalTTC = totalHT + tva;

    const nouvelleFacture: Facture = {
      id: now.toString(),
      numero: numeroFacture,
      allocationId: allocation.id,
      clientId: client.id,
      dateEmission: new Date(),
      totalHT,
      tva,
      totalTTC,
      statut: 'impaye',
    };

    setFactures((prevFactures) => [...prevFactures, nouvelleFacture]);
    toast.success('Facture générée avec succès');
  }, [allocations, clients, vehicules, setFactures]);

  const genererPDF = (facture: Facture) => {
    const allocation = allocations.find((a) => a.id === facture.allocationId);
    const client = clients.find((c) => c.id === facture.clientId);
    const vehicule = vehicules.find((v) => v.id === allocation?.vehiculeId);

    if (!allocation || !client || !vehicule) {
      toast.error('Données incomplètes');
      return;
    }

    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('FLOTTE PRO', 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('123 Rue de la Flotte', 20, 40);
    doc.text('75001 Paris, France', 20, 45);
    doc.text('Tél: +33 1 23 45 67 89', 20, 50);
    doc.text('Email: contact@flottepro.fr', 20, 55);

    // Informations facture
    doc.setFontSize(16);
    doc.text('FACTURE', 150, 30);
    doc.setFontSize(10);
    doc.text(`N°: ${facture.numero}`, 150, 40);
    doc.text(`Date: ${format(facture.dateEmission, 'dd/MM/yyyy')}`, 150, 45);

    // Client
    doc.setFontSize(12);
    doc.text('FACTURÉ À:', 20, 75);
    doc.setFontSize(10);
    doc.text(`${client.prenom} ${client.nom}`, 20, 85);
    doc.text(client.adresse, 20, 90);
    doc.text(client.email, 20, 95);
    doc.text(client.telephone, 20, 100);

    // Détails
    doc.setFontSize(12);
    doc.text('DÉTAILS DE LA LOCATION', 20, 120);
    
    doc.setFontSize(10);
    let y = 130;
    doc.text(`Véhicule: ${vehicule.marque} ${vehicule.modele} (${vehicule.immatriculation})`, 20, y);
    y += 10;
    doc.text(`Période: ${format(allocation.dateDebut, 'dd/MM/yyyy')} au ${format(allocation.dateFin, 'dd/MM/yyyy')}`, 20, y);
    y += 10;
    doc.text(`Tarif de base: ${allocation.tarifTotal.toFixed(2)} FCFA HT`, 20, y);
    y += 10;
    if (allocation.optionsSupplementaires && allocation.optionsSupplementaires.length > 0) {
      doc.text(`Options: ${allocation.optionsSupplementaires.join(', ')}`, 20, y);
      y += 10;
    }
    if (allocation.fraisSupplementaires) {
      doc.text(`Frais supplémentaires: ${allocation.fraisSupplementaires.toFixed(2)} FCFA`, 20, y);
      y += 5;
    }

    // Totaux
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(120, y, 190, y);
    y += 10;
    doc.text(`Total HT: ${facture.totalHT.toFixed(2)} FCFA`, 150, y);
    y += 10;
    doc.text(`TVA (20%): ${facture.tva.toFixed(2)} FCFA`, 150, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Total TTC: ${facture.totalTTC.toFixed(2)} FCFA`, 150, y);

    // Conditions
    y += 20;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Conditions de paiement: Paiement à réception de facture', 20, y);
    y += 5;
    doc.text('En cas de retard de paiement, des pénalités de 3 fois le taux légal seront appliquées.', 20, y);

    doc.save(`facture-${facture.numero}.pdf`);
    toast.success('Facture PDF générée');
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-display mb-1 sm:mb-2">Facturation</h1>
        <p className="text-sm sm:text-base text-slate-600">Gérez vos factures et paiements</p>
      </div>

      {/* Liste des factures */}
      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
        {facturesPaginees.map((facture) => {
          const client = clients.find((c) => c.id === facture.clientId);

          return (
            <motion.div
              key={facture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-white rounded-xl shadow-md p-3 sm:p-4 lg:p-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{facture.numero}</h3>
                    {getStatutBadge(facture.statut)}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-slate-600">Client</p>
                      <p className="font-medium text-slate-900">
                        {client ? `${client.prenom} ${client.nom}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Date d'émission</p>
                      <p className="font-medium text-slate-900">
                        {format(facture.dateEmission, 'dd MMM yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Montant TTC</p>
                      <p className="text-base sm:text-lg lg:text-xl font-bold text-blue-600">
                        {facture.totalTTC.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => genererPDF(facture)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    title="Télécharger PDF"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                    title="Envoyer par email"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {factures.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-slate-600 text-base sm:text-lg mb-3 sm:mb-4">Aucune facture trouvée</p>
          <p className="text-xs sm:text-sm text-slate-500">
            Les factures sont générées automatiquement lors du retour d'un véhicule
          </p>
        </div>
      )}

      {/* Générer factures depuis allocations terminées */}
      {allocations.filter((a) => a.statut === 'termine' && !factures.some((f) => f.allocationId === a.id))
        .length > 0 && (
        <div className="card bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Allocations terminées sans facture</h3>
          <div className="space-y-2">
            {allocations
              .filter((a) => a.statut === 'termine' && !factures.some((f) => f.allocationId === a.id))
              .map((allocation) => {
                const client = clients.find((c) => c.id === allocation.clientId);
                return (
                  <div
                    key={allocation.id}
                    className="flex items-center justify-between bg-white p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {client ? `${client.prenom} ${client.nom}` : 'Client inconnu'} -{' '}
                        {format(allocation.dateDebut, 'dd/MM/yyyy')}
                      </p>
                      <p className="text-sm text-slate-600">
                        Total: {allocation.tarifTotal.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => genererFacture(allocation.id)}
                      className="btn-primary text-sm"
                    >
                      Générer facture
                    </motion.button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {factures.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={validCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={factures.length}
        />
      )}
    </div>
  );
};
