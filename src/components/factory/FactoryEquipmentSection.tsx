import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./FactoryEquipmentSection.css";

gsap.registerPlugin(ScrollTrigger);

const initialEquipmentData = [
  {
    id: 1,
    type: "공구",
    name: "커터칼",
    spec: "절단 / 정밀 가공용",
    count: 10,
    note: "기본 제공",
  },
  {
    id: 2,
    type: "기계",
    name: "3D 프린터",
    spec: "FDM 방식 / PLA, ABS 지원",
    count: 2,
    note: "-",
  },
  {
    id: 3,
    type: "공구",
    name: "전동 드릴",
    spec: "18V / 해머 기능 포함",
    count: 5,
    note: "기본 제공",
  },
  {
    id: 4,
    type: "기계",
    name: "CNC 라우터",
    spec: "4축 가공 / 알루미늄, 목재",
    count: 1,
    note: "교육 필요",
  },
  {
    id: 5,
    type: "공구",
    name: "용접기",
    spec: "TIG / MIG 겸용",
    count: 2,
    note: "전문가용",
  },
  {
    id: 6,
    type: "기계",
    name: "레이저 커터",
    spec: "100W CO2 / 아크릴, MDF",
    count: 1,
    note: "예약 필수",
  },
  {
    id: 7,
    type: "공구",
    name: "디지털 캘리퍼스",
    spec: "150mm / 0.01mm 단위",
    count: 5,
    note: "기본 제공",
  },
  {
    id: 8,
    type: "기계",
    name: "탁상 드릴링 머신",
    spec: "13mm 척 / 5단 속도 조절",
    count: 2,
    note: "-",
  },
  {
    id: 9,
    type: "공구",
    name: "샌딩기",
    spec: "원형 샌더 / 집진기 연결",
    count: 3,
    note: "소모품 별도",
  },
  {
    id: 10,
    type: "기계",
    name: "밴드쏘",
    spec: "목재 절단용 / 14인치",
    count: 1,
    note: "안전 주의",
  },
  {
    id: 11,
    type: "공구",
    name: "글루건",
    spec: "고온형 / 11mm 스틱",
    count: 5,
    note: "소모품 별도",
  },
  {
    id: 12,
    type: "기계",
    name: "진공 성형기",
    spec: "소형 / 몰드 제작 필요",
    count: 1,
    note: "-",
  },
];

const FactoryEquipmentSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(initialEquipmentData);
  const [visibleCount, setVisibleCount] = useState(5);

  const isExpanded = visibleCount >= filteredData.length;

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = initialEquipmentData.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        item.spec.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
    setVisibleCount(5);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, filteredData.length));
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(titleRef.current, {
        y: 50,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      tl.from(
        searchRef.current,
        {
          y: 30,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );

      tl.from(
        tableRef.current,
        {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      );

      if (moreBtnRef.current) {
        tl.from(
          moreBtnRef.current,
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="equipment-section">
      <div className="equipment-inner">
        <div ref={titleRef} className="eq-header">
          <span className="eq-subtitle">EQUIPMENT LIST</span>
          <h2 className="eq-title">보유 장비 리스트</h2>
        </div>

        <div ref={searchRef} className="eq-search-wrap">
          <div className="eq-search-box">
            <input
              type="text"
              className="eq-input"
              placeholder="장비명 또는 스펙을 검색해보세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="eq-search-btn" onClick={handleSearch}>
              <img src="/icon/sub/search_icon.png" alt="Search" />
            </button>
          </div>
        </div>

        <div
          ref={tableRef}
          className="eq-table-wrapper"
          style={{ width: "100%" }}
        >
          <div className="eq-info-text">
            <img
              src="/icon/sub/check_icon.png"
              alt="Check"
              className="eq-check-icon"
            />
            <span>재료·소모품 사전 신청 시 현장 구매 가능</span>
          </div>

          <div className="eq-table-container">
            <table className="eq-table">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>장비명</th>
                  <th>주요스펙</th>
                  <th>보유 수량</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.slice(0, visibleCount).map((item, index) => (
                    <tr
                      key={item.id}
                      className="eq-row-enter"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td>{item.type}</td>
                      <td>{item.name}</td>
                      <td>{item.spec}</td>
                      <td>{item.count}</td>
                      <td>{item.note}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px", color: "#888" }}>
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!isExpanded && (
          <div
            ref={moreBtnRef}
            className="eq-more-btn-wrap"
            onClick={handleLoadMore}
          >
            <svg
              className="eq-arrow-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            <span className="eq-more-text">더보기</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default FactoryEquipmentSection;
