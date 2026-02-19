import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServiceWorkspaceSection.css";
import AnimatedButton from "../common/AnimatedButton";

gsap.registerPlugin(ScrollTrigger);

const workspaces = [
  {
    id: 1,
    subTitle: "WORK SPACE",
    title: "섹션 기반 작업공간",
    desc: "공정과 목적에 맞춘 작업 구역을 시간·일 단위로 유연하게 사용합니다. 준비–작업–정리까지 동선과 환경을 최적화합니다.",
    imgSrc: "/images/sub/workspace_01.png",
    link: "#",
  },
  {
    id: 2,
    subTitle: "EQUIPMENT ZONE",
    title: "공정별 장비·공구",
    desc: "공정별 장비·공구를 예약 기반으로 이용하고, 안전·사용 교육을 통해 바로 작업에 적용합니다. 필요한 장비만 선택해 초기 비용을 줄입니다.",
    imgSrc: "/images/sub/workspace_02.png",
    link: "#",
  },
  {
    id: 3,
    subTitle: "Engineering Consulting",
    title: "CAD·3D·구조물 제작 등 기술 컨설팅",
    desc: "CAD·3D 모델링부터 구조물 제작 검토까지, 설계–제작 사이의 기술 의사결정을 지원합니다. 시행착오를 줄이고 완성도를 빠르게 끌어올립니다.",
    imgSrc: "/images/sub/workspace_03.png",
    link: "#",
  },
];

const ServiceWorkspaceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      ScrollTrigger.getAll()
        .filter((st) => st.trigger === section)
        .forEach((st) => st.kill(true));

      const panels = gsap.utils.toArray<HTMLElement>(".workspace-panel");

      panels.forEach((panel, i) => {
        gsap.set(panel, { yPercent: i === 0 ? 0 : 100 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: `+=${panels.length * 100}%`,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.slice(1).forEach((panel) => {
        tl.to(panel, { yPercent: 0, ease: "none", duration: 1 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="workspace-section">
      <div className="workspace-container">
        {workspaces.map((item, index) => (
          <div
            key={item.id}
            className="workspace-panel"
            style={{ zIndex: index + 1 }}
          >
            <div
              className="panel-bg"
              style={{ backgroundImage: `url(${item.imgSrc})` }}
            />
            <div className="panel-overlay" />

            <div className="panel-content-wrapper">
              <div className="panel-text-box">
                <span className="panel-subtitle">{item.subTitle}</span>
                <h3 className="panel-title">{item.title}</h3>
                <p className="panel-desc">{item.desc}</p>

                <AnimatedButton
                  text="VIEW MORE"
                  onClick={() => console.log("Button Clicked")}
                />
              </div>

              <div className="panel-image-card">
                <img src={item.imgSrc} alt={item.title} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceWorkspaceSection;
