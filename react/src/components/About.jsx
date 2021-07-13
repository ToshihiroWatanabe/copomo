import React, { useState, useEffect, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, Link } from "@material-ui/core";
import FeedbackIcon from "@material-ui/icons/Feedback";
import preval from "preval.macro";
import axios from "axios";

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(64),
      height: "auto",
    },
    zIndex: "2",
  },
  paper: {
    padding: theme.spacing(3),
  },
  faqQ: {
    marginBottom: theme.spacing(1),
  },
  feedbackLink: {
    color: "#2498b3",
  },
}));

/**
 * 「CoPomoについて」画面の関数コンポーネントです。
 */
const About = memo(() => {
  /** Material-UIのスタイル */
  const classes = useStyles();

  const [buildTimestamp, setBuildTimestamp] = useState(new Date(0));

  useEffect(() => {
    axios
      .create({
        // リクエスト送信先のURL
        baseURL:
          process.env.NODE_ENV === "development" ? "http://localhost:8080" : "",
        // ヘッダーでタイプをJSONに指定
        headers: {
          "Content-type": "application/json",
        },
      })
      .get("/actuator/info")
      .then((response) => {
        setBuildTimestamp(new Date(response.data.application.buildTimestamp));
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <p>
          25分作業と5分休憩を繰り返す時間管理術、「ポモドーロ・テクニック」のために作られたタイマーです。
        </p>
        <p>他のユーザーと一緒にポモドーロしましょう！</p>
        <br />
        <p>動作確認は、Windows 10のGoogle ChromeとFirefoxで行っています。</p>
        <br />

        <Typography
          variant="body1"
          component="p"
          className={classes.feedbackLink}
        >
          <Link
            href="https://forms.gle/qyGVL6gzb1iY2oyJ8"
            target="_blank"
            rel="noreferrer"
          >
            <FeedbackIcon />
            フィードバックを送る
          </Link>
        </Typography>
        {/* 2分以内なら最新 */}
        {buildTimestamp.getTime() -
          preval`module.exports = new Date().getTime();` <=
          120000 &&
        buildTimestamp.getTime() -
          preval`module.exports = new Date().getTime();` >=
          0
          ? "お使いのアプリは最新のバージョンです😀"
          : ""}
        {buildTimestamp.getTime() -
          preval`module.exports = new Date().getTime();` >=
        3600000
          ? "キャッシュを削除すると最新版がダウンロードされます。"
          : ""}
        <Typography variant="body2" component="p">
          クライアント側のビルド時刻:{" "}
          {preval`module.exports = new Date().toLocaleString("ja");`}
          <br />
          {buildTimestamp.getTime() !== 0
            ? "サーバー側のビルド時刻　　: " +
              buildTimestamp.toLocaleString("ja")
            : ""}
        </Typography>
        <br />
        <p>Copyright © 2021 ワタナベトシヒロ All Rights Reserved.</p>
      </Paper>
    </div>
  );
});

export default About;
