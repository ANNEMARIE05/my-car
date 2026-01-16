import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Approvisionnement, LigneApprovisionnement, Piece } from '../types';
import toast from 'react-hot-toast';

export const Approvisionnements = () => {
  const { approvisionnements, setApprovisionnements, pieces, setPieces } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [approvisionnementSelectionne, setApprovisionnementSelectionne] = useState<Approvisionnement | null>(null);
  const [formData, setFormData] = useState<Partial<Approvisionnement>>({
    fournisseur: '',
    dateCommande: new Date(),
    dateLivraisonPrevue: undefined,
    statut: 'en_attente',
    lignes: [],
    totalHT: 0,
    tva: 0,
    totalTTC: 0,
    notes: '',
  });
  const [lignes, setLignes] = useState<LigneApprovisionnement[]>([]);

  const approvisionnementsFiltres = useMemo(() => {
    return approvisionnements.filter((a) => {
      const recherche = searchTerm.toLowerCase();
      return (
        a.numero.toLowerCase().includes(recherche) ||
        a.fournisseur.toLowerCase().includes(recherche) ||
        a.statut.toLowerCase().includes(recherche)
      );
    });
  }, [approvisionnements, searchTerm]);

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'livre':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'en_cours':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'en_attente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'annule':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'livre':
        return 'bg-green-100 text-green-800';
      case 'en_cours':
        return 'bg-blue-100 text-blue-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'annule':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const handleAjouter = () => {
    setApprovisionnementSelectionne(null);
    setFormData({
      fournisseur: '',
      dateCommande: new Date(),
      dateLivraisonPrevue: undefined,
      statut: 'en_attente',
      lignes: [],
      totalHT: 0,
      tva: 0,
      totalTTC: 0,
      notes: '',
    });
    setLignes([]);
    setShowModal(true);
  };

  const handleModifier = (approvisionnement: Approvisionnement) => {
    setApprovisionnementSelectionne(approvisionnement);
    setFormData(approvisionnement);
    setLignes(approvisionnement.lignes);
    setShowModal(true);
  };

  const handleSupprimer = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet approvisionnement ?')) {
      setApprovisionnements(approvisionnements.filter((a) => a.id !== id));
      toast.success('Approvisionnement supprimé avec succès');
    }
  };

  const handleAjouterLigne = () => {
    const nouvelleLigne: LigneApprovisionnement = {
      pieceId: '',
      quantite: 1,
      prixUnitaire: 0,
      total: 0,
    };
    setLignes([...lignes, nouvelleLigne]);
  };

  const handleModifierLigne = (index: number, ligne: Partial<LigneApprovisionnement>) => {
    const lignesModifiees = [...lignes];
    const piece = pieces.find((p) => p.id === ligne.pieceId);
    const prixUnitaire = ligne.prixUnitaire ?? lignesModifiees[index].prixUnitaire;
    const quantite = ligne.quantite ?? lignesModifiees[index].quantite;
    
    lignesModifiees[index] = {
      ...lignesModifiees[index],
      ...ligne,
      prixUnitaire: ligne.prixUnitaire ?? (piece?.prixUnit ?? 0),
      total: quantite * prixUnitaire,
    };
    setLignes(lignesModifiees);
  };

  const handleSupprimerLigne = (index: number) => {
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const calculerTotaux = () => {
    const totalHT = lignes.reduce((sum, ligne) => sum + ligne.total, 0);
    const tva = totalHT * 0.2; // 20% TVA
    const totalTTC = totalHT + tva;
    return { totalHT, tva, totalTTC };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { totalHT, tva, totalTTC } = calculerTotaux();
    
    if (lignes.length === 0) {
      toast.error('Veuillez ajouter au moins une ligne de commande');
      return;
    }

    if (approvisionnementSelectionne) {
      setApprovisionnements(
        approvisionnements.map((a) =>
          a.id === approvisionnementSelectionne.id
            ? { ...a, ...formData, lignes, totalHT, tva, totalTTC } as Approvisionnement
            : a
        )
      );
      toast.success('Approvisionnement modifié avec succès');
    } else {
      const numero = `APP-${Date.now().toString().slice(-6)}`;
      const nouvelApprovisionnement: Approvisionnement = {
        id: Date.now().toString(),
        numero,
        ...formData,
        lignes,
        totalHT,
        tva,
        totalTTC,
      } as Approvisionnement;
      setApprovisionnements([...approvisionnements, nouvelApprovisionnement]);
      toast.success('Approvisionnement créé avec succès');
    }
    setShowModal(false);
  };

  const handleRecevoir = (id: string) => {
    const approvisionnement = approvisionnements.find((a) => a.id === id);
    if (!approvisionnement) return;

    // Mettre à jour le stock des pièces
    approvisionnement.lignes.forEach((ligne) => {
      const piece = pieces.find((p) => p.id === ligne.pieceId);
      if (piece) {
        setPieces(
          pieces.map((p) =>
            p.id === ligne.pieceId
              ? { ...p, qtyStock: p.qtyStock + ligne.quantite } as Piece
              : p
          )
        );
      }
    });

    // Mettre à jour le statut de l'approvisionnement
    setApprovisionnements(
      approvisionnements.map((a) =>
        a.id === id
          ? { ...a, statut: 'livre', dateLivraison: new Date() } as Approvisionnement
          : a
      )
    );
    toast.success('Approvisionnement reçu et stock mis à jour');
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-display mb-1 sm:mb-2">
            Approvisionnements
          </h1>
          <p className="text-slate-600">Gérez vos commandes de pièces détachées</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAjouter}
          className="btn-primary flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="whitespace-nowrap">Nouvelle commande</span>
        </motion.button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-white rounded-xl shadow-md p-3 sm:p-4 border-l-4 border-blue-500"
        >
          <p className="text-xs sm:text-sm text-slate-600 mb-1">Total commandes</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{approvisionnements.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-white rounded-xl shadow-md p-3 sm:p-4 border-l-4 border-yellow-500"
        >
          <p className="text-xs sm:text-sm text-slate-600 mb-1">En attente</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
            {approvisionnements.filter((a) => a.statut === 'en_attente').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-white rounded-xl shadow-md p-3 sm:p-4 border-l-4 border-blue-500"
        >
          <p className="text-xs sm:text-sm text-slate-600 mb-1">En cours</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
            {approvisionnements.filter((a) => a.statut === 'en_cours').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-white rounded-xl shadow-md p-3 sm:p-4 border-l-4 border-green-500"
        >
          <p className="text-xs sm:text-sm text-slate-600 mb-1">Livrés</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
            {approvisionnements.filter((a) => a.statut === 'livre').length}
          </p>
        </motion.div>
      </div>

      {/* Recherche */}
      <div className="card bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par numéro, fournisseur, statut..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Liste des approvisionnements */}
      <div className="space-y-4">
        <AnimatePresence>
          {approvisionnementsFiltres.map((approvisionnement) => {
            return (
              <motion.div
                key={approvisionnement.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -2 }}
                className="card bg-white rounded-xl shadow-md p-3 sm:p-4 lg:p-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {approvisionnement.numero}
                        </h3>
                        <p className="text-sm text-slate-600">{approvisionnement.fournisseur}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {format(approvisionnement.dateCommande, 'dd MMM yyyy')}
                        </span>
                      </div>
                      {approvisionnement.dateLivraisonPrevue && (
                        <div className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          <span>
                            Livraison prévue: {format(approvisionnement.dateLivraisonPrevue, 'dd MMM yyyy')}
                          </span>
                        </div>
                      )}
                      {approvisionnement.dateLivraison && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            Livré le: {format(approvisionnement.dateLivraison, 'dd MMM yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatutColor(
                        approvisionnement.statut
                      )}`}
                    >
                      {getStatutIcon(approvisionnement.statut)}
                      {approvisionnement.statut === 'livre'
                        ? 'Livré'
                        : approvisionnement.statut === 'en_cours'
                        ? 'En cours'
                        : approvisionnement.statut === 'en_attente'
                        ? 'En attente'
                        : 'Annulé'}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Total TTC</p>
                      <p className="text-lg font-bold text-blue-600">
                        {approvisionnement.totalTTC.toLocaleString('fr-FR')} €
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lignes de commande */}
                <div className="mb-4 border-t border-slate-200 pt-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">
                    {approvisionnement.lignes.length} article(s)
                  </p>
                  <div className="space-y-2">
                    {approvisionnement.lignes.map((ligne, index) => {
                      const piece = pieces.find((p) => p.id === ligne.pieceId);
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded"
                        >
                          <span className="text-slate-700">
                            {piece?.nom || 'Pièce inconnue'} x {ligne.quantite}
                          </span>
                          <span className="font-medium text-slate-900">
                            {ligne.total.toLocaleString('fr-FR')} €
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                  {approvisionnement.statut !== 'livre' && approvisionnement.statut !== 'annule' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRecevoir(approvisionnement.id)}
                      className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      Recevoir
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleModifier(approvisionnement)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSupprimer(approvisionnement.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {approvisionnementsFiltres.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Aucun approvisionnement trouvé</p>
        </div>
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
              className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">
                {approvisionnementSelectionne
                  ? 'Modifier l\'approvisionnement'
                  : 'Nouvelle commande'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fournisseur
                    </label>
                    <input
                      type="text"
                      value={formData.fournisseur}
                      onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date de commande
                    </label>
                    <input
                      type="date"
                      value={
                        formData.dateCommande
                          ? new Date(formData.dateCommande).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateCommande: new Date(e.target.value),
                        })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date de livraison prévue
                    </label>
                    <input
                      type="date"
                      value={
                        formData.dateLivraisonPrevue
                          ? new Date(formData.dateLivraisonPrevue).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateLivraisonPrevue: e.target.value
                            ? new Date(e.target.value)
                            : undefined,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                    <select
                      value={formData.statut}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          statut: e.target.value as any,
                        })
                      }
                      className="input-field"
                      required
                    >
                      <option value="en_attente">En attente</option>
                      <option value="en_cours">En cours</option>
                      <option value="livre">Livré</option>
                      <option value="annule">Annulé</option>
                    </select>
                  </div>
                </div>

                {/* Lignes de commande */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Articles commandés
                    </label>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAjouterLigne}
                      className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une ligne
                    </motion.button>
                  </div>
                  <div className="space-y-3">
                    {lignes.map((ligne, index) => {
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-2 p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="col-span-5">
                            <select
                              value={ligne.pieceId}
                              onChange={(e) => {
                                const pieceSelectionnee = pieces.find((p) => p.id === e.target.value);
                                handleModifierLigne(index, {
                                  pieceId: e.target.value,
                                  prixUnitaire: pieceSelectionnee?.prixUnit ?? 0,
                                });
                              }}
                              className="input-field text-sm"
                              required
                            >
                              <option value="">Sélectionner une pièce</option>
                              {pieces.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.nom} ({p.reference})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              min="1"
                              value={ligne.quantite}
                              onChange={(e) =>
                                handleModifierLigne(index, {
                                  quantite: parseInt(e.target.value) || 1,
                                })
                              }
                              className="input-field text-sm"
                              required
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              step="0.01"
                              value={ligne.prixUnitaire}
                              onChange={(e) =>
                                handleModifierLigne(index, {
                                  prixUnitaire: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="input-field text-sm"
                              required
                            />
                          </div>
                          <div className="col-span-2 flex items-center justify-end">
                            <span className="font-medium text-slate-900">
                              {ligne.total.toLocaleString('fr-FR')} €
                            </span>
                          </div>
                          <div className="col-span-1 flex items-center justify-end">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleSupprimerLigne(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {lignes.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">
                      Aucune ligne ajoutée. Cliquez sur "Ajouter une ligne" pour commencer.
                    </p>
                  )}
                </div>

                {/* Totaux */}
                {lignes.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Total HT:</span>
                          <span className="font-medium">
                            {calculerTotaux().totalHT.toLocaleString('fr-FR')} €
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">TVA (20%):</span>
                          <span className="font-medium">
                            {calculerTotaux().tva.toLocaleString('fr-FR')} €
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2">
                          <span>Total TTC:</span>
                          <span className="text-blue-600">
                            {calculerTotaux().totalTTC.toLocaleString('fr-FR')} €
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
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
                    {approvisionnementSelectionne ? 'Modifier' : 'Créer'}
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
