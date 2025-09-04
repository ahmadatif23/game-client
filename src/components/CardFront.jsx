import { RefreshCw, Ban } from "lucide-react";

const COLOR_MAP = {
  R: "bg-red-400",
  G: "bg-green-400",
  B: "bg-blue-400",
  Y: "bg-yellow-400",
};

function getCardColor(item) {
  const lastChar = item.slice(-1);
  if (item === "W" || item === "D4W") return "bg-gray-800";
  return COLOR_MAP[lastChar] || "bg-gray-400";
}

function getCardLabel(item) {
  if (item.startsWith("D2")) return "+2";
  if (item === "D4W") return "+4";
  if (/^\d[RGBY]$/.test(item)) return item[0];
  if (item.startsWith("_")) return <RefreshCw className="size-3 m-1" />;
  if (item.startsWith("skip")) return <Ban className="size-3 m-1" />;
  return "";
}

function getCardContent(item) {
  if (/^\d[RGBY]$/.test(item)) {
    return <p className="text-4xl font-light">{item[0]}</p>;
  }

  if (item.startsWith("_")) return <RefreshCw className="size-9" />;

  if (item.startsWith("skip")) return <Ban className="size-9" />;

  if (item.startsWith("D2")) {
    return (
      <div className="relative">
        <div className="w-[20px] h-[30px] rounded-xs border-2 absolute -translate-1/2 -left-[5px] -top-[10px]" />
        <div className="w-[20px] h-[30px] rounded-xs border-2 absolute -translate-1/2 left-[5px] top-[10px]" />
      </div>
    );
  }

  if (item === "W") {
    return (
      <div
        className="border-[3px] rotate-45 rounded-full w-10 h-10
        border-t-blue-400 border-r-red-400 border-b-green-400 border-l-yellow-400"
      />
    );
  }

  if (item === "D4W") {
    return (
      <div className="relative">
        <div className="w-[20px] h-[30px] rounded-xs border-2 border-blue-400 absolute -translate-1/2 -top-[18px]" />
        <div className="w-[20px] h-[30px] rounded-xs border-2 border-red-400 absolute -translate-1/2 left-[13px]" />
        <div className="w-[20px] h-[30px] rounded-xs border-2 border-green-400 absolute -translate-1/2 top-[18px]" />
        <div className="w-[20px] h-[30px] rounded-xs border-2 border-yellow-400 absolute -translate-1/2 -left-[13px]" />
      </div>
    );
  }

  return <p className="text-4xl font-light">{item}</p>; // fallback
}

export default function CardFront({ item, i }) {
  const bgColor = getCardColor(item);
  const label = getCardLabel(item);
  const content = getCardContent(item);

  return (
    <div
      className={`z-10 w-[80px] h-[117px] shadow-pressed rounded-md shrink-0 flex items-center justify-center text-white
      ${i !== 0 ? "-ml-[15px]" : ""} ${bgColor}`}
    >
      <div className="grid grid-rows-3 w-full h-full">
        {/* Top-left label */}
        <div className="flex w-full h-full items-start justify-start p-1 text-sm">
          {label && <span>{label}</span>}
        </div>

        {/* Center content */}
        <div className="flex justify-center items-center text-3xl">
          {content}
        </div>

        {/* Bottom-right label */}
        <div className="flex w-full h-full items-end justify-end p-1 text-sm">
          {label && <span>{label}</span>}
        </div>
      </div>
    </div>
  );
}
