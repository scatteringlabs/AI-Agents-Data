import { PaletteMode } from "@mui/material";
import { RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";

export const themeOptions = {
  palette: {
    mode: "dark" as PaletteMode,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560,
    },
  },
  typography: {
    fontFamily: ["Poppins"].join(","),
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#b054ff",
          },
        },
      },
    },
  },
};

export const rainbowKitTheme: Theme = {
  blurs: {
    modalOverlay: "...",
  },
  colors: {
    accentColor: "...",
    accentColorForeground: "...",
    actionButtonBorder: "...",
    actionButtonBorderMobile: "...",
    actionButtonSecondaryBackground: "...",
    closeButton: "...",
    closeButtonBackground: "...",
    connectButtonBackground: "rgb(176, 84, 255)",
    connectButtonBackgroundError: "rgb(176, 84, 255)",
    connectButtonInnerBackground: "rgb(176, 84, 255)",
    connectButtonText: "rgb(176, 84, 255)",
    connectButtonTextError: "rgb(176, 84, 255)",
    connectionIndicator: "...",
    downloadBottomCardBackground: "...",
    downloadTopCardBackground: "...",
    error: "...",
    generalBorder: "...",
    generalBorderDim: "...",
    menuItemBackground: "...",
    modalBackdrop: "...",
    modalBackground: "...",
    modalBorder: "...",
    modalText: "...",
    modalTextDim: "...",
    modalTextSecondary: "...",
    profileAction: "...",
    profileActionHover: "...",
    profileForeground: "...",
    selectedOptionBorder: "...",
    standby: "...",
  },
  fonts: {
    body: "...",
  },
  radii: {
    actionButton: "...",
    connectButton: "...",
    menuButton: "...",
    modal: "...",
    modalMobile: "...",
  },
  shadows: {
    connectButton: "...",
    dialog: "...",
    profileDetailsAction: "...",
    selectedOption: "...",
    selectedWallet: "...",
    walletLogo: "...",
  },
};
