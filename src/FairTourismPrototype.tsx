import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import "./FairTourismPrototype.css";
import { siteArticles } from "./content/articles";
import type { Article } from "./content/articles";
import { contactTopics, donationUses, organisation, projectDetails, researchProjects, serviceExpectations } from "./content/work";
import type { ResearchProject } from "./content/work";

type Page =
  | "home"
  | "about"
  | "services"
  | "service"
  | "work"
  | "project"
  | "impact"
  | "resources"
  | "article"
  | "donate"
  | "contact";

type PreviewMode = "chooser" | "web" | "mobile" | "site" | "system";

type Project = {
  id: string;
  name: string;
  people: string;
  place: string;
  summary: string;
  image: string;
  focus: string[];
  challenge: string;
  approach: string;
  quote: string;
  video?: { file: string; caption: string };
};

const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`;

// H.264 MP4 without an audio track first: VS Code's built-in browser has no WebM demuxer or AAC decoder,
// so the original MP4 (with a silent AAC track) and WebM both fail there. WebM stays as a fallback.
function VideoSources({ file }: { file: string }) {
  return <>
    <source src={media(`${file}.mp4`)} type="video/mp4" />
    <source src={media(`${file}.webm`)} type="video/webm" />
  </>;
}

const projects: Project[] = [
  {
    id: "kayan",
    name: "Huay Pu Keng",
    people: "Kayan communities",
    place: "Mae Hong Son, Thailand",
    summary:
      "Working with Kayan communities to shape tourism around local stories, skills and priorities.",
    image:
      "https://static.wixstatic.com/media/6b7109_89ee7f707f214a2185f3575a32d450c5~mv2.jpg/v1/fill/w_1000,h_720,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a%20person%20who%20is%20creating%20an%20report%20in%20the%20village%20of%20Kayan%2C%20Thailand.jpg",
    focus: ["Community ownership", "Cultural exchange", "Fair benefit sharing"],
    challenge:
      "Tourism in Huay Pu Keng has not always created meaningful interaction or fair local benefit. The community wants to share its living culture on its own terms.",
    approach:
      "The work starts with listening and community consultation, then builds practical skills and connects locally led experiences with responsible tourism partners.",
    quote:
      "I am proud of my culture and happy to be leading and owning community-based experiences.",
    video: {
      file: "project-thailand",
      caption:
        "Film from the current Thailand project page. It is a general travel montage, including temples that appear to be outside Thailand, and is not footage of Huay Pu Keng. Replace it with community-approved footage before publishing.",
    },
  },
  {
    id: "maasai",
    name: "Manyatta communities",
    people: "Maasai communities",
    place: "Kenya",
    summary:
      "Listening to local priorities and strengthening fair, community-led tourism partnerships.",
    image:
      "https://static.wixstatic.com/media/11062b_9fe6ab46ac6e4c478b45449f5a66848c~mv2.jpg/v1/fill/w_1000,h_720,fp_0.83_0.75,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_9fe6ab46ac6e4c478b45449f5a66848c~mv2.jpg",
    focus: ["Fair partnerships", "Women's participation", "Land and culture"],
    challenge:
      "Communities face economic exclusion and cultural exploitation in tourism. Local voices need a stronger role in decisions and in how benefits are shared.",
    approach:
      "Participatory interviews and community mapping help identify local priorities before partners explore capacity building, market access and fair benefit sharing.",
    quote:
      "We can be involved in the decision-making process with other stakeholders.",
    video: {
      file: "project-kenya",
      caption:
        "Film from the current Kenya project page. Confirm where it was filmed, who appears in it and that they agreed to its use before publishing.",
    },
  },
  {
    id: "sasak",
    name: "Sasak community tourism",
    people: "Sasak communities",
    place: "Lombok, Indonesia",
    summary:
      "Supporting tourism that celebrates Sasak culture and creates opportunities shaped by local people.",
    image:
      "https://static.wixstatic.com/media/6b7109_3b54f322b03a46a796e7d675fafae964~mv2.jpg/v1/fill/w_900,h_720,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/SasakPeople_edited.jpg",
    focus: ["Local livelihoods", "Cultural continuity", "Community-led experiences"],
    challenge:
      "Local communities want tourism to create lasting opportunities while protecting the culture and traditions that make each place distinct.",
    approach:
      "Fair Tourism works with local partners to understand needs, build capacity and connect community-designed experiences with responsible visitors and operators.",
    quote:
      "Encounters can be a source of improvement for us and knowledge for tourists.",
  },
];

const services = [
  {
    id: "needs-assessment",
    number: "01",
    name: "Community needs assessment",
    subtitle: "Start by listening",
    text: "Understand local tourism needs, opportunities and priorities before a project takes shape.",
    image:
      "https://static.wixstatic.com/media/nsplsh_a67108c09fbc44d888177cc683f7a94c~mv2.jpg/v1/fill/w_900,h_650,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Anderson%20Schmig.jpg",
    detail:
      "We help communities and partners explore local strengths, concerns and opportunities through direct engagement, research and shared planning.",
    outcomes: ["Local priorities and opportunities", "Stakeholder connections", "A practical project roadmap"],
  },
  {
    id: "stakeholder-connection",
    number: "02",
    name: "Stakeholder connection",
    subtitle: "Build the right relationships",
    text: "Connect communities with partners who can help locally led tourism projects move forward.",
    image:
      "https://static.wixstatic.com/media/6b7109_3d73b702f6234fda8ad217c13466f300~mv2.jpeg/v1/fill/w_900,h_650,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/1516921737582.jpeg",
    detail:
      "We bring community groups, local organizations, ethical operators and other partners together to explore fair and workable collaboration.",
    outcomes: ["Relevant partner introductions", "Clearer roles and expectations", "Support for project roll-out"],
  },
  {
    id: "impact-reporting",
    number: "03",
    name: "Impact reporting",
    subtitle: "Measure what matters",
    text: "Turn project learning into transparent, credible reporting for communities and partners.",
    image:
      "https://static.wixstatic.com/media/6b7109_89ee7f707f214a2185f3575a32d450c5~mv2.jpg/v1/fill/w_900,h_650,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a%20person%20who%20is%20creating%20an%20report%20in%20the%20village%20of%20Kayan%2C%20Thailand.jpg",
    detail:
      "We support teams to define useful measures, learn from project activity and communicate results without losing sight of local context.",
    outcomes: ["Clear impact questions", "Credible project updates", "Learning for the next stage"],
  },
  {
    id: "inspire-educate",
    number: "04",
    name: "Inspire and educate",
    subtitle: "Share knowledge that travels",
    text: "Talks, guest lectures and practical sessions on community-led and responsible tourism.",
    image:
      "https://static.wixstatic.com/media/6b7109_54627a25f54c4e809ce815744af76d0b~mv2.jpg/v1/fill/w_900,h_650,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_1930_edited_edited.jpg",
    detail:
      "We share lessons from community tourism through keynotes, teaching and hands-on workshops for students and professionals.",
    outcomes: ["Guest lectures", "Practical workshops", "Responsible tourism learning"],
  },
];

const articles = siteArticles;

const externalReports = [
  { id: "tourlink-impact-sheet", category: "Reports & publications", title: "TOURLINK official impact sheet", summary: "SWITCH-Asia summary of TOURLINK results: economic, environmental, social, climate, green finance, policy and Europe–Asia cooperation.", image: researchProjects[0].image, read: "PDF · SWITCH-Asia", href: "https://www.switch-asia.eu/site/assets/files/4288/tourlink.pdf" },
  { id: "tourlink-operator-needs", category: "Reports & publications", title: "Thai tour operators' needs for added value in communities", summary: "Final TOURLINK research on what tour operators need to offer responsible, added-value community experiences.", image: projects[0].image, read: "Google Drive · confirm access", href: "https://drive.google.com/file/d/1GLYeRJOZrrhgMylNeEfRofSPgScNWigJ/view?usp=drive_link" },
  { id: "tourlink-human-rights-folder", category: "Reports & publications", title: "Human rights in Thai village tourism & 30 community experiences", summary: "TOURLINK research on human rights issues and solutions, and a guide to 30 inspiring community tourism experiences around Thailand.", image: siteArticles[siteArticles.length - 1].image, read: "Google Drive · confirm access", href: "https://drive.google.com/drive/u/0/folders/1cGNhC8eQQ0jKsX8Cwx95g1_sm2RuqPE9" },
];

const resourceCategories = ["Indigenous communities", "Community Tourism 101", "Blog", "Reports & publications"];
const sampleImages = [projects[0].image, projects[1].image, projects[2].image, services[2].image];
const sampleResources = Array.from({ length: 100 - siteArticles.length - externalReports.length }, (_, index) => {
  const number = index + siteArticles.length + externalReports.length + 1;
  return {
    id: `sample-resource-${String(number).padStart(3, "0")}`,
    category: resourceCategories[index % resourceCategories.length],
    title: `Sample resource ${String(number).padStart(3, "0")}`,
    summary: "Demo placeholder only. Replace with an approved story, guide or publication before publishing.",
    image: sampleImages[index % sampleImages.length],
    read: "Demo entry",
    sample: true as const,
  };
});

type ResourceItem = Article | (typeof externalReports)[number] | (typeof sampleResources)[number];
const allResources: ResourceItem[] = [...articles, ...externalReports, ...sampleResources];

const brochureResource = {
  title: "Fair Tourism brochure",
  summary: "A two-page introduction to the Foundation's mission, vision, community tourism approach and selected examples of its work.",
  href: "https://www.fairtourism.nl/_files/ugd/883afb_bbe1590200d545829458458f2cf4e800.pdf",
  dateNote: "Publication date to confirm",
};

// Team and partners as listed on the current fairtourism.nl About and Resources pages; confirm before publishing.
const teamMembers = [
  { name: "Charlotte Louwman-Vogels", role: "CEO & Founder", photo: "charlotte-louwman-vogels.jpg" },
  { name: "Andrea Cristofori", role: "Project Lead · Indonesia", photo: "andrea-cristofori.jpg" },
  { name: "Kim de Leeuw", role: "Project Officer · Thailand", photo: "kim-de-leeuw.jpg" },
  { name: "Kim Ross", role: "Project Lead · Kenya", photo: "kim-ross.jpg" },
  { name: "Iiris Hämäläinen", role: "Researcher · Indonesia", photo: "iiris-hamalainen.jpg" },
  { name: "Madeline Hubbl", role: "Operation Manager", photo: "" },
  { name: "Pushpita Dhar", role: "Marketing Lead", photo: "" },
];

const partners = [
  { name: "Leiden University", type: "Academic partner", logo: "leiden-university.png" },
  { name: "Politeknik Pariwisata Lombok", type: "Academic partner", logo: "poltekpar-lombok.png" },
  { name: "NHL Stenden University of Applied Sciences", type: "Academic partner", logo: "nhl-stenden.jpg" },
  { name: "Crooked Trails", type: "Tourism partner", logo: "crooked-trails.webp" },
  { name: "Sustainable Travel & Tourism Africa", type: "Tourism partner", logo: "stta.jpg" },
  { name: "EXO Foundation", type: "Tourism partner", logo: "exo-foundation.svg" },
];

const methods = [
  { title: "Consider", text: "Understand local priorities through research, partnerships and direct contact with communities." },
  { title: "Conceive", text: "Co-design tourism experiences that respond to community members' cultural and financial needs." },
  { title: "Craft", text: "Build skills and shape experiences with practical training and support within the community." },
  { title: "Connect", text: "Link community tourism initiatives with NGOs and ethical tourism operators." },
  { title: "Conserve", text: "Learn together, track impact and sustain collaboration with communities and partners." },
];

const impactFigures = [
  { value: "5", label: "Sasak villages", group: "Community participation", detail: "Involved in community tourism in Lombok, Indonesia." },
  { value: "29", label: "student researchers", group: "Research & learning", detail: "Involved in needs assessment and project evaluation." },
  { value: "3", label: "academic articles", group: "Research & learning", detail: "Reported as published in academic journals." },
  { value: "200+", label: "lectures and trainings", group: "Research & learning", detail: "Delivered for universities and companies." },
  { value: "4", label: "Maasai partnerships", group: "Partnerships & market", detail: "Partnerships recorded with Maasai communities in Kenya." },
  { value: "25", label: "tour operators", group: "Partnerships & market", detail: "Destination management companies reported to offer Huay Pu Keng experiences." },
  { value: "2", label: "best-practice awards", group: "Recognition & support", detail: "The overview names Green Destinations Best Practice 2023." },
  { value: "€1,000", label: "raised for a weaving center", group: "Recognition & support", detail: "Fundraising reported for a Sasak community weaving center." },
];

const impactGroupDescriptions = [
  { name: "Community participation", description: "Examples of community involvement in local tourism activity." },
  { name: "Research & learning", description: "Research, education and knowledge-sharing activity." },
  { name: "Partnerships & market", description: "Connections between communities and tourism partners." },
  { name: "Recognition & support", description: "Recognition and fundraising reported in the overview." },
];

const navItems: { page: Page; label: string }[] = [
  { page: "about", label: "About" },
  { page: "services", label: "What we do" },
  { page: "work", label: "Our work" },
  { page: "impact", label: "Our impact" },
  { page: "resources", label: "Resources" },
];

// Content blocks that float in as they scroll into view, echoing the current site's Wix "floatIn" motion.
const revealSelector = [
  ".ft-page-intro .ft-container > *",
  ".ft-home-intro > *",
  ".ft-section-heading",
  ".ft-intent-links > *",
  ".ft-method-section > *",
  ".ft-project-card",
  ".ft-article-card",
  ".ft-impact-inner > div",
  ".ft-support-image",
  ".ft-support-copy",
  ".ft-partner-content",
  ".ft-about-photo",
  ".ft-about-statement",
  ".ft-mission-grid > *",
  ".ft-timeline > *",
  ".ft-service-row",
  ".ft-service-detail > *",
  ".ft-impact-intro > *",
  ".ft-impact-group",
  ".ft-sdg-list > *",
  ".ft-project-facts > *",
  ".ft-story-section > *",
  ".ft-project-approach-grid > *",
  ".ft-project-film figure",
  ".ft-quote-section",
  ".ft-featured-brochure",
  ".ft-donate-uses > li",
  ".ft-partner-types article",
  ".ft-callout .ft-container",
  ".ft-story-copy",
  ".ft-team-card",
  ".ft-partner-logos li",
  ".ft-quick-facts > div",
  ".ft-project-lists > div",
  ".ft-goal-list li",
  ".ft-research-blocks > div",
  ".ft-report-links li",
  ".ft-expect-list li",
  ".ft-volunteer-grid > *",
].join(",");

function useScrollReveal(rootRef: { current: HTMLElement | null }, active: unknown) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("ft-motion");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Blocks already scrolled past (restored scroll position, jumps) appear without motion.
        if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
          entry.target.classList.add("is-revealed", "is-instant");
          observer.unobserve(entry.target);
        }
      });
      entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
        const element = entry.target as HTMLElement;
        element.style.transitionDelay = `${Math.min(index, 5) * 80}ms`;
        element.addEventListener("transitionend", () => { element.style.transitionDelay = ""; }, { once: true });
        element.classList.add("is-revealed");
        observer.unobserve(element);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    const tracked = new WeakSet<Element>();
    const scan = () => root.querySelectorAll<HTMLElement>(revealSelector).forEach((element) => {
      if (tracked.has(element)) return;
      tracked.add(element);
      element.dataset.reveal = "";
      observer.observe(element);
    });
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(root, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      observer.disconnect();
      root.classList.remove("ft-motion");
      root.querySelectorAll("[data-reveal]:not(.is-revealed)").forEach((element) => element.removeAttribute("data-reveal"));
    };
  }, [rootRef, active]);
}

function readPreviewMode(): PreviewMode {
  const view = new URLSearchParams(window.location.search).get("view");
  return view === "web" || view === "mobile" || view === "site" || view === "system" ? view : "chooser";
}

function routeFromHash(): { page: Page; id: string } {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [route, id] = parts;
  if (route === "work" && id) return { page: "project", id };
  if (route === "resources" && id) return { page: "article", id };
  if (route === "what-we-do" && id) return { page: "service", id };
  if (route === "what-we-do") return { page: "services", id: "" };
  const page = route as Page;
  const allowed: Page[] = ["home", "about", "services", "work", "impact", "resources", "donate", "contact"];
  return { page: allowed.includes(page) ? page : "home", id: "" };
}

function App() {
  const initialRoute = routeFromHash();
  const [previewMode, setPreviewMode] = useState<PreviewMode>(readPreviewMode);
  const [page, setPage] = useState<Page>(initialRoute.page);
  const [selectedId, setSelectedId] = useState(initialRoute.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMethod, setActiveMethod] = useState(0);
  const [resourceCategory, setResourceCategory] = useState("All topics");
  const [resourceQuery, setResourceQuery] = useState("");
  const [donationAmount, setDonationAmount] = useState("50");
  const [customAmount, setCustomAmount] = useState("");
  const [donationFrequency, setDonationFrequency] = useState("Once");
  const [donationNotice, setDonationNotice] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const siteRef = useRef<HTMLDivElement>(null);
  useScrollReveal(siteRef, previewMode);

  useEffect(() => {
    const handleHistory = () => {
      const route = routeFromHash();
      setPage(route.page);
      setSelectedId(route.id);
      setMenuOpen(false);
      setPreviewMode(readPreviewMode());
    };
    window.addEventListener("popstate", handleHistory);
    return () => window.removeEventListener("popstate", handleHistory);
  }, []);

  function navigate(nextPage: Page, id = "") {
    const path = nextPage === "home"
      ? "#/"
      : nextPage === "project"
        ? `#/work/${id}`
        : nextPage === "article"
          ? `#/resources/${id}`
          : nextPage === "service"
            ? `#/what-we-do/${id}`
            : `#/${nextPage === "services" ? "what-we-do" : nextPage}`;
    window.history.pushState({}, "", path);
    setPage(nextPage);
    setSelectedId(id);
    setMenuOpen(false);
    setDonationNotice(false);
    setContactSent(false);
    setNewsletterSent(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changePreviewMode(mode: PreviewMode) {
    if (mode === "chooser") {
      window.history.pushState({}, "", window.location.pathname);
      setPage("home");
      setSelectedId("");
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set("view", mode);
      const search = `?${params.toString()}`;
      window.history.pushState({}, "", `${window.location.pathname}${search}${window.location.hash || "#/"}`);
    }
    setPreviewMode(mode);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentProject = projects.find((project) => project.id === selectedId) ?? projects[0];
  const currentService = services.find((service) => service.id === selectedId) ?? services[0];
  const currentArticle = articles.find((article) => article.id === selectedId) ?? articles[0];
  const currentResearch = researchProjects.find((project) => project.id === selectedId);
  const activeNav = page === "project" ? "work" : page === "article" ? "resources" : page === "service" ? "services" : page;

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactSent(true);
  }

  function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterSent(true);
  }

  if (previewMode === "chooser") {
    return <PreviewChooser onSelect={changePreviewMode} />;
  }

  if (previewMode === "system") {
    return <UiSystemPage onBack={() => changePreviewMode("chooser")} />;
  }

  const isMobilePreview = previewMode === "mobile";
  const isEmbeddedSite = previewMode === "site";

  return (
    <div className={isEmbeddedSite ? "" : `ft-preview-root ${isMobilePreview ? "ft-preview-root-mobile" : "ft-preview-root-web"}`}>
      {!isEmbeddedSite && <PreviewToolbar mode={previewMode as "web" | "mobile"} onSelect={changePreviewMode} />}
      {isMobilePreview ? (
        <div className="ft-preview-device ft-preview-device-mobile">
          <div className="ft-device-status"><span>9:41</span><span>● ● ●</span></div>
          <iframe className="ft-mobile-frame" title="Fair Tourism mobile website preview" allow="autoplay; fullscreen" src={`${window.location.pathname}?view=site${window.location.hash || "#/"}`} />
        </div>
      ) : (
        <div className={isEmbeddedSite ? "" : "ft-preview-device ft-preview-device-web"}>
          <div className={isEmbeddedSite ? "" : "ft-preview-viewport"}>
    <div className="ft-site" ref={siteRef}>
      <p className="ft-prototype-badge">Prototype · not the official Fair Tourism website</p>
      <header className="ft-header">
        <div className="ft-header-inner">
          <a className="ft-wordmark" href="#/" onClick={(event) => { event.preventDefault(); navigate("home"); }} aria-label="Fair Tourism home">
            <span className="ft-mark" aria-hidden="true">F</span>
            <span>Fair<span className="ft-wordmark-accent">Tourism</span></span>
          </a>
          <button className="ft-menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
          <nav className={`ft-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
            {navItems.map((item) => <a key={item.page} className={activeNav === item.page ? "is-active" : ""} href={`#/${item.page === "services" ? "what-we-do" : item.page}`} onClick={(event) => { event.preventDefault(); navigate(item.page); }}>{item.label}</a>)}
            <a className="ft-mobile-partner" href="#/contact" onClick={(event) => { event.preventDefault(); navigate("contact"); }}>Partner with us</a>
            <a className="ft-mobile-donate" href="#/donate" onClick={(event) => { event.preventDefault(); navigate("donate"); }}>Donate now <span aria-hidden="true">↗</span></a>
          </nav>
          <div className="ft-header-actions">
            <button className={`ft-button ft-button-outline ft-button-small${activeNav === "contact" ? " is-current" : ""}`} type="button" aria-current={activeNav === "contact" ? "page" : undefined} onClick={() => navigate("contact")}>Partner with us</button>
            <button className="ft-button ft-button-coral ft-button-small" type="button" onClick={() => navigate("donate")}>Donate now <span aria-hidden="true">↗</span></button>
          </div>
        </div>
      </header>

      <main key={`${page}-${selectedId}`} className="ft-main">
        {page === "home" && <HomePage navigate={navigate} activeMethod={activeMethod} setActiveMethod={setActiveMethod} />}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "services" && <ServicesPage navigate={navigate} />}
        {page === "service" && <ServicePage service={currentService} navigate={navigate} />}
        {page === "work" && <WorkPage navigate={navigate} />}
        {page === "project" && (currentResearch ? <ResearchPage project={currentResearch} navigate={navigate} /> : <ProjectPage project={currentProject} navigate={navigate} />)}
        {page === "impact" && <ImpactPage navigate={navigate} />}
        {page === "resources" && <ResourcesPage navigate={navigate} category={resourceCategory} setCategory={setResourceCategory} query={resourceQuery} setQuery={setResourceQuery} />}
        {page === "article" && <ArticlePage article={currentArticle} navigate={navigate} />}
        {page === "donate" && <DonatePage amount={donationAmount} setAmount={setDonationAmount} customAmount={customAmount} setCustomAmount={setCustomAmount} frequency={donationFrequency} setFrequency={setDonationFrequency} onDonate={() => setDonationNotice(true)} />}
        {page === "contact" && <ContactPage sent={contactSent} onSubmit={submitContact} topic={selectedId} />}
      </main>

      <Footer navigate={navigate} onNewsletter={submitNewsletter} newsletterSent={newsletterSent} />
      {donationNotice && <div className="ft-modal-backdrop" role="presentation" onClick={() => setDonationNotice(false)}><section className="ft-modal" role="dialog" aria-modal="true" aria-labelledby="donation-dialog-title" onClick={(event) => event.stopPropagation()}><button className="ft-modal-close" type="button" aria-label="Close" onClick={() => setDonationNotice(false)}>×</button><span className="ft-eyebrow">PROTOTYPE CHECKOUT</span><h2 id="donation-dialog-title">Your support matters.</h2><p>This is an interactive concept only. No payment has been taken and no personal data has been sent. The live site should connect this step to its approved secure donation provider.</p><button className="ft-button ft-button-dark" type="button" onClick={() => setDonationNotice(false)}>Back to the page</button></section></div>}
    </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewChooser({ onSelect }: { onSelect: (mode: PreviewMode) => void }) {
  return <main className="ft-preview-chooser">
    <div className="ft-chooser-top"><a className="ft-wordmark" href="#" onClick={(event) => event.preventDefault()}><span className="ft-mark" aria-hidden="true">F</span><span>Fair<span className="ft-wordmark-accent">Tourism</span></span></a><span>Interactive website prototype</span></div>
    <section className="ft-chooser-content"><p className="ft-eyebrow">Choose a preview</p><h1>One experience.<br /><em>Two ways to explore.</em></h1><p className="ft-chooser-intro">Open the website as a full browser page or explore the same pages inside a mobile-sized preview.</p>
      <div className="ft-entry-grid">
        <button className="ft-entry-card ft-entry-card-web" type="button" onClick={() => onSelect("web")}><span className="ft-entry-overline">01 / WIDE SCREEN</span><span className="ft-web-illustration" aria-hidden="true"><i /><i /><i /><b /><b /><b /></span><strong>Web page</strong><span className="ft-entry-description">See the full desktop website layout with room for wide imagery and multi-column sections.</span><span className="ft-entry-action">Open web preview <i aria-hidden="true">↗</i></span></button>
        <button className="ft-entry-card ft-entry-card-mobile" type="button" onClick={() => onSelect("mobile")}><span className="ft-entry-overline">02 / PHONE SCREEN</span><span className="ft-phone-illustration" aria-hidden="true"><i /><b /><b /><b /></span><strong>Mobile page</strong><span className="ft-entry-description">Explore the responsive mobile version in a centered 390 px device frame.</span><span className="ft-entry-action">Open mobile preview <i aria-hidden="true">↗</i></span></button>
        <button className="ft-entry-card ft-entry-card-system" type="button" onClick={() => onSelect("system")}><span className="ft-entry-overline">03 / DESIGN RULES</span><span className="ft-system-illustration" aria-hidden="true"><i /><i /><i /><b /><b /><b /><em /></span><strong>UI system</strong><span className="ft-entry-description">Explore the brand colors, typography, spacing, buttons and responsive rules for Web and Mobile.</span><span className="ft-entry-action">View UI system <i aria-hidden="true">↗</i></span></button>
      </div>
      <p className="ft-prototype-note">Prototype only. Donation and contact interactions are demonstrations; no payment or personal information is sent.</p>
    </section>
    <footer className="ft-chooser-footer"><span>FAIR TOURISM FOUNDATION</span><a href="https://www.fairtourism.nl" target="_blank" rel="noreferrer">Visit current website ↗</a></footer>
  </main>;
}

// Auto-hides on pointer devices so the prototype can be presented without chrome; touch devices keep it visible via CSS.
function PreviewToolbar({ mode, onSelect }: { mode: "web" | "mobile"; onSelect: (mode: PreviewMode) => void }) {
  const [revealed, setRevealed] = useState(true);
  const hideTimer = useRef<number | undefined>(undefined);

  function show() {
    window.clearTimeout(hideTimer.current);
    setRevealed(true);
  }

  function scheduleHide(delay = 600) {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setRevealed(false), delay);
  }

  useEffect(() => {
    hideTimer.current = window.setTimeout(() => setRevealed(false), 2200);
    return () => window.clearTimeout(hideTimer.current);
  }, []);

  return <>
    <div className="ft-preview-hotzone" aria-hidden="true" onMouseEnter={show} onMouseLeave={() => scheduleHide()} />
    <div className={`ft-preview-toolbar${revealed ? " is-revealed" : ""}`} onMouseEnter={show} onMouseLeave={(event) => { if (!event.currentTarget.querySelector(":focus-visible")) scheduleHide(); }} onFocus={show} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) scheduleHide(); }}><button type="button" onClick={() => onSelect("chooser")}><span aria-hidden="true">←</span> All previews</button><span>{mode === "web" ? "Web page preview" : "Mobile page preview · 390 px"}</span><div><button className={mode === "web" ? "is-active" : ""} type="button" onClick={() => onSelect("web")}>Web</button><button className={mode === "mobile" ? "is-active" : ""} type="button" onClick={() => onSelect("mobile")}>Mobile</button></div></div>
  </>;
}

function UiSystemPage({ onBack }: { onBack: () => void }) {
  const [device, setDevice] = useState<"web" | "mobile">("web");
  const [copiedColor, setCopiedColor] = useState("");
  const isMobile = device === "mobile";
  const colors = [
    { name: "Brand teal", value: "#327B7F", usage: "Navigation, secondary actions, links" },
    { name: "Action coral", value: "#F16A6D", usage: "Donations and primary actions" },
    { name: "Body charcoal", value: "#242323", usage: "Body copy and headings" },
    { name: "Soft aqua", value: "#AFDCDF", usage: "Soft emphasis surfaces" },
    { name: "Light grey", value: "#F6F6F6", usage: "Secondary section backgrounds" },
    { name: "White", value: "#FFFFFF", usage: "Main surfaces and reversed text" },
  ];
  const typeSizes = isMobile
    ? [
        { label: "Hero heading", size: "30 px", sample: "Community-led tourism" },
        { label: "Section heading", size: "25 px", sample: "Communities shape what comes next" },
        { label: "Card heading", size: "18 px", sample: "Huay Pu Keng project" },
        { label: "Body copy", size: "16 px", sample: "We work alongside communities to shape tourism around local priorities." },
        { label: "Supporting text", size: "13 px", sample: "Thailand · Updated 2025" },
      ]
    : [
        { label: "Hero heading", size: "49 px", sample: "Community-led tourism" },
        { label: "Section heading", size: "35 px", sample: "Communities shape what comes next" },
        { label: "Card heading", size: "17 px", sample: "Huay Pu Keng project" },
        { label: "Body copy", size: "18 px", sample: "We work alongside communities to shape tourism around local priorities." },
        { label: "Supporting text", size: "14 px", sample: "Thailand · Updated 2025" },
      ];

  async function copyColor(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard access may be unavailable in an embedded preview.
    }
    setCopiedColor(value);
    window.setTimeout(() => setCopiedColor(""), 1500);
  }

  return (
    <main className={`ft-system-page ${isMobile ? "is-mobile" : "is-web"}`}>
      <header className="ft-system-header">
        <button className="ft-system-back" type="button" onClick={onBack}>
          ← <span>Back to previews</span>
        </button>
        <a className="ft-wordmark" href="#ui-system" onClick={(event) => event.preventDefault()}>
          <span className="ft-mark" aria-hidden="true">F</span>
          <span>Fair<span className="ft-wordmark-accent">Tourism</span></span>
        </a>
        <div className="ft-system-toggle" role="group" aria-label="Choose design system viewport">
          <button type="button" aria-pressed={!isMobile} className={!isMobile ? "is-active" : ""} onClick={() => setDevice("web")}>Web</button>
          <button type="button" aria-pressed={isMobile} className={isMobile ? "is-active" : ""} onClick={() => setDevice("mobile")}>Mobile</button>
        </div>
      </header>
      <div className="ft-system-layout">
        <aside className="ft-system-sidebar">
          <span className="ft-system-sidebar-title">UI SYSTEM</span>
          <a href="#identity">Brand basics</a>
          <a href="#colors">Colors</a>
          <a href="#typography">Typography</a>
          <a href="#spacing">Spacing</a>
          <a href="#components">Components</a>
          <a href="#responsive">Responsive rules</a>
          <div className="ft-system-sidebar-note"><span className="ft-swatch-mini" />Based on the current site<br />Mobile values are adaptation guidelines</div>
        </aside>
        <div className={`ft-system-content ${isMobile ? "ft-system-content-mobile" : ""}`}>
          <section className="ft-system-intro" id="identity">
            <p className="ft-system-eyebrow">FAIR TOURISM · DESIGN SYSTEM</p>
            <div className="ft-system-title-row">
              <div>
                <h1>One system.<br /><em>Every screen.</em></h1>
                <p>Built around the original teal, coral and Poppins identity. Shared rules for Web and Mobile colors, type, spacing and components.</p>
              </div>
              <div className="ft-system-meta">
                <span>{isMobile ? "MOBILE WEB" : "DESKTOP WEB"}</span>
                <strong>{isMobile ? "390 px" : "1440 px"}</strong>
                <small>{isMobile ? "Test between 360–430 px" : "Suggested content max: 1200 px"}</small>
              </div>
            </div>
          </section>

          <section className="ft-system-section" id="colors">
            <div className="ft-system-section-head"><div><span>01 / BRAND COLORS</span><h2>Color palette</h2></div><p>Select a swatch to copy its HEX value</p></div>
            <div className="ft-system-colors">{colors.map((color) => <button className="ft-system-color" type="button" key={color.value} onClick={() => copyColor(color.value)} aria-label={`Copy ${color.name} ${color.value}`}><span className="ft-system-color-swatch" style={{ background: color.value }} /><span className="ft-system-color-info"><strong>{copiedColor === color.value ? "Copied" : color.name}</strong><code>{color.value}</code><small>{color.usage}</small></span></button>)}</div>
          </section>

          <section className="ft-system-section" id="typography">
            <div className="ft-system-section-head"><div><span>02 / TYPE SCALE</span><h2>Typography</h2></div><p>Poppins · 0 letter spacing · comfortable line height</p></div>
            <div className="ft-system-type-preview">{typeSizes.map((type, index) => <div className="ft-system-type-row" key={type.label}><span className="ft-system-type-meta"><strong>{type.label}</strong><code>{type.size}</code></span><p className={`ft-system-sample type-${index}`}>{type.sample}</p></div>)}</div>
            <div className="ft-system-type-rules"><span><strong>Brand typeface</strong>Poppins</span><span><strong>Fallback</strong>Nunito Sans / sans-serif</span><span><strong>Default tracking</strong>0</span><span><strong>Body line height</strong>1.6–1.75</span></div>
          </section>

          <section className="ft-system-section" id="spacing">
            <div className="ft-system-section-head"><div><span>03 / SPACING</span><h2>Spacing scale</h2></div><p>Use shared steps instead of one-off values</p></div>
            <div className="ft-system-space-grid">{[{ name: "XS", value: 4 }, { name: "S", value: 8 }, { name: "M", value: 16 }, { name: "L", value: 24 }, { name: "XL", value: 32 }, { name: "2XL", value: isMobile ? 48 : 64 }].map((space) => <div className="ft-system-space-token" key={space.name}><div className="ft-space-bar" style={{ width: `${Math.min(space.value * (isMobile ? 1.25 : 1.5), 96)}px` }} /><strong>{space.name}</strong><code>{space.value}px</code></div>)}</div>
            <div className="ft-system-paragraph-demo"><span>PARAGRAPH SPACING</span><div><p>Fair Tourism works alongside communities to shape tourism around local priorities.</p><p>Separate paragraphs by 16px on Mobile and 20–24px on Web. Keep line length comfortable for reading.</p></div><strong>{isMobile ? "16 px" : "24 px"}</strong></div>
          </section>

          <section className="ft-system-section" id="components">
            <div className="ft-system-section-head"><div><span>04 / COMPONENTS</span><h2>Interface components</h2></div><p>Pill-shaped brand buttons with clear touch targets</p></div>
            <div className="ft-system-component-grid">
              <div className="ft-system-component"><span className="ft-system-component-label">PRIMARY ACTION</span><button className="ft-system-button coral" type="button">Support our work <i>↗</i></button><code>Coral · 999px radius · {isMobile ? "44" : "48"}px height</code></div>
              <div className="ft-system-component"><span className="ft-system-component-label">SECONDARY ACTION</span><button className="ft-system-button outline" type="button">Partner with us</button><code>Teal outline · fills on hover · {isMobile ? "44" : "48"}px height</code></div>
              <div className="ft-system-component"><span className="ft-system-component-label">TEXT LINK</span><button className="ft-system-text-link" type="button">Explore our work <i>↗</i></button><code>Teal text · Visible keyboard focus</code></div>
              <div className="ft-system-component"><span className="ft-system-component-label">FORM FIELD</span><label className="ft-system-input"><span>Email address</span><input type="email" placeholder="you@example.com" /></label><code>White fill · 1px grey border · Persistent label</code></div>
            </div>
          </section>

          <section className="ft-system-section ft-system-responsive" id="responsive">
            <div className="ft-system-section-head"><div><span>05 / RESPONSIVE RULES</span><h2>Web and Mobile</h2></div><p>One identity, rearranged for each screen</p></div>
            <div className="ft-system-breakpoints"><div><strong>Web</strong><code>≥ 1024 px</code><p>Centered content, max width 1200px. Use 2–3 columns for services and projects.</p></div><div><strong>Tablet</strong><code>761–1023 px</code><p>Tighten column gaps. Collapse navigation when needed; keep cards comfortably readable.</p></div><div><strong>Mobile</strong><code>≤ 760 px</code><p>Single-column content and collapsed navigation. Buttons at least 44px high, with 20–24px page margins.</p></div></div>
            <div className="ft-system-live-sample"><div className="ft-system-live-copy"><span>LIVE SAMPLE · {isMobile ? "MOBILE" : "WEB"}</span><h3>Tourism belongs to<br className={isMobile ? "" : "ft-hide"} /> the people who live it.</h3><p>We work alongside Indigenous communities to shape tourism on their terms.</p><div><button className="ft-system-button coral" type="button">Explore our work <i>↗</i></button><button className="ft-system-button outline" type="button">Partner with us</button></div></div><div className="ft-system-live-mark"><span>F</span></div></div>
          </section>
          <footer className="ft-system-footer"><span>FAIR TOURISM · UI SYSTEM</span><button type="button" onClick={onBack}>Back to previews ↑</button></footer>
        </div>
      </div>
    </main>
  );
}

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduceMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React sets `muted` only as a property; nested frames (the mobile preview inside VS Code's browser)
    // check the attribute before allowing autoplay.
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute("muted", "");
    if (reduceMotion) {
      video.pause();
      return;
    }
    const start = () => { video.play().catch(() => setPlaying(false)); };
    start();
    video.addEventListener("loadeddata", start, { once: true });
    return () => video.removeEventListener("loadeddata", start);
  }, [reduceMotion]);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  return <>
    <video ref={videoRef} className="ft-hero-video" poster={media("home-hero.jpg")} muted autoPlay={!reduceMotion} loop playsInline preload="auto" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}><VideoSources file="home-hero" /></video>
    <div className="ft-hero-shade" aria-hidden="true" />
    <button className="ft-hero-video-toggle" type="button" onClick={toggle} aria-label={playing ? "Pause background video" : "Play background video"}>{playing ? <span className="ft-pause-icon" aria-hidden="true" /> : <span aria-hidden="true">▶</span>}</button>
  </>;
}

function HomePage({ navigate, activeMethod, setActiveMethod }: { navigate: (page: Page, id?: string) => void; activeMethod: number; setActiveMethod: (index: number) => void }) {
  return (
    <>
      <section className="ft-hero" style={{ backgroundImage: `url(${media("home-hero.jpg")})` }}>
        <HeroVideo />
        <div className="ft-hero-inner">
          <p className="ft-eyebrow ft-eyebrow-light">Travel. Respect. Empower.</p>
          <h1>Tourism belongs to <br />the people who live it.</h1>
          <p className="ft-hero-copy">We work alongside Indigenous communities to shape tourism on their terms: rooted in local priorities, fair partnerships and living culture.</p>
          <div className="ft-button-row"><button className="ft-button ft-button-coral" type="button" onClick={() => navigate("work")}>Explore our work <span aria-hidden="true">↗</span></button><button className="ft-button ft-button-outline-light" type="button" onClick={() => navigate("donate")}>Support the work</button></div>
          <span className="ft-hero-caption">Community-led tourism · Thailand · Kenya · Indonesia</span>
        </div>
        <a className="ft-scroll-cue" href="#ft-start" aria-label="Scroll to discover">↓</a>
      </section>

      <div id="ft-start" className="ft-home-intro ft-container">
        <div><p className="ft-eyebrow">A different way to travel</p><h2>Local people should lead the tourism that happens in their home.</h2></div>
        <p>Fair Tourism brings communities, local organizations and responsible travel partners together. We listen first, build practical skills and help community-led experiences reach the people who value them.</p>
      </div>

      <section className="ft-intent-band">
        <div className="ft-container"><p className="ft-eyebrow">Start where you are</p><h2>What brings you here?</h2><div className="ft-intent-links"><button type="button" onClick={() => navigate("work")}><span>01</span><strong>Discover community projects</strong><i aria-hidden="true">↗</i></button><button type="button" onClick={() => navigate("contact")}><span>02</span><strong>Explore a partnership</strong><i aria-hidden="true">↗</i></button><button type="button" onClick={() => navigate("donate")}><span>03</span><strong>Support the work</strong><i aria-hidden="true">↗</i></button></div></div>
      </section>

      <section className="ft-method-section ft-container">
        <div className="ft-section-heading"><div><p className="ft-eyebrow">From listening to lasting change</p><h2>How we work, together.</h2></div><button className="ft-arrow-link" type="button" onClick={() => navigate("about")}>Our approach <span aria-hidden="true">↗</span></button></div>
        <div className="ft-method-tabs" role="tablist" aria-label="Five steps of community tourism">
          {methods.map((method, index) => <button key={method.title} role="tab" aria-selected={activeMethod === index} className={activeMethod === index ? "is-active" : ""} type="button" onClick={() => setActiveMethod(index)}><span>0{index + 1}</span>{method.title}</button>)}
        </div>
        <div className="ft-method-detail"><span className="ft-method-number">0{activeMethod + 1}</span><div><h3>{methods[activeMethod].title}</h3><p>{methods[activeMethod].text}</p></div><span className="ft-method-mark" aria-hidden="true">✳</span></div>
      </section>

      <section className="ft-project-section">
        <div className="ft-container"><div className="ft-section-heading"><div><p className="ft-eyebrow">Our work</p><h2>Rooted in place.<br />Led by communities.</h2></div><button className="ft-arrow-link" type="button" onClick={() => navigate("work")}>All projects <span aria-hidden="true">↗</span></button></div><div className="ft-project-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onClick={() => navigate("project", project.id)} />)}</div></div>
      </section>

      <section className="ft-impact-band"><div className="ft-container ft-impact-inner"><div><p className="ft-eyebrow ft-eyebrow-light">Progress, with context</p><h2>Change is built<br />one relationship at a time.</h2><p>Our two-page overview shares examples of the work. Figures are being checked with project teams before being presented as current results.</p><button className="ft-button ft-button-outline-light" type="button" onClick={() => navigate("impact")}>Explore our impact <span aria-hidden="true">↗</span></button></div><div className="ft-impact-numbers"><div><strong>5</strong><span>Sasak villages involved in community tourism*</span></div><div><strong>29</strong><span>student researchers in needs assessment and evaluation*</span></div><small>*Figures from the Foundation's two-pager; reporting period to be confirmed.</small></div></div></section>

      <section className="ft-support-section ft-container"><div className="ft-support-image"><img src={services[0].image} alt="Community members discussing local tourism needs" loading="lazy" /><span>Listen first. Build together.</span></div><div className="ft-support-copy"><p className="ft-eyebrow">Support community-led tourism</p><h2>Your contribution helps communities shape what comes next.</h2><p>Support can help make needs assessments, training, fair partnerships and links to the tourism market possible. We share the work and its progress with care.</p><button className="ft-button ft-button-dark" type="button" onClick={() => navigate("donate")}>See how to support <span aria-hidden="true">↗</span></button></div></section>

      <section className="ft-partner-band"><div className="ft-container"><p className="ft-eyebrow">Different strengths. Shared purpose.</p><div className="ft-partner-content"><h2>Good partnerships make community leadership possible.</h2><div><p>We collaborate with academic partners on research and learning, and with tourism partners on responsible operations, resources and market connections.</p><button className="ft-arrow-link" type="button" onClick={() => navigate("contact")}>Work with us <span aria-hidden="true">↗</span></button></div></div></div></section>

      <section className="ft-stories-section ft-container"><div className="ft-section-heading"><div><p className="ft-eyebrow">Field notes</p><h2>Stories that open a window.</h2></div><button className="ft-arrow-link" type="button" onClick={() => navigate("resources")}>All stories <span aria-hidden="true">↗</span></button></div><div className="ft-story-grid">{articles.slice(0, 3).map((article) => <ArticleCard key={article.id} article={article} onClick={() => navigate("article", article.id)} />)}</div></section>
    </>
  );
}

function AboutPage({ navigate }: { navigate: (page: Page, id?: string) => void }) {
  return <>
    <PageIntro eyebrow="About Fair Tourism" title={<>Tourism can be a force<br />for community leadership.</>} text="We are a non-profit organization working with Indigenous communities to shape fair, responsible and regenerative tourism." />
    <section className="ft-about-feature ft-container"><div className="ft-about-photo"><img src={projects[0].image} alt="Community members sharing knowledge during a tourism project" /></div><div className="ft-about-statement"><p className="ft-eyebrow">Our vision</p><h2>Indigenous communities recognized as leaders in regenerative tourism.</h2><p>We envision equitable opportunities, the safeguarding of natural and cultural heritage, and the ability of communities to thrive.</p></div></section>
    <section className="ft-mission-section"><div className="ft-container ft-mission-grid"><p className="ft-eyebrow">Our mission</p><div><h2>Strengthen community tourism by building skills and co-creating initiatives around local priorities.</h2><p>We collaborate with local organizations, governments and academic partners to support tourism that reflects community priorities, protects natural and cultural heritage, and contributes to regenerative local development.</p><button className="ft-arrow-link" type="button" onClick={() => navigate("services")}>What we do <span aria-hidden="true">↗</span></button></div></div></section>
    <section className="ft-timeline-section ft-container"><div className="ft-section-heading"><div><p className="ft-eyebrow">Our story</p><h2>Working toward community ownership.</h2></div></div><div className="ft-story-copy"><p>Fair Tourism was founded on the belief that travel can create positive change when done responsibly. We work to promote fair, inclusive and regenerative tourism through research, education and collaboration.</p><p>Our current focus is on developing community tourism projects in <button className="ft-inline-link" type="button" onClick={() => navigate("project", "kayan")}>Thailand</button>, <button className="ft-inline-link" type="button" onClick={() => navigate("project", "maasai")}>Kenya</button> and <button className="ft-inline-link" type="button" onClick={() => navigate("project", "sasak")}>Indonesia</button>, where we support Indigenous people in shaping tourism that benefits both people and nature.</p><p>Fair Tourism continues to grow as a platform for sharing knowledge, building partnerships and inspiring a more responsible way to travel.</p></div><div className="ft-timeline"><article><strong>1989</strong><p>Fair Tourism begins as a non-profit organization promoting sustainable, ethical and responsible tourism.</p></article><article><strong>2013</strong><p>The organization takes an active role in fostering community ownership of tourism experiences.</p></article><article><strong>Today</strong><p>Working alongside Kayan, Maasai and Sasak communities and a wider network of partners.</p></article></div><p className="ft-source-note">Timeline wording is based on the Foundation's two-pager and should be confirmed before publication.</p></section>
    <section className="ft-team-section ft-container"><div className="ft-section-heading"><div><p className="ft-eyebrow">Our team</p><h2>The people behind the work.</h2></div><p>Our team is united by the belief that Indigenous culture should remain celebrated and visible. We support one another, stay aligned with our purpose and focus on work that carries meaning and impact.</p></div><div className="ft-team-grid">{teamMembers.map((member) => <article className="ft-team-card" key={member.name}>{member.photo ? <img src={media(`team/${member.photo}`)} alt={member.name} loading="lazy" /> : <span className="ft-team-initials" aria-hidden="true">{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>}<h3>{member.name}</h3><p>{member.role}</p></article>)}</div><p className="ft-source-note">Team members and roles as listed on the current website. Confirm the current team and photo permissions before publication.</p></section>
    <section className="ft-volunteer-section"><div className="ft-container ft-volunteer-grid"><div><p className="ft-eyebrow">Volunteer with us</p><h2>Find your place in the team.</h2><p>Volunteers are at the heart of everything we do. Whether you're passionate about sustainable development, education, storytelling, people or research, there's a place for you here.</p><p>Help communities build thriving tourism ecosystems, design workshops and learning resources, shape our digital presence, support our people through HR, or explore research topics that matter to you with guidance from fellow researchers.</p><button className="ft-button ft-button-dark" type="button" onClick={() => navigate("contact", "volunteer")}>Apply to volunteer <span aria-hidden="true">↗</span></button></div><figure className="ft-volunteer-quote"><blockquote>“As a volunteer for Fair Tourism it is great to work with a lot of different people and organisations together. I really like to make a difference concerning community-based tourism.”</blockquote><figcaption>A Fair Tourism volunteer · name and consent to confirm</figcaption></figure></div></section>
    <section className="ft-team-strip"><div className="ft-container"><div><p className="ft-eyebrow ft-eyebrow-light">Have a community in mind?</p><h2>Bring your idea to life,<br />together.</h2></div><div><p>Fair Tourism provides guidance and practical advice to help develop successful community tourism projects. Do you have an Indigenous community in mind and are ready to bring your idea to life?</p><button className="ft-button ft-button-outline-light" type="button" onClick={() => navigate("contact")}>Reach out to us <span aria-hidden="true">↗</span></button></div></div></section>
  </>;
}

function ServicesPage({ navigate }: { navigate: (page: Page, id?: string) => void }) {
  return <>
    <PageIntro eyebrow="What we do" title={<>Practical support.<br />Designed around local priorities.</>} text="From the first community conversation to learning from a project, we help people and partners build tourism in a fairer way." />
    <section className="ft-services-list ft-container">{services.map((service) => <button className="ft-service-row" key={service.id} type="button" onClick={() => navigate("service", service.id)}><span className="ft-service-number">{service.number}</span><span className="ft-service-photo"><img src={service.image} alt="" loading="lazy" /></span><span className="ft-service-copy"><small>{service.subtitle}</small><strong>{service.name}</strong><span>{service.text}</span></span><span className="ft-row-arrow" aria-hidden="true">↗</span></button>)}</section>
    <Callout navigate={navigate} eyebrow="A shared starting point" title="Every project begins with listening." text="Our five-step approach helps communities and partners move from local priorities toward community-led experiences and lasting collaboration." action="See how we work" onClick={() => navigate("about")} />
  </>;
}

function ServicePage({ service, navigate }: { service: (typeof services)[number]; navigate: (page: Page, id?: string) => void }) {
  return <>
    <PageIntro eyebrow={`What we do / ${service.subtitle}`} title={<>{service.name}.</>} text={service.text} />
    <section className="ft-service-detail ft-container"><div className="ft-detail-image"><img src={service.image} alt="" /></div><div><p className="ft-eyebrow">What you can expect</p><h2>{serviceExpectations[service.id].headline}</h2><p>{service.detail}</p><ul className="ft-expect-list">{serviceExpectations[service.id].items.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}</ul><button className="ft-button ft-button-dark" type="button" onClick={() => navigate("contact", service.id)}>Talk with us about this <span aria-hidden="true">↗</span></button></div></section>
    <section className="ft-method-mini"><div className="ft-container"><p className="ft-eyebrow">Connected to the whole journey</p><h2>Good support meets communities where they are.</h2><button className="ft-arrow-link" type="button" onClick={() => navigate("services")}>See all our services <span aria-hidden="true">↗</span></button></div></section>
  </>;
}

function WorkPage({ navigate }: { navigate: (page: Page, id?: string) => void }) {
  return <>
    <PageIntro eyebrow="Our work" title={<>Tourism shaped<br />by the people who live it.</>} text="Every place has its own priorities, strengths and story. Explore the communities and partnerships behind our work." />
    <section className="ft-work-controls ft-container"><div><p className="ft-eyebrow">Community projects</p><p>{projects.length} communities · Thailand, Kenya and Indonesia</p></div></section>
    <section className="ft-work-grid ft-container">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onClick={() => navigate("project", project.id)} />)}</section>
    <section className="ft-research-section ft-container"><div className="ft-section-heading"><div><p className="ft-eyebrow">Research, consultancy & training</p><h2>Knowledge that strengthens the sector.</h2></div><p>Beyond community projects, we lead research and training that help tour operators and destinations work fairly with communities.</p></div><div className="ft-research-grid">{researchProjects.map((project) => <ResearchCard key={project.id} project={project} onClick={() => navigate("project", project.id)} />)}</div></section>
    <Callout navigate={navigate} eyebrow="Support the next chapter" title="Community leadership grows through long-term relationships." text="Learn where support goes and how Fair Tourism works with communities and partners." action="Support the work" onClick={() => navigate("donate")} />
  </>;
}

function ProjectPage({ project, navigate }: { project: Project; navigate: (page: Page, id?: string) => void }) {
  const details = projectDetails[project.id];
  const facts = [["Project lead", details.lead], ["Location", details.location], ["Period", details.period], ["Focus", details.type], ["Scale", details.scale]];
  return <>
    <section className="ft-project-hero"><img src={project.image} alt={`${project.people} in ${project.place}`} /><div className="ft-project-hero-shade" /><div className="ft-project-hero-copy"><p className="ft-eyebrow ft-eyebrow-light">Our work / {project.place}</p><h1>{project.name}</h1><p>{project.people} · {project.place}</p><div className="ft-button-row"><button className="ft-button ft-button-coral" type="button" onClick={() => navigate("donate")}>Support this work <span aria-hidden="true">↗</span></button><button className="ft-button ft-button-outline-light" type="button" onClick={() => navigate("contact", "project")}>Explore a partnership</button></div></div></section>
    <dl className="ft-quick-facts ft-container">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <section className="ft-story-section ft-container"><div><p className="ft-eyebrow">Why it matters</p><h2>Tourism works best when local people shape what happens next.</h2></div><div className="ft-story-text">{details.whyItMatters.map((text) => <p key={text}>{text}</p>)}</div></section>
    <section className="ft-project-lists ft-container">{details.challenges.length > 0 && <div><p className="ft-eyebrow">Key challenges</p><ul>{details.challenges.map((item) => <li key={item}>{item}</li>)}</ul></div>}<div><p className="ft-eyebrow">Key activities</p><ul>{details.activities.map((item) => <li key={item}>{item}</li>)}</ul></div>{details.partners && <div><p className="ft-eyebrow">Partners</p><p>{details.partners}</p></div>}</section>
    <section className="ft-project-approach"><div className="ft-container ft-project-approach-grid"><div><p className="ft-eyebrow ft-eyebrow-light">Our approach</p><h2>{details.approachTitle}</h2></div><div>{details.approach.map((text) => <p key={text}>{text}</p>)}<button className="ft-arrow-link ft-arrow-link-light" type="button" onClick={() => navigate("about")}>Explore our five-step approach <span aria-hidden="true">↗</span></button></div></div></section>
    <section className="ft-goals-section ft-container"><div className="ft-section-heading"><div><p className="ft-eyebrow">{project.id === "sasak" ? "Objectives" : "Project goals"}</p><h2>What we are working toward.</h2></div></div><ol className="ft-goal-list">{details.goals.map((goal, index) => <li key={goal}><span>{String(index + 1).padStart(2, "0")}</span><p>{goal}</p></li>)}</ol><p className="ft-source-note">Facts, goals and dates as published on the current project page. Confirm them with the project lead before publication.</p></section>
    {project.video && <section className="ft-project-film ft-container"><figure><div className="ft-film-frame"><video key={project.id} poster={media(`${project.video.file}.jpg`)} controls playsInline preload="none" aria-label={`Film about ${project.people}, ${project.place}`}><VideoSources file={project.video.file} /></video></div><figcaption><p className="ft-eyebrow">On film</p><h2>{project.people} · {project.place}</h2><p className="ft-source-note">{project.video.caption}</p></figcaption></figure></section>}
    <section className="ft-quote-section ft-container"><div className="ft-quote-label"><p className="ft-eyebrow">Community voices</p><span>01 / 01</span></div><blockquote>“{project.quote}”</blockquote><p className="ft-source-note">Illustrative quote from the Foundation's two-pager; confirm speaker consent, wording and translation before publication.</p></section>
    <section className="ft-related-band"><div className="ft-container"><p className="ft-eyebrow">Continue exploring</p><h2>Every community's journey is its own.</h2><div className="ft-related-links">{projects.filter((item) => item.id !== project.id).map((item) => <button key={item.id} type="button" onClick={() => navigate("project", item.id)}>{item.people}<span aria-hidden="true">↗</span></button>)}</div></div></section>
  </>;
}

function ResearchPage({ project, navigate }: { project: ResearchProject; navigate: (page: Page, id?: string) => void }) {
  const isTraining = project.id === "travelife-training";
  return <>
    <section className="ft-project-hero"><img src={project.image} alt="" /><div className="ft-project-hero-shade" /><div className="ft-project-hero-copy"><p className="ft-eyebrow ft-eyebrow-light">Our work / {project.label}</p><h1>{project.name}</h1><p>{project.summary}</p><div className="ft-button-row"><button className="ft-button ft-button-coral" type="button" onClick={() => navigate("contact", isTraining ? "travelife-training" : "project")}>{isTraining ? "Ask about the training" : "Discuss research with us"} <span aria-hidden="true">↗</span></button></div></div></section>
    <dl className="ft-quick-facts ft-container">{project.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
    <section className="ft-story-section ft-container"><div><p className="ft-eyebrow">Overview</p><h2>{isTraining ? "Protecting human rights in village tourism." : "Greening Thailand's tourism supply chains."}</h2></div><div className="ft-story-text">{project.intro.map((text) => <p key={text}>{text}</p>)}</div></section>
    <section className="ft-research-blocks ft-container">{project.sections.map((section) => <div key={section.title}><h3>{section.title}</h3>{section.text?.map((text) => <p key={text}>{text}</p>)}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</div>)}</section>
    {project.links && <section className="ft-report-links ft-container"><div className="ft-section-heading"><div><p className="ft-eyebrow">Results & publications</p><h2>Read the research.</h2></div></div><ul>{project.links.map((link) => <li key={link.label}><a href={link.href} target="_blank" rel="noreferrer"><span>{link.label}</span><i aria-hidden="true">↗</i></a>{link.note && <small>{link.note}</small>}</li>)}</ul></section>}
    <section className="ft-related-band"><div className="ft-container"><p className="ft-eyebrow">Continue exploring</p><h2>More of our work.</h2><div className="ft-related-links">{researchProjects.filter((item) => item.id !== project.id).map((item) => <button key={item.id} type="button" onClick={() => navigate("project", item.id)}>{item.name}<span aria-hidden="true">↗</span></button>)}<button type="button" onClick={() => navigate("work")}>All projects<span aria-hidden="true">↗</span></button></div></div></section>
  </>;
}

function ImpactPage({ navigate }: { navigate: (page: Page, id?: string) => void }) {
  return <>
    <PageIntro eyebrow="Our impact" title={<>Progress worth sharing.<br />Evidence worth checking.</>} text="Community tourism is a long journey. We share examples of progress alongside the context, people and partnerships behind it." />
    <section className="ft-impact-intro ft-container"><div><p className="ft-eyebrow">How we think about change</p><h2>Numbers can open the conversation.<br />They cannot tell the whole story.</h2></div><p>We look at whether tourism responds to community priorities, supports fair participation and helps protect cultural and natural heritage. Results should be checked with project teams and communities.</p></section>
    <section className="ft-impact-data"><div className="ft-container"><div className="ft-impact-data-heading"><div><p className="ft-eyebrow ft-eyebrow-light">A snapshot of activity and reach</p><h2>Different numbers. Different stories.</h2></div></div><p className="ft-impact-caveat">These figures come from the Foundation's two-pager. They describe activities and reach, not long-term community outcomes. Reporting periods and definitions still need confirmation.</p><div className="ft-impact-groups">{impactGroupDescriptions.map((item, index) => <section className="ft-impact-group" key={item.name}><div className="ft-impact-group-heading"><span>0{index + 1} / SNAPSHOT</span><h3>{item.name}</h3><p>{item.description}</p></div><div className="ft-impact-metrics">{impactFigures.filter((figure) => figure.group === item.name).map((figure) => <article key={figure.label}><strong>{figure.value}</strong><div><b>{figure.label}</b><p>{figure.detail}</p><small>Reporting period to confirm · Foundation two-pager</small></div></article>)}</div></section>)}</div><p className="ft-source-note ft-source-note-light">Before publication, confirm each number's date, definition and source with the project team. Do not present these as comparable trends until time periods and measurement methods match.</p></div></section>
    <section className="ft-sdg-section ft-container"><div><p className="ft-eyebrow">What we pay attention to</p><h2>People, culture and place.</h2></div><div className="ft-sdg-list"><p><strong>Fair livelihoods</strong><span>Tourism income and opportunities should be shared fairly.</span></p><p><strong>Participation</strong><span>Women and local leaders should have a voice in decisions.</span></p><p><strong>Living heritage</strong><span>Culture and nature are part of a community's future.</span></p><p><strong>Partnership</strong><span>Lasting change takes collaboration and accountability.</span></p></div></section>
    <Callout navigate={navigate} eyebrow="See the work behind the figures" title="Every number has a place and a story." text="Explore the projects and communities behind these examples." action="Explore our work" onClick={() => navigate("work")} />
  </>;
}

function ResourcesPage({ navigate, category, setCategory, query, setQuery }: { navigate: (page: Page, id?: string) => void; category: string; setCategory: (category: string) => void; query: string; setQuery: (query: string) => void }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const pageSize = 6;
  const categories = ["All resources", ...resourceCategories];
  const normalizedCategory = category === "All resources" ? "All topics" : category;
  const filteredArticles = allResources.filter((article) => (normalizedCategory === "All topics" || article.category === normalizedCategory) && `${article.title} ${article.summary}`.toLowerCase().includes(query.toLowerCase()));
  const showBrochure = (normalizedCategory === "All topics" || normalizedCategory === "Reports & publications") && `${brochureResource.title} ${brochureResource.summary}`.toLowerCase().includes(query.toLowerCase());
  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const remainingCount = Math.max(0, filteredArticles.length - visibleArticles.length);
  const hasMore = remainingCount > 0;

  function updateCategory(nextCategory: string) {
    setCategory(nextCategory === "All resources" ? "All topics" : nextCategory);
    setVisibleCount(6);
  }

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    setVisibleCount(6);
  }

  return <>
    <PageIntro eyebrow="Resources" title={<>Stories, research<br />and useful references.</>} text="Browse community stories, practical guides, reports and publications about community-led tourism." />
    <section className="ft-resource-tools ft-container"><label className="ft-search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search stories, reports and guides" aria-label="Search resources" /></label><div className="ft-filter-group" aria-label="Filter resources">{categories.map((item) => <button key={item} type="button" className={(normalizedCategory === item || (item === "All resources" && normalizedCategory === "All topics")) ? "is-selected" : ""} onClick={() => updateCategory(item)}>{item}</button>)}</div></section>
    <p className="ft-resource-data-note ft-container">Demo archive: {articles.length} articles from the current website, {externalReports.length} TOURLINK publications and {sampleResources.length} clearly labeled sample entries are shown to demonstrate browsing 100 resources.</p>
    {visibleArticles.length > 0 ? <section className="ft-resource-grid ft-container">{visibleArticles.map((article) => <ArticleCard key={article.id} article={article} onClick={() => navigate("article", article.id)} />)}</section> : <section className="ft-container"><p className="ft-empty-state">No resources found. Try another search or clear the topic filter.</p></section>}
    {filteredArticles.length > 0 && (normalizedCategory !== "Reports & publications" || hasMore) && <div className="ft-load-more-wrap ft-container">{normalizedCategory !== "Reports & publications" && <p className="ft-resource-count" aria-live="polite">Showing {visibleArticles.length} of {filteredArticles.length} resources</p>}{hasMore && <><button className="ft-load-more" type="button" onClick={() => setVisibleCount((count) => count + pageSize)}>Show more resources <span aria-hidden="true">↓</span></button><p>Loads up to {Math.min(pageSize, remainingCount)} more · {remainingCount} remaining</p></>}</div>}
    {showBrochure && <section className="ft-featured-brochure ft-container"><div className="ft-brochure-art"><span>FAIR<br />TOURISM</span><i aria-hidden="true">F</i><small>TWO-PAGE OVERVIEW</small></div><div className="ft-brochure-copy"><div className="ft-brochure-meta"><span>REPORTS &amp; PUBLICATIONS</span><span>PDF · 2 PAGES</span></div><h2>{brochureResource.title}</h2><p>{brochureResource.summary}</p><small className="ft-brochure-date">{brochureResource.dateNote}</small><a className="ft-button ft-button-coral ft-brochure-download" href={brochureResource.href} target="_blank" rel="noreferrer">Download brochure <span aria-hidden="true">↓</span></a></div></section>}
    <section className="ft-partners-section ft-container"><div className="ft-section-heading"><div><p className="ft-eyebrow">Our partners</p><h2>Our extraordinary partners.</h2></div><p>Universities and tourism organizations that support research, learning and fair connections for community tourism.</p></div><ul className="ft-partner-logos">{partners.map((partner) => <li key={partner.name}><img src={media(`partners/${partner.logo}`)} alt={partner.name} loading="lazy" /><span>{partner.type}</span></li>)}</ul></section>
    <section className="ft-resource-promo"><div className="ft-container"><p className="ft-eyebrow ft-eyebrow-light">Looking for the source behind a project?</p><h2>Reports and publications live here.</h2><p>Use the Reports &amp; publications filter to find downloadable material and source documents. Dates and project details are shown when confirmed.</p><button className="ft-button ft-button-outline-light" type="button" onClick={() => updateCategory("Reports & publications")}>Browse reports &amp; publications <span aria-hidden="true">↗</span></button></div></section>
  </>;
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function ArticlePage({ article, navigate }: { article: Article; navigate: (page: Page, id?: string) => void }) {
  const byline = [article.author && `By ${article.author}`, article.date && formatDate(article.date)].filter(Boolean).join(" · ");
  const related = articles.filter((item) => item.id !== article.id && item.category === article.category).slice(0, 3);
  return <>
    <section className="ft-article-hero"><img src={article.image} alt="" /><div className="ft-container"><p className="ft-eyebrow ft-eyebrow-light">{article.category} · {article.read}</p><h1>{article.title}</h1><p>{article.summary}</p></div></section>
    <article className="ft-article-body">
      <p className="ft-article-byline">{byline || "Fair Tourism"}</p>
      {article.body.map((block, index) => {
        if (block[0] === "ul") return <ul key={index}>{block[1].map((item) => <li key={item}>{item}</li>)}</ul>;
        if (block[0] === "h2") return <h2 key={index}>{block[1]}</h2>;
        if (block[0] === "h3") return <h3 key={index}>{block[1]}</h3>;
        if (block[0] === "strong") return <p className="ft-article-label" key={index}>{block[1]}</p>;
        return <p key={index}>{block[1]}</p>;
      })}
      <p className="ft-source-note">Published on the current Fair Tourism website. <a href={article.source} target="_blank" rel="noreferrer">View the original ↗</a></p>
      <div className="ft-article-actions"><button className="ft-button ft-button-dark" type="button" onClick={() => navigate("work")}>Explore related projects <span aria-hidden="true">↗</span></button><button className="ft-arrow-link" type="button" onClick={() => navigate("resources")}>Back to resources</button></div>
    </article>
    {related.length > 0 && <section className="ft-stories-section ft-container"><div className="ft-section-heading"><div><p className="ft-eyebrow">Related reading</p><h2>More in {article.category}.</h2></div></div><div className="ft-story-grid">{related.map((item) => <ArticleCard key={item.id} article={item} onClick={() => navigate("article", item.id)} />)}</div></section>}
  </>;
}

function DonatePage({ amount, setAmount, customAmount, setCustomAmount, frequency, setFrequency, onDonate }: { amount: string; setAmount: (amount: string) => void; customAmount: string; setCustomAmount: (amount: string) => void; frequency: string; setFrequency: (frequency: string) => void; onDonate: () => void }) {
  const amounts = ["10", "50", "100"];
  return <>
    <PageIntro eyebrow="Support the cause" title={<>Help communities shape<br />their tourism future.</>} text="Your contribution can support community needs assessments, training, fair partnerships and connections to responsible tourism." />
    <section className="ft-donate-layout ft-container"><div className="ft-donate-story"><p className="ft-eyebrow">Where your donation goes</p><h2>Support for Kayan, Maasai and Sasak communities.</h2><ul className="ft-donate-uses">{donationUses.map((use, index) => <li key={use.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{use.title}</strong><p>{use.text}</p>{use.items.length > 0 && <ul className="ft-donate-sublist">{use.items.map((item) => <li key={item}>{item}</li>)}</ul>}</div></li>)}</ul><div className="ft-donate-now"><strong>Why your support matters now</strong><p>The Kayan in Thailand, the Maasai in Kenya and the Sasak communities in Lombok are ready. They want training and partnerships to shape their tourism future, but they cannot begin without the resources to do so.</p></div><p className="ft-source-note">Donations support the Foundation's work. This prototype does not assign a fixed outcome to a specific donation amount.</p></div><div className="ft-donate-form"><div className="ft-donate-form-heading"><span className="ft-eyebrow">Choose an amount</span><span className="ft-currency">EUR €</span></div><div className="ft-frequency" role="group" aria-label="Donation frequency">{["Once", "Monthly"].map((item) => <button type="button" key={item} className={frequency === item ? "is-selected" : ""} onClick={() => setFrequency(item)}>{item}</button>)}</div><div className="ft-amount-grid" role="group" aria-label="Donation amount">{amounts.map((item) => <button type="button" key={item} aria-pressed={amount === item && !customAmount} className={amount === item && !customAmount ? "is-selected" : ""} onClick={() => { setAmount(item); setCustomAmount(""); }}>€{item}</button>)}</div><label className="ft-field-label" htmlFor="custom-amount">Or choose another amount</label><div className="ft-custom-amount"><span>€</span><input id="custom-amount" inputMode="decimal" placeholder="Other amount" value={customAmount} onChange={(event) => { setCustomAmount(event.target.value); setAmount(""); }} /></div><button className="ft-button ft-button-coral ft-donate-submit" type="button" onClick={onDonate}>Continue to donation <span aria-hidden="true">↗</span></button><p className="ft-form-footnote">On the current site, payments and receipts are handled by Donorbox (Stripe). This prototype does not process payments.</p></div></section>
    <section className="ft-donate-faq"><div className="ft-container"><p className="ft-eyebrow">Good to know</p><h2>Questions about giving.</h2><div className="ft-faq-list"><details><summary>Where does my donation go?</summary><p>Donations support Fair Tourism's community tourism work, including needs assessment, training, fair partnerships and market connections.</p></details><details><summary>Can I see what happens next?</summary><p>The live site should explain how supporters receive updates and where project reporting can be found. Confirm the current reporting schedule before publishing.</p></details><details><summary>Will this page take my payment?</summary><p>No. This is a design prototype. The payment provider has not been connected.</p></details></div></div></section>
  </>;
}

function ContactPage({ sent, onSubmit, topic }: { sent: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void; topic: string }) {
  const presetTopic = contactTopics.find((item) => item.id === topic)?.label ?? "";
  return <>
    <PageIntro eyebrow="Partner with us" title={<>Good work grows<br />through good partnerships.</>} text="Ready to kick-start a community tourism project but need guidance? Or do you know an Indigenous community that needs tools to thrive in tourism? Let's explore what could be useful together." />
    <section className="ft-contact-layout ft-container"><div className="ft-contact-copy"><p className="ft-eyebrow">Ways to work together</p><h2>Bring what you know.<br />Start with a conversation.</h2><div className="ft-partner-types"><article><span>01</span><div><strong>Academic partners</strong><p>Research, teaching, outreach and specialist knowledge.</p></div></article><article><span>02</span><div><strong>Tourism partners</strong><p>Responsible operations, market access and practical resources.</p></div></article><article><span>03</span><div><strong>Community organizations</strong><p>Local priorities, ideas and leadership for tourism in your place.</p></div></article></div><p className="ft-location-note">Fair Tourism is based at the Humanity Hub in The Hague, the Netherlands. Prefer email? Write to <a href={`mailto:${organisation.email}`}>{organisation.email}</a>.</p></div><form className="ft-contact-form" onSubmit={(event) => { event.preventDefault(); onSubmit(event); }}><p className="ft-eyebrow">Start a conversation</p>{sent ? <div className="ft-form-success" role="status"><span aria-hidden="true">✓</span><h2>Thanks for reaching out.</h2><p>This demo has not sent or stored your details. The live form should confirm receipt and explain what happens next.</p></div> : <><div className="ft-form-row"><label>Name<input name="name" autoComplete="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label></div><label>Your organization or role<select name="role" defaultValue=""><option value="" disabled>Select one</option><option>Community organization</option><option>Tourism business</option><option>University or researcher</option><option>Funder or NGO</option><option>Prospective volunteer</option><option>Other</option></select></label><label>What would you like to explore?<select name="topic" defaultValue={presetTopic}><option value="" disabled>Choose a topic</option>{contactTopics.map((item) => <option key={item.id}>{item.label}</option>)}</select></label><label>Your message<textarea name="message" rows={4} required placeholder={topic === "volunteer" ? "Tell us why you want to volunteer and what you would like to work on." : "Tell us a little about your idea, the community or the issue they're facing."} /></label>{topic === "volunteer" && <p className="ft-form-footnote">The current volunteer form also asks for your location, availability and a CV with motivation letter. The live form should support file uploads.</p>}<p className="ft-form-footnote">Prototype only: details stay in this browser and are not sent anywhere.</p><button className="ft-button ft-button-dark" type="submit">Send an enquiry <span aria-hidden="true">↗</span></button></>}</form></section>
  </>;
}

function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  return <article className={`ft-project-card ft-project-card-${index + 1}`}><button className="ft-card-image" type="button" onClick={onClick} aria-label={`Explore ${project.people}`}><img src={project.image} alt={`${project.people}, ${project.place}`} loading="lazy" /><span className="ft-card-index">0{index + 1}</span></button><div className="ft-card-content"><p className="ft-card-location">{project.place}</p><h3>{project.people}</h3><p>{project.summary}</p><button className="ft-arrow-link" type="button" onClick={onClick}>Explore project <span aria-hidden="true">↗</span></button></div></article>;
}

function ArticleCard({ article, onClick }: { article: ResourceItem; onClick: () => void }) {
  if ("sample" in article) {
    return <article className="ft-article-card ft-sample-resource"><div className="ft-article-image"><img src={article.image} alt="" loading="lazy" /><span>SAMPLE DATA</span></div><div className="ft-article-meta"><span>{article.category}</span><span>Demo entry</span></div><h2 className="ft-sample-resource-title">{article.title}</h2><p>{article.summary}</p></article>;
  }
  if ("href" in article) {
    return <article className="ft-article-card ft-report-card"><a className="ft-article-image" href={article.href} target="_blank" rel="noreferrer" aria-label={`Open ${article.title}`}><img src={article.image} alt="" loading="lazy" /></a><div className="ft-article-meta"><span>{article.category}</span><span>{article.read}</span></div><a className="ft-article-title" href={article.href} target="_blank" rel="noreferrer">{article.title}<span aria-hidden="true">↗</span></a><p>{article.summary}</p></article>;
  }
  const meta = article.author || (article.date ? formatDate(article.date) : article.read);
  return <article className="ft-article-card"><button className="ft-article-image" type="button" onClick={onClick} aria-label={`Read ${article.title}`}><img src={article.image} alt="" loading="lazy" /></button><div className="ft-article-meta"><span>{article.category}</span><span>{meta}</span></div><button className="ft-article-title" type="button" onClick={onClick}>{article.title}<span aria-hidden="true">↗</span></button><p>{article.summary}</p></article>;
}

function ResearchCard({ project, onClick }: { project: ResearchProject; onClick: () => void }) {
  return <article className="ft-project-card ft-research-card"><button className="ft-card-image" type="button" onClick={onClick} aria-label={`Explore ${project.name}`}><img src={project.image} alt="" loading="lazy" /></button><div className="ft-card-content"><p className="ft-card-location">{project.label}</p><h3>{project.name}</h3><p>{project.summary}</p><button className="ft-arrow-link" type="button" onClick={onClick}>Explore {project.name} <span aria-hidden="true">↗</span></button></div></article>;
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: React.ReactNode; text: string }) {
  return <section className="ft-page-intro"><div className="ft-container"><p className="ft-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p></div></section>;
}

function Callout({ navigate: _navigate, eyebrow, title, text, action, onClick }: { navigate: (page: Page, id?: string) => void; eyebrow: string; title: string; text: string; action: string; onClick: () => void }) {
  return <section className="ft-callout"><div className="ft-container"><div><p className="ft-eyebrow ft-eyebrow-light">{eyebrow}</p><h2>{title}</h2></div><div><p>{text}</p><button className="ft-button ft-button-outline-light" type="button" onClick={onClick}>{action} <span aria-hidden="true">↗</span></button></div></div></section>;
}

function Footer({ navigate, onNewsletter, newsletterSent }: { navigate: (page: Page, id?: string) => void; onNewsletter: (event: FormEvent<HTMLFormElement>) => void; newsletterSent: boolean }) {
  return <footer className="ft-footer"><div className="ft-footer-cta"><div className="ft-container"><div><p className="ft-eyebrow ft-eyebrow-light">Travel. Respect. Empower.</p><h2>Make room for a fairer way to travel.</h2></div><div className="ft-button-row"><button className="ft-button ft-button-coral" type="button" onClick={() => navigate("contact")}>Become a partner <span aria-hidden="true">↗</span></button><button className="ft-button ft-button-outline-light" type="button" onClick={() => navigate("donate")}>Donate now</button></div></div></div><div className="ft-footer-main ft-container"><div className="ft-footer-brand"><a className="ft-wordmark ft-wordmark-light" href="#/" onClick={(event) => { event.preventDefault(); navigate("home"); }}><span className="ft-mark" aria-hidden="true">F</span><span>Fair<span className="ft-wordmark-accent">Tourism</span></span></a><p>A non-profit organization working with communities and partners for fair, responsible and regenerative tourism.</p><p className="ft-footer-contact"><a href={`mailto:${organisation.email}`}>{organisation.email}</a><span>{organisation.location}</span><span>KVK {organisation.kvk}</span></p><div className="ft-social-links">{organisation.socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label} ↗</a>)}</div></div><div className="ft-footer-nav"><strong>Explore</strong>{navItems.map((item) => <button key={item.page} type="button" onClick={() => navigate(item.page)}>{item.label}</button>)}<button type="button" onClick={() => navigate("contact")}>Contact</button><button type="button" onClick={() => navigate("contact", "volunteer")}>Volunteer with us</button></div><div className="ft-footer-news"><strong>Notes from the field</strong><p>Occasional stories and ideas on community tourism.</p>{newsletterSent ? <p className="ft-news-success" role="status">Thanks. This demo did not send your email.</p> : <form onSubmit={onNewsletter}><label className="ft-visually-hidden" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="Email address" /><button type="submit" aria-label="Subscribe">→</button></form>}<small>Subscription is a prototype interaction, not connected to a mailing list.</small></div></div><div className="ft-footer-bottom ft-container"><span>© {organisation.legalName}</span><span>The Hague · The Netherlands</span><button type="button" onClick={() => window.alert("Prototype privacy settings: no analytics or marketing cookies are active.")}>Privacy settings</button></div></footer>;
}

export default App;