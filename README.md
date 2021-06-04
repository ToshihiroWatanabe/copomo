# CoPomo(コポモ)

![copomo-ogp](https://user-images.githubusercontent.com/79039863/120760903-9a7e7880-c54f-11eb-8741-f564a973963a.png)

## 概要 Overview

25分作業と5分休憩を繰り返す時間管理術「ポモドーロ・テクニック」を実践するためのタイマーに、Todoリストと、他のユーザーのタイマーの状況を表示する機能が備わったアプリです。  

バックエンドはSpring Boot、フロントエンドはReactで制作しています。

## デモ Demo

![copomo-demo](https://user-images.githubusercontent.com/79039863/120760754-7327ab80-c54f-11eb-8bbb-a4037974e0f8.gif)

## 動作環境 Requirement

- Spring Boot 2.4.5
- Java 11
- Maven
- React 17.0.2
- npm

## インストールと起動手順 Installing & Run

リポジトリをクローンします。

```git clone https://github.com/ToshihiroWatanabe/copomo.git```

Spring Bootプロジェクトのディレクトリに移動します。

```cd copomo\backend```

必要なモジュールをインストールします。

```mvn install```

Spring Bootアプリケーションを起動します。

```mvn spring-boot:run```

Reactプロジェクトのディレクトリに移動します。

```cd ..\frontend```

必要なモジュールをインストールします。

```npm install```

Reactアプリケーションを起動します。

```npm start```

## 作者 Author

ワタナベトシヒロ

## ライセンス License

This project is licensed under the MIT License.
