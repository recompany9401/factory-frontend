import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./WhySection.css";

gsap.registerPlugin(ScrollTrigger);

const WhySection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const bgBoxRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const itemLeftRef = useRef<HTMLDivElement>(null);
  const itemCenterRef = useRef<HTMLDivElement>(null);
  const itemRightRef = useRef<HTMLDivElement>(null);
  const finalCircleRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLHeadingElement>(null);
  const solutionContentRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const triggerEl = containerRef.current;
      if (!triggerEl) return;

      ScrollTrigger.getAll()
        .filter((st) => st.trigger === triggerEl)
        .forEach((st) => st.kill(true));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top top",
          end: "+=600%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(bgBoxRef.current, {
        width: "100%",
        height: "100vh",
        borderRadius: "0px",
        duration: 2,
        ease: "power2.inOut",
      })
        .to(
          titleRef.current,
          { scale: 0.5, y: -100, autoAlpha: 0, duration: 1 },
          "<"
        )
        .to(contentRef.current, { autoAlpha: 1, duration: 1 }, "-=1");

      tl.to(
        messageRef.current,
        { y: -50, autoAlpha: 0, duration: 2, ease: "power2.in" },
        "+=1"
      ).to(
        gridRef.current,
        { y: -100, duration: 2, ease: "power2.inOut" },
        "<"
      );

      tl.to(
        itemLeftRef.current,
        { x: "80%", scale: 0.9, duration: 3, ease: "power2.inOut" },
        "merge"
      )
        .to(
          itemRightRef.current,
          { x: "-80%", scale: 0.9, duration: 3, ease: "power2.inOut" },
          "merge"
        )
        .to(
          itemCenterRef.current,
          { scale: 0.9, duration: 3, ease: "power2.inOut" },
          "merge"
        );

      tl.to(
        [itemLeftRef.current, itemRightRef.current, itemCenterRef.current],
        { autoAlpha: 0, duration: 1, ease: "power2.in" },
        "merge+=2"
      );

      tl.to(
        finalCircleRef.current,
        { autoAlpha: 1, scale: 1, duration: 1, ease: "power2.inOut" },
        "merge+=2"
      );

      tl.to(centerTextRef.current, { autoAlpha: 1, duration: 1 }, "+=0.2");
      tl.to(centerTextRef.current, { autoAlpha: 0, duration: 0.5 }, "+=1");

      tl.to(
        finalCircleRef.current,
        { scale: 50, duration: 4, ease: "power1.in" },
        "expand"
      );

      tl.fromTo(
        solutionContentRef.current,
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" },
        "expand"
      );

      tl.fromTo(
        card1Ref.current,
        { autoAlpha: 0, rotationY: 360, x: -100 },
        {
          autoAlpha: 1,
          rotationY: 0,
          x: 0,
          duration: 1.5,
          ease: "back.out(1.2)",
        },
        "<+=0.5"
      );

      tl.fromTo(
        card2Ref.current,
        { autoAlpha: 0, rotationY: 360, x: -100 },
        {
          autoAlpha: 1,
          rotationY: 0,
          x: 0,
          duration: 1.5,
          ease: "back.out(1.2)",
        },
        ">-=0.8"
      );

      tl.fromTo(
        card3Ref.current,
        { autoAlpha: 0, rotationY: 360, x: -100 },
        {
          autoAlpha: 1,
          rotationY: 0,
          x: 0,
          duration: 1.5,
          ease: "back.out(1.2)",
        },
        ">-=0.8"
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="why-section">
      <div className="why-section__sticky">
        <div ref={bgBoxRef} className="why-section__bg-box">
          <h2 ref={titleRef} className="why-section__title">
            WHY A POP-UP FACTORY?
          </h2>
        </div>

        <div ref={contentRef} className="why-section__content">
          <div ref={messageRef} className="why-section__message">
            <span className="why-section__label">WHY A POP-UP FACTORY?</span>
            <h2>
              작은 제조를 하기엔,
              <br />
              공장은 너무 크고 비쌉니다.
            </h2>
          </div>

          <div ref={gridRef} className="why-section__grid">
            <div ref={finalCircleRef} className="why-section__final-circle">
              <h3 ref={centerTextRef} className="why-section__center-text">
                Pop-up Factory
              </h3>
            </div>

            <div ref={itemLeftRef} className="why-section__item">
              <div className="why-section__circle">
                <span className="why-section__circle-text">OVERHEAD</span>
                <h3>공장 임대비·설비 투자 부담</h3>
                <p>
                  공장 임대료와 설비 구입비가 커서
                  <br />
                  시작부터 고정비 부담이 큽니다.
                </p>
              </div>
            </div>

            <div ref={itemCenterRef} className="why-section__item">
              <div className="why-section__circle">
                <span className="why-section__circle-text">SPACE</span>
                <h3>소량 생산에 맞는 공간 부재</h3>
                <p>
                  대부분 공장은 단기간·소량 생산에
                  <br />
                  맞는 유연한 공간을 제공하지 못합니다.
                </p>
              </div>
            </div>

            <div ref={itemRightRef} className="why-section__item">
              <div className="why-section__circle">
                <span className="why-section__circle-text">COMPLIANCE</span>
                <h3>안전·인증·품질관리 부담</h3>
                <p>
                  안전·인증·품질관리를 해결하기엔
                  <br />
                  절차가 복잡하고 부담이 큽니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div ref={solutionContentRef} className="solution-overlay">
          <div className="solution-inner">
            <div className="solution-header">
              <span className="solution-subtitle">
                A SIMPLE WAY TO FIX THESE PROBLEMS
              </span>
              <h2 className="solution-title">
                이 문제를 Pop-up Factory가
                <br />
                해결해 드립니다.
              </h2>
            </div>

            <div className="solution-cards">
              <div ref={card1Ref} className="solution-card">
                <img
                  src="/icon/icon-idea.png"
                  alt="아이디어"
                  className="solution-card__icon"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <h3 className="solution-card__title">아이디어/브랜드</h3>
                <p className="solution-card__desc">
                  새로운 제품을 기획 중이지만,
                  <br />
                  아직 공장과 설비는 없는 단계입니다.
                </p>
              </div>

              <div ref={card2Ref} className="solution-card">
                <img
                  src="/icon/icon-hand.png"
                  alt="팩토리"
                  className="solution-card__icon"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <h3 className="solution-card__title">POP-UP FACTORY</h3>
                <p className="solution-card__desc">
                  아이디어가 우리 공장을 만나
                  <br />
                  본격적인 제작으로 넘어가는 단계
                </p>
              </div>

              <div ref={card3Ref} className="solution-card highlight">
                <img
                  src="/icon/icon-gear.png"
                  alt="양산"
                  className="solution-card__icon"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <h3 className="solution-card__title">
                  제품/프로토타입/소량양산
                </h3>
                <p className="solution-card__desc">
                  실제 공장 환경에서 검증된 제품,
                  <br />
                  프로토타입, 양산 결과로 이어집니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
