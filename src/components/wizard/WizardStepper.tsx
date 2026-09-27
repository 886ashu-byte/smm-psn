import React from 'react';
import { Check } from 'lucide-react';

interface WizardStepperProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentStep,
  onSelectStep,
}) => {
  const steps = [
    { num: 1, title: 'Platform & URL', sub: 'Step 01' },
    { num: 2, title: 'Services & Volume', sub: 'Step 02' },
    { num: 3, title: 'Audience Curve', sub: 'Step 03' },
    { num: 4, title: 'Jitter & Risk', sub: 'Step 04' },
    { num: 5, title: 'Review & Launch', sub: 'Step 05' },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 md:p-3.5 mb-4 md:mb-6">
      {/* Mobile Compact Progress Bar & Step Selector (< sm) */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
              {currentStep}
            </span>
            <span className="font-extrabold text-xs text-slate-900">
              {steps[currentStep - 1]?.title}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            Step {currentStep} of 5
          </span>
        </div>

        {/* 5-segment touchable progress track */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {steps.map((step) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => onSelectStep(step.num)}
                className="h-10 flex flex-col justify-center items-center rounded-lg min-h-[44px] transition-all"
                title={`Step ${step.num}: ${step.title}`}
              >
                <div
                  className={`w-full h-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-indigo-600 shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
                <span
                  className={`text-[9px] font-bold mt-1 ${
                    isActive
                      ? 'text-indigo-600'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  S{step.num}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop / Tablet Full Grid (>= sm) */}
      <div className="hidden sm:grid sm:grid-cols-5 gap-2.5">
        {steps.map((step) => {
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;

          return (
            <button
              key={step.num}
              type="button"
              onClick={() => onSelectStep(step.num)}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all text-left min-h-[48px] ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-600/20'
                  : isCompleted
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80'
                  : 'bg-white hover:bg-slate-50 text-slate-500 border border-slate-100'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isActive
                    ? 'bg-white text-indigo-700 font-extrabold shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.num}
              </div>

              <div className="truncate">
                <div
                  className={`text-xs font-bold leading-tight truncate ${
                    isActive ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-[11px] font-medium leading-normal ${
                    isActive ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  {step.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
