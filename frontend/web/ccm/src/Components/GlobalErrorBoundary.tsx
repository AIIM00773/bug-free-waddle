
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function GlobalErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    // Determine specific errors safely
    let errorTitle = "Unexpected System Error";
    let errorMessage = "An unhandled execution error or network pipeline failure interrupted the view cascade.";
    let statusCode = "500";

    if (isRouteErrorResponse(error)) {
        statusCode = error.status.toString();
        if (error.status === 404) {
            errorTitle = "Resource Link Missing";
            errorMessage = "The requested path does not exist in the platform layout matrix or has been migrated.";
        } else if (error.status === 401) {
            errorTitle = "Session Unauthorized";
            errorMessage = "Your validation token is missing or expired. Please re-authenticate your dashboard session.";
        } else if (error.status === 503) {
            errorTitle = "Service Pipeline Timeout";
            errorMessage = "The background backend data engine is currently overloaded or undergoing maintenance loops.";
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-2xs text-center space-y-6">
                
                <div className="relative mx-auto h-16 w-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                    <AlertTriangle size={28} />
                    <span className="absolute -top-1 -right-2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                        {statusCode}
                    </span>
                </div>

                <div className="space-y-2">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">{errorTitle}</h2>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                        {errorMessage}
                    </p>
                </div>


                <div className="grid grid-cols-1 gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full text-slate-900 hover:text-slate-800 bg-slate-50 hover:bg-slate-100  rounded-xl py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                        <Home size={12} /> Site  Home
                    </button>
                </div>
            </div>
        </div>
    );
}