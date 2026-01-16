import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  CreditCard,
  History,
  Grid3x3,
  List,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Client } from '../types';
import toast from 'react-hot-toast';
import { Pagination } from '../components/Pagination';

export const Clients = () => {
  const { clients, setClients, allocations } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [vue, setVue] = useState<'grille' | 'liste'>('grille');
  const [showModal, setShowModal] = useState(false);
  const [clientSelectionne, setClientSelectionne] = useState<Client | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [formData, setFormData] = useState<Partial<Client>>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    numeroPermis: '',
    dateExpirationPermis: new Date(),
    dateInscription: new Date(),
  });

  const clientsFiltres = useMemo(() => {
    return clients.filter((c) => {
      const recherche = searchTerm.toLowerCase();
      return (
        c.nom.toLowerCase().includes(recherche) ||
        c.prenom.toLowerCase().includes(recherche) ||
        c.email.toLowerCase().includes(recherche) ||
        c.telephone.includes(recherche)
      );
    });
  }, [clients, searchTerm]);

  const clientsPagines = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return clientsFiltres.slice(startIndex, endIndex);
  }, [clientsFiltres, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(clientsFiltres.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage, searchTerm]);

  const handleAjouter = () => {
    setClientSelectionne(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      numeroPermis: '',
      dateExpirationPermis: new Date(),
      dateInscription: new Date(),
    });
    setShowModal(true);
  };

  const handleModifier = (client: Client) => {
    setClientSelectionne(client);
    setFormData(client);
    setShowModal(true);
  };

  const handleSupprimer = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      setClients(clients.filter((c) => c.id !== id));
      toast.success('Client supprimé avec succès');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientSelectionne) {
      setClients(
        clients.map((c) => (c.id === clientSelectionne.id ? { ...c, ...formData } as Client : c))
      );
      toast.success('Client modifié avec succès');
    } else {
      const nouveauClient: Client = {
        id: Date.now().toString(),
        ...formData,
      } as Client;
      setClients([...clients, nouveauClient]);
      toast.success('Client ajouté avec succès');
    }
    setShowModal(false);
  };

  const getStatistiquesClient = (clientId: string) => {
    const clientAllocations = allocations.filter((a) => a.clientId === clientId);
    const nbLocations = clientAllocations.length;
    const totalDepense = clientAllocations.reduce((sum, a) => sum + a.tarifTotal, 0);

    return { nbLocations, totalDepense };
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-display mb-1 sm:mb-2">Clients</h1>
          <p className="text-sm sm:text-base text-slate-600">Gérez vos clients et conducteurs</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAjouter}
          className="btn-primary flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="whitespace-nowrap">Ajouter un client</span>
        </motion.button>
      </div>

      {/* Recherche */}
      <div className="card bg-white rounded-xl shadow-md p-3 sm:p-4">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, email, téléphone..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVue('grille')}
              className={`p-2 rounded-lg ${vue === 'grille' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
            >
              <Grid3x3 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVue('liste')}
              className={`p-2 rounded-lg ${vue === 'liste' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
            >
              <List className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Liste des clients */}
      <AnimatePresence mode="wait">
        {vue === 'grille' ? (
          <motion.div
            key="grille"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-6"
          >
            {clientsPagines.map((client) => {
              const stats = getStatistiquesClient(client.id);
              const isDetailsOpen = showDetails === client.id;

              return (
                <motion.div
                  key={client.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  className="card bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                        {client.prenom[0]}{client.nom[0]}
                      </div>
                      <div className="flex gap-1.5 sm:gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowDetails(isDetailsOpen ? null : client.id)}
                          className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          <History className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleModifier(client)}
                          className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSupprimer(client.id)}
                          className="p-1.5 sm:p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                      {client.prenom} {client.nom}
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>{client.telephone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">Permis: {client.numeroPermis}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Locations</p>
                        <p className="text-base sm:text-lg font-bold text-slate-900">{stats.nbLocations}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Total dépensé</p>
                        <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600 truncate">
                          {stats.totalDepense.toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                    </div>

                    {/* Détails expandables */}
                    <AnimatePresence>
                      {isDetailsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-slate-200"
                        >
                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-slate-500">Adresse</p>
                              <p className="text-slate-900">{client.adresse}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Date d'inscription</p>
                              <p className="text-slate-900">
                                {format(client.dateInscription, 'dd MMM yyyy')}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Permis expire le</p>
                              <p className="text-slate-900">
                                {format(client.dateExpirationPermis, 'dd MMM yyyy')}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="liste"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2 sm:space-y-3 lg:space-y-4"
          >
            {clientsPagines.map((client) => {
              const stats = getStatistiquesClient(client.id);
              return (
                <motion.div
                  key={client.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card bg-white rounded-xl shadow-md p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl flex-shrink-0">
                    {client.prenom[0]}{client.nom[0]}
                  </div>
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {client.prenom} {client.nom}
                      </h3>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs sm:text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>{client.telephone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">Permis: {client.numeroPermis}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Locations: </span>
                        <span className="font-semibold">{stats.nbLocations}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-slate-500 mb-1">Total dépensé</p>
                      <p className="text-base sm:text-lg lg:text-xl font-bold text-blue-600">
                        {stats.totalDepense.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleModifier(client)}
                        className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSupprimer(client.id)}
                        className="p-1.5 sm:p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {clientsFiltres.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-slate-600 text-base sm:text-lg">Aucun client trouvé</p>
        </div>
      )}

      {/* Pagination */}
      {clientsFiltres.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={clientsFiltres.length}
        />
      )}

      {/* Modal ajout/modification */}
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
              className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">
                {clientSelectionne ? 'Modifier le client' : 'Ajouter un client'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Numéro de permis
                    </label>
                    <input
                      type="text"
                      value={formData.numeroPermis}
                      onChange={(e) => setFormData({ ...formData, numeroPermis: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date d'expiration permis
                    </label>
                    <input
                      type="date"
                      value={
                        formData.dateExpirationPermis
                          ? new Date(formData.dateExpirationPermis).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateExpirationPermis: new Date(e.target.value),
                        })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date d'inscription
                  </label>
                  <input
                    type="date"
                    value={
                      formData.dateInscription
                        ? new Date(formData.dateInscription).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateInscription: new Date(e.target.value),
                      })
                    }
                    className="input-field"
                    required
                  />
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
                    {clientSelectionne ? 'Modifier' : 'Ajouter'}
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
