export default function CardBack({ i }) {
  return (
    <div
      className={`z-10 w-[80px] h-[117px] shadow-pressed rounded-xl bg-sky-800 shrink-0 flex items-center justify-center
        ${i !== 0 ? "-ml-[15px]" : ""}`}
    >
      <div className="flex justify-center items-center text-xl font-bold text-white">
        KAD
      </div>
    </div>
  );
}
