import { useAppStore } from '../store/useAppStore';
import { CorporateModuleId } from '../types/saasModules';

export function useSubModuleAccess() {
    const { currentRole, currentOrg } = useAppStore();

    const isSubModuleEnabled = (
        moduleId: CorporateModuleId,
        subModuleName?: string
    ): boolean => {
        // SaaS owner has full access to all submodules
        if (currentRole === 'saas_owner') return true;

        // Check if main module is subscribed
        if (currentOrg?.subscribedModules && !currentOrg.subscribedModules.includes(moduleId)) {
            return false;
        }

        // Check if subModuleName is disabled
        if (subModuleName && currentOrg?.disabledSubModules?.[moduleId]) {
            const disabledList = currentOrg.disabledSubModules[moduleId] || [];
            if (disabledList.includes(subModuleName)) {
                return false;
            }
        }

        return true;
    };

    return { isSubModuleEnabled };
}
