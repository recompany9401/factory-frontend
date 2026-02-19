import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServiceConcept.css";

gsap.registerPlugin(ScrollTrigger);

const words = ["One-Stop", "Complete"];

const ServiceConcept: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descWrapperRef = useRef<HTMLDivElement>(null);

  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setCurrentText(
        isDeleting
          ? fullText.substring(0, currentText.length - 1)
          : fullText.substring(0, currentText.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, typingSpeed]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      introTl
        .from(titleRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          descWrapperRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        );

      const fillTl = gsap.timeline({
        scrollTrigger: {
          trigger: descWrapperRef.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: 1.5,
        },
      });

      fillTl.to(
        ".desc-line.line-1",
        {
          backgroundPosition: "0% 0%",
          ease: "none",
          duration: 1,
        },
        0
      );

      fillTl.to(
        ".desc-line.line-2",
        {
          backgroundPosition: "0% 0%",
          ease: "none",
          duration: 1,
        },
        0.5
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="service-concept-section">
      <div className="concept-container">
        <h2 ref={titleRef} className="concept-title">
          <span className="typing-text">
            {currentText}
            <span className="cursor">|</span>
          </span>
          <span className="static-text"> Manufacturing Service</span>
        </h2>
        <div ref={descWrapperRef} className="concept-desc-wrapper">
          <p className="desc-line line-1">
            공간 임대부터 시제품 제작 컨설팅, 정부지원 연계까지.
          </p>
          <p className="desc-line line-2">
            제조업의 장벽을 낮추는 리컴퍼니만의 서비스를 소개합니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServiceConcept;
