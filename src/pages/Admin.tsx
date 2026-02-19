import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./Admin.css";
import AdminSidebar from "../components/admin/AdminSidebar";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const isAdmin = user?.userRole === "ADMIN";
    if (!user || !isAdmin) {
      alert("관리자 권한이 없습니다.");
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
