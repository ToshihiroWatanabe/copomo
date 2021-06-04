import { createMuiTheme } from "@material-ui/core/styles";

/** Material-UIのスタイルのテーマ */
export const theme = createMuiTheme({
  palette: {
    // 水色
    primary: {
      light: "#64c9e5",
      main: "#2498b3",
      dark: "#006a83",
      contrastText: "#ffffff",
    },
    // オレンジ
    secondary: {
      light: "#fff065",
      main: "#ffbe30",
      dark: "#c78e00",
      contrastText: "#000000",
    },
    // ダークモード
    // type: "dark",
  },
});
