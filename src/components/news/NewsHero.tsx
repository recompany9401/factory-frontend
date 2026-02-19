import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./NewsHero.css";

const NewsHero = () => {
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
    <section ref={containerRef} className="news-hero">
      <div className="news-hero__bg">
        <img
          ref={bgRef}
          src="/images/sub/policy-hero.png"
          alt="News Hero Background"
          className="news-hero__img"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            if (containerRef.current)
              containerRef.current.style.backgroundColor = "#333";
          }}
        />
      </div>

      <div ref={overlayRef} className="news-hero__overlay"></div>

      <div className="news-hero__content">
        <span ref={eyebrowRef} className="news-hero__eyebrow">
          새소식
        </span>
        <h1 ref={titleRef} className="news-hero__title">
          NEWS & NOTICE
        </h1>
        <p ref={descRef} className="news-hero__desc">
          (주)리컴퍼니의 새로운 소식과 공지사항을 알려드립니다.
          <br className="mo-hide" />
          다양한 업데이트와 이벤트 정보를 확인하세요.
        </p>
      </div>
    </section>
  );
};

export default NewsHero;
