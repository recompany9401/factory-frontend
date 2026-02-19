import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./NoticeSection.css";

gsap.registerPlugin(ScrollTrigger);

const notices = [
  {
    id: 1,
    category: "자금지원",
    title: "2026년 중소기업 정책자금 융자계획 공고",
    date: "2025.12.20",
  },
  {
    id: 2,
    category: "기술지원",
    title: "제조 데이터 활용 AI 솔루션 실증 지원사업 모집",
    date: "2025.12.18",
  },
  {
    id: 3,
    category: "교육",
    title: "2026년 의창도서관과 겨울방학특강 수강생 모집",
    date: "2025.12.10",
  },
  {
    id: 4,
    category: "시설지원",
    title: "스마트공장 보급·확산사업 참여기업 추가 모집",
    date: "2025.12.05",
  },
  {
    id: 5,
    category: "수출지원",
    title: "해외 규격 인증 획득 지원사업 참여 기업 모집",
    date: "2025.11.28",
  },
  {
    id: 6,
    category: "인력지원",
    title: "청년 디지털 일자리 사업 참여 기업 모집 공고",
    date: "2025.11.20",
  },
  {
    id: 7,
    category: "행사",
    title: "2025 경남 창원 제조 혁신 컨퍼런스 개최 안내",
    date: "2025.11.15",
  },
];

const NoticeSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(2);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? notices.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === notices.length - 1 ? 0 : prev + 1));
  };

  const getItemClass = (index: number) => {
    if (index === activeIndex) return "active";

    const len = notices.length;
    const diff = (index - activeIndex + len) % len;

    if (diff === len - 1) return "prev";
    if (diff === 1) return "next";
    if (diff === len - 2) return "far-prev";
    if (diff === 2) return "far-next";

    return "hidden";
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(carouselRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
        },
        y: 50,
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="notice-section">
      <div className="notice-inner">
        <div ref={headerRef} className="notice-header">
          <span className="notice-subtitle">PUBLIC SUPPORT & POLICY HUB</span>
          <h2 className="notice-title">정부지원·정책 정보</h2>
        </div>

        <div ref={carouselRef} className="notice-carousel">
          <button
            className="notice-nav-btn prev"
            onClick={handlePrev}
            aria-label="이전 공지"
          >
            <svg className="notice-arrow-svg" viewBox="0 0 30 60">
              <polyline points="28 2 2 30 28 58" />
            </svg>
          </button>

          <div className="notice-list">
            {notices.map((notice, index) => (
              <div
                key={notice.id}
                className={`notice-item ${getItemClass(index)}`}
              >
                <span className="notice-badge">{notice.category}</span>
                <span className="notice-text">{notice.title}</span>
                <span className="notice-date">{notice.date}</span>
              </div>
            ))}
          </div>

          <button
            className="notice-nav-btn next"
            onClick={handleNext}
            aria-label="다음 공지"
          >
            <svg className="notice-arrow-svg" viewBox="0 0 30 60">
              <polyline points="2 2 28 30 2 58" />
            </svg>
          </button>
        </div>
      </div>

      <div className="notice-marquee">
        <div className="marquee-track">
          <span className="marquee-content">
            PUBLIC SUPPORT · GRANTS & PROGRAMS
          </span>
          <span className="marquee-content">
            PUBLIC SUPPORT · GRANTS & PROGRAMS
          </span>
          <span className="marquee-content">
            PUBLIC SUPPORT · GRANTS & PROGRAMS
          </span>
          <span className="marquee-content">
            PUBLIC SUPPORT · GRANTS & PROGRAMS
          </span>
        </div>
      </div>
    </section>
  );
};

export default NoticeSection;
