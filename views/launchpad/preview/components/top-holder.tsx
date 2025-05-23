import React, { useCallback, useEffect, useMemo } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { formatAddress, formatTokenFixedto } from "@/utils/format";
import { SCAN_URL_ID } from "@/constants/url";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";
import { useTokenEntityMembersById } from "@/services/graphql/top-holders";
import { BaseSID } from "../../create/tokenService";
import { setTotal } from "@/store/holder-table";
interface MembersTableProps {
  address?: string;
  chainId: number;
  activeTab: string;
  total: string;
  price: string;
  creator: string;
  tokenVault: string;
  show: boolean;
}

const MembersTable = ({
  address,
  chainId,
  activeTab,
  total,
  price,
  creator,
  tokenVault,
  show,
}: MembersTableProps) => {
  const {
    data = { pages: [] },
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useTokenEntityMembersById(address || "");
  useEffect(() => {
    setTotal(Number(data?.pages?.[0]?.tokenEntity?.memberCount) || 0);
  }, [data]);
  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    if (isLoading || !hasNextPage) return Promise.resolve();

    return fetchNextPage().then(() => undefined);
  };

  const isItemLoaded = useCallback(
    (index: number) => {
      const page = data?.pages?.[Math.floor(index / 30)];
      return !!page?.tokenEntity?.members?.[index % 30];
    },
    [data],
  );

  const headers = useMemo(
    () => [
      { label: "RANK", width: 100 },
      { label: "Holder Address", width: 350 },
      { label: "%", width: 150 },
      { label: "Amount", width: 150 },
      { label: "Value", width: 150 },
    ],
    [],
  );

  const Row = ({ index, style }: ListChildComponentProps) => {
    const page = data?.pages?.[Math.floor(index / 30)];
    const member = page?.tokenEntity?.members?.[index % 30];
    const balance = member?.balance;
    const value = Number(balance) * Number(price);
    const isCreator = useMemo(
      () => member.user.id?.toLowerCase() === creator?.toLowerCase(),
      [member],
    );
    const isTokenVault = useMemo(
      () => member.user.id?.toLowerCase() === tokenVault?.toLowerCase(),
      [member],
    );
    if (!member) {
      return null;
    }

    return (
      <Box
        key={member.user.id}
        style={style}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "#0f111c",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 14,
            width: 100,
          }}
        >
          {index + 1}
        </Typography>
        <Link
          href={`${SCAN_URL_ID[BaseSID]}address/${member.user.id}`}
          target="_blank"
          style={{
            color: "#00B912",
            display: "flex",
            fontFamily: "Poppins",
            fontSize: 14,
            width: "350px",
            alignItems: "center",
            columnGap: 2,
          }}
        >
          {isTokenVault ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10.7225 11.8312C10.6254 11.8313 10.5297 11.8094 10.4423 11.7673C10.3549 11.7251 10.2781 11.6638 10.2178 11.5878C10.1574 11.5118 10.1151 11.4232 10.0938 11.3286C10.0725 11.2339 10.0729 11.1357 10.095 11.0412L10.8762 7.69742C10.9211 7.53789 11.0258 7.40182 11.1685 7.31754C11.3112 7.23326 11.4809 7.20726 11.6423 7.24494C11.8037 7.28263 11.9443 7.38111 12.0349 7.51988C12.1255 7.65864 12.1591 7.82701 12.1287 7.98992L11.5625 10.4237L14.7775 9.98367L14.1712 7.55742C14.1335 7.39313 14.1617 7.22059 14.2498 7.07687C14.3379 6.93315 14.4788 6.82971 14.6423 6.78879C14.8059 6.74787 14.9789 6.77272 15.1243 6.85801C15.2697 6.9433 15.3759 7.08222 15.42 7.24492L16.2012 10.3674C16.2231 10.4552 16.2263 10.5466 16.2105 10.6356C16.1947 10.7247 16.1604 10.8094 16.1097 10.8843C16.0589 10.9592 15.993 11.0225 15.9162 11.0703C15.8394 11.118 15.7533 11.1489 15.6637 11.1612L10.8112 11.8249C10.7822 11.829 10.753 11.8311 10.7237 11.8312H10.7225Z"
                fill="#B054FF"
              />
              <path
                d="M11.5025 8.48572C11.3508 8.48628 11.2038 8.43315 11.0875 8.33572L5.98876 4.03572C5.89466 3.95645 5.82525 3.85187 5.78875 3.73437C5.75224 3.61687 5.75018 3.49136 5.7828 3.37273C5.81542 3.25409 5.88135 3.14728 5.9728 3.06496C6.06424 2.98264 6.17736 2.92824 6.29876 2.90822L9.57376 2.36822C9.75876 2.33697 9.94876 2.38947 10.0925 2.51072L15.1925 6.81072C15.2862 6.89007 15.3553 6.99457 15.3915 7.11189C15.4278 7.22921 15.4298 7.35445 15.3972 7.47285C15.3646 7.59124 15.2988 7.69784 15.2076 7.78008C15.1164 7.86231 15.0036 7.91675 14.8825 7.93697L11.6075 8.47822C11.5728 8.48403 11.5377 8.48696 11.5025 8.48697V8.48572ZM7.88501 3.95197L11.6913 7.16072L13.2963 6.89572L9.49001 3.68572L7.88501 3.95072V3.95197Z"
                fill="#B054FF"
              />
              <path
                d="M10.7224 11.8327C10.5626 11.8333 10.4083 11.7739 10.2899 11.6665L4.99118 6.86271C4.89714 6.77755 4.83036 6.66651 4.79923 6.54352C4.76809 6.42054 4.77399 6.2911 4.81618 6.17146L5.79618 3.38771C5.8527 3.22659 5.97092 3.09452 6.12481 3.02056C6.27871 2.9466 6.45569 2.93681 6.6168 2.99333C6.77792 3.04986 6.90999 3.16807 6.98395 3.32197C7.05791 3.47586 7.0677 3.65284 7.01118 3.81396L6.17368 6.19646L11.1524 10.7127C11.2484 10.8 11.3158 10.9143 11.3457 11.0406C11.3756 11.1668 11.3667 11.2992 11.3201 11.4203C11.2734 11.5414 11.1913 11.6455 11.0844 11.7191C10.9776 11.7927 10.8509 11.8323 10.7212 11.8327H10.7224ZM6.93743 17.639C6.84051 17.6389 6.74487 17.6169 6.65764 17.5747C6.57041 17.5324 6.49383 17.4711 6.43363 17.3951C6.37342 17.3192 6.33114 17.2306 6.30994 17.136C6.28874 17.0415 6.28916 16.9433 6.31118 16.849L7.09243 13.5052C7.13733 13.3457 7.24202 13.2096 7.38472 13.1253C7.52741 13.041 7.69712 13.015 7.8585 13.0527C8.01989 13.0904 8.16052 13.1889 8.25113 13.3277C8.34173 13.4664 8.37533 13.6348 8.34493 13.7977L7.77743 16.2315L10.9924 15.7915L10.3862 13.364C10.3484 13.1997 10.3766 13.0271 10.4647 12.8834C10.5528 12.7397 10.6938 12.6362 10.8573 12.5953C11.0208 12.5544 11.1939 12.5793 11.3393 12.6645C11.4847 12.7498 11.5908 12.8888 11.6349 13.0515L12.4149 16.1752C12.4368 16.263 12.44 16.3543 12.4242 16.4434C12.4085 16.5325 12.3741 16.6172 12.3234 16.6921C12.2727 16.767 12.2067 16.8303 12.1299 16.878C12.0531 16.9257 11.967 16.9567 11.8774 16.969L7.02493 17.6327C6.99594 17.6368 6.96671 17.6389 6.93743 17.639Z"
                fill="#B054FF"
              />
              <path
                d="M7.71883 14.2961C7.56681 14.2959 7.41976 14.2419 7.30383 14.1436L2.20383 9.84356C2.11062 9.76479 2.04172 9.66116 2.00516 9.54474C1.9686 9.42831 1.96588 9.3039 1.99732 9.18599C2.02876 9.06808 2.09307 8.96154 2.18275 8.87878C2.27243 8.79602 2.38378 8.74045 2.50383 8.71856L5.45633 8.17856C5.62424 8.14772 5.79753 8.18486 5.93806 8.28179C6.0786 8.37873 6.17487 8.52752 6.2057 8.69543C6.23653 8.86335 6.1994 9.03663 6.10246 9.17717C6.00553 9.3177 5.85674 9.41397 5.68883 9.44481L4.07633 9.73981L7.90633 12.9686L10.8888 12.4761C11.055 12.4533 11.2236 12.4963 11.3585 12.5959C11.4935 12.6955 11.5843 12.8439 11.6115 13.0094C11.6387 13.175 11.6002 13.3446 11.5042 13.4822C11.4082 13.6198 11.2623 13.7144 11.0976 13.7461L7.82258 14.2873C7.78829 14.293 7.75359 14.296 7.71883 14.2961Z"
                fill="#B054FF"
              />
              <path
                d="M6.93755 17.6388C6.77811 17.639 6.62432 17.5797 6.5063 17.4725L1.2063 12.6688C1.11248 12.5835 1.04594 12.4724 1.01503 12.3494C0.984115 12.2264 0.990211 12.097 1.03255 11.9775L2.01255 9.19377C2.03792 9.11081 2.0798 9.03383 2.13567 8.96746C2.19154 8.90108 2.26025 8.84669 2.33768 8.80754C2.4151 8.7684 2.49963 8.7453 2.58621 8.73965C2.67278 8.734 2.7596 8.7459 2.84146 8.77465C2.92331 8.80339 2.99852 8.84839 3.06254 8.90693C3.12657 8.96547 3.17811 9.03635 3.21405 9.11531C3.25 9.19427 3.26961 9.27969 3.27172 9.36642C3.27382 9.45315 3.25837 9.53941 3.2263 9.62002L2.3888 12.0013L7.37005 16.5188C7.46612 16.6061 7.53353 16.7205 7.5634 16.8469C7.59328 16.9733 7.58423 17.1058 7.53745 17.2269C7.49067 17.3481 7.40834 17.4522 7.30127 17.5257C7.19421 17.5992 7.06741 17.6386 6.93755 17.6388Z"
                fill="#B054FF"
              />
              <path
                d="M14.0164 16.6838C13.9017 16.6836 13.7884 16.6589 13.6841 16.6113C13.5797 16.5638 13.4867 16.4945 13.4113 16.4081C13.336 16.3217 13.2799 16.2202 13.2469 16.1104C13.2139 16.0005 13.2048 15.8849 13.2201 15.7713L13.6389 12.6801C13.6625 12.5055 13.7428 12.3436 13.8675 12.2191C13.9922 12.0947 14.1543 12.0146 14.3289 11.9913L17.3714 11.5813C17.5675 11.5551 17.7664 11.6021 17.9301 11.7132C18.0938 11.8243 18.2108 11.9919 18.2589 12.1838L18.9801 15.0713C19.0069 15.1802 19.0107 15.2934 18.9913 15.4038C18.9719 15.5142 18.9296 15.6193 18.8673 15.7125C18.805 15.8057 18.7239 15.8848 18.6292 15.9448C18.5346 16.0049 18.4284 16.0446 18.3176 16.0613L14.1339 16.6763C14.0949 16.6816 14.0556 16.6841 14.0164 16.6838ZM15.1501 13.5038L14.9576 14.9288L17.2039 14.5988L16.8726 13.2726L15.1501 13.5038Z"
                fill="#FF9800"
              />
            </svg>
          ) : null}
          {isCreator ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
            >
              <path
                d="M15.9407 11.8966C16.831 11.8957 17.6862 12.2437 18.3229 12.866C18.9596 13.4883 19.327 14.3354 19.3464 15.2255C19.3657 16.1156 19.0355 16.9778 18.4265 17.6272C17.8175 18.2767 16.9782 18.6616 16.0887 18.6993L15.9407 18.7024H6.00653L5.95208 18.7001L5.87462 18.7024C5.02573 18.7017 4.20771 18.384 3.5809 17.8116C2.9541 17.2391 2.56372 16.4532 2.48629 15.6078L2.47555 15.4575L2.47095 15.2995C2.47087 14.6705 2.64517 14.0537 2.97447 13.5177C3.30378 12.9817 3.77521 12.5475 4.3364 12.2633C4.89759 11.9791 5.52658 11.856 6.15351 11.9077C6.78044 11.9594 7.38077 12.1839 7.88783 12.5562L8.02894 12.6658L8.14245 12.764H13.6713L13.7856 12.6658C14.2964 12.2469 14.9186 11.9865 15.5756 11.9165L15.7574 11.9012L15.9414 11.8966H15.9407ZM15.6822 13.0969C15.0556 13.0969 14.4704 13.3469 14.0379 13.784C13.9695 13.8532 13.8809 13.8989 13.7848 13.9144L13.7119 13.9206H8.10334C8.04255 13.9206 7.98236 13.9085 7.92627 13.8851C7.87018 13.8617 7.81931 13.8273 7.77662 13.784C7.46283 13.4656 7.06342 13.2451 6.62679 13.1491C6.19016 13.0531 5.73507 13.0858 5.31668 13.2433C4.89828 13.4008 4.53456 13.6763 4.26958 14.0363C4.00461 14.3964 3.84977 14.8256 3.82382 15.2719L3.82076 15.3969L3.82382 15.5242C3.8517 16.0926 4.08837 16.6307 4.48847 17.0353C4.88858 17.4399 5.42395 17.6826 5.99196 17.7169L6.11697 17.72L6.20133 17.7184L6.26882 17.72H15.6822C16.2953 17.72 16.8832 17.4764 17.3167 17.0429C17.7502 16.6094 17.9938 16.0215 17.9938 15.4084C17.9938 14.7954 17.7502 14.2074 17.3167 13.7739C16.8832 13.3404 16.2953 13.0969 15.6822 13.0969ZM13.0992 2.1404L13.3131 2.27844L13.4006 2.33827L13.4428 2.26617C13.5655 2.07214 13.7557 1.92412 13.9834 1.8574L14.0831 1.83362L14.1752 1.82135C14.7059 1.77533 15.173 2.16877 15.2182 2.69949C15.2428 2.98326 15.2527 3.26012 15.2474 3.52932L15.2351 3.81309L15.2849 3.8591C16.7843 5.29481 16.8012 6.64999 15.4843 6.8816L15.38 6.89694L15.2895 6.90691L15.3141 7.03806C15.3294 7.13776 15.3417 7.23976 15.3509 7.341L15.3609 7.49439L15.367 7.72447C15.3667 8.35516 15.2327 8.97862 14.9738 9.55371C14.7148 10.1288 14.3368 10.6424 13.8648 11.0606C13.3927 11.4789 12.8373 11.7923 12.2352 11.9801C11.6331 12.1679 10.9981 12.2258 10.3719 12.1501C9.74579 12.0744 9.14284 11.8668 8.60287 11.5409C8.06289 11.215 7.59818 10.7783 7.23941 10.2596C6.88063 9.74087 6.63596 9.15197 6.52153 8.53174C6.40711 7.91151 6.42553 7.27407 6.5756 6.66149L6.63082 6.45595L6.65152 6.39153L6.61471 6.38693C5.745 6.24658 5.30325 5.4528 5.37611 4.49566L5.38838 4.36988L5.39375 4.3323L5.38914 4.30853C5.20278 3.12591 6.09473 1.7692 7.52353 1.35505L7.67308 1.31671L7.82187 1.28449C8.27793 1.19586 8.74272 1.16034 9.20696 1.17866L9.38182 1.18939L9.59426 1.17789C10.9042 1.1242 11.9641 1.42868 13.0992 2.14116V2.1404ZM9.73691 2.5254L9.52831 2.5369L9.46465 2.53614C9.05567 2.50445 8.64427 2.52948 8.24215 2.61053C7.25587 2.79459 6.63158 3.6689 6.72055 4.34611L6.73435 4.42664C6.74668 4.48206 6.74824 4.53935 6.73895 4.59536C6.64846 5.14296 6.81488 5.49268 7.11475 5.54176C7.23593 5.56094 7.3502 5.56324 7.46294 5.54943L7.57568 5.52949C7.65796 5.51132 7.7437 5.51698 7.82288 5.5458C7.90206 5.57461 7.97138 5.6254 8.02273 5.6922C8.07408 5.759 8.10532 5.83905 8.11281 5.92298C8.12029 6.0069 8.10371 6.09122 8.06499 6.16605C7.81938 6.6396 7.69594 7.167 7.70589 7.70036C7.71584 8.23372 7.85885 8.75615 8.12195 9.22021C8.38504 9.68427 8.75989 10.0753 9.21244 10.3577C9.665 10.6401 10.1809 10.805 10.7134 10.8374C11.2459 10.8699 11.778 10.7688 12.2615 10.5434C12.745 10.3179 13.1645 9.9753 13.4819 9.54659C13.7994 9.11788 14.0047 8.61666 14.0793 8.08845C14.1539 7.56024 14.0954 7.02176 13.9091 6.52191C13.8802 6.44463 13.8735 6.36084 13.8896 6.27995C13.9058 6.19906 13.9442 6.12429 14.0006 6.06404C14.0569 6.0038 14.1289 5.96046 14.2086 5.93892C14.2882 5.91738 14.3722 5.91848 14.4513 5.9421L14.508 5.96358C14.5878 6.00039 14.6537 6.0165 14.7105 6.0165C15.1799 6.0165 15.3033 5.80176 14.8056 5.23192L14.6737 5.0885C14.6489 5.06271 14.6238 5.03714 14.5985 5.01181L14.4298 4.84692C14.3378 4.76102 14.2381 4.66899 14.1269 4.57235C14.0739 4.52607 14.0327 4.46785 14.0067 4.40251C13.9807 4.33716 13.9706 4.26657 13.9773 4.19656C13.9911 4.06004 13.9988 3.92046 14.0019 3.77704L14.0011 3.56076V3.57994C13.9912 3.65789 13.9609 3.73182 13.9131 3.79417C13.8653 3.85652 13.8017 3.90505 13.729 3.93478C13.6563 3.96451 13.577 3.97437 13.4992 3.96337C13.4214 3.95236 13.3479 3.92088 13.2863 3.87214C12.0209 2.87512 11.0499 2.47171 9.73691 2.5254ZM10.8912 8.52438C11.4088 8.52438 11.9265 8.50674 11.9265 8.52438C11.9265 9.02826 11.4625 9.55975 10.8912 9.55975C10.6166 9.55975 10.3532 9.45067 10.159 9.2565C9.96487 9.06233 9.85579 8.79898 9.85579 8.52438H10.8912Z"
                fill="#B054FF"
              />
            </svg>
          ) : null}
          <span style={{ textDecoration: "underline" }}>
            {formatAddress(member.user.id)}
          </span>

          {isCreator ? "(Creator)" : ""}
          {isTokenVault ? "(Bonding Curve)" : ""}
        </Link>
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 14,
            width: 150,
          }}
        >
          {Number(balance) * 100 > 10000
            ? ((Number(balance) * 100) / 1000000000)?.toFixed(2)
            : "<0.01"}
          %
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 14,
            width: 150,
          }}
        >
          {formatTokenFixedto(balance || 0)}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 14,
            width: 150,
          }}
        >
          {formatTokenFixedto(value)} ETH
        </Typography>
      </Box>
    );
  };

  const noData = useMemo(() => {
    return (
      !isLoading &&
      data?.pages?.every((page) => page?.tokenEntity?.members?.length === 0)
    );
  }, [isLoading, data]);

  return (
    <Box
      sx={{
        height: activeTab === "holder" ? 500 : 0,
        opacity: activeTab === "holder" ? 1 : 0,
        mt: activeTab === "holder" ? 2 : 0,
        width: "100%",
        overflowX: { md: "inherit", xs: "scroll" },
        overflowY: "hidden",
        display: show ? "block" : "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "rgb(27, 29, 40)",
          alignItems: "center",
          minWidth: 700,
        }}
      >
        {headers?.map((item) => (
          <Typography
            key={item.label}
            sx={{
              fontFamily: "Poppins",
              color: "#FFF",
              fontWeight: 500,
              width: item.width,
              fontSize: 14,
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </Typography>
        ))}
      </Box>
      {noData ? (
        <NoDataSearched />
      ) : (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={
            hasNextPage
              ? data?.pages?.reduce(
                  (acc, page) => acc + page?.tokenEntity?.members?.length,
                  0,
                ) + 1
              : data?.pages.reduce(
                  (acc, page) => acc + page?.tokenEntity?.members?.length,
                  0,
                )
          }
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }: any) => (
            <List
              height={500}
              itemCount={data?.pages.reduce(
                (acc, page) => acc + page?.tokenEntity?.members?.length,
                0,
              )}
              itemSize={60}
              style={{ minWidth: 700 }}
              width="100%"
              onItemsRendered={onItemsRendered}
              ref={ref}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      )}
    </Box>
  );
};

export default MembersTable;
