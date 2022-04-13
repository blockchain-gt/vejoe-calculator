import { getByTitle } from "@testing-library/dom";
import { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";

// type Option = { title: string; images: string[] };

export default function Dropdown({title, value} : {title: string; value: string}) {

  return (
    <div
        style={{
            width: "90%",
            margin: "auto",
            display: "flex",
            flexDirection: "row",
            borderRadius: "20px",
            fontFamily: "Helvectica",
            padding: "2px 15px",
            backgroundColor: "#f2f2f2",
            border: "1px #e4e4e4 solid",
            marginTop: "10px",
            marginBottom: "10px"
        }}>
        <div
            style={{
                float:"left"
            }}
        >
            <h3
                style={{
                    fontSize: "1em",
                    verticalAlign: "middle",
                    padding: "4px"
                }}>
                    {title}</h3>
        </div>
            <h3
                style={{
                    fontSize: "1em",
                    padding: "4px",
                    textAlign: "right",
                    flex: "1",
                }}>{value}</h3>
    </div>
  );
}

// function Row({
//   title,
//   onClick,
//   images,
// }: {
//   title: string;
//   onClick: () => void;
//   images: string[];
// }) {
//   return (
//     <div className="row" onClick={onClick}>
//       <div className="images">
//         {images.map((img) => {
//           return <img src={img} alt={img} />;
//         })}
//       </div>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//         }}
//       >
//         {title}
//       </div>
//     </div>
//   );
// }
