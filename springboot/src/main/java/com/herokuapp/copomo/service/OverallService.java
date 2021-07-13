package com.herokuapp.copomo.service;

import java.sql.Timestamp;

import com.herokuapp.copomo.mapper.OverallMapper;
import com.herokuapp.copomo.model.Overall;

import org.springframework.stereotype.Service;

@Service
public class OverallService {

    private final OverallMapper overallMapper;

    public OverallService(OverallMapper overallMapper) {
        this.overallMapper = overallMapper;
    }

    /**
     * overallテーブルのデータを全件取得します。
     * 
     * @return overallテーブルのデータの一覧
     */
    public Overall findall() {
        return overallMapper.findAll();
    }

    /**
     * overallテーブルを更新します。
     * 
     * @return 成功した場合はtrue
     */
    public boolean update(Overall overall) {
        return overallMapper.update(overall);
    }

    /**
     * 累計ポモドーロ数のカウントを増やします。
     * 
     * @return 成功した場合はtrue
     */
    public boolean incPomodoroCount() {
        Overall overall = overallMapper.findAll();
        Timestamp nowTimestamp = new Timestamp(System.currentTimeMillis());
        // 日付が変わっていているかどうか
        if (nowTimestamp.toString().substring(0, 10).equals(overall.getUpdatedAt().toString().substring(0, 10))) {
            overall.setTodayPomodoroCount(overall.getTodayPomodoroCount() + 1);
        } else {
            System.out.println("日付が変わりました");
            // 今日の値を昨日の値にセットして、今日の値をリセット
            overall.setPreviousDayPomodoroCount(overall.getTodayPomodoroCount());
            overall.setPreviousDayTimeSpent(overall.getTodayTimeSpent());
            overall.setTodayPomodoroCount(0 + 1L);
            overall.setTodayTimeSpent(0L);
        }
        overall.setPomodoroCount(overall.getPomodoroCount() + 1);
        overall.setUpdatedAt(nowTimestamp);
        return overallMapper.update(overall);
    }
}
