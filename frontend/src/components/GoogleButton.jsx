import React, { useState, memo } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import SimpleSnackbar from "./SimpleSnackbar";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

/**
 * クライアントID
 */
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

/**
 * Googleでログイン/ログアウトするボタンの関数コンポーネントです。
 */
const GoogleButton = memo((props) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMassage] = useState("");

  /**
   * ログインに成功したときの処理です。
   * @param {*} response
   */
  const login = (response) => {
    props.setName((name) => {
      props.setEmail((email) => {
        // console.info(response);
        if (response.tokenId) {
          // バックエンドサーバーに送信
          let authData = {
            tokenId: response.tokenId,
            email: response.profileObj.email,
            name: response.profileObj.name,
            imageUrl: response.profileObj.imageUrl,
          };
          AuthService.login(authData)
            .then((res) => {
              // console.log(res);
              // トークンIDが正しかったらtrueが返ってくる
              if (res.data === "true" || res.data === true) {
                // console.log("新規登録");
                props.setIsEntered(false);
                props.setTokenId(response.tokenId);
                props.setEmail(response.profileObj.email);
                email = response.profileObj.email;
                props.setName(response.profileObj.name);
                name = response.profileObj.name;
                props.setImageUrl(response.profileObj.imageUrl);
                props.setIsLogined(true);
                if (!props.settings.ableImageUrl) {
                  disableImageUrl();
                }
                UserService.findByTokenId(response.tokenId).then((res) => {
                  props.setUserId(res.data.id);
                  props.setSeason0Exp(res.data.season0Exp);
                });
              } else if (res.data === "既に登録されています") {
                // 登録されているデータを取得
                UserService.findByTokenId(response.tokenId).then((res) => {
                  // console.log(res);
                  props.setUserId(res.data.id);
                  props.setIsEntered(false);
                  props.setTokenId(response.tokenId);
                  props.setEmail(response.profileObj.email);
                  email = response.profileObj.email;
                  props.setName(res.data.name);
                  name = res.data.name;
                  props.setImageUrl(response.profileObj.imageUrl);
                  props.setSeason0Exp(res.data.season0Exp);
                  props.setIsLogined(true);
                  if (!props.settings.ableImageUrl) {
                    disableImageUrl();
                  }
                });
              }
            })
            .catch((e) => {
              // ログイン失敗
              handleLoginFailure(e);
            });
        }
        return email;
      });
      return name;
    });
  };

  /**
   * アイコン画像を無効にします。
   */
  const disableImageUrl = () => {
    props.setName((name) => {
      props.setEmail((email) => {
        // console.info(nonStateEmail + nonStateName);
        UserService.update({
          email: email,
          name: name,
          imageUrl: null,
        });
        return email;
      });
      return name;
    });
  };

  /**
   * ログアウトに成功したときの処理です。
   * @param {*} response
   */
  const logout = (response) => {
    // console.info(response);
    props.setIsLogined(false);
    props.setIsEntered(false);
    props.setUserId(null);
    props.setTokenId(null);
    props.setEmail("");
    props.setName("");
    props.setImageUrl("");
    props.setSeason0Exp(null);
  };

  /**
   * ログインに失敗したときの処理です。
   * @param {*} response
   */
  const handleLoginFailure = (response) => {
    // console.info(response);
    setSnackbarMassage("ログインに失敗しました");
    setSnackbarOpen(true);
  };

  /**
   * ログアウトに失敗したときの処理です。
   * @param {*} response
   */
  const handleLogoutFailure = (response) => {
    // console.info(response);
    setSnackbarMassage("ログアウトに失敗しました");
    setSnackbarOpen(true);
  };

  return (
    <div>
      {props.isLogined ? (
        <GoogleLogout
          clientId={CLIENT_ID}
          buttonText="ログアウト"
          onLogoutSuccess={logout}
          onFailure={handleLogoutFailure}
        ></GoogleLogout>
      ) : (
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="ログイン"
          onSuccess={login}
          onFailure={handleLoginFailure}
          cookiePolicy={"single_host_origin"}
          responseType="code,token"
        />
      )}
      <SimpleSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={snackbarMessage}
      />
    </div>
  );
});

export default GoogleButton;
