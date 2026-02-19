import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./HowSection.css";

gsap.registerPlugin(ScrollTrigger);

const HowSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(headerRef.current, {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      if (gridRef.current) {
        tl.to(
          gridRef.current.children,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="how-section">
      <div className="how-bg" />
      <div className="how-overlay" />

      <div className="how-inner">
        <div ref={headerRef} className="how-header">
          <span className="how-subtitle">
            HOW DIFFERENT MAKERS USE POP-UP FACTORY
          </span>
          <h2 className="how-title">POP-UP FACTORY, 누가 어떻게 쓰나요?</h2>
        </div>

        <div ref={gridRef} className="how-grid">
          <div className="how-card">
            <img
              src="/icon/user-maker.png"
              alt="1인 메이커"
              className="how-card__icon"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <h3 className="how-card__title">1인 메이커</h3>
            <ul className="how-card__list">
              <li>제품 아이디어는 있는데 제조할 곳이 마땅치 않을 때</li>
              <li>여러 버전을 짧게 만들어 테스트해보고 싶을 때</li>
            </ul>
          </div>

          <div className="how-card">
            <img
              src="/icon/user-startup.png"
              alt="스타트업"
              className="how-card__icon"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <h3 className="how-card__title">스타트업</h3>
            <ul className="how-card__list">
              <li>출시 전 프로토타입을 계속 바꿔가며 검증해야 할 때</li>
              <li>초기 물량을 소량씩 나눠 생산해보고 싶을 때</li>
            </ul>
          </div>

          <div className="how-card">
            <img
              src="/icon/user-store.png"
              alt="소상공인"
              className="how-card__icon"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <h3 className="how-card__title">소상공인</h3>
            <ul className="how-card__list">
              <li>신제품을 소량으로 찍어서 먼저 반응을 보고 싶을 때</li>
              <li>시즌·행사용 한정 제품을 부담 없이 만들어야 할 때</li>
            </ul>
          </div>

          <div className="how-card">
            <img
              src="/icon/user-brand.png"
              alt="신규 브랜드"
              className="how-card__icon"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <h3 className="how-card__title">신규 브랜드</h3>
            <ul className="how-card__list">
              <li>첫 컬렉션 샘플을 한 번에 쭉 뽑아봐야 할 때</li>
              <li>
                브랜드 이미지에 맞는 소재·마감을 여러 가지 시험해보고 싶을 때
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSection;
