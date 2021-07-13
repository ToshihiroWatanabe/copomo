package com.herokuapp.copomo.model;

import lombok.Getter;
import lombok.Setter;

/**
 * アクティビティのモデルクラスです。
 */
@Getter
@Setter
public class Activity {
    /** トークンID */
    private String tokenId;
    /** 種類 */
    private String type;
    /** 長さ */
    private int length;
    /** 終わったかどうか */
    private Boolean isDone;
    /** 経験値 */
    private int exp;
}
