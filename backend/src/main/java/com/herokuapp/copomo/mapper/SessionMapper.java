package com.herokuapp.copomo.mapper;

import java.util.List;

import com.herokuapp.copomo.model.Session;

import org.apache.ibatis.annotations.Mapper;

/**
 * sessionsテーブルに関するマッパーインターフェースです。
 */
@Mapper
public interface SessionMapper {
    /**
     * セッションの数を取得します。
     * 
     * @return セッションの数
     */
    public int count();

    /**
     * セッションを全件取得します。
     * 
     * @return セッションのリスト
     */
    public List<Session> findAll();

    /**
     * セッションIDからユーザーの名前を取得します。
     * 
     * @param id セッションID
     * @return ユーザーの名前
     */
    public String findUserNameBySessionId(int id);

    /**
     * セッションを作成します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    public boolean create(Session session);

    /**
     * セッションを更新します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    public boolean update(Session session);

    /**
     * セッションを削除します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    public boolean delete(Session session);

    /**
     * 古いセッションを削除します。
     * 
     * @return 成功した場合はtrue
     */
    public boolean deleteOld();
}
