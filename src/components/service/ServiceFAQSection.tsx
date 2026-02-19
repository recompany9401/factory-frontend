import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TextPlugin from "gsap/TextPlugin";
import "./ServiceFAQSection.css";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const faqList = [
  {
    id: 1,
    question: "기본적으로 제공되는 장비/공구가 있나요?",
    answer:
      "네, 전기 사용이 필요 없는 기본 수공구는 현장에서 기본 제공됩니다. 단, 섹션/작업 성격에 따라 제공 범위가 달라질 수 있습니다.",
  },
  {
    id: 2,
    question: "처음 이용하는 사람도 장비를 사용할 수 있나요?",
    answer:
      "가능합니다. 공장 내 관리 인원이 상주하고 있으며, 요청 시 장비 사용법을 안내해드립니다. 관리 인원 상주 시간은 평일 오전 9시부터 오후 6시입니다.",
  },
  {
    id: 3,
    question: "재료·소모품은 가져가야 하나요? 현장 구매도 가능한가요?",
    answer:
      "기본 제공 장비 외에 필요한 재료/소모품은 이용자가 직접 준비해야 합니다. 다만, 사전 신청 시 일부 품목은 현장에서 구매 가능합니다.",
  },
  {
    id: 4,
    question: "예약 변경·취소는 어떻게 하나요?",
    answer:
      "웹사이트 로그인 후 마이페이지에서 취소 가능합니다. 시스템상 예약 변경 기능은 제공되지 않으며, 기존 예약을 취소 후 재예약해야 합니다.",
  },
  {
    id: 5,
    question: "같은 날 여러 섹션을 연속으로 이용할 수 있나요?",
    answer:
      "네. 연속 이용 가능하며, 웹사이트 예약 과정에서 원하는 섹션/시간을 선택할 수 있습니다. 단, 이용 중 시간 연장 또는 공구/장비 추가 이용은 현장 상황(가용 여부)에 따라 불가할 수 있습니다.",
  },
  {
    id: 6,
    question: "기술지원/컨설팅은 어떻게 신청하나요?",
    answer:
      "기술지원(설계·제작·3D 프린팅 등)은 웹사이트 예약을 통해 신청할 수 있습니다. 또한 기술지원/컨설팅은 원활한 진행을 위해 예약 전 상담을 통해 범위와 방식이 확정됩니다.",
  },
];

const ServiceFAQSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      const targetText = "What can we help with?";

      gsap.to(titleRef.current, {
        duration: 2.5,
        text: targetText,
        ease: "none",
        repeat: -1,
        repeatDelay: 1.5,
        yoyo: true,
        delay: 0.8,
      });

      const cards = gsap.utils.toArray<HTMLElement>(
        ".faq-card",
        listRef.current
      );

      cards.forEach((card, i) => {
        const isLeft = i % 2 === 0;
        const xOffset = isLeft ? -100 : 100;

        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          x: xOffset,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="faq-section">
      <div className="faq-inner">
        <div className="faq-header">
          <div className="faq-icon-box">
            <img
              src="/icon/sub/bubble.png"
              alt="말풍선 아이콘"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
          <h2 ref={titleRef} className="faq-title"></h2>
        </div>

        <div ref={listRef} className="faq-list">
          {faqList.map((item, index) => (
            <div
              key={item.id}
              className={`faq-card ${index % 2 === 0 ? "left" : "right"}`}
            >
              <h3 className="faq-question">Q. {item.question}</h3>
              <p className="faq-answer">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceFAQSection;
