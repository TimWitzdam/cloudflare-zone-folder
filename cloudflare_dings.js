let zonesFetched = false;
let addFolderButtonAdded = false;

browser.storage.sync.get("folders").then((data) => {
  if (Object.keys(data).length === 0 && data.constructor === Object)
    browser.storage.sync.set({
      folders: [],
    });
});

function getIDFromZone(zone) {
  return zone.getAttribute("data-testid").split("zone-card-")[1];
}

function hideZones() {
  let zones = document.querySelectorAll('[data-testid^="zone-card-"]');
  browser.storage.sync.get("folders").then((data) => {
    let zonesInFolders = data.folders.reduce((acc, folder) => {
      return acc.concat(folder.zones);
    }, []);

    for (zoneEl of zones) {
      if (zonesInFolders.includes(getIDFromZone(zoneEl)))
        zoneEl.style.display = "none";
    }
  });
}

function changeZoneAllZoneVisability(visible) {
  let zones = document.querySelectorAll('[data-testid^="zone-card-"]');
  for (zone of zones) {
    zone.style.display = visible ? "flex" : "none";
  }
}

function getZones() {
  browser.storage.sync.get("folders").then((data) => {
    for (folder of data.folders.reverse()) {
      createFolderElement(folder);
    }
    hideZones();
  });
}

function openFolder(folder) {
  let folderElements = document.querySelectorAll('[id^="folder-"]');
  let zoneCardsEl = document.querySelector('[data-testid="zone-cards"]');
  let zones = document.querySelectorAll('[data-testid^="zone-card-"]');

  changeZoneAllZoneVisability(false);
  for (fEl of folderElements) {
    fEl.style.display = "none";
  }

  for (zoneEl of zones) {
    if (folder.zones.includes(getIDFromZone(zoneEl))) {
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

  let addFolderButton = document.querySelector("#add-folder-button");
  const deleteFolderButton = addFolderButton.cloneNode(true);
  deleteFolderButton.id = "delete-folder-button";
  addFolderButton.style.display = "none";

  deleteFolderButton.querySelector("a").innerHTML = `
<div style="color: white;display: flex;align-items: center; gap: 1rem;">
  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_388_184)">
  <path d="M4.82857 0.622266C5.02143 0.239063 5.41786 0 5.85 0H10.15C10.5821 0 10.9786 0.239063 11.1714 0.622266L11.4286 1.125H14.8571C15.4893 1.125 16 1.62773 16 2.25C16 2.87227 15.4893 3.375 14.8571 3.375H1.14286C0.510714 3.375 0 2.87227 0 2.25C0 1.62773 0.510714 1.125 1.14286 1.125H4.57143L4.82857 0.622266ZM1.14286 4.5H14.8571V15.75C14.8571 16.991 13.8321 18 12.5714 18H3.42857C2.16786 18 1.14286 16.991 1.14286 15.75V4.5ZM4.57143 6.75C4.25714 6.75 4 7.00312 4 7.3125V15.1875C4 15.4969 4.25714 15.75 4.57143 15.75C4.88571 15.75 5.14286 15.4969 5.14286 15.1875V7.3125C5.14286 7.00312 4.88571 6.75 4.57143 6.75ZM8 6.75C7.68571 6.75 7.42857 7.00312 7.42857 7.3125V15.1875C7.42857 15.4969 7.68571 15.75 8 15.75C8.31429 15.75 8.57143 15.4969 8.57143 15.1875V7.3125C8.57143 7.00312 8.31429 6.75 8 6.75ZM11.4286 6.75C11.1143 6.75 10.8571 7.00312 10.8571 7.3125V15.1875C10.8571 15.4969 11.1143 15.75 11.4286 15.75C11.7429 15.75 12 15.4969 12 15.1875V7.3125C12 7.00312 11.7429 6.75 11.4286 6.75Z" fill="white"/>
  </g>
  <defs>
  <clipPath id="clip0_388_184">
  <rect width="16" height="18" fill="white"/>
  </clipPath>
  </defs>
  </svg>
<span>Delete folder</span>
</div>
`;

  addFolderButton.parentElement.insertBefore(
    deleteFolderButton,
    addFolderButton
  );

  deleteFolderButton.addEventListener("click", () => {
    if (
      confirm(`Are you sure you want to delete the "${folder.name} folder?`)
    ) {
      browser.storage.sync.get("folders").then((data) => {
        const newFolders = data.folders.filter((f) => f.id != folder.id);
        browser.storage.sync.set({
          folders: newFolders,
        });

        changeZoneAllZoneVisability("true");
        getZones();
        backButton.remove();
        addFolderButton.style.display = "inline-flex";
        deleteFolderButton.style.display = "none";
      });
    }
  });

  backButton.addEventListener("click", () => {
    for (fEl of folderElements) {
      fEl.style.display = "flex";
    }

    changeZoneAllZoneVisability("true");
    hideZones();

    backButton.remove();
    addFolderButton.style.display = "inline-flex";
    deleteFolderButton.style.display = "none";
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
<div style="display:flex;flex-direction: column;justify-content: space-between;gap: 0.5rem;">
    <div style="display:flex;align-items: center;gap: 0.5rem">
        <svg width="20" height="16" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.375 23H23.625C25.4865 23 27 21.5266 27 19.7143V6.57143C27 4.75915 25.4865 3.28571 23.625 3.28571H15.1875C14.6549 3.28571 14.1539 3.04442 13.8375 2.62857L12.825 1.31429C12.1869 0.487723 11.185 0 10.125 0H3.375C1.51348 0 0 1.47344 0 3.28571V19.7143C0 21.5266 1.51348 23 3.375 23Z" fill="#313131"/>
</svg>
        <span>${folder.name}</span>
    </div>
    <div style="background-color: rgb(242, 242, 242);color: black;border-radius: 50px;width: fit-content;font-size: 12px;padding-bottom: 4px; padding-top: 4px;padding-left: 8px;padding-right: 8px;">
        ${folder.zones.length} Zone${folder.zones.length === 1 ? "" : "s"}
    </div>
</div>
  `;
  zoneCardsEl.insertBefore(newFolderEl, zoneCardsEl.firstChild);

  newFolderEl.addEventListener("click", () => openFolder(folder));
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

let addFolderObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes) {
      let element = document.querySelector('[data-testid="add-site-button"]');
      if (element && !addFolderButtonAdded) {
        addFolderObserver.disconnect();
        addFolderButtonAdded = true;
        const addFolderEl = element.parentElement.cloneNode(true);
        addFolderEl.id = "add-folder-button";
        addFolderEl.querySelector("span").innerHTML = "Add folder";
        addFolderEl.querySelector("a").href = "#";
        element.parentElement.parentElement.insertBefore(
          addFolderEl,
          element.parentElement
        );
        addFolderEl.addEventListener("click", () => {
          const bgEl = document.createElement("div");
          bgEl.style.position = "fixed";
          bgEl.style.top = 0;
          bgEl.style.left = 0;
          bgEl.style.width = "100vw";
          bgEl.style.height = "100vh";
          bgEl.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
          bgEl.style.display = "flex";
          bgEl.style.justifyContent = "center";
          bgEl.style.alignItems = "center";
          bgEl.style.zIndex = "10000";

          let zoneElements = document.querySelectorAll(
            '[data-testid^="zone-card-"]'
          );
          let zones = [];
          for (zoneEl of zoneElements) {
            zones.push(getIDFromZone(zoneEl));
          }

          bgEl.innerHTML = `
          <div style="background-color: white;border-radius: 1rem;padding: 2rem;">
            <form id="new-folder-form">
            <div style="display: flex; justify-content: space-between;">
              <div>
                <label for="folder-name">Folder name</label>
                <input id="folder-name"/>
              </div>
              <div>
                <button type="button" id="new-folder-close">X</button>
              </div>
            </div>
            <br />
            <br />
            <label style="margin-bottom: 0.5rem">Included Zones</label>
            <div style="display: grid;gap: 0.5rem;max-height: 20rem;overflow-y: scroll;margin-bottom: 2rem;">
            ${zones
              .map(
                (zone) =>
                  `<div style="display: flex;gap: 0.3rem;align-items: center;" id="new-folder-zones">
                    <label for="${zone}">${zone}</label>
                    <input type="checkbox" id="${zone}" value="${zone}" />
                  </div>`
              )
              .join("")}
            </div>
            <button type="submit" style="background-color: var(--cf-blue-4);padding: 0.3rem;padding-left: 0.7rem;padding-right: 0.7rem;color: white;width: 100%;border-radius: 4px;font-size: 14px;">
              Add folder
            </button>
            </form>
          </div> 
          `;
          document.body.append(bgEl);

          bgEl.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newFolderName = bgEl.querySelector("#folder-name").value;
            let selectedZones = [];

            const checkboxes = bgEl.querySelectorAll('input[type="checkbox"]');

            checkboxes.forEach((checkbox) => {
              if (checkbox.checked) {
                selectedZones.push(checkbox.value);
              }
            });

            browser.storage.sync.get("folders").then((data) => {
              browser.storage.sync.set({
                folders: [
                  ...data.folders,
                  {
                    id: Math.floor(Math.random() * 1000000),
                    name: newFolderName,
                    zones: selectedZones,
                  },
                ],
              });

              let folderElements = document.querySelectorAll('[id^="folder-"]');
              for (folderEl of folderElements) {
                folderEl.remove();
              }
              getZones();
            });

            bgEl.remove();
          });

          bgEl
            .querySelector("#new-folder-close")
            .addEventListener("click", () => bgEl.remove());
        });
      }
    }
  });
});

addFolderObserver.observe(document.body, { childList: true, subtree: true });
