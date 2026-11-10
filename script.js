document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector("footer");
  if (footer && !footer.querySelector(".year")) {
    const year = document.createElement("span");
    year.className = "year";
    year.textContent = new Date().getFullYear();
    footer.appendChild(year);
  }

  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusBox = document.getElementById("formStatus");
  const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message")
  };

  const toBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  };

  const getEncryptedPayload = async (text) => {
    if (!window.crypto || !window.crypto.subtle) {
      return { encrypted: false, value: text };
    }

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode("AdventureEscapeSA-2026-Secret-Key"),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("AdventureEscapeSA-Salt"),
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoder.encode(text)
    );

    return {
      encrypted: true,
      payload: {
        iv: toBase64(iv),
        data: toBase64(encrypted)
      }
    };
  };

  const showStatus = (message, type) => {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.className = `form-status ${type}`;
  };

  const setFieldState = (fieldName, isValid, message = "") => {
    const field = fields[fieldName];
    const errorBox = document.querySelector(`[data-error-for="${fieldName}"]`);

    if (!field || !errorBox) return;

    field.classList.remove("invalid", "valid");

    if (!isValid) {
      field.classList.add("invalid");
      errorBox.textContent = message;
      return;
    }

    field.classList.add("valid");
    errorBox.textContent = "";
  };

  const validateField = (fieldName) => {
    const field = fields[fieldName];
    if (!field) return false;

    const value = field.value.trim();

    switch (fieldName) {
      case "fullName":
        if (value.length < 2) {
          setFieldState(fieldName, false, "Please enter your full name.");
          return false;
        }
        setFieldState(fieldName, true);
        return true;

      case "email": {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          setFieldState(fieldName, false, "Please enter a valid email address.");
          return false;
        }
        setFieldState(fieldName, true);
        return true;
      }

      case "phone": {
        const phonePattern = /^[0-9+()\-\s]{7,20}$/;
        if (!phonePattern.test(value) || value.length < 7) {
          setFieldState(fieldName, false, "Please enter a valid phone number.");
          return false;
        }
        setFieldState(fieldName, true);
        return true;
      }

      case "subject":
        if (value.length < 3) {
          setFieldState(fieldName, false, "Please enter a subject.");
          return false;
        }
        setFieldState(fieldName, true);
        return true;

      case "message":
        if (value.length < 10) {
          setFieldState(fieldName, false, "Message must be at least 10 characters long.");
          return false;
        }
        setFieldState(fieldName, true);
        return true;

      default:
        return true;
    }
  };

  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];

    field.addEventListener("blur", () => validateField(fieldName));
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) {
        validateField(fieldName);
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const validationResults = Object.keys(fields).map((fieldName) => validateField(fieldName));
    const isFormValid = validationResults.every(Boolean);

    if (!isFormValid) {
      showStatus("Please fix the highlighted fields before sending your enquiry.", "error");
      return;
    }

    const enquiryData = Object.keys(fields).reduce((data, fieldName) => {
      data[fieldName] = fields[fieldName].value.trim();
      return data;
    }, {});

    const encrypted = await getEncryptedPayload(JSON.stringify(enquiryData));

    showStatus(
      encrypted.encrypted
        ? "Your enquiry was encrypted in the browser and sent successfully."
        : "Your enquiry was sent successfully.",
      "success"
    );

    console.log("Encrypted enquiry data:", encrypted);
    form.reset();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      field.classList.remove("invalid", "valid");
      const errorBox = document.querySelector(`[data-error-for="${fieldName}"]`);
      if (errorBox) errorBox.textContent = "";
    });
  });
});
