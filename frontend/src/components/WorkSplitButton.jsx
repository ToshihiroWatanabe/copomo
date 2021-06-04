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
  const classes = useStylesBootstrap();
  return <Tooltip arrow classes={classes} {...props} />;
};

// 選択肢
const options = ["🍅25分", "💻60分"];

/**
 * 作業時間を選択するボタンの関数コンポーネントです。
 */
const WorkSplitButton = memo((props) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  /**
   * クリックされたときの処理です。
   */
  const handleClick = () => {
    props.setSessionType("Work");
  };

  /**
   * 選択肢がクリックされたときの処理です。
   */
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    if (index === 0) {
      props.setWorkLength(25 * 60);
    } else if (index === 1) {
      props.setWorkLength(60 * 60);
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
          color={props.sessionType === "Work" ? "primary" : "default"}
          ref={anchorRef}
        >
          <BootstrapTooltip
            title="作業時間"
            placement="top"
            open={tooltipOpen}
            interactive
          >
            <Button onClick={handleClick}>{options[selectedIndex]}</Button>
          </BootstrapTooltip>
          <Button
            color={props.sessionType === "Work" ? "primary" : "default"}
            size="small"
            onClick={handleToggle}
            aria-label="作業時間切替"
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

export default WorkSplitButton;
