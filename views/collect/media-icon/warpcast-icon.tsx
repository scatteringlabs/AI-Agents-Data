import { CollectionDetails } from "@/types/collection";

export interface iCollectionDetails {
  collectionDetails?: CollectionDetails;
}
const WarpcastIcon = ({ collectionDetails }: iCollectionDetails) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM13.5563 17H16.4457L19 7H16.4317L15.008 14.2792L13.333 7H10.7089L8.96411 14.2792L7.55434 7H5L7.48455 17H10.3739L11.993 10.4188L13.5563 17Z"
        fill={
          collectionDetails?.tiktok_url ? "#B054FF" : "rgba(255, 255, 255,0.6)"
        }
      />
    </svg>
  );
};
export default WarpcastIcon;
