import React, { useEffect, useState, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  Tooltip,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import PersonIcon from "@material-ui/icons/Person";
import SessionService from "../services/session.service";
import EventSeatIcon from "@material-ui/icons/EventSeat";
import UserList from "./UserList";
import HelpPopover from "./SimplePopover";
import OverallService from "../services/overall.service";
import HappyTomato from "./HappyTomato";

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2),
    marginLeft: theme.spacing(1.5),
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    maxWidth: "768px",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(1),
      padding: theme.spacing(2),
    },
  },
  paperScroll: {
    [theme.breakpoints.up("sm")]: {
      maxHeight: "85vh",
      overflow: "auto",
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  inputNameField: {
    margin: theme.spacing(0.1),
    width: "20rem",
    maxWidth: "90%",
  },
  enterButton: {
    height: "2.5rem",
    margin: theme.spacing(0.1),
  },
  helpPopper: {},
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeInEffect: {
    animationName: "$fadeIn",
    animationDuration: ".5s",
  },
  todayPomodoroCount: {
    display: "inline-block",
  },
}));

const defaultSessions = [
  {
    id: "aaaabbbb",
    userName: "読込中...",
    sessionType: "",
    taskName: "",
    remaining: 0,
    timerOn: false,
    updatedAt: "2021-05-06T00:45:25.275+00:00",
  },
];

/** ヘルプポップオーバーのメッセージ */
const helpMessage =
  "入室すると今のタイマーの状況を他のユーザーと共有できます。";

/** 自分のセッションID */
let myId = "";
let findAllInterval = null;
let updateInterval = null;
/** 入室時刻 */
let enteredTime = null;
/** 入室フラグ */
let enterFlag = false;

// ???
const todayPomodoroCountInterval = 100;
let todayPomodoroCountThreshold = -todayPomodoroCountInterval;

/**
 * 接続中のユーザーを表示する部分の関数コンポーネントです。
 */
const ChatContainer = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
  let inRef = null;
  // セッション
  const [sessions, setSessions] = useState(defaultSessions);
  // 累計ポモドーロ数
  const [pomodoroCount, setPomodoroCount] = useState(null);
  // 本日のポモドーロ数
  const [todayPomodoroCount, setTodayPomodoroCount] = useState(null);
  // ???
  const [showHappyTomato, setShowHappyTomato] = useState(false);

  // 最初だけ実行
  useEffect(() => {
    if (props.name !== "") {
      enterTheRoom();
    }
  }, []);

  // props.isEnteredに変化があったとき
  useEffect(() => {
    if (props.isEntered) {
      enterFlag = true;
    }
    if (!props.isEntered && enterFlag) {
      enterFlag = false;
      exitTheRoom();
    }
  }, [props.isEntered]);

  // props.timerOnに変化があったとき
  useEffect(() => {
    if (props.isEntered) {
      update();
      setTimeout(() => {
        findAll();
      }, 1000);
    }
  }, [props.timerOn]);

  // props.checkedIndexに変化があったとき
  useEffect(() => {
    props.setCheckedIndex((checkedIndex) => {
      props.setTimerOn((timerOn) => {
        checkedIndex = props.checkedIndex;
        if (props.isEntered && timerOn) {
          update();
          setTimeout(() => {
            findAll();
          }, 1000);
        }
        return timerOn;
      });
      return checkedIndex;
    });
  }, [props.checkedIndex]);

  /**
   * 入室ボタンが押された時の処理です。
   */
  const handleEnterButtonClick = (event) => {
    event.preventDefault();
    // ログインしていたとき
    if (props.isLogined) {
      inRef = { value: props.name };
    }
    if (!inRef.value.trim()) return;
    enterTheRoom();
  };

  /**
   * 退室ボタンが押された時の処理です。
   */
  const handleExitButtonClick = () => {
    props.setIsEntered(false);
  };

  // 名前入力Enterで入室
  const handleKeyPress = (event) => {
    if (!inRef.value.trim()) return;
    if (event.key === "Enter") {
      enterTheRoom();
    }
  };

  /**
   * 入室する処理です。
   */
  const enterTheRoom = () => {
    props.setCheckedIndex((checkedIndex) => {
      props.setTodoList((todoList) => {
        props.setTimerOn((timerOn) => {
          props.setTimeLeft((timeLeft) => {
            props.setSessionType((sessionType) => {
              props.setIsEntered(true);
              if (inRef !== null && inRef.value.trim() !== "") {
                props.setName(inRef.value.trim());
              }
              enteredTime = new Date();
              const session = {
                userId: props.userId,
                userName: props.name !== "" ? props.name : inRef.value.trim(),
                sessionType: sessionType,
                taskName:
                  todoList.length > 0 &&
                  checkedIndex >= 0 &&
                  todoList.length > checkedIndex
                    ? todoList[checkedIndex].text
                    : "",
                remaining: timeLeft,
                timerOn: timerOn,
                createdAt: enteredTime,
                updatedAt: enteredTime,
              };
              SessionService.create(session)
                .then((response) => {
                  setTimeout(() => {
                    findAll();
                  }, 1000);
                })
                .catch((e) => {
                  console.error(e);
                });
              updateInterval = setInterval(() => {
                update();
              }, 1000 * 10);
              setTimeout(() => {
                findAllInterval = setInterval(() => {
                  findAll();
                }, 1000 * 10);
              }, 1000);
              return sessionType;
            });
            return timeLeft;
          });
          return timerOn;
        });
        return todoList;
      });
      return checkedIndex;
    });
  };

  /**
   * 退室する処理です。
   */
  const exitTheRoom = () => {
    deleteMe();
    if (!props.isLogined) {
      props.setName("");
    }
    myId = "";
    setSessions(defaultSessions);
    clearInterval(updateInterval);
    clearInterval(findAllInterval);
    setPomodoroCount(null);
    setTodayPomodoroCount(null);
    todayPomodoroCountThreshold = -todayPomodoroCountInterval;
  };

  /**
   * 離席ボタンが押された時の処理です。
   */
  const handleAfkButtonClick = () => {
    awayFromKeyBoard();
  };

  /**
   * 離席する処理です。
   */
  const awayFromKeyBoard = () => {
    props.setSessionType((sessionType) => {
      if (sessionType !== "AFK") {
        sessionType = "AFK";
        props.setSessionType(sessionType);
      } else if (sessionType === "AFK") {
        sessionType = "Work";
        props.setSessionType(sessionType);
      }
      update();
      setTimeout(() => {
        findAll();
      }, 1000);
      return sessionType;
    });
  };

  /**
   * データベースから情報を取得します。
   */
  const findAll = () => {
    // sessionsテーブルから全件取得
    SessionService.findAll()
      .then((response) => {
        // 最終更新が一定以内のものだけをセット
        const now = new Date().getTime();
        let copy = [];
        for (let i = 0; i < response.data.length; i++) {
          if (
            now - new Date(response.data[i].updatedAt).getTime() <=
            1000 * 30
          ) {
            copy.push(response.data[i]);
          }
        }
        setSessions(copy);
        if (myId === "") {
          findMyId(response.data);
        }
      })
      .catch((e) => {
        console.error(e);
      });
    // overallテーブルから取得
    OverallService.findAll().then((response) => {
      // console.log("pomodoroCount: " + response.data.pomodoroCount);
      setPomodoroCount(response.data.pomodoroCount);
      setTodayPomodoroCount(response.data.todayPomodoroCount);
      // ???判定
      // ブラウザのタブがアクティブの場合
      if (window.document.hasFocus()) {
        // カウントが閾値以上のとき
        if (response.data.todayPomodoroCount >= todayPomodoroCountThreshold) {
          // カウントが大きすぎるとき、閾値を増やす
          if (
            response.data.todayPomodoroCount >
            todayPomodoroCountThreshold + todayPomodoroCountInterval
          ) {
            for (
              let i = 0;
              todayPomodoroCountThreshold <= response.data.todayPomodoroCount;
              i++
            ) {
              todayPomodoroCountThreshold = todayPomodoroCountInterval * i;
            }
            // カウントが大きすぎなければ???を発生させる
          } else if (
            response.data.todayPomodoroCount <=
              todayPomodoroCountThreshold + todayPomodoroCountInterval &&
            response.data.todayPomodoroCount >= todayPomodoroCountInterval
          ) {
            todayPomodoroCountThreshold += todayPomodoroCountInterval;
            setShowHappyTomato(true);
          }
        }
        // カウントが小さすぎるとき、閾値を減らす
        if (
          response.data.todayPomodoroCount <
          todayPomodoroCountThreshold - todayPomodoroCountInterval
        ) {
          for (
            let i = todayPomodoroCountThreshold / todayPomodoroCountInterval;
            todayPomodoroCountThreshold >
            response.data.todayPomodoroCount + todayPomodoroCountInterval;
            i--
          ) {
            todayPomodoroCountThreshold = todayPomodoroCountInterval * i;
          }
        }
      }
    });
  };

  /**
   * 自分のセッションのIDを取得します。
   */
  const findMyId = (sessions) => {
    props.setName((name) => {
      for (let s of sessions) {
        // 最終更新と名前が一致したらIDにする
        if (
          new Date(s.updatedAt).getTime() === enteredTime.getTime() &&
          s.userName === name
        ) {
          myId = s.id;
          // console.info("セッションID: " + myId + " 入室時刻: " + enteredTime);
          break;
        }
      }
      return name;
    });
  };

  /**
   * ユーザー削除
   */
  const deleteMe = () => {
    let session = {
      id: myId,
      createdAt: enteredTime,
    };
    SessionService.delete(session)
      .then((response) => {})
      .catch((e) => {
        console.error(e);
      });
  };

  /**
   * セッションのユーザーの情報を更新します。
   */
  const update = () => {
    props.setCheckedIndex((checkedIndex) => {
      props.setTodoList((todoList) => {
        props.setTimerOn((timerOn) => {
          props.setTimeLeft((timeLeft) => {
            props.setSessionType((sessionType) => {
              props.setName((name) => {
                let session = {
                  id: myId,
                  userName: name,
                  sessionType: sessionType,
                  taskName:
                    todoList.length > 0 &&
                    props.checkedIndex >= 0 &&
                    todoList.length > props.checkedIndex
                      ? todoList[checkedIndex].text
                      : "",
                  remaining: timeLeft,
                  timerOn: timerOn,
                  createdAt: enteredTime,
                  updatedAt: new Date(),
                };
                SessionService.update(session)
                  .then((response) => {})
                  .catch((e) => {
                    console.error(e);
                  });
                return name;
              });
              return sessionType;
            });
            return timeLeft;
          });
          return timerOn;
        });
        return todoList;
      });
      return checkedIndex;
    });
  };

  return (
    <>
      <Paper
        className={
          classes.paper + " " + (props.isEntered ? classes.paperScroll : "")
        }
      >
        {(() => {
          if (!props.isEntered && !props.isLogined) {
            return (
              <>
                <form>
                  <TextField
                    id="outlined-required"
                    name="outlined-required"
                    label="名前を入力してください"
                    defaultValue=""
                    inputRef={(ref) => (inRef = ref)}
                    variant="outlined"
                    className={classes.inputNameField}
                    size="small"
                    onKeyPress={handleKeyPress}
                    inputProps={{ maxLength: 20 }}
                    autoComplete="on"
                  />
                  <Button
                    type="submit"
                    variant="outlined"
                    className={classes.enterButton}
                    onClick={handleEnterButtonClick}
                  >
                    <PersonPinIcon />
                    入室
                  </Button>
                  <HelpPopover message={helpMessage} />
                </form>
              </>
            );
          } else if (!props.isEntered && props.isLogined) {
            return (
              <>
                <form>
                  <Button
                    type="submit"
                    variant="outlined"
                    className={classes.enterButton}
                    onClick={handleEnterButtonClick}
                  >
                    <Avatar
                      alt={props.name}
                      src={props.settings.ableImageUrl ? props.imageUrl : ""}
                      size="small"
                      className={classes.small}
                    ></Avatar>
                    <Box fontWeight="fontWeightBold">{props.name}</Box>
                    として入室
                  </Button>
                  <HelpPopover message={helpMessage} />
                </form>
              </>
            );
          } else if (props.isEntered) {
            return (
              <>
                <div className={classes.fadeInEffect}>
                  <p>
                    ようこそ　
                    {props.name}さん
                  </p>
                  <PersonIcon />
                  <span style={{ marginRight: "1rem" }}>
                    {sessions.length + "人"}
                  </span>
                  <Button
                    variant="outlined"
                    className={classes.exitButton}
                    onClick={handleAfkButtonClick}
                    disabled={props.timerOn}
                  >
                    <EventSeatIcon />
                    {props.sessionType === "AFK" ? "離席解除" : "離席"}
                  </Button>
                  <Button
                    variant="outlined"
                    className={classes.exitButton}
                    onClick={handleExitButtonClick}
                  >
                    <ExitToAppIcon />
                    退室
                  </Button>
                  <br />
                  <Tooltip
                    title={`本日の目標: ${todayPomodoroCountInterval}ポモドーロ`}
                    interactive
                  >
                    {/* カウントが増えると文字サイズがだんだん大きくなる */}
                    <Typography
                      className={classes.todayPomodoroCount}
                      style={
                        todayPomodoroCount >= 100
                          ? { fontSize: "40px" }
                          : {
                              fontSize: `calc(14px + ${
                                todayPomodoroCount / 5
                              }px)`,
                            }
                      }
                    >
                      {todayPomodoroCount === null
                        ? " "
                        : "本日の累計ポモドーロ数: " + todayPomodoroCount}
                    </Typography>
                  </Tooltip>
                  <UserList sessions={sessions} />
                </div>
              </>
            );
          }
        })()}
      </Paper>
      <HappyTomato
        showHappyTomato={showHappyTomato}
        setShowHappyTomato={setShowHappyTomato}
        todayPomodoroCountThreshold={todayPomodoroCountThreshold}
        todayPomodoroCountInterval={todayPomodoroCountInterval}
      />
    </>
  );
});

export default ChatContainer;
