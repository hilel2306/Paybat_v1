import { useEffect, useState } from "react";
import { UserAuth, useUserAuth } from "../../contexts/AuthContext"
import LogRoutes from "./LogRoutes";
import ProtectedRoutes from "./ProtectedRoutes";


export const MainRoutes = () => {
    const { userLogged } = useUserAuth() as UserAuth;
    // const [userChanged, setUserChanged] = useState(false);

    // // Utilisez useEffect pour mettre à jour userChanged à chaque changement de l'utilisateur
    // useEffect(() => {
    //     setUserChanged(true);
    // }, [userLogged]);

    // // Utilisez useEffect avec une dépendance vide pour mettre à jour localement user
    // useEffect(() => {
    //     setUserChanged(false);
    // }, []);


    if (!userLogged) {
        return <LogRoutes />;
    }

    return <ProtectedRoutes />;
};