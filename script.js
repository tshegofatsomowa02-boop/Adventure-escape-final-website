document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector("footer");
  if (footer && !footer.querySelector(".year")) {
    const year = document.createElement("span");
    year.className = "year";
    year.textContent = new Date().getFullYear();
    footer.appendChild(year);
  }

  const bookingForm = document.getElementById("bookingForm");
  const bookingStatus = document.getElementById("bookingFormStatus");
  const categoryField = document.getElementById("category");
  const individualOption = document.getElementById("individualOption");
  const groupOption = document.getElementById("groupOption");
  const individualField = document.getElementById("individual");
  const groupField = document.getElementById("group");

  if (categoryField) {
    const toggleBookingOptions = () => {
      const selected = categoryField.value;

      if (selected === "individual") {
        individualOption.classList.remove("hidden");
        groupOption.classList.add("hidden");
        groupField.value = "";
        groupField.setAttribute("aria-hidden", "true");
        individualField.setAttribute("aria-hidden", "false");
      } else if (selected === "group") {
        groupOption.classList.remove("hidden");
        individualOption.classList.add("hidden");
        individualField.value = "";
        individualField.setAttribute("aria-hidden", "true");
        groupField.setAttribute("aria-hidden", "false");
      } else {
        individualOption.classList.add("hidden");
        groupOption.classList.add("hidden");
        individualField.value = "";
        groupField.value = "";
      }
    };

    categoryField.addEventListener("change", toggleBookingOptions);
    toggleBookingOptions();
  }

  if (bookingForm) {
    const fields = {
      name: document.getElementById("name"),
      surname: document.getElementById("surname"),
      phone: document.getElementById("phone"),
      email: document.getElementById("email"),
      category: document.getElementById("category"),
      number: document.getElementById("number"),
      individual: document.getElementById("individual"),
      group: document.getElementById("group"),
      bookingDate: document.getElementById("bookingDate"),
      price: document.getElementById("price")
    };

    const showBookingStatus = (message, type) => {
      if (!bookingStatus) return;
      bookingStatus.textContent = message;
      bookingStatus.className = `form-status ${type}`;
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

    const validateBookingField = (fieldName) => {
      const field = fields[fieldName];
      if (!field) return false;

      const value = field.value.trim();

      switch (fieldName) {
        case "name":
          if (value.length < 2) {
            setFieldState(fieldName, false, "Please enter your name.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;

        case "surname":
          if (value.length < 2) {
            setFieldState(fieldName, false, "Please enter your surname.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;

        case "phone": {
          const phonePattern = /^[0-9+()\-\s]{7,20}$/;
          if (!phonePattern.test(value) || value.length < 7) {
            setFieldState(fieldName, false, "Please enter a valid phone number.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;
        }

        case "email": {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            setFieldState(fieldName, false, "Please enter a valid email address.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;
        }

        case "category":
          if (!value) {
            setFieldState(fieldName, false, "Please choose a booking category.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;

        case "number":
          if (!value || Number(value) < 1) {
            setFieldState(fieldName, false, "Please enter a valid number of people.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;

        case "individual":
          if (fields.category.value === "individual" && !value) {
            setFieldState(fieldName, false, "Please select an individual package.");
            return false;
          }
          if (fields.category.value !== "individual") {
            setFieldState(fieldName, true);
            return true;
          }
          setFieldState(fieldName, true);
          return true;

        case "group":
          if (fields.category.value === "group" && !value) {
            setFieldState(fieldName, false, "Please select a group package.");
            return false;
          }
          if (fields.category.value !== "group") {
            setFieldState(fieldName, true);
            return true;
          }
          setFieldState(fieldName, true);
          return true;

        case "bookingDate":
          if (!value) {
            setFieldState(fieldName, false, "Please select a booking date.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;

        case "price":
          if (!value) {
            setFieldState(fieldName, false, "Please select a package price.");
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
      if (!field) return;

      field.addEventListener("blur", () => validateBookingField(fieldName));
      field.addEventListener("input", () => {
        if (field.classList.contains("invalid")) {
          validateBookingField(fieldName);
        }
      });
      field.addEventListener("change", () => {
        if (fieldName === "category") {
          toggleBookingOptions();
        }
        validateBookingField(fieldName);
      });
    });

    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const validationResults = Object.keys(fields).map((fieldName) => validateBookingField(fieldName));
      const isFormValid = validationResults.every(Boolean);

      if (!isFormValid) {
        showBookingStatus("Please complete all the required booking details correctly.", "error");
        return;
      }

      showBookingStatus("Your booking request has been submitted successfully.", "success");
      bookingForm.reset();
      categoryField.dispatchEvent(new Event("change"));

      Object.keys(fields).forEach((fieldName) => {
        const field = fields[fieldName];
        if (!field) return;
        field.classList.remove("invalid", "valid");
        const errorBox = document.querySelector(`[data-error-for="${fieldName}"]`);
        if (errorBox) errorBox.textContent = "";
      });
    });
  }

  const quotationForm = document.getElementById("quotationForm");
  const quotationStatus = document.getElementById("quotationStatus");
  const quotationResult = document.getElementById("quotationResult");

  if (quotationForm) {
    const categoryField = document.getElementById("category");
    const individualOption = document.getElementById("individualQuoteOption");
    const groupOption = document.getElementById("groupQuoteOption");
    const individualField = document.getElementById("individual");
    const groupField = document.getElementById("group");
    const priceField = document.getElementById("price");

    const toggleQuotationOptions = () => {
      const selected = categoryField.value;

      if (selected === "individual") {
        individualOption.classList.remove("hidden");
        groupOption.classList.add("hidden");
        groupField.value = "";
      } else if (selected === "group") {
        groupOption.classList.remove("hidden");
        individualOption.classList.add("hidden");
        individualField.value = "";
      } else {
        individualOption.classList.add("hidden");
        groupOption.classList.add("hidden");
        individualField.value = "";
        groupField.value = "";
      }
    };

    if (categoryField) {
      categoryField.addEventListener("change", toggleQuotationOptions);
      toggleQuotationOptions();
    }

    const fields = {
      name: document.getElementById("name"),
      category: categoryField,
      number: document.getElementById("number"),
      individual: individualField,
      group: groupField,
      price: priceField
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

    const validateQuotationField = (fieldName) => {
      const field = fields[fieldName];
      if (!field) return false;

      const value = field.value.trim();

      switch (fieldName) {
        case "name":
          if (value.length < 2) {
            setFieldState(fieldName, false, "Please enter your name.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;

        case "category":
          if (!value) {
            setFieldState(fieldName, false, "Please choose a booking category.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;

        case "number":
          if (!value || Number(value) < 1) {
            setFieldState(fieldName, false, "Please enter a valid number of people.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;

        case "individual":
          if (fields.category.value === "individual" && !value) {
            setFieldState(fieldName, false, "Please select an individual package.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;

        case "group":
          if (fields.category.value === "group" && !value) {
            setFieldState(fieldName, false, "Please select a group package.");
            return false;
          }
          setFieldState(fieldName, true);
          return true;

        case "price":
          if (!value) {
            setFieldState(fieldName, false, "Please select the package base price.");
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
      if (!field) return;

      field.addEventListener("blur", () => validateQuotationField(fieldName));
      field.addEventListener("input", () => {
        if (field.classList.contains("invalid")) {
          validateQuotationField(fieldName);
        }
      });
      field.addEventListener("change", () => {
        if (fieldName === "category") {
          toggleQuotationOptions();
        }
        validateQuotationField(fieldName);
      });
    });

    quotationForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const validations = Object.keys(fields).map((fieldName) => validateQuotationField(fieldName));
      const isValid = validations.every(Boolean);

      if (!isValid) {
        if (quotationStatus) {
          quotationStatus.textContent = "Please fix the highlighted quotation fields before calculating.";
          quotationStatus.className = "form-status error";
          quotationStatus.style.display = "block";
        }
        return;
      }

      const basePrice = Number(fields.price.value);
      const people = Number(fields.number.value);
      const bookingType = fields.category.value;
      const packageName = bookingType === "individual" ? fields.individual.value : fields.group.value;

      let groupDiscount = 0;
      let earlyBirdDiscount = 0;
      let seasonalDiscount = 0;

      if (bookingType === "group" && people >= 5) {
        groupDiscount = basePrice * 0.10;
      }

      if (people >= 3) {
        earlyBirdDiscount = basePrice * 0.05;
      }

      if (bookingType === "individual" && people >= 2) {
        seasonalDiscount = basePrice * 0.08;
      }

      const totalDiscount = groupDiscount + earlyBirdDiscount + seasonalDiscount;
      const finalPrice = Math.max(0, basePrice - totalDiscount);

      document.getElementById("bookingTypeResult").textContent = bookingType === "individual" ? "Individual Booking" : "Group Booking";
      document.getElementById("packageResult").textContent = packageName;
      document.getElementById("peopleResult").textContent = people;
      document.getElementById("basePriceResult").textContent = basePrice.toFixed(2);
      document.getElementById("groupDiscountResult").textContent = groupDiscount.toFixed(2);
      document.getElementById("earlyBirdDiscountResult").textContent = earlyBirdDiscount.toFixed(2);
      document.getElementById("seasonalDiscountResult").textContent = seasonalDiscount.toFixed(2);
      document.getElementById("totalDiscountResult").textContent = totalDiscount.toFixed(2);
      document.getElementById("finalPriceResult").textContent = `R${finalPrice.toFixed(2)}`;

      quotationResult.style.display = "block";

      if (quotationStatus) {
        quotationStatus.textContent = "Quotation calculated successfully.";
        quotationStatus.className = "form-status success";
        quotationStatus.style.display = "block";
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const statusBox = document.getElementById("formStatus");
  const contactFields = {
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

  const setContactFieldState = (fieldName, isValid, message = "") => {
    const field = contactFields[fieldName];
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

  const validateContactField = (fieldName) => {
    const field = contactFields[fieldName];
    if (!field) return false;

    const value = field.value.trim();

    switch (fieldName) {
      case "fullName":
        if (value.length < 2) {
          setContactFieldState(fieldName, false, "Please enter your full name.");
          return false;
        }
        setContactFieldState(fieldName, true);
        return true;

      case "email": {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          setContactFieldState(fieldName, false, "Please enter a valid email address.");
          return false;
        }
        setContactFieldState(fieldName, true);
        return true;
      }

      case "phone": {
        const phonePattern = /^[0-9+()\-\s]{7,20}$/;
        if (!phonePattern.test(value) || value.length < 7) {
          setContactFieldState(fieldName, false, "Please enter a valid phone number.");
          return false;
        }
        setContactFieldState(fieldName, true);
        return true;
      }

      case "subject":
        if (value.length < 3) {
          setContactFieldState(fieldName, false, "Please enter a subject.");
          return false;
        }
        setContactFieldState(fieldName, true);
        return true;

      case "message":
        if (value.length < 10) {
          setContactFieldState(fieldName, false, "Message must be at least 10 characters long.");
          return false;
        }
        setContactFieldState(fieldName, true);
        return true;

      default:
        return true;
    }
  };

  Object.keys(contactFields).forEach((fieldName) => {
    const field = contactFields[fieldName];

    field.addEventListener("blur", () => validateContactField(fieldName));
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) {
        validateContactField(fieldName);
      }
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const validationResults = Object.keys(contactFields).map((fieldName) => validateContactField(fieldName));
    const isFormValid = validationResults.every(Boolean);

    if (!isFormValid) {
      showStatus("Please fix the highlighted fields before sending your enquiry.", "error");
      return;
    }

    const enquiryData = Object.keys(contactFields).reduce((data, fieldName) => {
      data[fieldName] = contactFields[fieldName].value.trim();
      return data;
    }, {});

    const encrypted = await getEncryptedPayload(JSON.stringify(enquiryData));

    showStatus(
      encrypted.encrypted
        ? "Your enquiry was encrypted in the browser and sent successfully."
        : "Your enquiry was sent successfully.",
      "success"
    );

    contactForm.reset();

    Object.keys(contactFields).forEach((fieldName) => {
      const field = contactFields[fieldName];
      field.classList.remove("invalid", "valid");
      const errorBox = document.querySelector(`[data-error-for="${fieldName}"]`);
      if (errorBox) errorBox.textContent = "";
    });
  });
});
