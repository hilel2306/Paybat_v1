import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInSide from './pages/signin/Signin'
import Layout from './components/layout/Layout';
import AuthContextProvider from './contexts/AuthContext';


import { Component, ErrorInfo } from 'react';
import { Dashboard } from './pages/dashboard/Dashboard';

// Composant ErrorBoundary personnalisé
class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Affiche un message d'erreur personnalisé ou un composant de remplacement
      return <div>Une erreur est survenue. Veuillez réessayer plus tard. </div>;
    }

    // Renvoie les enfants normalement si aucune erreur n'est survenue
    return this.props.children;
  }
}


function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/">
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<SignInSide />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
