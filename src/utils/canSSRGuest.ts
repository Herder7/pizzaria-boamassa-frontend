import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

//Função para páginas que só pode ser ecessadas por visitantes.
export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
    return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(context);

        //Se tentar acessar a página tendo um login realizado, devemos redirecionar
        const token = cookies['@unipizza.token'];

        if (token) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

        return await fn(context);
    }
}