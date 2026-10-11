import FairTourismPrototype from "./FairTourismPrototype";
import { useState } from "react";
import "./App.css";

type Section = "overview" | "roles" | "recommendations" | "roadmap";
type Status = "open" | "planned";
type Phase = "phase1" | "phase2";

const roles = [
  {
    id: "supporter",
    number: "01",
    name: "潜在赞助者",
    summary: "想确认自己的支持会带来什么改变。",
    needs: "可信成果、资金用途、简单透明的捐赠方式",
    signal: "捐赠页详细说明了资金用途与服务地区。",
    color: "coral",
  },
  {
    id: "partner",
    number: "02",
    name: "机构与旅游业伙伴",
    summary: "正在判断 Fair Tourism 是否适合共同开展项目。",
    needs: "合作模式、适配场景、双方投入和下一步",
    signal: "首页呈现服务内容，联系页邀请访客成为合作伙伴。",
    color: "green",
  },
  {
    id: "community",
    number: "03",
    name: "社区代表与实践者",
    summary: "需要理解合作方式，并确认社区拥有主导权。",
    needs: "参与路径、决策权、文化表达与联系渠道",
    signal: "项目叙事强调社区主导；直接面向社区的入口待核实。",
    color: "yellow",
  },
  {
    id: "learner",
    number: "04",
    name: "关注者与传播者",
    summary: "希望快速理解议题，并找到值得分享的故事。",
    needs: "易读故事、背景解释、可引用或分享的资料",
    signal: "网站提供项目故事、学习资源和邮件订阅。",
    color: "blue",
  },
];

const initialRecommendations = [
  {
    id: "analytics-baseline",
    phase: "phase1" as Phase,
    title: "先拿到访问数据，记下改版前的情况",
    area: "第一阶段 · 访问统计",
    priority: "P0",
    effort: "低",
    audience: "supporter",
    evidence:
      "目前还不清楚网站有没有访问统计、数据从什么时候开始记录，也没有改版前的访问基线。",
    action:
      "向网站维护方申请统计工具和 Search Console 的只读权限，确认数据日期、访客来源、访问设备和页面浏览情况。经隐私同意后，记录捐款按钮点击、捐款完成、联系表格成功提交和邮件订阅成功；不记录姓名、邮箱、留言或付款资料。",
    measure:
      "能否查看历史访问数据；关键操作是否正确记录；统计是否遵守访客同意和隐私设置",
    status: "open" as Status,
  },
  {
    id: "display-audit",
    phase: "phase1" as Phase,
    title: "先找出并修复页面显示问题",
    area: "第一阶段 · 页面检查",
    priority: "P0",
    effort: "中",
    audience: "learner",
    evidence:
      "目前还没有逐页、跨设备的系统检查记录；需要确认有哪些内容挤压、错位或被裁切。",
    action:
      "在电脑和手机上检查首页、项目、捐赠、联系和文章页面，记录错位、重叠、截断、图片裁切和难以点击的问题，按影响大小修复。",
    measure: "未解决的严重显示问题数量、不同屏幕下页面是否溢出",
    status: "open" as Status,
  },
  {
    id: "shared-ui",
    phase: "phase1" as Phase,
    title: "统一页面布局、间距和文字样式",
    area: "第一阶段 · 共用界面样式",
    priority: "P0",
    effort: "中",
    audience: "learner",
    evidence:
      "页面需要有一致的内容宽度、标题层级、段落间距、颜色和按钮样式，才能让访客感觉是同一个网站。",
    action:
      "规定桌面和手机的页面边距、内容宽度、常用间距、标题/正文规格、颜色、图片比例和按钮样式，并整理成可重复使用的页面模板。",
    measure: "主要页面是否使用相同模板规则、人工检查发现的样式不一致数量",
    status: "open" as Status,
  },
  {
    id: "interaction-states",
    phase: "phase1" as Phase,
    title: "补齐菜单、按钮和表单的操作反馈",
    area: "第一阶段 · 交互检查",
    priority: "P0",
    effort: "低",
    audience: "partner",
    evidence:
      "仅看静态页面无法确认菜单、链接和表单在操作中、成功或失败时是否给出清楚反馈。",
    action:
      "检查菜单开关、链接目标、按钮反馈和表单填写/发送中/成功/失败状态；确保键盘也能操作，并为错误说明下一步怎么处理。",
    measure: "关键操作是否都有反馈、表单成功/失败状态是否可完成",
    status: "open" as Status,
  },
  {
    id: "impact-proof",
    phase: "phase2" as Phase,
    title: "让成果证据先于捐赠请求出现",
    area: "第二阶段 · 捐赠路径",
    priority: "P0",
    effort: "中",
    audience: "supporter",
    evidence:
      "捐赠页解释了培训、伙伴关系、需求评估和市场连接，但抓取到的页面内容未呈现可核验的成果指标。",
    action:
      "在捐赠入口附近增加经社区确认的进展信息，附时间和来源；没有可靠数据时优先呈现阶段成果与案例。",
    measure: "捐赠页到达率、捐赠流程完成率、资金用途相关咨询量",
    status: "open" as Status,
  },
  {
    id: "intent-entry",
    phase: "phase2" as Phase,
    title: "首页按访客想做的事安排内容",
    area: "第二阶段 · 首页结构",
    priority: "P1",
    effort: "中",
    audience: "supporter",
    evidence:
      "首页同时呈现服务、项目故事、资源、伙伴与支持入口；主要访客需要自行判断从哪里开始。",
    action:
      "在版式统一后，按“想支持、想合作、想了解”重排首页入口；保留清楚的品牌使命和显眼的捐赠行动。",
    measure: "各入口点击情况、首页到目标页面的访问、手机端入口使用情况",
    status: "open" as Status,
  },
  {
    id: "case-scan",
    phase: "phase2" as Phase,
    title: "把项目故事改成更容易看懂的介绍",
    area: "第二阶段 · 项目页面",
    priority: "P1",
    effort: "中",
    audience: "learner",
    evidence:
      "Kayan 和 Maasai 案例页都包含挑战、活动、方法、目标与项目事实；主体叙述较长，部分信息重复。",
    action:
      "页面顶部先给出社区、地点、时间、项目进度和一句摘要；正文按“社区需要—大家一起做了什么—目前进展—下一步”组织。",
    measure: "访客能否说清项目内容、案例页到支持/合作页面的访问情况",
    status: "open" as Status,
  },
  {
    id: "partner-route",
    phase: "phase2" as Phase,
    title: "让合作页面说明谁适合联系、联系后会怎样",
    area: "第二阶段 · 合作联系",
    priority: "P1",
    effort: "低",
    audience: "partner",
    evidence:
      "联系页提供姓名、邮箱和留言表单；不同类型的合作需求共用同一入口。",
    action:
      "说明可讨论的合作内容，表单增加身份与感兴趣地区/项目选项；提交前说明回复预期，提交后给出确认信息。",
    measure: "表单开始和完成情况、收到的合作请求是否合适、首次回复时间",
    status: "open" as Status,
  },
  {
    id: "community-voice",
    phase: "phase2" as Phase,
    title: "补充经社区确认的照片、故事和项目进展",
    area: "第二阶段 · 项目内容",
    priority: "P1",
    effort: "中",
    audience: "community",
    evidence:
      "项目强调社区主导和文化保护；公开内容中社区成员的直接引述、署名与内容审核机制不明显。",
    action:
      "按新页面结构补充内容；先与社区确认照片授权、称谓和引述，并核对每项进展，不以外部机构叙述代替社区观点。",
    measure: "内容是否经社区确认、图片和引述授权记录是否完整",
    status: "open" as Status,
  },
  {
    id: "brochure-content",
    phase: "phase2" as Phase,
    title: "把 two-pager 的定位和工作方法放到网站上",
    area: "第二阶段 · 基金介绍与影响内容",
    priority: "P1",
    effort: "中",
    audience: "partner",
    evidence:
      "官网 two-pager 包含更完整的基金简介、愿景使命、社区旅游五步法、伙伴类型和成果数字，网站还没有把这些信息系统地放到对应页面。",
    action:
      "将简介和愿景放到 About，五步法放到 How We Work，把有日期和来源的成果放到 Our Impact，并把学术/旅游行业伙伴的合作方式放到合作页。发布前请团队确认内容、年份、统计口径和社区引述授权。",
    measure:
      "主要页面是否覆盖访客常问的问题；页面日期和来源是否齐全；访客能否说清基金工作方式",
    status: "open" as Status,
  },
];

const sectionLabels: Record<Section, string> = {
  overview: "项目概览",
  roles: "访客角色",
  recommendations: "改进建议",
  roadmap: "行动路线图",
};

export function ExperienceWorkbench() {
  const [section, setSection] = useState<Section>("overview");
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [recommendations, setRecommendations] = useState(
    initialRecommendations,
  );
  const plannedCount = recommendations.filter(
    (item) => item.status === "planned",
  ).length;
  const visibleRecommendations = recommendations.filter(
    (item) =>
      (selectedAudience === "all" || item.audience === selectedAudience) &&
      (statusFilter === "all" || item.status === statusFilter),
  );

  function togglePlanned(id: string) {
    setRecommendations((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "planned" ? "open" : "planned" }
          : item,
      ),
    );
  }

  function showRecommendations(audience = "all") {
    setSelectedAudience(audience);
    setStatusFilter("all");
    setSection("recommendations");
  }

  function exportReport() {
    const content = [
      "# Fairtourism.nl 网站体验审视",
      "",
      "角色、体验判断与优先改进建议见项目文件 UX-REVIEW.md。",
      "",
      "## 当前行动路线图",
      ...recommendations
        .filter((item) => item.status === "planned")
        .map(
          (item) =>
            `- ${item.phase === "phase1" ? "第一阶段" : "第二阶段"} · ${item.title}`,
        ),
      "",
      "来源：公开页面内容审阅；未使用网站分析数据或用户访谈。",
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/markdown;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "fairtourism-experience-review.md";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="workspace">
      <aside className="sidebar">
        <a
          className="brand"
          href="#overview"
          onClick={() => setSection("overview")}
        >
          <span className="brand-mark">FT</span>
          <span className="brand-copy">
            <strong>Fieldnotes</strong>
            <small>体验策略工作台</small>
          </span>
        </a>
        <div className="workspace-label">工作区</div>
        <div className="project-switcher">
          <span className="project-dot" />
          <span>Fairtourism.nl</span>
          <span className="switcher-caret">⌄</span>
        </div>
        <nav className="primary-nav" aria-label="项目导航">
          {(Object.keys(sectionLabels) as Section[]).map((key, index) => (
            <button
              className={`nav-item ${section === key ? "active" : ""}`}
              key={key}
              onClick={() => setSection(key)}
              aria-current={section === key ? "page" : undefined}
            >
              <span className="nav-number">0{index + 1}</span>
              <span>{sectionLabels[key]}</span>
              {key === "roadmap" && plannedCount > 0 && (
                <span className="nav-count">{plannedCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="note-kicker">研究基线</span>
          <p>基于公开页面的体验审视。角色与行为假设待访谈和站点数据验证。</p>
          <a href="https://www.fairtourism.nl" target="_blank" rel="noreferrer">
            打开 Fairtourism.nl <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="sidebar-footer">
          <span className="status-pip" />
          <span>初步审视 · 2026</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>项目</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{sectionLabels[section]}</strong>
          </div>
          <div className="topbar-actions">
            <span className="review-tag">
              <span className="tag-dot" />
              体验审视
            </span>
            <button
              className="export-button"
              type="button"
              onClick={exportReport}
            >
              导出简报 <span aria-hidden="true">↓</span>
            </button>
          </div>
        </header>

        {section === "overview" && (
          <div className="page page-overview">
            <div className="page-eyebrow">
              <span>FAIR TOURISM FOUNDATION</span>
              <span>网站体验 · 第一轮</span>
            </div>
            <section className="overview-hero">
              <div className="hero-copy">
                <p className="eyebrow">让影响被看见，让支持更容易发生</p>
                <h1>
                  从访客的
                  <br />
                  <em>下一步</em>开始设计。
                </h1>
                <p className="hero-description">
                  围绕赞助者、合作伙伴、社区实践者与关注者，梳理 Fair Tourism
                  网站如何更清楚地表达工作、成果和参与方式。
                </p>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => setSection("recommendations")}
                >
                  查看优先建议 <span aria-hidden="true">→</span>
                </button>
              </div>
              <div className="hero-image-wrap">
                <img
                  src="https://static.wixstatic.com/media/6b7109_d43f177ca57f4541a9dbaa5741e143a8~mv2.jpg/v1/fill/w_1000,h_720,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Fa%20Trinca.jpg"
                  alt="Fair Tourism 捐赠页面展示的社区旅游场景"
                />
                <div className="image-caption">
                  <span>01 / 04</span>
                  <span>从社区故事到可见行动</span>
                </div>
              </div>
            </section>
            <section className="snapshot-strip" aria-label="审视范围">
              <div>
                <strong>04</strong>
                <span>访客角色假设</span>
              </div>
              <div>
                <strong>10</strong>
                <span>分阶段改进项</span>
              </div>
              <div>
                <strong>03</strong>
                <span>重点体验路径</span>
              </div>
              <p>研究范围：主页 · 项目案例 · 捐赠 · 合作联系</p>
            </section>
            <section className="overview-lower">
              <div className="section-column">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">FIRST READ</span>
                    <h2>首先解决的体验问题</h2>
                  </div>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => setSection("recommendations")}
                  >
                    全部建议 <span aria-hidden="true">→</span>
                  </button>
                </div>
                <div className="priority-list">
                  {recommendations.slice(0, 3).map((item, index) => (
                    <button
                      className="priority-row"
                      key={item.id}
                      type="button"
                      onClick={() => showRecommendations(item.audience)}
                    >
                      <span className="priority-index">0{index + 1}</span>
                      <span className="priority-copy">
                        <strong>{item.title}</strong>
                        <small>{item.area}</small>
                      </span>
                      <span
                        className={`priority-pill ${item.priority.toLowerCase()}`}
                      >
                        {item.priority}
                      </span>
                      <span className="row-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <aside className="principle-panel">
                <span className="eyebrow">DESIGN PRINCIPLE</span>
                <h3>先呈现社区的选择，再呈现机构的行动。</h3>
                <p>
                  每条影响叙事都应回答：社区提出了什么需求？谁参与决策？目前有哪些经确认的变化？
                </p>
                <button
                  className="principle-link"
                  type="button"
                  onClick={() => setSection("roles")}
                >
                  查看角色需求 <span aria-hidden="true">→</span>
                </button>
              </aside>
            </section>
            <footer className="page-foot">
              <span>FIELDNOTES / FAIRTOURISM.NL</span>
              <span>基于公开页面的定性审阅，不代表用户研究结论</span>
            </footer>
          </div>
        )}

        {section === "roles" && (
          <div className="page">
            <div className="page-heading-block">
              <p className="eyebrow">WHO COMES HERE?</p>
              <h1>
                四种来访目的，<em>四种下一步。</em>
              </h1>
              <p>
                以下角色是根据网站使命、内容和行动入口建立的初始假设，不是已验证的用户画像。
              </p>
            </div>
            <div className="role-grid">
              {roles.map((role) => (
                <article className={`role-card ${role.color}`} key={role.id}>
                  <div className="role-card-top">
                    <span>{role.number} / VISITOR ROLE</span>
                    <span className="role-orbit" />
                  </div>
                  <h2>{role.name}</h2>
                  <p className="role-summary">{role.summary}</p>
                  <div className="role-detail">
                    <span>需要快速找到</span>
                    <p>{role.needs}</p>
                  </div>
                  <div className="role-signal">
                    <span>页面信号</span>
                    <p>{role.signal}</p>
                  </div>
                  <button
                    className="role-action"
                    type="button"
                    onClick={() => showRecommendations(role.id)}
                  >
                    查看相关建议 <span aria-hidden="true">→</span>
                  </button>
                </article>
              ))}
            </div>
            <div className="research-callout">
              <strong>下一步验证</strong>
              <p>
                访谈 2–3
                位现有赞助者、合作方及社区代表；对照页面分析数据，确认角色、关键疑问和实际流失位置。
              </p>
            </div>
          </div>
        )}

        {section === "recommendations" && (
          <div className="page">
            <div className="page-heading-block recommendations-heading">
              <div>
                <p className="eyebrow">两阶段网站完善计划 / 01—10</p>
                <h1>
                  先修整界面，<em>再完善内容。</em>
                </h1>
                <p>第一阶段统一页面样式并修复操作问题；第二阶段再整理页面结构、补充内容和项目图片。</p>
              </div>
              <a
                className="report-link"
                href="./UX-REVIEW.md"
                target="_blank"
                rel="noreferrer"
              >
                阅读完整审视 <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="filters" aria-label="建议筛选">
              <div className="filter-group">
                <span className="filter-label">访客</span>
                <button
                  className={
                    selectedAudience === "all"
                      ? "filter-chip selected"
                      : "filter-chip"
                  }
                  onClick={() => setSelectedAudience("all")}
                >
                  全部
                </button>
                {roles.map((role) => (
                  <button
                    className={
                      selectedAudience === role.id
                        ? "filter-chip selected"
                        : "filter-chip"
                    }
                    key={role.id}
                    onClick={() => setSelectedAudience(role.id)}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
              <div className="filter-group status-filters">
                <span className="filter-label">状态</span>
                <button
                  className={
                    statusFilter === "all"
                      ? "filter-chip selected"
                      : "filter-chip"
                  }
                  onClick={() => setStatusFilter("all")}
                >
                  全部
                </button>
                <button
                  className={
                    statusFilter === "open"
                      ? "filter-chip selected"
                      : "filter-chip"
                  }
                  onClick={() => setStatusFilter("open")}
                >
                  待讨论
                </button>
                <button
                  className={
                    statusFilter === "planned"
                      ? "filter-chip selected"
                      : "filter-chip"
                  }
                  onClick={() => setStatusFilter("planned")}
                >
                  已排入路线图
                </button>
              </div>
            </div>
            <div className="recommendation-list">
              {visibleRecommendations.map((item, index) => {
                const audience = roles.find(
                  (role) => role.id === item.audience,
                );
                return (
                  <article className="recommendation-item" key={item.id}>
                    <div className="recommendation-index">0{index + 1}</div>
                    <div className="recommendation-body">
                      <div className="recommendation-meta">
                        <span>{item.area}</span>
                        <span
                          className={`priority-pill ${item.priority.toLowerCase()}`}
                        >
                          {item.priority}
                        </span>
                        <span className="meta-dot">·</span>
                        <span>{audience?.name}</span>
                      </div>
                      <h2>{item.title}</h2>
                      <p className="recommendation-evidence">{item.evidence}</p>
                      <div className="recommendation-action">
                        <strong>建议动作</strong>
                        <p>{item.action}</p>
                      </div>
                      <div className="measure-line">
                        <span>观察指标</span>
                        <p>{item.measure}</p>
                      </div>
                    </div>
                    <div className="recommendation-controls">
                      <span className={`status-label ${item.status}`}>
                        {item.status === "planned" ? "已排入" : "待讨论"}
                      </span>
                      <button
                        className={
                          item.status === "planned"
                            ? "plan-button planned"
                            : "plan-button"
                        }
                        type="button"
                        onClick={() => togglePlanned(item.id)}
                      >
                        {item.status === "planned"
                          ? "移出路线图"
                          : "加入路线图"}
                      </button>
                    </div>
                  </article>
                );
              })}
              {visibleRecommendations.length === 0 && (
                <div className="empty-state">
                  当前筛选下没有建议。切换筛选条件，或先把建议加入路线图。
                </div>
              )}
            </div>
          </div>
        )}

        {section === "roadmap" && (
          <div className="page">
            <div className="page-heading-block roadmap-heading">
              <p className="eyebrow">MAKE THE NEXT MOVE</p>
              <h1>
                把洞察变成<em>可验证的改变。</em>
              </h1>
              <p>
                从“改版上线”转向可观察的用户结果。将建议加入路线图后，在此与团队讨论顺序。
              </p>
            </div>
            <div className="roadmap-summary">
              <span>
                <strong>{plannedCount}</strong> 条已排入
              </span>
              <span>
                <strong>{recommendations.length - plannedCount}</strong>{" "}
                条待讨论
              </span>
              <button
                className="text-button"
                type="button"
                onClick={() => setSection("recommendations")}
              >
                管理建议 <span aria-hidden="true">→</span>
              </button>
            </div>
            <div className="roadmap-list">
              {recommendations
                .filter((item) => item.status === "planned")
                .map((item, index) => (
                  <div className="roadmap-row" key={item.id}>
                    <span className="roadmap-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`roadmap-marker ${item.priority.toLowerCase()}`}
                    />
                    <div className="roadmap-copy">
                      <strong>{item.title}</strong>
                      <span>
                        {item.area} · {item.priority} 优先级 · 预估工作量{" "}
                        {item.effort}
                      </span>
                    </div>
                    <button
                      className="remove-button"
                      type="button"
                      onClick={() => togglePlanned(item.id)}
                    >
                      移出
                    </button>
                  </div>
                ))}
              {plannedCount === 0 && (
                <div className="roadmap-empty">
                  <span className="empty-mark">+</span>
                  <h2>路线图还没有条目</h2>
                  <p>从改进建议中选出当前最值得验证的一两项。</p>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => setSection("recommendations")}
                  >
                    浏览建议 <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </div>
            <div className="validation-note">
              <span className="validation-icon">!</span>
              <p>
                <strong>上线前先定义验证方式。</strong>
                记录当前基线，设定成功指标，并与社区代表确认内容和成果表达。
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default FairTourismPrototype;
