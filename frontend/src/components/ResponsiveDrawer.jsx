import React, { useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
  AppBar,
  Tooltip,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  SwipeableDrawer,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import SettingsIcon from "@material-ui/icons/Settings";
import { Duration } from "luxon";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";
import SimpleSnackbar from "./SimpleSnackbar";
import AccountPopover from "./AccountPopover";

/** ドロワーの横幅 */
const drawerWidth = 240;

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.up("md")]: {
      //   width: `calc(100% - ${drawerWidth}px)`,
      width: `calc(100%)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  // コンテンツがアプリバー以下であるために必須
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  flexGrow: { flexGrow: 1 },
  spHidden: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));

/**
 * 通知追加アイコンをクリックしたときの処理です。
 */
const handleAddAlertIconClick = () => {
  Notification.requestPermission();
  const options = {
    body: "タイマーを使っていただき、ありがとうございます！",
  };
  new Notification("通知はオンです", options);
};

/**
 * ドロワーの関数コンポーネントです。
 */
const ResponsiveDrawer = memo((props) => {
  const { window } = props;
  /** Material-UIのスタイル */
  const classes = useStyles();
  /** Material-UIのテーマ */
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [todoListIsBlankTooltipOpen, setTodoListIsBlankTooltipOpen] =
    useState(false);

  /**
   * クリップボードにコピーするボタンが押されたときの処理です。
   */
  const handleAssignmentReturnedIconClick = () => {
    // Todoリストが空のとき
    if (
      localStorage.getItem("todoList") === "[]" ||
      localStorage.getItem("todoList") === null
    ) {
      setTodoListIsBlankTooltipOpen(true);
      setTimeout(() => {
        setTodoListIsBlankTooltipOpen(false);
      }, 3000);
      return;
    }
    let text = "";
    let totalTime = 0;
    for (let i of JSON.parse(localStorage.getItem("todoList"))) {
      text += i.text + "\r\n";
      text +=
        Duration.fromObject({ seconds: i.timeSpent }).toFormat("h時間m分s秒") +
        "\r\n";
      totalTime += i.timeSpent;
    }
    text +=
      "\r\n" +
      "計: " +
      Duration.fromObject({ seconds: totalTime }).toFormat("h時間m分s秒");
    text = text.replaceAll("分0秒", "分");
    text = text.replaceAll("時間0分", "時間");
    text = text.replaceAll("\r\n0時間", "\r\n");
    text = text.replaceAll(" 0時間", " ");
    // 一時的に要素を追加
    let textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    textArea.id = "copyArea";
    document.getElementById("root").appendChild(textArea);
    textArea.select(document.getElementById("copyArea"));
    document.execCommand("Copy");
    document.getElementById("copyArea").remove();
    // 「コピーしました！」メッセージ
    setSnackbarOpen(true);
  };

  // リストの項目が押されたときの処理です。
  const handleListItemClick = (index) => {
    setMobileOpen(false);
  };

  /**
   * ヘッダーのタイトルがクリックされたときの処理です。
   */
  const handleCoPomoClick = () => {
    // props.setView("Home");
    // ページトップへ移動
    // window.scrollTo(0, 0);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {["ホーム", "設定", "CoPomoについて"].map((text, index) => (
          <Link
            key={text}
            to={
              text === "ホーム" ? "/" : text === "設定" ? "/settings" : "/about"
            }
          >
            <ListItem
              button
              key={text}
              onClick={() => handleListItemClick(index)}
              data-num={index.toString()}
            >
              <ListItemIcon>
                {/* ホーム */}
                {index === 0 ? <HomeIcon /> : ""}
                {index === 1 ? <SettingsIcon /> : ""}
                {index === 2 ? <InfoIcon /> : ""}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={handleCoPomoClick}
            noWrap
          >
            {useLocation().pathname === "/settings" ? "設定" : ""}
            {useLocation().pathname === "/about" ? "CoPomoについて" : ""}
            {useLocation().pathname === "/" ? "CoPomo" : ""}
          </Typography>
          <span className={classes.flexGrow}></span>
          {/* クリップボードにコピーするボタン */}
          <div
            className={
              useLocation().pathname === "/about" ? classes.spHidden : ""
            }
          >
            <Tooltip
              title={
                todoListIsBlankTooltipOpen
                  ? "記録がありません！"
                  : "タスクをクリップボードにコピー"
              }
              interactive
            >
              <IconButton
                color="inherit"
                onClick={handleAssignmentReturnedIconClick}
              >
                <AssignmentReturnedIcon />
              </IconButton>
            </Tooltip>
            <SimpleSnackbar
              open={snackbarOpen}
              setOpen={setSnackbarOpen}
              message="タスクをコピーしました！"
            />
          </div>
          <div
            className={
              useLocation().pathname === "/about" ? classes.spHidden : ""
            }
          >
            <Tooltip title="タイマー通知をオン" interactive>
              <IconButton color="inherit" onClick={handleAddAlertIconClick}>
                <AddAlertIcon />
              </IconButton>
            </Tooltip>
          </div>
          {/* アカウントメニュー */}
          <AccountPopover
            isEntered={props.isEntered}
            setIsEntered={props.setIsEntered}
            isLogined={props.isLogined}
            setIsLogined={props.setIsLogined}
            name={props.name}
            setName={props.setName}
            userId={props.userId}
            setUserId={props.setUserId}
            imageUrl={props.imageUrl}
            setImageUrl={props.setImageUrl}
            settings={props.settings}
            tokenId={props.tokenId}
            setTokenId={props.setTokenId}
            season0Exp={props.season0Exp}
            setSeason0Exp={props.setSeason0Exp}
            statistics={props.statistics}
          />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp implementation="css">
          <SwipeableDrawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            onOpen={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
});

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
