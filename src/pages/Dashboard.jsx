import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useMemo } from 'react';
import { CarteKPI } from '../components/dashboard/CarteKPI';
import { GraphiqueStatuts } from '../components/dashboard/GraphiqueStatuts';
import { GraphiqueCarburant } from '../components/dashboard/GraphiqueCarburant';
import { GraphiqueRevenus } from '../components/dashboard/GraphiqueRevenus';
import { ListeAlertes } from '../components/dashboard/ListeAlertes';
import { TableauVehiculesRecent } from '../components/dashboard/TableauVehiculesRecent';

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
    }, {});

    const repartitionCarburant = vehicules.reduce((acc, v) => {
      acc[v.carburant] = (acc[v.carburant] || 0) + 1;
      return acc;
    }, {});

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

  // Données graphiques
  const donneesRevenus = useMemo(() => [
    { mois: 'Juil', revenus: 12500 },
    { mois: 'Août', revenus: 15800 },
    { mois: 'Sep', revenus: 14200 },
    { mois: 'Oct', revenus: 16900 },
    { mois: 'Nov', revenus: 18500 },
    { mois: 'Déc', revenus: statistiques.revenusMensuels > 0 ? statistiques.revenusMensuels : 21200 },
  ], [statistiques.revenusMensuels]);

  const donneesStatut = useMemo(() => Object.entries(statistiques.repartitionStatut).map(([name, value]) => ({
    statut: name === 'disponible' ? 'Disponible' :
      name === 'loue' ? 'En location' :
        name === 'maintenance' ? 'Maintenance' : 'Hors service',
    nombre: value,
  })), [statistiques.repartitionStatut]);

  const donneesCarburant = useMemo(() => Object.entries(statistiques.repartitionCarburant).map(([name, value]) => ({
    type: name === 'essence' ? 'Essence' :
      name === 'diesel' ? 'Diesel' :
        name === 'electrique' ? 'Électrique' : 'Hybride',
    nombre: value,
  })), [statistiques.repartitionCarburant]);

  // Génération des alertes basées sur les véhicules
  const alertes = useMemo(() => {
    const alerts = [];

    vehicules.forEach((vehicule) => {
      const vehiculeNom = `${vehicule.marque} ${vehicule.modele} (${vehicule.immatriculation})`;

      // Alerte assurance si pas valide
      if (!vehicule.assuranceValide) {
        alerts.push({
          id: `assurance-${vehicule.id}`,
          type: 'assurance',
          message: 'Assurance expirée ou invalide',
          vehicule: vehiculeNom,
          urgence: 'haute',
          date: new Date().toLocaleDateString('fr-FR'),
        });
      }

      // Alerte entretien si kilométrage élevé (exemple: > 20000 km)
      if (vehicule.kilometrage > 20000 && vehicule.statut !== 'maintenance') {
        alerts.push({
          id: `entretien-${vehicule.id}`,
          type: 'entretien',
          message: 'Entretien préventif recommandé',
          vehicule: vehiculeNom,
          urgence: 'moyenne',
          date: new Date().toLocaleDateString('fr-FR'),
        });
      }

      // Alerte si véhicule en maintenance depuis plus de 30 jours (simulation)
      if (vehicule.statut === 'maintenance') {
        alerts.push({
          id: `maintenance-${vehicule.id}`,
          type: 'entretien',
          message: 'Véhicule en maintenance prolongée',
          vehicule: vehiculeNom,
          urgence: 'basse',
          date: new Date().toLocaleDateString('fr-FR'),
        });
      }
    });

    return alerts;
  }, [vehicules]);

  // KPIs
  const kpis = [
    {
      titre: 'Total véhicules',
      valeur: statistiques.totalVehicules.toString(),
      borderColor: 'border-blue-500',
    },
    {
      titre: 'Disponibles',
      valeur: statistiques.vehiculesDisponibles.toString(),
      borderColor: 'border-green-500',
    },
    {
      titre: 'En location',
      valeur: statistiques.vehiculesLoues.toString(),
      borderColor: 'border-yellow-500',
    },
    {
      titre: 'Taux utilisation',
      valeur: `${statistiques.tauxUtilisation}%`,
      borderColor: 'border-blue-500',
    },
    {
      titre: 'Revenus mensuels',
      valeur: statistiques.revenusMensuels > 0
        ? `${statistiques.revenusMensuels.toLocaleString('fr-FR')} FCFA`
        : '0 FCFA',
      borderColor: 'border-green-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground font-display mb-2">
          Tableau de bord
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Vue d'ensemble de votre flotte automobile
        </p>
      </motion.div>

      {/* KPI Cards - Grid responsive 5 colonnes */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
        {kpis.map((kpi, index) => (
          <CarteKPI key={index} {...kpi} delay={index * 0.1} />
        ))}
      </div>

      {/* Graphiques - Grid 3 colonnes */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GraphiqueStatuts donnees={donneesStatut} />
        <GraphiqueCarburant donnees={donneesCarburant} />
        <GraphiqueRevenus donnees={donneesRevenus} />
      </motion.div>

      {/* Tableau + Alertes */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TableauVehiculesRecent vehicules={vehicules} />
        </div>
        <ListeAlertes alertes={alertes} />
      </motion.div>
    </motion.div>
  );
};
