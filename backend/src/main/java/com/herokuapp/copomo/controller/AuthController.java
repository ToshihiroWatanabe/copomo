package com.herokuapp.copomo.controller;

import com.herokuapp.copomo.model.User;
import com.herokuapp.copomo.service.UserService;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestOperations;

/**
 * 認証リクエストを受けとり、結果を返すコントローラーです。
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RestOperations restOperations;
    private final UserService userService;

    public AuthController(RestTemplateBuilder restTemplateBuilder, UserService userService) {
        this.restOperations = restTemplateBuilder.build();
        this.userService = userService;
    }

    /**
     * ログイン処理です。
     * 
     * @param user ユーザーデータ
     */
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        /**
         * TODO: 例外処理
         */
        User responseUser = restOperations.getForObject(
                "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + user.getTokenId(), User.class);
        // クライアントから送られてきたメールアドレスとGoogleから送られてきたメールアドレスが同じであればOK
        if (user.getEmail().equals(responseUser.getEmail())) {
            try {
                boolean createResult = userService.create(user);
                System.out.println(String.valueOf(createResult) + ": " + user.getEmail());
                return String.valueOf(createResult);
            } catch (DuplicateKeyException e) {
                userService.updateTokenAndImageUrl(user);
                // System.out.println("既に登録されています: " + user.getEmail());
                return "既に登録されています";
            }
        } else {
            return "不正なリクエストです";
        }
    }
}
