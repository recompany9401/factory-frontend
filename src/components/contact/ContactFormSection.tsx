import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import "./ContactFormSection.css";

gsap.registerPlugin(ScrollTrigger);

const ContactFormSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(infoRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(formRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        },
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const emailUser = formData.get("email_user") as string;
    const emailDomain = formData.get("email_domain") as string;
    const fullEmail = `${emailUser}@${emailDomain}`;

    const templateParams = {
      type: formData.get("type"),
      from_name: formData.get("user_name"),
      phone: formData.get("phone"),
      email: fullEmail,
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const SERVICE_ID = "service_9xl5wwb";
      const TEMPLATE_ID = "template_cazy9ce";
      const PUBLIC_KEY = "eZnKxkJxaGTS7tLGn";

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      alert("문의가 정상적으로 접수되었습니다.");
      form.reset();
    } catch (error) {
      console.error("Email Error:", error);
      alert("전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={containerRef} className="contact-form-section">
      <div className="contact-form-inner">
        <div ref={infoRef} className="contact-info-area">
          <span className="contact-badge">Contact</span>
          <h1 className="contact-main-title">Let’s Build Together</h1>
          <p className="contact-sub-desc">
            아이디어를 현실로 만드는 여정을 함께합니다.
          </p>

          <hr className="contact-divider" />

          <div className="contact-details-list">
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 7.2c0 7.3-8 11.8-8 11.8z"
                  />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span>경상남도 창원시 성산구 곰절길28번길 1</span>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <span>055-716-0731</span>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span>recompany@daum.net</span>
            </div>
          </div>
        </div>

        <div ref={formRef} className="contact-form-card">
          <form onSubmit={handleSubmit}>
            <div className="c-form-group">
              <label className="c-form-label">문의유형</label>
              <div className="c-radio-group">
                {["단기 임대", "장기 임대", "컨설팅", "견적"].map(
                  (type, idx) => (
                    <label key={idx} className="c-radio-label">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        className="c-radio-input"
                        defaultChecked={idx === 0}
                      />
                      <span className="c-radio-custom">{type}</span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <div className="c-form-row">
              <div className="c-form-col c-form-group">
                <label className="c-form-label">고객명</label>
                <input
                  type="text"
                  name="user_name"
                  className="c-form-input"
                  required
                />
              </div>
              <div className="c-form-col c-form-group">
                <label className="c-form-label">연락처</label>
                <input
                  type="tel"
                  name="phone"
                  className="c-form-input"
                  required
                />
              </div>
            </div>

            <div className="c-form-group">
              <label className="c-form-label">이메일</label>
              <div className="c-email-group">
                <input
                  type="text"
                  name="email_user"
                  className="c-form-input"
                  required
                />
                <span className="c-email-at">@</span>
                <input
                  type="text"
                  name="email_domain"
                  className="c-form-input"
                  required
                />
              </div>
            </div>

            <div className="c-form-group">
              <label className="c-form-label">제목</label>
              <input
                type="text"
                name="subject"
                className="c-form-input"
                required
              />
            </div>

            <div className="c-form-group">
              <label className="c-form-label">내용</label>
              <textarea
                name="message"
                className="c-form-textarea"
                required
              ></textarea>
            </div>

            <label className="c-checkbox-group">
              <input type="checkbox" className="c-checkbox-input" required />
              <span>개인정보 수집 및 이용에 동의합니다.</span>
            </label>

            <div className="c-submit-btn-container">
              <button
                type="submit"
                className="animated-btn"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                <span className="text">
                  {isSubmitting ? "Sending..." : "Send"}
                </span>
                {!isSubmitting && (
                  <div className="icon-container">
                    <div className="icon icon--left">
                      <svg viewBox="0 0 20 10">
                        <path d="M14.84 0l-1.08 1.06 3.3 3.2H0v1.49h17.05l-3.3 3.2L14.84 10 20 5l-5.16-5z"></path>
                      </svg>
                    </div>
                    <div className="icon icon--right">
                      <svg viewBox="0 0 20 10">
                        <path d="M14.84 0l-1.08 1.06 3.3 3.2H0v1.49h17.05l-3.3 3.2L14.84 10 20 5l-5.16-5z"></path>
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
