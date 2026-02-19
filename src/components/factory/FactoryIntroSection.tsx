import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./FactoryIntroSection.css";

gsap.registerPlugin(ScrollTrigger);

const FactoryIntroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".factory-intro__line");

      lines.forEach((line, index) => {
        const fromX = index % 2 === 0 ? -80 : 80;

        gsap.fromTo(
          line,
          {
            x: fromX,
            autoAlpha: 0,
          },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="factory-intro">
      <div className="factory-intro__inner">
        <p className="factory-intro__line">
          <span className="factory-chip">시제품 제작에 최적화된</span>
          <span>POP-UP FACTORY를 소개합니다.</span>
        </p>

        <p className="factory-intro__line">
          <span>필요한 리소스만 선택해 비용을 줄이고,</span>
          <span className="factory-chip">준비-제작-개선까지</span>
        </p>

        <p className="factory-intro__line">
          <span>한 흐름으로 이어가 시간을 단축할 수 있습니다.</span>
        </p>
      </div>
    </section>
  );
};

export default FactoryIntroSection;
