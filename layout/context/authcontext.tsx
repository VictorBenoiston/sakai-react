// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import https from 'https'



const agent = new https.Agent({
    rejectUnauthorized: false
});


type AuthContext = {
    token: string | null;
    user: string | null;
    permission: string | null;
    authenticated: boolean;
    loginAuth: (request: { email: string; senha: string }) => Promise<any>;
    login: (token: string, user: string, permission: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContext | null | any>(null);

export const AuthProvider = ({ children }: any) => {
    const router = useRouter()
    const [token, setToken] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [permission, setPermission] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);



    const authenticatedAuth = () => {
        const token = String(localStorage.getItem('token_flair_health'))
        if (token == 'null'){
            router.push('/auth/login')
            return false;
        }
        const decodedToken: JwtPayload = jwtDecode(token)

        const currentTime = new Date().getTime() / 1000
        if (decodedToken.exp) {
            if (decodedToken.exp < currentTime || token == 'null') {
                router.push('/auth/login')
                return false;
            }
        }
        return true;
    }


    const loginAuth = async (request: any) => {

        if (!request.email || !request.password) {
            return
        }

        try {

            const response: any = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/signIn`, {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error('Response not ok')
            }

            const result = await response.json();

            console.log(result)

            localStorage.setItem('token_flair_health', result.accessToken)
            localStorage.setItem('user', result.user)
            localStorage.setItem('uid', result.uid)
            setToken(result.accessToken);
            setUser(result.user);
            setPermission(result.permission);
            authenticatedAuth()
            console.log('Sucesso:');
            return result
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        console.log('logout')
        localStorage.clear();
    };


    return (
        <AuthContext.Provider value={{
            token,
            user,
            permission,
            loginAuth,
            logout,
            isAuthenticated,
            authenticatedAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
