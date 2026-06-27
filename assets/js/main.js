/* =====================================================================
   آيت — EIGHT  |  main.js
   ===================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------ *
   *  WORK / PORTFOLIO VIDEOS — real films from EIGHT's YouTube channel
   *  (@EIGHT8STUDIO8). Edit titles/tags freely; `id` = the watch?v= value.
   * ------------------------------------------------------------------ */
  var VIDEOS = [
    { id: "HT3Rhzknv3Y", title: "برومو افتتاح وكالة آيت", tag: "تعريفي" },
    { id: "R6-qSvAEv8I", title: "حفل زفاف — دهش المطيري", tag: "زفاف" },
    { id: "WXiqa-iyj7M", title: "حفل زفاف — آل الشمري", tag: "زفاف" },
    { id: "9pJWDkfJPII", title: "حفل زفاف — منصور المغري", tag: "زفاف" },
    { id: "L9AVShVPDJo", title: "حفل زفاف — فيصل العنزي", tag: "زفاف" },
    { id: "oyviA8hojS4", title: "حفل زفاف — مشاري المغري", tag: "زفاف" }
  ];

  /* ============================ DOM READY ============================ */
  document.addEventListener("DOMContentLoaded", function () {

    /* year */
    var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

    buildWork();
    tagReveals();
    initNav();
    initCounters();
    initScrollProgress();
    initForm();
    initToTop();
    initAnchors();
    if (finePointer && !reduceMotion) initTilt();
    initMotion();
  });

  /* =====================================================================
     MOTION ENGINE — Lenis smooth scroll + GSAP ScrollTrigger.
     Falls back to IntersectionObserver reveals if GSAP is unavailable
     or the user prefers reduced motion.
     ===================================================================== */
  var lenis = null;

  function initMotion() {
    var GS = window.gsap, ST = window.ScrollTrigger;
    if (!GS || !ST || reduceMotion) { initReveal(); return; }  /* fallback */
    GS.registerPlugin(ST);
    document.documentElement.classList.add("gsap");

    initLenis(GS, ST);
    gHero(GS);
    gReveals(GS);
    gAboutScrub(GS);
    gParallax(GS);
    gMarquee(GS);
    gWorkSetup(GS);
    if (finePointer) gMagnetic(GS);

    GS.delayedCall(0.2, function () { ST.refresh(); });
  }

  function initLenis(GS, ST) {
    if (!window.Lenis) return;
    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    lenis.on("scroll", ST.update);
    GS.ticker.add(function (time) { lenis.raf(time * 1000); });
    GS.ticker.lagSmoothing(0);
    window.lenis = lenis; /* handle for anchored scrolling / debugging */
  }

  /* hero: cinematic load-in + scroll parallax of the content */
  function gHero(GS) {
    var tl = GS.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero .eyebrow", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .7 }, .15)
      .fromTo(".hero__logo", { y: 32, autoAlpha: 0, scale: .9 }, { y: 0, autoAlpha: 1, scale: 1, duration: .95 }, "-=.4")
      .fromTo(".hero__title", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .95 }, "-=.55")
      .fromTo(".hero__lead", { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8 }, "-=.55")
      .fromTo(".hero__cta", { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8 }, "-=.55");
    GS.to(".hero__inner", {
      yPercent: -16, autoAlpha: .15, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* choreographed, staggered, directional reveals */
  function gReveals(GS) {
    [
      { p: ".why-grid", c: ".why-card" },
      { p: ".service-grid", c: ".service" },
      { p: ".stat-grid", c: ".stat" },
      { p: ".contact__cards", c: ".info-card" }
    ].forEach(function (g) {
      var parent = document.querySelector(g.p); if (!parent) return;
      GS.fromTo(parent.querySelectorAll(g.c),
        { y: 66, autoAlpha: 0, scale: .96 },
        { y: 0, autoAlpha: 1, scale: 1, duration: .9, ease: "power3.out", stagger: .09,
          scrollTrigger: { trigger: parent, start: "top 82%" } });
    });
    document.querySelectorAll(
      ".section__head, .about__lead-card, .about__why, .contact__form-wrap, .map-frame, .footer__brand, .footer__col, .marquee"
    ).forEach(function (el) {
      GS.fromTo(el, { y: 54, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: .9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" } });
    });
  }

  /* scrubbed word-by-word reveal on the intro paragraph */
  function gAboutScrub(GS) {
    try {
      var el = document.querySelector(".about__lead"); if (!el) return;
      var nodes = Array.prototype.slice.call(el.childNodes), words = [];
      el.innerHTML = "";
      nodes.forEach(function (node) {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach(function (part) {
            if (part.trim() === "") el.appendChild(document.createTextNode(part));
            else { var s = document.createElement("span"); s.className = "word"; s.textContent = part; el.appendChild(s); words.push(s); }
          });
        } else if (node.nodeType === 1) {
          node.classList.add("word"); el.appendChild(node); words.push(node);
        }
      });
      GS.fromTo(words, { autoAlpha: .16 }, {
        autoAlpha: 1, ease: "none", stagger: .35,
        scrollTrigger: { trigger: el, start: "top 78%", end: "top 32%", scrub: true }
      });
    } catch (e) { /* non-fatal */ }
  }

  /* depth parallax on ambient layers */
  function gParallax(GS) {
    var nb = document.querySelector(".numbers__bg");
    if (nb) GS.fromTo(nb, { yPercent: -12 }, { yPercent: 12, ease: "none",
      scrollTrigger: { trigger: ".numbers", start: "top bottom", end: "bottom top", scrub: true } });
    var fb = document.querySelector(".footer__bg");
    if (fb) GS.fromTo(fb, { yPercent: -10 }, { yPercent: 10, ease: "none",
      scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom top", scrub: true } });
  }

  /* perfectly seamless infinite marquee (clones to fill any width) */
  function gMarquee(GS) {
    document.querySelectorAll(".marquee").forEach(function (m) {
      var track = m.querySelector(".marquee__track"); if (!track) return;
      var items = Array.prototype.slice.call(track.children);
      var setWidth = track.scrollWidth;
      var guard = 0;
      while (track.scrollWidth < window.innerWidth * 2 + setWidth && guard < 24) {
        items.forEach(function (el) { track.appendChild(el.cloneNode(true)); });
        guard++;
      }
      GS.set(track, { x: 0 });
      var tween = GS.to(track, {
        x: -setWidth, duration: setWidth / 70, ease: "none", repeat: -1,
        modifiers: { x: GS.utils.unitize(GS.utils.wrap(-setWidth, 0)) }
      });
      m.addEventListener("mouseenter", function () { GS.to(tween, { timeScale: .25, duration: .4, overwrite: true }); });
      m.addEventListener("mouseleave", function () { GS.to(tween, { timeScale: 1, duration: .4, overwrite: true }); });
    });
  }

  /* SIGNATURE: desktop pins the Work section + scrolls the films horizontally;
     tablet/mobile fall back to a staggered reveal. gsap.matchMedia swaps the
     two cleanly whenever the viewport crosses 1000px. */
  function gWorkSetup(GS) {
    var section = document.querySelector("#work");
    var track = document.querySelector("#work-grid");
    if (!section || !track) return;
    var rtl = document.dir === "rtl" || document.documentElement.dir === "rtl";
    var mm = GS.matchMedia();

    mm.add("(min-width: 1000px)", function () {
      section.classList.add("work--pinned");
      var vp = section.querySelector(".work__viewport");
      var amount = function () {
        var pad = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
        return Math.max(0, track.scrollWidth - vp.clientWidth + pad);
      };
      GS.to(track, {
        x: function () { return rtl ? amount() : -amount(); }, ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: function () { return "+=" + amount(); },
          pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true }
      });
      return function () { section.classList.remove("work--pinned"); GS.set(track, { clearProps: "transform" }); };
    });

    mm.add("(max-width: 999px)", function () {
      GS.fromTo(".work-card", { y: 60, autoAlpha: 0, scale: .96 },
        { y: 0, autoAlpha: 1, scale: 1, duration: .9, ease: "power3.out", stagger: .1,
          scrollTrigger: { trigger: "#work", start: "top 82%" } });
    });
  }

  /* magnetic primary CTAs */
  function gMagnetic(GS) {
    document.querySelectorAll(".btn--accent").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        GS.to(btn, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .45, duration: .4, ease: "power3.out" });
      });
      btn.addEventListener("mouseleave", function () { GS.to(btn, { x: 0, y: 0, duration: .6, ease: "elastic.out(1,.4)" }); });
    });
  }

  /* give section headers a reveal-on-scroll, and stagger their children */
  function tagReveals() {
    $$(".section__head").forEach(function (h) { h.classList.add("reveal"); });
  }

  /* subtle 3D tilt on service + work cards */
  function initTilt() {
    $$(".service, .work-card").forEach(function (card) {
      card.addEventListener("mouseenter", function () { card.style.transition = "transform .16s ease-out, box-shadow .4s ease"; });
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(900px) rotateX(" + (-py * 4.5).toFixed(2) + "deg) rotateY(" + (px * 5.5).toFixed(2) + "deg) translateY(-7px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transition = ""; card.style.transform = ""; });
    });
  }

  /* ============================ WORK GRID ============================ */
  function buildWork() {
    var grid = $("#work-grid");
    if (!grid) return;
    VIDEOS.forEach(function (v, i) {
      var li = document.createElement("li");
      li.className = "work-card bezel reveal";
      li.style.setProperty("--d", (i % 3));

      var thumb = "https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg";
      li.innerHTML =
        '<div class="bezel__inner work-card__inner">' +
          '<div class="video" role="button" tabindex="0" aria-label="تشغيل المقطع: ' + v.title + '" data-id="' + v.id + '">' +
            '<img class="video__thumb" src="' + thumb + '" alt="" loading="lazy" width="480" height="270" />' +
            '<span class="video__play" aria-hidden="true">' +
              '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
            '</span>' +
            '<span class="video__cap"><span class="tag">' + v.tag + '</span>' + v.title + '</span>' +
          '</div>' +
        '</div>';

      var video = $(".video", li);
      var img = $(".video__thumb", li);
      /* branded fallback poster if a thumbnail fails to load */
      img.addEventListener("error", function () {
        img.style.display = "none";
        video.style.background =
          "linear-gradient(150deg,#5d6b65,#3a4642 60%,#222b28)";
      });
      var play = function () { playVideo(video); };
      video.addEventListener("click", play);
      video.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
      });
      grid.appendChild(li);
    });
  }

  function playVideo(video) {
    if (video.classList.contains("is-playing")) return;
    var id = video.getAttribute("data-id");
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src",
      "https://www.youtube-nocookie.com/embed/" + id +
      "?autoplay=1&rel=0&modestbranding=1&playsinline=1");
    iframe.setAttribute("title", "مشغل يوتيوب");
    iframe.setAttribute("allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("loading", "lazy");
    video.appendChild(iframe);
    video.classList.add("is-playing");
    video.removeAttribute("role");
    video.removeAttribute("tabindex");
  }

  /* ============================ NAV ============================ */
  function initNav() {
    var nav = $(".nav");
    var burger = $("#nav-burger");
    var overlay = $("#nav-overlay");
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* mobile menu */
    var setOpen = function (open) {
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
      overlay.classList.toggle("is-open", open);
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      setOpen(!overlay.classList.contains("is-open"));
    });
    $$(".nav-overlay__link, .nav-overlay__foot a", overlay).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) setOpen(false);
    });

    /* active link via section observer */
    var links = $$(".nav__link");
    var map = {};
    links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
    var sections = ["about", "numbers", "services", "work", "contact"]
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("is-active"); });
            var act = map[en.target.id];
            if (act) act.classList.add("is-active");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      sections.forEach(function (s) { io.observe(s); });
    }
  }

  /* ============================ REVEAL ============================ */
  function initReveal() {
    var els = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ============================ COUNTERS ============================ */
  function initCounters() {
    var counters = $$(".counter");
    var fmt = function (n) { return n.toLocaleString("en-US"); };
    var run = function (el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      if (reduceMotion) { el.textContent = fmt(target); return; }
      var dur = 2200, start = null;
      var ease = function (t) { return 1 - Math.pow(1 - t, 5); }; /* easeOutQuint */
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        el.textContent = fmt(Math.round(ease(p) * target));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = fmt(target);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { counters.forEach(run); return; }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ============================ SCROLL PROGRESS ============================ */
  function initScrollProgress() {
    var bar = $(".scroll-progress span");
    if (!bar) return;
    var update = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || window.scrollY) / max : 0;
      bar.style.width = (p * 100).toFixed(2) + "%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ============================ TO TOP ============================ */
  function initToTop() {
    var btn = $("#to-top");
    if (!btn) return;
    var toggle = function () { btn.classList.toggle("is-visible", window.scrollY > 600); };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
    btn.addEventListener("click", function () { scrollToY(0); });
  }

  /* ============================ FORM ============================ */
  function initForm() {
    var form = $("#contact-form");
    if (!form) return;
    var note = $("#form-note");
    var WHATS = "966500250214";

    var setError = function (field, msg) {
      var wrap = field.closest(".field");
      var err = $('.field__error[data-for="' + field.id + '"]');
      wrap.classList.toggle("is-invalid", !!msg);
      if (err) err.textContent = msg || "";
      return !msg;
    };

    var validate = function () {
      var ok = true;
      var name = $("#f-name"), phone = $("#f-phone"), email = $("#f-email"), service = $("#f-service");
      ok = setError(name, name.value.trim() ? "" : "الرجاء إدخال الاسم") && ok;
      var pv = phone.value.replace(/[\s-]/g, "");
      ok = setError(phone, /^[+0-9]{8,15}$/.test(pv) ? "" : "أدخل رقم جوال صحيح") && ok;
      if (email.value.trim()) {
        ok = setError(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "" : "بريد إلكتروني غير صحيح") && ok;
      } else { setError(email, ""); }
      ok = setError(service, service.value ? "" : "اختر الخدمة المطلوبة") && ok;
      return ok;
    };

    /* validate on blur for filled fields */
    $$("input,select", form).forEach(function (inp) {
      inp.addEventListener("blur", function () { if (inp.value.trim()) validate(); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      note.className = "form__note";
      if (!validate()) {
        note.textContent = "يرجى تصحيح الحقول المظللة.";
        note.classList.add("is-err");
        var firstBad = $(".field.is-invalid input, .field.is-invalid select", form);
        if (firstBad) firstBad.focus();
        return;
      }
      var d = new FormData(form);
      var msg =
        "🟢 طلب جديد من موقع آيت\n" +
        "————————————\n" +
        "الاسم: " + d.get("name") + "\n" +
        "الجوال: " + d.get("phone") + "\n" +
        (d.get("email") ? "البريد: " + d.get("email") + "\n" : "") +
        "الخدمة: " + d.get("service") + "\n" +
        (d.get("message") ? "الرسالة: " + d.get("message") + "\n" : "");
      var url = "https://wa.me/" + WHATS + "?text=" + encodeURIComponent(msg);

      var btn = $(".form__submit", form);
      btn.classList.add("is-loading");
      window.open(url, "_blank", "noopener");
      setTimeout(function () {
        btn.classList.remove("is-loading");
        note.textContent = "تم تجهيز طلبك ✓ سيُفتح واتساب لإكمال الإرسال.";
        note.classList.add("is-ok");
        form.reset();
      }, 600);
    });
  }

  /* ============================ ANCHORS + SMOOTH ============================ */
  function navOffset() { return window.innerWidth <= 820 ? 86 : 104; }

  function scrollToY(y) {
    y = Math.max(0, Math.min(y, document.documentElement.scrollHeight - window.innerHeight));
    if (lenis) { lenis.scrollTo(y, { duration: 1.1 }); return; }
    if (reduceMotion) { window.scrollTo(0, y); return; }
    smoothTo(y);
  }

  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === "#" || href.length < 2) return;
      a.addEventListener("click", function (e) {
        var t = document.getElementById(href.slice(1));
        if (!t) return;
        e.preventDefault();
        var y = t.getBoundingClientRect().top + window.scrollY - navOffset();
        scrollToY(y);
        history.replaceState(null, "", href);
      });
    });
  }

  /* lightweight programmatic smooth-scroll (window-based; keeps fixed els intact) */
  var animId = null;
  function smoothTo(targetY) {
    cancelAnimationFrame(animId);
    var startY = window.scrollY, dist = targetY - startY;
    var dur = Math.min(1100, Math.max(450, Math.abs(dist) * 0.6)), start = null;
    var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      window.scrollTo(0, startY + dist * ease(p));
      if (p < 1) animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
  }

})();
