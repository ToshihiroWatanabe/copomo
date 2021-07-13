// このオプションコードは、サービスワーカーの登録に使用します。
// register()はデフォルトでは呼び出されません。

// これにより、本番環境での次回アクセス時にアプリの読み込みが速くなり、また
// オフラインでも利用できるようになります。しかし、この方法では、開発者（およびユーザー）は
// 開発者（およびユーザー）がデプロイされた更新情報を目にするのは、そのページで開いていた既存のタブがすべて閉じられた後になります。
// キャッシュされたリソースがバックグラウンドで更新されるために
// リソースがバックグラウンドで更新されるからです。

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] はIPv6のローカルホストのアドレスです。
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8はIPv4でのローカルホストです。
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  // 製品環境のとき
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    // URLコンストラクタは、SWをサポートするすべてのブラウザで利用できます。
    // console.log("window.location.href: " + window.location.href);
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // PUBLIC_URLが、ページが提供されるオリジンと異なるオリジンにある場合、サービスワーカーは動作しません。
      // これは CDN を使用している場合に起こります。
      // アセットの提供にCDNが使用されている場合に発生する可能性があります。
      return;
    }

    window.addEventListener("load", () => {
      // console.log("process.env.PUBLIC_URL: " + process.env.PUBLIC_URL);
      // const swUrl = `${process.env.PUBLIC_URL}/#/service-worker`;
      const swUrl = "https://copomo.herokuapp.com/service-worker.js";
      // console.log("swUrl: " + swUrl);
      if (isLocalhost) {
        // これは localhost で実行されています。サービスワーカーがまだ存在しているかどうかを確認してみましょう。
        checkValidServiceWorker(swUrl, config);

        // localhost に追加のロギングを行い、開発者に以下の情報を提供します。
        // サービスワーカー/PWAのドキュメントを開発者に示します。
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "このアプリはService Workerによって" +
              "キャッシュ優先で表示されます。"
          );
        });
      } else {
        // localhostではありません。サービスワーカーを登録するだけです。
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // この時点で、更新されたプリキャッシュされたコンテンツがフェッチされていますが、
              // 以前のサービスワーカーは、すべてのクライアントタブが閉じられるまで、
              // 古いコンテンツを提供します。
              console.log(
                "新しいコンテンツが利用可能です。" +
                  "全てのタブを閉じると更新されます。"
              );

              // コールバックを実行します。
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // この時点で、すべてがプリキャッシュされています。
              // コンテンツはオフラインで使用するためにキャッシュされています」というメッセージを
              // 表示するのに最適なタイミングです。
              console.log(
                "オフライン利用のためにコンテンツがキャッシュされました。"
              );

              // コールバックを実行します。
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Service Workerの登録時にエラーが発生しました:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // サービスワーカーが見つかったかどうかを確認します。見つからない場合は、ページをリロードします。
  fetch(swUrl, {
    headers: {
      ServiceWorker: "script",
    },
  })
    .then((response) => {
      // サービスワーカーが存在すること、そして本当にJSファイルを取得していることを確認します。
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // サービスワーカーが見つかりません。おそらく別のアプリだと思います。ページを再読み込みしてください。
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // サービスワーカーが見つかりました。通常通りに動作します。
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "インターネット接続がありません。オフラインモードで実行しています。"
      );
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
