import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

interface User {
  id: number;
  email: string;
  name: string;
  userRole?: "USER" | "ADMIN";
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const headerIsScrolled = !isHome || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error("유저 정보 파싱 실패", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkLoginStatus();
  }, [location.pathname]);

  let authLink = "/login";
  let authText = "로그인/회원가입";

  if (user) {
    if (user.userRole === "ADMIN") {
      authLink = "/admin";
      authText = "관리자페이지";
    } else {
      authLink = "/mypage";
      authText = "마이페이지";
    }
  }

  return (
    <header className={`hero__header ${headerIsScrolled ? "scrolled" : ""}`}>
      <div className="hero__header-gradient" />
      <div className="hero__header-inner">
        <Link to="/" className="hero__logo-wrap">
          <img
            src={headerIsScrolled ? "/logo_color.png" : "/logo.png"}
            alt="리컴퍼니 로고"
            className="hero__logo-image"
          />
        </Link>

        <nav className="hero__nav">
          <Link to="/services">서비스 소개</Link>
          <Link to="/factory">공장 소개</Link>
          <Link to="/policy">정부지원·정책</Link>
          <Link to="/news">새소식</Link>
          <Link to="/contact">문의·상담</Link>
        </nav>

        <div className="hero__right">
          <Link to={authLink} className="hero__login">
            <div className="hero__user-avatar">
              <img src="/icon/user.png" alt="사용자 아이콘" />
            </div>
            <span>{authText}</span>
          </Link>

          <Link to="/reservation" className="hero__cta">
            <span className="hero__cta-icon">
              <img src="/icon/calendar.png" alt="예약 아이콘" />
            </span>
            <span>예약하기</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
