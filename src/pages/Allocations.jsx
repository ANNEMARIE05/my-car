import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ClipboardList, Plus, Calendar, Car, User, Gauge, CheckCircle2, Clock, XCircle, Search, Grid3x3, List } from 'lucide-react';
import { format } from 'date-fns';
import SignatureCanvas from 'react-signature-canvas';
import toast from 'react-hot-toast';
import { Pagination } from '../components/Pagination';
import { TableauAllocations } from '../components/TableauAllocations';

export const Allocations = () => {
  const { allocations, setAllocations, vehicules, setVehicules, clients } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showRetourModal, setShowRetourModal] = useState(false);
  const [allocationSelectionnee, setAllocationSelectionnee] = useState(null);
  const [signatureRef, setSignatureRef] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [vue, setVue] = useState('liste');
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
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
    return allocations.filter((a) => {
      const correspondRecherche = searchTerm === '' ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clients.find((c) => c.id === a.clientId)?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clients.find((c) => c.id === a.clientId)?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicules.find((v) => v.id === a.vehiculeId)?.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicules.find((v) => v.id === a.vehiculeId)?.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicules.find((v) => v.id === a.vehiculeId)?.immatriculation.toLowerCase().includes(searchTerm.toLowerCase());
      const correspondStatut = filtreStatut === 'tous' || a.statut === filtreStatut;
      return correspondRecherche && correspondStatut;
    });
  }, [allocations, searchTerm, filtreStatut, clients, vehicules]);

  const totalPages = Math.ceil(allocationsFiltrees.length / itemsPerPage);
  const validCurrentPage = useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) return 1;
    return currentPage;
  }, [currentPage, totalPages]);

  const allocationsPaginees = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return allocationsFiltrees.slice(startIndex, startIndex + itemsPerPage);
  }, [allocationsFiltrees, validCurrentPage, itemsPerPage]);

  const getStatutBadge = (statut) => {
    const configs = { en_attente: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'En attente' }, en_cours: { icon: Car, color: 'bg-blue-100 text-blue-700', label: 'En cours' }, termine: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Terminé' }, annule: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Annulé' } };
    const config = configs[statut];
    const Icon = config?.icon || Clock;
    return (<span className={`badge ${config?.color || ''} flex items-center gap-1 w-fit`}><Icon className="w-3 h-3" />{config?.label || statut}</span>);
  };

  const vehiculesDisponibles = vehicules.filter((v) => v.statut === 'disponible');

  const handleAjouter = () => {
    setAllocationSelectionnee(null);
    setFormData({ clientId: '', vehiculeId: '', dateDebut: new Date(), dateFin: new Date(), kmDepart: 0, tarifTotal: 0, optionsSupplementaires: [], statut: 'en_cours' });
    setShowModal(true);
  };

  const handleRetour = (allocation) => {
    setAllocationSelectionnee(allocation);
    setShowRetourModal(true);
  };

  const handleSupprimer = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette allocation ?')) {
      setAllocations(allocations.filter((a) => a.id !== id));
      toast.success('Allocation supprimée avec succès');
    }
  };

  const calculerTarif = () => {
    const vehicule = vehicules.find((v) => v.id === formData.vehiculeId);
    if (!vehicule || !formData.dateDebut || !formData.dateFin) return;
    const debut = new Date(formData.dateDebut);
    const fin = new Date(formData.dateFin);
    const jours = Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const tarifBase = vehicule.prixLocation * jours;
    const options = formData.optionsSupplementaires?.length || 0;
    setFormData({ ...formData, tarifTotal: tarifBase + options * 10 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const signature = signatureRef?.toDataURL() || '';
    const nouvelleAllocation = {
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
    if (formData.vehiculeId) {
      setVehicules(vehicules.map((v) => (v.id === formData.vehiculeId ? { ...v, statut: 'loue' } : v)));
    }
    toast.success('Allocation créée avec succès ! 🎉');
    setShowModal(false);
  };

  const handleRetourSubmit = (e) => {
    e.preventDefault();
    if (!allocationSelectionnee) return;
    const form = e.currentTarget;
    const kmRetour = parseInt(form.elements.namedItem('kmRetour')?.value || '0', 10);
    const fraisSupplementaires = parseFloat(form.elements.namedItem('fraisSupplementaires')?.value || '0') || 0;
    const motifFrais = form.elements.namedItem('motifFrais')?.value || '';
    setAllocations(allocations.map((a) => (a.id === allocationSelectionnee.id ? { ...a, kmRetour, fraisSupplementaires, motifFrais, statut: 'termine' } : a)));
    const vehicule = vehicules.find((v) => v.id === allocationSelectionnee.vehiculeId);
    if (vehicule) setVehicules(vehicules.map((v) => (v.id === vehicule.id ? { ...v, statut: 'disponible' } : v)));
    toast.success('Retour de véhicule enregistré');
    setShowRetourModal(false);
  };

  const vehicule = vehicules.find((v) => v.id === formData.vehiculeId);

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div><h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-display mb-1 sm:mb-2">Allocations & Locations</h1><p className="text-sm sm:text-base text-slate-600">Gérez les locations de véhicules</p></div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAjouter} className="btn-primary flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"><Plus className="w-4 h-4 sm:w-5 sm:h-5" /><span className="whitespace-nowrap">Nouvelle allocation</span></motion.button>
      </div>

      <div className="card bg-white rounded-xl shadow-md p-3 sm:p-4">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher par ID, client, véhicule..." className="input-field pl-10" /></div>
          <div className="flex flex-col sm:flex-row gap-2"><select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} className="input-field w-full sm:w-40 text-sm sm:text-base"><option value="tous">Tous les statuts</option><option value="en_attente">En attente</option><option value="en_cours">En cours</option><option value="termine">Terminé</option><option value="annule">Annulé</option></select></div>
          <div className="flex gap-2"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setVue('grille')} className={`p-2 rounded-lg ${vue === 'grille' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`} title="Vue grille"><Grid3x3 className="w-5 h-5" /></motion.button><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setVue('liste')} className={`p-2 rounded-lg ${vue === 'liste' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`} title="Vue liste"><List className="w-5 h-5" /></motion.button></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {vue === 'grille' ? (
          <motion.div key="grille" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-2 sm:gap-3 lg:gap-4">
            {allocationsPaginees.map((allocation) => {
              const clientAlloc = clients.find((c) => c.id === allocation.clientId);
              const vehiculeAlloc = vehicules.find((v) => v.id === allocation.vehiculeId);
              return (
                <motion.div key={allocation.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card bg-white rounded-xl shadow-md p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3"><h3 className="text-base sm:text-lg font-bold text-slate-900">Allocation #{allocation.id.slice(-6)}</h3>{getStatutBadge(allocation.statut)}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-slate-600"><User className="w-4 h-4" /><span>{clientAlloc ? `${clientAlloc.prenom} ${clientAlloc.nom}` : 'Client non trouvé'}</span></div>
                        <div className="flex items-center gap-2 text-slate-600"><Car className="w-4 h-4" /><span>{vehiculeAlloc ? `${vehiculeAlloc.marque} ${vehiculeAlloc.modele}` : 'Véhicule non trouvé'}</span></div>
                        <div className="flex items-center gap-2 text-slate-600"><Calendar className="w-4 h-4" /><span>{format(new Date(allocation.dateDebut), 'dd MMM yyyy')} - {format(new Date(allocation.dateFin), 'dd MMM yyyy')}</span></div>
                        <div className="flex items-center gap-2 text-slate-600"><Gauge className="w-4 h-4" /><span>Départ: {allocation.kmDepart} km{allocation.kmRetour && ` | Retour: ${allocation.kmRetour} km`}</span></div>
                        <div className="text-blue-600 font-semibold">Total: {allocation.tarifTotal.toLocaleString('fr-FR')} FCFA</div>
                      </div>
                    </div>
                    {allocation.statut === 'en_cours' && <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleRetour(allocation)} className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto">Enregistrer le retour</motion.button>}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div key="liste" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><TableauAllocations allocations={allocationsPaginees} clients={clients} vehicules={vehicules} onRetour={handleRetour} onSupprimer={handleSupprimer} /></motion.div>
        )}
      </AnimatePresence>

      {allocationsFiltrees.length === 0 && (<div className="text-center py-8 sm:py-12"><ClipboardList className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" /><p className="text-slate-600 text-base sm:text-lg">Aucune allocation trouvée</p></div>)}

      {allocationsFiltrees.length > 0 && totalPages > 1 && <Pagination currentPage={validCurrentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} totalItems={allocationsFiltrees.length} />}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Nouvelle allocation</h2>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Client</label><select value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })} className="input-field" required><option value="">Sélectionner un client</option>{clients.map((c) => (<option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>))}</select></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Véhicule</label><select value={formData.vehiculeId} onChange={(e) => { setFormData({ ...formData, vehiculeId: e.target.value }); calculerTarif(); }} className="input-field" required><option value="">Sélectionner un véhicule</option>{vehiculesDisponibles.map((v) => (<option key={v.id} value={v.id}>{v.marque} {v.modele} - {v.immatriculation}</option>))}</select></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Date de début</label><input type="datetime-local" value={formData.dateDebut ? new Date(formData.dateDebut).toISOString().slice(0, 16) : ''} onChange={(e) => { setFormData({ ...formData, dateDebut: new Date(e.target.value) }); calculerTarif(); }} className="input-field" required /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Date de fin</label><input type="datetime-local" value={formData.dateFin ? new Date(formData.dateFin).toISOString().slice(0, 16) : ''} onChange={(e) => { setFormData({ ...formData, dateFin: new Date(e.target.value) }); calculerTarif(); }} className="input-field" required /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Kilométrage départ</label><input type="number" value={formData.kmDepart} onChange={(e) => setFormData({ ...formData, kmDepart: parseInt(e.target.value) })} className="input-field" required /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Options supplémentaires</label><div className="flex flex-wrap gap-2">{['GPS', 'Siège bébé', 'Coffre de toit', 'Chauffeur'].map((option) => (<label key={option} className="flex items-center gap-2"><input type="checkbox" checked={formData.optionsSupplementaires?.includes(option)} onChange={(e) => { const options = formData.optionsSupplementaires || []; if (e.target.checked) { setFormData({ ...formData, optionsSupplementaires: [...options, option] }); calculerTarif(); } else { setFormData({ ...formData, optionsSupplementaires: options.filter((o) => o !== option) }); calculerTarif(); } }} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm text-slate-700">{option}</span></label>))}</div></div>
                {vehicule && <div className="bg-blue-50 p-4 rounded-lg"><p className="text-sm text-slate-600 mb-1">Tarif calculé:</p><p className="text-2xl font-bold text-blue-600">{formData.tarifTotal?.toLocaleString('fr-FR')} FCFA</p></div>}
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Signature client</label><div className="border-2 border-slate-200 rounded-lg p-4"><SignatureCanvas ref={(ref) => setSignatureRef(ref)} canvasProps={{ width: 500, height: 200, className: 'w-full border rounded' }} /><button type="button" onClick={() => signatureRef?.clear()} className="mt-2 text-sm text-slate-600 hover:text-slate-900">Effacer</button></div></div>
                <div className="flex gap-4 pt-4"><motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(false)} className="btn-secondary flex-1">Annuler</motion.button><motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex-1">Créer l'allocation</motion.button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRetourModal && allocationSelectionnee && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRetourModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Retour de véhicule</h2>
              <form onSubmit={handleRetourSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Kilométrage retour</label><input type="number" name="kmRetour" defaultValue={allocationSelectionnee.kmRetour || allocationSelectionnee.kmDepart} className="input-field" required /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Frais supplémentaires (FCFA)</label><input type="number" step="0.01" name="fraisSupplementaires" defaultValue={allocationSelectionnee.fraisSupplementaires || 0} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Motif des frais supplémentaires</label><textarea name="motifFrais" defaultValue={allocationSelectionnee.motifFrais || ''} className="input-field" rows={3} /></div>
                <div className="flex gap-4 pt-4"><motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowRetourModal(false)} className="btn-secondary flex-1">Annuler</motion.button><motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex-1">Enregistrer le retour</motion.button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
