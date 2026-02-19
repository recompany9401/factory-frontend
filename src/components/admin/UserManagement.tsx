import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./UserManagement.css";

interface ReservationItem {
  resource: {
    name: string;
  };
}

interface RecentReservation {
  id: string;
  status: string;
  createdAt: string;
  items: ReservationItem[];
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isBlacklisted: boolean;
  adminMemo: string | null;
  totalReservations: number;
  noShowCount: number;
  recentReservations: RecentReservation[];
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [memoInput, setMemoInput] = useState("");
  const [blacklistStatus, setBlacklistStatus] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/users", {
        params: { page, limit: 10, search },
      });
      setUsers(res.data.data);
      setTotalPages(res.data.meta.lastPage);
    } catch (error) {
      console.error("회원 목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openDetail = (user: User) => {
    setSelectedUser(user);
    setMemoInput(user.adminMemo || "");
    setBlacklistStatus(user.isBlacklisted);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    try {
      await axios.patch(`/api/admin/users/${selectedUser.id}`, {
        isBlacklisted: blacklistStatus,
        adminMemo: memoInput,
      });
      alert("회원 정보가 수정되었습니다.");
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div className="admin-content-wrapper">
      <div className="admin-header-section">
        <h2>회원 관리</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="이름, 이메일, 연락처 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="loading-spinner">로딩 중...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>연락처</th>
                <th>이메일</th>
                <th>총 예약</th>
                <th>No-Show</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-row">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className={user.isBlacklisted ? "blocked-row" : ""}
                  >
                    <td className="font-bold">{user.name}</td>
                    <td>{user.phone || "-"}</td>
                    <td>{user.email}</td>
                    <td>{user.totalReservations}회</td>
                    <td className={user.noShowCount > 0 ? "text-danger" : ""}>
                      {user.noShowCount}회
                    </td>
                    <td>
                      {user.isBlacklisted ? (
                        <span className="status-tag cancelled">차단됨</span>
                      ) : (
                        <span className="status-tag confirmed">정상</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => openDetail(user)}
                      >
                        상세/관리
                      </button>
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
          &lt;
        </button>
        <span>
          {page} / {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          &gt;
        </button>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div
            className="modal-window detail-modal user-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>회원 상세 정보</h3>
              <button className="close-x" onClick={() => setSelectedUser(null)}>
                &times;
              </button>
            </div>

            <div className="detail-content scrollable">
              <div className="info-grid">
                <div className="detail-item">
                  <label>이름</label>
                  <p>{selectedUser.name}</p>
                </div>
                <div className="detail-item">
                  <label>이메일</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="detail-item">
                  <label>연락처</label>
                  <p>{selectedUser.phone || "-"}</p>
                </div>
                <div className="detail-item">
                  <label>상태</label>
                  <p
                    className={blacklistStatus ? "text-danger" : "text-success"}
                  >
                    {blacklistStatus ? "블랙리스트" : "정상 회원"}
                  </p>
                </div>
              </div>

              <hr />

              <div className="admin-actions-area">
                <h4>이용 제한 설정</h4>
                <div className="toggle-wrapper">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={blacklistStatus}
                      onChange={(e) => setBlacklistStatus(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span
                    className={`toggle-label ${blacklistStatus ? "danger" : ""}`}
                  >
                    {blacklistStatus
                      ? "예약 차단 (Blacklist)"
                      : "정상 이용 가능"}
                  </span>
                </div>

                <h4>관리자 메모 (비공개)</h4>
                <textarea
                  className="memo-textarea"
                  placeholder="회원 특이사항 기록 (사용자에게 보이지 않습니다)"
                  value={memoInput}
                  onChange={(e) => setMemoInput(e.target.value)}
                />
              </div>

              <hr />

              <div className="recent-history">
                <h4>최근 예약 이력 (5건)</h4>
                <ul>
                  {selectedUser.recentReservations.length === 0 ? (
                    <li>이력이 없습니다.</li>
                  ) : (
                    selectedUser.recentReservations.map((res) => (
                      <li key={res.id}>
                        <span
                          className={`dot ${
                            res.status === "NOSHOW"
                              ? "noshow"
                              : res.status === "CONFIRMED"
                                ? "confirmed"
                                : res.status === "CANCELLED"
                                  ? "cancelled"
                                  : "pending"
                          }`}
                        ></span>
                        <span className="res-date">
                          {new Date(res.createdAt).toLocaleDateString()}
                        </span>
                        <span className="res-item">
                          {res.items[0]?.resource.name || "삭제된 리소스"}
                        </span>
                        <span className="res-status">{res.status}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setSelectedUser(null)}
              >
                취소
              </button>
              <button className="save-btn" onClick={handleSaveChanges}>
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
