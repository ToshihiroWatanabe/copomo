package com.herokuapp.copomo.mapper;

import com.herokuapp.copomo.model.Activity;
import com.herokuapp.copomo.model.User;

import org.apache.ibatis.annotations.Mapper;

/**
 * usersテーブルに関するマッパーインターフェースです。
 */
@Mapper
public interface UserMapper {
    /**
     * トークンIDからユーザー情報を取得します。
     * 
     * @param tokenId トークンID
     * @return ユーザー情報
     */
    public User findByTokenId(String tokenId);

    /**
     * ユーザーを作成します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean create(User user);

    /**
     * ユーザー情報を更新します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean update(User user);

    /**
     * トークンIDとアイコン画像のURLを更新します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean updateTokenAndImageUrl(User user);

    /**
     * アクティビティを更新します。
     * 
     * @param activity アクティビティ
     * @return 成功した場合はtrue
     */
    public boolean updateActivity(User user);

    /**
     * シーズン0の経験値を増やします。
     * 
     * @param activity アクティビティ
     * @return 成功した場合はtrue
     */
    public boolean incSerson0Exp(Activity activity);
}
