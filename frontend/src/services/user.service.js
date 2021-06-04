import http from "../http-common";

/**
 * ユーザーに関するAPIのリクエストを送信します。
 */
class UserService {
  /**
   * トークンIDからユーザー情報を取得します。
   *
   * @param {string} tokenId トークンID
   * @returns HTTPレスポンス
   */
  findByTokenId(tokenId) {
    return http.post("/user/findbytokenid", tokenId);
  }

  /**
   * ユーザーの情報を更新します。
   *
   * @param {*} user ユーザーオブジェクト
   * @returns HTTPレスポンス
   */
  update(user) {
    return http.post("/user/update", user);
  }

  updateActivity(activity) {
    return http.post("/user/updateactivity", activity);
  }
}

export default new UserService();
