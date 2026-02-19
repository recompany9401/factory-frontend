import React from "react";
import "./MyPage.css";

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

interface MyPageReservationsProps {
  reservations: Reservation[];
  resources: Resource[];
  onCancelReservation: (id: string) => void;
}

const MyPageReservations: React.FC<MyPageReservationsProps> = ({
  reservations,
  resources,
  onCancelReservation,
}) => {
  const getResourceName = (id: string) => {
    const found = resources.find((r) => r.id === id);
    return found ? found.name : "알 수 없는 리소스";
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const formatMoney = (amount: number) => amount.toLocaleString() + "원";

  const statusMap: Record<string, string> = {
    PENDING: "승인 대기",
    CONFIRMED: "예약 확정",
    CANCELLED: "취소됨",
    COMPLETED: "이용 완료",
  };

  return (
    <>
      <h2 className="section-title">나의 예약 관리</h2>
      {reservations.length === 0 ? (
        <div className="empty-card">
          <p>예약 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="reservation-list">
          {reservations.map((rsv) => (
            <div
              key={rsv.id}
              className={`rsv-card ${rsv.status.toLowerCase()}`}
            >
              <div className="rsv-header">
                <span className="rsv-date">
                  신청일: {formatDate(rsv.createdAt)}
                </span>
                <span className={`rsv-badge ${rsv.status}`}>
                  {statusMap[rsv.status]}
                </span>
              </div>

              <div className="rsv-body">
                {rsv.items.map((item) => (
                  <div key={item.id} className="rsv-item-row">
                    <span className="rsv-resource-name">
                      {getResourceName(item.resourceId)}
                    </span>
                    <span className="rsv-time-range">
                      {formatDate(item.startAt)} ~{" "}
                      {formatDate(item.endAt).split(" ")[1]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rsv-footer">
                <div className="rsv-amount">
                  <span>결제 금액</span>
                  <strong>{formatMoney(rsv.totalAmount)}</strong>
                </div>
                {rsv.status === "PENDING" && (
                  <button
                    className="cancel-btn"
                    onClick={() => onCancelReservation(rsv.id)}
                  >
                    예약 취소
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MyPageReservations;
