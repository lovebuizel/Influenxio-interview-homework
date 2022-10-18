import httpProxyMiddleware from "next-http-proxy-middleware";

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxyApi = (req, res) =>
  httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    target: process.env.NEXT_PUBLIC_API_URL,
    // In addition, you can use the `pathRewrite` option provided by `next-http-proxy`
    pathRewrite: [
      {
        patternStr: "^/api",
        replaceStr: "",
      },
    ],
  });

export default proxyApi;
