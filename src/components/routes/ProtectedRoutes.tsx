import { Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';
import { Dashboard } from '../../pages/dashboard/Dashboard';
import { Bills } from '../../pages/bills/Bills';



function ProtectedRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/bills" element={<Bills />} />
            </Route>
        </Routes>
    );
}

export default ProtectedRoutes;