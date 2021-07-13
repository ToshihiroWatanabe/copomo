package com.herokuapp.copomo.model;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;

/**
 * 全体の統計データのモデルクラスです。
 */
@Getter
@Setter
public class Overall {
    /** 累計ポモドーロ数 */
    private Long pomodoroCount;
    /** 累計作業時間 */
    private Long timeSpent;
    /** 前日の累計ポモドーロ数 */
    private Long previousDayPomodoroCount;
    /** 前日の累計作業時間 */
    private Long previousDayTimeSpent;
    /** 本日の累計ポモドーロ数 */
    private Long todayPomodoroCount;
    /** 本日の累計作業時間 */
    private Long todayTimeSpent;
    /** イベントの累計ポモドーロ数 */
    private Long eventPomodoroCount;
    /** イベントの累計作業時間 */
    private Long eventTimeSpent;
    /** 更新日時 */
    private Timestamp updatedAt;
}
