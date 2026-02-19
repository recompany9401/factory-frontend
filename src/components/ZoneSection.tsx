import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./ZoneSection.css";

gsap.registerPlugin(ScrollTrigger);

const zones = [
  {
    id: 1,
    name: "Making & Fabrication Zone",
    title: "Section 01. 메이킹 & 패브리케이션 존",
    desc: "기본 가공 장비와 작업대가 모여 있어, 목공·간단한 금속 가공·프로토타입 제작 등 '처음 형태를 만들어내는' 작업에 적합한 구역입니다. 다양한 수공구와 전동공구를 자유롭게 사용할 수 있습니다.",
    image: "/images/main/zone-1.png",
  },
  {
    id: 2,
    name: "Frame & Structure Zone",
    title: "Section 02. 프레임 & 스트럭처 존",
    desc: "대형 구조물이나 프레임 제작을 위한 용접 및 금속 가공 특화 구역입니다. 안전한 용접 부스와 정밀 절단 장비를 갖추고 있어 튼튼한 골격을 제작할 수 있습니다.",
    image: "/images/main/zone-1.png",
  },
  {
    id: 3,
    name: "Assembly & Packaging Zone",
    title: "Section 03. 조립 & 패키징 존",
    desc: "제작된 부품들을 조립하고 최종 검수하며, 제품 포장까지 마무리할 수 있는 넓고 쾌적한 공간입니다. 컨베이어 벨트 시뮬레이션 및 포장 기기가 구비되어 있습니다.",
    image: "/images/main/zone-1.png",
  },
  {
    id: 4,
    name: "Testing & Showcase Zone",
    title: "Section 04. 테스팅 & 쇼케이스 존",
    desc: "완성된 시제품의 성능을 테스트하고, 사진 촬영 및 전시를 할 수 있는 스튜디오형 공간입니다. 조명 장비와 배경지가 준비되어 있어 포트폴리오 제작에 용이합니다.",
    image: "/images/main/zone-1.png",
  },
  {
    id: 5,
    name: "Office & Lounge Zone",
    title: "Section 05. 오피스 & 라운지 존",
    desc: "제조 현장 바로 옆에서 설계 수정, 회의, 휴식을 취할 수 있는 업무 공간입니다. 고성능 PC와 편안한 소파가 마련되어 있어 아이디어를 구체화하기 좋습니다.",
    image: "/images/main/zone-1.png",
  },
  {
    id: 6,
    name: "Woodworking Studio Zone",
    title: "Section 06. 우드워킹 스튜디오 존",
    desc: "전문적인 목공 작업을 위한 집진 시설과 대형 목공 기계가 완비된 스튜디오입니다. 가구 제작부터 인테리어 소품까지 나무를 다루는 모든 작업이 가능합니다.",
    image: "/images/main/zone-1.png",
  },
];

const ZoneSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % zones.length);
    }, 4000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(headerRef.current, {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
      }).from(
        contentRef.current,
        {
          y: 50,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }, containerRef);

    startAutoPlay();

    return () => {
      ctx.revert();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    startAutoPlay();
  };

  return (
    <section ref={containerRef} className="zone-section">
      <div className="zone-inner">
        <div ref={headerRef} className="zone-header">
          <span className="zone-subtitle">MEET POP-UP FACTORY</span>
          <h2 className="zone-title">POP-UP FACTORY를 소개합니다.</h2>
        </div>

        <div ref={contentRef} className="zone-content-wrapper">
          <div className="zone-left-container">
            {zones.map((zone, index) => (
              <div
                key={zone.id}
                className={`zone-display-item ${
                  index === activeIndex ? "active" : ""
                }`}
              >
                <div className="zone-image-box">
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="zone-image"
                    onError={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ddd")
                    }
                  />
                </div>
                <div className="zone-info">
                  <h3>{zone.title}</h3>
                  <p>{zone.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="zone-list">
            {zones.map((zone, index) => (
              <div
                key={zone.id}
                className={`zone-list-item ${
                  index === activeIndex ? "active" : ""
                }`}
                onClick={() => handleItemClick(index)}
              >
                {zone.name}
                <span className="zone-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZoneSection;
