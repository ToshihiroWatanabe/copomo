package com.herokuapp.copomo.controller;

import com.herokuapp.copomo.model.Activity;
import com.herokuapp.copomo.model.User;
import com.herokuapp.copomo.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * ユーザーアカウントに関するリクエストを受け取り、結果を返すコントローラーです。
 */
@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * トークンIDからユーザー情報を取得します。
     * 
     * @param tokenId トークンID
     * @return ユーザー情報
     */
    @PostMapping("/findbytokenid")
    public User findByTokenId(@RequestBody String tokenId) {
        return userService.findByTokenId(tokenId);
    }

    /**
     * ユーザー情報を更新します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    @PostMapping("/update")
    public boolean update(@RequestBody User user) {
        return userService.update(user);
    }

    /**
     * アクティビティを更新します。
     * 
     * @param activity アクティビティ
     * @return 成功した場合はtrue
     */
    @PostMapping("/updateactivity")
    public boolean updateActivity(@RequestBody Activity activity) {
        return userService.updateActivity(activity);
    }
}
