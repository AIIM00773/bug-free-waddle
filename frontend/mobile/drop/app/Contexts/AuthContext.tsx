import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";

// import  { deleteValue, getValueFor, save } from "../Functions/SecureStoreFunctions"


/* =========================
   TYPES
========================= */

interface LoginData {
    phone: string;
    passcode: string;
}



interface SignupData {
    full_name: string;
    email: string;
    phone_number: string;
    passcode: string;
    country: {
        country_name: string,
        country_code: string,

    };
    city: string;
    lat_long: {
        lat: string,
        long: string,
    }
}




interface ResetPasswordData {
    phone: string;
    received_otp: string;
    new_password: string;
    confirmation: boolean;
}

interface ChangePasswordData {
    current_passcode: string;
    new_passcode: string;
    confirmation: boolean;
}

interface LockAccountData {
    account_password: string;
    confirmation: boolean;
}

interface UnlockAccountData {
    phone: string;
    email: string;
    password: string;
    received_otp: string;
    confirmation: boolean;
}



/* =========================
   USER
========================= */

interface User {
    id: string;
    name: string;
    phone: string;
    email?: string;
}

/* =========================
   CONTEXT TYPE
========================= */

interface AuthContextType {
    init: () => Promise<void>;

    isAuthenticated: boolean;
    user: User | null;
    tokens: string | null;

    login: (data: LoginData) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => Promise<void>;

    resetPassword: (data: ResetPasswordData) => Promise<void>;
    changePassword: (data: ChangePasswordData) => Promise<void>;

    lockAccount: (data: LockAccountData) => Promise<void>;
    unlockAccount: (data: UnlockAccountData) => Promise<void>;
}




/* =========================
   CONTEXT
========================= */

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);




/* =========================
   PROVIDER
========================= */

type AuthProviderProps = {
    children: ReactNode;
};


export const AuthProvider = ({
    children,
}: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<string | null>(null);



    /* =========================
       INIT SESSION
    ========================= */

    const init = async () => {

        const response = await fetch("url", {


        })

        // 1. read token from storage
        // 2. validate token
        // 3. restore user session

        console.log("Auth init running...");
    };





    /* =========================
       LOGIN
    ========================= */

    const login = async (data: LoginData) => {
        console.log("login:", data);

        // simulate success
        setIsAuthenticated(true);
        setTokens("dummy_token");
        setUser({
            id: "1",
            name: "User",
            phone: data.phone,
        });
    };



    /* =========================
       SIGNUP
    ========================= */

    const signup = async (data: SignupData) => {
        console.log("signup:", data);
    };

    /* =========================
       LOGOUT
    ========================= */

    const logout = async () => {
        setIsAuthenticated(false);
        setUser(null);
        setTokens(null);
    };



    /* =========================
       PASSWORD ACTIONS
    ========================= */

    const resetPassword = async (data: ResetPasswordData) => {
        console.log("reset password:", data);
    };


    const changePassword = async (data: ChangePasswordData) => {
        console.log("change password:", data);
    };




    /* =========================
       ACCOUNT SECURITY
    ========================= */

    const lockAccount = async (data: LockAccountData) => {
        console.log("lock account:", data);
    };

    const unlockAccount = async (data: UnlockAccountData) => {
        console.log("unlock account:", data);
    };



    /* =========================
       PROVIDER VALUE
    ========================= */

    return (
        <AuthContext.Provider
            value={{
                init,
                isAuthenticated,
                user,
                tokens,

                login,
                signup,
                logout,

                resetPassword,
                changePassword,

                lockAccount,
                unlockAccount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};




/* =========================
   CUSTOM HOOK
========================= */

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};