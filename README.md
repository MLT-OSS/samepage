<div align="center">
    <h1>Samepage</h1>
</div>
<div align="center">
Samepage 是一站式大模型 AI 助理，可以回答您的各类复杂问题。可帮助您阅读文章，满足您对网页文本的总结、翻译、扩写等各项需求。支持构建个人性化助手(基于大模型能力为您解决业务流程中的归纳总结、数据分析等问题)。


</div>
<details>
<summary><kbd>目录树</kbd></summary>

#### TOC

- [特性一览](#特性一览)
- [开箱即用](#开箱即用)
    - [使用 Docker Compose 部署](#使用-docker-compose-部署)
    - [配置大模型网关](#配置大模型网关)
    - [开始使用](#开始使用)
- [社区与支持](#社区与支持)
- [特别感谢](#特别感谢)
- [开源协议](#开源协议)

####

<br/>

</details>

## 特性一览

### 特性

#### `1` 我的助手

“我的助手”是一个高度自定义的私有化智能助手服务，旨在为用户提供个性化、精准的信息管理和检索服务。该助手集成了联网检索、私有化知识库等工具，以满足用户在不同场景下的需求。无论是进行日常信息查询、深入学习研究，还是工作中需要的数据支持，“我的助手”都能迅速、高效地为用户提供所需信息。
使用“我的助手”，用户可以更高效地管理和检索信息，无论是工作学习还是日常生活，都能得到贴心的智能辅助。

#### `2` PDF阅读

帮助用户快速阅读并抓住单个文件的核心问题。用户可在会话内进行提问，基于文件内容给出回复并提供该相关来源。

#### `3` 提示词管理

旨在让用户能够高效、灵活地管理自己设定的提示词。通过这个模块，用户可以定义一系列特定的关键词或短语，这些关键词或短语在与助手交互的过程中用于快速触发相关操作或检索信息。此外，该模块还支持变量设置，使得提示词可以根据不同的上下文环境动态调整，进一步提升了对话的灵活性和准确性。
主要功能：

1. 提示词定义与管理：用户可以自由添加、修改或删除提示词。这为用户提供了高度的个性化定制能力，可以根据自己的习惯和需要设置合适的提示词。

2. 变量设置：在定义提示词时，用户可以设置包含变量的提示词。这意味着，在实际使用时，变量部分可以根据对话的具体内容动态替换，使得提示词更加具有通用性和适应性。

3. 随时使用：一旦设置完成，这些提示词会即刻生效，并可在后续的对话交互中随时使用。无论何时进行查询或指令下达，只需通过预定的提示词，便能快速引导助手按预期执行。
   通过“提示词管理”，用户不仅可以使信息检索更加快速和精确，还能有效优化与助手的交互体验，让日常操作更加便捷高效。

#### `4` 联网检索

将自动判断您的问题是否需要联网搜索，启用联网搜索后，小明将在互联网中获取实时的信息数据，提高答案精确性，并提供来源信息网址供您参考。

### 浏览器插件特性

#### `1` 对照式翻译

浏览外语网页文本时，一键翻译成指定语言，与原文进行对照阅读，帮助您更好地学习和理解内容。

#### `2` 阅读全文

在用户浏览网页时，可帮助用户快速阅读并抓住网页的核心问题。用户可在会话内进行提问，基于网页内容给出回复并提供该相关来源。

---

> [!NOTE]
>
> Chrome 浏览器插件[安装使用文档](./frontend/docs/extension.chrome.md)
>
> Edge 浏览器插件[安装使用文档](./frontend/docs/extension.edge.md)

### 移动设备适配

对移动平台进行了深入的调优和改进，旨在提高用户在移动设备上的使用体验。目前，我们正致力于更新移动端的用户界面，以确保更加顺畅和易用的操作体验。如果您有任何改进建议或想法，我们非常期待您通过GitHub
Issues或Pull Requests与我们分享反馈。



## 开箱即用

Samepage 提供了Docker 镜像，只需要修改几个简单的配置信息，通过 docker-compose.yml 文件即可私有化部署应用程序。运行之前确保机器上安装了
Docker 和 Docker Compose。

### 使用 Docker Compose 部署

1. 进入项目 [`deploy`](./deploy) 目录，打开 [`application.env`](./deploy/application.env) 文件，填写 `邮箱 SMTP`、`机器人配置`、`Bing Search Key` 等基础配置项。

配置示例：

```sh
##########################################
#         基础配置【必填】                  #
##########################################
###### SMTP 配置  ######
SMTP_SEND_MAIL=
SMTP_HOST=
###### SMTP 的授权码  ######
SMTP_PASSWORD=
### 机器人的模型名字配置
#chat line 的模型配置
#CHAT_LITE_MODEL_NAME=gpt-3.5-turbo-16k-0613
CHAT_LITE_MODEL_NAME=
# 请求模型的最大token 数，非gpt的会使用cl100k_base编码进行token计算,如果最大的 token数少于6000 会也会自动关闭PDF阅读和阅读全文
#CHAT_LITE_REQUEST_TOKEN=12000
CHAT_LITE_REQUEST_TOKEN=
# chat pro 的模型配置
#CHAT_PRO_MODE_NAME=gpt-4-0613
CHAT_PRO_MODE_NAME=
# 请求模型的最大token 数，非gpt的会使用cl100k_base编码进行token计算,如果最大的 token数少于6000 会也会自动关闭PDF阅读和阅读全文
#CHAT_PRO_REQUEST_TOKEN=4000
CHAT_PRO_REQUEST_TOKEN=

### chat line 和 chat pro 的联网检索配置
#chat line的模型是否支持function call,这和BING_SUBSCRIPTION_KEY 共同决定是否开启联网检索（是否为true）
# true 和 BING_SUBSCRIPTION_KEY 不为空 则可以自动开通chat line  的联网检索
CHAT_LITE_FUNCTION_CALL=true
#chat pro的模型是否支持function call,这和BING_SUBSCRIPTION_KEY 共同决定是否开启联网检索（是否为true）
# true 和 BING_SUBSCRIPTION_KEY 不为空 则可以自动开通chat pro  的联网检索
CHAT_PRO_FUNCTION_CALL=true
######bing 检索的配置【非必填】######
BING_SUBSCRIPTION_KEY=
BING_SEARCH_URL=https://api.bing.microsoft.com/v7.0/search
### 阅读pdf 和插件的阅读全文

# emedding 配置，如果为空或者Chat line的CHAT_LITE_REQUEST_TOKEN 小于6000，不支持PDF阅读和阅读全文
EMBEDDING_MODEL_NAME=
```

2. 使用 Docker Compose 启动项目

 ```sh
docker compose up -d
 ```

### 配置大模型网关

目前，关于大型模型的访问和管理，采用了一个名为[one-api](https://github.com/songquanpeng/one-api)的解决方案。这个项目允许用户通过一个统一和标准化的OpenAI API格式来访问所有的大型模型，非常方便用户开箱即用。若想深入了解该项目的具体信息和使用说明，强烈建议参阅项目的官方文档，可以通过点击此链接[one-api](https://github.com/songquanpeng/one-api)访问。

对于想要开始使用one-api的用户来说，非常简单。
首先，访问地址是：http://localhost:3000/。 在首次使用时，你将需要使用初始账户名`root`以及密码`123456`进行登录。

在登录之后，重要的一步是配置one-api来接入所需的大型模型渠道。此步骤对于确保您能正常使用`Samepage`非常重要。

**模型校验和配置**

**校验步骤：**

检查 `conf.json` 文件中是否存在与您在 One-API 中配置的模型相对应的模型。

**如果模型不存在，请按照以下步骤添加：**

1. 打开 `backend/management-service/src/main/resources/conf.json` 文件。
2. 添加以下格式的模型列表：
```json
  {
   "modelName": "one-api 配置的模型名",
   "name": "前端展示的名字",
   "maxRequestToken": 4000,
   "functionCall": false
}
```
3. **保存**更改的文件。
4. 在项目目录下执行以下命令重新打包：

```shell
docker build -t samepaage/samepage-api:main -f ./backend/management-service/Dockerfile .
```


### 开始使用

Web 访问地址：http://localhost
移动端访问地址：http://localhost/m-chat

#### 浏览器插件配置

浏览器插件配置的接口地址： http://localhost/api/
浏览器插件配置的web端地址：http://localhost/





## 社区与支持

- 加入 Samepage 微信交流群：

  <img src="./docs/imgs/wechat.png" width="270" height="270"  >



## 特别感谢

我们依赖了以下项目:

- [open-assistant-api](https://github.com/Tuanzi1015/open-assistant-api): 开箱即用的 AI 智能助手 API
- [One API](https://github.com/songquanpeng/one-api): 多模型管理工具

## 开源协议

本仓库遵循 Apache 2.0 license 协议。有关详细信息，请参阅 [LICENSE](https://www.apache.org/licenses/LICENSE-2.0) 文件。
