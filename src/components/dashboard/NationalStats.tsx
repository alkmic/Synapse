import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { useTranslation } from '../../i18n';

export const NationalStats: React.FC = () => {
  const { practitioners } = useAppStore();
  const { t } = useTranslation();

  // Calculate statistics based on actual data
  const specialists = practitioners.filter(p => p.specialty !== 'Médecin généraliste');
  const medecinsGeneralistes = practitioners.filter(p => p.specialty === 'Médecin généraliste');

  // National statistics (realistic pharma market data)
  const nationalStats = {
    medecinsGeneralistes: 64291,
    specialists: 2008,
    total: 66299,
    targetMarket: '3.5M',
    avgPrescriptions: 420,
    percentageKOL: 0.24
  };

  // Territory stats (our current data subset)
  const territoryStats = {
    medecinsGeneralistes: medecinsGeneralistes.length,
    specialists: specialists.length,
    total: practitioners.length,
    kolCount: practitioners.filter(p => p.isKOL).length
  };

  const totalVolumeTerritory = practitioners.reduce((sum, p) => sum + p.volumeL, 0);
  const avgVolumePerPractitioner = Math.round(totalVolumeTerritory / practitioners.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-3 sm:p-4"
    >
      <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center space-x-2">
        <Users className="w-4 h-4 text-indigo-500" />
        <span>{t('dashboard.nationalStats')}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* National Stats */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide border-b border-slate-200 pb-1.5">
            {t('dashboard.nationalFrance')}
          </h3>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">{t('dashboard.generalPractitioners')}</span>
              <span className="text-sm font-bold text-slate-800">{nationalStats.medecinsGeneralistes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">{t('dashboard.pneumologists')}</span>
              <span className="text-sm font-bold text-slate-800">{nationalStats.specialists.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-1.5">
              <span className="text-xs font-semibold text-slate-700">{t('dashboard.totalGeneral')}</span>
              <span className="text-base font-bold text-indigo-600">{nationalStats.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-2 p-2 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{t('dashboard.targetMarket')}</span>
              <span className="text-xs font-bold text-indigo-600">{nationalStats.targetMarket}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{t('dashboard.avgVolumePatient')}</span>
              <span className="text-xs font-bold text-indigo-600">{nationalStats.avgPrescriptions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{t('dashboard.pctKol')}</span>
              <span className="text-xs font-bold text-indigo-600">{nationalStats.percentageKOL}%</span>
            </div>
          </div>
        </div>

        {/* Territory Stats */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide border-b border-slate-200 pb-1.5">
            {t('dashboard.yourTerritory')}
          </h3>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">{t('dashboard.generalPractitioners')}</span>
              <span className="text-sm font-bold text-slate-800">{territoryStats.medecinsGeneralistes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">{t('dashboard.pneumologists')}</span>
              <span className="text-sm font-bold text-slate-800">{territoryStats.specialists}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-1.5">
              <span className="text-xs font-semibold text-slate-700">{t('dashboard.totalTerritory')}</span>
              <span className="text-base font-bold text-violet-600">{territoryStats.total}</span>
            </div>
          </div>

          <div className="mt-2 p-2 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-lg space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{t('dashboard.kolIdentified')}</span>
              <span className="text-xs font-bold text-violet-600">{territoryStats.kolCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{t('dashboard.totalVolumeTerritory')}</span>
              <span className="text-xs font-bold text-violet-600">{(totalVolumeTerritory / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{t('dashboard.avgVolumePractitioner')}</span>
              <span className="text-xs font-bold text-violet-600">{(avgVolumePerPractitioner / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ratio comparison */}
      <div className="mt-3 p-2.5 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg border border-indigo-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-medium text-slate-700">{t('dashboard.ratioSpecialties')}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">{t('dashboard.national')}</div>
              <div className="text-xs font-bold text-slate-800">1:{Math.round(nationalStats.medecinsGeneralistes / nationalStats.specialists)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">{t('dashboard.territoryLabel')}</div>
              <div className="text-xs font-bold text-indigo-600">1:{territoryStats.specialists > 0 ? Math.round(territoryStats.medecinsGeneralistes / territoryStats.specialists) : '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
