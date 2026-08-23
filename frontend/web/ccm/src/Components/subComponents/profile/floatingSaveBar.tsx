import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Check } from 'lucide-react';

interface FloatingSaveBarProps {
  isModified: boolean;
  saveSuccess: boolean;
  activeTab: string | null;
  isSaving: boolean;
  setIsModified: (modified: boolean) => void;
  handleFormSubmission: (e?: React.FormEvent) => void;
}

export function FloatingSaveBar({
  isModified,
  saveSuccess,
  activeTab,
  isSaving,
  setIsModified,
  handleFormSubmission,
}: FloatingSaveBarProps) {
  return (
    <AnimatePresence>
      {(isModified || saveSuccess) &&
        activeTab &&
        ["identity", "logistics"].includes(activeTab) && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-slate-800"
          >
            {saveSuccess ? (
              <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-semibold px-2">
                <CheckCircle2 size={18} />
                <span>Profile saved successfully!</span>
              </div>
            ) : (
              <>
                <span className="text-xs font-medium text-slate-300 px-2">
                  Unsaved changes detected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModified(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={handleFormSubmission}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
    </AnimatePresence>
  );
}
