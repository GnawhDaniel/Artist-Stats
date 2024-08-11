"use client";
import { useState } from "react";

export default function SignComponent() {
  const [isMusipster, setMusipster] = useState(true);

  const handleKeyPress = (e: any) => {
    console.log(e)
    if (e && e?.key === "ArrowDown") {
      setMusipster(true);
    } else if (e && e?.key === "ArrowUp") {
      setMusipster(false);
    }
  };

  return (
    <div
      onKeyDown={handleKeyPress}
      className="flex flex-col min-h-screen items-center justify-center"
    >
      <h1>are you a registered musipster?</h1>
      <div className="flex">
        <h2>{!isMusipster ? "> " : null} not yet.</h2>
      </div>
      <div className="flex">
        <h2>{isMusipster ? "> " : null}yes!</h2>
      </div>
    </div>
  );
}
