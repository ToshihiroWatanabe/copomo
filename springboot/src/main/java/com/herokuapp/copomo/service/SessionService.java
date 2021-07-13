package com.herokuapp.copomo.service;

import java.util.List;

import com.herokuapp.copomo.mapper.SessionMapper;
import com.herokuapp.copomo.model.Session;

import org.springframework.stereotype.Service;

/**
 * セッションに関するサービスクラスです。
 */
@Service
public class SessionService {

    private final SessionMapper sessionMapper;

    public SessionService(SessionMapper sessionMapper) {
        this.sessionMapper = sessionMapper;
    }

    /**
     * セッションの数を取得します。
     * 
     * @return セッションの数
     */
    public int count() {
        return sessionMapper.count();
    }

    /**
     * セッションを全件取得します。
     * 
     * @return セッションのリスト
     */
    public List<Session> findAll() {
        return sessionMapper.findAll();
    }

    /**
     * セッションIDからユーザーの名前を取得します。
     * 
     * @param id セッションID
     * @return ユーザーの名前
     */
    public String findUserNameBySessionId(int id) {
        return sessionMapper.findUserNameBySessionId(id);
    }

    /**
     * セッションを作成します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    public boolean create(Session session) {
        return sessionMapper.create(session);
    }

    /**
     * セッションを更新します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    public boolean update(Session session) {
        return sessionMapper.update(session);
    }

    /**
     * セッションを削除します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    public boolean delete(Session session) {
        return sessionMapper.delete(session);
    }

    /**
     * 古いセッションを削除します。
     * 
     * @return 成功した場合はtrue
     */
    public boolean deleteOld() {
        return sessionMapper.deleteOld();
    }
}
