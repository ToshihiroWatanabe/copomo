package com.herokuapp.copomo.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import com.herokuapp.copomo.model.Session;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.TestPropertySource;

@MybatisTest
@TestPropertySource(locations = "classpath:test.properties")
@DisplayName("sessionsテーブルのマッパークラスのテスト")
class SessionMapperTest {
    @Autowired
    private SessionMapper sessionMapper;

    @Nested
    class findAllメソッドでsessionsテーブルから全件取得できる事 {
        @Nested
        class findAllメソッドでsessionsテーブルから1件目のレコードを取得できる事 {
            List<Session> sessions = sessionMapper.findAll();

            @Test
            void findAllメソッドでsessionsテーブルから1件目のidを取得できる事() {
                assertEquals(1, sessions.get(0).getId());
            }

            @Test
            void findAllメソッドでsessionsテーブルから1件目のuser_idを取得できる事() {
                assertEquals(0, sessions.get(0).getUserId());
            }

            @Test
            void findAllメソッドでsessionsテーブルから1件目のuser_nameを取得できる事() {
                assertEquals("コポモちゃん", sessions.get(0).getUserName());
            }

            @Test
            void findAllメソッドでsessionsテーブルから1件目のsession_typeを取得できる事() {
                assertEquals("Work", sessions.get(0).getSessionType());
            }

            @Test
            void findAllメソッドでsessionsテーブルから1件目のtimer_onを取得できる事() {
                assertEquals(true, sessions.get(0).isTimerOn());
            }

            @Test
            void findAllメソッドでsessionsテーブルから1件目のtask_nameを取得できる事() {
                assertEquals("講座予習", sessions.get(0).getTaskName());
            }

            @Test
            void findAllメソッドでsessionsテーブルから1件目のremainingを取得できる事() {
                assertEquals(25 * 60, sessions.get(0).getRemaining());
            }
        }

        @Nested
        class findAllメソッドでsessionsテーブルから2件目のレコードを取得できる事 {
            List<Session> sessions = sessionMapper.findAll();

            @Test
            void findAllメソッドでsessionsテーブルから2件目のidを取得できる事() {
                assertEquals(2, sessions.get(1).getId());
            }
        }
    }

    @Test
    void countメソッドでセッションの数を取得できる事() {
        assertEquals(3, sessionMapper.count());
    }

    @Nested
    class セッションIDからユーザーの名前を取得できる事 {

        @Test
        void セッションIDが1のユーザーの名前を取得できる事() {
            assertEquals("コポモちゃん", sessionMapper.findUserNameBySessionId(1));
        }

        @Test
        void セッションIDが2のユーザーの名前を取得できる事() {
            assertEquals("コポモくん", sessionMapper.findUserNameBySessionId(2));
        }

        @Test
        void セッションIDが3のユーザーの名前を取得できる事() {
            assertEquals("コポモさん", sessionMapper.findUserNameBySessionId(3));
        }

        @Test
        void 空の値でセッションを作成できる事() {
            assertTrue(sessionMapper.create(new Session()));
        }

        @Test
        void 空の値でセッションを更新できない事() {
            assertFalse(sessionMapper.update(new Session()));
        }

        @Test
        void 古いセッションを削除できる事() {
            // assertTrue(sessionMapper.deleteOld());
        }
    }
}
