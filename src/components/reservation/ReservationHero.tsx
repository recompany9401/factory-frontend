import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./ReservationHero.css";

const ReservationHero = () => {
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
    <section ref={containerRef} className="reservation-hero">
      <div className="reservation-hero__bg">
        <img
          ref={bgRef}
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
          alt="Reservation Hero Background"
          className="reservation-hero__img"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            if (containerRef.current)
              containerRef.current.style.backgroundColor = "#333";
          }}
        />
      </div>

      <div ref={overlayRef} className="reservation-hero__overlay"></div>

      <div className="reservation-hero__content">
        <span ref={eyebrowRef} className="reservation-hero__eyebrow">
          RESERVATION
        </span>
        <h1 ref={titleRef} className="reservation-hero__title">
          START YOUR CREATION
        </h1>
        <p ref={descRef} className="reservation-hero__desc">
          상상을 현실로 만드는 곳, 팝업 팩토리입니다.
          <br className="mo-hide" />
          최적의 공간과 전문 장비를 예약하여 당신의 프로젝트를 시작하세요.
        </p>
      </div>
    </section>
  );
};

export default ReservationHero;
