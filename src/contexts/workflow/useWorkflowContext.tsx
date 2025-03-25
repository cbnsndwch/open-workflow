import { createContext, useContext } from 'react';

import { WorkflowContextType } from './types';

export const WorkflowContext = createContext<WorkflowContextType | undefined>(
    undefined
);

export const useWorkflowContext = (): WorkflowContextType => {
    const context = useContext(WorkflowContext);
    if (context === undefined) {
        throw new Error(
            'useWorkflowContext must be used within a WorkflowProvider'
        );
    }
    return context;
};
