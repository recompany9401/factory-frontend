import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Wrench,
  Info,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import "./ReservationForm.css";

gsap.registerPlugin(ScrollTrigger);

interface PortOnePaymentRequest {
  storeId: string;
  channelKey: string;
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency: string;
  payMethod: string;
  customer: {
    customerId?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
  windowType?: {
    pc?: string;
    mobile?: string;
  };
}

interface PortOnePaymentResponse {
  code: string | null;
  message?: string;
  paymentId?: string;
}

interface PortOneSDK {
  requestPayment: (
    options: PortOnePaymentRequest,
  ) => Promise<PortOnePaymentResponse>;
}

declare global {
  interface Window {
    PortOne?: PortOneSDK;
  }
}

interface Resource {
  id: string;
  name: string;
  category: "SPACE" | "EQUIPMENT";
  description?: string;
  price?: number;
}

interface CartItem {
  resourceId: string;
  resourceName: string;
  category: "SPACE" | "EQUIPMENT";
  date: string;
  startAt: string;
  endAt: string;
}

interface BookedSlot {
  resourceId: string;
  startAt: string;
  endAt: string;
}

const ReservationForm = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("처리 중...");

  const [isComplete, setIsComplete] = useState(false);

  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState("");

  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);

  const [resources, setResources] = useState<Resource[]>([]);
  const [tempTimes, setTempTimes] = useState<
    Record<string, { start: string; end: string }>
  >({});

  const [cart, setCart] = useState<CartItem[]>([]);

  const hasSpaceSelected = cart.some((item) => item.category === "SPACE");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    fetchResources();

    const script = document.createElement("script");
    script.src = "https://cdn.portone.io/v2/browser-sdk.js";
    script.async = true;
    document.body.appendChild(script);

    if (!isComplete && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          containerRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
        );
      }, containerRef);
      return () => ctx.revert();
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isComplete]);

  const fetchResources = async () => {
    try {
      const res = await axios.get("/api/resources");
      setResources(res.data);
    } catch (error) {
      console.error("자원 로드 실패", error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setInsuranceFile(e.target.files[0]);
  };

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();
  const handlePrevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const handleNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );

  const handleDateClick = async (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");
    const fullDate = `${year}-${month}-${date}`;

    if (selectedDateStr !== fullDate) {
      setSelectedDateStr(fullDate);
      setCart([]);
      setTempTimes({});

      try {
        const res = await axios.get(
          `/api/reservations/booked?date=${fullDate}`,
        );
        setBookedSlots(res.data);
      } catch (error) {
        console.error("예약 현황 조회 실패", error);
        setBookedSlots([]);
      }
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    const now = new Date();
    const currentHour = now.getHours();

    const isToday =
      selectedDateStr ===
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    for (let h = 9; h <= 18; h++) {
      if (!isToday || h > currentHour) {
        times.push(`${String(h).padStart(2, "0")}:00`);
        if (h !== 18) times.push(`${String(h).padStart(2, "0")}:30`);
      }
    }
    return times;
  };
  const timeOptions = selectedDateStr ? generateTimeOptions() : [];

  const handleTimeChange = (
    resourceId: string,
    type: "start" | "end",
    value: string,
  ) => {
    setTempTimes((prev) => ({
      ...prev,
      [resourceId]: { ...prev[resourceId], [type]: value },
    }));
  };

  const isTimeBlocked = (resourceId: string, timeStr: string) => {
    const checkTime = new Date(`${selectedDateStr}T${timeStr}:00`);
    return bookedSlots.some((slot) => {
      if (slot.resourceId !== resourceId) return false;
      const start = new Date(slot.startAt);
      const end = new Date(slot.endAt);
      return checkTime >= start && checkTime < end;
    });
  };

  const handleAddToCart = (resource: Resource) => {
    const times = tempTimes[resource.id];
    if (!times?.start || !times?.end)
      return alert("시작 및 종료 시간을 선택해주세요.");
    if (times.start >= times.end)
      return alert("종료 시간은 시작 시간보다 뒤여야 합니다.");

    const isExist = cart.some((item) => item.resourceId === resource.id);
    if (isExist) return alert("이미 목록에 추가된 자원입니다.");

    setCart((prev) => [
      ...prev,
      {
        resourceId: resource.id,
        resourceName: resource.name,
        category: resource.category,
        date: selectedDateStr,
        startAt: times.start,
        endAt: times.end,
      },
    ]);
  };

  const handlePaymentAndReservation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!insuranceFile) return alert("보험 서류가 필요합니다.");
    if (cart.length === 0) return alert("예약할 자원을 선택해주세요.");
    if (!window.PortOne) {
      alert("결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setLoading(true);
    setLoadingText("예약 생성 중...");

    let createdReservationId: string | null = null;

    try {
      const formData = new FormData();
      formData.append("insuranceFile", insuranceFile);
      const itemsPayload = cart.map((item) => ({
        resourceId: item.resourceId,
        startAt: new Date(`${item.date}T${item.startAt}:00`).toISOString(),
        endAt: new Date(`${item.date}T${item.endAt}:00`).toISOString(),
        quantity: 1,
      }));
      formData.append("items", JSON.stringify(itemsPayload));

      const createRes = await axios.post("/api/reservations", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const reservation = createRes.data;
      createdReservationId = reservation.id;

      if (!createdReservationId) throw new Error("예약 ID 생성 실패");

      setLoadingText("결제 준비 중...");
      const checkoutRes = await axios.post(
        "/api/payments/checkout",
        { reservationId: createdReservationId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const {
        storeId,
        channelKey,
        paymentId,
        orderName,
        totalAmount,
        currency,
        customer,
      } = checkoutRes.data;

      setLoadingText("결제 진행 중...");
      const paymentResponse = await window.PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName,
        totalAmount,
        currency,
        payMethod: "CARD",
        customer,
        windowType: { pc: "IFRAME", mobile: "POPUP" },
      });

      if (paymentResponse.code != null) {
        await axios.post(
          `/api/reservations/${createdReservationId}/cancel`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        alert(`결제가 취소되었거나 실패했습니다.`);
        setLoading(false);
        return;
      }

      setLoadingText("결제 확인 중...");
      await axios.post(
        "/api/payments/complete",
        { paymentId: paymentResponse.paymentId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setIsComplete(true);
    } catch (error) {
      console.error(error);

      if (createdReservationId) {
        try {
          await axios.post(
            `/api/reservations/${createdReservationId}/cancel`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
        } catch (cancelError) {
          console.error("예약 자동 취소 실패:", cancelError);
        }
      }

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401)
          alert("로그인 세션이 만료되었습니다.");
        else if (error.response?.status === 409)
          alert(`예약 실패: ${error.response.data.message}`);
        else if (error.response?.status === 500)
          alert("서버 오류: 관리자에게 문의하세요.");
        else
          alert(
            `오류 발생: ${error.response?.data?.message || "알 수 없는 오류"}`,
          );
      } else {
        alert("진행 중 예기치 않은 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = res.data.user;

      if (user.userRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/mypage", { state: { tab: "reservations" } });
      }
    } catch (error) {
      console.error("유저 정보 확인 실패:", error);
      navigate("/mypage");
    }
  };

  const spaceResources = resources.filter((r) => r.category === "SPACE");
  const equipmentResources = resources.filter(
    (r) => r.category === "EQUIPMENT",
  );

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++)
      days.push(<div key={`empty-${i}`} className="cal-day empty"></div>);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      dateObj.setHours(0, 0, 0, 0);
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isSelected = selectedDateStr === dateStr;
      const isToday = dateObj.getTime() === today.getTime();
      const isPast = dateObj < today;

      days.push(
        <button
          key={d}
          type="button"
          className={`cal-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
          onClick={() => !isPast && handleDateClick(d)}
          disabled={isPast}
        >
          {d}
        </button>,
      );
    }
    return days;
  };

  const renderResourceCard = (res: Resource) => {
    const isInCart = cart.some((item) => item.resourceId === res.id);
    return (
      <div key={res.id} className={`res-card ${isInCart ? "active" : ""}`}>
        <div className="res-card-header">
          <span className={`res-badge ${res.category}`}>
            {res.category === "SPACE" ? (
              <MapPin size={12} />
            ) : (
              <Wrench size={12} />
            )}
            {res.category}
          </span>
          <h4>{res.name}</h4>
        </div>
        <div className="res-card-info">
          <p className="res-desc">
            <Info size={12} style={{ marginRight: 4, display: "inline" }} />
            {res.description || "설명 없음"}
          </p>
          <p className="res-price">
            {res.price ? `${res.price.toLocaleString()}원 / 30분` : "가격 문의"}
          </p>
        </div>
        <div className="res-time-picker">
          <select
            onChange={(e) => handleTimeChange(res.id, "start", e.target.value)}
            value={tempTimes[res.id]?.start || ""}
          >
            <option value="">시작</option>
            {timeOptions.map((t) => {
              const blocked = isTimeBlocked(res.id, t);
              return (
                <option
                  key={t}
                  value={t}
                  disabled={blocked}
                  style={{ color: blocked ? "#ccc" : "inherit" }}
                >
                  {t} {blocked ? "(마감)" : ""}
                </option>
              );
            })}
          </select>
          <span>~</span>
          <select
            onChange={(e) => handleTimeChange(res.id, "end", e.target.value)}
            value={tempTimes[res.id]?.end || ""}
          >
            <option value="">종료</option>
            {timeOptions.map((t) => {
              const blocked =
                isTimeBlocked(res.id, t) && t !== tempTimes[res.id]?.start;
              return (
                <option
                  key={t}
                  value={t}
                  disabled={blocked}
                  style={{ color: blocked ? "#ccc" : "inherit" }}
                >
                  {t} {blocked ? "(마감)" : ""}
                </option>
              );
            })}
          </select>
        </div>
        <button
          type="button"
          className="add-cart-btn"
          onClick={() => handleAddToCart(res)}
          disabled={isInCart}
        >
          {isInCart ? "선택됨" : "담기"}
        </button>
      </div>
    );
  };

  return (
    <section className="res-form-section">
      <h1 className="reservation-title">예약하기</h1>
      <div ref={containerRef} className="res-form-container">
        {isComplete ? (
          <div className="res-success-view">
            <div className="success-icon-wrapper">
              <CheckCircle size={64} color="#91c31d" />
            </div>
            <h2>결제가 성공적으로 완료되었습니다!</h2>
            <p>
              예약이 확정되었습니다. 자세한 내용은 예약 내역에서 확인하세요.
            </p>
            <button
              className="final-submit-btn"
              onClick={handleNavigateToHistory}
            >
              예약내역 확인하기
            </button>
          </div>
        ) : (
          <>
            <div className="res-section-block">
              <div className="block-header">
                <span className="block-num">01</span>
                <h3>산재보험 서류 확인</h3>
              </div>
              <div className="block-content">
                <label className="file-drop-zone">
                  <input
                    type="file"
                    accept=".jpg,.png,.pdf"
                    onChange={handleFileChange}
                  />
                  <div className="file-desc">
                    {insuranceFile ? (
                      <span className="file-success">
                        <Check size={16} /> {insuranceFile.name}
                      </span>
                    ) : (
                      <span>산재보험 가입 증명서 업로드 (필수)</span>
                    )}
                  </div>
                </label>
                <label className="res-checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span>
                    [필수] 산재보험 가입 사실을 확인하였으며 이에 동의합니다.
                  </span>
                </label>
              </div>
            </div>

            {insuranceFile && agreed && (
              <div className="res-section-block fade-in">
                <div className="block-header">
                  <span className="block-num">02</span>
                  <h3>예약 날짜 선택</h3>
                </div>
                <div className="block-content">
                  <div className="custom-calendar">
                    <div className="cal-header">
                      <button type="button" onClick={handlePrevMonth}>
                        <ChevronLeft />
                      </button>
                      <span className="cal-title">
                        {currentDate.getFullYear()}년{" "}
                        {currentDate.getMonth() + 1}월
                      </span>
                      <button type="button" onClick={handleNextMonth}>
                        <ChevronRight />
                      </button>
                    </div>
                    <div className="cal-weekdays">
                      {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>
                    <div className="cal-grid">{renderCalendar()}</div>
                  </div>
                  {selectedDateStr && (
                    <p className="selected-date-msg">
                      선택된 날짜: <strong>{selectedDateStr}</strong>
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedDateStr && (
              <div className="res-section-block fade-in">
                <div className="block-header">
                  <span className="block-num">03</span>
                  <h3>공간 선택 (Section)</h3>
                </div>
                <div className="block-content">
                  <div className="resource-grid">
                    {spaceResources.map((res) => renderResourceCard(res))}
                  </div>
                </div>
              </div>
            )}

            {hasSpaceSelected && (
              <div className="res-section-block fade-in">
                <div className="block-header">
                  <span className="block-num">04</span>
                  <h3>장비 선택 (Equipment)</h3>
                </div>
                <div className="block-content">
                  <p className="section-desc">
                    선택한 공간에서 사용할 장비를 추가하세요.
                  </p>
                  <div className="resource-grid">
                    {equipmentResources.map((res) => renderResourceCard(res))}
                  </div>
                </div>
              </div>
            )}

            {cart.length > 0 && (
              <div className="res-section-block fade-in">
                <div className="block-header">
                  <span className="block-num">05</span>
                  <h3>예약 목록 및 결제</h3>
                </div>
                <div className="block-content">
                  <ul className="cart-list">
                    {cart.map((item, idx) => (
                      <li key={idx} className="cart-item">
                        <div className="cart-info">
                          <span className={`res-badge ${item.category}`}>
                            {item.category}
                          </span>
                          <strong>{item.resourceName}</strong>
                          <span>
                            {item.date} | {item.startAt} ~ {item.endAt}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() =>
                            setCart((prev) => prev.filter((_, i) => i !== idx))
                          }
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="submit-area">
                    <button
                      type="button"
                      className="final-submit-btn"
                      onClick={handlePaymentAndReservation}
                      disabled={loading}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <CreditCard size={20} />
                      {loading ? loadingText : "결제하고 예약 확정하기"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ReservationForm;
