/* =========================================================
   CONSTRUTORA MENDES — script.js
   ---------------------------------------------------------
   1) CONFIGURAÇÕES — edite somente este bloco para alterar
      número de WhatsApp, endereço, CNPJ, e-mail e redes.
   2) Lógica do site (menu, links do WhatsApp, mapa, rodapé).
   ========================================================= */

/* ---------------------------------------------------------
   1) CONFIGURAÇÕES FÁCEIS DE EDITAR
   --------------------------------------------------------- */
const CONFIG = {
  // WhatsApp comercial: código do país + DDD + número, apenas dígitos.
  whatsappNumber: "5563993121059",
  whatsappDisplay: "(63) 99312-1059",

  // Endereço (usado no rodapé e no botão "Como chegar").
  addressLine1: "Rua 7 de Setembro, Casa 1º",
  addressLine2: "Santa Maria — TO.",
  // Texto usado na pesquisa do Google Maps (sem coordenadas inventadas).
  mapsQuery: "Rua 7 de Setembro, Santa Maria, Tocantins, Brasil",

  // Dados cadastrais e redes sociais.
  // Deixe vazio ("") enquanto não existirem: o site mostrará "Indisponível no momento."
  // Para ativar, preencha, por exemplo:
  //   cnpj: "00.000.000/0000-00"
  //   email: "contato@seudominio.com.br"
  //   instagram: "https://www.instagram.com/seuperfil"
  //   facebook: "https://www.facebook.com/suapagina"
  cnpj: "",
  email: "",
  instagram: "",
  facebook: "",

  // Mensagens do WhatsApp por categoria (o site codifica automaticamente).
  messages: {
    geral: "Olá! Vim pelo site da Construtora Mendes e gostaria de solicitar um orçamento.",
    construcao: "Olá! Vim pelo site da Construtora Mendes e gostaria de solicitar um orçamento para um serviço de construção.",
    reformas: "Olá! Gostaria de solicitar um orçamento para uma reforma.",
    seguranca: "Olá! Tenho interesse em serviços de instalação de câmeras e segurança eletrônica.",
    eletricista: "Olá! Gostaria de solicitar um orçamento para serviços elétricos.",
    manutencao: "Olá! Preciso de um serviço de manutenção.",
    outros: "Olá! Gostaria de consultar a Construtora Mendes sobre outro serviço."
  }
};

/* ---------------------------------------------------------
   2) LÓGICA DO SITE
   --------------------------------------------------------- */
(function () {
  "use strict";

  /** Monta o link wa.me com a mensagem codificada. */
  function buildWhatsAppLink(key) {
    var text = CONFIG.messages[key] || CONFIG.messages.geral;
    return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text);
  }

  /** Aplica os links do WhatsApp em todo elemento com data-wa="chave". */
  function setupWhatsAppLinks() {
    var links = document.querySelectorAll("[data-wa]");
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute("href", buildWhatsAppLink(links[i].getAttribute("data-wa")));
    }
  }

  /** Botão "Como chegar": pesquisa o endereço no Google Maps. */
  function setupMapsLink() {
    var btn = document.getElementById("btnMapa");
    if (btn) {
      btn.setAttribute(
        "href",
        "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery)
      );
    }
  }

  /** Preenche textos configuráveis (endereço, telefone exibido). */
  function setupTexts() {
    var map = {
      "address-line1": CONFIG.addressLine1,
      "address-line2": CONFIG.addressLine2,
      "phone-display": CONFIG.whatsappDisplay
    };
    var els = document.querySelectorAll("[data-config]");
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute("data-config");
      if (map[key]) { els[i].textContent = map[key]; }
    }
  }

  /** Rodapé: mostra link só quando o dado existir; senão, "Indisponível no momento." */
  function setupFooterFields() {
    var fields = {
      cnpj: { value: CONFIG.cnpj, href: null },
      email: { value: CONFIG.email, href: CONFIG.email ? "mailto:" + CONFIG.email : null },
      instagram: { value: CONFIG.instagram, href: CONFIG.instagram },
      facebook: { value: CONFIG.facebook, href: CONFIG.facebook }
    };

    Object.keys(fields).forEach(function (name) {
      var el = document.querySelector('[data-field="' + name + '"]');
      var f = fields[name];
      if (!el || !f.value) { return; }

      if (f.href) {
        var a = document.createElement("a");
        a.href = f.href;
        a.textContent = (name === "instagram" || name === "facebook") ? f.value.replace(/^https?:\/\/(www\.)?/, "") : f.value;
        if (name !== "email") {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
        el.textContent = "";
        el.appendChild(a);
      } else {
        el.textContent = f.value;
      }
    });
  }

  /** Menu responsivo (celular). */
  function setupMenu() {
    var toggle = document.getElementById("menuToggle");
    var nav = document.getElementById("menuPrincipal");
    if (!toggle || !nav) { return; }

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      var label = toggle.querySelector(".sr-only");
      if (label) { label.textContent = open ? "Fechar menu" : "Abrir menu"; }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Fecha ao clicar em um item
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { setOpen(false); }
    });

    // Fecha com ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setOpen(false); }
    });

    // Fecha ao voltar para a tela grande
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1000) { setOpen(false); }
    });
  }

  /** Destaca no menu a seção atual (sem animações). */
  function setupActiveLink() {
    var links = document.querySelectorAll(".main-nav a");
    var targets = [];
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) { targets.push({ link: links[i], el: el }); }
    }

    function update() {
      var y = window.scrollY + 120;
      var current = null;
      targets.forEach(function (t) {
        if (t.el.getBoundingClientRect().top + window.scrollY <= y) { current = t; }
      });
      targets.forEach(function (t) {
        t.link.classList.toggle("is-active", t === current);
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /** Ano atual no rodapé. */
  function setupYear() {
    var el = document.getElementById("ano");
    if (el) { el.textContent = new Date().getFullYear(); }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupWhatsAppLinks();
    setupMapsLink();
    setupTexts();
    setupFooterFields();
    setupMenu();
    setupActiveLink();
    setupYear();
  });
})();
