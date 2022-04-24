import React from "react";

export default function Icon({ className, icon, size }) {
  const classNames = [className, "fa", icon];
  return (
    <i
      style={{ fontSize: size || "28px" }}
      className={classNames.join(" ")}
    ></i>
  );
}
