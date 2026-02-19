import React, { useRef, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import axios from "axios";
import "./LoginPage.css";

interface ApiErrorResponse {
  message: string;
}

const LoginPage: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(cardRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2,
      });
    });
    return () => ctx.revert();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity || !password) {
      alert("아이디(이메일)와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", {
        identity,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (user.userRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as ApiErrorResponse;
        const message = errorData?.message || "로그인에 실패했습니다.";
        alert(message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="login-page">
      <div ref={cardRef} className="login-card">
        <div className="login-header">
          <h1 className="login-title">LOGIN</h1>
          <p className="login-desc">서비스 이용을 위해 로그인을 해주세요.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">이메일</label>
            <input
              type="text"
              className="login-input"
              placeholder="이메일을 입력하세요"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">비밀번호</label>
            <input
              type="password"
              className="login-input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>로그인 상태 유지</span>
            </label>
            <a href="#" className="find-pw-link">
              비밀번호 찾기
            </a>
          </div>

          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>

        <div className="signup-link-area">
          아직 회원이 아니신가요?
          <Link to="/signup" className="signup-link">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
