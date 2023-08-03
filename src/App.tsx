import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from './contexts/AuthContext';
import { MainRoutes } from './components/routes/MainRoutes';



function App() {


  return (
    <BrowserRouter basename="/">
      <AuthContextProvider>
        <MainRoutes />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
