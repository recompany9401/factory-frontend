import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServiceHero.css";

gsap.registerPlugin(ScrollTrigger);

const ServiceHero: React.FC = () => {
  const wrapperRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
        0
      );

      tl.to(
        textRef.current,
        {
          color: "#ffffff",
          ease: "none",
          duration: 0.8,
        },
        0
      );

      tl.to(
        overlayRef.current,
        {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          ease: "none",
          duration: 0.4,
        },
        0
      );

      tl.to({}, { duration: 1 });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapperRef} className="service-hero-wrapper">
      <div ref={contentRef} className="pinned-content">
        <div ref={textRef} className="hero-text-group">
          <span className="hero-subtitle">서비스 소개</span>
          <h2 className="hero-title">SYSTEMATIC & SOLUTION</h2>
          <p className="hero-desc">
            POP-UP FACTORY는 단순한 공간 대여를 넘어, 기획·설계부터
            <br />
            가공·조립·마감까지 제조의 A TO Z를 지원하는 토탈 솔루션입니다.
          </p>
        </div>

        <div ref={imgContainerRef} className="hero-img-container">
          <img
            src="/images/sub/service-hero.png"
            alt="Factory Building"
            className="hero-img"
          />
          <div ref={overlayRef} className="hero-overlay"></div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
