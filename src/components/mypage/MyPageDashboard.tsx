import React from "react";
import "./MyPage.css";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface MyPageDashboardProps {
  stats: {
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  notifications: Notification[];
  onReadNotification: (id: string) => void;
}

const MyPageDashboard: React.FC<MyPageDashboardProps> = ({
  stats,
  notifications,
  onReadNotification,
}) => {
  return (
    <>
      <h2 className="section-title">내 활동 요약</h2>

      <div className="summary-bar">
        <div className="summary-item">
          <span className="summary-label">승인 대기</span>
          <span className="summary-count">{stats.pending}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">이용 예정</span>
          <span className="summary-count highlight">{stats.confirmed}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">취소/종료</span>
          <span className="summary-count" style={{ color: "#9ca3af" }}>
            {stats.cancelled}
          </span>
        </div>
      </div>

      <div className="noti-section">
        <div className="noti-header">
          <span>최근 알림</span>
        </div>

        {notifications.length === 0 ? (
          <div
            style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}
          >
            새로운 알림이 없습니다.
          </div>
        ) : (
          <div className="noti-list">
            {notifications.map((noti) => (
              <div
                key={noti.id}
                className={`noti-row ${!noti.isRead ? "unread" : ""}`}
                onClick={() => !noti.isRead && onReadNotification(noti.id)}
              >
                <div className="noti-icon-box">
                  {noti.title.includes("취소") ? "⚠️" : "💬"}
                </div>
                <div className="noti-text">
                  <h4>{noti.title}</h4>
                  <p>{noti.message}</p>
                  <span className="noti-time">
                    {new Date(noti.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyPageDashboard;
