import React, { useState, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Popover, IconButton, Typography } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  root: { display: "flex", justifyContent: "flex-end" },
  typography: {
    padding: theme.spacing(2),
  },
}));

/**
 * ポップオーバーの関数コンポーネントです。
 */
const SimplePopover = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMouseOver = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className={classes.root}>
      <IconButton onClick={handleClick} aria-label="ヘルプ">
        <HelpIcon onMouseOver={handleMouseOver} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography className={classes.typography}>{props.message}</Typography>
      </Popover>
    </div>
  );
});

export default SimplePopover;
