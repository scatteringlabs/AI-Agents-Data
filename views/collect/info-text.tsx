import React from "react";
import { format } from "date-fns";
import { chainIdToName } from "@/utils";
import { DesBoldText, DesText } from "@/components/text";
import { formatIntNumberWithKM } from "@/utils/format";

interface InfoItem {
  label: string;
  value: string | number | React.ReactNode;
}

interface CollectionDetails {
  collection_type?: {
    name: string;
  };
}

interface InfoTextProps {
  totalSupply?: string;
  nftItems?: string;
  createTime?: string;
  collectionDetails?: CollectionDetails;
  chainId?: number;
}

const InfoText: React.FC<InfoTextProps> = ({
  totalSupply,
  nftItems,
  createTime,
  collectionDetails,
  chainId,
}) => {
  const infoItems: InfoItem[] = [
    {
      label: "Total supply",
      value: formatIntNumberWithKM(totalSupply),
    },
    {
      label: "Items",
      value: formatIntNumberWithKM(nftItems),
    },
    {
      label: "Created",
      value: format(new Date(Number(createTime || 0) * 1000), "MMM, yyyy"),
    },
    {
      label: "Token Standard",
      value: collectionDetails?.collection_type?.name || "N/A",
    },
    {
      label: "Chain",
      value: chainIdToName(chainId),
    },
  ];

  return (
    <DesText sx={{ display: "inline-block" }}>
      {infoItems.map((item, index) => (
        <React.Fragment key={index}>
          <DesBoldText sx={{ display: "inline-block" }}>
            {item.label}{" "}
          </DesBoldText>{" "}
          {item.value} {index < infoItems.length - 1 && "· "}
        </React.Fragment>
      ))}
    </DesText>
  );
};

export default InfoText;
