import http from "../http-common";

class OverallService {
  findAll() {
    return http.get("/overall/findall");
  }
  incPomodoroCount() {
    return http.post("/overall/incpomodorocount");
  }
}

export default new OverallService();
