import React, { useMemo } from 'react';
import { WizardStepper } from './wizard/WizardStepper';
import { Step1PlatformUrl } from './wizard/Step1PlatformUrl';
import { Step2ServicesVolume } from './wizard/Step2ServicesVolume';
import { Step3AudienceCurve } from './wizard/Step3AudienceCurve';
import { Step4JitterRisk } from './wizard/Step4JitterRisk';
import { Step5ReviewLaunch } from './wizard/Step5ReviewLaunch';
import {
  CampaignConfig,
  HourlyChunkAllocation,
  ServiceMetricRouting,
} from '../types/smm';
import { generateHourlyChunkAllocations } from '../utils/smmEngine';

interface CampaignWizardProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  config: CampaignConfig;
  updateConfig: (partial: Partial<CampaignConfig>) => void;
  serviceRouting: ServiceMetricRouting;
  updateServiceRouting: (partial: Partial<ServiceMetricRouting>) => void;
  onNavigateToRouting: () => void;
  onLaunchCampaign: (allocations: HourlyChunkAllocation[]) => void;
  onOpenOrganicModeModal?: () => void;
}

export const CampaignWizard: React.FC<CampaignWizardProps> = ({
  currentStep,
  setCurrentStep,
  config,
  updateConfig,
  serviceRouting,
  updateServiceRouting,
  onNavigateToRouting,
  onLaunchCampaign,
  onOpenOrganicModeModal,
}) => {
  // Dynamically recalculate hourly allocations based on current configuration
  const allocations: HourlyChunkAllocation[] = useMemo(() => {
    return generateHourlyChunkAllocations(config);
  }, [
    config.baseViews,
    config.likes,
    config.comments,
    config.shares,
    config.saves,
    config.duration,
    config.region,
    config.growthPreset,
    config.curvePoints,
    config.jitterIntensity,
    config.reRollAntiBotVariance,
    config.autoDispatchInterval,
  ]);

  const handleReRollVariance = () => {
    // Toggling or generating slight random shift to control points
    const jittered = config.curvePoints.map((p) => ({
      ...p,
      velocity: Math.max(5, Math.min(98, p.velocity + Math.floor(Math.random() * 5 - 2))),
    }));
    updateConfig({
      curvePoints: jittered,
      reRollAntiBotVariance: true,
    });
  };

  const handleLaunch = () => {
    onLaunchCampaign(allocations);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* 5-Step Stepper Navigation */}
      <WizardStepper
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
      />

      {/* Main Step Body Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        {currentStep === 1 && (
          <Step1PlatformUrl
            config={config}
            updateConfig={updateConfig}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2ServicesVolume
            config={config}
            updateConfig={updateConfig}
            serviceRouting={serviceRouting}
            onNavigateToRouting={onNavigateToRouting}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            onOpenOrganicModeModal={onOpenOrganicModeModal}
          />
        )}

        {currentStep === 3 && (
          <Step3AudienceCurve
            config={config}
            updateConfig={updateConfig}
            allocations={allocations}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4JitterRisk
            config={config}
            updateConfig={updateConfig}
            allocations={allocations}
            onReRollVariance={handleReRollVariance}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <Step5ReviewLaunch
            config={config}
            allocations={allocations}
            serviceRouting={serviceRouting}
            updateServiceRouting={updateServiceRouting}
            updateConfig={updateConfig}
            onLaunch={handleLaunch}
            onBack={() => setCurrentStep(4)}
          />
        )}
      </div>
    </div>
  );
};
