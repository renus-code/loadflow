"use client";

import { useEffect, useState } from "react";

export default function AsyncIconLink() {
  const [media, setMedia] = useState("print");

  useEffect(() => {
    // Switch to 'all' after mount to trigger high-priority CSS load
    setMedia("all");
  }, []);

  return (
    <link 
      rel="stylesheet" 
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      media={media}
    />
  );
}
