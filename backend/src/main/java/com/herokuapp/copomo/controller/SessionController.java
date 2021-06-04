package com.herokuapp.copomo.controller;

import java.io.UncheckedIOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.herokuapp.copomo.model.Session;
import com.herokuapp.copomo.service.SessionService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * セッションに関するリクエストを受け取り、結果を返すコントローラーです。
 */
@RestController
@RequestMapping("/api/session")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    /**
     * セッションの数を取得します。
     * 
     * @return JSON形式の文字列
     */
    @GetMapping("/count")
    public String getCount() {
        Map<String, Integer> map = new HashMap<>();
        map.put("count", sessionService.count());
        String json = toJson(map);
        return json;
    }

    /**
     * セッションを全件取得します。
     * 
     * @return セッションのリスト
     */
    @GetMapping("/findall")
    public List<Session> findAll() {
        return sessionService.findAll();
    }

    /**
     * オブジェクトをJSONに変換します。
     * 
     * @param obj オブジェクト
     * @return JSON形式の文字列
     */
    public String toJson(Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new UncheckedIOException(e);
        }
    }

    /**
     * セッションを作成します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    @PostMapping("/create")
    public boolean create(@RequestBody Session session) {
        boolean isCreated = sessionService.create(session);
        sessionService.deleteOld();
        return isCreated;
    }

    /**
     * セッションを更新します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    @PostMapping("/update")
    public boolean update(@RequestBody Session session) {
        return sessionService.update(session);
    }

    /**
     * セッションを削除します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    @PostMapping("/delete")
    public boolean delete(@RequestBody Session session) {
        return sessionService.delete(session);
    }
}
