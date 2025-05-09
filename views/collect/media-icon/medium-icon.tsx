import { CollectionDetails } from "@/types/collection";

export interface iCollectionDetails {
  collectionDetails?: CollectionDetails;
}
const MediumIcon = ({ collectionDetails }: iCollectionDetails) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clip-path="url(#clip0_3534_19620)">
        <path
          d="M10 0C4.47768 0 0 4.47768 0 10C0 15.5223 4.47768 20 10 20C15.5223 20 20 15.5223 20 10C20 4.47768 15.5223 0 10 0ZM15.7143 5.66295L14.8036 6.53571C14.7232 6.59598 14.6853 6.6942 14.7009 6.79018V13.2121C14.6853 13.3103 14.7232 13.4085 14.8036 13.4665L15.6964 14.3393V14.5335H11.2143V14.3482L12.1362 13.4531C12.2277 13.3616 12.2277 13.3348 12.2277 13.1987V8.00223L9.66071 14.5112H9.31473L6.32812 8.00223V12.3661C6.30134 12.5491 6.36607 12.7344 6.49554 12.8661L7.69643 14.3192V14.5134H4.28571V14.3192L5.48661 12.8661C5.54988 12.8007 5.59697 12.7214 5.6241 12.6346C5.65123 12.5478 5.65766 12.4558 5.64286 12.3661V7.32143C5.65848 7.1808 5.60491 7.04464 5.49777 6.94866L4.4308 5.66295V5.46875H7.74554L10.3036 11.0826L12.5558 5.47321H15.7143V5.66295Z"
          fill={
            collectionDetails?.medium_url
              ? "#B054FF"
              : "rgba(255, 255, 255,0.6)"
          }
        />
      </g>
      <defs>
        <clipPath id="clip0_3534_19620">
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
export default MediumIcon;
