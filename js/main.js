const SOCIAL = [
  ["images/facebook.png","Facebook","https://www.facebook.com/share/1CFapo7KM9/?mibextid=wwXIfr"],["images/instagram.png","Instagram","https://www.instagram.com/aquastream.web?vrfl=OXBncWd4NnViMTFv"],
  ["images/tiktok.png","TikTok","https://www.tiktok.com/@aquastream.web?_r=1&_t=ZS-9AUb11NRIZE"]
];
const ICON = {
  lock: "M7 11V8a5 5 0 0110 0v3M5 11h14v10H5z",
  doc: "M6 3h9l4 4v14H6zM9 13h6M12 10v6",
  pin: "M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 8v4",
  chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  clock: "M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6"
};
const FEATURES = [
  ["lock", "Secure Access", "Sign up and log in securely to manage orders through one convenient system."],
  ["doc", "Order Logging", "Record customer details, order quantity, delivery date, and payment method in one form."],
  ["pin", "Live Tracking", "Monitor orders easily with clear statuses for pending, in-progress, and completed deliveries."],
  ["chart", "Sales Analytics", "View daily sales, weekly trends, and total order volume in one dashboard."],
  ["clock", "Order History", "Keep past orders organized and accessible without relying on handwritten records."]
];
 
const ic = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON[k]}"/></svg>`;
const soc = l => `<div class="soc">${l.map(([i,n,h]) => `<a href="${h}" aria-label="${n}"><img src="${i}" alt="${n}"></a>`).join("")}</div>`;
 
document.querySelector(".hamburger-menu").onclick = () => document.querySelector(".nav nav").classList.toggle("open");
document.querySelectorAll("[data-ic]").forEach(e => e.innerHTML = ic(e.dataset.ic));
document.querySelectorAll("[data-social]").forEach(e => e.outerHTML = soc(SOCIAL));
document.querySelectorAll("[data-features]").forEach(el => {
  const tiles = el.dataset.features === "tiles";
  el.innerHTML = FEATURES.map(([i, n, d], k) =>
    `<div class="card ${tiles ? "tile" : "feat"} show" style="--d:${k * .08}s"><span class="ico">${ic(i)}</span><h3>${n}</h3>${tiles ? "" : `<p>${d}</p>`}</div>`
  ).join("");
});
 
const swap = i => {
  i.src = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><defs><linearGradient id="g"><stop offset="0" stop-color="#EAF6FF"/><stop offset="1" stop-color="#88DDFF"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/><text x="320" y="205" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#1856AB">${i.dataset.ph || "Image placeholder"}</text></svg>`);
};
const ph = () => document.querySelectorAll("img").forEach(i => {
  i.onerror = () => {
    i.onerror = null;
    swap(i);
  };
  if (i.complete && !i.naturalWidth) swap(i);
});
 
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add("in");
    setTimeout(() => e.target.classList.add("done"), 1200);
    io.unobserve(e.target);
  }
}), { threshold: .15 });
const reveal = () => document.querySelectorAll(".show:not(.in)").forEach(el => io.observe(el));
 
document.addEventListener("click", e => {
  const a = e.target.closest("a");
  if (!a || a.target || !a.getAttribute("href") || a.getAttribute("href").startsWith("#") || a.origin !== location.origin) return;
  e.preventDefault();
  document.body.classList.add("leave");
  setTimeout(() => location.href = a.href, 250);
});
addEventListener("pageshow", () => document.body.classList.remove("leave"));
 
const getJSON = async p => {
  const r = await fetch(p);
  if (!r.ok) throw new Error(r.status);
  return r.json();
};
const fail = (el, what) => el.innerHTML = `<p class="note err">Could not load ${what}. Open the site with Live Server or GitHub Pages, not by double-clicking the file.</p>`;
 
const pg = document.getElementById("product-grid");
if (pg) {
  getJSON("data/products.json")
    .then(list => {
      pg.innerHTML = list.map((p, k) =>
        `<article class="card pcard show" style="--d:${(k % 2) * .1}s"><div class="shot"><img src="${p.image}" data-ph="${p.name} page" alt="${p.name} page screenshot" loading="lazy"></div><h3>${p.name}</h3><p>${p.description}</p></article>`
      ).join("");
      ph();
      reveal();
      pg.querySelectorAll(".pcard").forEach(c => {
        c.onmouseenter = () => {
          pg.classList.add("has-hot");
          c.classList.add("hot");
        };
        c.onmouseleave = () => {
          pg.classList.remove("has-hot");
          c.classList.remove("hot");
        };
      });
    })
    .catch(() => fail(pg, "products"));
}
 
const cu = document.getElementById("customers");
if (cu) {
  getJSON("data/customers.json")
    .then(list => {
      cu.innerHTML = list.map((u, k) =>
        `<div class="card show" style="--d:${k * .1}s"><span class="av">${u.first_name[0]}${u.last_name[0]}</span><div><b>${u.first_name} ${u.last_name}</b><br><small>${u.email}<br>Member since ${new Date(u.created_at.replace(" ", "T")).toLocaleDateString("en-PH", { month: "long", year: "numeric" })}</small></div></div>`
      ).join("");
      reveal();
    })
    .catch(() => fail(cu, "customers"));
}
 
const f = document.getElementById("contact-form");
if (f) {
  f.onsubmit = e => {
    e.preventDefault();
    const n = f.querySelector(".note");
    let ok = true;
    f.querySelectorAll("[required]").forEach(i => {
      const bad = !i.checkValidity();
      i.classList.toggle("bad", bad);
      ok = ok && !bad;
    });
    n.className = "note" + (ok ? "" : " err");
    n.textContent = ok
      ? `Thanks, ${f.name.value.split(" ")[0]}! We received your message and will reply soon.`
      : "Please fill in your name, a valid email, and your message.";
    if (ok) f.reset();
  };
}
 
ph();
reveal();
