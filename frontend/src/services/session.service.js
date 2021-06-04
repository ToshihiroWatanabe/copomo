import http from "../http-common";

/**
 * セッションに関するAPIのリクエストを送信します。
 */
class SessionService {
  findAll() {
    return http.get("/session/findall");
  }

  create(session) {
    return http.post("/session/create", session);
  }

  delete(session) {
    return http.post("/session/delete", session);
  }

  update(session) {
    return http.post("/session/update", session);
  }
}

export default new SessionService();
