package com.herokuapp.copomo.model;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

/**
 * ユーザーアカウントのモデルクラスです。
 */
@Getter
@Setter
public class User {
    /** ユーザーID */
    private int id;
    /** トークンID */
    private String tokenId;
    /** メールアドレス */
    private String email;
    /** 名前 */
    private String name;
    /** アイコン画像のURL */
    private String imageUrl;
    /** 最後のアクティビティ */
    private String lastActivity;
    /** 最後のアクティビティが終わった時刻 */
    private Timestamp lastActivityEnd;
    /** 現在のアクティビティ */
    private String currentActivity;
    /** 現在のアクティビティが始まった時刻 */
    private Timestamp currentActivityStart;
    /** シーズン0の経験値 */
    private Long season0Exp;
}
