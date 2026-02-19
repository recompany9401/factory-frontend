import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PolicyDetail.css";

interface PostDetail {
  id: string;
  type: "GOV_SUPPORT" | "POLICY";
  title: string;
  content: string;
  createdAt: string;
  prevPost?: { id: string; title: string } | null;
  nextPost?: { id: string; title: string } | null;
}

const PolicyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error("상세 조회 실패:", error);
        alert("게시글을 불러올 수 없습니다.");
        navigate("/policy");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="policy-loading">내용을 불러오는 중...</div>;
  }

  if (!post) return null;

  return (
    <div className="policy-detail-wrapper">
      <div className="policy-detail-container">
        <div className="policy-header">
          <h1 className="policy-title">{post.title}</h1>
          <span className="policy-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <hr className="policy-divider" />

        <div
          className="policy-content ql-editor"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <hr className="policy-divider" />

        <div className="post-navigation">
          <div className="nav-item">
            <span className="nav-label">이전글</span>
            {post.prevPost ? (
              <span
                className="nav-title clickable"
                onClick={() => navigate(`/policy/${post.prevPost!.id}`)}
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
                onClick={() => navigate(`/policy/${post.nextPost!.id}`)}
              >
                {post.nextPost.title}
              </span>
            ) : (
              <span className="nav-title no-post">다음글이 없습니다.</span>
            )}
          </div>
        </div>

        <div className="policy-actions">
          <button className="back-btn" onClick={() => navigate("/policy")}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetail;
