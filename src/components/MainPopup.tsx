import React, { useState, useMemo } from "react";
import "./MainPopup.css";

interface Popup {
  id: string;
  imageUrl: string;
  linkUrl?: string;
  title: string;
}

interface MainPopupProps {
  popups: Popup[];
}

const MainPopup: React.FC<MainPopupProps> = ({ popups }) => {
  const [sessionClosedIds, setSessionClosedIds] = useState<string[]>([]);

  const visiblePopups = useMemo(() => {
    return popups.filter((popup) => {
      if (sessionClosedIds.includes(popup.id)) return false;

      const hideDate = localStorage.getItem(`hide_popup_${popup.id}`);
      if (hideDate) {
        const today = new Date();
        const hideUntil = new Date(hideDate);
        if (today <= hideUntil) return false;
      }

      return true;
    });
  }, [popups, sessionClosedIds]);

  const closePopup = (id: string) => {
    setSessionClosedIds((prev) => [...prev, id]);
  };

  const closeToday = (id: string) => {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    localStorage.setItem(`hide_popup_${id}`, tomorrow.toISOString());

    closePopup(id);
  };

  if (visiblePopups.length === 0) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {visiblePopups.map((popup) => (
          <div key={popup.id} className="popup-item">
            {popup.linkUrl ? (
              <a
                href={popup.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="popup-content"
              >
                <img src={popup.imageUrl} alt={popup.title} />
              </a>
            ) : (
              <div className="popup-content">
                <img src={popup.imageUrl} alt={popup.title} />
              </div>
            )}

            <div className="popup-footer">
              <button onClick={() => closeToday(popup.id)}>
                오늘 하루 보지 않기
              </button>
              <button onClick={() => closePopup(popup.id)}>닫기 X</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPopup;
