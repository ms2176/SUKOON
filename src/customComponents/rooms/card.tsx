import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`bg-white shadow-xl rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-between items-center text-black"> {/* Added text-black */}
    {children}
  </div>
);

export const CardBody = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 text-black"> {/* Added text-black */}
    {children}
  </div>
);

export const CardFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 bg-[#f5f5f5] p-4 rounded-xl text-black"> {/* Added text-black */}
    {children}
  </div>
);

