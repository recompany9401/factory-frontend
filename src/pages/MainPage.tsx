import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../App.css";
import WhySection from "../components/WhySection";
import FeaturesSection from "../components/FeaturesSection";
import HowSection from "../components/HowSection";
import ZoneSection from "../components/ZoneSection";
import NoticeSection from "../components/NoticeSection";
import ContactSection from "../components/ContactSection";
import InquirySection from "../components/InquirySection";
import MainPopup from "../components/MainPopup";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import useKillScrollTriggersOnUnmount from "../hooks/useKillScrollTriggersOnUnmount";

gsap.registerPlugin(ScrollTrigger);

interface PopupData {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
}

function MainPage() {
  useKillScrollTriggersOnUnmount();

  const heroRef = useRef<HTMLDivElement | null>(null);
  const pfIntroRef = useRef<HTMLElement | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const [popups, setPopups] = useState<PopupData[]>([]);

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const res = await axios.get("/api/popups");
        setPopups(res.data);
      } catch (error) {
        console.error("팝업 로드 실패:", error);
      }
    };
    fetchPopups();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero__eyebrow", {
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
      }).from(
        ".hero__title",
        {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.35",
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".pf-intro__line");

      lines.forEach((line, index) => {
        const fromX = index === 1 ? 80 : -80;

        gsap.fromTo(
          line,
          { x: fromX, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: line,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, pfIntroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {popups.length > 0 && <MainPopup popups={popups} />}

      <div className="hero" ref={heroRef}>
        <div className="hero__bg" />
        <div className="hero__overlay" />

        <main className="hero__inner">
          <p className="hero__eyebrow">YOUR FACTORY, ONLY WHEN YOU NEED IT</p>
          <h1 className="hero__title">
            Pop-up Factory, 필요할 때 열리는 나만의 공장
          </h1>
        </main>

        <div className="hero__scroll">
          <div className="hero__scroll-inner">
            <span>SCROLL</span>
            <div className="hero__scroll-line" />
          </div>
        </div>
      </div>

      <section className="pf-intro" ref={pfIntroRef}>
        <div className="pf-intro__inner">
          <p className="pf-intro__line">
            <span className="pf-intro__label">‘POP-UP FACTORY’는</span>
            <span className="pf-chip">공장을 소유하는 대신</span>
            <span>필요한 때에만</span>
          </p>

          <p className="pf-intro__line">
            <span className="pf-chip">시간·일 단위로 빌려 쓰는</span>
            <span>공유형 제조 공장입니다.</span>
          </p>

          <p className="pf-intro__line">
            <span>작업 공간, 제조 설비, 기술 컨설팅을</span>
            <span className="pf-chip">온디맨드로 연결</span>
            <span>합니다.</span>
          </p>
        </div>
      </section>

      <WhySection />
      <FeaturesSection />
      <HowSection />
      <ZoneSection />
      <NoticeSection />
      <ContactSection />
      <InquirySection />

      <button
        className={`scroll-to-top ${showTopBtn ? "show" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 4l-8 8h6v8h4v-8h6z" />
        </svg>
      </button>
    </>
  );
}

export default MainPage;
