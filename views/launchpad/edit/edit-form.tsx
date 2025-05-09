import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getProjectDetails } from "../create/tokenService";
import LaunchNFTForm from "../create/page";
import { useAccount } from "wagmi";
import Custom404 from "@/pages/404";

const EditForm = ({ id }: { id: string }) => {
  const { address } = useAccount();
  const {
    data: projectDetails,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["projectDetails"],
    queryFn: () => getProjectDetails(id),
    enabled: Boolean(id),
  });
  return projectDetails?.data?.wallet_address?.toLowerCase() ===
    address?.toLowerCase() ? (
    <LaunchNFTForm
      projectDetails={projectDetails?.data}
      detailsIsLoading={isLoading}
      refetch={refetch}
    />
  ) : null;
};

export default EditForm;
