-- ユーザーテーブルを作成
CREATE TABLE IF NOT EXISTS users(
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE,
  name VARCHAR(50),
  last_activity VARCHAR(255),
  last_activity_end TIMESTAMP WITH TIME ZONE,
  current_activity VARCHAR(255),
  current_activity_start TIMESTAMP WITH TIME ZONE,
  season0_exp BIGINT NOT NULL,
  image_url VARCHAR(255),
  token_id VARCHAR(2048) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
-- セッションテーブルを作成
CREATE TABLE IF NOT EXISTS sessions(
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  user_name VARCHAR(50),
  session_type VARCHAR(50),
  task_name VARCHAR(100),
  timer_on boolean,
  remaining INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
-- 全体テーブルを作成
CREATE TABLE IF NOT EXISTS overall(
  pomodoro_count BIGINT NOT NULL,
  time_spent BIGINT NOT NULL,
  previous_day_pomodoro_count BIGINT NOT NULL,
  previous_day_time_spent BIGINT NOT NULL,
  today_pomodoro_count BIGINT NOT NULL,
  today_time_spent BIGINT NOT NULL,
  event_pomodoro_count BIGINT NOT NULL,
  event_time_spent BIGINT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);