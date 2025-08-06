# AAStar Start
AAStar Start 是一个 mock 项目，目的是展示和梳理基于我们 sdk 可以构建的基础应用。

## 背景介绍
本项目面向包括 C 端、KOL、商家和社区运营者，我们构建了几个产品 mock demo：CoinJar、CryptoNewbieShuttle、Spores 和 CommunityTapWater，分别面向快速小额接收加密货币、加密新手难题、按效果付费集客、社区运营可持续四个问题，提供简单易用的痛点解决方案。技术架构底层是 AirAccount、SuperPaymaster 和 COS72(OpenPNTs、OpenCards、OpenSpores)。


| **面向用户 (Target User)** | **痛点 (Pain Point)** | **产品 (Product)** | **解决方案 (Solution)** | **核心技术/协议 (Core Technology/Protocol)** |
| :--- | :--- | :--- | :--- | :--- |
| **C 端 (End User)** | 加密新手入门困难 (Difficult onboarding for crypto novices) | CryptoNewbieShuttle | 提供一套简单易用的新手工具，快速上手加密世界。 (Provides a simple and easy-to-use tools, lowering the learning curve for quick entry into the crypto world.) | AirAccount |
| **KOL (Key Opinion Leader)** | 普通人被平台白嫖，KOL 流量变现效率低，粉丝互动和转化难以追踪。 (Low traffic monetization efficiency, difficult to track fan interaction and conversion.) | Spores | 提供按效果付费的集客解决方案，精准追踪 KOL 带来的每一次转化，实现高效变现。 (Offers a pay-for-performance customer acquisition solution that accurately tracks every conversion brought by KOLs, achieving efficient monetization.) | SuperPaymaster |
| **商家 (Merchant)** | 小额加密货币收款流程繁琐，技术门槛和交易费用高。 (Cumbersome process and high transaction fees for receiving small crypto payments.) | CoinJar | 提供便捷的小额加密货币接收工具，简化支付流程，降低交易成本。 (Provides a convenient tool for receiving small crypto payments, simplifying the payment process and reducing transaction costs.) | SuperPaymaster |
| **社区运营者 (Community Operator)** | 社区缺乏可持续的运营模式和激励机制。 (Lack of sustainable operational models and incentive mechanisms for communities.) | CommunityTapWater | 打造可持续的社区运营解决方案，通过创新的激励方式，促进社区的长期健康发展。 (Creates a sustainable community operation solution that promotes the long-term healthy development of the community through innovative incentive methods.) | COS72 and other foundational protocols |

## 产品设计初稿
### CoinJar

为希望接受加密资产支付的任何商业创建简单的可接受加密资产的链上账户。
加密支付和接收是一个热战场，巨头纷纷涌入，AAStar 希望为普通的小商家提供一个简单易用的加密资产接受解决方案。
开源无需可，基于去中心 AirAccount 和背后的社区节点提供计算服务，资产在 Layer2，安全可验证。
原型版是一个网页版，未来会提供 APP 版本。
这是一个简单的对 AirAccount SDK 的一个应用展示，也是 AAStar 的一个最基础的服务产品：去中心化加密账户服务。
开源的加密基础设施，提供基于 AAStar.io 的加密账户生命周期服务。
提供自行架设服务器（Passkey 控制的硬件钱包 Server）全套流程，支持快速部署。

#### 问题和方案
- 问题：
  - 错失成交：商家需要更多顾客光顾和成交，有时候购买意愿但各种原因无法支付，例如没有足够的本地法币甚至没有账户，只有少数现金等。
  - 技术障碍：中小商家无力接入加密支付甚至银行支付，需要一个简单的解决方案，不需要复杂的流程和技术能力要求，安全简单的接受加密资产。
  - 安全问题：加密世界不存在所谓的银行账户服务，AirAccount 提供全生命周期加密账户服务，开源开放，服务社区，透明公开，安全可验证。
- 方案：
  - 提供基于 Email 和手机指纹的账户服务，支持扫码支付，让商家快速接受顾客的加密资产，达成交易。
  - 基于简单可靠的去中心服务模型，即便 AAStar 不存在了，你的资产和服务依然可以正常运行（自行运行节点或者迁移到其他服务）。
  - 开源无需可，基于去中心 AirAccount 和背后的社区节点提供计算服务，资产在 Layer2，安全可验证。
  - 原型版是一个网页版，未来会提供 APP 版本。
  - 自动支持无 gas 交易，提供页面快速转账到自己的 CEX 或者其他账户，基于 CoinJar 和积分体系。

让你的烤鱼摊位或者椰子水售货亭快速的接受比特币，打出你的招牌：接受比特币！

#### features
- P1 主干流程
  - 访问 airaccount.aastar.io, 输入 Email 创建账户，两分钟建立账户和收款二维码。
  - 建立在 Optimism Layer2，基于 AirAccount SDK 开发，目前只提供网页版。
  - 访问账户，获得基于 OP 的 ENS 收款地址，输入到 CEX，提币到你的 AirAccount 地址。

- P1 操作交互
  - 商家生成二维码，基于手机登录网页账户，顾客扫码支付
  - 顾客要拥有同样的 AirAccount 账户，初期网页版，扫码商家二维码进行支付
  - 输入要支付的当地法币金额，选择支付的 Token 类别，点击计算产生要支付 Token 的数量
- P2: 支持已有 EOA 快速创建和绑定账户，建立基于 7702 的 AirAccount 账户，支持扫码支付。
- P2 价格查询界面：支持实时主流币价格查询和换算（自动后台+dashboard，多交易所 CEX+DEX）

#### 技术架构
- 基于 AirAccount SDK 开发，目前只提供网页版。
- 建立在 Optimism Layer2，基于 AirAccount SDK 开发，目前只提供网页版。
- 支持已有 EOA 快速创建和绑定账户，建立基于 7702 的 AirAccount 账户，支持扫码支付。
- 支持实时主流币价格查询和换算（自动后台+dashboard，多交易所 CEX+DEX）

#### 未来展望
- 提供 APP 版本。


#### 思考
以上是关于第一个基于 AirAccount 的 demo 或者叫产品，有几个担心的点：
- 安全性：AirAccount 的账户安全性如何保证？必须给出可验证的安全模型和安全流程，说服商家和客户来尝试和使用。
- 易用性：如何让商家和客户快速上手和使用？需要一个简单易用的界面和流程。极度的简单和贴近实用场景。
- 网页支持：是否支持摄像头扫描其他手机上显示的网页二维码？
- 如果手机支持 NFC，是否支持识别标签和发起支付请求？然后集成到网页 passkey，按下指纹确认？猜测 NFC 需要 APP 集成？
- OP 链上交易确认的时间，是否可以接受？目前是多久？
- 未来要接入 SuperPaymaster
- 利用 EIP-681 标准：
      我们可以让生成的二维码不仅仅是一个地址，而是一个符合 EIP-681 标准的支付链接。它
      可以包含链 ID。例如，一个指向您地址的、请求在 Optimism 链（ID 为 10）上交易的二维
      码内容会是：ethereum:0xYourAddress@10。大多数现代钱包都能识别这个格式，如果钱
      包当前不在 Optimism 链，它会主动提示用户切换网络。这比让用户手动操作要好得多

---


### CryptoNewbieShuttle
加密新手穿梭机，为加密新手提供一个简单易用的加密资产接受解决方案。

#### 问题和方案
新手老手拥有一个穿梭机，轻松浏览加密世界。
#### 问题：
  - 账户问题：创建加密账户和持有加密资产的门槛太高，需要复杂的流程和技术能力要求。
  - Gas 问题：作为新手，新手账户没有 gas，寸步难行，而获取 gas 和支付就是一个大问题。
  - 跨链问题：作为老手，我需要跨链，但是跨链成本太高，领取一个 NFT 的跨链成本比 gas 本身还要高，还造成碎片资产。
#### 方案：
  - AirAccount：提供基于 Email 和手机指纹的账户服务，30 秒钟建立自己的加密账户（支持 7702EOA 绑定）。
  - 任务积分：对于新手测试阶段，free 并获得 1000 个 gas（大约 30 个完成一个基础的转账操作，100-200 完成一个 NFT 领取），更多可以完成任务免费获取。
  - GasCard：提供一个加油卡，所有链都可以免 gas，避免高额跨链成本和资产碎片。



### Spores
孢子，构建你的永久收入来源，通过链上实时分润的方式，任何人都可以构建自己的持续稳定的收入来源，通过分享和推荐以及更多方式，获得收益。

一个简单的链条：
个体-->到任意商家消费-->获得真实的感受-->分享给更多人-->其他人阅读-->到商家消费-->Spores 获得收益
其中，商家需要支持 Spores 协议，第一个教育商家的个体，获得超过其他人 20% 的收益（120%）。
对于商家来说，类似 CPS 模式，只有有订单后，才会实时分润给带来订单的 Spores，没有订单，无需消费，自动支持和 Coinjar 集成。

#### 问题和方案
- 问题：
  - 平台高抽水和普通商家的微利，导致普通商家不愿意接入或者降低服务质量。
  - 商家又需要稳定的客户来源，也愿意付出一定的分润，如果基于效果付费，则需要一个平台来提供服务。
- 方案：
  - 基于 Spores 协议，构建一个去中心化的分润平台，提供一个简单的解决方案，让商家可以基于订单实时分润给 Spores。
  - 任何商家，任何个体，可以无许可的加入 Spores 协议，获得客户和收益。
  - 商家要加入 OpenPNTs 和 OpenCards 协议，发行积分和卡片，就可以运行 Spores 协议。


### CommunityTapWater
一个社区运营者，可以轻松的为社区提供一个水站（Gas 积分），提供一个简单的解决方案，让社区的成员可以轻松获取链上的基础补给：Gas。社区成员通过积极的社区活动，完成社区任务来获得积分，自动充值到加油卡，轻松获取链上基础补给来跨链使用（依赖 AirAccount 部署）。

#### 问题和方案
- 问题：
  - 社区需要基础的可持续性，基础的活跃度和参与度，也需要提供低成本的公共物品。
  - 社区成员需要一个简单易用的解决方案，来获取链上的基础补给：Gas。
- 方案：
  - 社区运营者可以基于 SuperPaymaster 和 OpenPNTs、OpenCards 来建立社区积分体系。
  - 社区成员通过积极的社区活动，完成社区任务来获得积分，自动充值到加油卡，轻松获取链上基础补给来跨链使用（依赖 AirAccount 部署）。

## 开发相关

Task 1: CoinJar
Task 2: CryptoNewbieShuttle
Task 3: Spores
Task 4: CommunityTapWater


### 脚手架搭建
整个项目脚手架的搭建，包括了三个核心部分：

   1. `coinjar-demo`: 一个包含示意 UI 的 React 应用，未来会独立出来和 Tauri 结合，无论独立发布网站还是提供 APP 版本都可以。
   2. 可以新建其他目录，例如 `crypto-newbie-shuttle-demo`，`spores-demo`，`community-tap-water-demo`，分别对应不同的产品。
   3. `fake-backend`: 一个可运行的、提供虚假 API 响应的 Node.js 服务器，模拟的是 后端服务 的 API 接口，包括创建账户、获取账户、获取账户余额、获取账户交易记录等。
   4. 后端服务包括：
      1. AirAccount 生命周期服务，包括创建账户、获取账户、获取账户余额、获取账户交易记录等，有后台进程，API 和数据库，是 AirAccount 的核心服务。初期是 Go+Postgresql，未来是 Rust。
      2. SuperPaymaster 服务，包括从接受用户的 UserOperations 到上链全过程，后台是 SuperRelay，提供签名和 Bundler 服务，配合链上合约 SuperPaymaster。此服务对产品端不可见，只为 AirAccount 提供服务。
      3. COS72，包括后端和前端服务，提供 Gas 节点设置，积分和卡片服务，支持 Spores 协议，目前提供 FakeAPI。
   5. `aastar-sdk`: 一个连接前端和后端的 Node.js SDK，目前是模拟的，未来会替换为真实的 SDK 并发布到 NPM（AAStar 组织下）。


### 启动步骤

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











