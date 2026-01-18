import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Car, ArrowRight, Mail, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [erreurs, setErreurs] = useState({});
  const [enChargement, setEnChargement] = useState(false);
  const { connecter } = useApp();
  const navigate = useNavigate();

  const validerFormulaire = () => {
    const nouvellesErreurs = {};

    if (!email) {
      nouvellesErreurs.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nouvellesErreurs.email = "Format d'email invalide";
    }

    if (!motDePasse) {
      nouvellesErreurs.motDePasse = "Le mot de passe est requis";
    } else if (motDePasse.length < 6) {
      nouvellesErreurs.motDePasse = "Minimum 6 caractères";
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const gererConnexion = async (e) => {
    e.preventDefault();
    if (!validerFormulaire()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }
    
    setEnChargement(true);
    
    // Simulation de connexion
    await new Promise((resolve) => setTimeout(resolve, 1500));
    connecter(email, motDePasse);
    toast.success('Connexion réussie !');
    navigate('/dashboard');
    setEnChargement(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Côté gauche - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'var(--primary)' }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/90 via-[var(--primary)]/80 to-[var(--accent)]/70" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Car className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AutoFleet Pro</span>
          </motion.div>

          {/* Contenu principal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-balance">
              Gérez votre flotte automobile avec simplicité
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Une solution complète pour suivre vos véhicules, optimiser vos coûts et maximiser votre rentabilité.
            </p>

            {/* Statistiques */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-white/70">Véhicules gérés</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold">98%</p>
                <p className="text-sm text-white/70">Satisfaction client</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-white/70">Support actif</p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-sm text-white/60"
          >
            © 2026 AutoFleet Pro. Tous droits réservés.
          </motion.p>
        </div>
      </motion.div>

      {/* Côté droit - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">AutoFleet Pro</span>
          </div>

          {/* Titre */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Bienvenue</h2>
            <p className="text-muted-foreground">Connectez-vous pour accéder à votre tableau de bord</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={gererConnexion} className="space-y-6">
            {/* Champ Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="nom@entreprise.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (erreurs.email) {
                      setErreurs(prev => ({ ...prev, email: undefined }));
                    }
                  }}
                  className="w-full pl-11 h-12 rounded-[var(--radius)] border border-border bg-muted/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <AnimatePresence mode="wait">
                {erreurs.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-destructive"
                  >
                    {erreurs.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="motDePasse" className="text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="motDePasse"
                  type={afficherMotDePasse ? "text" : "password"}
                  placeholder="••••••••"
                  value={motDePasse}
                  onChange={(e) => {
                    setMotDePasse(e.target.value);
                    if (erreurs.motDePasse) {
                      setErreurs(prev => ({ ...prev, motDePasse: undefined }));
                    }
                  }}
                  className="w-full pl-11 pr-11 h-12 rounded-[var(--radius)] border border-border bg-muted/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {afficherMotDePasse ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <AnimatePresence mode="wait">
                {erreurs.motDePasse && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-destructive"
                  >
                    {erreurs.motDePasse}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                <span className="text-sm text-muted-foreground">Se souvenir de moi</span>
              </label>
              <button type="button" className="text-sm font-medium transition-colors" style={{ color: 'var(--primary)' }}>
                Mot de passe oublié ?
              </button>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={enChargement}
              className="w-full h-12 text-base font-semibold rounded-[var(--radius)] relative overflow-hidden group transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              <motion.span
                animate={enChargement ? { opacity: 0 } : { opacity: 1 }}
                className="flex items-center justify-center gap-2"
              >
                Se connecter
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.span>
              {enChargement && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </motion.div>
              )}
            </button>
          </form>

          {/* Lien inscription */}
          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <button className="font-medium transition-colors" style={{ color: 'var(--primary)' }}>
              Demander un accès
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
