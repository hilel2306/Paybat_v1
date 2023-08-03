/* eslint-disable */
// ignore all ts errors in this file
// FIXME remove this once refactor is done
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient.js';

export interface User {
    id: string;
    email: string;

    // Ajoutez d'autres propriétés spécifiques de l'utilisateur ici
}

export type UserAuth = {
    logOut: () => void;
    userLogged: User | null;
    loading: boolean;
    // Autres propriétés ou méthodes si nécessaire
};

const UserAuthContext = createContext();


export default function AuthContextProvider({ children }) {
    const [userLogged, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<User | null>(true);
    const navigate = useNavigate();

    const logIn = async (email, password) => {
        try {
            let { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            console.log("SIGN IN RESPONSE =>", { data, error }); // Ajoutez cette ligne
            if (error) {
                console.error('Erreur lors de la connexion:', error.message);
                // Gérer les erreurs de connexion
            } else {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error.message);
            // Gérer les erreurs de connexion
        }
    };

    const signUp = async (email, password) => {
        try {
            let { data, error } = await supabase.auth.signUp({
                email,
                password
            })
            if (error) {
                console.error('Erreur lors de l\'inscription:', error.message);
                // Gérer les erreurs de connexion
            } else {
                setUser(user);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error.message);
            // Gérer les erreurs de connexion
        }
    };

    const logOut = async () => {
        try {
            let { data, error } = await supabase.auth.signOut();
            if (error) {
                console.error('Erreur lors de la déconnexion:', error.message);
                // Gérer les erreurs de connexion
            } else {
                setUser(null); // Réinitialisez l'utilisateur à null après la déconnexion

            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error.message);
            // Gérer les erreurs de connexion
        }
    };


    useEffect(() => {
        const setData = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            setUser(session?.user);
            setLoading(false);
        };

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user);
            setLoading(false);
        });

        setData();

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);


    return (
        <UserAuthContext.Provider value={{ userLogged, logIn, signUp, logOut }}>
            {!loading && children}
        </UserAuthContext.Provider>
    );
}

export function useUserAuth() {
    return useContext(UserAuthContext);
}
