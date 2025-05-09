import { CollectionDetails } from "@/types/collection";

export interface iCollectionDetails {
  collectionDetails?: CollectionDetails;
}
const OkxIcon = ({ collectionDetails }: iCollectionDetails) => {
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
        d="M2 12C2 6.47368 6.475 2 12 2C17.525 2 22 6.47368 22 12C22 17.5263 17.525 22 12 22C6.475 22 2 17.5263 2 12ZM10 6H6V10H9.99998V13.9996H14V9.99961H10V6ZM10 14.0004H6V18.0004H10V14.0004ZM14 6H18V10H14V6ZM18 14.0004H14V18.0004H18V14.0004Z"
        fill={
          collectionDetails?.okxmarket_url
            ? "#B054FF"
            : "rgba(255, 255, 255,0.6)"
        }
      />
    </svg>
  );
};
export default OkxIcon;
