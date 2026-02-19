import { useState, useRef, useLayoutEffect, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./NewsListSection.css";

gsap.registerPlugin(ScrollTrigger);

interface Post {
  id: string;
  type: "NOTICE" | "PRESS";
  title: string;
  thumbnailUrl: string | null;
  createdAt: string;
}

const TYPE_MAP: Record<string, string> = {
  NOTICE: "공지사항",
  PRESS: "보도자료",
};

const NewsListSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/posts?section=news");
        setPosts(res.data);
      } catch (error) {
        console.error("새소식 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredData = useMemo(() => {
    return posts.filter((item) => {
      const categoryKr = TYPE_MAP[item.type];
      const tabMatch = activeTab === "전체" || categoryKr === activeTab;

      const searchMatch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return tabMatch && searchMatch;
    });
  }, [posts, activeTab, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCardClick = (id: string) => {
    navigate(`/news/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  useLayoutEffect(() => {
    if (!gridRef.current || loading) return;

    const ctx = gsap.context(() => {
      if (gridRef.current && gridRef.current.children.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [activeTab, currentPage, loading, currentData]);

  return (
    <section ref={sectionRef} className="news-list-section">
      <div className="news-list__inner">
        <div className="news-list__controls">
          <div className="news-tabs">
            {["전체", "공지사항", "보도자료"].map((tab) => (
              <button
                key={tab}
                className={`news-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="news-search">
            <input
              type="text"
              className="news-search__input"
              placeholder="검색어를 입력해주세요"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="news-search__btn">
              <img
                src="/icon/sub/search_icon.png"
                alt="검색"
                className="news-search__icon"
              />
            </button>
          </div>
        </div>

        {loading ? (
          <div
            className="loading-state"
            style={{ textAlign: "center", padding: "100px 0" }}
          >
            로딩 중...
          </div>
        ) : (
          <div ref={gridRef} className="news-grid">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <div
                  key={item.id}
                  className="news-card"
                  onClick={() => handleCardClick(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="news-card__thumb">
                    <img
                      src={
                        item.thumbnailUrl || "/images/sub/news_thumb_sample.jpg"
                      }
                      alt={item.title}
                      className="news-card__img"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.style.backgroundColor =
                            "#f0f0f0";
                        }
                      }}
                    />
                  </div>
                  <div className="news-card__content">
                    <span
                      className={`news-card__category ${item.type === "NOTICE" ? "notice" : "press"}`}
                    >
                      {TYPE_MAP[item.type]}
                    </span>
                    <h3 className="news-card__title">{item.title}</h3>
                    <span className="news-card__date">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "100px 0",
                  color: "#888",
                }}
              >
                {searchTerm
                  ? "검색 결과가 없습니다."
                  : "등록된 새소식이 없습니다."}
              </div>
            )}
          </div>
        )}

        {!loading && currentData.length > 0 && (
          <div className="news-pagination">
            <button
              className="pagination-btn pagination-nav"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              &lt; 이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn pagination-nav"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              다음 &gt;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsListSection;
