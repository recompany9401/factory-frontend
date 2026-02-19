import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import "./InquirySection.css";

gsap.registerPlugin(ScrollTrigger);

const InquirySection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
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

      alert("문의가 성공적으로 접수되었습니다!");
      form.reset();
    } catch (error) {
      console.error("Email Error:", error);
      alert("전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={containerRef} className="inquiry-section">
      <div className="inquiry-bg" />

      <div className="inquiry-inner">
        <div ref={textRef} className="inquiry-text-area">
          <span className="inquiry-subtitle">CONTACT FOR FACTORY USE</span>
          <h2 className="inquiry-title">공장 사용 및 견적 문의</h2>
          <p className="inquiry-desc">
            공장 사용 일정, 장기 입점, 공동 프로젝트 등 궁금한 내용을 남겨주시면
            담당자가 확인 후 신속하게 연락드립니다.
          </p>
        </div>

        <div ref={formRef} className="inquiry-form-wrapper">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">문의유형</label>
              <div className="radio-group">
                {["단기 임대", "장기 입점", "컨설팅", "견적"].map(
                  (type, idx) => (
                    <label key={idx} className="radio-label">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        className="radio-input"
                        defaultChecked={idx === 0}
                      />
                      <span className="radio-custom">{type}</span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-col form-group">
                <label className="form-label">고객명</label>
                <input
                  type="text"
                  name="user_name"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-col form-group">
                <label className="form-label">연락처</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">이메일</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  name="email_user"
                  className="form-input"
                  required
                />
                <span style={{ alignSelf: "center" }}>@</span>
                <input
                  type="text"
                  name="email_domain"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">제목</label>
              <input
                type="text"
                name="subject"
                className="form-input"
                placeholder="제목을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">내용</label>
              <textarea
                name="message"
                className="form-textarea"
                placeholder="문의 내용을 입력하세요"
                required
              ></textarea>
            </div>

            <label className="checkbox-group">
              <input type="checkbox" className="checkbox-input" required />
              <span>개인정보 수집 및 이용에 동의합니다.</span>
            </label>

            <div className="submit-btn-container">
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

export default InquirySection;
