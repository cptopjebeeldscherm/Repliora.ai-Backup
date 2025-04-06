import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

// Layouts
import DashboardLayout from "./components/DashboardLayout";
import AdminLayout from "./components/admin/AdminLayout";
import PublicLayout from "./components/PublicLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserManagement from "./components/admin/UserManagement";

// Context
import { EmailSettingsProvider } from "./context/EmailSettingsContext";
import { ThemeProvider } from "./context/ThemeContext";

// Protected Pages
import EmailAutomation from "./components/EmailAutomation";
import EmailCredentials from "./components/EmailCredentials";
import AccountSettings from "./components/AccountSettings";
import Analytics from "./components/Analytics";
import FAQManager from "./components/FAQManager";
import SelfLearningFAQ from "./components/SelfLearningFAQ";
import UnansweredEmails from "./components/UnansweredEmails";
import AnsweredEmails from "./components/AnsweredEmails";
import ConfidenceTuning from "./components/ConfidenceTuning";
import AutoReplyScheduling from "./components/AutoReplyScheduling";
import AutoSyncWithEmail from "./components/AutoSyncWithEmail";
import ShippingLookup from "./components/ShippingLookup";
import ShopifyIntegration from "./components/ShopifyIntegration";
import Settings from "./components/Settings";
import LogsActivityHistory from "./components/LogsActivityHistory";
import ManualReplyConsole from "./components/ManualReplyConsole";
import HelpDocumentation from "./components/HelpDocumentation";
import NotificationCenter from "./components/NotificationCenter";

// Auth Pages
import Register from "./components/Register";
import Login from "./components/Login";

// Public Pages
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import FaqPage from "./pages/FaqPage";
import Features from "./pages/Features";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    const role = localStorage.getItem("user_role");
    setUserId(id);
    setUserRole(role);
    setLoading(false); // ✅ Wait before rendering routes
  }, []);

  const handleAuthSuccess = (id, role) => {
    localStorage.setItem("user_id", id);
    localStorage.setItem("user_role", role);
    setUserId(id);
    setUserRole(role);
    window.location.href = role === "admin" ? "/admin" : "/dashboard";
  };

  // ⏳ Wait before rendering to avoid hydration issues
  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <EmailSettingsProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* 🌐 Public Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/support" element={<Support />} />
              <Route path="/faqs" element={<FaqPage />} />
              <Route path="/features" element={<Features />} />
            </Route>

            {/* 🔐 Auth */}
            <Route path="/login" element={<Login onLogin={handleAuthSuccess} />} />
            <Route path="/register" element={<Register onRegister={handleAuthSuccess} />} />

            {/* 🛡️ User Dashboard */}
            {userId && (userRole === "user" || userRole === "admin") && (
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Analytics />} />
                <Route path="email-automation" element={<EmailAutomation />} />
                <Route path="email-credentials" element={<EmailCredentials />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="faq-manager" element={<FAQManager />} />
                <Route path="self-learning-faq" element={<SelfLearningFAQ />} />
                <Route path="unanswered-emails" element={<UnansweredEmails />} />
                <Route path="answered-emails" element={<AnsweredEmails />} />
                <Route path="confidence-tuning" element={<ConfidenceTuning />} />
                <Route path="auto-reply-scheduling" element={<AutoReplyScheduling />} />
                <Route path="auto-sync" element={<AutoSyncWithEmail />} />
                <Route path="shipping-lookup" element={<ShippingLookup />} />
                <Route path="shopify-integration" element={<ShopifyIntegration />} />
                <Route path="settings" element={<Settings />} />
                <Route path="logs" element={<LogsActivityHistory />} />
                <Route path="manual-reply" element={<ManualReplyConsole />} />
                <Route path="help" element={<HelpDocumentation />} />
                <Route path="notifications" element={<NotificationCenter />} />
              </Route>
            )}

            {/* 🔐 Admin Dashboard */}
            {userId && userRole === "admin" && (
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="user-management" element={<UserManagement />} />
              </Route>
            )}

            {/* 🚫 Catch-all */}
            {!userId && <Route path="*" element={<Navigate to="/login" />} />}
          </Routes>
        </Router>
      </ThemeProvider>
    </EmailSettingsProvider>
  );
}
