import './App.css'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LoginPage from "./pages/LoginPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ProcessStepsPage from "./pages/ProcessStepsPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import FaqsPage from "./pages/FaqsPage.jsx";
import ContactsPage from "./pages/ContactsPage.jsx";
import QuoteRequestsPage from "./pages/QuoteRequestsPage.jsx";
import AdminLayout from './components/layout/AdminLayout.jsx'
import PageTransition from './components/layout/PageTransition.jsx'

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function Authed({ children }) {
  const location = useLocation()
  return (
    <RequireAuth>
      <AdminLayout>
        <PageTransition routeKey={location.pathname}>{children}</PageTransition>
      </AdminLayout>
    </RequireAuth>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/services"
          element={
            <Authed>
              <ServicesPage />
            </Authed>
          }
        />
        <Route
          path="/process-steps"
          element={
            <Authed>
              <ProcessStepsPage />
            </Authed>
          }
        />
        <Route
          path="/stats"
          element={
            <Authed>
              <StatsPage />
            </Authed>
          }
        />
        <Route
          path="/news"
          element={
            <Authed>
              <NewsPage />
            </Authed>
          }
        />
        <Route
          path="/faqs"
          element={
            <Authed>
              <FaqsPage />
            </Authed>
          }
        />
        <Route
          path="/contacts"
          element={
            <Authed>
              <ContactsPage />
            </Authed>
          }
        />
        <Route
          path="/quote-requests"
          element={
            <Authed>
              <QuoteRequestsPage />
            </Authed>
          }
        />
        <Route path="/" element={<Navigate to="/services" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
