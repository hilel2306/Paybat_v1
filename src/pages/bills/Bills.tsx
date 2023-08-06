import { Container } from "@mui/material"
import { TitlePage } from "../../components/titlePage/TitlePage"
import BillsTable from "../../components/billsTable/BillsTable"



export const Bills = () => {


    return (
        <Container>
            <TitlePage title={"Factures"} />
            <BillsTable />
        </Container>
    )
}