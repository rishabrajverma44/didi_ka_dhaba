import { useState } from "react";

const CustomTooltip = ({ children, tooltipText, position = "top" }) => {
  const [isHovered, setIsHovered] = useState(false);

  let positionClasses = "";
  switch (position) {
    case "top":
      positionClasses = "bottom-full mb-1 left-1/2 transform -translate-x-1/2";
      break;
    case "bottom":
    case "down":
      positionClasses = "top-full mt-1 left-1/2 transform -translate-x-1/2";
      break;
    case "left":
      positionClasses = "right-full mr-1 top-1/2 transform -translate-y-1/2";
      break;
    case "right":
      positionClasses = "left-full ml-1 top-1/2 transform -translate-y-1/2";
      break;
    case "center":
      positionClasses =
        "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
      break;
    default:
      positionClasses = "bottom-full mb-1 left-1/2 transform -translate-x-1/2";
      break;
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isHovered && (
        <div
          className={`absolute ${positionClasses} px-2 py-1 bg-gray-800 text-white text-sm rounded-md shadow-sm z-10 min-w-[200px] max-w-[100px]`}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
