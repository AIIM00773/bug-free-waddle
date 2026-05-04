import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export interface PromptData {
    text: string;
    createdAt: string;
}


export interface PromptContextType {
    activePrompt: PromptData | any;
    setPrompt: (text: string) => void;
    clearPrompt: () => void;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: ReactNode }) {
   
    const [activePrompt, setActivePrompt] = useState<PromptData | null>(null);

    const setPrompt = useCallback((text: string) => {
        if (!text.trim()) { setActivePrompt(null); return;}
        const newPrompt: PromptData = { text, createdAt: new Date().toISOString() };
        setActivePrompt(newPrompt);
    }, []);

    const clearPrompt = useCallback(() => { setActivePrompt(null);  }, []);
    const value = {  activePrompt,setPrompt,clearPrompt };

    return (
        <PromptContext.Provider value={value}>
            {children}
        </PromptContext.Provider>
    );
}


const usePrompt = () => {
    const context = useContext(PromptContext);
    if (context === undefined) {
        throw new Error('usePrompt must be used within a PromptProvider');
    }
    return context;
};

export { usePrompt };

