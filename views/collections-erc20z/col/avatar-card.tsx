import AvatarCard from "@/components/collections/avatar-card";
import VerifiedIcon from "@/components/icons/verified-icon";
import { Collection } from "@/types/collection";
import { getTokenLogoURL } from "@/utils/token";
import {
  Box,
  styled,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getCollectionBySlug } from "@/services/collections";
import Iconify from "@/components/iconify";
import { useFavorites } from "@/hooks/useFavorites";

const RankText = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  text-transform: capitalize;
`;

interface SocialIconProps {
  href: string;
  iconSrc: string;
  alt: string;
  bgColor?: string;
  tooltip: string;
  className?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({
  href,
  iconSrc,
  alt,
  bgColor,
  tooltip,
  className,
}) => {
  return (
    <Tooltip
      title={
        alt === "Developer" ? (
          <Box>
            <Typography
              sx={{
                fontSize: "10px",
                fontFamily: "Poppins",
                fontWeight: 500,
                color: "#fff",
              }}
            >
              Dev Doxxed
            </Typography>
            <Typography
              sx={{
                fontSize: "10px",
                fontFamily: "Poppins",
                fontWeight: 500,
                color: "#fff",
              }}
            >
              Dev Twitter
            </Typography>
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: "10px",
              fontFamily: "Poppins",
              fontWeight: 500,
              color: "#fff",
            }}
          >
            {tooltip}
          </Typography>
        )
      }
      arrow
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "16px",
          height: "16px",
          marginLeft: "2px",
          backgroundColor: bgColor || "rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = bgColor
            ? `${bgColor}CC`
            : "rgba(255, 255, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            bgColor || "rgba(255, 255, 255, 0.1)";
        }}
        className={className}
      >
        <img
          src={iconSrc}
          alt={alt}
          style={{
            width: "12px",
            height: "12px",
          }}
        />
      </a>
    </Tooltip>
  );
};

const getChainName = (chainId: number) => {
  const chainMap: { [key: number]: string } = {
    1: "eth",
    56: "bsc",
    10000: "sol",
    8453: "base",
  };
  return chainMap[chainId] || chainId.toString();
};

const TableAvatarCard = ({ item }: { item: Collection }) => {
  const theme = useTheme();
  const isDpwnMd = useMediaQuery(theme.breakpoints.down("md"));
  const { isFavorite, toggleFavorite } = useFavorites();
  // const { data: collectionDetails } = useQuery({
  //   queryKey: ["collection-details", item.chain_id, item.address],
  //   queryFn: () =>
  //     item.slug ? getCollectionBySlug({ slug: item.slug }) : null,
  //   enabled: !!item.slug,
  // });

  const twitterUsername = item?.twitter_username;
  const twitterUrl = twitterUsername
    ? `https://twitter.com/${twitterUsername}`
    : null;
  const projectUrl = item?.project_url;

  const displayName =
    item.name && item.name.length > 16
      ? `${item.name.slice(0, 16)}...`
      : item.name;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(item);
  };
  return (
    <Box
      className="td1"
      sx={{
        width: { md: "450px !important", xs: "300px !important" },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{ minWidth: "18px", width: "18px", cursor: "pointer" }}
        onClick={handleClick}
      >
        <Iconify
          icon={
            isFavorite(item)
              ? "material-symbols-light:star"
              : "material-symbols-light:star-outline"
          }
          color={isFavorite(item) ? "#B054FF" : "white"}
          sx={{ width: "28px", height: "28px" }}
        />
      </Box>
      <RankText sx={{ display: { md: "block", xs: "none" } }}>
        {item.rank}.
      </RankText>
      <AvatarCard
        hasLogo={!!item?.logo_url}
        logoUrl={
          item?.logo_url
            ? item?.logo_url
            : getTokenLogoURL({
              chainId: item?.chain_id || 1,
              address: item?.address,
            })
        }
        symbol={item.symbol || "unknown"}
        chainId={item.chain_id}
        size={isDpwnMd ? 60 : 36}
        mr={0}
      />
      <Box>
        <Box
          className="item-name"
          sx={{
            marginBottom: "0px",
            fontSize: 14,
            padding: "0px 0px",
            display: "flex",
            alignItems: "center",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: { md: "240px", xs: "180px" },
            overflow: "hidden",
            "& .social-icons-container": {
              display: "flex",
              alignItems: "center",
              gap: "2px",
              marginLeft: "4px",
              flexShrink: 0,
            },
            "& .social-icon": {
              minWidth: "16px",
              width: "16px",
              height: "16px",
              flexShrink: 0,
            },
          }}
        >
          {item?.is_verified ? (
            <span style={{ marginRight: "6px" }}>
              <VerifiedIcon size={16} />
            </span>
          ) : null}
          {item.symbol || "unknown"}
          <Box className="social-icons-container">
            {twitterUrl && (
              <SocialIcon
                href={twitterUrl}
                iconSrc="/images/twitter.svg"
                alt="Twitter"
                tooltip="Twitter"
                className="social-icon"
              />
            )}
            {twitterUrl && (
              <SocialIcon
                href={`https://x.com/search?q=(%24${item.symbol}%20OR%20${item.address})&src=typed_query&f=live`}
                iconSrc="/images/search.svg"
                alt="Search"
                tooltip="Search Twitter"
                className="social-icon"
              />
            )}
            {projectUrl && (
              <SocialIcon
                href={projectUrl}
                iconSrc="/images/globe.svg"
                alt="Website"
                tooltip="Website"
                className="social-icon"
              />
            )}
            {item?.creator_x_username && (
              <SocialIcon
                href={`https://twitter.com/${item.creator_x_username}`}
                iconSrc="/images/dev.svg"
                alt="Developer"
                bgColor="#AF54FF"
                tooltip="Dev Doxxed\nDev Twitter"
                className="social-icon"
              />
            )}
          </Box>
          {item?.tags && item.tags.length > 0 && (
            <Tooltip
              title={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    backgroundColor: "#000",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  {item.tags.map((tag, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontSize: "12px",
                        fontFamily: "Poppins",
                        fontWeight: 500,
                        color: "#fff",
                      }}
                    >
                      {tag.name}
                    </Typography>
                  ))}
                </Box>
              }
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "transparent",
                    "& .MuiTooltip-arrow": {
                      color: "#000",
                    },
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "4px",
                  padding: "2px 8px",
                  height: "20px",
                  whiteSpace: "nowrap",
                  border: "1px solid #AF54FF",
                  marginLeft: "8px",
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    color: "#AF54FF",
                  }}
                >
                  {item.tags[0].name.length > 10
                    ? `${item.tags[0].name.slice(0, 10)}...`
                    : item.tags[0].name}
                  {item.tags.length > 1 && " ..."}
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontSize: 12,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: { md: "220px", xs: "180px" },
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          {displayName || "unknown"}
          <a
            href={`https://gmgn.ai/${getChainName(item.chain_id)}/token/3J31tE1n_${item.address}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <img
              src="/images/logo_black.png"
              alt="logo"
              style={{
                width: 14,
                height: 14,
                marginLeft: 4,
                cursor: "pointer",
              }}
            />
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default TableAvatarCard;
