import { Container } from "@mui/material"
import { TitlePage } from "../../components/titlePage/TitlePage"
import { UserAuth, useUserAuth } from "../../contexts/AuthContext"




export const Dashboard = () => {
    const { logOut, userLogged } = useUserAuth() as UserAuth;

    return (
        <Container>
            <TitlePage title={"Tableau de bord"} />
            <h3>hello {userLogged?.email}</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid omnis temporibus, minima ea consectetur suscipit a odit autem, voluptatum, accusamus quidem. Itaque exercitationem corrupti ex quasi quae delectus ipsam quia!</p>
            <button onClick={logOut}>Déconnexion</button>
        </Container>
    )
}