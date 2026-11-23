(() => {
  "use strict";

  const WEDDING_TARGET_ISO = "2027-02-16T19:30:00+05:30";
  const WEDDING_END_ISO = "2027-02-17T02:00:00+05:30";

  /**
   * Live vanilla JavaScript countdown timer to February 16, 2027 (IST).
   */
  function initCountdown() {
    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minutesEl = document.getElementById("cd-minutes");
    const secondsEl = document.getElementById("cd-seconds");
    const statusEl = document.getElementById("countdown-status");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const targetTime = Date.parse(WEDDING_TARGET_ISO);
    const endTime = Date.parse(WEDDING_END_ISO);
    const lastRendered = { days: "", hours: "", minutes: "", seconds: "" };

    function setUnit(el, key, value) {
      if (lastRendered[key] !== value) {
        el.textContent = value;
        lastRendered[key] = value;
      }
    }

    function tick() {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setUnit(daysEl, "days", "00");
        setUnit(hoursEl, "hours", "00");
        setUnit(minutesEl, "minutes", "00");
        setUnit(secondsEl, "seconds", "00");

        if (statusEl) {
          statusEl.textContent =
            now <= endTime
              ? "Today is the Wedding Day — Let the celebrations begin!"
              : "Happily Celebrating — Thank you for sharing in our joy!";
          statusEl.classList.remove("hidden");
        }
        return false;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setUnit(daysEl, "days", String(days).padStart(2, "0"));
      setUnit(hoursEl, "hours", String(hours).padStart(2, "0"));
      setUnit(minutesEl, "minutes", String(minutes).padStart(2, "0"));
      setUnit(secondsEl, "seconds", String(seconds).padStart(2, "0"));
      return true;
    }

    const shouldContinue = tick();
    if (!shouldContinue) return;

    const timerId = window.setInterval(() => {
      if (!tick()) {
        window.clearInterval(timerId);
      }
    }, 1000);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        tick();
      }
    });
  }

  /**
   * Highlights the active navigation link based on scroll position.
   */
  function initNavObserver() {
    const navLinks = Array.from(document.querySelectorAll(".nav-link[href^='#']"));
    if (!navLinks.length || typeof IntersectionObserver === "undefined") return;

    const linkBySectionId = new Map();
    for (const link of navLinks) {
      const id = link.getAttribute("href")?.slice(1);
      if (id) linkBySectionId.set(id, link);
    }

    const sections = Array.from(linkBySectionId.keys())
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const link of navLinks) {
            link.removeAttribute("aria-current");
          }
          const activeLink = linkBySectionId.get(entry.target.id);
          if (activeLink) {
            activeLink.setAttribute("aria-current", "location");
          }
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    for (const section of sections) {
      observer.observe(section);
    }
  }

  /**
   * Progressive IntersectionObserver reveal fallback when native CSS scroll-driven
   * view timelines are unavailable (e.g., Firefox) and user allows motion.
   */
  function initScrollReveals() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const supportsNativeViewTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports("(animation-timeline: view()) and (animation-range: entry)");

    if (supportsNativeViewTimeline || typeof IntersectionObserver === "undefined") return;

    const elements = document.querySelectorAll(".reveal-on-scroll");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    for (const el of elements) {
      el.classList.add("reveal-fallback");
      observer.observe(el);
    }
  }

  /**
   * Generates and downloads a valid .ics calendar invite for February 16, 2027.
   */
  function downloadWeddingCalendar(guestName) {
    const summary = "Sushmit & Manaswita's Wedding Celebrations";
    const location = "Beldhi Golf Course, Northern Town, Bistupur, Jamshedpur, Jharkhand 831001";
    const description =
      `Wedding Celebrations of Sushmit & Manaswita (14–16 February 2027).\n` +
      `• Feb 14: Mehendi (7:00 PM onwards, F Road, Sonari West)\n` +
      `• Feb 15: Sangeet & Ring Ceremony (7:00 PM onwards, F Road, Sonari West)\n` +
      `• Feb 16: Haldi (10:00 AM onwards, F Road, Sonari West)\n` +
      `• Feb 16: The Wedding Ceremony & Reception (7:00 PM onwards, 8:00 PM Baraat at Beldhi Golf Course, Jamshedpur)\n` +
      `With warm blessings from Chandra Shekhar Prasad, Indira Dutta, Bhaskar Datta, Rama Sutradhar Datta & Families.` +
      (guestName ? ` Reserved for ${guestName}.` : "");

    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sushmit & Manaswita Wedding//Invitation//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:sushmit-manaswita-20270216@beldhigolfcourse",
      "DTSTAMP:20261110T073000Z",
      "DTSTART:20270216T140000Z",
      "DTEND:20270216T193000Z",
      `SUMMARY:${summary}`,
      `LOCATION:${location}`,
      `DESCRIPTION:${description}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sushmit-manaswita-wedding.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Remote RSVP Backend Configuration.
   * Connect your RSVP form to Google Forms (or Google Sheets Apps Script).
   *
   * OPTION 1: Google Form (Recommended — no coding required, auto-syncs to Google Sheets)
   * 1. Create a Google Form with fields:
   *    - Guest Full Name (Short answer)
   *    - Number of Attendees (Short answer or Dropdown 1-10)
   *    - Events Attending (Checkboxes: Mehandi, Sangeet & Ring Ceremony, Haldi, Wedding & Reception)
   *    - Ready to Dance? (Multiple choice: "Yes! Save us a spot on the Sangeet dance floor", "Cheering warmly from the sidelines")
   *    - Warm Wishes / Note (Paragraph)
   * 2. Click the 3 dots (⋮) in the top-right of Google Forms -> "Get pre-filled link".
   * 3. Fill sample dummy answers into each field, click "Get link", and copy the link.
   * 4. Change "/viewform" at the end of the URL to "/formResponse", and paste it into endpointUrl below.
   * 5. Copy the "entry.123456789" parameters from the prefilled link into googleFormEntries below.
   * 6. Set enabled: true.
   *
   * OPTION 2: Google Apps Script Web App (Direct to Google Sheets via Webhook)
   * Paste your Apps Script Web App URL into endpointUrl and set isGoogleForm: false.
   */
  const RSVP_REMOTE_CONFIG = {
    // Connected to live Google Form & Sheet
    enabled: true,

    // Google Form formResponse endpoint:
    endpointUrl: "https://docs.google.com/forms/d/e/1FAIpQLScyzcyeE0xJjS_eLL8TdvoHqPNJzAEwBbxVuWM_P-3q0JU-Bg/formResponse",

    // Uses entry.* IDs and no-cors background post to avoid leaving the website
    isGoogleForm: true,

    // Verified Field IDs from published Google Form:
    googleFormEntries: {
      guestName: "entry.1008193965",
      guestPhone: "entry.1198403533",
      attendeesCount: "entry.190468016",
      events: "entry.1448873091",
      hotelAssistance: "entry.776531113",
      cabAssistance: "entry.1790014294",
      stationPickup: "", // Dedicated entry ID if added to Google Form (falls back to notes)
      readyToDance: "entry.1497753158",
      guestNote: "entry.771374680",
    },
  };

  /**
   * Initializes RSVP form controls, accessible validation, and confirmation view.
   */
  function initRsvpForm() {
    const form = document.getElementById("rsvp-form");
    const confirmation = document.getElementById("rsvp-confirmation");
    if (!form || !confirmation) return;

    const nameInput = document.getElementById("guest-name");
    const phoneInput = document.getElementById("guest-phone");
    const attendeesInput = document.getElementById("attendees-count");
    const decBtn = document.getElementById("dec-guests");
    const incBtn = document.getElementById("inc-guests");
    const suffixEl = document.getElementById("guests-label-suffix");
    const hotelCheckbox = document.getElementById("hotel-assistance");
    const cabCheckbox = document.getElementById("cab-assistance");
    const stationPickupCheckbox = document.getElementById("station-pickup");
    const danceToggle = document.getElementById("ready-to-dance");
    const danceStatusEl = document.getElementById("dance-status-text");
    const formAlert = document.getElementById("rsvp-form-alert");
    const confirmGreeting = document.getElementById("confirm-greeting");
    const confirmSummary = document.getElementById("confirm-summary");
    const downloadIcsBtn = document.getElementById("download-ics-btn");
    const editRsvpBtn = document.getElementById("edit-rsvp-btn");

    const supportsUserInvalid =
      typeof CSS !== "undefined" && CSS.supports("selector(:user-invalid)");
    const interactionState = new WeakMap();
    let lastSubmittedName = "";

    function updateGuestSuffix() {
      if (!attendeesInput || !suffixEl) return;
      const count = Number.parseInt(attendeesInput.value, 10);
      suffixEl.textContent = count === 1 ? "Guest" : "Guests";
    }

    function adjustAttendees(delta) {
      if (!attendeesInput) return;
      const min = Number.parseInt(attendeesInput.min || "1", 10);
      const max = Number.parseInt(attendeesInput.max || "10", 10);
      const current = Number.parseInt(attendeesInput.value, 10);
      const safeCurrent = Number.isNaN(current) ? 1 : current;
      const next = Math.min(max, Math.max(min, safeCurrent + delta));
      attendeesInput.value = String(next);
      attendeesInput.setCustomValidity("");
      syncFieldValidity(attendeesInput, true);
      updateGuestSuffix();
    }

    function validateTrimmedName() {
      if (!nameInput) return;
      if (nameInput.value.trim().length === 0) {
        nameInput.setCustomValidity("Please share your name so we can reserve your welcome.");
      } else {
        nameInput.setCustomValidity("");
      }
    }

    function syncFieldValidity(input, forceShow = false) {
      if (!input || !input.checkValidity) return true;
      if (input === nameInput) validateTrimmedName();

      const valid = input.checkValidity();
      const state = interactionState.get(input) || { blurred: false };

      if (!valid && (forceShow || state.blurred)) {
        input.setAttribute("aria-invalid", "true");
        if (!supportsUserInvalid) {
          input.classList.add("user-invalid-fallback");
          input.classList.remove("user-valid-fallback");
        }
      } else if (valid) {
        input.removeAttribute("aria-invalid");
        if (!supportsUserInvalid) {
          input.classList.remove("user-invalid-fallback");
          if (state.blurred) input.classList.add("user-valid-fallback");
        }
      }
      return valid;
    }

    if (decBtn) {
      decBtn.addEventListener("click", () => adjustAttendees(-1));
    }

    if (incBtn) {
      incBtn.addEventListener("click", () => adjustAttendees(1));
    }

    if (attendeesInput) {
      attendeesInput.addEventListener("input", () => {
        updateGuestSuffix();
        if (attendeesInput.hasAttribute("aria-invalid")) {
          syncFieldValidity(attendeesInput, true);
        }
      });
    }

    if (danceToggle && danceStatusEl) {
      const updateDanceText = () => {
        danceStatusEl.textContent = danceToggle.checked
          ? "Yes! Save us a spot on the Sangeet dance floor"
          : "Cheering warmly from the sidelines";
      };
      danceToggle.addEventListener("change", updateDanceText);
      updateDanceText();
    }

    const requiredInputs = [nameInput, attendeesInput].filter(Boolean);

    for (const input of requiredInputs) {
      input.addEventListener("blur", () => {
        interactionState.set(input, { blurred: true });
        syncFieldValidity(input, true);
      });

      input.addEventListener("input", () => {
        if (input === nameInput) validateTrimmedName();
        if (input.checkValidity()) {
          input.removeAttribute("aria-invalid");
          input.classList.remove("user-invalid-fallback");
          if (formAlert) formAlert.classList.add("hidden");
        }
      });
    }

    function renderSummaryRow(label, value) {
      const wrapper = document.createElement("div");
      wrapper.className = "rounded-lg bg-white/80 px-3 py-2 border border-cream-200";
      const dt = document.createElement("dt");
      dt.className = "text-[0.7rem] font-semibold uppercase tracking-wider text-gold-700";
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.className = "mt-0.5 font-medium text-emerald-900";
      dd.textContent = value;
      wrapper.append(dt, dd);
      return wrapper;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      let firstInvalid = null;
      for (const input of requiredInputs) {
        interactionState.set(input, { blurred: true });
        const valid = syncFieldValidity(input, true);
        if (!valid && !firstInvalid) {
          firstInvalid = input;
        }
      }

      if (firstInvalid) {
        if (formAlert) {
          formAlert.textContent = "Please complete the highlighted required fields before submitting your RSVP.";
          formAlert.classList.remove("hidden");
        }
        firstInvalid.focus();
        return;
      }

      if (formAlert) formAlert.classList.add("hidden");

      const guestName = nameInput.value.trim();
      const guestPhone = phoneInput ? phoneInput.value.trim() : "";
      const attendeesCount = Number.parseInt(attendeesInput.value, 10) || 1;
      const selectedEvents = Array.from(form.querySelectorAll('input[name="events"]:checked')).map(
        (el) => el.value
      );
      const hotelRequested = Boolean(hotelCheckbox && hotelCheckbox.checked);
      const cabRequested = Boolean(cabCheckbox && cabCheckbox.checked);
      const stationPickupRequested = Boolean(stationPickupCheckbox && stationPickupCheckbox.checked);
      const readyToDance = Boolean(danceToggle && danceToggle.checked);
      const guestNote = document.getElementById("guest-note")?.value.trim() || "";

      lastSubmittedName = guestName;

      // Provide visual loading state on submit button
      const submitBtn = document.getElementById("rsvp-submit-btn");
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");
        submitBtn.innerHTML = `
          <svg class="h-4 w-4 animate-spin text-gold-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25" stroke="currentColor"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          <span>Saving Your RSVP...</span>
        `;
      }

      // If remote backend (Google Forms or Google Apps Script) is enabled:
      if (RSVP_REMOTE_CONFIG.enabled && RSVP_REMOTE_CONFIG.endpointUrl) {
        try {
          if (RSVP_REMOTE_CONFIG.isGoogleForm) {
            const payload = new FormData();
            const entries = RSVP_REMOTE_CONFIG.googleFormEntries;
            if (entries.guestName) payload.append(entries.guestName, guestName);
            if (entries.guestPhone && guestPhone) payload.append(entries.guestPhone, guestPhone);
            if (entries.attendeesCount) payload.append(entries.attendeesCount, String(attendeesCount));
            if (entries.events) {
              if (selectedEvents.length) {
                for (const ev of selectedEvents) {
                  payload.append(entries.events, ev);
                }
              } else {
                payload.append(entries.events, "None selected");
              }
            }
            if (entries.hotelAssistance) {
              payload.append(
                entries.hotelAssistance,
                hotelRequested
                  ? "Yes — please help coordinate hotel accommodation in Jamshedpur"
                  : "No — arrangements already made / not required"
              );
            }
            if (entries.cabAssistance) {
              payload.append(
                entries.cabAssistance,
                cabRequested
                  ? "Yes — need assistance / cab coordination from Ranchi to Jamshedpur"
                  : "No — travel arrangements already made"
              );
            }
            if (entries.stationPickup) {
              payload.append(
                entries.stationPickup,
                stationPickupRequested
                  ? "Yes — pickup assistance requested at Tatanagar Railway Station (TATA)"
                  : "No — station pickup not required"
              );
            }
            if (entries.readyToDance) {
              payload.append(
                entries.readyToDance,
                readyToDance
                  ? "Yes! Save us a spot on the Sangeet dance floor"
                  : "Cheering warmly from the sidelines"
              );
            }

            // If station pickup was requested but no dedicated entry ID exists yet in Google Forms,
            // prepend note tag so hosts see it directly in their Google Sheet.
            let finalNote = guestNote;
            if (stationPickupRequested && !entries.stationPickup) {
              finalNote = finalNote
                ? `[Tatanagar Railway Station Pickup Requested]\n${finalNote}`
                : `[Tatanagar Railway Station Pickup Requested]`;
            }

            if (entries.guestNote && finalNote) {
              payload.append(entries.guestNote, finalNote);
            }

            payload.append("fvv", "1");
            payload.append("pageHistory", "0");

            // Google Forms accepts background POST via no-cors mode without CORS blocks
            await fetch(RSVP_REMOTE_CONFIG.endpointUrl, {
              method: "POST",
              mode: "no-cors",
              body: payload,
            });
          } else {
            // Google Apps Script Web App or custom webhook
            await fetch(RSVP_REMOTE_CONFIG.endpointUrl, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                guestName,
                guestPhone: guestPhone || "Not provided",
                attendeesCount: String(attendeesCount),
                events: selectedEvents.join(", "),
                hotelAssistance: hotelRequested ? "Requested" : "Not needed",
                cabAssistance: cabRequested ? "Requested" : "Not needed",
                stationPickup: stationPickupRequested ? "Requested (Tatanagar Junction)" : "Not needed",
                readyToDance: readyToDance ? "Yes" : "No",
                guestNote,
                submittedAt: new Date().toISOString(),
              }),
            });
          }
        } catch (err) {
          console.warn("Remote RSVP submission note:", err);
          // Always proceed so guest confirmation is never blocked by network anomalies
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
        submitBtn.innerHTML = originalBtnHtml;
      }

      if (confirmGreeting) {
        confirmGreeting.textContent = `Thank You, ${guestName}!`;
      }

      if (confirmSummary) {
        const summaryRows = [
          renderSummaryRow("Guest / Family", guestName),
          renderSummaryRow("Party Size", `${attendeesCount} ${attendeesCount === 1 ? "Guest" : "Guests"}`),
        ];

        if (guestPhone) {
          summaryRows.push(renderSummaryRow("Phone / WhatsApp", guestPhone));
        }

        summaryRows.push(
          renderSummaryRow(
            "Events Attending",
            selectedEvents.length ? selectedEvents.join(", ") : "Wedding Celebrations"
          ),
          renderSummaryRow(
            "Hotel Assistance",
            hotelRequested ? "Requested (Hospitality team will reach out)" : "Arrangements made / Not needed"
          ),
          renderSummaryRow(
            "Ranchi Cab Transfer",
            cabRequested ? "Requested (Coordination team will connect)" : "Not required"
          ),
          renderSummaryRow(
            "Station Pickup",
            stationPickupRequested ? "Requested (Tatanagar Junction / TATA)" : "Not required"
          ),
          renderSummaryRow(
            "Ready to Dance?",
            readyToDance ? "Yes — Bring on the Sangeet beats!" : "Cheering happily from the crowd"
          )
        );

        if (guestNote) {
          const noteNode = renderSummaryRow("Your Note", guestNote);
          noteNode.classList.add("sm:col-span-2");
          summaryRows.push(noteNode);
        }

        confirmSummary.replaceChildren(...summaryRows);
      }

      form.classList.add("hidden");
      confirmation.classList.remove("hidden");
      confirmation.focus();
    });

    if (editRsvpBtn) {
      editRsvpBtn.addEventListener("click", () => {
        confirmation.classList.add("hidden");
        form.classList.remove("hidden");
        nameInput?.focus();
      });
    }

    if (downloadIcsBtn) {
      downloadIcsBtn.addEventListener("click", () => {
        downloadWeddingCalendar(lastSubmittedName);
      });
    }

    updateGuestSuffix();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    initNavObserver();
    initScrollReveals();
    initRsvpForm();
  });
})();

