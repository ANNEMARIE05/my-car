import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Car,
  Search,
  Plus,
  Edit,
  Trash2,
  Grid3x3,
  List,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Calendar,
  Gauge,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Pagination } from '../components/Pagination';
import { TableauVehicules } from '../components/TableauVehicules';

export const Vehicules = () => {
  const { vehicules, setVehicules } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreCarburant, setFiltreCarburant] = useState('tous');
  const [vue, setVue] = useState('liste');
  const [showModal, setShowModal] = useState(false);
  const [vehiculeSelectionne, setVehiculeSelectionne] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    immatriculation: '',
    kilometrage: 0,
    statut: 'disponible',
    carburant: 'essence',
    prixLocation: 0,
    assuranceValide: true,
    photo: '',
  });

  const vehiculesFiltres = useMemo(() => {
    return vehicules.filter((v) => {
      const correspondRecherche =
        v.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.immatriculation.toLowerCase().includes(searchTerm.toLowerCase());
      const correspondStatut = filtreStatut === 'tous' || v.statut === filtreStatut;
      const correspondCarburant = filtreCarburant === 'tous' || v.carburant === filtreCarburant;
      return correspondRecherche && correspondStatut && correspondCarburant;
    });
  }, [vehicules, searchTerm, filtreStatut, filtreCarburant]);

  const totalPages = Math.ceil(vehiculesFiltres.length / itemsPerPage);
  const validCurrentPage = useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) return 1;
    return currentPage;
  }, [currentPage, totalPages]);

  const vehiculesPaginees = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return vehiculesFiltres.slice(startIndex, startIndex + itemsPerPage);
  }, [vehiculesFiltres, validCurrentPage, itemsPerPage]);

  const getStatutBadge = (statut) => {
    const configs = {
      disponible: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Disponible' },
      loue: { icon: Clock, color: 'bg-blue-100 text-blue-700', label: 'Loué' },
      maintenance: { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700', label: 'Maintenance' },
      hors_service: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Hors service' },
    };
    const config = configs[statut];
    const Icon = config?.icon || Clock;
    return (
      <span className={`badge ${config?.color || ''} flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" />
        {config?.label || statut}
      </span>
    );
  };

  const handleAjouter = () => {
    setVehiculeSelectionne(null);
    setFormData({
      marque: '',
      modele: '',
      annee: new Date().getFullYear(),
      immatriculation: '',
      kilometrage: 0,
      statut: 'disponible',
      carburant: 'essence',
      prixLocation: 0,
      assuranceValide: true,
      photo: '',
    });
    setShowModal(true);
  };

  const handleModifier = (vehicule) => {
    setVehiculeSelectionne(vehicule);
    setFormData(vehicule);
    setShowModal(true);
  };

  const handleSupprimer = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      setVehicules(vehicules.filter((v) => v.id !== id));
      toast.success('Véhicule supprimé avec succès');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (vehiculeSelectionne) {
      setVehicules(
        vehicules.map((v) => (v.id === vehiculeSelectionne.id ? { ...v, ...formData } : v))
      );
      toast.success('Véhicule modifié avec succès');
    } else {
      const nouveauVehicule = {
        id: Date.now().toString(),
        ...formData,
        photo: formData.photo || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=800&h=600&fit=crop`,
      };
      setVehicules([...vehicules, nouveauVehicule]);
      toast.success('Véhicule ajouté avec succès');
    }
    setShowModal(false);
  };

  const CarteVehicule = ({ vehicule }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="card bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer"
    >
      <div className="relative h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
        {vehicule.photo ? (
          <img
            src={vehicule.photo}
            alt={`${vehicule.marque} ${vehicule.modele}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400"><p>Image non valide</p></div>';
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white/50" />
          </div>
        )}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">{getStatutBadge(vehicule.statut)}</div>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">{vehicule.marque} {vehicule.modele}</h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3">{vehicule.annee}</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{vehicule.immatriculation}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{vehicule.kilometrage.toLocaleString('fr-FR')} km</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <span className="text-base sm:text-lg font-bold text-blue-600">{vehicule.prixLocation} FCFA/jour</span>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleModifier(vehicule)} className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleSupprimer(vehicule.id)} className="p-1.5 sm:p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-display mb-1 sm:mb-2">Véhicules</h1>
          <p className="text-sm sm:text-base text-slate-600">Gérez votre flotte automobile</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAjouter} className="btn-primary flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="whitespace-nowrap">Ajouter un véhicule</span>
        </motion.button>
      </div>

      <div className="card bg-white rounded-xl shadow-md p-3 sm:p-4">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher par marque, modèle, immatriculation..." className="input-field pl-10" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} className="input-field w-full sm:w-40 text-sm sm:text-base">
              <option value="tous">Tous les statuts</option>
              <option value="disponible">Disponible</option>
              <option value="loue">Loué</option>
              <option value="maintenance">Maintenance</option>
              <option value="hors_service">Hors service</option>
            </select>
            <select value={filtreCarburant} onChange={(e) => setFiltreCarburant(e.target.value)} className="input-field w-full sm:w-40 text-sm sm:text-base">
              <option value="tous">Tous les carburants</option>
              <option value="essence">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="electrique">Électrique</option>
              <option value="hybride">Hybride</option>
            </select>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setVue('grille')} className={`p-2 rounded-lg ${vue === 'grille' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`} title="Vue grille"><Grid3x3 className="w-5 h-5" /></motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setVue('liste')} className={`p-2 rounded-lg ${vue === 'liste' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`} title="Vue liste"><List className="w-5 h-5" /></motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {vue === 'grille' ? (
          <motion.div key="grille" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-6">
            {vehiculesPaginees.map((vehicule) => (
              <CarteVehicule key={vehicule.id} vehicule={vehicule} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="liste" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TableauVehicules vehicules={vehiculesPaginees} onModifier={handleModifier} onSupprimer={handleSupprimer} />
          </motion.div>
        )}
      </AnimatePresence>

      {vehiculesFiltres.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Car className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-slate-600 text-base sm:text-lg">Aucun véhicule trouvé</p>
        </div>
      )}

      {vehiculesFiltres.length > 0 && totalPages > 1 && (
        <Pagination currentPage={validCurrentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} totalItems={vehiculesFiltres.length} />
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">{vehiculeSelectionne ? 'Modifier le véhicule' : 'Ajouter un véhicule'}</h2>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Marque</label><input type="text" value={formData.marque} onChange={(e) => setFormData({ ...formData, marque: e.target.value })} className="input-field" required /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Modèle</label><input type="text" value={formData.modele} onChange={(e) => setFormData({ ...formData, modele: e.target.value })} className="input-field" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Année</label><input type="number" value={formData.annee} onChange={(e) => setFormData({ ...formData, annee: parseInt(e.target.value) })} className="input-field" required /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Immatriculation</label><input type="text" value={formData.immatriculation} onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })} className="input-field" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Kilométrage</label><input type="number" value={formData.kilometrage} onChange={(e) => setFormData({ ...formData, kilometrage: parseInt(e.target.value) })} className="input-field" required /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Prix location (FCFA/jour)</label><input type="number" value={formData.prixLocation} onChange={(e) => setFormData({ ...formData, prixLocation: parseInt(e.target.value) })} className="input-field" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Statut</label><select value={formData.statut} onChange={(e) => setFormData({ ...formData, statut: e.target.value })} className="input-field"><option value="disponible">Disponible</option><option value="loue">Loué</option><option value="maintenance">Maintenance</option><option value="hors_service">Hors service</option></select></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Carburant</label><select value={formData.carburant} onChange={(e) => setFormData({ ...formData, carburant: e.target.value })} className="input-field"><option value="essence">Essence</option><option value="diesel">Diesel</option><option value="electrique">Électrique</option><option value="hybride">Hybride</option></select></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">URL de l'image</label><input type="url" value={formData.photo || ''} onChange={(e) => setFormData({ ...formData, photo: e.target.value })} placeholder="https://exemple.com/image.jpg" className="input-field" />{formData.photo && (<div className="mt-3"><p className="text-xs text-slate-500 mb-2">Aperçu :</p><div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200"><img src={formData.photo} alt="Aperçu" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; const parent = e.target.parentElement; if (parent) parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400"><p>Image non valide</p></div>'; }} /></div></div>)}</div>
                <div className="flex items-center gap-4 pt-4"><label className="flex items-center gap-2"><input type="checkbox" checked={formData.assuranceValide} onChange={(e) => setFormData({ ...formData, assuranceValide: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm text-slate-700">Assurance valide</span></label></div>
                <div className="flex gap-4 pt-4"><motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(false)} className="btn-secondary flex-1">Annuler</motion.button><motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex-1">{vehiculeSelectionne ? 'Modifier' : 'Ajouter'}</motion.button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
