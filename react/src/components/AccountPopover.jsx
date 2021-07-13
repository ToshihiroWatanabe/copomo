import React, { useState, useEffect, memo } from "react";
import {
  ListItemText,
  makeStyles,
  Popover,
  IconButton,
  Avatar,
  Typography,
  Tooltip,
  Box,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import GoogleButton from "./GoogleButton";
import "./AccountPopover.css";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import FormDialog from "./FormDialog";
import UserService from "../services/user.service";
// 日付時刻を扱う
import { Duration } from "luxon";

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  profile: {
    display: "flex",
    marginBottom: theme.spacing(1),
  },
  avatar: {
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  name: {
    marginTop: theme.spacing(-0.2),
  },
}));

/**
 * アカウントアイコンメニューの関数コンポーネントです。
 */
const AccountPopover = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // メールアドレスが隠されているかどうか
  const [showEmail, setShowEmail] = useState(false);
  // 名前変更ダイアログが開いているかどうか
  const [nameEditDialogIsOpen, setNameEditDialogIsOpen] = useState(false);
  // メールアドレス
  const [email, setEmail] = useState("");
  // 一部を隠したメールアドレス
  const [maskedEmail, setMaskedEmail] = useState("");

  // メールアドレスに変化があったとき
  useEffect(() => {
    setMaskedEmail(maskEmail(email));
  }, [email]);

  // 設定のアイコン画像のオンオフが変わったとき
  useEffect(() => {
    if (props.settings.ableImageUrl) {
      UserService.update({
        email: email,
        name: props.name,
        imageUrl: props.imageUrl,
      }).then((result) => {
        // console.log(result);
      });
    } else if (!props.settings.ableImageUrl) {
      UserService.update({
        email: email,
        name: props.name,
        imageUrl: null,
      }).then((result) => {
        // console.log(result);
      });
    }
  }, [props.settings.ableImageUrl]);

  /**
   * メールアドレスを一部隠します。
   *
   * @param {string} email
   * @returns マスク加工されたメールアドレス
   */
  const maskEmail = (email) => {
    let emailSplit = email.split("@");
    emailSplit[0] = emailSplit[0].replace(
      emailSplit[0].substring(1, emailSplit[0].length),
      "***"
    );
    return emailSplit[0] + "@" + emailSplit[1];
  };

  /**
   * アカウントアイコンがクリックされたときの処理です。
   * @param {*} event
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * メールアドレスの表示を切り替えます。
   */
  const toggleShowEmail = () => {
    setShowEmail(!showEmail);
  };

  /**
   * 名前変更アイコンがクリックされたときの処理です。
   */
  const handleNameEditIconClick = () => {
    setNameEditDialogIsOpen(true);
  };

  return (
    <>
      <Tooltip title="アカウント" interactive>
        <IconButton
          onClick={handleClick}
          color={props.isLogined ? "inherit" : "default"}
        >
          {!props.isLogined && <AccountCircleIcon />}
          {props.isLogined && (
            <Avatar
              src={props.settings.ableImageUrl ? props.imageUrl : ""}
              className={classes.small}
            />
          )}
        </IconButton>
      </Tooltip>
      <Popover
        disableScrollLock={true}
        id="accountPopover"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        getContentAnchorEl={null}
      >
        <Tooltip
          title={
            "前日の作業時間: " +
            Duration.fromObject({
              seconds: props.statistics.previousDayTimeSpent,
            })
              .toFormat(" h時間m分s秒")
              .replaceAll("時間0分", "時間")
              .replaceAll("分0秒", "分")
              .replaceAll(" 0時間", "")
              .trim()
          }
        >
          <Typography>
            {new Date(props.statistics.updatedAt).toLocaleDateString()}
            の作業時間:{" "}
            {Duration.fromObject({
              seconds: props.statistics.todayTimeSpent,
            })
              .toFormat(" h時間m分s秒")
              .replaceAll("時間0分", "時間")
              .replaceAll("分0秒", "分")
              .replaceAll(" 0時間", "")
              .trim()}
          </Typography>
        </Tooltip>
        {props.isLogined ? (
          ""
        ) : (
          <>
            <ListItemText>ログインしていません</ListItemText>
          </>
        )}
        {props.isLogined && (
          <>
            <span className={classes.profile}>
              <Avatar
                className={classes.avatar}
                alt={props.name}
                src={props.settings.ableImageUrl ? props.imageUrl : ""}
              />
              <span className={classes.name}>
                <Typography variant="subtitle2">
                  {props.name}
                  <Tooltip title="名前を変更" interactive>
                    <IconButton onClick={handleNameEditIconClick}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </span>
            </span>
            {/* 経験値表示 */}
            {props.season0Exp !== null && (
              <>
                <p>経験値: {props.season0Exp}</p>
              </>
            )}
            {/* メールアドレス表示 */}
            <Typography variant="caption">
              {!showEmail && (
                <>
                  {maskedEmail}
                  <Tooltip title="メールを表示" interactive>
                    <VisibilityOffIcon
                      onClick={toggleShowEmail}
                      fontSize="small"
                    />
                  </Tooltip>
                </>
              )}
              {showEmail && (
                <>
                  {email}
                  <Tooltip title="メールを非表示" interactive>
                    <VisibilityIcon
                      onClick={toggleShowEmail}
                      fontSize="small"
                    />
                  </Tooltip>
                </>
              )}
            </Typography>
          </>
        )}
        <Box m={2}></Box>
        {/* Googleログイン/ログアウトボタン */}
        <GoogleButton
          isLogined={props.isLogined}
          setIsLogined={props.setIsLogined}
          setTokenId={props.setTokenId}
          email={email}
          setEmail={setEmail}
          setImageUrl={props.setImageUrl}
          isEntered={props.isEntered}
          setIsEntered={props.setIsEntered}
          name={props.name}
          setName={props.setName}
          userId={props.userId}
          setUserId={props.setUserId}
          settings={props.settings}
          season0Exp={props.season0Exp}
          setSeason0Exp={props.setSeason0Exp}
        />
        {/* <MenuItem onClick={handleClose}>閉じる</MenuItem> */}
        {/* <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
      </Popover>
      <FormDialog
        open={nameEditDialogIsOpen}
        setOpen={setNameEditDialogIsOpen}
        defaultValue={props.name}
        name={props.name}
        setName={props.setName}
        formDialogTitle="名前を変更"
        label="名前"
        email={email}
        imageUrl={props.imageUrl}
      />
    </>
  );
});

export default AccountPopover;
