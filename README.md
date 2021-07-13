# CoPomo(コポモ)

![copomo-ogp](https://user-images.githubusercontent.com/79039863/120760903-9a7e7880-c54f-11eb-8741-f564a973963a.png)

## Overview 概要

25分作業と5分休憩を繰り返す時間管理術「ポモドーロ・テクニック」を実践するためのタイマーに、Todoリストと、他のユーザーのタイマーの状況を表示する機能を備えたWebアプリケーションです。

バックエンドはSpring Boot、フロントエンドはReactで制作しています。

## Demo デモ

![copomo-demo](https://user-images.githubusercontent.com/79039863/120760754-7327ab80-c54f-11eb-8bbb-a4037974e0f8.gif)

## Features 機能

- **オフライン対応** - PWA(プログレッシブウェブアプリ)なので、タイマーやTodoリストはオフラインで利用できます。
- **プッシュ通知** - タイマーの完了時にブラウザのプッシュ通知を表示できます。
- **動的タイトル** - タイマーの残り時間やTodoリストのタスク名がページのタイトルに反映されます。
- **動的favicon** - 作業と休憩が切り替わるときにfaviconが変化します。
- **ピクチャーインピクチャー** - タイマー時間表示はピクチャーインピクチャーに対応しています。ピクチャーインピクチャーからもタイマーの開始と停止の操作ができます。
- **YouTube動画をBGMにする** - YouTubeの動画のURLを作業用・休憩用BGMとして設定すると、タイマーが作動しているときに動画の音声が再生されます。
- **クリップボードにコピー** - Todoリストをクリップボードにコピーできます。各タスクの作業時間と、合計時間も出力されます。
- **Googleアカウントでログイン** - OAuth2.0を利用して、Googleアカウントでログインできます。

## Requirement 動作環境

- Java 11
- Maven
- PostgreSQL
- npm

## Installing & Run インストールと起動手順

リポジトリをクローンします。

```git clone https://github.com/ToshihiroWatanabe/copomo.git```

クローンされたリポジトリのディレクトリに移動します。

```cd copomo```

### バックエンド

PostgreSQLでデータベースを作成し、[copomo/springboot/src/main/resources](/springboot/src/main/resources)にあるschema.sqlとdata.sqlを実行して、テーブル作成と初期データ挿入を行ってください。

以下の環境変数の値を設定してください。

キー|説明
---|---
POSTGRES_URL|jdbc:postgresql://**ホスト名**:**ポート番号**/**データベース名**
POSTGRES_USER|データベースにログインするユーザー名
POSTGRES_PASS|データベースにログインするユーザーのパスワード

Spring Bootプロジェクトのディレクトリに移動します。

```cd springboot```

Mavenで依存関係をインストールします。

```mvn install```

Spring Bootアプリケーションを起動します。

```mvn spring-boot:run```

### フロントエンド

Reactプロジェクトのディレクトリに移動します。

```cd react```

必要なモジュールをインストールします。

```npm install```

ログイン機能を使う場合は、copomo\react配下に.envファイルを作成し、以下の環境変数の値を設定してください。

キー|説明
---|---
REACT_APP_CLIENT_ID|Google OAuth2.0 のクライアントID

Reactアプリケーションを起動します。

```npm start```

### バックエンドにフロントエンドをまとめてビルドする場合

Reactプロジェクトのディレクトリに移動します。

```cd react```

Reactプロジェクトをビルドします。

```npm run build```

Spring Bootプロジェクトのディレクトリに移動します。

```cd ..\springboot```

Spring Bootプロジェクトをクリーン、パッケージします。

```mvn clean package```

これでcopomo\springboot\targetにcopomo-1.0.0.jarファイルが生成されます。

## Author 作者

ワタナベトシヒロ

## License ライセンス

This project is licensed under the MIT License.
