import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <img
            src="/logo_color.png"
            alt="(주)리컴퍼니"
            className="footer-logo"
          />

          <div className="footer-info">
            <p>ADD. 경남 창원시 성산구 곰절길 28번길 1</p>
            <p>
              <span>TEL. 055-716-0738</span>
              <span>FAX. 0505-115-9401</span>
            </p>
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-links">
            <a href="#" className="footer-link">
              개인정보처리방침
            </a>
            <a href="#" className="footer-link">
              이용약관
            </a>
            <a href="#" className="footer-link">
              고객문의
            </a>
            <a href="#" className="footer-link highlight">
              예약하기
            </a>
          </div>

          <p className="footer-copyright">
            COPYRIGHT © 2025 RECOMPANY ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
