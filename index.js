/* Main site behavior */
(async function () {
  const content = window.SITE_CONTENT || {};
  const calendar = content.calendar || {};
  const agenda = document.querySelector("#agenda");
  const subscribe = document.querySelector("#calendar-subscribe");
  const highlightGrid = document.querySelector("#highlight-grid");
  const heroTiles = document.querySelectorAll(".hero-tile img");

  const heroImages = [
    "assets/Gallery Pics/board_21-22.JPEG",
    "assets/Gallery Pics/board_22-23.JPEG",
    "assets/Gallery Pics/charity_week_2022.PNG",
    "assets/Gallery Pics/charity_week_2023.PNG",
    "assets/Gallery Pics/community_iftar_2023.JPEG",
    "assets/Gallery Pics/eid_2022.JPEG",
    "assets/Gallery Pics/eid_2023.JPEG",
    "assets/Gallery Pics/eid_2024.JPEG",
    "assets/Gallery Pics/IMG_0296.JPEG",
    "assets/Gallery Pics/IMG_0316.JPEG",
    "assets/Gallery Pics/IMG_5359.JPG",
    "assets/Gallery Pics/IMG_6160.JPEG",
    "assets/Gallery Pics/kennywood_2023.JPEG",
    "assets/Gallery Pics/MAN@CMU Launch_table.jpg",
    "assets/Gallery Pics/untitled-37.jpg",
    "assets/Gallery Pics/untitled-39.jpg",
    "assets/Gallery Pics/untitled-42.jpg",
    "assets/Gallery Pics/untitled-44.jpg",
    "assets/Gallery Pics/untitled-62.jpg",
    "assets/Gallery Pics/untitled-63.jpg",
    "assets/Gallery Pics/ramadan_2023.JPEG"
  ];

  for (let index = heroImages.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [heroImages[index], heroImages[randomIndex]] = [heroImages[randomIndex], heroImages[index]];
  }

  heroTiles.forEach((image, index) => {
    image.src = heroImages[index];
  });

  const escapeHtml = (value) => String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  if (calendar.subscribeUrl && subscribe) {
    subscribe.href = calendar.subscribeUrl;
    subscribe.textContent = "Subscribe to the calendar";
  }

  const eventDate = (event) => {
    if (event.allDay && /^\d{4}-\d{2}-\d{2}$/.test(event.start)) {
      return new Date(`${event.start}T12:00:00Z`);
    }
    return new Date(event.start);
  };

  const renderEvents = (events) => {
    if (!agenda) return;

    if (!events.length) {
      agenda.innerHTML = `
        <div class="agenda-empty">
          <strong>No public gatherings are posted yet.</strong>
          <p>The next event will appear here as soon as it is added to the shared calendar.</p>
        </div>`;
      return;
    }

    const timeZone = calendar.timeZone || "America/New_York";
    agenda.innerHTML = `<ol class="agenda-list">${events.map((event) => {
      const date = eventDate(event);
      const displayTimeZone = event.allDay ? "UTC" : timeZone;
      const month = date.toLocaleDateString("en-US", { month: "short", timeZone: displayTimeZone });
      const day = date.toLocaleDateString("en-US", { day: "2-digit", timeZone: displayTimeZone });
      const time = event.allDay
        ? "All day"
        : date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone });
      const eventMeta = [time, event.location].filter(Boolean).join(" · ");
      const action = event.url
        ? `<a class="agenda-action" href="${escapeHtml(event.url)}" target="_blank" rel="noopener">Details →</a>`
        : "";
      return `
        <li class="agenda-item">
          <time class="date-block" datetime="${escapeHtml(event.start)}"><span>${escapeHtml(month)}</span><strong>${escapeHtml(day)}</strong></time>
          <div class="agenda-copy">
            <h3>${escapeHtml(event.title)}</h3>
            <p>${escapeHtml(eventMeta)}</p>
            ${event.note ? `<small>${escapeHtml(event.note)}</small>` : ""}
          </div>
          ${action}
        </li>`;
    }).join("")}</ol>`;
  };

  const fallbackEvents = () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return (calendar.fallbackEvents || [])
      .filter((event) => eventDate(event) >= startOfToday)
      .sort((a, b) => eventDate(a) - eventDate(b))
      .slice(0, calendar.maxEvents || 4);
  };

  const fetchCalendarEvents = async () => {
    const query = new URLSearchParams({
      timeMin: new Date().toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: String(calendar.maxEvents || 4),
      timeZone: calendar.timeZone || "America/New_York"
    });
    const calendarId = encodeURIComponent(calendar.calendarId);
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${query}`, {
      headers: { "x-goog-api-key": calendar.apiKey }
    });

    if (!response.ok) throw new Error(`Calendar request failed: ${response.status}`);
    const data = await response.json();
    return (data.items || [])
      .filter((event) => event.status !== "cancelled" && (event.start?.dateTime || event.start?.date))
      .map((event) => ({
        start: event.start.dateTime || event.start.date,
        allDay: Boolean(event.start.date && !event.start.dateTime),
        title: event.summary || "Untitled event",
        location: event.location || "",
        note: "",
        url: event.htmlLink || ""
      }));
  };

  if (agenda) {
    if (calendar.calendarId && calendar.apiKey) {
      agenda.innerHTML = `<div class="agenda-loading">Loading upcoming events…</div>`;
      try {
        renderEvents(await fetchCalendarEvents());
      } catch (error) {
        console.warn("Could not load the public calendar; showing fallback events.", error);
        renderEvents(fallbackEvents());
      }
    } else {
      renderEvents(fallbackEvents());
    }
  }

  if (highlightGrid) {
    highlightGrid.innerHTML = (content.highlights || []).map((item) => `
      <figure class="highlight-card">
        ${item.image
          ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" loading="lazy">`
          : `<div class="highlight-placeholder" aria-hidden="true"><img src="assets/CMU Muslim Alumni Logo_square.png" alt=""></div>`}
        <figcaption>
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.title)}</strong>
        </figcaption>
      </figure>`).join("");
  }
})();
