import { useState } from 'react';
import { motion } from 'framer-motion';
import { Fuel, MapPin, Edit, Trash2, Car } from 'lucide-react';

const statutStyles = {
  disponible: 'bg-success/10 text-success',
  loue: 'bg-primary/10 text-primary',
  maintenance: 'bg-warning/10 text-foreground',
  hors_service: 'bg-destructive/10 text-destructive',
};

const statutLabels = {
  disponible: 'Disponible',
  loue: 'En location',
  maintenance: 'Maintenance',
  hors_service: 'Hors service',
};

export function TableauVehicules({ vehicules, onModifier, onSupprimer }) {
  const ImageVehicule = ({ vehicule }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        {vehicule.photo && !imageError ? (
          <img
            src={vehicule.photo}
            alt={`${vehicule.marque} ${vehicule.modele}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Car className="w-6 h-6 sm:w-8 sm:h-8 text-white/50" />
        )}
      </div>
    );
  };

  return (
    <div className="card bg-card border-border">
      <div className="px-6 pt-6 pb-3">
        <h3 className="text-base font-semibold text-foreground">Liste des véhicules</h3>
      </div>
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  Image
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  Véhicule
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden sm:table-cell">
                  Carburant
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden md:table-cell">
                  Kilométrage
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden lg:table-cell">
                  Prix location
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  Statut
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicules.map((vehicule, index) => (
                <motion.tr
                  key={vehicule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3 px-2">
                    <ImageVehicule vehicule={vehicule} />
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {vehicule.marque} {vehicule.modele}
                      </p>
                      <p className="text-xs text-muted-foreground">{vehicule.immatriculation}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-foreground capitalize">{vehicule.carburant}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {vehicule.kilometrage.toLocaleString('fr-FR')} km
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 hidden lg:table-cell">
                    <span className="text-sm text-foreground font-medium">
                      {vehicule.prixLocation.toLocaleString('fr-FR')} FCFA/jour
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        statutStyles[vehicule.statut]
                      }`}
                    >
                      {statutLabels[vehicule.statut]}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onModifier(vehicule)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onSupprimer(vehicule.id)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {vehicules.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">Aucun véhicule trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
