import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ContactHero.css";

gsap.registerPlugin(ScrollTrigger);

const ContactHero: React.FC = () => {
  const wrapperRef = useRef<HTMLElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imgContainerRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.to(
        imgContainerRef.current,
        {
          width: "100%",
          height: "100vh",
          borderRadius: 0,
          ease: "none",
          duration: 1,
        },
        0,
      );

      tl.to(
        textRef.current,
        {
          color: "#ffffff",
          ease: "none",
          duration: 0.8,
        },
        0,
      );

      tl.to(
        overlayRef.current,
        {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          ease: "none",
          duration: 0.4,
        },
        0,
      );

      tl.to({}, { duration: 1 });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapperRef} className="contact-hero-wrapper">
      <div className="contact-pinned-content">
        <div ref={textRef} className="contact-text-group">
          <span className="contact-subtitle">문의·상담</span>
          <h2 className="contact-title">CONTACT & CONSULTATION</h2>
          <p className="contact-desc">
            이용 방법, 공간·장비 선택, 기술지원 범위 등 궁금한 점을 남겨주세요.
            <br />
            작업 내용에 맞춰 필요한 준비사항과 진행 방법을 안내해드립니다.
          </p>
        </div>

        <div ref={imgContainerRef} className="contact-img-container">
          <img
            src="/images/sub/factory-hero.png"
            alt="Contact Hero"
            className="contact-img"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (imgContainerRef.current) {
                imgContainerRef.current.style.backgroundColor = "#333";
              }
            }}
          />
          <div ref={overlayRef} className="contact-overlay"></div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
