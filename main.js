const navList = document.getElementById("navList");
const mainContent = document.getElementById("mainContent");
const nav = document.querySelector(".nav");
const toTopButton = document.getElementById("toTop");

const platformLabels = {
    ios: "iOS",
    android: "Android",
    pc: "PC",
    browser: "ブラウザゲーム"
};

const normalizePlatform = (platform = "") => {
    const trimmed = platform.trim();
    const lower = trimmed.toLowerCase();

    if (lower === "ios" || lower === "iphone") return "ios";
    if (lower === "android") return "android";
    if (lower === "pc" || lower === "windows") return "pc";
    if (trimmed === "ブラウザゲーム" || lower === "browser" || lower === "web") return "browser";

    return lower || trimmed;
};

const renderPlatforms = (platforms = []) => {
    if (!platforms.length) return "";

    const badges = platforms
        .map((platform) => {
            const normalized = normalizePlatform(platform);
            const label = platformLabels[normalized] || platform;
            return `<span class="platform-badge" data-platform="${normalized}">${label}</span>`;
        })
        .join("");

    return `<div class="platform-badges">${badges}</div>`;
};

const renderPrice = (price) => {
    if (!price) return "";
    return `<span class="price-badge">${price}</span>`;
};

if (navList) {
    navList.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (!link) return;

        const targetId = link.getAttribute("href")?.replace("#", "");
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

const buildPage = (contentData) => {
    navList.innerHTML = contentData.sections
        .map((section) => `<li><a href="#${section.id}">${section.label}</a></li>`)
        .join("");

    mainContent.innerHTML = contentData.sections
        .map((section) => {
            const cards = section.items.length
                ? section.items
                      .map(
                          (item) => `
                        <article class="card">
                            <a class="card-link" href="${item.url}" target="_blank" rel="noopener">
                                <figure class="card-thumb">
                                    <img src="${item.thumb}" alt="${item.title}のサムネイル">
                                </figure>
                                <div class="card-body">
                                    ${renderPrice(item.price)}
                                    <h3>${item.title}</h3>
                                    ${renderPlatforms(item.platforms)}
                                    <p>${item.desc}</p>
                                </div>
                            </a>
                        </article>
                    `
                      )
                      .join("")
                : `<div class="empty-state">準備中</div>`;

            return `
                <section class="category" id="${section.id}">
                    <header class="category-header">
                        <h2>${section.label}</h2>
                        <span class="category-tag">${section.items.length} 作品</span>
                    </header>
                    <div class="card-grid">
                        ${cards}
                    </div>
                </section>
            `;
        })
        .join("");
};

fetch("data.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("data.jsonの読み込みに失敗しました");
        }
        return response.json();
    })
    .then((data) => buildPage(data))
    .catch((error) => {
        console.error(error);
        mainContent.innerHTML = "<p>コンテンツの読み込みに失敗しました。</p>";
    });

if (toTopButton) {
    toTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

if (nav && toTopButton) {
    const observer = new IntersectionObserver(
        ([entry]) => {
            toTopButton.classList.toggle("is-visible", !entry.isIntersecting);
        },
        { threshold: 0.1 }
    );

    observer.observe(nav);
}
