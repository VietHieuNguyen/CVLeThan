document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupContactForm();
});

function setupMobileMenu() {
  const header = document.querySelector(".header");
  const toggle = header?.querySelector(".menu-toggle");
  const nav = header?.querySelector(".nav");

  if (!header || !toggle || !nav) {
    return;
  }

  const closeMenu = () => {
    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Mở menu điều hướng");
  };

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

function setupContactForm() {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");

  if (!form || !status) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const urlField = form.querySelector('input[name="_url"]');

  if (urlField) {
    urlField.value = window.location.href;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const action = form.getAttribute("action") || "";
    const endpoint = action.includes("/ajax/") ? action : action.replace("formsubmit.co/", "formsubmit.co/ajax/");
    const originalLabel = submitButton ? submitButton.textContent : "";

    setStatus("Đang gửi tin nhắn...", "pending");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Đang gửi...";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      form.reset();

      if (urlField) {
        urlField.value = window.location.href;
      }

      setStatus(
        "Tin nhắn đã được gửi. Nếu đây là lần đầu dùng FormSubmit, hãy xác nhận email kích hoạt để bắt đầu nhận thư.",
        "success"
      );
    } catch (error) {
      setStatus(
        "Chưa gửi được lúc này. Bạn có thể thử lại hoặc gửi trực tiếp tới lethan0811@gmail.com.",
        "error"
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    }
  });

  function setStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
  }
}
