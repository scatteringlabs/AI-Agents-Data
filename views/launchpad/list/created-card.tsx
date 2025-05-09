import { useState, useCallback, useMemo } from "react";
import AvatarCard from "@/components/collections/avatar-card";
import { Box, Typography } from "@mui/material";
import { EditButton, Text } from "../create/require-text";
import { CollectionTypeColor } from "@/constants/color";
import Link from "next/link";
import { TableHeader } from "../portfolio";
import { TokenProject } from "./buyed-card";
import { CreatedTokenProject } from "./created-card-list";
import { formatTokenFixedto } from "@/utils/format";
import {
  claimLPFeeFor,
  collectProjectFee,
  ProjectFeeType,
} from "@/services/launchpad/claim";
import { ProjectData } from "../create/tokenService";
import UploadNFTDialog from "../UploadNFTDialog";
import MediaList from "../preview/components/media-list";
import { toast } from "react-toastify";
import { useWallets } from "@privy-io/react-auth";

interface iCreatedCard {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string;
  project?: CreatedTokenProject;
  tag: string;
  refetch: any;
  setOpen: any;
  setUpdateInfo: any;
  setOpenMedia: any;
}

const CreatedCard = ({
  name,
  symbol,
  id,
  logoUrl,
  tag,
  project,
  refetch,
  setOpen,
  setUpdateInfo,
  setOpenMedia,
}: iCreatedCard) => {
  // 定义三个 loading 状态
  const [isClaimingSwapFee, setIsClaimingSwapFee] = useState(false);
  const [isClaimingShareFee, setIsClaimingShareFee] = useState(false);
  const [isClaimingLPFee, setIsClaimingLPFee] = useState(false);
  const { wallets } = useWallets();
  const wallet = useMemo(() => wallets?.[0], [wallets]);
  const canClaimSwapFee = useMemo(
    () => Number(project?.projectSwapFee) !== 0,
    [project],
  );
  const handleUpdate = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setOpen(true);
      setUpdateInfo(project);
    },
    [setUpdateInfo, setOpen, project],
  );

  const handleMediaUpdate = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setOpenMedia(true);
      setUpdateInfo(project);
    },
    [setUpdateInfo, setOpenMedia, project],
  );

  const handleClaimSwapFee = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!project?.addr || !canClaimSwapFee) {
        return;
      }

      setIsClaimingSwapFee(true);
      const tokenAddress = project.addr;
      const feeType = ProjectFeeType.Swap;
      const toastId = toast.loading("Project Swap Fee Claiming...");

      try {
        const receipt = await collectProjectFee({
          tokenAddr: tokenAddress,
          feeType: feeType,
          wallet,
        });
        refetch?.();
        console.log("Fee collected:", receipt);
      } catch (err) {
        console.error("Error collecting fee:", err);
      } finally {
        toast.dismiss(toastId);
        setIsClaimingSwapFee(false);
      }
    },
    [project, refetch, canClaimSwapFee],
  );

  const canClaimShareFee = useMemo(
    () => Number(project?.projectShareFee) !== 0,
    [project],
  );

  const handleClaimShareFee = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!project?.addr || !canClaimShareFee) {
        return;
      }

      setIsClaimingShareFee(true);
      const tokenAddress = project.addr;
      const feeType = ProjectFeeType.Share;

      const toastId = toast.loading("Project Fee Claiming...");
      try {
        const receipt = await collectProjectFee({
          tokenAddr: tokenAddress,
          feeType: feeType,
          wallet,
        });
        refetch?.();
      } catch (err) {
        console.error("Error collecting fee:", err);
      } finally {
        toast.dismiss(toastId);
        setIsClaimingShareFee(false);
      }
    },
    [project, refetch, canClaimShareFee],
  );

  const canClaimLPFee = useMemo(
    () => Number(project?.tokenFee) + Number(project?.ethFee) !== 0,
    [project],
  );
  const handleClaimLPFee = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!project?.addr || !canClaimLPFee) {
        return;
      }

      setIsClaimingLPFee(true);
      const tokenAddress = project.addr;
      const toastId = toast.loading("Project LP Fee Claiming...");
      try {
        const receipt = await claimLPFeeFor({
          tokenAddress,
          wallet,
        });
        refetch?.();
        console.log("Fee collected:", receipt);
      } catch (err) {
        console.error("Error collecting fee:", err);
      } finally {
        toast.dismiss(toastId);
        setIsClaimingLPFee(false);
      }
    },
    [project, refetch, canClaimLPFee],
  );

  return (
    <Link
      href={
        // @ts-ignore
        project?.state === "1" && project?.slug
          ? `/collection/${project?.slug}`
          : `/launchpad/base/${id}`
      }
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.05)",
          position: "relative",
          px: "20px",
          py: "10px",
          alignItems: "center",
          borderRadius: "6px",
          cursor: "pointer",
          border: "1px solid transparent",
          columnGap: 2,
          mb: 2,
          "&:hover": {
            border: "1px solid rgba(255, 255, 255,0.1)",
          },
        }}
      >
        {/* {project?.state === "1" ? (
          <Box
            component="img"
            src="/assets/images/launchpad/state-logo.png"
            sx={{ position: "absolute", left: 0, top: 0 }}
          />
        ) : null} */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: 2,
            width: "100%",
          }}
        >
          <Box
            component="img"
            src={logoUrl}
            alt={symbol}
            width={60}
            height={60}
            sx={{ borderRadius: "50%" }}
          />
          <Box>
            <Text
              sx={{ fontSize: 16, fontWeight: 600, color: "#fff", opacity: 1 }}
            >
              {name}
            </Text>
            <Text>{symbol}</Text>
          </Box>
          <Typography
            sx={{
              border: "1px solid",
              fontSize: "12px",
              padding: "4px 8px",
              borderColor: CollectionTypeColor?.[tag],
              borderRadius: "6px",
              color: CollectionTypeColor?.[tag],
            }}
          >
            {tag}
          </Typography>
          <MediaList
            info={project as ProjectData}
            handleMediaUpdate={handleMediaUpdate}
          />
        </Box>

        {/* Swap Fee Claim */}
        <TableHeader
          sx={{
            width: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            columnGap: 1,
          }}
        >
          {formatTokenFixedto(project?.projectSwapFee)} ETH
          <EditButton
            sx={{
              px: 2,
              py: 1,
              background: canClaimSwapFee ? "#b054ff" : "#454040",
            }}
            onClick={(e: any) => {
              handleClaimSwapFee(e);
            }}
          >
            {isClaimingSwapFee ? "Claiming..." : "Claim"}
          </EditButton>
        </TableHeader>

        {/* LP Fee Claim */}
        {project?.positionId !== "0" ? (
          <TableHeader
            sx={{
              width: "800px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              columnGap: 1,
              fontSize: 12,
            }}
          >
            {formatTokenFixedto(project?.tokenFee)} {symbol}/
            {formatTokenFixedto(project?.ethFee)} ETH
            <EditButton
              sx={{
                px: 2,
                py: 1,
                background: canClaimLPFee ? "#b054ff" : "#454040",
              }}
              onClick={(e: any) => {
                handleClaimLPFee(e);
              }}
            >
              {isClaimingLPFee ? "Claiming..." : "Claim"}
            </EditButton>
          </TableHeader>
        ) : (
          <TableHeader
            sx={{
              width: "800px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              columnGap: 1,
              opacity: 0.6,
            }}
          >
            DEX LP is not created yet
          </TableHeader>
        )}

        {/* Share Fee Claim */}
        {project?.positionId !== "0" ? (
          <TableHeader
            sx={{
              width: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              columnGap: 1,
            }}
          >
            {formatTokenFixedto(project?.projectShareFee)} ETH
            <EditButton
              sx={{
                px: 2,
                py: 1,
                background: canClaimShareFee ? "#b054ff" : "#454040",
              }}
              onClick={(e: any) => {
                handleClaimShareFee(e);
              }}
            >
              {isClaimingShareFee ? "Claiming..." : "Claim"}
            </EditButton>
          </TableHeader>
        ) : (
          <TableHeader
            sx={{
              width: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              columnGap: 1,
              opacity: 0.6,
            }}
          >
            Raise is not completed yet
          </TableHeader>
        )}

        <Box sx={{ width: 300, display: "flex", justifyContent: "flex-end" }}>
          <EditButton
            sx={{
              width: "100px",
              py: 1,
              justifyContent: "center",
            }}
            // @ts-ignore
            onClick={handleUpdate}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
            >
              <path
                d="M6.50008 8.0013C6.8537 8.0013 7.19284 7.86083 7.44289 7.61078C7.69294 7.36073 7.83342 7.02159 7.83342 6.66797C7.83342 6.31435 7.69294 5.97521 7.44289 5.72516C7.19284 5.47511 6.8537 5.33464 6.50008 5.33464C6.14646 5.33464 5.80732 5.47511 5.55727 5.72516C5.30722 5.97521 5.16675 6.31435 5.16675 6.66797C5.16675 7.02159 5.30722 7.36073 5.55727 7.61078C5.80732 7.86083 6.14646 8.0013 6.50008 8.0013ZM14.8334 4.33464L8.50008 0.667969L2.16675 4.33464V11.668L8.50008 15.3346L14.8334 11.668V4.33464ZM8.50008 2.20864L13.5001 5.1033V9.68997L10.4587 7.86597L5.14475 11.8513L3.50008 10.8993V5.1033L8.50008 2.20864ZM8.50008 13.794L6.39875 12.5773L10.5414 9.47064L13.2067 11.0693L8.50008 13.794Z"
                fill="white"
              />
            </svg>
            Update
          </EditButton>
        </Box>
      </Box>
    </Link>
  );
};

export default CreatedCard;
