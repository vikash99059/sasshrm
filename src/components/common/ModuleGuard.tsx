import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft, Building2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CorporateModuleId } from '../../types/saasModules';
import { CORPORATE_MODULES } from '../../services/corporateModulesDb';

interface ModuleGuardProps {
    moduleId: CorporateModuleId;
    subModule?: string;
    children: React.ReactNode;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({ moduleId, subModule, children }) => {
    const { currentRole, currentOrg } = useAppStore();
    const navigate = useNavigate();

    // SaaS owner has unlimited platform access
    if (currentRole === 'saas_owner') {
        return <>{children}</>;
    }

    // Check if active organization has subscribed to this module
    const subscribedModules = currentOrg?.subscribedModules;
    const isSubscribed = !subscribedModules || subscribedModules.includes(moduleId);

    // Check if this specific submodule is disabled
    const disabledSubModules = currentOrg?.disabledSubModules?.[moduleId] || [];
    const isSubModuleDisabled = subModule && disabledSubModules.includes(subModule);

    if (isSubscribed && !isSubModuleDisabled) {
        return <>{children}</>;
    }

    const moduleInfo = CORPORATE_MODULES.find((m) => m.id === moduleId);
    const moduleName = moduleInfo?.name || moduleId.replace(/_/g, ' ').toUpperCase();

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden text-center p-8 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
                    <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                        <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                        {currentOrg?.name || 'Your Organization'}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {moduleName} Access Restricted
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                        This module is not included in your organization's active subscription plan. Contact your administrator or SaaS manager to add <strong>{moduleName}</strong> to your organization's subscription.
                    </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md hover:shadow-indigo-500/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};
