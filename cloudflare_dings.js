let zonesFetched = false;
let folders = [
  {
    id: 1,
    name: "Test folder 1",
    zones: ["agencylabs.ai", "legende.cc"],
  },
  {
    id: 2,
    name: "Test folder 2",
    zones: ["cryptodisplay.net"],
  },
];

function getZones() {
  let zones = document.querySelectorAll('[data-testid^="zone-card-"]');
  for (zoneEl of zones) {
    zoneEl.style.display = "none";
  }
  for (folder of folders.reverse()) {
    createFolderElement(folder);
  }
}

function openFolder(folderID) {
  const folder = folders.filter((folder) => folder.id === folderID)[0];
  let folderElements = document.querySelectorAll('[id^="folder-"]');
  let zoneCardsEl = document.querySelector('[data-testid="zone-cards"]');
  let zones = document.querySelectorAll('[data-testid^="zone-card-"]');

  for (fEl of folderElements) {
    fEl.style.display = "none";
  }

  for (zoneEl of zones) {
    if (
      folder.zones.includes(
        zoneEl.getAttribute("data-testid").split("zone-card-")[1]
      )
    ) {
      zoneEl.style.display = "flex";
    }
  }

  const backButton = document.createElement("div");
  if (
    zoneCardsEl.firstElementChild.classList &&
    zoneCardsEl.firstElementChild.classList instanceof DOMTokenList
  ) {
    for (c of zoneCardsEl.firstElementChild.classList) {
      backButton.classList.add(c);
    }
  }
  backButton.style.alignItems = "center";
  backButton.style.gap = "0.5rem";
  backButton.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.46967 5.46967C0.176776 5.76256 0.176776 6.23744 0.46967 6.53033L5.24264 11.3033C5.53553 11.5962 6.01041 11.5962 6.3033 11.3033C6.59619 11.0104 6.59619 10.5355 6.3033 10.2426L2.06066 6L6.3033 1.75736C6.59619 1.46447 6.59619 0.989593 6.3033 0.696699C6.01041 0.403806 5.53553 0.403806 5.24264 0.696699L0.46967 5.46967ZM12 5.25L1 5.25V6.75L12 6.75V5.25Z" fill="#313131"/>
</svg>
    <span>..</span>
    `;
  zoneCardsEl.insertBefore(backButton, zoneCardsEl.firstChild);
  backButton.addEventListener("click", () => {
    for (fEl of folderElements) {
      fEl.style.display = "flex";
    }

    for (zoneEl of zones) {
      zoneEl.style.display = "none";
    }

    backButton.remove();
  });
}

function createFolderElement(folder) {
  let zoneCardsEl = document.querySelector('[data-testid="zone-cards"]');
  const firstCard = zoneCardsEl.firstElementChild;
  const newFolderEl = document.createElement("div");
  newFolderEl.id = `folder-${folder.id}`;
  if (firstCard.classList && firstCard.classList instanceof DOMTokenList) {
    for (c of firstCard.classList) {
      newFolderEl.classList.add(c);
    }
  }
  newFolderEl.innerHTML = `
<div style="display:flex;flex-direction: column;justify-content: space-between;">
    <div style="display:flex;align-items: center;gap: 0.5rem">
        <svg width="20" height="16" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.375 23H23.625C25.4865 23 27 21.5266 27 19.7143V6.57143C27 4.75915 25.4865 3.28571 23.625 3.28571H15.1875C14.6549 3.28571 14.1539 3.04442 13.8375 2.62857L12.825 1.31429C12.1869 0.487723 11.185 0 10.125 0H3.375C1.51348 0 0 1.47344 0 3.28571V19.7143C0 21.5266 1.51348 23 3.375 23Z" fill="#313131"/>
</svg>
        <span>${folder.name}</span>
    </div>
    <div style="background-color: rgb(242, 242, 242);color: black;border-radius: 50px;width: fit-content;font-size: 12px;padding-bottom: 4px; padding-top: 4px;padding-left: 8px;padding-right: 8px;">
        ${folder.zones.length} Zones
    </div>
</div>
  `;
  zoneCardsEl.insertBefore(newFolderEl, zoneCardsEl.firstChild);

  newFolderEl.addEventListener("click", () => openFolder(folder.id));
}

let observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes) {
      let element = document.querySelector('[data-testid="zone-cards"]');
      if (element && !zonesFetched) {
        observer.disconnect();
        zonesFetched = true;
        getZones();
      }
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });
