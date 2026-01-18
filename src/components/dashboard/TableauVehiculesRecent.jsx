import { motion } from 'framer-motion';
import { Fuel, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export function TableauVehiculesRecent({ vehicules }) {
  const vehiculesRecents = vehicules.slice(0, 5);

  return (
    <div className="card bg-card border-border">
      <div className="pb-3 px-6 pt-6 flex flex-row items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Véhicules récents</h3>
        <Link to="/vehicules">
          <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 hover:underline">
            Voir tout
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Link>
      </div>
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  Véhicule
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden sm:table-cell">
                  Carburant
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden md:table-cell">
                  Kilométrage
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {vehiculesRecents.map((vehicule, index) => (
                <motion.tr
                  key={vehicule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
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
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        statutStyles[vehicule.statut]
                      }`}
                    >
                      {statutLabels[vehicule.statut]}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
