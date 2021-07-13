import React, { Fragment, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@material-ui/core";

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

const colors = [
  "#f44336", // red[500]
  "#e91e63", // pink[500]
  "#9c27b0", // purple[500]
  "#673ab7", // deepPurple[500]
  "#3f51b5", // indigo[500]
  "#2196f3", // blue[500]
  "#03a9f4", // lightBlue[500]
  "#00bcd4", // cyan[500]
  "#009688", // teal[500]
  "#4caf50", // green[500]
  "#8bc34a", // lightGreen[500]
  "#cddc39", // lime[500]
  // "#ffeb3b", // yellow[500] // 黄色は見づらい
  "#ffc107", // amber[500]
  "#ff9800", // orange[500]
  "#ff5722", // deepOrange[500]
  "#795548", // brown[500]
];

const grayColor = "#9e9e9e";

/**
 * アバターの背景色を決定します。
 *
 * @param {string} name ユーザー名
 * @returns カラーコード
 */
const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = 31 * hash + name.charCodeAt(i);
  }
  let index = Math.abs(hash % colors.length);
  if (name === "読込中...") return grayColor;
  return colors[index];
};

/**
 * ユーザーリストの関数コンポーネントです。
 */
const UserList = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {/* セッションの数だけ繰り返す */}
      {props.sessions.map((key, index) => {
        return (
          <Fragment key={key.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  style={{ backgroundColor: getAvatarColor(key.userName) }}
                  src={key.imageUrl}
                >
                  {key.userName.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={key.userName}
                secondary={
                  <Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {key.sessionType === "Work" && key.timerOn
                        ? "🍅" + key.taskName
                        : ""}
                      {key.sessionType === "Break" && key.timerOn
                        ? "☕休憩中"
                        : ""}
                      {key.sessionType === "AFK" && !key.timerOn
                        ? "🪑離席中"
                        : ""}
                    </Typography>
                    {key.remaining !== 0 && key.timerOn
                      ? " — 残り" + parseInt(key.remaining / 60 + 0.999) + "分"
                      : ""}
                  </Fragment>
                }
              />
            </ListItem>
            {(() => {
              {
                /* 最後の行以外 */
              }
              if (index !== props.sessions.length - 1) {
                return (
                  <>
                    <Divider variant="inset" component="li" />
                  </>
                );
              }
            })()}
          </Fragment>
        );
      })}
    </List>
  );
});

export default UserList;
