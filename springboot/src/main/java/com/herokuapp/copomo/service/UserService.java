package com.herokuapp.copomo.service;

import java.sql.Timestamp;

import com.herokuapp.copomo.mapper.UserMapper;
import com.herokuapp.copomo.model.Activity;
import com.herokuapp.copomo.model.User;

import org.springframework.stereotype.Service;

/**
 * ユーザーアカウントに関するサービスクラスです。
 */
@Service
public class UserService {

    private final UserMapper userMapper;

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * トークンIDからユーザー情報を取得します。
     * 
     * @param tokenId トークンID
     * @return ユーザー情報
     */
    public User findByTokenId(String tokenId) {
        return userMapper.findByTokenId(tokenId);
    }

    /**
     * ユーザーを作成します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean create(User user) {
        return userMapper.create(user);
    }

    /**
     * ユーザー情報を更新します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean update(User user) {
        return userMapper.update(user);
    }

    /**
     * トークンIDとアイコン画像のURLを更新します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean updateTokenAndImageUrl(User user) {
        return userMapper.updateTokenAndImageUrl(user);
    }

    /**
     * アクティビティを更新します。
     * 
     * @param activity アクティビティ
     * @return 成功した場合はtrue
     */
    public boolean updateActivity(Activity activity) {
        User user = new User();
        user.setTokenId(activity.getTokenId());
        // アクティビティ開始の場合
        if (!activity.getIsDone()) {
            // 現在のアクティビティにセット
            user.setCurrentActivity(activity.getType() + activity.getLength());
            // 現在のアクティビティの開始時刻として、現在時刻をセット
            user.setCurrentActivityStart(new Timestamp(System.currentTimeMillis()));
            // System.out.println(user.getCurrentActivity() +
            // user.getCurrentActivityStart());
        }
        // アクティビティ終了の場合
        if (activity.getIsDone()) {
            // 古いユーザー情報を取得
            // User userOld = userMapper.findByTokenId(activity.getTokenId());
            // 作業完了の場合
            if (activity.getType().equals("Work")) {
                activity.setExp(activity.getLength() / 10);
                userMapper.incSerson0Exp(activity);
                user.setLastActivity(activity.getType());
                user.setLastActivityEnd(new Timestamp(System.currentTimeMillis()));
            }
        }
        return userMapper.updateActivity(user);
    }

    /**
     * シーズン0の経験値を増やします。
     * 
     * @param activity アクティビティ
     * @return 成功した場合はtrue
     */
    public boolean incSerson0Exp(Activity activity) {
        return userMapper.incSerson0Exp(activity);
    }
}
