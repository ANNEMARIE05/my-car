import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  QrCode,
  Printer,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Piece } from '../types';
import toast from 'react-hot-toast';
import { Pagination } from '../components/Pagination';

export const Pieces = () => {
  const { pieces, setPieces } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [pieceSelectionnee, setPieceSelectionnee] = useState<Piece | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [formData, setFormData] = useState<Partial<Piece>>({
    nom: '',
    reference: '',
    numeroSerie: '',
    categorie: '',
    qtyStock: 0,
    seuilAlerte: 5,
    prixUnit: 0,
    fournisseur: '',
    dateEntree: new Date(),
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const piecesFiltrees = useMemo(() => {
    return pieces.filter((p) => {
      const correspondRecherche =
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase());

      return correspondRecherche;
    });
  }, [pieces, searchTerm]);

  const piecesPaginees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return piecesFiltrees.slice(startIndex, endIndex);
  }, [piecesFiltrees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(piecesFiltrees.length / itemsPerPage);

  // Réinitialiser la page si elle est hors limites ou si la recherche change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage, searchTerm]);

  const piecesAlerte = pieces.filter((p) => p.qtyStock <= p.seuilAlerte);

  const handleAjouter = () => {
    setPieceSelectionnee(null);
    setFormData({
      nom: '',
      reference: '',
      numeroSerie: Date.now().toString(),
      categorie: '',
      qtyStock: 0,
      seuilAlerte: 5,
      prixUnit: 0,
      fournisseur: '',
      dateEntree: new Date(),
    });
    setImagePreview(null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleModifier = (piece: Piece) => {
    setPieceSelectionnee(piece);
    setFormData(piece);
    setImagePreview(piece.photo || null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleSupprimer = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette pièce ?')) {
      setPieces(pieces.filter((p) => p.id !== id));
      toast.success('Pièce supprimée avec succès');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let photoUrl = formData.photo;
    
    // Si une nouvelle image a été sélectionnée, utiliser son preview
    if (imagePreview && imageFile) {
      photoUrl = imagePreview;
    } else if (imagePreview && !imageFile) {
      // Si on modifie sans changer l'image, garder l'image existante
      photoUrl = imagePreview;
    } else if (!photoUrl && !imagePreview) {
      // Si aucune image, générer une image aléatoire par défaut
      photoUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=400`;
    }

    if (pieceSelectionnee) {
      setPieces(
        pieces.map((p) => (p.id === pieceSelectionnee.id ? { ...p, ...formData, photo: photoUrl } as Piece : p))
      );
      toast.success('Pièce modifiée avec succès');
    } else {
      const nouvellePiece: Piece = {
        id: Date.now().toString(),
        ...formData,
        photo: photoUrl,
      } as Piece;
      setPieces([...pieces, nouvellePiece]);
      toast.success('Pièce ajoutée avec succès');
    }
    setShowModal(false);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleAfficherQR = (piece: Piece) => {
    setPieceSelectionnee(piece);
    setShowQRModal(true);
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-display mb-1 sm:mb-2">Pièces & Stock</h1>
          <p className="text-sm sm:text-base text-slate-600">Gérez votre inventaire de pièces détachées</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAjouter}
          className="btn-primary flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="whitespace-nowrap">Ajouter une pièce</span>
        </motion.button>
      </div>

      {/* Alertes stock bas */}
      {piecesAlerte.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3"
        >
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <div>
            <p className="font-semibold text-red-900">
              {piecesAlerte.length} pièce(s) en stock bas
            </p>
            <p className="text-sm text-red-700">
              Pensez à réapprovisionner ces articles
            </p>
          </div>
        </motion.div>
      )}

      {/* Recherche */}
      <div className="card bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, référence, numéro de série..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Liste des pièces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-6">
        <AnimatePresence>
          {piecesPaginees.map((piece) => (
            <motion.div
              key={piece.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4 }}
              className="card bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-slate-400 to-slate-600 overflow-hidden">
                {piece.photo ? (
                  <img
                    src={piece.photo}
                    alt={piece.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white/50" />
                  </div>
                )}
                {piece.qtyStock <= piece.seuilAlerte && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span className="hidden sm:inline">Stock bas</span>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">{piece.nom}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3">{piece.categorie}</p>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Référence:</span>
                    <span className="font-medium">{piece.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Stock:</span>
                    <span className={`font-bold ${piece.qtyStock <= piece.seuilAlerte ? 'text-red-600' : 'text-green-600'}`}>
                      {piece.qtyStock} unités
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Prix unitaire:</span>
                    <span className="font-medium">{piece.prixUnit} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Valeur totale:</span>
                    <span className="font-bold text-blue-600">
                      {(piece.qtyStock * piece.prixUnit).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAfficherQR(piece)}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm py-2"
                  >
                    <QrCode className="w-4 h-4" />
                    QR Code
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleModifier(piece)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSupprimer(piece.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {piecesFiltrees.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Aucune pièce trouvée</p>
        </div>
      )}

      {/* Pagination */}
      {piecesFiltrees.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={piecesFiltrees.length}
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
                {pieceSelectionnee ? 'Modifier la pièce' : 'Ajouter une pièce'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                    <select
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      <option value="moteur">Moteur</option>
                      <option value="freinage">Freinage</option>
                      <option value="electrique">Électrique</option>
                      <option value="carrosserie">Carrosserie</option>
                      <option value="suspension">Suspension</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Référence</label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Numéro de série</label>
                    <input
                      type="text"
                      value={formData.numeroSerie}
                      onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantité stock</label>
                    <input
                      type="number"
                      value={formData.qtyStock}
                      onChange={(e) => setFormData({ ...formData, qtyStock: parseInt(e.target.value) })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Seuil alerte</label>
                    <input
                      type="number"
                      value={formData.seuilAlerte}
                      onChange={(e) => setFormData({ ...formData, seuilAlerte: parseInt(e.target.value) })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Prix unitaire (FCFA)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.prixUnit}
                      onChange={(e) => setFormData({ ...formData, prixUnit: parseFloat(e.target.value) })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fournisseur</label>
                  <input
                    type="text"
                    value={formData.fournisseur}
                    onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date d'entrée</label>
                  <input
                    type="date"
                    value={formData.dateEntree ? new Date(formData.dateEntree).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, dateEntree: new Date(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Image de la pièce</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input-field"
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="w-full h-48 object-cover rounded-lg border-2 border-slate-200"
                      />
                    </div>
                  )}
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
                    {pieceSelectionnee ? 'Modifier' : 'Ajouter'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal QR Code */}
      <AnimatePresence>
        {showQRModal && pieceSelectionnee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full text-center"
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">QR Code</h2>
              <p className="text-slate-600 mb-6">{pieceSelectionnee.nom}</p>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-lg border-2 border-slate-200">
                  <QRCodeSVG
                    value={JSON.stringify({
                      id: pieceSelectionnee.id,
                      nom: pieceSelectionnee.nom,
                      reference: pieceSelectionnee.reference,
                      numeroSerie: pieceSelectionnee.numeroSerie,
                    })}
                    size={200}
                    level="H"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    window.print();
                  }}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowQRModal(false)}
                  className="btn-primary flex-1"
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
