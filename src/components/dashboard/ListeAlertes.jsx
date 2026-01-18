import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, Wrench, Clock } from 'lucide-react';

const icones = {
  assurance: AlertTriangle,
  controle: Calendar,
  entretien: Wrench,
  retard: Clock,
};

const couleursUrgence = {
  haute: 'bg-destructive/10 text-destructive border-destructive/20',
  moyenne: 'bg-warning/10 text-foreground border-warning/20',
  basse: 'bg-primary/10 text-primary border-primary/20',
};

export function ListeAlertes({ alertes }) {
  return (
    <div className="card bg-card border-border">
      <div className="pb-3 px-6 pt-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Alertes actives
          <span className="ml-auto text-xs font-normal text-muted-foreground">{alertes.length} alertes</span>
        </h3>
      </div>
      <div className="px-6 pb-6 space-y-3">
        {alertes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Aucune alerte active</p>
        ) : (
          alertes.map((alerte, index) => {
            const Icone = icones[alerte.type];
            return (
              <motion.div
                key={alerte.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${couleursUrgence[alerte.urgence]}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-current/10">
                    <Icone className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alerte.message}</p>
                    <p className="text-xs opacity-80 mt-0.5 truncate">{alerte.vehicule}</p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
