import { Box } from "@mui/material";
import { ProjectData } from "../../create/tokenService";
import { useMemo } from "react";
import WebsiteSvg from "./svgs/website";
import XSvg from "./svgs/x";
import TGSvg from "./svgs/tg";
import EditSvg from "./svgs/edit";

const MediaList = ({ info, handleMediaUpdate }: { info?: ProjectData, handleMediaUpdate: any }) => {

  const handleClick = (url: string | undefined, event: React.MouseEvent) => {
    // event.stopPropagation();
    event.preventDefault()
    if (url) {
      window.open(url, "_blank"); // 在新标签中打开链接
    }
  };
  return (
    <Box sx={{ display: "flex", mb: 1, alignItems: "center" }}>
      <Box
        sx={{
          display: "flex",
          padding: "8px 16px",
          borderRadius: "30px",
          columnGap: 1,
        }}
      >
        <Box
          sx={{ cursor: info?.website ? "pointer" : "default" }}
          onClick={(e) => handleClick(info?.website, e)}
        >
          <WebsiteSvg fill={info?.website ? "#B054FF" : "#aaaaaa"} />
        </Box>
        <Box
          sx={{ cursor: info?.x ? "pointer" : "default" }}
          onClick={(e) => handleClick(info?.x, e)}
        >
          <XSvg fill={info?.x ? "#B054FF" : "#aaaaaa"} />
        </Box>
        <Box
          sx={{ cursor: info?.telegram ? "pointer" : "default" }}
          onClick={(e) => handleClick(info?.telegram, e)}
        >
          <TGSvg fill={info?.telegram ? "#B054FF" : "#aaaaaa"} />
        </Box>
      </Box>
      <Box onClick={handleMediaUpdate}>
        <EditSvg />
      </Box>
    </Box>
  );
};

export default MediaList;
