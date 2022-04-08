import { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";

type Option = { title: string; images: string[] };

export default function Dropdown({
  options,
  onSelect,
}: {
  options: Option[];
  onSelect: (option: Option) => void;
}) {
  const [selected, setSelected] = useState(options[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);

  useClickAway(bodyRef, () => {
    setDropdownOpen(false);
  });

  useEffect(() => {
    onSelect(selected);
  }, [onSelect, selected]);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    });
  }, []);
  return (
    <div>
      <div className="dropdown-button">
        <Row
          title={selected.title}
          images={selected.images}
          onClick={() => {
            setDropdownOpen(!dropdownOpen);
          }}
        />
      </div>

      <div
        ref={bodyRef}
        className={`dropdown-body ${dropdownOpen ? "" : "hidden"}`}
      >
        {options.map((option) => {
          return (
            <Row
              title={option.title}
              images={option.images}
              onClick={() => {
                setDropdownOpen(false);
                setSelected(option);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function Row({
  title,
  onClick,
  images,
}: {
  title: string;
  onClick: () => void;
  images: string[];
}) {
  return (
    <div className="row" onClick={onClick}>
      <div className="images">
        {images.map((img) => {
          return <img src={img} alt={img} />;
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {title}
      </div>
    </div>
  );
}
