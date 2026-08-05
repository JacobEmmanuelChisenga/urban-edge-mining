/**
 * UrbanEdge — modern WhatsApp chat widget (vanilla JS)
 */
(function () {
  var PHONE = "260962933617";
  var DEFAULT_MESSAGE =
    "Hello Urban Edge Mining.\nI would like to request a quotation for your services.";
  var POPUP_LINES = [
    "Hello 👋",
    "Welcome to Urban Edge Mining.",
    "",
    "Need a quotation or have questions about our Mining, Civil Engineering, Construction or Mechanical Engineering services?",
    "",
    "Our team is ready to assist you.",
  ];
  var AUTO_OPEN_MS = 5000;

  function buildMarkup() {
    var bubbleHtml = POPUP_LINES.map(function (line) {
      return line ? "<p>" + line + "</p>" : "";
    }).join("");

    return (
      '<div class="wa-widget" id="waWidget" aria-live="polite">' +
      '  <div class="wa-widget__panel" role="dialog" aria-label="WhatsApp chat" aria-hidden="true">' +
      '    <header class="wa-widget__header">' +
      '      <div class="wa-widget__brand">' +
      '        <span class="wa-widget__avatar" aria-hidden="true">' +
      '          <img src="assets/images/logo/logo.png" alt="" width="36" height="36" decoding="async" />' +
      "        </span>" +
      "        <div class=\"wa-widget__brand-text\">" +
      "          <strong>Urban Edge Mining</strong>" +
      '          <span class="wa-widget__status"><span class="wa-widget__status-dot" aria-hidden="true"></span>Typically replies within a few hours</span>' +
      "        </div>" +
      "      </div>" +
      '      <button type="button" class="wa-widget__close" aria-label="Close chat">&times;</button>' +
      "    </header>" +
      '    <div class="wa-widget__body">' +
      '      <div class="wa-widget__bubble">' + bubbleHtml + "</div>" +
      "    </div>" +
      '    <footer class="wa-widget__footer">' +
      '      <textarea class="wa-widget__input" rows="3" aria-label="Your message">' +
      DEFAULT_MESSAGE +
      "</textarea>" +
      '      <button type="button" class="wa-widget__send">' +
      '        <i class="bi bi-whatsapp" aria-hidden="true"></i> Start Chat' +
      "      </button>" +
      "    </footer>" +
      "  </div>" +
      '  <button type="button" class="wa-widget__toggle" aria-label="Open WhatsApp chat" aria-expanded="false">' +
      '    <i class="bi bi-whatsapp" aria-hidden="true"></i>' +
      "  </button>" +
      "</div>"
    );
  }

  function openChat(widget, panel, toggle) {
    widget.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeChat(widget, panel, toggle) {
    widget.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
  }

  function sendMessage(message) {
    var url =
      "https://wa.me/" +
      PHONE +
      "?text=" +
      encodeURIComponent(message.trim() || DEFAULT_MESSAGE);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function init() {
    document.body.insertAdjacentHTML("beforeend", buildMarkup());

    var widget = document.getElementById("waWidget");
    if (!widget) return;

    var panel = widget.querySelector(".wa-widget__panel");
    var toggle = widget.querySelector(".wa-widget__toggle");
    var closeBtn = widget.querySelector(".wa-widget__close");
    var sendBtn = widget.querySelector(".wa-widget__send");
    var input = widget.querySelector(".wa-widget__input");
    var autoOpened = false;

    toggle.addEventListener("click", function () {
      if (widget.classList.contains("is-open")) {
        closeChat(widget, panel, toggle);
      } else {
        openChat(widget, panel, toggle);
        input.focus();
      }
    });

    closeBtn.addEventListener("click", function () {
      closeChat(widget, panel, toggle);
    });

    sendBtn.addEventListener("click", function () {
      sendMessage(input.value);
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage(input.value);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && widget.classList.contains("is-open")) {
        closeChat(widget, panel, toggle);
      }
    });

    setTimeout(function () {
      if (!autoOpened && !widget.classList.contains("is-open")) {
        openChat(widget, panel, toggle);
        autoOpened = true;
      }
    }, AUTO_OPEN_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
