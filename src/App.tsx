import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExpenseDashboard from './components/expenses/ExpenseDashboard';
import IncomeDashboard from './components/income/IncomeDashboard';
import InvoiceDashboard from './components/invoices/InvoiceDashboard';
import CustomInvoices from './components/invoices/CustomInvoices';
import HelpPage from './components/HelpPage';

function App() {
  return (
    <HelmetProvider>
      <FinanceProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<ExpenseDashboard />} />
              <Route path="/income" element={<IncomeDashboard />} />
              <Route path="/invoices" element={<InvoiceDashboard />} />
              <Route path="/custom-invoices" element={<CustomInvoices />} />
              <Route path="/help" element={<HelpPage />} />
            </Routes>
          </Layout>
        </Router>
      </FinanceProvider>
    </HelmetProvider>
  );
}

export default App;
