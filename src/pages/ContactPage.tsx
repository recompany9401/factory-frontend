import React, { useEffect } from "react";
import ContactHero from "../components/contact/ContactHero";
import ContactFormSection from "../components/contact/ContactFormSection";
import useKillScrollTriggersOnUnmount from "../hooks/useKillScrollTriggersOnUnmount";

const ContactPage: React.FC = () => {
  useKillScrollTriggersOnUnmount();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-page">
      <ContactHero />
      <ContactFormSection />
    </div>
  );
};

export default ContactPage;
