import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./ReservationList.css";

interface Reservation {
  id: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  resourceName: string;
  startTime: string;
  insuranceDocUrl: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  rejectReason?: string;
}

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Reservation | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetRejectId, setTargetRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const response = await axios.get("/api/admin/reservations", { params });
      setReservations(response.data.data);
      setTotalPages(response.data.meta.lastPage);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [page, startDate, endDate]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const filteredData = reservations.filter((res) => {
    const matchesStatus = filterStatus === "ALL" || res.status === filterStatus;
    const matchesSearch =
      res.userName.includes(searchTerm) ||
      res.resourceName.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleApprove = async (id: string) => {
    if (!window.confirm("이 예약을 승인하시겠습니까?")) return;
    try {
      await axios.patch(`/api/admin/reservations/${id}/status`, {
        status: "CONFIRMED",
      });
      alert("승인되었습니다.");
      fetchReservations();
    } catch (e) {
      console.error(e);
      alert("처리 실패");
    }
  };

  const openRejectModal = (id: string) => {
    setTargetRejectId(id);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!targetRejectId || !rejectReason)
      return alert("반려 사유를 입력해주세요.");
    try {
      await axios.patch(`/api/admin/reservations/${targetRejectId}/status`, {
        status: "CANCELLED",
        reason: rejectReason,
      });
      alert("반려 처리되었습니다.");
      setRejectModalOpen(false);
      fetchReservations();
    } catch (e) {
      console.error(e);
      alert("처리 실패");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="admin-content-wrapper">
      <div className="admin-header-section">
        <h2>예약 관리</h2>

        <div className="admin-controls-top">
          <div className="date-range-picker">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              className="reset-btn"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              초기화
            </button>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="이름/장비 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
            <button
              key={status}
              className={filterStatus === status ? "active" : ""}
              onClick={() => setFilterStatus(status)}
            >
              {status === "ALL"
                ? "전체"
                : status === "PENDING"
                  ? "대기"
                  : status === "CONFIRMED"
                    ? "승인"
                    : "반려"}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="loading-spinner">로딩 중...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>예약자</th>
                <th>장비/공간</th>
                <th>예약 시간</th>
                <th>산재보험</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-row">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredData.map((res) => (
                  <tr key={res.id}>
                    <td>
                      <span
                        className="user-name-link"
                        onClick={() => setSelectedUser(res)}
                        title="클릭하여 상세 정보 확인"
                      >
                        {res.userName}
                      </span>
                    </td>
                    <td>{res.resourceName}</td>
                    <td className="date-cell">{formatDate(res.startTime)}</td>
                    <td>
                      {res.insuranceDocUrl ? (
                        <button
                          className="view-btn"
                          onClick={() => setSelectedImg(res.insuranceDocUrl)}
                        >
                          보기
                        </button>
                      ) : (
                        <span className="text-gray">미제출</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-tag ${res.status.toLowerCase()}`}
                      >
                        {res.status === "PENDING"
                          ? "대기"
                          : res.status === "CONFIRMED"
                            ? "승인"
                            : "반려"}
                      </span>
                    </td>
                    <td>
                      {res.status === "PENDING" && (
                        <div className="btn-group">
                          <button
                            onClick={() => handleApprove(res.id)}
                            className="approve-btn"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => openRejectModal(res.id)}
                            className="reject-btn"
                          >
                            반려
                          </button>
                        </div>
                      )}
                      {res.status === "CANCELLED" && res.rejectReason && (
                        <button
                          className="reason-btn"
                          onClick={() =>
                            alert(`반려 사유: ${res.rejectReason}`)
                          }
                        >
                          사유보기
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          &lt; 이전
        </button>
        <span>
          {page} / {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          다음 &gt;
        </button>
      </div>

      {selectedImg && (
        <div className="image-modal" onClick={() => setSelectedImg(null)}>
          <div
            className="modal-content img-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => setSelectedImg(null)}
            >
              &times;
            </button>
            <img src={selectedImg} alt="서류" />
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div
            className="modal-window detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>예약자 상세 정보</h3>
              <button className="close-x" onClick={() => setSelectedUser(null)}>
                &times;
              </button>
            </div>
            <div className="detail-content">
              <div className="detail-item">
                <label>이름</label>
                <p className="detail-value">{selectedUser.userName}</p>
              </div>
              <div className="detail-item">
                <label>연락처</label>
                <p className="detail-value highlight">
                  {selectedUser.userPhone}
                </p>
              </div>
              <div className="detail-item">
                <label>이메일</label>
                <p className="detail-value">{selectedUser.userEmail}</p>
              </div>
              <hr />
              <div className="detail-item">
                <label>예약 ID</label>
                <p className="detail-value text-small">{selectedUser.id}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="save-btn"
                onClick={() => setSelectedUser(null)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setRejectModalOpen(false)}
        >
          <div
            className="modal-window reject-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>반려 사유 입력</h3>
            </div>
            <div className="detail-content">
              <textarea
                className="reject-textarea"
                placeholder="반려 사유를 구체적으로 적어주세요 (예: 서류 식별 불가, 장비 점검 중)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setRejectModalOpen(false)}
              >
                취소
              </button>
              <button className="reject-confirm-btn" onClick={submitReject}>
                반려 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationList;
