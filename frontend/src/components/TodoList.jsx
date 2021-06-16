import React, { useEffect, useState, Fragment, memo } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core";
// 日付時刻を扱う
import { Duration } from "luxon";
import TaskMenu from "./TaskMenu";

const NUMBER_OF_TASK_MAX = 32;

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2),
    marginTop: theme.spacing(1.5),
    marginRight: theme.spacing(1.5),
    padding: theme.spacing(3),
    maxWidth: "768px",
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(1),
      padding: theme.spacing(2),
    },
    [theme.breakpoints.up("sm")]: {
      maxHeight: "50vh",
      overflow: "auto",
    },
  },
  "@keyframes slideUpAppear": {
    from: { transform: "translate(0, 50%)", opacity: 0 },
    to: { transform: "translate(0, 0)", opacity: 1 },
  },
  slideUpAppearEffect: {
    animationName: "$slideUpAppear",
    animationDuration: ".2s",
  },
  "@keyframes slideDownDisappear": {
    from: { opacity: 1 },
    to: { transform: "translate(0, 50%)", opacity: 0 },
  },
  slideDownDisappearEffect: {
    animationName: "$slideDownDisappear",
    animationDuration: ".2s",
  },
  "@keyframes slideUp": {
    from: { transform: "translate(0, 50%)" },
    to: { transform: "translate(0, 0)" },
  },
  slideUpEffect: {
    animationName: "$slideUp",
    animationDuration: ".2s",
  },
  "@keyframes slideDown": {
    from: { transform: "translate(0, -50%)" },
    to: { transform: "translate(0, 0%)" },
  },
  slideDownEffect: {
    animationName: "$slideDown",
    animationDuration: ".2s",
  },
}));

/**
 * Todoリストの関数コンポーネントです。
 */
const TodoList = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
  let inRef = null;
  // 入れ替えアニメーション
  const [swapAnim, setSwapAnim] = useState([]);
  // 削除するタスクのID
  const [deleteIndex, setDeleteIndex] = useState(-1);
  // 経過時間をリセットするタスクのID
  const [resetTimeIndex, setResetTimeIndex] = useState(-1);

  // deleteIndexに変化があったとき
  useEffect(() => {
    if (deleteIndex !== -1) {
      deleteRequestItem(deleteIndex);
      setDeleteIndex(-1);
    }
  }, [deleteIndex]);

  // resetTimeIndexに変化があったとき
  useEffect(() => {
    if (resetTimeIndex !== -1) {
      resetSpentTime(resetTimeIndex);
      setResetTimeIndex(-1);
    }
  }, [resetTimeIndex]);

  // swapAnimに変化があったとき
  useEffect(() => {
    if (swapAnim.length !== 0) {
      // console.info(swapAnim);
      setTimeout(() => {
        setSwapAnim([]);
      }, 200);
    }
  }, [swapAnim]);

  // チェックを切り替える
  const toggleItem = (value) => () => {
    props.setTodoList((todoList) => {
      for (let t of todoList) {
        t.checked = false;
      }
      const copy = [...todoList];
      copy.forEach((e) => {
        if (e.id === value) {
          if (e.id === value) e.checked = !e.checked;
          props.setCheckedIndex(copy.indexOf(e));
        }
      });
      return copy;
    });
  };

  // 経過時間をリセット
  const resetSpentTime = (id) => {
    props.setTodoList((todoList) => {
      const copy = [...todoList];
      copy.forEach((e) => {
        if (e.id === id) {
          e.timeSpent = 0;
        }
      });
      return copy;
    });
  };

  // 要求されたタスクを削除
  const deleteRequestItem = (value) => {
    props.setTodoList((todoList) => {
      const copy = [...todoList];
      let removeItem = undefined;
      copy.forEach((e) => {
        if (e.id === value) {
          e.appearAnim = true;
          removeItem = e;
        }
      });
      setTimeout((value) => {
        deleteItem(removeItem);
      }, 200);
      return copy;
    });
  };

  // タスク削除
  const deleteItem = (value) => {
    props.setTodoList((todoList) => {
      let newTodoList = todoList.filter((element, index) => {
        return index !== value.id;
      });
      // タスクIDを再設定
      for (let i = 0; i < newTodoList.length; i++) {
        newTodoList[i].id = i;
      }
      // チェック位置を変更
      props.setCheckedIndex((checkedIndex) => {
        if (value.checked === true) {
          return -1;
        }
        if (checkedIndex >= value.id) {
          return checkedIndex--;
        }
      });
      return newTodoList;
    });
  };

  // タスク追加
  const addItem = () => {
    if (inRef.value.trim() === "") return;
    props.setTodoList((todoList) => {
      let item = {
        id: todoList.length,
        text: inRef.value,
        checked: false,
        timeSpent: 0,
        appearAnim: false,
      };
      if (todoList.length === 0) {
        item.checked = true;
        props.setCheckedIndex(0);
      }
      inRef.value = "";
      return [...todoList, item];
    });
  };

  // Enterキーでタスク追加
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addItem();
    }
  };

  return (
    <>
      <Paper className={classes.paper}>
        <List>
          {props.todoList.map((todo) => {
            return (
              <Fragment key={todo.id}>
                <ListItem
                  i={todo.id}
                  button
                  onClick={toggleItem(todo.id)}
                  className={
                    (swapAnim[0] === todo.id ? classes.slideUpEffect : "") +
                    " " +
                    (swapAnim[1] === todo.id ? classes.slideDownEffect : "")
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      disableRipple
                      edge="start"
                      checked={todo.checked}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={todo.text}
                    secondary={Duration.fromObject({
                      seconds: todo.timeSpent,
                    }).toFormat("hh:mm:ss")}
                  />

                  <ListItemSecondaryAction>
                    <TaskMenu
                      id={todo.id}
                      text={todo.text}
                      todoList={props.todoList}
                      setTodoList={props.setTodoList}
                      checkedIndex={props.checkedIndex}
                      setCheckedIndex={props.setCheckedIndex}
                      setResetTimeIndex={setResetTimeIndex}
                      setDeleteIndex={setDeleteIndex}
                      swapAnim={swapAnim}
                      setSwapAnim={setSwapAnim}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </Fragment>
            );
          })}
          {(() => {
            if (props.todoList.length < NUMBER_OF_TASK_MAX) {
              return (
                <>
                  <ListItem key={"input"} button disableRipple>
                    <TextField
                      fullWidth={true}
                      label="タスクを追加"
                      inputRef={(ref) => (inRef = ref)}
                      onKeyPress={handleKeyPress}
                      inputProps={{ maxLength: 45 }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={addItem}
                        aria-label="タスク追加"
                      >
                        <AddIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </>
              );
            } else {
              return (
                <>
                  <Typography variant="caption">
                    タスク数の上限に達しました
                  </Typography>
                </>
              );
            }
          })()}
        </List>
      </Paper>
    </>
  );
});

export default TodoList;
