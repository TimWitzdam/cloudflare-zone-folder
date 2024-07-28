let zonesFetched = false;
let folders = [
  {
    name: "Test folder 1",
    zones: ["agencylabs.ai", "legende.cc"],
  },
];

function getZones() {
  let elements = document.querySelectorAll('[data-testid^="zone-card-"]');
  console.log(elements);
  for (folder of folders) {
    createFolderElement(folder);
  }
}

function createFolderElement(folder) {
  let zoneCardsEl = document.querySelector('[data-testid="zone-cards"]');
  const firstCard = zoneCardsEl.firstElementChild;
  const newFolderEl = document.createElement("div");
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
  zoneCardsEl.appendChild(newFolderEl);
}

let observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
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
