import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./AdminSidebar.css";

interface AdminSidebarProps {
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  return (
    <aside className="admin-sidebar">
      <Link to="/" className="sidebar-brand">
        HOME
      </Link>

      <nav className="sidebar-menu">
        <NavLink to="/admin" end>
          대시보드
        </NavLink>

        <NavLink to="/admin/reservations">예약 관리</NavLink>

        <NavLink to="/admin/users">회원 관리</NavLink>

        <NavLink to="/admin/resources">섹션 및 장비 관리</NavLink>

        <NavLink to="/admin/schedules">일정 관리</NavLink>

        <NavLink to="/admin/contents">게시글 및 팝업 관리</NavLink>
      </nav>

      <button className="sidebar-logout" onClick={onLogout}>
        로그아웃
      </button>
    </aside>
  );
};

export default AdminSidebar;
