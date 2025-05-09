import { getProjectDetailsByAddress } from "@/views/launchpad/create/tokenService";
import ProjectPreviewPage from "@/views/launchpad/preview/project-page";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useMemo } from "react";

const ProjectPage = ({
  tokenAddress,
  level,
}: {
  tokenAddress: string;
  level: number;
}) => {
  const router = useRouter();
  const { data: projectDetails, isLoading } = useQuery({
    queryKey: ["project-page", tokenAddress],
    queryFn: () => getProjectDetailsByAddress(tokenAddress?.toString()),
    enabled: Boolean(tokenAddress),
  });
  const info = useMemo(() => projectDetails?.data, [projectDetails]);
  return (
    <ProjectPreviewPage
      collectionName={info?.collection_name || ""}
      nftQuantity={Number(info?.nft_quantity) || 0}
      tokenQuantity={1000000000}
      images={
        info?.nft_media_images
          ? info?.nft_media_images
              ?.split(",")
              ?.map(
                (i) => `https://dme30nyhp1pym.cloudfront.net/assets/${i}`,
              ) || []
          : []
      }
      preview={
        info?.pre_reveal_image
          ? `https://dme30nyhp1pym.cloudfront.net/assets/${info?.pre_reveal_image}`
          : ""
      }
      tokenSymbol={info?.token_symbol || ""}
      logo={
        info?.collection_logo
          ? `https://dme30nyhp1pym.cloudfront.net/assets/${info?.collection_logo}`
          : ""
      }
      banner={
        info?.banner_image
          ? `https://dme30nyhp1pym.cloudfront.net/assets/${info?.banner_image}`
          : ""
      }
      tokenAddress={tokenAddress?.toString()}
      overview={info?.collection_story}
      teamInfo={info?.nft_info}
      price={0.0000000000001}
      projectDetails={projectDetails?.data}
      description={projectDetails?.data?.description}
      type="record"
      slug={projectDetails?.data?.slug}
      level={level}
    />
  );
};

export default ProjectPage;
