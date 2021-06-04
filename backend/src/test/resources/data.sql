-- sessionテーブルにデータを挿入
INSERT INTO sessions(
        user_id,
        user_name,
        session_type,
        timer_on,
        task_name,
        remaining
    )
VALUES(
        null,
        'コポモちゃん',
        'Work',
        true,
        '講座予習',
        25 * 60
    );
INSERT INTO sessions(
        user_id,
        user_name,
        session_type,
        timer_on,
        task_name,
        remaining
    )
VALUES(
        null,
        'コポモくん',
        'Break',
        true,
        '講座予習',
        5 * 60
    );
INSERT INTO sessions(
        user_id,
        user_name,
        session_type,
        timer_on,
        task_name,
        remaining
    )
VALUES(
        null,
        'コポモさん',
        'AFK',
        false,
        '講座予習',
        0
    );
-- overallテーブルに初期値を挿入
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