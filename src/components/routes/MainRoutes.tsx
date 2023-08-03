import { UserAuth, useUserAuth } from "../../contexts/AuthContext"
import LogRoutes from "./LogRoutes";
import ProtectedRoutes from "./ProtectedRoutes";


export const MainRoutes = () => {
    const { userLogged } = useUserAuth() as UserAuth;

    if (!userLogged) {
        return <LogRoutes />;
    }

    return <ProtectedRoutes />;
};