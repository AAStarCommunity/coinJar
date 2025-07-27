整个项目脚手架的搭建，包括了三个核心部分：

   1. `coinjar-demo`: 一个包含示意 UI 的 React 应用。
   2. `fake-backend`: 一个可运行的、提供虚假 API 响应的 Node.js 服务器。
   3. `aastar-sdk`: 一个连接前两者的、实现了核心逻辑的 SDK。
运行步骤建议：

   1. 启动后端：
       * cd aastar-sdk-poc/packages/fake-backend
       * pnpm install
       * pnpm start

   2. 构建 SDK:
       * cd aastar-sdk-poc/packages/aastar-sdk
       * pnpm install
       * pnpm run build (这将把 index.ts 编译成 dist/index.js)
       * 将其发布到一个私有的 npm registry。

   3. 运行前端应用：
       * 您需要一个 React 项目的完整环境来运行 coinjar-demo。您可以使用
         npx create-react-app . 
       * 将我生成的 App.tsx 文件作为主组件。
       * 在 React 项目中，您需要引入并使用我们刚刚创建的
         aastar-sdk。您可以通过本地路径引用它（使用 npm link
         或直接文件路径），或者安装 npm 包，然后引入。
       * 在 App.tsx 中，将模拟的 SDK 替换为真实的 SDK 实例：

   1         import { AAStarSDK } from \'../../aastar-sdk\'; // 
     调整为正确的路径
   2         const sdk = new AAStarSDK({ backendUrl: \
     'http://localhost:4000\' });

  当您完成这些步骤后，点击 coinjar-demo 界面上的按钮，将会触发一个完整的流程：

  React App -> AAStarSDK -> Fake Backend

  您可以在浏览器的开发者控制台和运行 fake-backend
  的终端中，看到每一步的日志输出，从而验证整个流程是否按预期工作。

可以独立地看到 UI 的交互流程。它完整地
  反映了您描述的“注册 -> 显示地址 -> 发起交易 -> 显示交易哈希”的整个过程。
  使用 Node.js 和 Express 来创建一个简单的 API 服
  务器，并实现我们之前设计的四个 API 端点。
  启动这个伪后端服务了。请在您的终端中，进入
  aastar-sdk-poc/packages/fake-backend 目录，然后运行以下两个命令：

   1. npm install (安装依赖)
   2. npm start (启动服务器)

  服务器启动后，它将在 http://localhost:4000