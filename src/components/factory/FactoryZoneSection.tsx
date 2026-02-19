import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AnimatedButton from "../common/AnimatedButton";
import "./FactoryZoneSection.css";

gsap.registerPlugin(ScrollTrigger);

const zones = [
  {
    id: 1,
    name: "Making & Fabrication Zone",
    title: "메이킹 & 패브리케이션 존",
    desc: "기본 가공 장비와 작업대가 모여 있어, 목공·간단한 금속 가공·프로토타입 제작 등 '처음 형태를 만들어내는' 작업에 적합한 구역입니다. 다양한 수공구와 전동공구를 자유롭게 사용할 수 있습니다.",
    image: "/images/main/zone-1.png",
  },
  {
    id: 2,
    name: "Frame & Structure Zone",
    title: "프레임 & 스트럭처 존",
    desc: "대형 구조물이나 프레임 제작을 위한 용접 및 금속 가공 특화 구역입니다. 안전한 용접 부스와 정밀 절단 장비를 갖추고 있어 튼튼한 골격을 제작할 수 있습니다.",
    image: "/images/main/zone-1.png",
  },
  {
    id: 3,
    name: "Assembly & Packaging Zone",
    title: "조립 & 패키징 존",
    desc: "제작된 부품들을 조립하고 최종 검수하며, 제품 포장까지 마무리할 수 있는 넓고 쾌적한 공간입니다. 컨베이어 벨트 시뮬레이션 및 포장 기기가 구비되어 있습니다.",
    image: "/images/main/zone-1.png",
  },
  {
    id: 4,
    name: "Testing & Showcase Zone",
    title: "테스팅 & 쇼케이스 존",
    desc: "완성된 시제품의 성능을 테스트하고, 사진 촬영 및 전시를 할 수 있는 스튜디오형 공간입니다. 조명 장비와 배경지가 준비되어 있어 포트폴리오 제작에 용이합니다.",
    image: "/images/main/zone-1.png",
  },
  {
    id: 5,
    name: "Office & Lounge Zone",
    title: "오피스 & 라운지 존",
    desc: "제조 현장 바로 옆에서 설계 수정, 회의, 휴식을 취할 수 있는 업무 공간입니다. 고성능 PC와 편안한 소파가 마련되어 있어 아이디어를 구체화하기 좋습니다.",
    image: "/images/main/zone-1.png",
  },
  {
    id: 6,
    name: "Woodworking Studio Zone",
    title: "우드워킹 스튜디오 존",
    desc: "전문적인 목공 작업을 위한 집진 시설과 대형 목공 기계가 완비된 스튜디오입니다. 가구 제작부터 인테리어 소품까지 나무를 다루는 모든 작업이 가능합니다.",
    image: "/images/main/zone-1.png",
  },
];

const FactoryZoneSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const container = containerRef.current;
      if (!section || !container) return;

      ScrollTrigger.getAll()
        .filter((st) => st.trigger === section)
        .forEach((st) => st.kill(true));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => `+=${window.innerHeight * zones.length * 2.5}`,
        },
      });

      const totalPanels = zones.length;

      tl.to({}, { duration: 0.5 });

      zones.slice(1).forEach((_, index) => {
        const xPercentValue = (-100 * (index + 1)) / totalPanels;

        tl.to(container, {
          xPercent: xPercentValue,
          ease: "none",
          duration: 2,
        });

        tl.to({}, { duration: 1 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="factory-zone">
      <div
        ref={containerRef}
        className="factory-zone__container"
        style={{ width: `${zones.length * 100}vw` }}
      >
        {zones.map((zone, index) => (
          <div
            key={zone.id}
            className="factory-zone__section"
            style={{ backgroundImage: `url(${zone.image})` }}
          >
            <div className="factory-zone__overlay" />

            <div className="factory-zone__inner">
              <div className="factory-zone__left">
                <span className="zone-number">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(zones.length).padStart(2, "0")}
                </span>

                <span className="zone-subtitle">{zone.name}</span>

                <h2 className="zone-title">
                  Section {String(index + 1).padStart(2, "0")}.<br />
                  {zone.title.includes(". ")
                    ? zone.title.split(". ")[1]
                    : zone.title}
                </h2>

                <p className="zone-desc">{zone.desc}</p>

                <AnimatedButton
                  text="VR TOUR"
                  onClick={() => navigate("/vr-tour")}
                  className="vr-btn-custom"
                />
              </div>

              <div className="factory-zone__right">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="zone-grid-item">
                    <img
                      src={zone.image}
                      alt={`${zone.title} detail ${i}`}
                      className="zone-grid-img"
                      loading="lazy"
                    />
                    <div className="zone-grid-label">상세 이미지 {i}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FactoryZoneSection;
