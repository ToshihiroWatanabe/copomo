/** アイコンの名前の一覧 */
const icons = ["copomo", "tomato", "coffee"];

/**
 * faviconを、渡された名前のアイコンに変更します。
 * @param {string} icon アイコンの名前
 */
export function changeFaviconTo(icon) {
  if (icons.includes(icon)) {
    const link = document.querySelector("link[rel*='icon']");
    link.href = "/favicon/favicon_" + icon + "/favicon.ico";
  }
}
