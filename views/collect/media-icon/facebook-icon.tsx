import { CollectionDetails } from "@/types/collection";

export interface iCollectionDetails {
  collectionDetails?: CollectionDetails;
}
const FacebookIcon = ({ collectionDetails }: iCollectionDetails) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clip-path="url(#clip0_3534_19631)">
        <path
          d="M20 10C20 4.47727 15.5227 0 10 0C4.47727 0 0 4.47727 0 10C0 15.5227 4.47727 20 10 20C15.5227 20 20 15.5227 20 10ZM7.31455 10V8.08636H8.48727V6.92909C8.48727 5.36818 8.95364 4.24364 10.6627 4.24364H12.6955V6.15273H11.2645C10.5473 6.15273 10.3845 6.62909 10.3845 7.12818V8.08636H12.59L12.2891 10H10.3845V15.7718H8.48727V10H7.31455Z"
          fill={
            collectionDetails?.facebook_url
              ? "#B054FF"
              : "rgba(255, 255, 255,0.6)"
          }
        />
      </g>
      <defs>
        <clipPath id="clip0_3534_19631">
          <rect
            width="20"
            height="20"
            fill={
              collectionDetails?.tiktok_url
                ? "#B054FF"
                : "rgba(255, 255, 255,0.6)"
            }
          />
        </clipPath>
      </defs>
    </svg>
  );
};
export default FacebookIcon;
