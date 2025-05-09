import { Box, Link, useMediaQuery, useTheme } from "@mui/material";
const Logo = () => {
  const theme = useTheme();

  // const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box>
      <Box
        id="site-logo"
        sx={{
          width: { xs: "40px !important", md: "160px !important" },
          mt: { xs: 0, md: 0.3 },
        }}
      >
        <Box id="site-logo-inner">
          <Link href="/" rel="home" className="main-logo">
            <Box
              component="img"
              id="logo_header"
              src={
                isSm
                  ? "/assets/images/logo/logo.png"
                  : "/assets/images/logo/logo-mb.svg"
              }
              data-retina="/assets/images/logo/logo.png"
            />
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
export default Logo;
