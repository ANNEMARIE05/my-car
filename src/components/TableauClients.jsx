import { motion } from 'framer-motion';
import { Mail, Phone, CreditCard, Edit, Trash2 } from 'lucide-react';

export function TableauClients({ clients, allocations, onModifier, onSupprimer }) {
  const getStatistiquesClient = (clientId) => {
    const clientAllocations = allocations.filter((a) => a.clientId === clientId);
    const nbLocations = clientAllocations.length;
    const totalDepense = clientAllocations.reduce((sum, a) => sum + a.tarifTotal, 0);
    return { nbLocations, totalDepense };
  };

  return (
    <div className="card bg-card border-border">
      <div className="px-6 pt-6 pb-3">
        <h3 className="text-base font-semibold text-foreground">Liste des clients</h3>
      </div>
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  Client
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden sm:table-cell">
                  Contact
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden md:table-cell">
                  Permis
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden lg:table-cell">
                  Locations
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2 hidden lg:table-cell">
                  Total dépensé
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => {
                const stats = getStatistiquesClient(client.id);
                return (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {client.prenom[0]}{client.nom[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {client.prenom} {client.nom}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden sm:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm text-foreground truncate max-w-[200px]">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm text-foreground">{client.telephone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground truncate max-w-[150px]">{client.numeroPermis}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <span className="text-sm text-foreground font-medium">{stats.nbLocations}</span>
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <span className="text-sm text-foreground font-medium">
                        {stats.totalDepense.toLocaleString('fr-FR')} FCFA
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onModifier(client)}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onSupprimer(client.id)}
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {clients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">Aucun client trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
