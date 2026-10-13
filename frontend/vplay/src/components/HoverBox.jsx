import { useState } from "react";

export default function HoverPopupBox() {
  const [open, setOpen] = useState(false);

  const handleLeave = (e) => {
    // Close only if mouse leaves BOTH trigger + popup
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={handleLeave}
      onClick={() => setOpen(!open)} // for mobile
    >
      <button className="bg-green-600 text-white px-4 py-2 rounded-md">
        Hover to open box
      </button>

      {open && (
        <div
          className="
            absolute top-full left-0 mt-3
            w-72 p-4
            bg-white border shadow-xl rounded-xl
            animate-[fadeIn_0.2s_ease]
            z-50
          "
        >
          <h2 className="text-lg font-semibold">Hover Popup</h2>
          <p className="mt-1 text-gray-600">
            This popup stays open while you're hovering it.
          </p>
        </div>
      )}
    </div>
  );
}
