// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import React, { useState, useEffect, useRef } from 'react';
import { useOutlet, history } from 'dumi';
import { warning } from '/Users/liukaixin/local/ns-widget/node_modules/.pnpm/rc-util@5.43.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/rc-util';
import { SiteContext, type ISiteContext } from '/Users/liukaixin/local/ns-widget/node_modules/.pnpm/dumi@2.4.10_@babel+core@7.25.2_@swc+helpers@0.5.1_@types+node@22.5.5_@types+react@18.3.5_esli_qbhgcffbzhqecyoejdbwxs4yjy/node_modules/dumi/dist/client/theme-api/context.js';
import { components } from '../meta/atoms';
import { locales } from '../locales/config';



const entryExports = {
};

// Static content
const pkg = {"name":"@ns-widget/styled","description":"","version":"0.0.1","license":"MIT","authors":[]};
const historyType = "browser";
const hostname = undefined;
const themeConfig = {"footer":"Copyright © 2024 | Powered by <a href=\"https://d.umijs.org\" target=\"_blank\" rel=\"noreferrer\">dumi</a>","prefersColor":{"default":"light","switch":true},"nprogress":true,"lastUpdated":true};
const _2_level_nav_available = true;

export default function DumiContextWrapper() {
  const outlet = useOutlet();
  const [loading, setLoading] = useState(false);
  const prev = useRef(history.location.pathname);

  useEffect(() => {
    return history.listen((next) => {
      if (next.location.pathname !== prev.current) {
        prev.current = next.location.pathname;

        // scroll to top when route changed
        document.documentElement.scrollTo(0, 0);
      }
    });
  }, []);

  const context: ISiteContext = React.useMemo(() => {
    const ctx = {
      pkg,
      historyType,
      entryExports,
      demos: null,
      components,
      locales,
      loading,
      setLoading,
      hostname,
      themeConfig,
      _2_level_nav_available,
    };

    // Proxy do not warning since `Object.keys` will get nothing to loop
    Object.defineProperty(ctx, 'demos', {
      get: () => {
        warning(false, '`demos` return empty in latest version, please use `useDemo` instead.');
        return {};
      },
    });

    return ctx;
  }, [
    pkg,
    historyType,
    entryExports,
    components,
    locales,
    loading,
    setLoading,
    hostname,
    themeConfig,
    _2_level_nav_available,
  ]);

  return (
    <SiteContext.Provider value={context}>
      {outlet}
    </SiteContext.Provider>
  );
}
