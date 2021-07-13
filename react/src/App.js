import React, { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
// コンポーネント
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import Timer from "./components/Timer";
import TodoList from "./components/TodoList";
import ChatContainer from "./components/ChatContainer";
import Settings from "./components/Settings";
import About from "./components/About";
// スタイル
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";

/** ローカルストレージからTodoリストを取得します。 */
const localStorageGetItemTodoList = localStorage.getItem("todoList")
  ? JSON.parse(localStorage.getItem("todoList"))
  : [];

/** ローカルストレージからタスクの選択位置を取得します。 */
const localStorageGetItemCheckedIndex = localStorage.getItem("checkedIndex")
  ? parseInt(localStorage.getItem("checkedIndex")) <=
    localStorageGetItemTodoList.length - 1
    ? parseInt(localStorage.getItem("checkedIndex"))
    : -1
  : -1;

/** ローカルストレージから設定を取得します。 */
const localStorageGetItemSettings = localStorage.getItem("settings")
  ? JSON.parse(localStorage.getItem("settings"))
  : {};

/** ローカルストレージから統計を取得します。 */
const localStorageGetItemStatistics = localStorage.getItem("statistics")
  ? JSON.parse(localStorage.getItem("statistics"))
  : {};

/** デフォルト設定 */
const defaultSettings = {
  tick: true,
  autoStart: false,
  workVideoUrl: "",
  workVideoVolume: 100,
  breakVideoUrl: "",
  breakVideoVolume: 100,
  ableImageUrl: true,
};

/** デフォルト統計 */
const defaultStatistics = {
  todayPomodoroCount: 0,
  todayTimeSpent: 0,
  previousDayPomodoroCount: 0,
  previousDayTimeSpent: 0,
  updatedAt: Date.now(),
};

/** デフォルトタイトル */
const DEFAULT_TITLE =
  process.env.NODE_ENV === "development" && !document.title.match(/.*🤖.*/)
    ? document.title + "🤖"
    : document.title;

/** ドロワーの横幅 */
const drawerWidth = 240;

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  main: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
}));

/**
 * アプリケーションの関数コンポーネントです。
 */
const App = () => {
  const classes = useStyles();
  // Todoリスト
  const [todoList, setTodoList] = useState(localStorageGetItemTodoList);
  // タスクの選択位置
  const [checkedIndex, setCheckedIndex] = useState(
    localStorageGetItemCheckedIndex
  );
  // 設定 デフォルトとローカルストレージを結合
  const [settings, setSettings] = useState({
    ...defaultSettings,
    ...localStorageGetItemSettings,
  });
  // 統計 デフォルトとローカルストレージを結合
  const [statistics, setStatistics] = useState({
    ...defaultStatistics,
    ...localStorageGetItemStatistics,
  });

  // タイマーが動いているかどうか
  const [timerOn, setTimerOn] = useState(false);
  // セッションタイプ(Work, Break)
  const [sessionType, setSessionType] = useState("Work");
  // 残り時間
  const [timeLeft, setTimeLeft] = useState(0);
  // 入室しているかどうか
  const [isEntered, setIsEntered] = useState(false);
  // ログインしているかどうか
  const [isLogined, setIsLogined] = useState(false);
  // 自分の名前
  const [name, setName] = useState("");
  // 自分のユーザーID
  const [userId, setUserId] = useState(null);
  // アイコン画像URL
  const [imageUrl, setImageUrl] = useState("");
  // 自分のトークンID
  const [tokenId, setTokenId] = useState("");
  // シーズン0の経験値
  const [season0Exp, setSeason0Exp] = useState(null);

  // todoListに変化があったとき
  useEffect(() => {
    // ローカルストレージに保存
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  // checkedIndexに変化があったとき
  useEffect(() => {
    // ローカルストレージに保存
    localStorage.setItem("checkedIndex", checkedIndex);
  }, [checkedIndex]);

  return (
    <div className="App">
      {/* ヘッダー&ナビゲーションドロワー */}
      <ResponsiveDrawer
        todoList={todoList}
        isEntered={isEntered}
        setIsEntered={setIsEntered}
        name={name}
        setName={setName}
        isLogined={isLogined}
        setIsLogined={setIsLogined}
        userId={userId}
        setUserId={setUserId}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        settings={settings}
        tokenId={tokenId}
        setTokenId={setTokenId}
        season0Exp={season0Exp}
        setSeason0Exp={setSeason0Exp}
        statistics={statistics}
      />
      <main className={classes.main}>
        {/* 左カラム */}
        <div
          className="leftColumn"
          style={{ display: useLocation().pathname !== "/" ? "none" : "" }}
        >
          {/* タイマー */}
          <Timer
            todoList={todoList}
            setTodoList={setTodoList}
            checkedIndex={checkedIndex}
            timerOn={timerOn}
            setTimerOn={setTimerOn}
            sessionType={sessionType}
            setSessionType={setSessionType}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            settings={settings}
            tokenId={tokenId}
            setSeason0Exp={setSeason0Exp}
            statistics={statistics}
            setStatistics={setStatistics}
            DEFAULT_TITLE={DEFAULT_TITLE}
          />
          {/* Todoリスト */}
          <TodoList
            todoList={todoList}
            setTodoList={setTodoList}
            checkedIndex={checkedIndex}
            setCheckedIndex={setCheckedIndex}
            timerOn={timerOn}
            timeLeft={timeLeft}
          />
        </div>
        {/* 右カラム */}
        <div
          className="rightColumn"
          style={{ display: useLocation().pathname !== "/" ? "none" : "" }}
        >
          {/* ユーザーリスト部分 */}
          <ChatContainer
            todoList={todoList}
            setTodoList={setTodoList}
            checkedIndex={checkedIndex}
            setCheckedIndex={setCheckedIndex}
            timerOn={timerOn}
            setTimerOn={setTimerOn}
            sessionType={sessionType}
            setSessionType={setSessionType}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            isEntered={isEntered}
            setIsEntered={setIsEntered}
            isLogined={isLogined}
            setIsLogined={setIsLogined}
            name={name}
            setName={setName}
            userId={userId}
            imageUrl={imageUrl}
            settings={settings}
            DEFAULT_TITLE={DEFAULT_TITLE}
          />
        </div>
        {/* 画面切り替え */}
        <Switch>
          <Route exact path="/settings">
            <Settings settings={settings} setSettings={setSettings} />
          </Route>
          <Route exact path="/about" component={About}>
            <About />
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default App;
