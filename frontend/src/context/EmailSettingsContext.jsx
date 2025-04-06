import React, { createContext, useContext, useState } from "react";

const EmailSettingsContext = createContext();

export const useEmailSettings = () => useContext(EmailSettingsContext);

export const EmailSettingsProvider = ({ children }) => {
  const [emailSettings, setEmailSettings] = useState({
    storeName: "",
    deliveryTime: "",
    processingTime: "",
    returnPolicy: "",
    supportEmail: "",
    shippingPartner: "",
    location: "",
    currency: "",
    signature: "",
    socialLinks: ""
  });

  return (
    <EmailSettingsContext.Provider value={{ emailSettings, setEmailSettings }}>
      {children}
    </EmailSettingsContext.Provider>
  );
};
