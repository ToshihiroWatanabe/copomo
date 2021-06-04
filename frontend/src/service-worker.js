/* eslint-disable no-restricted-globals */

// このサービスワーカーはカスタマイズ可能です！
// 利用可能な Workbox モジュールのリストは
// https://developers.google.com/web/tools/workbox/modules を参照してください。
// また、好きなコードを追加することもできます。
//  また、サービスワーカーを使用したくない場合は、このファイルを削除することができ、
// Workboxのビルドステップはスキップされます。

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

clientsClaim();

// ビルドプロセスで生成されたすべてのアセットをプリキャッシュします。
// それらの URL は、以下のマニフェスト変数に注入されます。
// この変数は、サービス ワーカー ファイルのどこかに存在する必要があります。
// この変数は、プリキャッシングを使用しない場合でも、サービス ワーカー ファイルのどこかに存在する必要があります。
// https://cra.link/PWA を参照してください。
precacheAndRoute(self.__WB_MANIFEST);

// App Shellスタイルのルーティングを設定して、
// すべてのナビゲーションリクエストがindex.htmlのシェルで実行されるようにします。
// 詳細は以下の通りです。https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // falseを返すと、index.htmlで処理されるリクエストが除外されます。
  ({ request, url }) => {
    // これがナビゲーションでなければ、スキップします。
    if (request.mode !== "navigate") {
      return false;
    } // これが/_で始まるURLの場合、スキップします。

    if (url.pathname.startsWith("/_")) {
      return false;
    } // ファイルの拡張子である「//」が含まれているため、リソースのURLのように見える場合はスキップします。

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // ハンドラを使用したいことを示すために、trueを返します。

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// プリキャッシュで処理されないリクエストのためのランタイムキャッシングルートの例です。
// この例では、同一オリジンの.pngリクエスト（public/
registerRoute(
  // 必要に応じて、他のファイル拡張子やルーティング条件を追加してください。
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".png"), // 必要に応じて、CacheFirstに変更するなどして、このストラテジーをカスタマイズしてください。
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // このランタイムキャッシュが最大サイズに達すると、使用頻度の低い画像が削除されるようになっています。
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// これにより、ウェブアプリは以下の方法でskipWaitingをトリガすることができます。
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// その他のカスタムサービスワーカーのロジックをここに入れることができます。
