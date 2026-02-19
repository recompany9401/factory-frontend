import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServiceProcessSection.css";

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    id: 1,
    stepTitle: "01 리소스 선택",
    desc: "제작에 필요한 항목을 선택합니다. 작업공간, 공정 장비·공구, 기술 컨설팅 중 현재 단계에 필요한 것만 고르면 됩니다.",
    iconSrc: "/icon/sub/process_01.png",
  },
  {
    id: 2,
    stepTitle: "02 날짜·시간 선택",
    desc: "원하는 이용 날짜와 시간을 선택합니다. 운영 캘린더에서 가능한 슬롯을 확인하고, 제작 일정에 맞춰 시간/일 단위로 예약할 수 있습니다.",
    iconSrc: "/icon/sub/process_02.png",
  },
  {
    id: 3,
    stepTitle: "03 산재보험 가입·인증",
    desc: "산재보험 가입은 필수입니다. 가입 링크로 이동해 가입을 완료한 뒤 인증 절차를 진행하며, 인증이 확인되지 않으면 예약을 진행할 수 없습니다.",
    iconSrc: "/icon/sub/process_03.png",
  },
  {
    id: 4,
    stepTitle: "04 결제/확정",
    desc: "선택한 리소스와 시간에 따른 비용을 확인한 뒤 결제합니다. 결제가 완료되면 예약이 확정되고, 이용 안내와 준비사항이 함께 제공됩니다.",
    iconSrc: "/icon/sub/process_04.png",
  },
  {
    id: 5,
    stepTitle: "05 현장 이용",
    desc: "예약 시간에 맞춰 현장에서 체크인합니다. 안전 안내를 확인하고 지정된 공간과 장비를 이용해 즉시 제작을 시작할 수 있습니다.",
    iconSrc: "/icon/sub/process_05.png",
  },
];

const ServiceProcessSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });

      tl.from(".process-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      tl.to(
        lineRef.current,
        {
          width: "100%",
          duration: 2,
          ease: "power2.inOut",
        },
        "-=0.4"
      );

      const cards = gsap.utils.toArray(".process-card-wrapper");

      tl.fromTo(
        cards,
        {
          rotationY: 90,
          opacity: 0,
          y: 30,
        },
        {
          rotationY: 0,
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.35,
          ease: "power3.out",
          transformOrigin: "center center",
        },
        "<0.2"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="process-section">
      <div className="process-container">
        <div className="section-header process-header">
          <span className="section-point">HOW IT WORKS</span>
          <h3 className="section-title">
            <span>필요한 만큼 선택</span>하고, 바로 제작하세요.
          </h3>
        </div>

        <div className="process-steps-wrapper">
          <div className="process-line-track">
            <div ref={lineRef} className="process-line-fill"></div>
          </div>

          <div className="process-grid">
            {processSteps.map((step) => (
              <div key={step.id} className="process-item">
                <div className="step-label-box">
                  <div className="step-dot"></div>
                  <span className="step-title">{step.stepTitle}</span>
                </div>

                <div className="process-card-wrapper">
                  <div className="process-card">
                    <div className="card-icon-area">
                      <img
                        src={step.iconSrc}
                        alt={step.stepTitle}
                        className="step-icon"
                      />
                    </div>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceProcessSection;
