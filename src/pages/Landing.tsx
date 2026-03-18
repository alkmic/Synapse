import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Brain, TrendingUp, MapPin, Users, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n';

export function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="h-screen bg-gradient-to-br from-al-blue-900 via-al-navy to-al-blue-800 relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.2, 0.15] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.15, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4">
        {/* Logo MedVantis Pharma */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <div className="text-white text-sm font-semibold tracking-[0.3em] uppercase">
            MedVantis Pharma
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-violet-400 to-indigo-400 mt-1" />
        </motion.div>

        {/* SYNAPSE Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-3"
        >
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight">
            SYNAPSE
          </h1>
          <div className="flex items-center justify-center gap-2 text-violet-300 text-sm sm:text-base font-medium mt-1">
            <Sparkles className="w-4 h-4" />
            <span>{t('welcome.landingSubtitle')}</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/70 text-sm sm:text-base text-center max-w-lg mb-6 leading-relaxed"
        >
          {t('welcome.landingDescription')}
        </motion.p>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mb-6 max-w-3xl"
        >
          {[
            { icon: Brain, label: t('welcome.landingFeatures.coachIA'), color: 'text-violet-300' },
            { icon: Zap, label: t('welcome.landingFeatures.pitchIA'), color: 'text-indigo-300' },
            { icon: TrendingUp, label: t('welcome.landingFeatures.analytics'), color: 'text-violet-300' },
            { icon: Users, label: t('welcome.landingFeatures.crmPro'), color: 'text-indigo-300' },
            { icon: MapPin, label: t('welcome.landingFeatures.territory'), color: 'text-violet-300' },
            { icon: Target, label: t('welcome.landingFeatures.objectives'), color: 'text-indigo-300' },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-1.5 group-hover:bg-white/20 transition-colors">
                <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color}`} />
              </div>
              <span className="text-white/80 text-xs font-medium">{feature.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(99, 102, 241, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/dashboard')}
          className="group relative px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-base font-semibold rounded-xl shadow-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <div className="relative flex items-center gap-2">
            <span>{t('welcome.accessDashboard')}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </motion.button>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10 pb-4 text-center"
      >
        <span className="text-white/30 text-xs">
          {t('welcome.versionPowered')}
        </span>
      </motion.div>
    </div>
  );
}
