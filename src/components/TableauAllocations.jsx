import { motion } from 'framer-motion';
import { User, Car, Calendar, Gauge, Edit, Trash2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const statutStyles = {
  en_attente: 'bg-warning/10 text-warning',
  en_cours: 'bg-primary/10 text-primary',
  termine: 'bg-success/10 text-success',
  annule: 'bg-destructive/10 text-destructive',
};

const statutLabels = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  termine: 'Terminé',
  annule: 'Annulé',
};

const statutIcons = {
  en_attente: Clock,
  en_cours: Car,
  termine: CheckCircle2,
  annule: XCircle,
};

export function TableauAllocations({
  allocations,
  clients,
  vehicules,
  onModifier,
  onSupprimer,
  onRetour,
}) {
  const getClient = (clientId) => {
    return clients.find((c) => c.id === clientId);
  };

  const getVehicule = (vehiculeId) => {
    return vehicules.find((v) => v.id === vehiculeId);
  };

  return (
    <div className="card bg-card border-border">
      <div className="px-6 pt-6 pb-3">
        <h3 className="text-base font-semibold text-foreground">Liste des allocations</h3>
      </div>
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  ID
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  Client
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden sm:table-cell">
                  Véhicule
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden md:table-cell">
                  Période
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden lg:table-cell">
                  Kilométrage
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden lg:table-cell">
                  Tarif
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
              {allocations.map((allocation, index) => {
                const client = getClient(allocation.clientId);
                const vehicule = getVehicule(allocation.vehiculeId);
                const StatutIcon = statutIcons[allocation.statut];

                return (
                  <motion.tr
                    key={allocation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <span className="text-sm font-medium text-foreground">
                        #{allocation.id.slice(-6)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {client ? `${client.prenom} ${client.nom}` : 'Client non trouvé'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-foreground">
                            {vehicule ? `${vehicule.marque} ${vehicule.modele}` : 'Véhicule non trouvé'}
                          </p>
                          {vehicule && (
                            <p className="text-xs text-muted-foreground">{vehicule.immatriculation}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-foreground">
                            {format(new Date(allocation.dateDebut), 'dd MMM yyyy')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(allocation.dateFin), 'dd MMM yyyy')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-foreground">Départ: {allocation.kmDepart} km</p>
                          {allocation.kmRetour && (
                            <p className="text-xs text-muted-foreground">
                              Retour: {allocation.kmRetour} km
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <span className="text-sm text-foreground font-medium">
                        {allocation.tarifTotal.toLocaleString('fr-FR')} FCFA
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          statutStyles[allocation.statut]
                        }`}
                      >
                        <StatutIcon className="w-3 h-3" />
                        {statutLabels[allocation.statut]}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        {allocation.statut === 'en_cours' && onRetour && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onRetour(allocation)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors text-xs"
                            title="Enregistrer le retour"
                          >
                            Retour
                          </motion.button>
                        )}
                        {onModifier && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onModifier(allocation)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                        )}
                        {onSupprimer && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onSupprimer(allocation.id)}
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {allocations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">Aucune allocation trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
