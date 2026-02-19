import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import ServicePage from "./pages/ServicePage";
import FactoryPage from "./pages/FactoryPage";
import ScrollToTop from "./components/ScrollToTop";
import PolicyPage from "./pages/PolicyPage";
import NewsPage from "./pages/NewsPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import Admin from "./pages/Admin";
import DashboardHome from "./components/admin/DashboardHome";
import ReservationList from "./components/admin/ReservationList";
import ResourceManagement from "./components/admin/ResourceManagement";
import ScheduleManagement from "./components/admin/ScheduleManagement";
import UserManagement from "./components/admin/UserManagement";
import ContentsManagement from "./components/admin/ContentsManagement";
import PolicyDetail from "./components/policy/PolicyDetail";
import NewsDetail from "./components/news/NewsDetail";
import ReservationPage from "./pages/ReservationPage";

import "./App.css";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPath && <Header />}
      {children}
      {!isAdminPath && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/factory" element={<FactoryPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/policy/:id" element={<PolicyDetail />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/reservation" element={<ReservationPage />} />

          <Route path="/admin" element={<Admin />}>
            <Route index element={<DashboardHome />} />
            <Route path="reservations" element={<ReservationList />} />
            <Route path="resources" element={<ResourceManagement />} />
            <Route path="schedules" element={<ScheduleManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="contents" element={<ContentsManagement />} />
          </Route>

          <Route
            path="*"
            element={
              <div style={{ padding: "100px", textAlign: "center" }}>
                페이지를 찾을 수 없습니다.
              </div>
            }
          />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
