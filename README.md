# Fair Tourism website redesign

fairtourism.nl 改版的可交互原型，包含 Web 和手机两种预览。原型沿用基金会现有的品牌、Poppins 字体和原站内容，按访客目的重新组织网站结构。表单、订阅和捐款都只是演示，不会发送或保存任何数据。

## 本地运行

```sh
npm install
npm run dev
```

打开终端里显示的地址（默认 `http://localhost:5173/`）后，可以从入口页选择预览方式，也可以直接访问：

- `?view=web#/`：Web 页面预览
- `?view=mobile#/`：390 px 手机预览
- `?view=system`：Web 与手机端的 UI 规范页
- `?view=site#/`：不带预览外壳的网站本身

预览顶部的工具栏会自动隐藏，鼠标移到窗口最上方时出现。

## 文档

- `UX-REVIEW.md`：产品体验审视、两阶段改进计划和验证方式。
- `WEBSITE-PAGE-FRAMES.md`：各页面的内容框架草图。
- `UI-SYSTEM.md`：Web 与手机端界面规范。
- `CONTENT-GAPS.md`：原站 35 个页面与原型的内容对比，以及已补回和待确认的内容。

## 内容来源与待确认事项

团队照片、合作伙伴 Logo、文章（`src/content/articles.ts`）和项目资料（`src/content/work.ts`）取自 fairtourism.nl 现有页面。数字、日期、引语和照片授权在原型中都标注为待确认，正式发布前需由项目负责人和相关社区核实。

## 媒体素材

`public/media/` 中的三段视频（480p）和对应封面图来自 fairtourism.nl 现有页面，原站共有这三段。每段同时提供两种格式：`.mp4` 是原站文件去掉音轨后的版本（H.264 画面原样保留），`.webm` 是转码的 VP9 备用版本。页面优先加载 MP4。原因：VS Code 内置浏览器只能打开 MP4 容器、解 H.264 画面，既不支持 WebM 容器，也不支持 AAC 音频；原站 MP4 带一条静音 AAC 音轨，所以在 VS Code 里会整段播放失败。替换视频时请导出不带音轨的 H.264 MP4，并同步更新 WebM。

- `home-hero.mp4`：原站首页首屏背景视频，原型首页首屏同样使用（静音循环，可暂停；系统开启“减少动态效果”时不自动播放）。
- `project-kenya.mp4`：原站 Kenya 项目页视频，用于原型 Maasai 项目页；拍摄地点、出镜人员和使用许可待确认。
- `project-thailand.mp4`：原站 Thailand 项目页视频，用于原型 Kayan 项目页。内容是泛东南亚旅游混剪（含疑似越南占婆塔、鬼面节、大佛、水上市场），**不是 Huay Pu Keng 的实拍**，正式发布前应替换为社区同意使用的素材。

原站 Indonesia 项目页有视频容器但没有加载视频源，因此原型 Sasak 项目页暂不放视频。
