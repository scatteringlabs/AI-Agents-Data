import { Box } from "@mui/material";

interface DetailItem {
  label: string;
  content?: string | number | JSX.Element;
}
type DetailMeta = DetailItem[];
interface DetailBarProps {
  data: DetailMeta;
  background?: string;
  justifyContent?: string;
}

interface iLabelValueText {
  label: string;
  value: string | number | JSX.Element;
}
export const LabelValueText = ({ label, value }: iLabelValueText) => {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-flex-shrink-0 tw-gap-2 md:tw-gap-3">
      <Box
        className="tw-uppercase tw-text-sm md:tw-text-base md:tw-font-medium tw-text-greyMetal"
        sx={{
          textAlign: "center",
          fontWeight: 400,
          fontFamily: "Poppins",
          fontSize: { md: "14px !important", xs: "10px !important" },
        }}
      >
        {label ?? ""}
      </Box>
      <Box
        className="tw-text-base md:tw-text-lg md:tw-font-semibold tw-flex tw-items-center tw-gap-2"
        sx={{
          textAlign: "center",
          fontWeight: 600,
          fontFamily: "Poppins",
          fontSize: { md: "16px !important", xs: "12px !important" },
        }}
      >
        {value ?? ""}
      </Box>
    </div>
  );
};

export default function DetailBar({
  data,
  background = "rgb(0 0 0 / .5)",
  justifyContent = "space-between",
}: DetailBarProps) {
  const details = data?.map((detail, detailIdx) => {
    return (
      <LabelValueText
        key={detailIdx}
        label={detail?.label ?? ""}
        value={detail?.content ?? ""}
      />
    );
  });
  return (
    <Box
      sx={{
        border: "1px solid rgba(255, 255, 255, 0.10)",
        borderRadius: "10px !important",
        padding: { md: "14px 20px", xs: "14px 10px" },
        background,
        justifyContent: justifyContent,
      }}
      className="tw-flex tw-flex-shrink-0 tw-rounded-3xl tw-gap-3 md:tw-gap-10"
    >
      {details}
    </Box>
  );
}
