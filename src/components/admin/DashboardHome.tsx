import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Calendar,
  Clock,
  Box,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Megaphone,
  CalendarCheck,
  CalendarDays,
  Settings,
} from "lucide-react";
import "./DashboardHome.css";

interface DashboardData {
  counts: {
    totalUsers: number;
    pendingReservations: number;
    todayReservations: number;
    activeResources: number;
  };
  recentReservations: {
    id: string;
    status: "PENDING" | "APPROVED" | "CANCELLED" | "COMPLETED";
    usageDate: string;
    appliedAt: string;
    user: { name: string; email: string };
    resource?: { name: string };
  }[];
  chartData: {
    name: string;
    count: number;
  }[];
}

const DashboardHome: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard");
        setData(res.data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="dashboard-loading">데이터 분석 중...</div>;
  if (!data)
    return <div className="dashboard-error">데이터를 불러올 수 없습니다.</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>관리자 대시보드</h2>
          <p className="current-date">
            현재 팝업 팩토리의 운영 현황입니다. (
            {new Date().toLocaleDateString()} 기준)
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-icon-wrapper orange">
            <Clock size={24} color="#f97316" />
          </div>
          <div className="stat-content">
            <span className="stat-label">승인 대기</span>
            <div className="stat-value-row">
              <span className="stat-value">
                {data.counts.pendingReservations}
              </span>
              <span className="stat-unit">건</span>
            </div>
            <Link to="/admin/reservations" className="stat-link">
              관리하기 &rarr;
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Calendar size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <span className="stat-label">오늘의 이용</span>
            <span className="stat-value">{data.counts.todayReservations}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <Users size={24} color="#10b981" />
          </div>
          <div className="stat-content">
            <span className="stat-label">총 회원 수</span>
            <span className="stat-value">{data.counts.totalUsers}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Box size={24} color="#8b5cf6" />
          </div>
          <div className="stat-content">
            <span className="stat-label">운영 자원</span>
            <span className="stat-value">{data.counts.activeResources}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main-layout">
        <div className="layout-left">
          <div className="dashboard-section chart-section">
            <h3>월별 예약 현황</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    name="예약 건수"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-section recent-section">
            <div className="board-section-header">
              <h3>최근 예약 신청</h3>
              <Link to="/admin/reservations" className="more-link">
                전체보기 <ArrowRight size={14} />
              </Link>
            </div>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>신청자</th>
                  <th>이용 장소</th>
                  <th>이용 예정일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {data.recentReservations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-row">
                      예약 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  data.recentReservations.map((res) => (
                    <tr key={res.id}>
                      <td className="user-cell">
                        <span className="user-name">{res.user.name}</span>
                        <span className="user-email">{res.user.email}</span>
                      </td>
                      <td>{res.resource?.name || "삭제된 자원"}</td>
                      <td>{res.usageDate}</td>
                      <td>
                        <span className={`status-badge ${res.status}`}>
                          {res.status === "PENDING"
                            ? "대기"
                            : res.status === "APPROVED"
                              ? "승인"
                              : res.status === "CANCELLED"
                                ? "취소"
                                : "완료"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="layout-right">
          <div className="dashboard-section quick-actions">
            <h3>바로가기</h3>
            <div className="action-grid">
              <Link to="/admin/contents" className="action-item">
                <div className="action-icon orange">
                  <Megaphone size={24} color="#f97316" />
                </div>
                <span className="text">공지사항 작성</span>
              </Link>

              <Link to="/admin/reservations" className="action-item">
                <div className="action-icon green">
                  <CalendarCheck size={24} color="#10b981" />
                </div>
                <span className="text">예약 승인</span>
              </Link>

              <Link to="/admin/schedules" className="action-item">
                <div className="action-icon blue">
                  <CalendarDays size={24} color="#3b82f6" />
                </div>
                <span className="text">일정 관리</span>
              </Link>

              <Link to="/admin/resources" className="action-item">
                <div className="action-icon purple">
                  <Settings size={24} color="#8b5cf6" />
                </div>
                <span className="text">장비 관리</span>
              </Link>
            </div>
          </div>

          <div className="dashboard-section system-status">
            <h3>시스템 상태</h3>
            <div className="status-row">
              <div className="status-label">
                <CheckCircle size={16} color="#10b981" /> 서버 상태
              </div>
              <span className="status-value safe">정상 가동 중</span>
            </div>
            <div className="status-row">
              <div className="status-label">
                <AlertCircle size={16} color="#f97316" /> DB 연결
              </div>
              <span className="status-value safe">연결됨</span>
            </div>
            <div className="status-info-box">
              <p>
                현재 <strong>Pop-up Factory Admin</strong>
              </p>
              <p>v1.0.0 (Stable)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
