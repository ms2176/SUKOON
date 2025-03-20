import React from "react";

interface ListboxWrapperProps {
  children: React.ReactNode;
}

export const ListboxWrapper: React.FC<ListboxWrapperProps> = ({ children }) => (
  <div
    style={{
      width: "150%",
      maxWidth: "260px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#E5E7EB", // Default light border color
      padding: "8px 4px",
      borderRadius: "4px",
      color: 'black'
    }}
  >
    {children}
  </div>
);
