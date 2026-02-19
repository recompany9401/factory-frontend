import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import "../components/mypage/MyPage.css";
import MyPageDashboard from "../components/mypage/MyPageDashboard";
import MyPageReservations from "../components/mypage/MyPageReservations";
import MyPageTax from "../components/mypage/MyPageTax";
import MyPageProfile from "../components/mypage/MyPageProfile";

interface User {
  id: string;
  name: string;
  email: string;
  userType: "PERSONAL" | "BUSINESS";
  companyName?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface ReservationItem {
  id: string;
  resourceId: string;
  startAt: string;
  endAt: string;
}

interface Reservation {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  totalAmount: number;
  items: ReservationItem[];
}

interface Resource {
  id: string;
  name: string;
}

interface ApiErrorResponse {
  message: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        const [notiRes, rsvRes] = await Promise.all([
          axios.get("/api/notifications"),
          axios.get("/api/reservations/my"),
        ]);

        setNotifications(notiRes.data.notifications);
        setReservations(rsvRes.data);

        try {
          setResources([
            { id: "uuid-1", name: "3D 프린터실" },
            { id: "uuid-2", name: "레이저 커팅실" },
            { id: "uuid-3", name: "CNC 가공실" },
          ]);
        } catch (e) {
          console.warn(e);
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleReadNotification = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!window.confirm("정말로 예약을 취소하시겠습니까?")) return;
    try {
      await axios.post(`/api/reservations/${id}/cancel`);
      alert("예약이 취소되었습니다.");
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "CANCELLED" } : r)),
      );
    } catch (error) {
      console.error(error);

      let errorMessage = "취소 실패";
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<ApiErrorResponse>;
        if (err.response?.data?.message) {
          errorMessage = `취소 실패: ${err.response.data.message}`;
        }
      }
      alert(errorMessage);
    }
  };

  const stats = {
    pending: reservations.filter((r) => r.status === "PENDING").length,
    confirmed: reservations.filter((r) => r.status === "CONFIRMED").length,
    cancelled: reservations.filter((r) => r.status === "CANCELLED").length,
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>로딩 중...</div>
    );

  return (
    <div className="mypage-wrapper">
      <div className="mypage-container">
        <aside className="mypage-menu">
          <div className="menu-profile">
            <div className="profile-avatar">{user?.name}</div>
            <div>
              <h3 className="profile-name">{user?.name} 님</h3>
              <p className="profile-type">
                {user?.userType === "BUSINESS"
                  ? user?.companyName
                  : "개인 회원"}
              </p>
            </div>
          </div>
          <nav className="menu-list">
            <button
              className={`menu-btn ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              대시보드
            </button>
            <button
              className={`menu-btn ${activeTab === "reservation" ? "active" : ""}`}
              onClick={() => setActiveTab("reservation")}
            >
              예약 관리
            </button>
            {user?.userType === "BUSINESS" && (
              <button
                className={`menu-btn ${activeTab === "tax" ? "active" : ""}`}
                onClick={() => setActiveTab("tax")}
              >
                세금계산서 관리
              </button>
            )}
            <button
              className={`menu-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              회원 정보 수정
            </button>
          </nav>
        </aside>

        <main className="mypage-main">
          {activeTab === "dashboard" && (
            <MyPageDashboard
              stats={stats}
              notifications={notifications}
              onReadNotification={handleReadNotification}
            />
          )}

          {activeTab === "reservation" && (
            <MyPageReservations
              reservations={reservations}
              resources={resources}
              onCancelReservation={handleCancelReservation}
            />
          )}

          {activeTab === "tax" && <MyPageTax />}
          {activeTab === "profile" && <MyPageProfile />}
        </main>
      </div>
    </div>
  );
};

export default MyPage;
