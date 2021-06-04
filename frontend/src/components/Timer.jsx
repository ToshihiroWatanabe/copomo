import React, { useEffect, useState, memo } from "react";
import WorkSplitButton from "./WorkSplitButton";
import BreakSplitButton from "./BreakSplitButton";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  Typography,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import YouTube from "react-youtube";
import { Duration } from "luxon";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import startedAudio from "../audio/notification_simple-01.mp3";
import stoppedAudio from "../audio/notification_simple-02.mp3";
import endedAudio from "../audio/sound02.mp3";
import tickAudio from "../audio/tick.mp3";
import { changeFaviconTo } from "../change-favicon";
import UserService from "../services/user.service";
import OverallService from "../services/overall.service";
import Platform from "platform";
import PictureInPictureAltIcon from "@material-ui/icons/PictureInPictureAlt";

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2),
    marginRight: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    minHeight: "13rem",
    maxWidth: "768px",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(1),
      padding: theme.spacing(2),
    },
    [theme.breakpoints.up("sm")]: {
      maxHeight: "30vh",
    },
  },
  modeSelect: {
    display: "flex",
  },
}));

/** 1度にカウントする量(秒) */
const COUNTS_EVERY_SECOND = 1;
/** カウントの間隔(秒) */
const COUNT_INTERVAL = 1000;
/** タイマーカウントのtimeout */
let timerCountTimeout = null;
/** タイマーをスタートしたときの時刻 */
let startTime = null;
/** 最後にタイマーのカウントが動いた時刻 */
let lastCountTime = null;

let incTimeSpentTimeout = null;

/** タイマー開始の効果音 */
const startedSound = new Audio(startedAudio);
/** タイマー停止の効果音 */
const stoppedSound = new Audio(stoppedAudio);
/** タイマー完了の効果音 */
const endedSound = new Audio(endedAudio);
/** タイマーのチクタク音 */
const tickSound = new Audio(tickAudio);
tickSound.volume = 1;

/** YouTube動作再生オプション */
const playerOptions = {
  height: "1",
  width: "1",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
  },
};

let workVideoPlayer = null;
let breakVideoPlayer = null;
let videoPlayDone = true;

/**
 * タイマーの関数コンポーネントです。
 */
const Timer = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
  // 作業時間(秒)
  const [workLength, setWorkLength] = useState(60 * 25);
  // 休憩時間(秒)
  const [breakLength, setBreakLength] = useState(60 * 5);
  // 動画の読み込みが終わったかどうか
  const [workVideoOnReady, setWorkVideoOnReady] = useState(false);
  const [breakVideoOnReady, setBreakVideoOnReady] = useState(false);
  // 作業用BGMの動画ID
  const [workVideoId, setWorkVideoId] = useState(
    props.settings.workVideoUrl.split(/v=|\//).slice(-1)[0]
  );
  // 休憩用BGMの動画ID
  const [breakVideoId, setBreakVideoId] = useState(
    props.settings.breakVideoUrl.split(/v=|\//).slice(-1)[0]
  );

  // 設定の動画URLに変化があったとき
  useEffect(() => {
    // タイマーが作動していないとき
    if (!props.timerOn) {
      // 動画IDを更新
      updateVideoId();
    }
  }, [props.settings.workVideoUrl, props.settings.breakVideoUrl]);

  // 設定の作業用動画の音量に変化があったとき
  useEffect(() => {
    // 作業用動画が存在しているとき
    if (workVideoPlayer !== null) {
      // ボリュームを調整
      workVideoPlayer.setVolume(props.settings.workVideoVolume);
    }
  }, [props.settings.workVideoVolume]);
  // 設定の休憩用動画の音量に変化があったとき
  useEffect(() => {
    // 休憩用動画が存在しているとき
    if (breakVideoPlayer !== null) {
      // ボリュームを調整
      breakVideoPlayer.setVolume(props.settings.breakVideoVolume);
    }
  }, [props.settings.breakVideoVolume]);

  // タイマーのオンオフが切り替わったとき
  useEffect(() => {
    // タイマーがオンの場合
    if (props.timerOn) {
      // タイマー開始時刻を代入
      startTime = Date.now();
      lastCountTime = startTime;
      // アクティビティを更新
      updateActivity(props.sessionType, false);
      // BGM用の動画を再生
      playVideo();
    }
    props.setTimeLeft((timeLeft) => {
      //残り時間をセット
      if (props.sessionType === "Work") {
        timeLeft = workLength;
        props.setTimeLeft((prev) => {
          return workLength;
        });
      } else if (props.sessionType === "Break") {
        timeLeft = breakLength;
        props.setTimeLeft((prev) => {
          return breakLength;
        });
      }
      return timeLeft;
    });
    // faviconを変更
    changeFavicon();

    // 一定時間ごとに残り時間を減らす
    timerCountTimeout = setTimeout(
      function timerCount() {
        timerCountTimeout = setTimeout(
          timerCount,
          // 次に実行するまでの時間を補正
          // 1秒 - (現在時刻(秒)の小数点以下 - 開始時刻(秒)の小数点以下)
          Date.now() % COUNT_INTERVAL > startTime % COUNT_INTERVAL
            ? COUNT_INTERVAL -
                ((Date.now() % COUNT_INTERVAL) - (startTime % COUNT_INTERVAL))
            : COUNT_INTERVAL -
                ((Date.now() % COUNT_INTERVAL) +
                  COUNT_INTERVAL -
                  (startTime % COUNT_INTERVAL))
        );
        // タイマーがオンの場合
        if (props.timerOn) {
          // 現在時刻を代入
          const dateNow = Date.now();
          props.setTimeLeft((timeLeft) => {
            // 前回のカウントから1.5秒以上経っていると一度にカウントする量が増える
            let count = 0;
            for (
              let i = 0;
              i <= dateNow - lastCountTime - COUNT_INTERVAL / 2;
              i += COUNT_INTERVAL
            ) {
              count++;
            }
            if (count > timeLeft * COUNTS_EVERY_SECOND) {
              count = timeLeft * COUNTS_EVERY_SECOND;
            }
            // 2連続で実行されるので遅延を入れた 2021/05/28
            clearTimeout(incTimeSpentTimeout);
            incTimeSpentTimeout = setTimeout(() => {
              incTimeSpent(count);
              incTodayTimeSpent(count);
            }, 1);
            return timeLeft - COUNTS_EVERY_SECOND * count;
          });

          // 設定によってチクタク音を再生
          if (props.settings.tick) {
            tickSound.pause();
            tickSound.play();
          }
          // タイマーがオフの場合はクリア
        } else if (!props.timerOn) {
          clearTimeout(timerCountTimeout);
        }
        // 最後にカウントした時刻を更新
        lastCountTime = Date.now();
        // 次に実行するまでの時間を補正
      },
      Date.now() % COUNT_INTERVAL > startTime % COUNT_INTERVAL
        ? COUNT_INTERVAL -
            ((Date.now() % COUNT_INTERVAL) - (startTime % COUNT_INTERVAL))
        : COUNT_INTERVAL -
            ((Date.now() % COUNT_INTERVAL) +
              COUNT_INTERVAL -
              (startTime % COUNT_INTERVAL))
    );

    return () => {
      // タイマーのカウントの実行予定をクリア
      clearTimeout(timerCountTimeout);
      // localStorage.setItem("todoList", JSON.stringify(props.todoList));
      props.setTimeLeft((timeLeft) => {
        // 残り時間をセット
        if (props.sessionType === "Work") {
          timeLeft = workLength;
          props.setTimeLeft(workLength);
        }
        if (props.sessionType === "Break") {
          timeLeft = breakLength;
          props.setTimeLeft(breakLength);
        }
        return timeLeft;
      });
      // faviconをCoPomoに変える
      changeFaviconTo("copomo");
      // 動画をストップ
      stopVideo();
      // 動画IDを更新
      updateVideoId();
    };
  }, [props.timerOn]);

  // 残り時間が変わったとき
  useEffect(() => {
    props.setTimeLeft((timeLeft) => {
      refreshTitle();
      // PIPタイマー
      document.getElementById("pipTimer").pause();
      document.getElementById("pipTimer").currentTime = 60.001 - timeLeft / 60;

      // 残り時間が0秒以下のとき
      if (props.timerOn && timeLeft <= 0) {
        // アクティビティを更新する
        updateActivity(props.sessionType, true);
        // タイマーオフ
        props.setTimerOn(false);
        // 効果音を再生
        endedSound.play();
        // 通知しつつセッションタイプを切り替える
        props.setSessionType((prevType) => {
          if (prevType === "Work") {
            // Overallのpomodoro_countを増やす
            OverallService.incPomodoroCount();
            new Notification("ポモドーロが終わりました！", {
              icon: "/favicon/favicon_coffee/apple-touch-icon.png",
            });
            return "Break";
          }
          if (prevType === "Break") {
            new Notification("休憩が終わりました！", {
              icon: "/favicon/favicon_tomato/apple-touch-icon.png",
            });
            return "Work";
          }
        });
        // 自動スタート設定の場合、自動スタートする
        if (props.settings.autoStart) {
          setTimeout(() => {
            props.setTimerOn(true);
          }, 10);
        }
      }
      return timeLeft;
    });
  }, [props.timeLeft]);

  // props.sessionTypeに変化があったとき
  useEffect(() => {
    props.setTimeLeft((timeLeft) => {
      if (props.timerOn) {
        updateActivity(props.sessionType === "Work" ? "Break" : "Work", true);
        props.setTimerOn(false);
      }
      if (props.sessionType === "Work") {
        props.setTimeLeft(workLength);
        timeLeft = workLength;
      }
      if (props.sessionType === "Break") {
        props.setTimeLeft(breakLength);
        timeLeft = breakLength;
      }
      return timeLeft;
    });
  }, [props.sessionType]);

  // workLengthに変化があったとき
  useEffect(() => {
    props.setTimeLeft((timeLeft) => {
      if (props.sessionType === "Work") {
        props.setTimeLeft(workLength);
        timeLeft = workLength;
      }
      return timeLeft;
    });
  }, [workLength]);

  // breakLengthに変化があったとき
  useEffect(() => {
    props.setTimeLeft((timeLeft) => {
      if (props.sessionType === "Break") {
        props.setTimeLeft(breakLength);
        timeLeft = breakLength;
      }
      return timeLeft;
    });
  }, [breakLength]);

  /**
   * 統計の今日の作業時間を更新します。
   */
  const incTodayTimeSpent = (count) => {
    if (props.sessionType === "Work") {
      props.setStatistics((prev) => {
        /** 現在時刻(1970年からのミリ秒) */
        const dateNow = Date.now();
        // 更新後の統計
        let updatedStatistics = {};
        // 日付が同じとき
        if (
          new Date(dateNow).toLocaleDateString() ===
          new Date(prev.updatedAt).toLocaleDateString()
        ) {
          updatedStatistics = {
            ...prev,
            todayTimeSpent: prev.todayTimeSpent + COUNTS_EVERY_SECOND * count,
            updatedAt: dateNow,
          };
          localStorage.setItem("statistics", JSON.stringify(updatedStatistics));
          return updatedStatistics;
          // 日付が変わっていたとき
        } else {
          updatedStatistics = {
            ...prev,
            previousDayTimeSpent: prev.todayTimeSpent,
            todayTimeSpent: COUNTS_EVERY_SECOND * count,
            updatedAt: dateNow,
          };
          localStorage.setItem("statistics", JSON.stringify(updatedStatistics));
          return updatedStatistics;
        }
      });
    }
  };

  /**
   * faviconを変更します。
   */
  const changeFavicon = () => {
    if (props.timerOn && props.sessionType === "Work") {
      changeFaviconTo("tomato");
    } else if (props.timerOn && props.sessionType === "Break") {
      changeFaviconTo("coffee");
    }
  };

  /**
   * ページのタイトルを更新します。
   */
  const refreshTitle = () => {
    let taskName = "";
    if (
      props.checkedIndex >= 0 &&
      props.todoList.length >= 1 &&
      props.checkedIndex <= props.todoList.length - 1
    ) {
      taskName = props.todoList[props.checkedIndex].text;
    }
    if (!props.timerOn) {
      document.title = props.DEFAULT_TITLE;
    } else if (props.timerOn && props.sessionType === "Work") {
      document.title =
        "(" +
        Duration.fromObject({ seconds: props.timeLeft }).toFormat("mm:ss") +
        ")" +
        (taskName !== "" ? taskName + " - " : "") +
        props.DEFAULT_TITLE;
    } else if (props.timerOn && props.sessionType === "Break") {
      document.title =
        "(" +
        Duration.fromObject({ seconds: props.timeLeft }).toFormat("mm:ss") +
        ")" +
        "休憩中 - " +
        props.DEFAULT_TITLE;
    }
  };

  /**
   * BGM用の動画を再生します。
   */
  const playVideo = () => {
    if (
      workVideoId !== "" &&
      props.sessionType === "Work" &&
      workVideoPlayer !== null
    ) {
      workVideoPlayer.setVolume(props.settings.workVideoVolume);
      workVideoPlayer.playVideo();
    }
    if (
      breakVideoId !== "" &&
      props.sessionType === "Break" &&
      breakVideoPlayer !== null
    ) {
      breakVideoPlayer.setVolume(props.settings.breakVideoVolume);
      breakVideoPlayer.playVideo();
    }
  };
  /**
   * BGM用の動画を終了します。
   */
  const stopVideo = () => {
    if (
      workVideoId !== "" &&
      props.sessionType === "Work" &&
      workVideoPlayer !== null
    ) {
      workVideoPlayer.stopVideo();
    }
    if (
      breakVideoId !== "" &&
      props.sessionType === "Break" &&
      breakVideoPlayer !== null
    ) {
      breakVideoPlayer.stopVideo();
    }
  };

  /**
   * timeSpentを増やす処理です。
   * @param {*} count カウント量(秒)
   */
  const incTimeSpent = (count) => {
    if (props.timerOn && props.sessionType === "Work") {
      const copyLocal = localStorage.getItem("todoList")
        ? JSON.parse(localStorage.getItem("todoList"))
        : [];
      let copyLocalSpent = [];
      copyLocal.forEach((e) => {
        if (e.checked === true) {
          e.timeSpent += COUNTS_EVERY_SECOND * count;
        }
        copyLocalSpent.push(e);
      });
      props.setTodoList(copyLocalSpent);
      localStorage.setItem("todoList", JSON.stringify(copyLocalSpent));
    }
  };

  /**
   * 動画IDを更新します。
   */
  const updateVideoId = () => {
    // 動画URLが変わっていたら動画IDを更新
    if (
      props.settings.workVideoUrl.split(/v=|\//).slice(-1)[0] !== workVideoId
    ) {
      setWorkVideoOnReady(false);
      workVideoPlayer = null;
      setWorkVideoId("");
      setTimeout(() => {
        setWorkVideoId(props.settings.workVideoUrl.split(/v=|\//).slice(-1)[0]);
      }, 10);
    }
    if (
      props.settings.breakVideoUrl.split(/v=|\//).slice(-1)[0] !== breakVideoId
    ) {
      setBreakVideoOnReady(false);
      breakVideoPlayer = null;
      setBreakVideoId("");
      setTimeout(() => {
        setBreakVideoId(
          props.settings.breakVideoUrl.split(/v=|\//).slice(-1)[0]
        );
      }, 10);
    }
  };

  /**
   * 動画プレーヤーが準備完了したときの処理です。
   */
  const onPlayerReady = (event) => {
    if (event.target.h.id === "workVideoPlayer") {
      workVideoPlayer = event.target;
      if (event.target.playerInfo.videoData.title !== "") {
        setWorkVideoOnReady(true);
      }
    }
    if (event.target.h.id === "breakVideoPlayer") {
      breakVideoPlayer = event.target;
      if (event.target.playerInfo.videoData.title !== "") {
        setBreakVideoOnReady(true);
      }
    }
  };

  // 動画プレーヤーの状態が変わったときの処理です。
  const onPlayerStateChange = (event) => {
    if (event.data === 1) {
      videoPlayDone = false;
    }
    // 動画が終わったとき
    if (event.data === 0 && !videoPlayDone) {
      if (event.target.h.id === "workVideoPlayer") {
        workVideoPlayer.setVolume(props.settings.workVideoVolume);
        workVideoPlayer.playVideo();
      }
      if (event.target.h.id === "breakVideoPlayer") {
        breakVideoPlayer.setVolume(props.settings.breakVideoVolume);
        breakVideoPlayer.playVideo();
      }
      videoPlayDone = true;
    }
  };

  /**
   * アクティビティを更新する処理です。
   */
  const updateActivity = (type, isDone) => {
    props.setTimeLeft((timeLeft) => {
      if (props.tokenId === "") return;
      let activity = {
        tokenId: props.tokenId,
        type: type,
        length:
          type === "Work"
            ? isDone
              ? workLength - timeLeft
              : workLength
            : isDone
            ? breakLength - timeLeft
            : breakLength,
        isDone: isDone,
      };
      UserService.updateActivity(activity)
        .then((response) => {
          // console.log("updateActivity: " + response.data);
        })
        .then(() => {
          UserService.findByTokenId(props.tokenId).then((res) => {
            props.setSeason0Exp(res.data.season0Exp);
          });
        });
      return timeLeft;
    });
  };

  /**
   * スタート・ストップボタンが押されたときの処理です。
   */
  const handleButtonClick = () => {
    // 離席中の場合
    if (props.sessionType === "AFK") {
      props.setSessionType("Work");
      setTimeout(() => {
        props.setTimerOn(!props.timerOn);
        if (props.timerOn) {
          stoppedSound.play();
        } else {
          startedSound.play();
        }
      }, 10);
    }
    // 離席中でない場合
    if (props.sessionType !== "AFK") {
      if (props.timerOn) {
        updateActivity(props.sessionType, true);
      }
      props.setTimerOn(!props.timerOn);
      if (props.timerOn) {
        stoppedSound.play();
      } else {
        startedSound.play();
      }
    }
  };

  /**
   * ピクチャーインピクチャーの動画が再生されたとき
   */
  const handlePipPlay = () => {
    document.getElementById("pipTimer").pause();
    handleButtonClick();
  };
  /**
   * ピクチャーインピクチャーのアイコンがクリックされたとき
   */
  const handlePipIconClick = () => {
    // 対応ブラウザの場合
    if (
      ["Chrome", "Microsoft Edge", "Opera", "Safari", "Safari on iOS"].includes(
        Platform.name
      )
    ) {
      document.getElementById("pipTimer").requestPictureInPicture();
    } else {
      if (document.getElementById("pipTimer").style.visibility === "hidden") {
        document.getElementById("pipTimer").style.visibility = "visible";
      } else if (
        document.getElementById("pipTimer").style.visibility === "visible"
      ) {
        document.getElementById("pipTimer").style.visibility = "hidden";
      }
    }
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.modeSelect}>
        {/* 作業時間選択ボタン */}
        <WorkSplitButton
          sessionType={props.sessionType}
          setSessionType={props.setSessionType}
          setWorkLength={setWorkLength}
        />
        {/* 休憩時間選択ボタン */}
        <BreakSplitButton
          sessionType={props.sessionType}
          setSessionType={props.setSessionType}
          setBreakLength={setBreakLength}
        />
      </div>
      {/* タイマー残り時間エリア */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* 位置調整用のダミー要素 */}
        <p style={{ visibility: "hidden" }}>
          <IconButton type="button">
            <PictureInPictureAltIcon />
          </IconButton>
        </p>
        {/* タイマー残り時間 */}
        <p className="font-sans tracking-widest text-6xl text-primary m-4">
          {Duration.fromObject({ seconds: props.timeLeft }).toFormat("mm:ss")}
        </p>
        <p style={{ alignSelf: "center" }}>
          <Tooltip title="ピクチャーインピクチャー">
            <IconButton type="button" onClick={handlePipIconClick}>
              <PictureInPictureAltIcon />
            </IconButton>
          </Tooltip>
          <video
            id="pipTimer"
            src="../video/pip_timer_160x60.mp4"
            style={{
              position: "absolute",
              zIndex: "2000",
              bottom: "0",
              right: "0",
              visibility: "hidden",
            }}
            onPlay={handlePipPlay}
          >
            動画が読み込まれていません
          </video>
        </p>
      </div>
      {/* スタート・ストップボタン */}
      <Button
        variant="contained"
        color={!props.timerOn ? "primary" : "secondary"}
        size="medium"
        startIcon={props.timerOn ? <StopIcon /> : <PlayArrowIcon />}
        onClick={handleButtonClick}
      >
        {props.timerOn ? "やめる" : "開始"}
      </Button>
      <Typography
        variant="h1"
        style={{
          position: "absolute",
          pointerEvents: "none",
          color: "tomato",
          zIndex: 9999,
        }}
      >
        {COUNTS_EVERY_SECOND !== 1 ? "⚠デバッグモード⚠" : ""}
      </Typography>
      {/* 作業用BGM動画 */}
      {(() => {
        if (workVideoId !== "") {
          return (
            <>
              <YouTube
                videoId={workVideoId}
                opts={playerOptions}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
                id="workVideoPlayer"
              />
              {workVideoOnReady ? "" : "作業用BGMが読み込まれていません"}
            </>
          );
        }
      })()}
      {/* 休憩用BGM動画 */}
      {(() => {
        if (breakVideoId !== "") {
          return (
            <>
              <YouTube
                videoId={breakVideoId}
                opts={playerOptions}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
                id="breakVideoPlayer"
              />
              {breakVideoOnReady ? "" : "休憩用BGMが読み込まれていません"}
            </>
          );
        }
      })()}
    </Paper>
  );
});

export default Timer;
