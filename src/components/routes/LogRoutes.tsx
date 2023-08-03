import { Route, Routes } from 'react-router-dom';
import SignInSide from '../../pages/signin/Signin'
import SignUpSide from '../../pages/signUp/SignUp';



function LogRoutes() {
    return (
        <Routes>
            <Route path="/" element={<SignInSide />} />
            <Route path="/signup" element={<SignUpSide />} />
        </Routes>
    );
}

export default LogRoutes;