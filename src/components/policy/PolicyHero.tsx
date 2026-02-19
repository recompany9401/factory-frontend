import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./PolicyHero.css";

const PolicyHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to(bgRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      }).to(
        overlayRef.current,
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "<",
      );

      tl.from(
        [eyebrowRef.current, titleRef.current, descRef.current],
        {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
        0.1,
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="policy-hero">
      <div className="policy-hero__bg">
        <img
          ref={bgRef}
          src="/images/sub/policy-hero.png"
          alt="Policy Hero Background"
          className="policy-hero__img"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            if (containerRef.current)
              containerRef.current.style.backgroundColor = "#333";
          }}
        />
      </div>

      <div ref={overlayRef} className="policy-hero__overlay"></div>

      <div className="policy-hero__content">
        <span ref={eyebrowRef} className="policy-hero__eyebrow">
          정부지원·정책
        </span>
        <h1 ref={titleRef} className="policy-hero__title">
          POLICY & FUNDING HUB
        </h1>
        <p ref={descRef} className="policy-hero__desc">
          정부지원 사업과 정책 정보를 보기 쉽게 모았습니다. 필요한 내용을
          확인하고
          <br className="mo-hide" />내 상황에 맞는 지원이 있는지 찾아보세요.
        </p>
      </div>
    </section>
  );
};

export default PolicyHero;
