import { motion } from 'framer-motion';
import { ShoppingCart, Truck, Calendar, Package, Edit, Trash2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const statutStyles = {
  en_attente: 'bg-warning/10 text-warning',
  en_cours: 'bg-primary/10 text-primary',
  livre: 'bg-success/10 text-success',
  annule: 'bg-destructive/10 text-destructive',
};

const statutLabels = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  livre: 'Livré',
  annule: 'Annulé',
};

const statutIcons = {
  en_attente: Clock,
  en_cours: Truck,
  livre: CheckCircle2,
  annule: XCircle,
};

export function TableauApprovisionnements({
  approvisionnements,
  onModifier,
  onSupprimer,
  onRecevoir,
}) {
  return (
    <div className="card bg-card border-border">
      <div className="px-6 pt-6 pb-3">
        <h3 className="text-base font-semibold text-foreground">Liste des approvisionnements</h3>
      </div>
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  N° / Fournisseur
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden sm:table-cell">
                  Date commande
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden md:table-cell">
                  Livraison
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden lg:table-cell">
                  Articles
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden lg:table-cell">
                  Total TTC
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
              {approvisionnements.map((app, index) => {
                const StatutIcon = statutIcons[app.statut] || Clock;

                return (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{app.numero}</p>
                          <p className="text-xs text-muted-foreground">{app.fournisseur}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {format(new Date(app.dateCommande), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell">
                      <div className="space-y-0.5">
                        {app.dateLivraisonPrevue && (
                          <div className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs text-foreground">
                              Prévue: {format(new Date(app.dateLivraisonPrevue), 'dd MMM yyyy')}
                            </span>
                          </div>
                        )}
                        {app.dateLivraison && (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                            <span className="text-xs text-foreground">
                              Livré: {format(new Date(app.dateLivraison), 'dd MMM yyyy')}
                            </span>
                          </div>
                        )}
                        {!app.dateLivraisonPrevue && !app.dateLivraison && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {app.lignes?.length || 0} article(s)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <span className="text-sm font-medium text-primary">
                        {(app.totalTTC ?? 0).toLocaleString('fr-FR')} FCFA
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          statutStyles[app.statut] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <StatutIcon className="w-3 h-3" />
                        {statutLabels[app.statut] || app.statut}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        {app.statut !== 'livre' && app.statut !== 'annule' && onRecevoir && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onRecevoir(app.id)}
                            className="p-1.5 text-success hover:bg-success/10 rounded-lg transition-colors text-xs font-medium"
                            title="Recevoir"
                          >
                            <Package className="w-4 h-4" />
                          </motion.button>
                        )}
                        {onModifier && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onModifier(app)}
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
                            onClick={() => onSupprimer(app.id)}
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
          {approvisionnements.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">Aucun approvisionnement trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
