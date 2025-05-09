import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AddClassBody() {
  const router = useRouter();

  useEffect(() => {
    document.querySelector("body").classList.add("body");
    router.pathname === "/home-5"
      ? document.querySelector("body").classList.add("background-white")
      : document.querySelector("body").classList.remove("background-white");
    router.pathname === "/home-6"
      ? document.querySelector("body").classList.add("dashboard")
      : document.querySelector("body").classList.remove("dashboard");
    router.pathname === "/home-7"
      ? document
          .querySelector("body")
          .classList.add("counter-scroll", "sticky-scroll1")
      : document
          .querySelector("body")
          .classList.remove("counter-scroll", "sticky-scroll1");
    router.pathname === "/404"
      ? document
          .querySelector("body")
          .classList.add("header-fixed", "counter-scroll")
      : null;
    router.pathname === "/terms-condition"
      ? document
          .querySelector("body")
          .classList.add("header-fixed", "sticky-scroll")
      : null;
    router.pathname === "/about-us"
      ? document.querySelector("body").classList.add("counter-scroll")
      : null;
    router.pathname === "/author-1"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/author-2"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/blog-detail"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/blog-grid"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/blog-grid-1"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/blog-list"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/blog-list-1"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/coming-soon"
      ? document
          .querySelector("body")
          .classList.add("header-fixed", "counter-scroll")
      : null;
    router.pathname === "/contact-us"
      ? document.querySelector("body").classList.add("counter-scroll")
      : null;
    router.pathname === "/explore-1"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/explore-2"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/explore-3"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/explore-4"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/maintenance"
      ? document
          .querySelector("body")
          .classList.add("header-fixed", "counter-scroll")
      : null;
    router.pathname === "/product-detail-1"
      ? document
          .querySelector("body")
          .classList.add("header-fixed", "counter-scroll")
      : null;
    router.pathname === "/product-detail-2"
      ? document
          .querySelector("body")
          .classList.add("header-fixed", "counter-scroll")
      : null;
    router.pathname === "/product-detail-3"
      ? document
          .querySelector("body")
          .classList.add("header-fixed", "counter-scroll")
      : null;
    router.pathname === "/ranking"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/upcoming"
      ? document.querySelector("body").classList.add("header-fixed")
      : null;
    router.pathname === "/sign-up"
      ? document.querySelector("body").classList.add("counter-scroll")
      : null;
    router.pathname === "/slider-3d"
      ? document.querySelector("body").classList.add("counter-scroll")
      : null;
    router.pathname === "/market-active-bid"
      ? document.querySelector("body").classList.add("dashboard1")
      : null;
    router.pathname === "/market-collection"
      ? document.querySelector("body").classList.add("dashboard1")
      : null;
    router.pathname === "/market-create"
      ? document.querySelector("body").classList.add("dashboard1")
      : null;
    router.pathname === "/market-explore"
      ? document.querySelector("body").classList.add("dashboard1")
      : null;
    router.pathname === "/market-favorite"
      ? document.querySelector("body").classList.add("dashboard1")
      : null;
    router.pathname === "/market-history"
      ? document.querySelector("body").classList.add("dashboard1")
      : null;
    router.pathname === "/market-wallet"
      ? document.querySelector("body").classList.add("dashboard1")
      : null;
    router.pathname === "/market"
      ? document.querySelector("body").classList.add("dashboard1")
      : null;
  });
}
