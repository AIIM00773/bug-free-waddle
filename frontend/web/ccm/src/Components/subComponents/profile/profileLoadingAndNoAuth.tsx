import { Loader2, User } from "lucide-react";

export  function ProfileLoadingAndNoAuth({
  isLoading,
  isAuthenticated,
  onBackToChat,
}: {
  isLoading: boolean;
  isAuthenticated: boolean;
  onBackToChat: () => void;
}) {
  // If not loading and the user IS authenticated, this component shouldn't show anything 
  // (assuming the parent component will render the actual profile instead).
  if (!isLoading && isAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center px-5">
      {isLoading ? (
        <div className="flex flex-col items-center text-center">
          <Loader2
            className="animate-spin text-slate-500 mb-4"
            size={24}
            strokeWidth={1.8}
          />

          <span className="text-sm text-slate-700">Loading profile</span>

          <span className="text-xs text-slate-400 mt-1">
            Please wait a moment
          </span>
        </div>
      ) : (
        <div className="w-full max-w-[380px] bg-white border border-slate-200 rounded-xl px-7 py-8 text-center shadow-sm">
          <div className="mx-auto mb-5 w-11 h-11 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center">
            <User
              size={20}
              strokeWidth={1.7}
              className="text-slate-500"
            />
          </div>

          <h3 className="text-[15px] font-medium text-slate-900">
            Sign in required
          </h3>

          <p className="mt-2 text-[13px] leading-5 text-slate-500">
            Sign in to view and manage your profile settings.
          </p>

          <button
            type="button"
            onClick={onBackToChat}
            className="mt-6 w-full h-10 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-medium transition-colors"
          >
            Go back
          </button>
        </div>
      )}
    </div>
  );
}



