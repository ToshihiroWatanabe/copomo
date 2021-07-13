package com.herokuapp.copomo.model;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

/**
 * セッションのモデルクラスです。
 */
@Getter
@Setter
public class Session {
    /** ID */
    private int id;
    /** ユーザーID */
    private int userId;
    /** ユーザーの名前 */
    private String userName;
    /** タスクの名前 */
    private String taskName;
    /** セッションの種類 */
    private String sessionType;
    /** 残り時間 */
    private int remaining;
    /** タイマーがオンかどうか */
    private boolean timerOn;
    /** 作成日時 */
    private Timestamp createdAt;
    /** 更新日時 */
    private Timestamp updatedAt;
    /** アイコン画像のURL */
    private String imageUrl;
}
