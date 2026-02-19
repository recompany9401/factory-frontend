import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyPage.css";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  userType: "PERSONAL" | "BUSINESS";
  companyName?: string;
}

interface ApiErrorResponse {
  message: string;
  issues?: Array<{ path: string[]; message: string }>;
}

const MyPageProfile: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    userType: "PERSONAL",
    companyName: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("/api/auth/me");
        setProfile(res.data.user);
      } catch (error) {
        console.error("유저 정보 로딩 실패", error);
        const stored = localStorage.getItem("user");
        if (stored) setProfile(JSON.parse(stored));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword) {
      if (passwords.newPassword.length < 6) {
        alert("새 비밀번호는 최소 6자 이상이어야 합니다.");
        return;
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }
      if (!passwords.currentPassword) {
        alert("정보 보호를 위해 현재 비밀번호를 입력해주세요.");
        return;
      }
    }

    if (profile.name.length < 2) {
      alert("이름은 최소 2자 이상이어야 합니다.");
      return;
    }

    try {
      const payload = {
        name: profile.name,
        phone: profile.phone || "",

        ...(profile.userType === "BUSINESS"
          ? { companyName: profile.companyName || "" }
          : {}),

        ...(passwords.newPassword
          ? {
              currentPassword: passwords.currentPassword,
              newPassword: passwords.newPassword,
            }
          : {}),
      };

      const res = await axios.patch("/api/auth/me", payload);

      alert("회원 정보가 수정되었습니다.");

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("수정 실패:", error);

      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ApiErrorResponse;

        if (data.issues && Array.isArray(data.issues)) {
          const firstIssue = data.issues[0];
          alert(
            `입력값 오류: ${firstIssue.path.join(".")} - ${firstIssue.message}`,
          );
        } else if (data.message) {
          alert(data.message);
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
        }
      } else {
        alert("서버와 통신 중 오류가 발생했습니다.");
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleWithdrawal = async () => {
    if (
      window.confirm("정말로 탈퇴하시겠습니까? 탈퇴 시 모든 정보가 삭제됩니다.")
    ) {
      try {
        await axios.delete("/api/auth/me");
        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      } catch (error) {
        console.error("탈퇴 실패", error);
        alert("회원 탈퇴에 실패했습니다.");
      }
    }
  };

  if (loading) return <div className="simple-card">로딩 중...</div>;

  return (
    <>
      <h2 className="section-title">회원 정보 수정</h2>
      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>이메일 (변경 불가)</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="input-disabled"
            />
          </div>

          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>전화번호</label>
            <input
              type="text"
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              placeholder="010-0000-0000"
            />
          </div>

          {profile.userType === "BUSINESS" && (
            <div className="form-group">
              <label>회사/단체명</label>
              <input
                type="text"
                name="companyName"
                value={profile.companyName || ""}
                onChange={handleChange}
              />
            </div>
          )}

          <hr className="divider" />

          <h3 className="sub-title">비밀번호 변경</h3>
          <p className="sub-desc">비밀번호를 변경하지 않으려면 비워두세요.</p>

          <div className="form-group">
            <label>현재 비밀번호</label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="변경 시 입력"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>새 비밀번호</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label>새 비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              저장하기
            </button>
          </div>
        </form>

        <div className="account-actions">
          <button type="button" className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
          <span className="divider-vertical">|</span>
          <button
            type="button"
            className="withdraw-btn"
            onClick={handleWithdrawal}
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </>
  );
};

export default MyPageProfile;
