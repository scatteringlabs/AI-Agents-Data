import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  loop: false,
  slidesPerView: 2,
  observer: true,
  grabCursor: true,
  observeParents: true,
  spaceBetween: 30,
  autoplay: {
    delay: 2700,
    disableOnInteraction: false,
  },
  navigation: {
    clickable: true,
    nextEl: ".seller-next",
    prevEl: ".seller-prev",
  },
  breakpoints: {
    500: {
      slidesPerView: 3,
    },
    640: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 5,
    },
    1070: {
      slidesPerView: 6,
    },
  },
};

import Link from "next/link";
export default function Seller7() {
  return (
    <>
      <div className="tf-section seller ">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="heading-section">
                <h2 className="tf-title pb-30">
                  Our top collection in
                  <span className="dropdown" id="select-day">
                    <span className="btn-selector tf-color">
                      <span>1 day</span>
                    </span>
                    <ul>
                      <li>
                        <span>1 day</span>
                      </li>
                      <li>
                        <span>3 day</span>
                      </li>
                      <li>
                        <span>7 day</span>
                      </li>
                    </ul>
                  </span>
                </h2>
              </div>
            </div>
            <div className="col-md-12">
              <Swiper
                {...swiperOptions}
                className="swiper-container seller seller-slider2"
              >
                <div className="swiper-wrapper">
                  <SwiperSlide>
                    <div className="tf-author-box text-center">
                      <div className="author-avatar ">
                        <img
                          src="/assets/images/avatar/avatar-01.png"
                          alt=""
                          className="avatar"
                        />
                        <div className="number">1</div>
                      </div>
                      <div className="author-infor ">
                        <h5>
                          <Link href="/author-2">Midjourney NFTs</Link>
                        </h5>
                        <h6 className="price gem style-1">
                          <i className="icon-gem" />
                          7,080.95
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tf-author-box text-center">
                      <div className="author-avatar ">
                        <img
                          src="/assets/images/avatar/avatar-02.png"
                          alt=""
                          className="avatar"
                        />
                        <div className="number">2</div>
                      </div>
                      <div className="author-infor ">
                        <h5>
                          <Link href="/author-2">Theresa Webb</Link>
                        </h5>
                        <h6 className="price gem style-1">
                          <i className="icon-gem" />
                          7,080.95
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tf-author-box text-center">
                      <div className="author-avatar ">
                        <img
                          src="/assets/images/avatar/avatar-03.png"
                          alt=""
                          className="avatar"
                        />
                        <div className="number">3</div>
                      </div>
                      <div className="author-infor ">
                        <h5>
                          <Link href="/author-2">Devon Lane</Link>
                        </h5>
                        <h6 className="price gem style-1">
                          <i className="icon-gem" />
                          7,080.95
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tf-author-box text-center">
                      <div className="author-avatar ">
                        <img
                          src="/assets/images/avatar/avatar-04.png"
                          alt=""
                          className="avatar"
                        />
                        <div className="number">4</div>
                      </div>
                      <div className="author-infor ">
                        <h5>
                          <Link href="/author-2">Courtney Henry</Link>
                        </h5>
                        <h6 className="price gem style-1">
                          <i className="icon-gem" />
                          7,080.95
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tf-author-box text-center">
                      <div className="author-avatar ">
                        <img
                          src="/assets/images/avatar/avatar-05.png"
                          alt=""
                          className="avatar"
                        />
                        <div className="number">5</div>
                      </div>
                      <div className="author-infor ">
                        <h5>
                          <Link href="/author-2">Courtney Henry</Link>
                        </h5>
                        <h6 className="price gem style-1">
                          <i className="icon-gem" />
                          7,080.95
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tf-author-box text-center">
                      <div className="author-avatar ">
                        <img
                          src="/assets/images/avatar/avatar-06.png"
                          alt=""
                          className="avatar"
                        />
                        <div className="number">6</div>
                      </div>
                      <div className="author-infor ">
                        <h5>
                          <Link href="/author-2">Courtney Henry</Link>
                        </h5>
                        <h6 className="price gem style-1">
                          <i className="icon-gem" />
                          7,080.95
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tf-author-box text-center">
                      <div className="author-avatar ">
                        <img
                          src="/assets/images/avatar/avatar-01.png"
                          alt=""
                          className="avatar"
                        />
                        <div className="number">7</div>
                      </div>
                      <div className="author-infor ">
                        <h5>
                          <Link href="/author-2">Courtney Henry</Link>
                        </h5>
                        <h6 className="price gem style-1">
                          <i className="icon-gem" />
                          7,080.95
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tf-author-box text-center">
                      <div className="author-avatar ">
                        <img
                          src="/assets/images/avatar/avatar-02.png"
                          alt=""
                          className="avatar"
                        />
                        <div className="number">8</div>
                      </div>
                      <div className="author-infor ">
                        <h5>
                          <Link href="/author-2">Courtney Henry</Link>
                        </h5>
                        <h6 className="price gem style-1">
                          <i className="icon-gem" />
                          7,080.95
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                </div>
              </Swiper>
              <div className="swiper-button-next seller-next over active" />
              <div className="swiper-button-prev seller-prev over " />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
