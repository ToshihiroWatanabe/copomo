-- 全体テーブルに初期値を挿入
INSERT INTO overall(
        pomodoro_count,
        time_spent,
        previous_day_pomodoro_count,
        previous_day_time_spent,
        today_pomodoro_count,
        today_time_spent,
        event_pomodoro_count,
        event_time_spent
    )
VALUES(0, 0, 0, 0, 0, 0, 0, 0);