import { motion } from 'framer-motion';
import { User, Calendar, FileText, Download, Mail, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const statutStyles = {
  paye: 'bg-success/10 text-success',
  impaye: 'bg-destructive/10 text-destructive',
  partiel: 'bg-warning/10 text-warning',
};

const statutLabels = {
  paye: 'Payé',
  impaye: 'Impayé',
  partiel: 'Partiel',
};

const statutIcons = {
  paye: CheckCircle2,
  impaye: XCircle,
  partiel: AlertCircle,
};

export function TableauFactures({
  factures,
  clients,
  onGenererPDF,
  onEnvoyerEmail,
}) {
  const getClient = (clientId) => {
    return clients.find((c) => c.id === clientId);
  };

  return (
    <div className="card bg-card border-border">
      <div className="px-6 pt-6 pb-3">
        <h3 className="text-base font-semibold text-foreground">Liste des factures</h3>
      </div>
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  Numéro
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  Client
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden sm:table-cell">
                  Date d'émission
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden md:table-cell">
                  Total HT
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden lg:table-cell">
                  TVA
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
              {factures.map((facture, index) => {
                const client = getClient(facture.clientId);
                const StatutIcon = statutIcons[facture.statut];

                return (
                  <motion.tr
                    key={facture.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{facture.numero}</span>
                      </div>
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
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {format(new Date(facture.dateEmission), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell">
                      <span className="text-sm text-foreground font-medium">
                        {facture.totalHT.toLocaleString('fr-FR')} FCFA
                      </span>
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <span className="text-sm text-foreground">
                        {facture.tva.toLocaleString('fr-FR')} FCFA
                      </span>
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <span className="text-sm text-foreground font-bold text-primary">
                        {facture.totalTTC.toLocaleString('fr-FR')} FCFA
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          statutStyles[facture.statut]
                        }`}
                      >
                        <StatutIcon className="w-3 h-3" />
                        {statutLabels[facture.statut]}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        {onGenererPDF && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onGenererPDF(facture)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Télécharger PDF"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                        )}
                        {onEnvoyerEmail && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onEnvoyerEmail(facture)}
                            className="p-1.5 text-success hover:bg-success/10 rounded-lg transition-colors"
                            title="Envoyer par email"
                          >
                            <Mail className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {factures.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">Aucune facture trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
