# CoPomo(コポモ)

![copomo-ogp](https://user-images.githubusercontent.com/79039863/120760903-9a7e7880-c54f-11eb-8741-f564a973963a.png)

## 概要 Overview

25分作業と5分休憩を繰り返す時間管理術「ポモドーロ・テクニック」を実践するためのタイマーに、Todoリストと、他のユーザーのタイマーの状況を表示する機能を備えたWebアプリケーションです。  

バックエンドはSpring Boot、フロントエンドはReactで制作しています。

## デモ Demo

![copomo-demo](https://user-images.githubusercontent.com/79039863/120760754-7327ab80-c54f-11eb-8bbb-a4037974e0f8.gif)

## 機能 Features

- **オフライン対応** - PWA(プログレッシブウェブアプリ)なので、タイマーやTodoリストはオフラインで利用できます。
- **プッシュ通知** - タイマーの完了時にブラウザのプッシュ通知を表示できます。
- **動的タイトル** - タイマーの残り時間やTodoリストのタスク名がページのタイトルに反映されます。
- **動的favicon** - 作業と休憩が切り替わるときにfaviconが変化します。
- **ピクチャーインピクチャー** - タイマー時間表示はピクチャーインピクチャーに対応しています。ピクチャーインピクチャーからもタイマーの開始と停止の操作ができます。
- **YouTube動画をBGMにする** - YouTubeの動画のURLを作業用・休憩用BGMとして設定すると、タイマーが作動しているときに動画の音声が再生されます。
- **クリップボードにコピー** - Todoリストをクリップボードにコピーできます。各タスクの作業時間と、合計時間も出力されます。
- **Googleアカウントでログイン** - OAuth2.0を利用して、Googleアカウントでログインできます。
- **古いセッションの自動削除** - 新しくユーザーが入室したときに、一定時間更新されていないセッションがデータベースのテーブルから削除されます。

## 動作環境 Requirement

- Spring Boot 2.4.5
- Java 11
- PostgreSQL
- Maven
- React 17.0.2
- npm

## インストールと起動手順 Installing & Run

リポジトリをクローンします。

```git clone https://github.com/ToshihiroWatanabe/copomo.git```

クローンされたリポジトリのディレクトリに移動します。

```cd copomo```

### バックエンド

PostgreSQLでデータベースを作成し、copomo\backend\src\main\resourcesにあるschema.sqlとdata.sqlを実行して、テーブル作成と初期データ挿入を行ってください。

以下の環境変数の値を設定してください。

キー|説明
---|---
POSTGRES_URL|PostgreSQLのデータベースURL
POSTGRES_USER|PostgreSQLのデータベースにログインするユーザー名
POSTGRES_PASS|PostgreSQLのデータベースにログインするユーザーのパスワード
GOOGLE_CLIENT_ID|Google OAuth2.0 のクライアントID
GOOGLE_CLIENT_SECRET|Google OAuth2.0 のクライアントシークレット


Spring Bootプロジェクトのディレクトリに移動します。

```cd backend```

Spring Bootアプリケーションを起動します。

```mvn spring-boot:run```

### フロントエンド

Reactプロジェクトのディレクトリに移動します。

```cd frontend```

必要なモジュールをインストールします。

```npm install```

以下の環境変数の値を設定してください。

キー|説明
---|---
REACT_APP_CLIENT_ID|Google OAuth2.0 のクライアントID

Reactアプリケーションを起動します。

```npm start```

### バックエンドにフロントエンドをまとめてビルドする場合

Reactプロジェクトのディレクトリに移動します。

```cd frontend```

Reactプロジェクトをビルドします。

```npm run build```

Spring Bootプロジェクトのディレクトリに移動します。

```cd ..\backend```

Spring Bootプロジェクトをクリーン、パッケージします。

```mvn clean package```

これでcopomo\backend\targetにcopomo-1.0.0.jarファイルが生成されます。

## 作者 Author

ワタナベトシヒロ

## ライセンス License

This project is licensed under the MIT License.
