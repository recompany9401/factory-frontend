import React, { useEffect } from "react";
import PolicyHero from "../components/policy/PolicyHero";
import PolicyListSection from "../components/policy/PolicyListSection";
import useKillScrollTriggersOnUnmount from "../hooks/useKillScrollTriggersOnUnmount";

const PolicyPage: React.FC = () => {
  useKillScrollTriggersOnUnmount();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <PolicyHero />
      <PolicyListSection />
    </div>
  );
};

export default PolicyPage;
