import React, { useEffect, useState, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import SimpleSnackbar from "./SimpleSnackbar";

const useStyles = makeStyles((theme) => ({
  happyTomato: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: "2000",
    top: "calc(50vh - 4rem)",
    left: "calc(50vw - 4rem)",
    right: "0",
    bottom: "0",
    margin: "auto",
  },
  "@keyframes appearHappyTomato": {
    from: { transform: "translate(0, 100%)" },
    to: { transform: "translate(0, 0)" },
  },
  appearHappyTomato: {
    animationName: "$appearHappyTomato",
    animationDuration: "5s",
  },
  "@keyframes sparkHappyTomatoN": {
    from: { transform: "translate(0, 0)" },
    to: { transform: "translate(0, -1500px)" },
  },
  sparkHappyTomatoN: {
    animationName: "$sparkHappyTomatoN",
    animationDuration: "2s",
  },
  "@keyframes sparkHappyTomatoNE": {
    from: { transform: "translate(0, 0)" },
    to: { transform: "translate(1061px, -1061px)" },
  },
  sparkHappyTomatoNE: {
    animationName: "$sparkHappyTomatoNE",
    animationDuration: "2s",
  },
  "@keyframes sparkHappyTomatoE": {
    from: { transform: "translate(0, 0)" },
    to: { transform: "translate(1500px, 0)" },
  },
  sparkHappyTomatoE: {
    animationName: "$sparkHappyTomatoE",
    animationDuration: "2s",
  },
  "@keyframes sparkHappyTomatoSE": {
    from: { transform: "translate(0, 0)" },
    to: { transform: "translate(1061px, 1061px)" },
  },
  sparkHappyTomatoSE: {
    animationName: "$sparkHappyTomatoSE",
    animationDuration: "2s",
  },
  "@keyframes sparkHappyTomatoS": {
    from: { transform: "translate(0, 0)" },
    to: { transform: "translate(0, 1500px)" },
  },
  sparkHappyTomatoS: {
    animationName: "$sparkHappyTomatoS",
    animationDuration: "2s",
  },
  "@keyframes sparkHappyTomatoSW": {
    from: { transform: "translate(0, 0)" },
    to: { transform: "translate(-1061px, 1061px)" },
  },
  sparkHappyTomatoSW: {
    animationName: "$sparkHappyTomatoSW",
    animationDuration: "2s",
  },
  "@keyframes sparkHappyTomatoW": {
    from: { transform: "translate(0, 0)" },
    to: { transform: "translate(-1500px, 0)" },
  },
  sparkHappyTomatoW: {
    animationName: "$sparkHappyTomatoW",
    animationDuration: "2s",
  },
  "@keyframes sparkHappyTomatoNW": {
    from: { transform: "translate(0, 0)" },
    to: { transform: "translate(-1061px, -1061px)" },
  },
  sparkHappyTomatoNW: {
    animationName: "$sparkHappyTomatoNW",
    animationDuration: "2s",
  },
}));

/**
 * ???の関数コンポーネントです。
 */
const HappyTomato = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();

  const [appearHappyTomato, setAppearHappyTomato] = useState(false);
  const [sparkHappyTomato, setSparkHappyTomato] = useState(false);
  const [happySnackbarOpen, setHappySnackbarOpen] = useState(false);

  useEffect(() => {
    if (props.showHappyTomato) {
      playHappyTomato();
    }
  }, [props.showHappyTomato]);

  const playHappyTomato = () => {
    console.info("……おや！？");
    console.info("トマトの ようすが……！");
    setAppearHappyTomato(true);
    setTimeout(() => {
      setSparkHappyTomato(true);
      setTimeout(() => {
        setSparkHappyTomato(false);
        setAppearHappyTomato(false);
        props.setShowHappyTomato(false);
        setHappySnackbarOpen(true);
        console.info(
          "本日の累計ポモドーロ数が" +
            (props.todayPomodoroCountThreshold -
              props.todayPomodoroCountInterval) +
            "を超えました！"
        );
      }, 2000);
    }, 5000);
  };

  return (
    <>
      {props.showHappyTomato && (
        <div id="happyTomato">
          <Typography
            variant="h1"
            className={`${classes.happyTomato} ${
              appearHappyTomato && classes.appearHappyTomato
            } ${sparkHappyTomato && classes.sparkHappyTomatoN}`}
          >
            🍅
          </Typography>
          <Typography
            variant="h1"
            className={`${classes.happyTomato} ${
              appearHappyTomato && classes.appearHappyTomato
            } ${sparkHappyTomato && classes.sparkHappyTomatoNE}`}
          >
            🍅
          </Typography>
          <Typography
            variant="h1"
            className={`${classes.happyTomato} ${
              appearHappyTomato && classes.appearHappyTomato
            } ${sparkHappyTomato && classes.sparkHappyTomatoE}`}
          >
            🍅
          </Typography>
          <Typography
            variant="h1"
            className={`${classes.happyTomato} ${
              appearHappyTomato && classes.appearHappyTomato
            } ${sparkHappyTomato && classes.sparkHappyTomatoSE}`}
          >
            🍅
          </Typography>
          <Typography
            variant="h1"
            className={`${classes.happyTomato} ${
              appearHappyTomato && classes.appearHappyTomato
            } ${sparkHappyTomato && classes.sparkHappyTomatoS}`}
          >
            🍅
          </Typography>
          <Typography
            variant="h1"
            className={`${classes.happyTomato} ${
              appearHappyTomato && classes.appearHappyTomato
            } ${sparkHappyTomato && classes.sparkHappyTomatoSW}`}
          >
            🍅
          </Typography>
          <Typography
            variant="h1"
            className={`${classes.happyTomato} ${
              appearHappyTomato && classes.appearHappyTomato
            } ${sparkHappyTomato && classes.sparkHappyTomatoW}`}
          >
            🍅
          </Typography>
          <Typography
            variant="h1"
            className={`${classes.happyTomato} ${
              appearHappyTomato && classes.appearHappyTomato
            } ${sparkHappyTomato && classes.sparkHappyTomatoNW}`}
          >
            🍅
          </Typography>
        </div>
      )}
      <SimpleSnackbar
        message={
          "本日の累計ポモドーロ数が" +
          (props.todayPomodoroCountThreshold -
            props.todayPomodoroCountInterval) +
          "を超えました！"
        }
        open={happySnackbarOpen}
        setOpen={setHappySnackbarOpen}
      />
    </>
  );
});

export default HappyTomato;
