import Link from "next/link";
import MobileMenu from "../MobileMenu";
import Sidebar from "../Sidebar";

interface MobileHeaderProps {
  isMobileMenu: boolean;
  handleMobileMenu: () => void;
  setOpen: (a: boolean) => void;
}
const MobileHeader = ({
  isMobileMenu,
  handleMobileMenu,
  setOpen,
}: MobileHeaderProps) => {
  return (
    <>
      <div className={`mobile-nav-wrap ${isMobileMenu ? "active" : ""}`}>
        <div className="overlay-mobile-nav" onClick={handleMobileMenu} />
        <div
          className="inner-mobile-nav"
          style={{ background: "none", height: "100%" }}
        >
          <Link href="/" rel="home" className="main-logo">
            <img
              id="mobile-logo_header"
              src="/assets/images/logo/logo.png"
              data-retina="assets/images/logo/logo-dark@2x.png"
            />
          </Link>

          <div
            className="mobile-nav-close"
            onClick={handleMobileMenu}
            style={{
              zIndex: 29000,
              right: "100px",
              top: "42px",
              height: "100%",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="white"
              x="0px"
              y="0px"
              width="20px"
              height="20px"
              viewBox="0 0 122.878 122.88"
              enableBackground="new 0 0 122.878 122.88"
              xmlSpace="preserve"
            >
              <g>
                <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313L1.426,8.313z" />
              </g>
            </svg>
          </div>
          {isMobileMenu ? <Sidebar /> : null}
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
