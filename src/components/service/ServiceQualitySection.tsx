import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServiceQualitySection.css";

gsap.registerPlugin(ScrollTrigger);

const qualityItems = [
  {
    id: 1,
    title: "안전망이 확보된 제조 환경",
    desc: "모든 작업자는 산재보험 가입 등 필수 안전 요건을 충족해야 작업이 가능합니다. 예기치 못한 사고에 대비하는 든든한 안전망을 제공합니다.",
    iconSrc: "/icon/sub/icon_worker.png",
  },
  {
    id: 2,
    title: "충돌 없는 전용 공간 보장",
    desc: "실시간 예약 시스템을 통해 가용 시간을 엄격하게 관리합니다. 사용자 간 동선 겹침이나 장비 중복 예약 없이, 오직 귀하만의 작업 시간을 보장합니다.",
    iconSrc: "/icon/sub/icon_time.png",
  },
  {
    id: 3,
    title: "투명한 취소 및 환불 정책",
    desc: "예약 단계에서부터 취소 수수료와 환불 규정을 명확히 고지합니다. (예: 10일 전 100% 환불 등 정책 준수)",
    iconSrc: "/icon/sub/icon_policy.png",
  },
];

const ServiceQualitySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftColRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        immediateRender: false,
      });

      const cards = gsap.utils.toArray<HTMLElement>(".quality-card");
      gsap.from(cards, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        immediateRender: false,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="quality-section">
      <div className="quality-container">
        <div className="quality-header section-header">
          <span className="quality-point section-point">
            QUALITY & COMPLIANCE
          </span>
          <h3 className="quality-title section-title">
            <span>제조의 기준을 높이는</span> 운영 원칙
          </h3>
          <p className="quality-desc">
            Pop-up Factory는 ISO 9001 인증 환경을 기반으로, 임차인도 해당 운영
            수준을 활용할 수 있는 구조를 지향합니다. (세부 적용 범위는 운영
            정책에 따름)
          </p>
        </div>

        <div className="quality-content">
          <div ref={leftColRef} className="quality-left">
            <div className="iso-circle-wrapper">
              <div className="ripple-circle circle-1"></div>
              <div className="ripple-circle circle-2"></div>
              <div className="ripple-circle circle-3"></div>
              <div className="iso-img-box">
                <img
                  src="/icon/sub/iso_mark.png"
                  alt="ISO 9001 Authentication"
                  className="iso-img"
                />
              </div>
            </div>
          </div>

          <div ref={rightColRef} className="quality-right">
            {qualityItems.map((item) => (
              <div key={item.id} className="quality-card">
                <div className="card-icon-box">
                  <img src={item.iconSrc} alt="" className="card-icon" />
                </div>
                <div className="card-text-box">
                  <h4 className="card-title">{item.title}</h4>
                  <p className="card-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceQualitySection;
