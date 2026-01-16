import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  ClipboardList,
  Plus,
  Calendar,
  Car,
  User,
  Gauge,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import SignatureCanvas from 'react-signature-canvas';
import type { Allocation, StatutLocation } from '../types';
import toast from 'react-hot-toast';
import { Pagination } from '../components/Pagination';

export const Allocations = () => {
  const { allocations, setAllocations, vehicules, setVehicules, clients } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showRetourModal, setShowRetourModal] = useState(false);
  const [allocationSelectionnee, setAllocationSelectionnee] = useState<Allocation | null>(null);
  const [signatureRef, setSignatureRef] = useState<SignatureCanvas | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState<Partial<Allocation>>({
    clientId: '',
    vehiculeId: '',
    dateDebut: new Date(),
    dateFin: new Date(),
    kmDepart: 0,
    tarifTotal: 0,
    optionsSupplementaires: [],
    statut: 'en_attente',
  });

  const allocationsFiltrees = useMemo(() => {
    return allocations;
  }, [allocations]);

  const allocationsPaginees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allocationsFiltrees.slice(startIndex, endIndex);
  }, [allocationsFiltrees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allocationsFiltrees.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const getStatutBadge = (statut: StatutLocation) => {
    const configs = {
      en_attente: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'En attente' },
      en_cours: { icon: Car, color: 'bg-blue-100 text-blue-700', label: 'En cours' },
      termine: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Terminé' },
      annule: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Annulé' },
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

  const vehiculesDisponibles = vehicules.filter((v) => v.statut === 'disponible');

  const handleAjouter = () => {
    setAllocationSelectionnee(null);
    setFormData({
      clientId: '',
      vehiculeId: '',
      dateDebut: new Date(),
      dateFin: new Date(),
      kmDepart: 0,
      tarifTotal: 0,
      optionsSupplementaires: [],
      statut: 'en_cours',
    });
    setShowModal(true);
  };

  const handleRetour = (allocation: Allocation) => {
    setAllocationSelectionnee(allocation);
    setShowRetourModal(true);
  };

  const calculerTarif = () => {
    const vehicule = vehicules.find((v) => v.id === formData.vehiculeId);
    if (!vehicule || !formData.dateDebut || !formData.dateFin) return;

    const debut = new Date(formData.dateDebut);
    const fin = new Date(formData.dateFin);
    const jours = Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const tarifBase = vehicule.prixLocation * jours;
    const options = formData.optionsSupplementaires?.length || 0;
    const tarifOptions = options * 10; // 10 FCFA par option
    
    setFormData({ ...formData, tarifTotal: tarifBase + tarifOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const signature = signatureRef?.toDataURL() || '';

    const nouvelleAllocation: Allocation = {
      id: Date.now().toString(),
      clientId: formData.clientId || '',
      vehiculeId: formData.vehiculeId || '',
      dateDebut: formData.dateDebut || new Date(),
      dateFin: formData.dateFin || new Date(),
      kmDepart: formData.kmDepart || 0,
      statut: 'en_cours',
      tarifTotal: formData.tarifTotal || 0,
      optionsSupplementaires: formData.optionsSupplementaires || [],
      signatureClient: signature,
    };

    setAllocations([...allocations, nouvelleAllocation]);
    
    // Mettre à jour le statut du véhicule
    if (formData.vehiculeId) {
      const vehiculesUpdate = vehicules.map((v) =>
        v.id === formData.vehiculeId ? { ...v, statut: 'loue' as const } : v
      );
      setVehicules(vehiculesUpdate);
    }

    toast.success('Allocation créée avec succès ! 🎉');
    setShowModal(false);
  };

  const handleRetourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocationSelectionnee) return;

    const kmRetour = parseInt((e.target as any).kmRetour.value);
    const fraisSupplementaires = parseFloat((e.target as any).fraisSupplementaires.value) || 0;
    const motifFrais = (e.target as any).motifFrais.value || '';

    const allocationsUpdate = allocations.map((a) =>
      a.id === allocationSelectionnee.id
        ? {
            ...a,
            kmRetour,
            fraisSupplementaires,
            motifFrais,
            statut: 'termine' as StatutLocation,
          }
        : a
    );
    setAllocations(allocationsUpdate);

    // Remettre le véhicule disponible
    const vehicule = vehicules.find((v) => v.id === allocationSelectionnee.vehiculeId);
    if (vehicule) {
      const vehiculesUpdate = vehicules.map((v) =>
        v.id === vehicule.id ? { ...v, statut: 'disponible' as const } : v
      );
      setVehicules(vehiculesUpdate);
    }

    toast.success('Retour de véhicule enregistré');
    setShowRetourModal(false);
  };

  const vehicule = vehicules.find((v) => v.id === formData.vehiculeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display mb-2">Allocations & Locations</h1>
          <p className="text-slate-600">Gérez les locations de véhicules</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAjouter}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle allocation</span>
        </motion.button>
      </div>

      {/* Liste des allocations */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {allocationsPaginees.map((allocation) => {
            const clientAlloc = clients.find((c) => c.id === allocation.clientId);
            const vehiculeAlloc = vehicules.find((v) => v.id === allocation.vehiculeId);

            return (
              <motion.div
                key={allocation.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-slate-900">
                        Allocation #{allocation.id.slice(-6)}
                      </h3>
                      {getStatutBadge(allocation.statut)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-4 h-4" />
                        <span>
                          {clientAlloc
                            ? `${clientAlloc.prenom} ${clientAlloc.nom}`
                            : 'Client non trouvé'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Car className="w-4 h-4" />
                        <span>
                          {vehiculeAlloc
                            ? `${vehiculeAlloc.marque} ${vehiculeAlloc.modele}`
                            : 'Véhicule non trouvé'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(allocation.dateDebut), 'dd MMM yyyy')} -{' '}
                          {format(new Date(allocation.dateFin), 'dd MMM yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Gauge className="w-4 h-4" />
                        <span>Départ: {allocation.kmDepart} km</span>
                        {allocation.kmRetour && (
                          <span>| Retour: {allocation.kmRetour} km</span>
                        )}
                      </div>
                      <div className="text-blue-600 font-semibold">
                        Total: {allocation.tarifTotal.toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                  </div>
                  {allocation.statut === 'en_cours' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRetour(allocation)}
                      className="btn-primary"
                    >
                      Enregistrer le retour
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {allocationsFiltrees.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Aucune allocation trouvée</p>
        </div>
      )}

      {/* Pagination */}
      {allocationsFiltrees.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={allocationsFiltrees.length}
        />
      )}

      {/* Modal nouvelle allocation */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Nouvelle allocation</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Client</label>
                    <select
                      value={formData.clientId}
                      onChange={(e) => {
                        setFormData({ ...formData, clientId: e.target.value });
                      }}
                      className="input-field"
                      required
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.prenom} {c.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Véhicule</label>
                    <select
                      value={formData.vehiculeId}
                      onChange={(e) => {
                        setFormData({ ...formData, vehiculeId: e.target.value });
                        calculerTarif();
                      }}
                      className="input-field"
                      required
                    >
                      <option value="">Sélectionner un véhicule</option>
                      {vehiculesDisponibles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.marque} {v.modele} - {v.immatriculation}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date de début
                    </label>
                    <input
                      type="datetime-local"
                      value={
                        formData.dateDebut
                          ? new Date(formData.dateDebut).toISOString().slice(0, 16)
                          : ''
                      }
                      onChange={(e) => {
                        setFormData({ ...formData, dateDebut: new Date(e.target.value) });
                        calculerTarif();
                      }}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date de fin</label>
                    <input
                      type="datetime-local"
                      value={
                        formData.dateFin
                          ? new Date(formData.dateFin).toISOString().slice(0, 16)
                          : ''
                      }
                      onChange={(e) => {
                        setFormData({ ...formData, dateFin: new Date(e.target.value) });
                        calculerTarif();
                      }}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kilométrage départ
                  </label>
                  <input
                    type="number"
                    value={formData.kmDepart}
                    onChange={(e) => setFormData({ ...formData, kmDepart: parseInt(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Options supplémentaires
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['GPS', 'Siège bébé', 'Coffre de toit', 'Chauffeur'].map((option) => (
                      <label key={option} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.optionsSupplementaires?.includes(option)}
                          onChange={(e) => {
                            const options = formData.optionsSupplementaires || [];
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                optionsSupplementaires: [...options, option],
                              });
                              calculerTarif();
                            } else {
                              setFormData({
                                ...formData,
                                optionsSupplementaires: options.filter((o) => o !== option),
                              });
                              calculerTarif();
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-slate-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {vehicule && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Tarif calculé:</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formData.tarifTotal?.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Signature client
                  </label>
                  <div className="border-2 border-slate-200 rounded-lg p-4">
                    <SignatureCanvas
                      ref={(ref) => setSignatureRef(ref)}
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: 'w-full border rounded',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => signatureRef?.clear()}
                      className="mt-2 text-sm text-slate-600 hover:text-slate-900"
                    >
                      Effacer
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary flex-1"
                  >
                    Créer l'allocation
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal retour véhicule */}
      <AnimatePresence>
        {showRetourModal && allocationSelectionnee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRetourModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Retour de véhicule</h2>
              <form onSubmit={handleRetourSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kilométrage retour
                  </label>
                  <input
                    type="number"
                    name="kmRetour"
                    defaultValue={allocationSelectionnee.kmRetour || allocationSelectionnee.kmDepart}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                    Frais supplémentaires (FCFA)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="fraisSupplementaires"
                    defaultValue={allocationSelectionnee.fraisSupplementaires || 0}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Motif des frais supplémentaires
                  </label>
                  <textarea
                    name="motifFrais"
                    defaultValue={allocationSelectionnee.motifFrais || ''}
                    className="input-field"
                    rows={3}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowRetourModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary flex-1"
                  >
                    Enregistrer le retour
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
