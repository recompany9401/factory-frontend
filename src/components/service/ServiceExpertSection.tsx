import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./ServiceExpertSection.css";

gsap.registerPlugin(ScrollTrigger);

const ServiceExpertSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftImgRef = useRef<HTMLDivElement>(null);
  const rightGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".expert-card", rightGridRef.current);
      console.log("Expert Cards found:", cards.length);

      gsap.set(headerRef.current, { y: 50, autoAlpha: 0 });
      gsap.set(leftImgRef.current, { x: -50, autoAlpha: 0 });
      if (cards.length > 0) {
        gsap.set(cards, { y: 50, autoAlpha: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(headerRef.current, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
      });

      tl.add("contentStart", "-=0.3");

      tl.to(
        leftImgRef.current,
        {
          x: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power2.out",
        },
        "contentStart"
      );

      if (cards.length > 0) {
        tl.to(
          cards,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.2)",
          },
          "contentStart+=0.2"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="expert-section">
      <div className="expert-bg" />
      <div className="expert-overlay" />

      <div className="expert-inner">
        <div ref={headerRef} className="expert-header">
          <span className="expert-label">EXPERT SUPPORT</span>
          <h2 className="section-title">
            장비만 빌리는 게 아니라, <span>기술까지 지원</span>합니다.
          </h2>
        </div>

        <div className="expert-content">
          <div ref={leftImgRef} className="expert-left-visual">
            <img
              src="/images/sub/service_expert_worker.png"
              alt="Professional Worker"
              className="worker-img"
              onError={(e) => {
                console.error("Worker Image Load Failed");
                e.currentTarget.style.backgroundColor = "#333";
              }}
            />
          </div>

          <div ref={rightGridRef} className="expert-right-grid">
            <div className="expert-card">
              <div className="card-icon-box">
                <img
                  src="/icon/sub/icon_design.png"
                  alt="설계"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <h3>
                설계 검토 & 제작
                <br />
                가능성(DFM) 확인
              </h3>
              <p>
                도면/치수/재료 관점에서 제작 가능 여부를 점검하고, 개선 포인트를
                제안합니다.
              </p>
            </div>

            <div className="expert-card">
              <div className="card-icon-box">
                <img
                  src="/icon/sub/icon_3d.png"
                  alt="3D"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <h3>3D 프린팅 지원</h3>
              <p>
                모델 점검부터 출력 조건 세팅, 출력물 후처리까지 전 과정을
                가이드합니다.
              </p>
            </div>

            <div className="expert-card">
              <div className="card-icon-box">
                <img
                  src="/icon/sub/icon_guide.png"
                  alt="가이드"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <h3>가공·제작 공정 가이드</h3>
              <p>
                필요한 장비 선택, 작업 순서, 안전 기준을 제시해 시행착오를
                줄입니다.
              </p>
            </div>

            <div className="expert-card">
              <div className="card-icon-box">
                <img
                  src="/icon/sub/icon_connect.png"
                  alt="연계"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <h3>
                시제품 → 완제품
                <br />
                제작 연계 (조건부)
              </h3>
              <p>
                개선을 반복하며 완제품 제작까지 이어지도록 지원하고, 필요 시
                외주 연계도 안내합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceExpertSection;
