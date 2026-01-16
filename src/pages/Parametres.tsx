import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Building2,
  DollarSign,
  Bell,
  User,
  Shield,
  Database,
  Mail,
  Phone,
  Save,
  BellRing,
  CreditCard,
  FileText,
  Globe,
  Package,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ParametresGeneraux {
  nomEntreprise: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  email: string;
  siteWeb: string;
  siret: string;
  tva: string;
}

interface ParametresFacturation {
  tauxTVA: number;
  devise: string;
  conditionsPaiement: string;
  delaiPaiement: number;
  texteFacture: string;
}

interface ParametresNotifications {
  emailNotifications: boolean;
  alertesStock: boolean;
  alertesMaintenance: boolean;
  alertesLocation: boolean;
  alertesFacturation: boolean;
}

export const Parametres = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'facturation' | 'notifications' | 'securite'>('general');
  
  const [parametresGeneraux, setParametresGeneraux] = useState<ParametresGeneraux>({
    nomEntreprise: 'Flotte Pro',
    adresse: '123 Rue de la Flotte',
    ville: 'Paris',
    codePostal: '75001',
    pays: 'France',
    telephone: '+33 1 23 45 67 89',
    email: 'contact@flottepro.fr',
    siteWeb: 'www.flottepro.fr',
    siret: '123 456 789 00012',
    tva: 'FR12 345678901',
  });

  const [parametresFacturation, setParametresFacturation] = useState<ParametresFacturation>({
    tauxTVA: 20,
    devise: 'EUR',
    conditionsPaiement: 'Paiement à réception de facture',
    delaiPaiement: 30,
    texteFacture: 'Merci de votre confiance.',
  });

  const [parametresNotifications, setParametresNotifications] = useState<ParametresNotifications>({
    emailNotifications: true,
    alertesStock: true,
    alertesMaintenance: true,
    alertesLocation: true,
    alertesFacturation: true,
  });

  const handleSaveGeneraux = () => {
    // Ici, vous pourriez sauvegarder dans localStorage ou une API
    localStorage.setItem('parametresGeneraux', JSON.stringify(parametresGeneraux));
    toast.success('Paramètres généraux sauvegardés');
  };

  const handleSaveFacturation = () => {
    localStorage.setItem('parametresFacturation', JSON.stringify(parametresFacturation));
    toast.success('Paramètres de facturation sauvegardés');
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('parametresNotifications', JSON.stringify(parametresNotifications));
    toast.success('Paramètres de notifications sauvegardés');
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Building2 },
    { id: 'facturation', label: 'Facturation', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'securite', label: 'Sécurité', icon: Shield },
  ];

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-display mb-1 sm:mb-2">Paramètres</h1>
        <p className="text-sm sm:text-base text-slate-600">Configurez votre application</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 flex items-center gap-2 border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Contenu des onglets */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8"
      >
        {/* Onglet Général */}
        {activeTab === 'general' && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6" />
                Informations de l'entreprise
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={parametresGeneraux.nomEntreprise}
                    onChange={(e) =>
                      setParametresGeneraux({
                        ...parametresGeneraux,
                        nomEntreprise: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={parametresGeneraux.adresse}
                    onChange={(e) =>
                      setParametresGeneraux({
                        ...parametresGeneraux,
                        adresse: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ville</label>
                  <input
                    type="text"
                    value={parametresGeneraux.ville}
                    onChange={(e) =>
                      setParametresGeneraux({
                        ...parametresGeneraux,
                        ville: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={parametresGeneraux.codePostal}
                    onChange={(e) =>
                      setParametresGeneraux({
                        ...parametresGeneraux,
                        codePostal: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pays</label>
                  <input
                    type="text"
                    value={parametresGeneraux.pays}
                    onChange={(e) =>
                      setParametresGeneraux({
                        ...parametresGeneraux,
                        pays: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={parametresGeneraux.telephone}
                    onChange={(e) =>
                      setParametresGeneraux({
                        ...parametresGeneraux,
                        telephone: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={parametresGeneraux.email}
                    onChange={(e) =>
                      setParametresGeneraux({
                        ...parametresGeneraux,
                        email: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Site web
                  </label>
                  <input
                    type="url"
                    value={parametresGeneraux.siteWeb}
                    onChange={(e) =>
                      setParametresGeneraux({
                        ...parametresGeneraux,
                        siteWeb: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SIRET
                  </label>
                  <input
                    type="text"
                    value={parametresGeneraux.siret}
                    onChange={(e) =>
                      setParametresGeneraux({
                        ...parametresGeneraux,
                        siret: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Numéro TVA
                  </label>
                  <input
                    type="text"
                    value={parametresGeneraux.tva}
                    onChange={(e) =>
                      setParametresGeneraux({
                        ...parametresGeneraux,
                        tva: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveGeneraux}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Sauvegarder
              </motion.button>
            </div>
          </div>
        )}

        {/* Onglet Facturation */}
        {activeTab === 'facturation' && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Paramètres de facturation
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Taux de TVA (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={parametresFacturation.tauxTVA}
                    onChange={(e) =>
                      setParametresFacturation({
                        ...parametresFacturation,
                        tauxTVA: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Devise</label>
                  <select
                    value={parametresFacturation.devise}
                    onChange={(e) =>
                      setParametresFacturation({
                        ...parametresFacturation,
                        devise: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Délai de paiement (jours)
                  </label>
                  <input
                    type="number"
                    value={parametresFacturation.delaiPaiement}
                    onChange={(e) =>
                      setParametresFacturation({
                        ...parametresFacturation,
                        delaiPaiement: parseInt(e.target.value) || 0,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Conditions de paiement
                  </label>
                  <input
                    type="text"
                    value={parametresFacturation.conditionsPaiement}
                    onChange={(e) =>
                      setParametresFacturation({
                        ...parametresFacturation,
                        conditionsPaiement: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Texte de fin de facture
                  </label>
                  <textarea
                    value={parametresFacturation.texteFacture}
                    onChange={(e) =>
                      setParametresFacturation({
                        ...parametresFacturation,
                        texteFacture: e.target.value,
                      })
                    }
                    className="input-field"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveFacturation}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Sauvegarder
              </motion.button>
            </div>
          </div>
        )}

        {/* Onglet Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <BellRing className="w-6 h-6" />
                Paramètres de notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Notifications par email</p>
                      <p className="text-sm text-slate-600">
                        Recevoir des notifications par email
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={parametresNotifications.emailNotifications}
                      onChange={(e) =>
                        setParametresNotifications({
                          ...parametresNotifications,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Alertes de stock</p>
                      <p className="text-sm text-slate-600">
                        Notifications lorsque le stock est bas
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={parametresNotifications.alertesStock}
                      onChange={(e) =>
                        setParametresNotifications({
                          ...parametresNotifications,
                          alertesStock: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Alertes de maintenance</p>
                      <p className="text-sm text-slate-600">
                        Notifications pour les maintenances prévues
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={parametresNotifications.alertesMaintenance}
                      onChange={(e) =>
                        setParametresNotifications({
                          ...parametresNotifications,
                          alertesMaintenance: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Alertes de location</p>
                      <p className="text-sm text-slate-600">
                        Notifications pour les locations à venir
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={parametresNotifications.alertesLocation}
                      onChange={(e) =>
                        setParametresNotifications({
                          ...parametresNotifications,
                          alertesLocation: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Alertes de facturation</p>
                      <p className="text-sm text-slate-600">
                        Notifications pour les factures impayées
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={parametresNotifications.alertesFacturation}
                      onChange={(e) =>
                        setParametresNotifications({
                          ...parametresNotifications,
                          alertesFacturation: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveNotifications}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Sauvegarder
              </motion.button>
            </div>
          </div>
        )}

        {/* Onglet Sécurité */}
        {activeTab === 'securite' && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Sécurité et confidentialité
              </h2>
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <div className="p-3 sm:p-4 lg:p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Gestion des utilisateurs
                  </h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Gérez les accès et les permissions des utilisateurs de l'application.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary text-sm"
                  >
                    Gérer les utilisateurs
                  </motion.button>
                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Sauvegarde des données
                  </h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Les données sont sauvegardées localement dans votre navigateur. Pour une
                    sauvegarde sécurisée, pensez à exporter régulièrement vos données.
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-secondary text-sm"
                    >
                      Exporter les données
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-secondary text-sm"
                    >
                      Importer les données
                    </motion.button>
                  </div>
                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-2">Zone de danger</h3>
                  <p className="text-sm text-red-800 mb-4">
                    Actions irréversibles. Veuillez être certain avant de continuer.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary bg-red-600 hover:bg-red-700 text-white text-sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.'
                        )
                      ) {
                        toast.error('Fonctionnalité non implémentée');
                      }
                    }}
                  >
                    Réinitialiser toutes les données
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
