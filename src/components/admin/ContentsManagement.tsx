import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import "./ContentsManagement.css";

type TabType = "POSTS" | "POPUPS";
type PostCategory = "GOV" | "NEWS";
type PostType = "GOV_SUPPORT" | "POLICY" | "NOTICE" | "PRESS";

interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string;
  thumbnailUrl: string | null;
  createdAt: string;
}

interface Popup {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

const CATEGORY_MAP: Record<string, string> = {
  GOV_SUPPORT: "정부지원",
  POLICY: "정책",
  NOTICE: "공지사항",
  PRESS: "보도자료",
};

const ContentsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("POSTS");
  const [postCategory, setPostCategory] = useState<PostCategory>("GOV");

  const [posts, setPosts] = useState<Post[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [viewPost, setViewPost] = useState<Post | null>(null);

  const [postForm, setPostForm] = useState({
    type: "GOV_SUPPORT" as PostType,
    title: "",
    content: "",
    thumbnailUrl: "",
  });

  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);
  const [popupForm, setPopupForm] = useState({
    title: "",
    imageUrl: "",
    linkUrl: "",
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);

  const getCategoryName = (type: string) => {
    return CATEGORY_MAP[type] || type;
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_preset");
    const cloudName = "dpi7ifygi";

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );
      return res.data.secure_url;
    } catch (error: unknown) {
      console.error("Cloudinary 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
      return null;
    }
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadToCloudinary(file);
    if (url) {
      setPostForm({ ...postForm, thumbnailUrl: url });
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const url = await uploadToCloudinary(file);

      if (url && quillRef.current) {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range ? range.index : 0, "image", url);
      }
    };
  }, []);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    };
  }, [imageHandler]);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/posts?limit=100");
      setPosts(res.data.data);
    } catch (error: unknown) {
      console.error("게시글 로드 실패:", error);
    }
  }, []);

  const fetchPopups = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/popups");
      setPopups(res.data);
    } catch (error: unknown) {
      console.error("팝업 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (activeTab === "POSTS") {
        await fetchPosts();
      } else {
        await fetchPopups();
      }
    };
    init();
  }, [activeTab, fetchPosts, fetchPopups]);

  const filteredPosts = useMemo(() => {
    if (postCategory === "GOV") {
      return posts.filter(
        (p) => p.type === "GOV_SUPPORT" || p.type === "POLICY",
      );
    } else {
      return posts.filter((p) => p.type === "NOTICE" || p.type === "PRESS");
    }
  }, [posts, postCategory]);

  const openEdit = (post?: Post) => {
    if (post) {
      setEditId(post.id);
      setPostForm({
        type: post.type,
        title: post.title,
        content: post.content,
        thumbnailUrl: post.thumbnailUrl || "",
      });
    } else {
      setEditId(null);
      setPostForm({
        type: postCategory === "GOV" ? "GOV_SUPPORT" : "NOTICE",
        title: "",
        content: "",
        thumbnailUrl: "",
      });
    }
    setIsEditing(true);
  };

  const handleSavePost = async () => {
    try {
      if (editId) {
        await axios.patch(`/api/admin/posts/${editId}`, postForm);
      } else {
        await axios.post("/api/admin/posts", postForm);
      }
      setIsEditing(false);
      setEditId(null);
      fetchPosts();
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "저장 실패");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/admin/posts/${id}`);
        fetchPosts();
      } catch (error: unknown) {
        console.error(error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const handleSavePopup = async () => {
    try {
      await axios.post("/api/admin/popups", {
        ...popupForm,
        startDate: new Date(popupForm.startDate),
        endDate: new Date(popupForm.endDate),
      });
      setIsPopupModalOpen(false);
      setPopupForm({ ...popupForm, title: "", imageUrl: "", linkUrl: "" });
      fetchPopups();
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "등록 실패");
      } else {
        alert("등록 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const togglePopupStatus = async (popup: Popup) => {
    try {
      await axios.patch(`/api/admin/popups/${popup.id}`, {
        isActive: !popup.isActive,
      });
      fetchPopups();
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "상태 변경 실패");
      } else {
        alert("상태 변경 중 오류가 발생했습니다.");
      }
    }
  };

  const deletePopup = async (id: string) => {
    if (window.confirm("팝업을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/admin/popups/${id}`);
        fetchPopups();
      } catch (error: unknown) {
        console.error(error);
        alert("삭제 실패");
      }
    }
  };

  return (
    <div className="contents-container">
      <div className="main-tabs">
        <button
          className={activeTab === "POSTS" ? "active" : ""}
          onClick={() => setActiveTab("POSTS")}
        >
          게시글 관리
        </button>
        <button
          className={activeTab === "POPUPS" ? "active" : ""}
          onClick={() => setActiveTab("POPUPS")}
        >
          팝업 관리
        </button>
      </div>

      {activeTab === "POSTS" && (
        <div className="posts-section">
          {!isEditing ? (
            <>
              <div className="category-tabs">
                <button
                  className={postCategory === "GOV" ? "active" : ""}
                  onClick={() => setPostCategory("GOV")}
                >
                  정부지원·정책
                </button>
                <button
                  className={postCategory === "NEWS" ? "active" : ""}
                  onClick={() => setPostCategory("NEWS")}
                >
                  새소식
                </button>
              </div>

              <div className="action-bar">
                <h3>목록 ({filteredPosts.length})</h3>
                <button className="primary-btn" onClick={() => openEdit()}>
                  + 글쓰기
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>분류</th>
                    <th>썸네일</th>
                    <th>제목</th>
                    <th>작성일</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-row">
                        게시글이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <span className="badge">
                            {getCategoryName(post.type)}
                          </span>
                        </td>
                        <td>
                          {post.thumbnailUrl ? (
                            <img
                              src={post.thumbnailUrl}
                              alt="thumb"
                              className="table-thumb"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td
                          className="text-left"
                          onClick={() => setViewPost(post)}
                          style={{
                            cursor: "pointer",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.textDecoration = "underline")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.textDecoration = "none")
                          }
                        >
                          {post.title}
                        </td>
                        <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="sm-btn"
                            onClick={() => openEdit(post)}
                          >
                            수정
                          </button>
                          <button
                            className="sm-btn danger"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <div className="editor-wrapper">
              <h3>{editId ? "게시글 수정" : "새 게시글 작성"}</h3>

              <div className="form-group">
                <label>분류</label>
                <select
                  value={postForm.type}
                  onChange={(e) =>
                    setPostForm({
                      ...postForm,
                      type: e.target.value as PostType,
                    })
                  }
                >
                  {postCategory === "GOV" ? (
                    <>
                      <option value="GOV_SUPPORT">정부지원</option>
                      <option value="POLICY">정책</option>
                    </>
                  ) : (
                    <>
                      <option value="NOTICE">공지사항</option>
                      <option value="PRESS">보도자료</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>제목</label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) =>
                    setPostForm({ ...postForm, title: e.target.value })
                  }
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div className="form-group">
                <label>썸네일 이미지</label>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                </div>
                {postForm.thumbnailUrl && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={postForm.thumbnailUrl}
                      alt="미리보기"
                      style={{
                        height: "100px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>내용</label>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  modules={modules}
                  value={postForm.content}
                  onChange={(val: string) =>
                    setPostForm({ ...postForm, content: val })
                  }
                  style={{ height: "300px", marginBottom: "50px" }}
                />
              </div>

              <div className="editor-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setIsEditing(false)}
                >
                  취소
                </button>
                <button className="primary-btn" onClick={handleSavePost}>
                  저장하기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "POPUPS" && (
        <div className="popups-section">
          <div className="action-bar">
            <div>
              <p className="info-text">
                최대 5개까지 '활성' 상태로 둘 수 있습니다. (현재 활성:{" "}
                <span style={{ color: "#f08b2e", fontWeight: "bold" }}>
                  {popups.filter((p) => p.isActive).length}
                </span>
                /5)
              </p>
            </div>
            <button
              className="primary-btn"
              onClick={() => setIsPopupModalOpen(true)}
            >
              + 팝업 등록
            </button>
          </div>

          <div className="popup-grid">
            {popups.map((popup) => (
              <div
                key={popup.id}
                className={`popup-card ${popup.isActive ? "active" : "inactive"}`}
              >
                <div className="popup-img-wrapper">
                  <img src={popup.imageUrl} alt={popup.title} />
                  <span className="status-badge">
                    {popup.isActive ? "노출중" : "비활성"}
                  </span>
                </div>
                <div className="popup-info">
                  <h4>{popup.title}</h4>
                  <p className="date">
                    {new Date(popup.startDate).toLocaleDateString()} ~{" "}
                    {new Date(popup.endDate).toLocaleDateString()}
                  </p>
                  <div className="popup-actions">
                    <button onClick={() => togglePopupStatus(popup)}>
                      {popup.isActive ? "숨기기" : "노출하기"}
                    </button>
                    <button
                      className="danger"
                      onClick={() => deletePopup(popup.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewPost && (
        <div className="modal-overlay" onClick={() => setViewPost(null)}>
          <div
            className="modal-window wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>게시글 상세 내용</h3>
              <button className="close-x" onClick={() => setViewPost(null)}>
                &times;
              </button>
            </div>
            <div className="detail-content scrollable">
              <div className="post-view-header">
                <span className="badge">{getCategoryName(viewPost.type)}</span>
                <h2>{viewPost.title}</h2>
                <p className="date">
                  {new Date(viewPost.createdAt).toLocaleDateString()}
                </p>
              </div>
              <hr />
              {viewPost.thumbnailUrl && (
                <div className="post-view-thumb">
                  <img src={viewPost.thumbnailUrl} alt="썸네일" />
                </div>
              )}
              <div
                className="post-view-body ql-editor"
                dangerouslySetInnerHTML={{ __html: viewPost.content }}
              />
            </div>
            <div className="modal-footer">
              <button className="primary-btn" onClick={() => setViewPost(null)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsPopupModalOpen(false)}
        >
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>새 팝업 등록</h3>
              <button
                className="close-x"
                onClick={() => setIsPopupModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="detail-content">
              <div className="form-group">
                <label>제목 (관리용)</label>
                <input
                  type="text"
                  value={popupForm.title}
                  onChange={(e) =>
                    setPopupForm({ ...popupForm, title: e.target.value })
                  }
                  placeholder="예: 2월 설날 이벤트"
                />
              </div>
              <div className="form-group">
                <label>이미지 URL</label>
                <input
                  type="text"
                  value={popupForm.imageUrl}
                  placeholder="https://... (직접 입력 또는 업로드)"
                  onChange={(e) =>
                    setPopupForm({ ...popupForm, imageUrl: e.target.value })
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  style={{ marginTop: "5px" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadToCloudinary(file);
                      if (url)
                        setPopupForm((prev) => ({ ...prev, imageUrl: url }));
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label>링크 URL (선택)</label>
                <input
                  type="text"
                  value={popupForm.linkUrl}
                  placeholder="클릭 시 이동할 주소"
                  onChange={(e) =>
                    setPopupForm({ ...popupForm, linkUrl: e.target.value })
                  }
                />
              </div>
              <div className="form-group-row">
                <div>
                  <label>시작일</label>
                  <input
                    type="date"
                    value={popupForm.startDate}
                    onChange={(e) =>
                      setPopupForm({ ...popupForm, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>종료일</label>
                  <input
                    type="date"
                    value={popupForm.endDate}
                    onChange={(e) =>
                      setPopupForm({ ...popupForm, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="secondary-btn"
                onClick={() => setIsPopupModalOpen(false)}
              >
                취소
              </button>
              <button className="primary-btn" onClick={handleSavePopup}>
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentsManagement;
