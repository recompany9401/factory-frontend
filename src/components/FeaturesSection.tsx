import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./FeaturesSection.css";

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  const dot1Ref = useRef<HTMLSpanElement>(null);
  const dot2Ref = useRef<HTMLSpanElement>(null);
  const dot3Ref = useRef<HTMLSpanElement>(null);

  const highlightRef = useRef<HTMLSpanElement>(null);

  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const dotsTl = gsap.timeline({ repeat: -1 });
      const dots = [dot1Ref.current, dot2Ref.current, dot3Ref.current];

      dotsTl
        .to(dots, {
          opacity: 1,
          duration: 0.5,
          stagger: 0.3,
          ease: "power1.inOut",
        })
        .to(
          dots,
          {
            opacity: 0.2,
            duration: 0.5,
            stagger: 0.3,
          },
          "+=0.1"
        );

      const typingTl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play pause resume pause",
        },
      });

      typingTl
        .to(highlightRef.current, {
          width: "auto",
          padding: "0 8px",
          duration: 1.5,
          ease: "steps(10)",
        })
        .to(highlightRef.current, {
          borderRightColor: "transparent",
          duration: 0.5,
          repeat: 3,
          yoyo: true,
          ease: "steps(1)",
        })
        .to(highlightRef.current, {
          width: 0,
          padding: 0,
          duration: 0.8,
          ease: "steps(10)",
        })
        .to({}, { duration: 0.5 });

      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      mainTl.from(".features-title-text", {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      mainTl.from(
        highlightRef.current,
        {
          autoAlpha: 0,
          scale: 0.9,
          duration: 0.5,
        },
        "<"
      );

      if (cardsRef.current) {
        mainTl.to(
          cardsRef.current.children,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="features-section">
      <div className="features-bg-text top">POP-UP</div>
      <div className="features-bg-text bottom">FACTORY</div>

      <div className="features-inner">
        <div className="features-dots">
          <span ref={dot3Ref} className="dot"></span>
          <span ref={dot2Ref} className="dot"></span>
          <span ref={dot1Ref} className="dot"></span>
        </div>

        <h2 className="features-title">
          <span className="features-title-text">
            이 여정을 가능하게 하는 POP-UP FACTORY의{" "}
          </span>
          <br className="mobile-only" />
          <span ref={highlightRef} className="features-highlight">
            &nbsp;네 가지 핵심 기능&nbsp;
          </span>
          <span className="features-title-text"> 입니다.</span>
        </h2>

        <div ref={cardsRef} className="features-list">
          <div className="feature-card">
            <img
              src="/icon/feature-1.png"
              alt="임대"
              className="feature-icon"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="feature-label">시간·일 단위 임대</div>
          </div>

          <div className="feature-card">
            <img
              src="/icon/feature-2.png"
              alt="안전"
              className="feature-icon"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="feature-label">공용 설비 + 안전 관리</div>
          </div>

          <div className="feature-card">
            <img
              src="/icon/feature-3.png"
              alt="컨설팅"
              className="feature-icon"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="feature-label">기술·프로세스 컨설팅</div>
          </div>

          <div className="feature-card">
            <img
              src="/icon/feature-4.png"
              alt="지원"
              className="feature-icon"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="feature-label">정부지원·정책 연계 가능</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
