import React from "react";
import state from "../store/index.js";
import { useSnapshot } from "valtio";

const CustomButton = ({ type, customStyles, title, handleClick }) => {
  const snap = useSnapshot(state);
  const generateStyle = (type) => {
    if (type === "filled") {
      return {
        backgroundColor: snap.color,
        color: "white",
      };
    }
  };
  return (
    <button
      className={`px-2 py-1.2 flex-1 rounded-md ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
