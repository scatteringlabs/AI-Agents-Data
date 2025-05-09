import { DC, TG, TWITTER } from "@/constants/mediaInfo";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function Footer1() {
  return (
    <>
      <footer id="footer" className="tw-px-2 md:tw-px-20">
        <div className="themesflat-container">
          <div>
            <div className="col-12">
              <Box
                sx={{
                  flexDirection: { md: "row", xs: "column" },
                  alignItems: "center",
                }}
                className="footer-content flex flex-grow"
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                  className="widget-logo flex-grow"
                >
                  <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                    <Link
                      href="https://scattering.medium.com/"
                      target="_blank"
                      className="tw-mr-4 md:tw-mr-16"
                    >
                      <Typography
                        variant="h5"
                        className="title-widget"
                        sx={{ fontSize: { md: 16, xs: 11 } }}
                      >
                        Blog
                      </Typography>
                    </Link>
                    <Link href="https://docs.scattering.io" target="_blank">
                      <Typography
                        variant="h5"
                        className="title-widget"
                        sx={{
                          fontSize: { md: 16, xs: 10 },
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Docs
                      </Typography>
                    </Link>
                  </Box>
                </Box>

                <Box
                  className="widget-last"
                  sx={{ margin: { md: "0", xs: "0 auto" } }}
                >
                  <Box className="widget-social">
                    <ul className="flex">
                      <li>
                        <Link
                          target="_blank"
                          href="https://dune.com/scattering/token404"
                        >
                          <img
                            src="/assets/images/footer/dune.svg"
                            className="tw-w-6 tw-h-6 md:tw-w-8 md:tw-h-8"
                            alt="x"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link
                          target="_blank"
                          href="https://github.com/scatteringlabs"
                        >
                          <img
                            src="/assets/images/footer/github-white.svg"
                            className="tw-w-6 tw-h-6 md:tw-w-8 md:tw-h-8"
                            alt="x"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link target="_blank" href={TG}>
                          <img
                            src="/assets/images/footer/telegram.svg"
                            className="tw-w-6 tw-h-6 md:tw-w-8 md:tw-h-8"
                            alt="TG"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link target="_blank" href={TWITTER}>
                          <img
                            src="/assets/images/footer/x-white.png"
                            className="tw-w-6 tw-h-6 md:tw-w-8 md:tw-h-8"
                            alt="x"
                          />
                        </Link>
                      </li>

                      <li>
                        <Link target="_blank" href={DC}>
                          <img
                            src="/assets/images/footer/discord-white.png"
                            className="tw-w-6 tw-h-6 md:tw-w-8 md:tw-h-8"
                            alt="discord"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link
                          target="_blank"
                          href="https://www.youtube.com/@scatteringlabs"
                        >
                          <img
                            src="/assets/images/footer/youtube.svg"
                            className="tw-w-6 tw-h-6 md:tw-w-8 md:tw-h-8"
                            alt="discord"
                          />
                        </Link>
                      </li>
                    </ul>
                  </Box>
                  <div className="widget-social"></div>
                </Box>
              </Box>
            </div>
          </div>
          {/* <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Scattering - By ScatteringLab </p>
        </div> */}
        </div>
      </footer>
    </>
  );
}
