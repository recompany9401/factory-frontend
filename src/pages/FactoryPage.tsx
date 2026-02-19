import React, { useEffect } from "react";
import FactoryHero from "../components/factory/FactoryHero";
import FactoryIntroSection from "../components/factory/FactoryIntroSection";
import FactoryZoneSection from "../components/factory/FactoryZoneSection";
import FactoryEquipmentSection from "../components/factory/FactoryEquipmentSection";
import FactoryFacilitiesSection from "../components/factory/FactoryFacilitiesSection";
import ContactSection from "../components/ContactSection";
import useKillScrollTriggersOnUnmount from "../hooks/useKillScrollTriggersOnUnmount";

const FactoryPage: React.FC = () => {
  useKillScrollTriggersOnUnmount();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="factory-page">
      <FactoryHero />
      <FactoryIntroSection />
      <FactoryZoneSection />
      <FactoryEquipmentSection />
      <FactoryFacilitiesSection />
      <ContactSection className="bg-light-gray" />
    </div>
  );
};

export default FactoryPage;
