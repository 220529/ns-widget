var REMOTE = {
  server: "http://nest.lytt.fun/monitor/collect.gif",
};

function upload(
  params: Record<string, string | number | undefined | Error | Event>
): void {
  const _img = new Image();

  // 将 params 对象转换为查询参数字符串
  const paramsArr: string[] = [];
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      if (typeof key === "string") {
        paramsArr.push(`${key}=${params[key]}`);
      }
    }
  }

  // 设置图片的 src 属性
  _img.src = `${REMOTE.server}?${paramsArr.join("&")}`;
}

const handleResourceError = (event: Event) => {
  const target = event.target;
  if (
    target &&
    (target instanceof HTMLScriptElement ||
      target instanceof HTMLLinkElement ||
      target instanceof HTMLImageElement)
  ) {
    const src =
      (target as HTMLImageElement).src ||
      (target as HTMLScriptElement).src ||
      (target as HTMLLinkElement).href;
    upload({ type: "staticLoadError", src, tagName: target.tagName });
  }
};

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  upload({ type: "unhandledrejection", reason: event.reason });
};

const handleGlobalError = (
  message: string | Event,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
) => {
  upload({
    type: "GlobalError",
    message,
    source,
    lineno,
    colno,
    error,
  });
};

const init = () => {
  window.onerror = handleGlobalError;
  window.addEventListener("error", handleResourceError, true);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);
};

export default { init, upload };
