import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./FactoryFacilitiesSection.css";

gsap.registerPlugin(ScrollTrigger);

const facilities = [
  {
    id: 1,
    title: "2.8톤 천장 크레인",
    desc: "금형 및 중량 자재의 실내 이동과 하역 작업 가능",
    icon: "/icon/sub/icon_crane.png",
  },
  {
    id: 2,
    title: "사무 공간 및 PC",
    desc: "설계 소프트웨어가 구비되어 현장에서 즉각적인 수정 가능",
    icon: "/icon/sub/icon_pc.png",
  },
  {
    id: 3,
    title: "자재 적재실",
    desc: "원자재와 가공 결과물을 보관할 수 있는 별도의 적재 공간 제공",
    icon: "/icon/sub/icon_storage.png",
  },
  {
    id: 4,
    title: "하역 및 진입",
    desc: "높은 층고와 넓은 출입구를 갖추어 화물 차량의 진입과 자재 반입 가능",
    icon: "/icon/sub/icon_gate.png",
  },
  {
    id: 5,
    title: "유틸리티 싱크",
    desc: "도구 세척 및 개인 정비가 가능한 싱크대와 수도 시설이 완비",
    icon: "/icon/sub/icon_sink.png",
  },
  {
    id: 6,
    title: "전용 주차장",
    desc: "약 10대 규모의 전용 주차 공간 보유",
    icon: "/icon/sub/icon_parking.png",
  },
];

const FactoryFacilitiesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.set(headerRef.current, { y: 40, autoAlpha: 0 });
      }

      if (gridRef.current) {
        gsap.set(gridRef.current.children, { y: 60, autoAlpha: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(headerRef.current, {
        y: 0,
        autoAlpha: 1,
        duration: 1.2,
        ease: "power2.out",
      });

      if (gridRef.current) {
        tl.to(
          gridRef.current.children,
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.8"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="facilities-section">
      <div className="facilities-inner">
        <div ref={headerRef} className="fac-header">
          <span className="fac-subtitle">FACILITIES & SUPPORT</span>
          <h2 className="fac-title">현장 인프라 & 지원공간</h2>
        </div>

        <div ref={gridRef} className="fac-grid">
          {facilities.map((item) => (
            <div key={item.id} className="fac-card">
              <div className="fac-icon-box">
                <img
                  src={item.icon}
                  alt={item.title}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <h3 className="fac-card-title">{item.title}</h3>
              <p className="fac-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FactoryFacilitiesSection;
