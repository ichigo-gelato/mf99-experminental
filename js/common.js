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

    setText('[data-config="datesText"]', config.datesText);
    setText('[data-config="venueName"]', config.venueName);
    setText('[data-config="venueAddress"]', config.venueAddress);
    setText('[data-config="organizerRepresentative"]', config.organizer?.representative);

    if (config.eventName) {
      const eventName = document.getElementById("event-name");
      if (eventName) eventName.textContent = config.eventName;
      document.title = document.title.replace("第99回五月祭", config.eventName);
    }

    const links = config.links || {};
    Object.entries(links).forEach(([key, value]) => {
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
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", applyConfig);
