import React, { useState, useRef, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Tooltip,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

// 選択肢
const options = ["5分", "10分", "15分", "20分"];

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  freeBreakfastIcon: {
    marginRight: "4px",
  },
  emojiShadow: {
    textShadow: "0px 0px 1px #000",
  },
}));

/** Material-UIのスタイル */
const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontSize: "16px",
  },
}));

/**
 * Bootstrap風のツールチップを描画します。
 *
 * @param {*} props
 * @returns ツールチップ要素
 */
const BootstrapTooltip = (props) => {
  /** Material-UIのスタイル */
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
};

/**
 * 休憩時間を選択するボタンの関数コンポーネントです。
 */
const BreakSplitButton = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  /**
   * クリックされたときの処理です。
   */
  const handleClick = () => {
    props.setSessionType("Break");
  };

  /**
   * 選択肢がクリックされたときの処理です。
   */
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    switch (index) {
      case 0:
        props.setBreakLength(5 * 60);
        break;
      case 1:
        props.setBreakLength(10 * 60);
        break;
      case 2:
        props.setBreakLength(15 * 60);
        break;
      case 3:
        props.setBreakLength(20 * 60);
        break;
      default:
    }
    setOpen(false);
    setTooltipOpen(false);
  };

  /**
   * メニューを開閉します。
   */
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    setTooltipOpen(!tooltipOpen);
  };

  /**
   * メニューを閉じます。
   * @param {} event イベント
   */
  const handleClose = (event) => {
    // メニュー内なら何もしない
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    // 他の場所をクリックしたとき
    setOpen(false);
    setTooltipOpen(false);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup
          variant="contained"
          color={props.sessionType === "Break" ? "primary" : "default"}
          ref={anchorRef}
        >
          <BootstrapTooltip
            title="休憩時間"
            placement="top"
            interactive
            open={tooltipOpen}
          >
            <Button onClick={handleClick}>
              <span className={classes.emojiShadow}>☕</span>
              {options[selectedIndex]}
            </Button>
          </BootstrapTooltip>
          <Button
            color={props.sessionType === "Break" ? "primary" : "default"}
            size="small"
            onClick={handleToggle}
            aria-label="休憩時間切替"
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          // disablePortal // z軸
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        // disabled={index === 2}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        <span className={classes.emojiShadow}>☕</span>
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
});

export default BreakSplitButton;
