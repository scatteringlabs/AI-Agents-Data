import Countdown from "@/components/elements/Countdown";
import Link from "next/link";
const currentTime = new Date();
const NFTCard = () => {
  return (
    <div
      data-wow-delay="0s"
      className="wow fadeInUp fl-item-1 col-lg-3 col-md-4"
    >
      <div className="tf-card-box style-4">
        {/* <div className="author flex items-center">
          <div className="avatar">
            <img src="/assets/images/avatar/avatar-box-02.jpg" alt="Image" />
          </div>
          <div className="info">
            <span>Created by:</span>
            <h6>
              <Link href="/author-2">Marvin McKinney</Link>{" "}
            </h6>
          </div>
        </div> */}
        <div className="card-media">
          <Link href="#">
            <img src="/assets/images/test-img/pdr.png" alt="" />
          </Link>
          <span className="wishlist-button icon-heart" />
          <div className="featured-countdown">
            <Countdown
              endDateTime={currentTime.setDate(currentTime.getDate() + 2)}
            />
          </div>
        </div>
        <h5 className="name">
          <Link href="#">Dayco serpentine belt</Link>
        </h5>
        <div className="meta-info flex items-center justify-between">
          <div>
            <span className="text-bid">Current Bid</span>
            <h6 className="price gem">
              <i className="icon-gem" />
              0,34
            </h6>
          </div>
          <div className="button-place-bid">
            <a onClick={() => {}} href="#" className="tf-button">
              <span>Place Bid</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
