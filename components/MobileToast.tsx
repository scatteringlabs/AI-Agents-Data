import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MobileToast = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    setIsMobile(mediaQuery.matches);

    const handleResize = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      toast.info("UI/UX on PC is better.", {
        autoClose: false,
        closeOnClick: true,
        draggable: true,
        position: "top-center",
        style: { marginTop: "60px" },
      });
    }
  }, [isMobile]);

  return <Box />;
};

export default MobileToast;
