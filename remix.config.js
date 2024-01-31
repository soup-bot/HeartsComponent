/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [
    /^@mui\/*/,
    /^@dotenv\/*/,
    /^@emotion\/react/,
    /^@emotion\/styled/,
    /^@keen-slider\/*/,
    /^@prisma\/client\/runtime\/library/,
  ],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
