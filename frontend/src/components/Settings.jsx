import React, { useState, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  FormHelperText,
  Divider,
  TextField,
  Typography,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import YouTube from "react-youtube";
import SimpleSelect from "./VolumeSelect";

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(64),
      maxWidth: "90%",
      height: "auto",
    },
    zIndex: "2",
  },
  paper: {
    padding: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  allDeleteButton: {
    margin: theme.spacing(3),
  },
  urlField: {
    width: "100%",
  },
  musicVideoIcon: {
    marginBottom: theme.spacing(0.5),
  },
}));

/**
 * YouTube動画再生オプション
 */
const playerOptions = {
  height: "1",
  width: "1",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
  },
};

/**
 * 設定画面の関数コンポーネントです。
 */
const Settings = memo((props) => {
  /** Material-UIのスタイル */
  const classes = useStyles();

  const [workVideoTitle, setWorkVideoTitle] = useState("");
  const [breakVideoTitle, setBreakVideoTitle] = useState("");
  const [renderWorkVideo, setRenderWorkVideo] = useState(true);
  const [renderBreakVideo, setRenderBreakVideo] = useState(true);

  /**
   * 設定に変化があったときの処理です。
   * @param {} event
   */
  const handleChange = (event) => {
    props.setSettings((settings) => {
      if (event.target.name === "workVideoUrl") {
        setWorkVideoTitle("");
        setRenderWorkVideo(false);
        setTimeout(() => {
          setRenderWorkVideo(true);
        }, 10);
      }
      if (event.target.name === "breakVideoUrl") {
        setBreakVideoTitle("");
        setRenderBreakVideo(false);
        setTimeout(() => {
          setRenderBreakVideo(true);
        }, 10);
      }
      settings = {
        ...props.settings,
        [event.target.name]: event.target.name.match(/.*VideoUrl/)
          ? event.target.value
          : event.target.checked,
      };
      localStorage.setItem("settings", JSON.stringify(settings));
      return settings;
    });
  };

  /**
   * ローカルストレージに保存されているデータを全て削除してリロードします。
   */
  const handleAllDeleteClick = () => {
    localStorage.clear();
    window.location.reload();
  };

  /**
   * Todoリストを全て削除してリロードします。
   */
  const handleTodoListDeleteClick = () => {
    localStorage.removeItem("todoList");
    localStorage.removeItem("checkedIndex");
    window.location.reload();
  };

  /**
   * 動画プレーヤーが準備完了したときの処理です。
   */
  const onPlayerReady = (event) => {
    if (event.target.h.id === "workVideoPlayer") {
      setWorkVideoTitle(event.target.playerInfo.videoData.title);
    }
    if (event.target.h.id === "breakVideoPlayer") {
      setBreakVideoTitle(event.target.playerInfo.videoData.title);
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel>
            <MusicVideoIcon className={classes.musicVideoIcon} />
            🍅作業用BGM
          </FormLabel>
          <FormGroup>
            <TextField
              className={classes.urlField}
              label="YouTube動画のURL"
              onChange={handleChange}
              name="workVideoUrl"
              value={props.settings.workVideoUrl}
              onFocus={(event) => {
                event.target.select();
              }}
            ></TextField>
            {(() => {
              if (props.settings.workVideoUrl !== "" && renderWorkVideo) {
                return (
                  <>
                    <br />
                    <Typography>
                      {workVideoTitle !== "" ? workVideoTitle : ""}
                    </Typography>
                    <YouTube
                      videoId={
                        props.settings.workVideoUrl.split(/v=|\//).slice(-1)[0]
                      }
                      opts={playerOptions}
                      onReady={onPlayerReady}
                      id="workVideoPlayer"
                    />
                  </>
                );
              } else {
                return (
                  <>
                    <br />
                  </>
                );
              }
            })()}
            <SimpleSelect
              helperText="音量(作業用BGM)"
              settings={props.settings}
              setSettings={props.setSettings}
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel>
            <MusicVideoIcon className={classes.musicVideoIcon} />
            ☕休憩用BGM
          </FormLabel>
          <FormGroup>
            <TextField
              className={classes.urlField}
              label="YouTube動画のURL"
              onChange={handleChange}
              name="breakVideoUrl"
              value={props.settings.breakVideoUrl}
              onFocus={(event) => {
                event.target.select();
              }}
            ></TextField>
            {(() => {
              if (props.settings.breakVideoUrl !== "" && renderBreakVideo) {
                return (
                  <>
                    <br />
                    <Typography>
                      {breakVideoTitle !== "" ? breakVideoTitle : ""}
                    </Typography>
                    <YouTube
                      videoId={
                        props.settings.breakVideoUrl.split(/v=|\//).slice(-1)[0]
                      }
                      opts={playerOptions}
                      onReady={onPlayerReady}
                      id="breakVideoPlayer"
                    />
                  </>
                );
              } else {
                return (
                  <>
                    <br />
                  </>
                );
              }
            })()}
            <SimpleSelect
              helperText="音量(休憩用BGM)"
              settings={props.settings}
              setSettings={props.setSettings}
            />
          </FormGroup>
        </FormControl>

        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">タイマー作動中の効果音</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={props.settings.tick}
                  onChange={handleChange}
                  name="tick"
                />
              }
              label="かすかなチクタク音"
            />
            <FormHelperText>
              一部の設定はタイマーを停止させないと反映されません。
            </FormHelperText>
          </FormGroup>
        </FormControl>

        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>
            <FormLabel component="legend">タイマー終了時</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={props.settings.autoStart}
                  onChange={handleChange}
                  name="autoStart"
                />
              }
              label="次のタイマーを自動スタート"
            />
          </FormGroup>
        </FormControl>

        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>
            <FormLabel component="legend">プライバシー</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={props.settings.ableImageUrl}
                  onChange={handleChange}
                  name="ableImageUrl"
                />
              }
              label="Googleアカウントのアイコン画像を使う"
            />
          </FormGroup>
        </FormControl>
        <Divider />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleTodoListDeleteClick}
          className={classes.allDeleteButton}
        >
          <WarningIcon />
          Todoリストのタスクを全て消去
        </Button>
        <Divider />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAllDeleteClick}
          className={classes.allDeleteButton}
        >
          <WarningIcon />
          ローカルデータを全て消去
        </Button>
      </Paper>
    </div>
  );
});

export default Settings;
