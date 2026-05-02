async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${path} を読み込めませんでした`);
  }
  return response.json();
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((el) => {
    if (value) el.textContent = value;
  });
}

function setHref(selector, value) {
  document.querySelectorAll(selector).forEach((el) => {
    if (value) el.href = value;
  });
}

function setDateTimeText(value) {
  document.querySelectorAll('[data-config="datesText"]').forEach((el) => {
    if (!value) return;

    let parts = value.split("／").filter(Boolean);

    // Backward compatibility:
    // "2026年5月16日（土）10:00–18:00／5月17日（日）10:00–17:00"
    // でも、"2026年" と各日程行に分解する。
    let year = "";
    if (parts.length > 0) {
      const match = parts[0].match(/^([0-9]{4}年)(.*)$/);
      if (match) {
        year = match[1];
        parts[0] = match[2];
      }
    }

    if (!year && parts[0] && /^[0-9]{4}年$/.test(parts[0])) {
      year = parts.shift();
    }

    const lines = [];
    if (year) {
      lines.push(`<span class="date-year-full">${year}</span>`);
    }
    parts.forEach((part) => {
      lines.push(`<span class="date-main">${part}</span>`);
    });

    el.innerHTML = lines.join("");
    el.classList.add("date-time-lines");
  });
}

function setEventName(value) {
  const eventName = document.getElementById("event-name");
  if (!eventName || !value) return;

  eventName.textContent = "";
  eventName.classList.add("event-name-lines");

  let parts = [];
  if (value.includes("第99回五月祭") && value.includes("10分で伝えます") && value.includes("東大研究最前線")) {
    parts = ["第99回五月祭", "10分で伝えます！", "東大研究最前線"];
  } else {
    parts = [value];
  }

  parts.forEach((part) => {
    const span = document.createElement("span");
    span.textContent = part;
    eventName.appendChild(span);
  });
}

function createExternalIframe(src, title) {
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.title = title;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.allowFullscreen = true;
  return iframe;
}

async function applyConfig() {
  try {
    const config = await loadJson("data/config.json");

    setDateTimeText(config.dateTimeText || config.datesText);
    setText('[data-config="venueName"]', config.venueName);
    setText('[data-config="venueAddress"]', config.venueAddress);
    setText('[data-config="organizerRepresentative"]', config.organizer?.representative);

    if (config.eventName) {
      setEventName(config.eventName);
      document.title = document.title.replace("第99回五月祭", config.eventName);
    }

    const links = config.links || {};
    const normalizedLinks = { ...links };

    const venueQuery = encodeURIComponent(config.venueName || "東京大学本郷キャンパス 工学部3号館");
    if (
      !normalizedLinks.googleMap ||
      /google\.com\/maps\/embed/.test(normalizedLinks.googleMap)
    ) {
      normalizedLinks.googleMap = `https://www.google.com/maps/search/?api=1&query=${venueQuery}`;
    }

    Object.entries(normalizedLinks).forEach(([key, value]) => {
      setHref(`[data-link="${key}"]`, value);
    });

    const sns = config.sns || {};
    Object.entries(sns).forEach(([key, value]) => {
      setHref(`[data-sns="${key}"]`, value);
    });

    const mapContainer = document.getElementById("map-container");
    if (mapContainer && links.mapEmbed) {
      mapContainer.innerHTML = "";
      mapContainer.appendChild(createExternalIframe(links.mapEmbed, "会場のGoogle Map"));
    }

    const videoContainer = document.getElementById("video-container");
    if (videoContainer && links.youtubeEmbed) {
      videoContainer.innerHTML = "";
      const iframe = createExternalIframe(links.youtubeEmbed, "紹介動画");
      iframe.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      videoContainer.appendChild(iframe);
    }

    const members = config.organizer?.members || [];
    const membersBlock = document.getElementById("organizer-members");
    const membersList = document.getElementById("organizer-members-list");
    if (membersBlock && membersList && members.length > 0) {
      membersList.innerHTML = "";
      members.forEach((member) => {
        const li = document.createElement("li");
        if (typeof member === "string") {
          li.textContent = member;
        } else {
          const name = member.name || "";
          const role = member.role ? `（${member.role}）` : "";
          li.textContent = `${name}${role}`;
        }
        membersList.appendChild(li);
      });
      membersBlock.hidden = false;
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", applyConfig);
