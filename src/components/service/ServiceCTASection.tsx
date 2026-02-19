import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./ServiceCTASection.css";

gsap.registerPlugin(ScrollTrigger);

const ServiceCTASection = () => {
  const containerRef = useRef<HTMLElement>(null);

  const subtitleRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const buttons = gsap.utils.toArray(".cta-btn", btnGroupRef.current);

      gsap.set(subtitleRef.current, { y: 20, autoAlpha: 0 });
      gsap.set(titleRef.current, { y: 30, autoAlpha: 0 });
      gsap.set(descRef.current, { y: 20, autoAlpha: 0 });

      if (buttons.length > 0) {
        gsap.set(buttons, { y: 20, autoAlpha: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(subtitleRef.current, {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: "power2.out",
      });

      tl.to(
        titleRef.current,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      );

      tl.to(
        descRef.current,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      );

      if (buttons.length > 0) {
        tl.to(
          buttons,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="cta-section">
      <div className="cta-bg" />

      <div className="cta-inner">
        <div className="cta-content">
          <span ref={subtitleRef} className="cta-subtitle">
            MAKE IT REAL
          </span>
          <h2 ref={titleRef} className="cta-title">
            지금, 필요한 만큼의
            <br />
            공장을 사용해보세요.
          </h2>
          <p ref={descRef} className="cta-desc">
            제작 일정과 예산에 맞춰 공간·장비·컨설팅을 조합하고,
            <br className="pc-only" />
            필요한 구간에서는 기술지원을 더해 시제품에서
            <br className="pc-only" />
            완제품까지 빠르게 연결할 수 있습니다.
          </p>

          <div ref={btnGroupRef} className="cta-btn-group">
            <Link to="/reservation" className="cta-btn primary">
              <span>예약하기</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link to="/contact" className="cta-btn outline">
              <span>상담하기</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCTASection;
