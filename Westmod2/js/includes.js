(function () {
  const extract = (h, s, e) => {
    if (!h) return null;
    const i = h.indexOf(s),
      j = h.indexOf(e);
    return i > -1 && j > i ? h.substring(i + s.length, j).trim() : null;
  };

  async function getPage() {
    for (const p of ["/home.html", "home.html"]) {
      try {
        const res = await fetch(p + "?t=" + Date.now(), { cache: "no-store" });
        if (res.ok) {
          const text = await res.text();
          if (text.includes("<!-- site-header-start -->")) return text;
        }
      } catch (e) {}
    }
    console.warn("includes.js: could not load host page.");
  }
  async function apply() {
    const html = await getPage();
    if (html) {
      const hdr = extract(
        html,
        "<!-- site-header-start -->",
        "<!-- site-header-end -->",
      );
      const ftr = extract(
        html,
        "<!-- site-footer-start -->",
        "<!-- site-footer-end -->",
      );
      const hTarget = document.getElementById("site-header");
      const fTarget = document.getElementById("site-footer");
      if (hTarget && hdr) hTarget.innerHTML = hdr;
      if (fTarget && ftr) fTarget.innerHTML = ftr;
    }
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", apply)
    : apply();
})();
