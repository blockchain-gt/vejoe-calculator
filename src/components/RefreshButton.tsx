import React from "react";

export default function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="refresh-button">
      Refresh
    </button>
  );
}
