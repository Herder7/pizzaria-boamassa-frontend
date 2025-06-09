import { createContext, ReactNode, useState, useEffect } from "react";

import { api } from "../services/apiClients";

import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";

import { toast } from 'react-toastify';

type UserProps = {
    id: string;
    name: string;
    email: string;
    perfil: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
    perfil: string;
}

export const AuthContext = createContext({} as AuthContextData);

export async function signOut() {
    try {
        await api.put('/user/logout');
        destroyCookie(undefined, '@unipizza.token');
        Router.push('/');
    } catch (error) {
        toast.error('Erro ao tentar deslogar o usuário! ' + 'Erro: ' + error, {
            theme: 'dark'
        });
    }
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;

    useEffect(() => {
        //Tentar pegar o token no cookie
        const { '@unipizza.token': token } = parseCookies();

        if (token) {
            api.get('/userinfo').then(response => {
                const { id, name, email, perfil } = response.data;

                setUser({
                    id,
                    name,
                    email,
                    perfil
                });
            }).catch(() => {
                //Se deu erro, deslogamos o usuário.
                signOut();
            })
        }

    }, []);

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session', {
                email,
                password,
            })

            const { id, name, perfil, token } = response.data;

            setCookie(undefined, '@unipizza.token', token, {
                maxAge: 60 * 60 * 24 * 30, //Expirar em 1 mês
                path: '/'
            });

            setUser({
                id,
                name,
                email,
                perfil
            });

            //Passar para as próximas requisições o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            toast.success('Logado com sucesso! Bem-vindo ' + name, {
                theme: 'dark'
            });

            //Redirecionar o user para a página Dashboard
            Router.push('/dashboard');
        } catch (error) {
            toast.error('Erro ao acessar! ' + 'Erro: ' + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    async function signUp({ name, email, password, perfil }: SignUpProps) {
        try {
            const response = await api.post('/users', {
                name,
                email,
                password,
                perfil
            });

            toast.success('Cadastro realizado com sucesso!', {
                theme: 'dark'
            });

            Router.push('/');
        } catch (error) {
            toast.error('Erro ao realizar o cadastro! ' + 'Erro: ' + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}