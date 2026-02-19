import React, {
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import axios, { AxiosError } from "axios";
import "./ResourceManagement.css";

interface Resource {
  id: string;
  name: string;
  type: "SECTION" | "EQUIPMENT";
  description: string | null;
  bookingUnit: "TIME" | "DAY";
  pricingRules?: { price: number }[];
  schedules?: { openTime: string; closeTime: string }[];
}

interface ResourceFormData {
  name: string;
  type: "SECTION" | "EQUIPMENT";
  description: string;
  bookingUnit: "TIME" | "DAY";
  hourlyPrice: number;
  businessHours: string;
}

const ResourceManagement: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<"SECTION" | "EQUIPMENT">(
    "SECTION",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewResource, setViewResource] = useState<Resource | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ResourceFormData>({
    name: "",
    type: "SECTION",
    description: "",
    bookingUnit: "TIME",
    hourlyPrice: 0,
    businessHours: "09:00 - 18:00",
  });

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<Resource[]>("/api/admin/resources");
      setResources(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "데이터 로드 실패:",
          error.response?.data || error.message,
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const filteredResources = resources.filter((res) => res.type === activeTab);

  const handleOpenModal = (resource?: Resource) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        name: resource.name,
        type: resource.type,
        description: resource.description || "",
        bookingUnit: resource.bookingUnit,
        hourlyPrice: resource.pricingRules?.[0]?.price || 0,
        businessHours: resource.schedules?.[0]
          ? `${resource.schedules[0].openTime} - ${resource.schedules[0].closeTime}`
          : "09:00 - 18:00",
      });
    } else {
      setEditingResource(null);
      setFormData({
        name: "",
        type: activeTab,
        description: "",
        bookingUnit: "TIME",
        hourlyPrice: 0,
        businessHours: "09:00 - 18:00",
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "hourlyPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await axios.patch(
          `/api/admin/resources/${editingResource.id}`,
          formData,
        );
      } else {
        await axios.post("/api/admin/resources", formData);
      }
      setIsModalOpen(false);
      fetchResources();
    } catch (error: unknown) {
      console.error("제출 오류:", error);
      alert("데이터 처리에 실패했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("정말 삭제하시겠습니까? 데이터는 아카이빙 처리됩니다."))
      return;
    try {
      await axios.delete(`/api/admin/resources/${id}`);
      fetchResources();
    } catch (error: unknown) {
      console.error("삭제 오류:", error);
      alert("삭제 처리에 실패했습니다.");
    }
  };

  return (
    <div className="admin-content-wrapper">
      <div className="admin-header-section">
        <div className="header-text">
          <h2>섹션 및 장비 관리</h2>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          + {activeTab === "SECTION" ? "섹션" : "장비"} 추가
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === "SECTION" ? "active" : ""}
          onClick={() => setActiveTab("SECTION")}
        >
          섹션 목록
        </button>
        <button
          className={activeTab === "EQUIPMENT" ? "active" : ""}
          onClick={() => setActiveTab("EQUIPMENT")}
        >
          장비 목록
        </button>
      </div>

      {loading ? (
        <div className="loading-state">데이터를 불러오는 중입니다...</div>
      ) : (
        <div className="resource-grid">
          {filteredResources.length === 0 ? (
            <div className="empty-state">해당 리소스가 없습니다.</div>
          ) : (
            filteredResources.map((res) => (
              <div
                key={res.id}
                className="resource-card"
                onClick={() => setViewResource(res)}
              >
                <div className="card-info">
                  <h3>{res.name}</h3>
                  <p className="description-preview">
                    {res.description || "설명이 없습니다."}
                  </p>
                  <span className="unit-tag">
                    {res.pricingRules?.[0]
                      ? `${res.pricingRules[0].price.toLocaleString()}원`
                      : "가격 미설정"}
                  </span>
                </div>
                <div
                  className="card-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleOpenModal(res)}
                    className="edit-link"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="delete-link"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {viewResource && (
        <div className="modal-overlay" onClick={() => setViewResource(null)}>
          <div
            className="modal-window detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>리소스 상세 정보</h3>
              <button className="close-x" onClick={() => setViewResource(null)}>
                &times;
              </button>
            </div>
            <div className="detail-content">
              <div className="detail-item">
                <label>명칭</label>
                <p className="detail-value">{viewResource.name}</p>
              </div>
              <div className="detail-item">
                <label>시간별 가격</label>
                <p className="detail-value highlight">
                  {viewResource.pricingRules?.[0]
                    ? `${viewResource.pricingRules[0].price.toLocaleString()}원 / 시간`
                    : "정보 없음"}
                </p>
              </div>
              <div className="detail-item">
                <label>운영 시간</label>
                <p className="detail-value">
                  {viewResource.schedules?.[0]
                    ? `${viewResource.schedules[0].openTime} - ${viewResource.schedules[0].closeTime}`
                    : "정보 없음"}
                </p>
              </div>
              <div className="detail-item">
                <label>설명</label>
                <div className="detail-description-box">
                  {viewResource.description || "등록된 설명이 없습니다."}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="save-btn"
                onClick={() => setViewResource(null)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingResource ? "정보 수정" : "새 리소스 등록"}</h3>
              <button className="close-x" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>명칭</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>시간당 대여 금액 (원)</label>
                <input
                  name="hourlyPrice"
                  type="number"
                  value={formData.hourlyPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>운영 시간 (예: 09:00-18:00)</label>
                <input
                  name="businessHours"
                  value={formData.businessHours}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>설명</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  취소
                </button>
                <button type="submit" className="save-btn">
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
