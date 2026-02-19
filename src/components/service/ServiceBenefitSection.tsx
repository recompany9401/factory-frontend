import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServiceBenefitSection.css";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    id: 1,
    enTitle: "COST FREE",
    krTitle: "초기 설비 투자 비용 0원",
    desc: "수억 원대의 고가 장비를 직접 구매하거나 리스할 필요가 없습니다. 초기 자본금 부담 없이 아이디어 하나로 즉시 제조를 시작하세요.",
  },
  {
    id: 2,
    enTitle: "ON-DEMAND",
    krTitle: "원하는 기간만큼 사용",
    desc: "최소 1시간 단위 이용부터 장기 프로젝트까지. 고정비 걱정 없이, 생산 계획에 맞춰 딱 필요한 만큼만 합리적으로 이용하세요.",
  },
  {
    id: 3,
    enTitle: "ALL-IN-ONE",
    krTitle: "기획부터 제작, 포장까지 한 공간에서 해결",
    desc: "설계 검토, 가공, 조립, 패키징이 한 곳에서 가능합니다. 복잡한 외주 발주 없이 제조 리드타임을 획기적으로 단축시키세요.",
  },
];

const ServiceBenefitSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      tl.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        contentRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="benefit-section">
      <div ref={headerRef} className="section-header">
        <span className="section-point">WHY A POP-UP FACTORY?</span>
        <h3 className="section-title">
          POP-UP FACTORY는 <span>초기 제조의 핵심 비용</span>인
          <br />
          공간·설비·시간 부담을 <span>필요한 만큼만</span>으로 바꿉니다.
        </h3>
      </div>

      <div ref={contentRef} className="benefit-content-wrapper">
        <div className="benefit-bg-image"></div>
        <div className="benefit-grid">
          {benefits.map((item) => (
            <div key={item.id} className="benefit-item">
              <div className="glass-box">
                <h4 className="item-en-title">{item.enTitle}</h4>
                <p className="item-kr-title">{item.krTitle}</p>
                <div className="item-desc-wrapper">
                  <p className="item-desc">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceBenefitSection;
