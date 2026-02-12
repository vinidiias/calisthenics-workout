import { createTheme } from "@mui/material";

export const themeMui = (isDark) =>
  createTheme({
    typography: {
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      allVariants: {
        fontFamily: "Inter",
        letterSpacing: "1px",
      },
    },
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        dark: isDark ? "#202124" : "#fff",
        light: isDark ? "#fff" : "#202124",
        main: "rgb(152, 164, 179)",
        contrastText: isDark ? "#000" : "#fff",
      },
      button: {
        primary: isDark ? "#f2f2f2" : "#202124",
      },
      secondary: {
        main: "#f48fb1",
      },
      background: {
        default: isDark ? "#202124" : "#f2f2f2",
        paper: isDark ? "#202124" : "#f8f8f8",
      },
      text: {
        primary: isDark ? "#fff" : "#121212",
        contrastText: isDark ? "#121212" : "#fff",
      },
      input: {
        primary: isDark ? "rgba(29, 33, 38, 0.4)" : "#f2f2f2",
        secondary: isDark ? "rgba(152, 164, 179, 0.69)" : "rgba(0, 0, 0, 0.8)",
        border: isDark ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
      },
      divider: isDark ? "#4242424f" : "#97979731",
    },
    components: {
      MuiDatePicker: {
        defaultProps: {},
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            color: isDark ? "rgba(152, 164, 179, 0.69)" : "rgba(0, 0, 0, 0.8)",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          variant: "contained",
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
          },
          contained: {
            background: isDark ? "#E5E5E5" : "#202124",
            color: isDark ? "#202124" : "#E5E5E5",
            "&:hover": {
              background: isDark ? "#bbbbbbff" : "#303135ff",
              boxShadow: "none",
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          body1: {
            color: isDark ? "#f2f2f2" : "#202124",
            fontSize: ".9rem",
          },
          body2: {
            color: isDark ? "#d6d6d6ff" : "gray",
            fontSize: ".85rem",
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#202124" : "#fff",
          },
          disableGutters: true,
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            [".MuiOutlinedInput-root"]: {
              color: isDark ? "rgb(152, 164, 179)" : "#757575",
            },
            [".MuiFormLabel-root"]: {
              color: isDark ? "rgb(152, 164, 179)" : "#757575",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isDark ? "rgb(152, 164, 179)" : "#757575",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          root: {
            [".MuiPaper-root"]: {
              backgroundColor: isDark ? "#000000ff" : "#f2f2f2",
            },
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            boxSizing: "border-box",
            margin: 0,
            padding: 0,
            scrollbarWidth: "thin",
            scrollbarColor: isDark ? "#5a5a5a #202124" : "#c1c1c1 #f2f2f2",
          },
          "*::-webkit-scrollbar": {
            width: "8px",
          },
          "*::-webkit-scrollbar-track": {
            background: isDark ? "#202124" : "#f2f2f2",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: isDark ? "#5a5a5a" : "#c1c1c1",
            borderRadius: "4px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: isDark ? "#787878" : "#a0a0a0",
          },
          html: {
            MozOsxFontSmoothing: "grayscale",
            WebkitFontSmoothing: "antialiased",
            display: "flex",
            flexDirection: "column",
            minHeight: "100%",
            width: "100%",
          },
          body: {
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            minHeight: "100%",
            width: "100%",
          },
          "#root": {
            minHeight: "100vh",
          },
        },
      },
    },
  });
