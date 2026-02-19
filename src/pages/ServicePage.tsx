import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceHero from "../components/service/ServiceHero";
import ServiceConcept from "../components/service/ServiceConcept";
import ServiceBenefitSection from "../components/service/ServiceBenefitSection";
import ServicePillarsSection from "../components/service/ServicePillarsSection";
import ServiceWorkspaceSection from "../components/service/ServiceWorkspaceSection";
import ServiceQualitySection from "../components/service/ServiceQualitySection";
import ServiceProcessSection from "../components/service/ServiceProcessSection";
import ServiceExpertSection from "../components/service/ServiceExpertSection";
import ServiceFAQSection from "../components/service/ServiceFAQSection";
import ServiceCTASection from "../components/service/ServiceCTASection";
import useKillScrollTriggersOnUnmount from "../hooks/useKillScrollTriggersOnUnmount";

const ServicePage: React.FC = () => {
  useKillScrollTriggersOnUnmount();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="service-page"
      style={{ position: "relative", width: "100%" }}
    >
      <ServiceHero />
      <ServiceConcept />
      <ServiceBenefitSection />
      <ServicePillarsSection />
      <ServiceWorkspaceSection />
      <ServiceQualitySection />
      <ServiceProcessSection />
      <ServiceExpertSection />
      <ServiceFAQSection />
      <ServiceCTASection />
    </div>
  );
};

export default ServicePage;
