import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FactoryHero.css";

gsap.registerPlugin(ScrollTrigger);

const FactoryHero: React.FC = () => {
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
    <section ref={wrapperRef} className="factory-hero-wrapper">
      <div className="factory-pinned-content">
        <div ref={textRef} className="factory-text-group">
          <span className="factory-subtitle">공장 소개</span>
          <h2 className="factory-title">THE STAGE FOR MAKERS</h2>
          <p className="factory-desc">
            작업 목적에 맞춰 구역을 선택하고, 필요한 만큼 공간·장비·기술지원을
            <br />
            조합해 시제품부터 완제품까지 제작을 이어갈 수 있는 공유형
            공장입니다.
          </p>
        </div>

        <div ref={imgContainerRef} className="factory-img-container">
          <img
            src="/images/sub/factory-hero.png"
            alt="Factory Exterior"
            className="factory-img"
          />
          <div ref={overlayRef} className="factory-overlay"></div>
        </div>
      </div>
    </section>
  );
};

export default FactoryHero;
