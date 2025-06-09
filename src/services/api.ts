import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";

import { AuthTokenError } from "./errors/AuthTokenError";
import { signOut } from "../contexts/AuthContext";

export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            Authorization: `Bearer ${cookies['@unipizza.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if (error.response.status === 401) {
            //Qualquer erro 401(Não autorizado) deve deslogar o usuário.
            if (typeof window !== undefined) {
                //Chama a função para deslogar o usuário.
                signOut();
            } else {
                return Promise.reject(new AuthTokenError());
            }
        }

        return Promise.reject(error);
    })

    return api;
}
