import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Car,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const Dashboard = () => {
  const { vehicules, factures } = useApp();

  const statistiques = useMemo(() => {
    const totalVehicules = vehicules.length;
    const vehiculesDisponibles = vehicules.filter((v) => v.statut === 'disponible').length;
    const vehiculesLoues = vehicules.filter((v) => v.statut === 'loue').length;
    const tauxUtilisation = totalVehicules > 0 
      ? Math.round((vehiculesLoues / totalVehicules) * 100) 
      : 0;
    
    const revenusMensuels = factures
      .filter((f) => {
        const factureDate = new Date(f.dateEmission);
        const now = new Date();
        return factureDate.getMonth() === now.getMonth() && 
               factureDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, f) => sum + f.totalTTC, 0);

    const repartitionStatut = vehicules.reduce((acc, v) => {
      acc[v.statut] = (acc[v.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const repartitionCarburant = vehicules.reduce((acc, v) => {
      acc[v.carburant] = (acc[v.carburant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalVehicules,
      vehiculesDisponibles,
      vehiculesLoues,
      tauxUtilisation,
      revenusMensuels,
      repartitionStatut,
      repartitionCarburant,
    };
  }, [vehicules, factures]);

  const donneesRevenus = [
    { mois: 'Jan', revenus: 45000 },
    { mois: 'Fév', revenus: 52000 },
    { mois: 'Mar', revenus: 48000 },
    { mois: 'Avr', revenus: 61000 },
    { mois: 'Mai', revenus: 55000 },
    { mois: 'Juin', revenus: 67000 },
  ];

  const donneesStatut = Object.entries(statistiques.repartitionStatut).map(([name, value]) => ({
    name: name === 'disponible' ? 'Disponible' : 
          name === 'loue' ? 'Loué' : 
          name === 'maintenance' ? 'Maintenance' : 'Hors service',
    value,
  }));

  const donneesCarburant = Object.entries(statistiques.repartitionCarburant).map(([name, value]) => ({
    name: name === 'essence' ? 'Essence' : 
          name === 'diesel' ? 'Diesel' : 
          name === 'electrique' ? 'Électrique' : 'Hybride',
    value,
  }));

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color,
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="card bg-white rounded-xl shadow-md p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-slate-900 font-display mb-2">
          Tableau de bord
        </h1>
        <p className="text-slate-600">Vue d'ensemble de votre flotte automobile</p>
      </motion.div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total véhicules"
          value={statistiques.totalVehicules}
          icon={Car}
          color="#3B82F6"
          trend="+12% ce mois"
        />
        <StatCard
          title="Véhicules disponibles"
          value={statistiques.vehiculesDisponibles}
          icon={CheckCircle2}
          color="#10B981"
        />
        <StatCard
          title="Véhicules en location"
          value={statistiques.vehiculesLoues}
          icon={Clock}
          color="#F59E0B"
        />
        <StatCard
          title="Taux d'utilisation"
          value={`${statistiques.tauxUtilisation}%`}
          icon={TrendingUp}
          color="#6366F1"
          trend="+5% vs mois dernier"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Revenus mensuels"
          value={`${statistiques.revenusMensuels.toLocaleString('fr-FR')} FCFA`}
          icon={DollarSign}
          color="#8B5CF6"
          trend="+18% ce mois"
        />
        <StatCard
          title="Alertes stock"
          value="3 pièces"
          icon={AlertTriangle}
          color="#EF4444"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Évolution revenus */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Évolution des revenus</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={donneesRevenus}>
              <defs>
                <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mois" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenus"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenus)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Répartition par statut */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Répartition par statut</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={donneesStatut}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {donneesStatut.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Répartition par carburant */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4">Répartition par carburant</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={donneesCarburant}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
