import { BLOG, DC, TWITTER } from "@/constants/mediaInfo";

const Footer = () => {
  return (
    <div className="tw-fixed tw-bottom-0 tw-left-0 tw-w-full tw-h-11 tw-z-50 tw-bg-[#010410] tw-px-5 tw-lg:tw-px-20 tw-py-10 tw-flex tw-justify-between tw-items-center">
      <div className="tw-flex tw-items-center ">
        {[{ title: "Blog", url: BLOG }].map((item) => (
          <span
            key={item?.title}
            className="tw-text-white tw-font-semibold tw-text-md tw-lg:tw-text-base tw-mr-16 tw-cursor-pointer"
            onClick={() => window.open(item.url)}
          >
            {item.title}
          </span>
        ))}
        <div
          className="tw-cursor-pointer tw-flex tw-items-center"
          onClick={() => window.open("https://docs.scattering.io/security")}
        >
          <img
            src="/assets/images/footer/audit.svg"
            className="tw-w-5 tw-h-5 tw-mr-1"
            alt="View audit report"
          />
          <span className="tw-text-white tw-font-semibold tw-text-md tw-lg:tw-text-base">
            View audit report
          </span>
        </div>
      </div>
      <div className="tw-flex tw-items-center">
        {[
          {
            icon: "assets/images/footer/discord-white.png",
            url: DC,
          },
          {
            icon: "assets/images/footer/x-white.png",
            url: TWITTER,
          },
        ].map((item) => (
          <img
            key={item.url}
            onClick={() => window.open(item.url)}
            src={item.icon}
            alt=""
            className="tw-ml-10 tw-h-8 tw-cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
};

export default Footer;
