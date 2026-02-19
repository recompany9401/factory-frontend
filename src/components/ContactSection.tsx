import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./ContactSection.css";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

interface ContactSectionProps {
  className?: string;
}

const ContactSection = ({ className = "" }: ContactSectionProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(mapRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
        },
        y: 50,
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      });

      gsap.from(infoRef.current, {
        scrollTrigger: {
          trigger: mapRef.current,
          start: "bottom 90%",
        },
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out",
      });
    }, containerRef);

    if (!window.kakao) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=e54ef591db7f86c1afbb98fd1d9c4a1a&autoload=false`;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          if (!mapRef.current) return;
          const options = {
            center: new window.kakao.maps.LatLng(35.2163, 128.6908),
            level: 3,
          };
          const map = new window.kakao.maps.Map(mapRef.current, options);

          const markerPosition = new window.kakao.maps.LatLng(
            35.2163,
            128.6908
          );
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);
        });
      };
    } else {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;
        const options = {
          center: new window.kakao.maps.LatLng(35.2163, 128.6908),
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapRef.current, options);

        const markerPosition = new window.kakao.maps.LatLng(35.2163, 128.6908);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    }

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className={`contact-section ${className}`}>
      <div className="contact-inner">
        <div ref={headerRef} className="contact-header">
          <span className="contact-subtitle">CONTACT & ACCESS</span>
          <h2 className="contact-title">문의 및 오시는 길</h2>
        </div>

        <div className="contact-map-wrapper">
          <div ref={mapRef} className="contact-map" id="map" />
        </div>

        <div ref={infoRef} className="contact-info-bar">
          <img src="/logo_color.png" alt="Logo" className="contact-logo" />

          <div className="contact-details">
            <div className="contact-item">
              <svg className="contact-icon" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span>경남 창원시 성산구 곰절길 28번길 1</span>
            </div>

            <div className="contact-item">
              <svg className="contact-icon" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 0 0-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z" />
              </svg>
              <span>055-716-0738</span>
            </div>

            <div className="contact-item">
              <svg className="contact-icon" viewBox="0 0 24 24">
                <path d="M18 3H6v4h12m1 5h-1V9H6v3H5c-1.11 0-2 .89-2 2v8h4v4h10v-4h4v-8c0-1.11-.89-2-2-2m-3 10H8v-5h8m3 1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1" />
              </svg>
              <span>0505-115-9401</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
