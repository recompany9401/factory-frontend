import React, { useRef, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import axios from "axios";
import "./SignupPage.css";

interface ApiErrorResponse {
  message: string;
  issues?: Array<{
    message: string;
    path?: Array<string | number>;
  }>;
}

const SignupPage: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [userType, setUserType] = useState<"PERSONAL" | "BUSINESS">("PERSONAL");
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    companyName: "",
    businessNumber: "",
    representativeName: "",
    companyAddress: "",
    businessType: "",
    businessItem: "",
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      await axios.post("/api/auth/send-code", { email: formData.email });
      setVerificationCodeSent(true);
      alert(
        "인증번호가 발송되었습니다.\n(개발 환경: 백엔드 터미널 로그를 확인해주세요)",
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as ApiErrorResponse;
        const errorMsg = errorData?.message || "인증번호 발송에 실패했습니다.";
        alert(errorMsg);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert("비밀번호는 영문+숫자 조합 8자리 이상이어야 합니다.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const nameRegex = /^[가-힣]+$/;
    if (!nameRegex.test(formData.name)) {
      alert("이름은 한글만 입력 가능합니다.");
      return;
    }

    if (!verificationCodeSent) {
      alert("이메일 인증을 진행해주세요.");
      return;
    }

    try {
      const payload = {
        email: formData.email,
        verificationCode: formData.verificationCode,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        userType: userType,
        ...(userType === "BUSINESS" && {
          companyName: formData.companyName,
          businessNumber: formData.businessNumber,
          representativeName: formData.representativeName,
          companyAddress: formData.companyAddress,
          businessType: formData.businessType,
          businessItem: formData.businessItem,
        }),
      };

      await axios.post("/api/auth/signup", payload);

      alert("회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as ApiErrorResponse;
        const message = errorData?.message || "회원가입 실패";

        if (errorData?.issues && errorData.issues.length > 0) {
          const detail = errorData.issues[0].message;
          const path = errorData.issues[0].path?.join(".");
          alert(`${message}\n(${path}: ${detail})`);
        } else {
          alert(message);
        }
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="signup-page">
      <div ref={cardRef} className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title">JOIN US</h1>
          <p className="signup-desc">
            리컴퍼니의 멤버가 되어 서비스를 이용해보세요.
          </p>
        </div>

        <div className="signup-tabs">
          <button
            className={`signup-tab-btn ${userType === "PERSONAL" ? "active" : ""}`}
            onClick={() => setUserType("PERSONAL")}
            type="button"
          >
            개인 회원
          </button>
          <button
            className={`signup-tab-btn ${userType === "BUSINESS" ? "active" : ""}`}
            onClick={() => setUserType("BUSINESS")}
            type="button"
          >
            사업자 회원
          </button>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-input-group">
            <label className="signup-label">
              이메일<span>*</span>
            </label>
            <div className="signup-email-row">
              <input
                type="email"
                name="email"
                className="signup-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={handleSendCode}
                className="signup-btn verify"
              >
                {verificationCodeSent ? "재발송" : "인증요청"}
              </button>
            </div>
          </div>

          <div className="signup-input-group">
            <label className="signup-label">
              인증번호<span>*</span>
            </label>
            <input
              type="text"
              name="verificationCode"
              className="signup-input"
              placeholder="이메일로 전송된 6자리 번호"
              value={formData.verificationCode}
              onChange={handleChange}
              required
              maxLength={6}
            />
          </div>

          <div className="signup-input-group">
            <label className="signup-label">
              비밀번호<span>*</span>
            </label>
            <input
              type="password"
              name="password"
              className="signup-input"
              placeholder="영문+숫자 조합 8자리 이상"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-input-group">
            <label className="signup-label">
              비밀번호 확인<span>*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="signup-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-input-group">
            <label className="signup-label">
              이름<span>*</span>
            </label>
            <input
              type="text"
              name="name"
              className="signup-input"
              placeholder="한글만 입력하세요"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-input-group">
            <label className="signup-label">휴대전화</label>
            <input
              type="tel"
              name="phone"
              className="signup-input"
              placeholder="숫자만 입력하세요"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {userType === "BUSINESS" && (
            <>
              <div className="signup-divider"></div>

              <p className="signup-section-title">사업자 필수 정보</p>

              <div className="signup-input-group">
                <label className="signup-label">
                  회사명<span>*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  className="signup-input"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="signup-input-group">
                <label className="signup-label">
                  사업자 등록번호<span>*</span>
                </label>
                <input
                  type="text"
                  name="businessNumber"
                  className="signup-input"
                  placeholder="- 포함해서 입력"
                  value={formData.businessNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <p className="signup-section-title mt-20">
                추가 정보 (계산서 발행용/선택)
              </p>

              <div className="signup-input-group">
                <label className="signup-label normal">대표자명</label>
                <input
                  type="text"
                  name="representativeName"
                  className="signup-input"
                  onChange={handleChange}
                />
              </div>
              <div className="signup-input-group">
                <label className="signup-label normal">사업장 주소</label>
                <input
                  type="text"
                  name="companyAddress"
                  className="signup-input"
                  onChange={handleChange}
                />
              </div>

              <div className="signup-row">
                <div className="signup-col">
                  <label className="signup-label normal">업태</label>
                  <input
                    type="text"
                    name="businessType"
                    className="signup-input"
                    onChange={handleChange}
                  />
                </div>
                <div className="signup-col">
                  <label className="signup-label normal">종목</label>
                  <input
                    type="text"
                    name="businessItem"
                    className="signup-input"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="signup-btn">
            가입하기
          </button>
        </form>

        <div className="login-link-area">
          이미 계정이 있으신가요?
          <Link to="/login" className="login-link">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
