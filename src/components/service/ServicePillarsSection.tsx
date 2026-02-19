import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServicePillarsSection.css";

gsap.registerPlugin(ScrollTrigger);

const ServicePillarsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const titleLineRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      tl.from(".pillars-point", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      tl.from(
        ".pillars-title-text",
        {
          y: "100%",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=0.3"
      );

      tl.from(
        ".pillars-desc",
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      );

      tl.from(
        rightColRef.current,
        {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="pillars-section">
      <div className="pillars-container">
        <div ref={leftColRef} className="pillars-text-col">
          <span className="pillars-point">SERVICE PILLARS</span>

          <h3 ref={titleLineRef} className="pillars-title">
            <span className="title-mask">
              <span className="pillars-title-text">공간·장비·기술을</span>
            </span>
            <br />
            <span className="title-mask">
              <span className="pillars-title-text">
                <span>하나로 연결</span>합니다.
              </span>
            </span>
          </h3>

          <p className="pillars-desc">
            공간에서 시작해 장비와 기술 지원까지,
            <br />
            필요한 단계만 선택해 비용과 시간을
            <br className="mo-only" />
            효율적으로 줄일 수 있습니다.
          </p>
        </div>

        <div ref={rightColRef} className="pillars-image-col">
          <img
            src="/images/sub/factory_robot.png"
            alt="Robotic Arm in Factory"
            className="pillars-img"
          />
        </div>
      </div>
    </section>
  );
};

export default ServicePillarsSection;
