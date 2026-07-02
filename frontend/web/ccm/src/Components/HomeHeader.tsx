import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  PanelLeft,
  LogIn,
  MoreVertical,
  HelpCircle,
  UserPlus2,
  User2Icon,
  Sparkles,
  BrainCircuit,
  X,
  Lock,
  AlertCircle,
  ArrowUpRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";

import { useAuth } from "../Providers/AuthContex";
import { useConversations } from "../Providers/ConversationContext";
import SokoLogo from "../Constants/Logo";

export default function HomeHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [showSearchTypeToggle, setShowSearchTypeToggle] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { isAuthenticated, setAuthRoute } = useAuth();
  const {
    searchType,
    changeChatType,
    chatTypeSwitchErrorMessage,
    conversationErrorMessage,
    clearConversationErrorMessage
  } = useConversations();

  // Close dropdown outside click + ESC
  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActionsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActionsOpen(false);
        setShowSearchTypeToggle((prev) => !prev);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isIntelligent = searchType === "intelligent_search";

  return (
    <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-30 select-none bg-gradient-to-b from-slate-50 via-slate-50/90 to-transparent">
      {/* GLOBAL ERROR */}
      {conversationErrorMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 max-w-md w-[calc(100%-2rem)] flex items-start gap-3 p-4 rounded-2xl bg-red-500  backdrop-blur-xl border border-red-200/60 shadow-xl animate-in fade-in slide-in-from-top-3">
          <div className="p-2 rounded-xl bg-red-50 text-red-600">
            <AlertCircle size={16} />
          </div>

          <div className="flex-1">
            <p className="text-[10px]  text-[aliceblue]">
              Conversation error !
            </p>
            <p className="text-xs font-semibold text-slate-50 mt-1">
              {conversationErrorMessage}
            </p>
          </div>

          <button
            onClick={clearConversationErrorMessage}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* LEFT SIDE */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/80 border border-slate-200 shadow-sm hover:bg-slate-100 transition"
            >
              <PanelLeft size={16} />
            </button>
          )}
          <SokoLogo />
        </div>

        {/* SEARCH MODE */}
        <div className="relative hidden md:flex">
          <button
            onClick={() => setShowSearchTypeToggle((v) => !v)}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-transparent hover:bg-white transition mt-1 hover:cursor-pointer"
          >
            {showSearchTypeToggle ? (
              <ChevronUp size={15} color="green" />
            ) : (
              <ChevronDown size={18} color="orange" />
            )}
          </button>

          {showSearchTypeToggle && (
            <div className="absolute top-12 left-0 flex p-1 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl animate-in fade-in slide-in-from-top-2">
              <button
                onClick={() => changeChatType("intelligent_search")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  isIntelligent
                    ? "bg-white shadow ring-1 ring-slate-200 text-slate-900"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Sparkles
                  size={14}
                  className={isIntelligent ? "text-amber-500" : "text-slate-400"}
                />
                Intelligent
              </button>

              <button
                onClick={() => changeChatType("direct_search")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  !isIntelligent
                    ? "bg-white shadow ring-1 ring-slate-200 text-slate-900"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <BrainCircuit
                  size={14}
                  className={!isIntelligent ? "text-indigo-500" : "text-slate-400"}
                />
                Direct
              </button>
            </div>
          )}

          {/* LOCK MESSAGE */}
          {chatTypeSwitchErrorMessage && (
            <div className="absolute top-14 left-0 w-96 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900">
                  <Lock size={15} className="text-amber-400" />
                </div>

                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    Advanced Module
                  </p>
                  <p className="text-xs font-semibold mt-1 text-slate-700">
                    {chatTypeSwitchErrorMessage}
                  </p>
                </div>

                <button
                  onClick={() => {
                    changeChatType("direct_search");
                    setShowSearchTypeToggle(false);
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              <button
                onClick={() => changeChatType("direct_search")}
                className="mt-4 w-full flex justify-center items-center gap-2 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-700 text-white text-xs font-bold transition"
              >
                Keep using Direct Search
                <ArrowUpRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT MENU */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setActionsOpen((v) => !v)}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition"
        >
          <MoreVertical size={16} />
        </button>

        {actionsOpen && (
          <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 animate-in fade-in slide-in-from-top-2">
            {!isAuthenticated && (
              <>
                <MenuLink
                  to="/auth"
                  icon={<LogIn size={15} />}
                  label="Sign In"
                  click={() => setAuthRoute("login")}
                />
                <MenuLink
                  to="/auth"
                  icon={<UserPlus2 size={15} />}
                  label="Sign Up"
                  click={() => setAuthRoute("signup")}
                />
              </>
            )}

            {isAuthenticated && (
              <MenuLink
                to="/profile"
                icon={<User2Icon size={15} />}
                label="Profile"
              />
            )}

            <MenuLink
              to="/support"
              icon={<HelpCircle size={15} />}
              label="Help & Support"
            />
          </div>
        )}
      </div>
    </header>
  );
}

interface MenuLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  click?: () => void;
}

function MenuLink({ to, icon, label, click }: MenuLinkProps) {
  return (
    <Link
      to={to}
      onClick={click}
      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
    >
      {icon}
      {label}
    </Link>
  );
}