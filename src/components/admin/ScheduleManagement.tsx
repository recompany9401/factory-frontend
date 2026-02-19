import React, { useState, useEffect, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import axios, { AxiosError } from "axios";
import "./ScheduleManagement.css";

interface Resource {
  id: string;
  name: string;
  type: "SECTION" | "EQUIPMENT";
}

interface CustomEventProps {
  type: "RESERVATION" | "BLOCK" | "ALLOW";
  reason?: string;
  userName?: string;
  phone?: string;
  email?: string;
  resourceName?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: CustomEventProps;
}

interface ScheduleResponse {
  events: CalendarEvent[];
  holidays: string[];
}

const ScheduleManagement: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<string>("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [holidays, setHolidays] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedReservation, setSelectedReservation] = useState<
    (CustomEventProps & { start?: string; end?: string }) | null
  >(null);

  const fetchResources = useCallback(async () => {
    try {
      const response = await axios.get<Resource[]>("/api/admin/resources");
      setResources(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError)
        console.error("리소스 로드 실패:", error.message);
    }
  }, []);

  const fetchSchedule = useCallback(async (resourceId: string) => {
    try {
      setLoading(true);
      const url = resourceId
        ? `/api/admin/schedule/${resourceId}`
        : `/api/admin/schedule/all`;
      const response = await axios.get<ScheduleResponse>(url);
      setEvents(response.data.events);
      setHolidays(response.data.holidays || []);
    } catch (error: unknown) {
      if (error instanceof AxiosError)
        console.error("일정 로드 실패:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);
  useEffect(() => {
    fetchSchedule(selectedResourceId);
  }, [selectedResourceId, fetchSchedule]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    const dateStr = selectInfo.startStr.split("T")[0];
    const isRest =
      selectInfo.start.getDay() === 0 ||
      selectInfo.start.getDay() === 6 ||
      holidays.includes(dateStr);

    const targetName = selectedResourceId ? "현재 리소스" : "모든 섹션 및 장비";

    if (isRest) {
      if (
        window.confirm(
          `휴무일입니다. ${targetName}의 이 시간대를 '예약 가능'으로 변경하시겠습니까?`,
        )
      ) {
        saveBlockout(selectInfo, "ALLOW", "관리자 예외 허용");
      }
    } else {
      const reason = window.prompt(
        `[${targetName}] 차단 사유를 입력하세요:\n(주의: 전체 보기 상태면 모든 항목이 차단됩니다)`,
      );
      if (reason) saveBlockout(selectInfo, "BLOCK", reason);
    }
  };

  const saveBlockout = (
    selectInfo: DateSelectArg,
    type: "BLOCK" | "ALLOW",
    reason: string,
  ) => {
    let endStr = selectInfo.endStr;
    if (selectInfo.view.type === "dayGridMonth") {
      const endDate = new Date(selectInfo.end);
      endDate.setSeconds(endDate.getSeconds() - 1);
      endStr = endDate.toISOString();
    }

    setLoading(true);
    const targetId = selectedResourceId || "all";

    axios
      .post("/api/admin/blockout", {
        resourceId: targetId,
        startAt: selectInfo.startStr,
        endAt: endStr,
        type,
        reason,
      })
      .then(() => fetchSchedule(selectedResourceId))
      .finally(() => setLoading(false));
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const props = clickInfo.event.extendedProps as CustomEventProps;
    if (props.type === "RESERVATION") {
      setSelectedReservation({
        ...props,
        start: clickInfo.event.start?.toLocaleString(),
        end: clickInfo.event.end?.toLocaleString(),
      });
    } else if (window.confirm("이 설정을 삭제하시겠습니까?")) {
      const id = clickInfo.event.id.replace("block-", "");
      setLoading(true);
      axios
        .delete(`/api/admin/blockout/${id}`)
        .then(() => fetchSchedule(selectedResourceId))
        .finally(() => setLoading(false));
    }
  };

  const holidayBackgroundEvents = useMemo(() => {
    return holidays.map((date) => ({
      start: date,
      display: "background" as const,
      backgroundColor: "#ffeded",
      allDay: true,
    }));
  }, [holidays]);

  const sections = resources.filter((r) => r.type?.toUpperCase() === "SECTION");
  const equipments = resources.filter(
    (r) => r.type?.toUpperCase() === "EQUIPMENT",
  );

  return (
    <div className="schedule-management-container">
      <aside className="resource-sidebar">
        <div className="admin-header-section">
          <h2>일정 관리</h2>
        </div>

        <div className="resource-group">
          <button
            className={`view-all-btn ${selectedResourceId === "" ? "active" : ""}`}
            onClick={() => setSelectedResourceId("")}
          >
            📂 전체 일정 보기
          </button>
        </div>

        <div className="resource-group">
          <h4>🏠 공간 및 섹션</h4>
          <ul>
            {sections.map((res) => (
              <li
                key={res.id}
                className={selectedResourceId === res.id ? "active" : ""}
                onClick={() => setSelectedResourceId(res.id)}
              >
                {res.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="resource-group">
          <h4>🛠️ 장비 목록</h4>
          <ul>
            {equipments.map((res) => (
              <li
                key={res.id}
                className={selectedResourceId === res.id ? "active" : ""}
                onClick={() => setSelectedResourceId(res.id)}
              >
                {res.name}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="calendar-main">
        {loading && (
          <div className="calendar-overlay-loading">
            <div className="spinner" />
            <span>처리 중...</span>
          </div>
        )}
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            locale="ko"
            events={[...events, ...holidayBackgroundEvents]}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            slotMinTime="09:00:00"
            slotMaxTime="18:00:00"
            allDaySlot={false}
            height="auto"
            eventContent={(eventInfo) => {
              const { reason, resourceName } = eventInfo.event.extendedProps;
              return (
                <div className="fc-custom-event">
                  <div className="fc-event-res-name">
                    {resourceName || "리소스"}
                  </div>
                  <div className="fc-event-time">{eventInfo.timeText}</div>
                  {reason && <div className="fc-event-reason">💬 {reason}</div>}
                </div>
              );
            }}
            eventDidMount={(info) => {
              const props = info.event.extendedProps as CustomEventProps;
              if (props.reason)
                info.el.setAttribute("title", `사유: ${props.reason}`);
            }}
            selectAllow={(selectInfo) => {
              const dateStr = selectInfo.startStr.split("T")[0];
              const isAllowed = events.some(
                (e) =>
                  e.start.startsWith(dateStr) &&
                  e.extendedProps.type === "ALLOW",
              );

              if (isAllowed) return true;
              return (
                selectInfo.start.getDay() !== 0 &&
                selectInfo.start.getDay() !== 6 &&
                !holidays.includes(dateStr)
              );
            }}
          />
        </div>
      </main>

      {selectedReservation && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedReservation(null)}
        >
          <div
            className="modal-window detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>🗓️ 예약 상세 정보</h3>
              <button
                className="close-x"
                onClick={() => setSelectedReservation(null)}
              >
                &times;
              </button>
            </div>
            <div className="detail-content">
              <div className="detail-item">
                <label>이용 항목</label>
                <p className="detail-value highlight">
                  {selectedReservation.resourceName}
                </p>
              </div>
              <div className="detail-item">
                <label>예약자명</label>
                <p className="detail-value">{selectedReservation.userName}</p>
              </div>
              <div className="detail-item">
                <label>연락처</label>
                <p className="detail-value">{selectedReservation.phone}</p>
              </div>
              <div className="detail-item">
                <label>이메일</label>
                <p className="detail-value">
                  {selectedReservation.email || "-"}
                </p>
              </div>
              <hr />
              <div className="detail-item">
                <label>시작 시간</label>
                <p className="detail-value">{selectedReservation.start}</p>
              </div>
              <div className="detail-item">
                <label>종료 시간</label>
                <p className="detail-value">{selectedReservation.end}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="save-btn"
                onClick={() => setSelectedReservation(null)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
