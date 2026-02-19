import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewsDetail.css";

// 인터페이스 정의 (새소식 타입에 맞춤)
interface NewsPostDetail {
  id: string;
  type: "NOTICE" | "PRESS";
  title: string;
  content: string;
  createdAt: string;
  prevPost?: { id: string; title: string } | null;
  nextPost?: { id: string; title: string } | null;
}

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<NewsPostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // [중요] 기존에 만든 상세 조회 API는 공용이므로 그대로 사용 가능
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error("상세 조회 실패:", error);
        alert("게시글을 불러올 수 없습니다.");
        navigate("/news"); // 에러 시 새소식 목록으로 이동
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="news-loading">내용을 불러오는 중...</div>;
  }

  if (!post) return null;

  return (
    <div className="news-detail-wrapper">
      <div className="news-detail-container">
        {/* 헤더 */}

        <div className="news-meta">
          <h1 className="news-title">{post.title}</h1>
          <span className="news-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <hr className="news-divider" />

        {/* 본문 */}
        <div
          className="news-content ql-editor"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <hr className="news-divider" />

        {/* 이전글 / 다음글 네비게이션 */}
        <div className="news-navigation">
          <div className="nav-item">
            <span className="nav-label">이전글</span>
            {post.prevPost ? (
              <span
                className="nav-title clickable"
                // [중요] /news 경로로 이동
                onClick={() => navigate(`/news/${post.prevPost!.id}`)}
              >
                {post.prevPost.title}
              </span>
            ) : (
              <span className="nav-title no-post">이전글이 없습니다.</span>
            )}
          </div>
          <div className="nav-item">
            <span className="nav-label">다음글</span>
            {post.nextPost ? (
              <span
                className="nav-title clickable"
                // [중요] /news 경로로 이동
                onClick={() => navigate(`/news/${post.nextPost!.id}`)}
              >
                {post.nextPost.title}
              </span>
            ) : (
              <span className="nav-title no-post">다음글이 없습니다.</span>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="news-actions">
          <button className="list-btn" onClick={() => navigate("/news")}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
