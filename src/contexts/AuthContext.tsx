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

const UserAuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState<User | null>('hilel');
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const logIn = async (email, password) => {
        try {
            const { user, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                console.error('Erreur lors de la connexion:', error.message);
                // Gérer les erreurs de connexion
            } else {
                setUser(user);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error.message);
            // Gérer les erreurs de connexion
        }
    };

    function signUp(email, password) {
        return supabase.auth.signUp({ email, password });
    }

    function logOut() {
        // REDIRECTION SUR PAGE Login
        navigate('/');
        return supabase.auth.signOut();
    }


    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('EVENT =>', event);
                console.log('SESSION =>', session);

                if (event === 'SIGNED_IN') {
                    setUser(session.user);
                    navigate('/dashboard');
                } else {
                    // REDIRECTION SI DECONNECTE
                    navigate('/');
                    setUser(null);
                }
                setLoading(false);
            }
        );

        return () => {

        };
    }, []);

    useEffect(() => {
        // Ici, nous plaçons le console.log(user) dans un useEffect séparé pour s'assurer
        // qu'il est exécuté lorsque le user est mis à jour.
        console.log('USER =>', user);
    }, [user]);

    return (
        <UserAuthContext.Provider value={{ user, session, logIn, signUp, logOut }}>
            {!loading && children}
        </UserAuthContext.Provider>
    );
}

export function useUserAuth() {
    return useContext(UserAuthContext);
}
