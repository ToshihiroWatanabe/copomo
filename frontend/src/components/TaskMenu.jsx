import React, { useState, useEffect, memo } from "react";
import { makeStyles } from "@material-ui/core";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import EditIcon from "@material-ui/icons/Edit";
import EditDialog from "./FormDialog";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

/** Material-UIのスタイル */
const useStyles = makeStyles({
  deleteItem: {
    color: "red",
  },
  hidden: {
    display: "none",
  },
});

/**
 * タスクメニューの関数コンポーネントです。
 */
const TaskMenu = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    // タスク名を編集でEnterを押した時にメニューが開かないようにする
    if (!editOpen) {
      setTimeout(() => {
        setAnchorEl(false);
      }, 50);
    }
  }, [editOpen]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 編集をクリック
  const handleEditName = () => {
    setEditOpen(true);
    setAnchorEl(null);
  };

  // 上に移動
  const handleUpward = () => {
    if (props.id !== 0) {
      const copy = [...props.todoList];
      copy.splice(props.id - 1, 2, copy[props.id], copy[props.id - 1]);
      copy.forEach((e, index) => {
        e.id = index;
        if (e.checked) {
          props.setCheckedIndex(index);
        }
      });
      props.setTodoList(copy);
    }
    props.setSwapAnim([props.id - 1, props.id]);
    setAnchorEl(null);
  };
  // 下に移動
  const handleDownward = () => {
    if (props.id !== props.todoList.length - 1) {
      const copy = [...props.todoList];
      copy.splice(props.id, 2, copy[props.id + 1], copy[props.id]);
      copy.forEach((e, index) => {
        e.id = index;
        if (e.checked) {
          props.setCheckedIndex(index);
        }
      });
      props.setTodoList(copy);
    }
    props.setSwapAnim([props.id, props.id + 1]);
    setAnchorEl(null);
  };

  // 削除をクリック
  const handleDelete = () => {
    props.setDeleteIndex(props.id);
    setAnchorEl(null);
  };

  // リセットをクリック
  const handleResetTime = () => {
    props.setResetTimeIndex(props.id);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        edge={"end"}
        onClick={handleClick}
        aria-label="タスクメニュー切替"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEditName}>
          <EditIcon />
          タスク名を編集
        </MenuItem>

        <MenuItem
          onClick={handleUpward}
          className={props.id === 0 ? classes.hidden : ""}
        >
          <ArrowUpwardIcon />
          上に移動
        </MenuItem>

        <MenuItem
          onClick={handleDownward}
          className={
            props.id === props.todoList.length - 1 ? classes.hidden : ""
          }
        >
          <ArrowDownwardIcon />
          下に移動
        </MenuItem>
        <MenuItem onClick={handleResetTime}>
          <RotateLeftIcon />
          時間をリセット
        </MenuItem>
        <MenuItem className={classes.deleteItem} onClick={handleDelete}>
          <DeleteIcon />
          削除
        </MenuItem>
      </Menu>
      <EditDialog
        open={editOpen}
        setOpen={setEditOpen}
        id={props.id}
        defaultValue={props.text}
        todoList={props.todoList}
        setTodoList={props.setTodoList}
        formDialogTitle="タスク名を編集"
        label="タスク名"
      />
    </>
  );
});

export default TaskMenu;
