import { CollectionDetails } from "@/types/collection";
import { Box } from "@mui/material";
import Link from "next/link";

export interface MediaItem {
  filename: string;
  link?: string;
  isDevIcon?: boolean;
}

interface MediaLinkProps {
  mediaCfg: MediaItem[];
  showBg?: boolean;
  collectionDetails?: CollectionDetails;
}

const MediaLink = ({
  mediaCfg,
  showBg = true,
  collectionDetails,
}: MediaLinkProps) => {
  const links = mediaCfg.map((item, idx) => {
    return item.link ? (
      <Link
        href={item.link}
        key={idx}
        className="tw-flex-shrink-0 tw-flex tw-items-center"
        target="_blank"
      >
        <Box
          component="img"
          src={item.isDevIcon ? `/images/${item.filename}.svg` : `/assets/images/media/${item.filename}.svg`}
          alt=""
          sx={{ 
            width: item.isDevIcon ? 20 : { md: 24, xs: 20 }, 
            height: item.isDevIcon ? 20 : { md: 24, xs: 20 } 
          }}
        />
      </Link>
    ) : null;
  });

  return (
    <div className="tw-inline-block">
      <div
        className={`tw-flex tw-justify-between tw-items-center ${showBg ? "tw-bg-white/[.05]" : ""} tw-px-4 md:tw-px-8 tw-py-2 md:tw-py-4 tw-gap-4 md:tw-gap-10 tw-rounded-full`}
      >
        {links}
      </div>
    </div>
  );
};

export default MediaLink;
