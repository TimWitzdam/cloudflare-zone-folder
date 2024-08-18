let zonesFetched = false;
let addFolderButtonAdded = false;

browser.storage.sync.get("folders").then((data) => {
  if (Object.keys(data).length === 0 && data.constructor === Object)
    browser.storage.sync.set({
      folders: [],
    });
});

function getIDFromZone(zone) {
  return zone
    .getAttribute("data-testid")
    .split("account-zone-selector-row--")[1];
}

function hideZones() {
  let zones = document.querySelectorAll(
    '[data-testid^="account-zone-selector-row--"]'
  );
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
  let zones = document.querySelectorAll(
    '[data-testid^="account-zone-selector-row--"]'
  );
  for (zone of zones) {
    zone.style.display = visible ? "table-row" : "none";
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
  let zoneCardsEl = document.querySelector("tbody");
  let zones = document.querySelectorAll(
    '[data-testid^="account-zone-selector-row--"]'
  );

  changeZoneAllZoneVisability(false);
  for (fEl of folderElements) {
    fEl.style.display = "none";
  }

  for (zoneEl of zones) {
    if (folder.zones.includes(getIDFromZone(zoneEl))) {
      zoneEl.style.display = "table-row";
    }
  }

  const backButton = document.createElement("tr");
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
    <div class="c_lo c_ms c_oj c_bk c_bj c_ok c_cd c_ol c_oo c_ci c_cj c_bq c_bm c_bp c_op c_or">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.46967 5.46967C0.176776 5.76256 0.176776 6.23744 0.46967 6.53033L5.24264 11.3033C5.53553 11.5962 6.01041 11.5962 6.3033 11.3033C6.59619 11.0104 6.59619 10.5355 6.3033 10.2426L2.06066 6L6.3033 1.75736C6.59619 1.46447 6.59619 0.989593 6.3033 0.696699C6.01041 0.403806 5.53553 0.403806 5.24264 0.696699L0.46967 5.46967ZM12 5.25L1 5.25V6.75L12 6.75V5.25Z" fill="#313131"/>
      </svg>
      <span>..</span>
    </div>
    `;
  zoneCardsEl.insertBefore(backButton, zoneCardsEl.firstChild);

  let addFolderButton = document.querySelector("#add-folder-button");
  const editFolderButton = addFolderButton.cloneNode(true);
  editFolderButton.id = "delete-folder-button";
  addFolderButton.style.display = "none";

  editFolderButton.querySelector("a").innerHTML = `
<div style="color: white;display: flex;align-items: center; gap: 1rem;">
 <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_389_184)">
<path d="M12.375 11.25C15.4828 11.25 18 8.73281 18 5.625C18 5.08711 17.9227 4.5668 17.782 4.07109C17.673 3.69141 17.2055 3.60703 16.9277 3.88477L14.2277 6.58477C14.1223 6.69023 13.9781 6.75 13.8305 6.75H11.8125C11.5031 6.75 11.25 6.49688 11.25 6.1875V4.16953C11.25 4.02187 11.3098 3.87773 11.4152 3.77227L14.1152 1.07227C14.393 0.794531 14.3051 0.326953 13.9289 0.217969C13.4332 0.0773437 12.9129 0 12.375 0C9.26719 0 6.75 2.51719 6.75 5.625C6.75 6.29648 6.86953 6.94336 7.08398 7.54102L0.699609 13.9254C0.253125 14.3719 0 14.9801 0 15.6129C0 16.9313 1.06875 18 2.38711 18C3.01992 18 3.62813 17.7469 4.07461 17.3004L10.459 10.916C11.0566 11.134 11.7035 11.25 12.375 11.25ZM2.8125 14.3438C3.03628 14.3438 3.25089 14.4326 3.40912 14.5909C3.56736 14.7491 3.65625 14.9637 3.65625 15.1875C3.65625 15.4113 3.56736 15.6259 3.40912 15.7841C3.25089 15.9424 3.03628 16.0312 2.8125 16.0312C2.58872 16.0312 2.37411 15.9424 2.21588 15.7841C2.05764 15.6259 1.96875 15.4113 1.96875 15.1875C1.96875 14.9637 2.05764 14.7491 2.21588 14.5909C2.37411 14.4326 2.58872 14.3438 2.8125 14.3438Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_389_184">
<rect width="18" height="18" fill="white"/>
</clipPath>
</defs>
</svg>
<span>Edit folder</span>
</div>
`;

  addFolderButton.parentElement.insertBefore(editFolderButton, addFolderButton);

  editFolderButton.addEventListener("click", () => {
    const editFolderBg = document.createElement("div");
    editFolderBg.style.position = "fixed";
    editFolderBg.style.top = 0;
    editFolderBg.style.left = 0;
    editFolderBg.style.width = "100vw";
    editFolderBg.style.height = "100vh";
    editFolderBg.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    editFolderBg.style.display = "flex";
    editFolderBg.style.justifyContent = "center";
    editFolderBg.style.alignItems = "center";
    editFolderBg.style.zIndex = "10000";

    let zoneElements = document.querySelectorAll(
      '[data-testid^="account-zone-selector-row--"]'
    );
    let allZones = [];
    for (z of zoneElements) {
      allZones.push(getIDFromZone(z));
    }

    editFolderBg.innerHTML = `
          <div style="background-color: white;border-radius: 1rem;padding: 2rem;">
            <form id="edit-folder-form">
            <div style="display: flex; justify-content: space-between;">
              <div>
                <label for="folder-name">Folder name</label>
                <input id="folder-name" value=${folder.name} />
              </div>
              <div>
                <button type="button" id="edit-folder-close">X</button>
              </div>
            </div>
            <br />
            <br />
            <label style="margin-bottom: 0.5rem">Included Zones</label>
            <div style="display: grid;gap: 0.5rem;max-height: 20rem;overflow-y: scroll;margin-bottom: 2rem;">
            ${allZones
              .map(
                (zone) =>
                  `<div style="display: flex;gap: 0.3rem;align-items: center;" id="new-folder-zones">
                    <label for="${zone}">${zone}</label>
                    <input type="checkbox" id="${zone}" value="${zone}" ${
                    folder.zones.includes(zone) && "checked"
                  } />
                  </div>`
              )
              .join("")}
            </div>
              <button type="submit" style="background-color: var(--cf-blue-4);padding: 0.3rem;padding-left: 0.7rem;padding-right: 0.7rem;color: white;width: 100%;border-radius: 4px;font-size: 14px;margin-bottom: 15px;">
                Save changes
              </button>
              <button type="button" id="delete-folder-button" style="background-color: var(--cf-gray-8);padding: 0.3rem;padding-left: 0.7rem;padding-right: 0.7rem;width: 100%;border-radius: 4px;font-size: 14px;">
              Delete folder
              </button>
            </form>
          </div> 
          `;
    document.body.append(editFolderBg);

    editFolderBg.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newFolderName = editFolderBg.querySelector("#folder-name").value;
      let selectedZones = [];

      const checkboxes = editFolderBg.querySelectorAll(
        'input[type="checkbox"]'
      );

      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          selectedZones.push(checkbox.value);
        }
      });

      const data = await browser.storage.sync.get("folders");
      let folders = data.folders || [];

      folders = folders.map((f) => {
        if (f.id === folder.id) {
          return {
            ...f,
            name: newFolderName,
            zones: selectedZones,
          };
        }
        return f;
      });
      folder.name = newFolderName;
      folder.zones = selectedZones;

      await browser.storage.sync.set({ folders });

      editFolderBg.remove();

      changeZoneAllZoneVisability(false);
      for (zoneEl of zones) {
        if (folder.zones.includes(getIDFromZone(zoneEl))) {
          zoneEl.style.display = "flex";
        }
      }
    });

    editFolderBg
      .querySelector("#edit-folder-close")
      .addEventListener("click", () => editFolderBg.remove());

    editFolderBg
      .querySelector("#delete-folder-button")
      .addEventListener("click", () => {
        if (
          confirm(`Are you sure you want to delete the "${folder.name} folder?`)
        ) {
          browser.storage.sync.get("folders").then((data) => {
            const newFolders = data.folders.filter((f) => f.id != folder.id);
            browser.storage.sync.set({
              folders: newFolders,
            });

            changeZoneAllZoneVisability(true);
            getZones();
            backButton.remove();
            addFolderButton.style.display = "inline-flex";
            editFolderButton.style.display = "none";
            editFolderBg.remove();
          });
        }
      });
  });

  backButton.addEventListener("click", () => {
    for (fEl of folderElements) {
      fEl.remove();
    }

    changeZoneAllZoneVisability("true");
    getZones();

    backButton.remove();
    addFolderButton.style.display = "inline-flex";
    editFolderButton.style.display = "none";
  });
}

function createFolderElement(folder) {
  let zoneCardsEl = document.querySelector("tbody");
  const firstCard = zoneCardsEl.firstElementChild;
  const newFolderEl = document.createElement("tr");
  newFolderEl.id = `folder-${folder.id}`;
  if (firstCard.classList && firstCard.classList instanceof DOMTokenList) {
    for (c of firstCard.classList) {
      newFolderEl.classList.add(c);
    }
  }
  newFolderEl.innerHTML = `
<td class="c_lo c_ms c_oj c_bk c_bj c_ok c_cd c_ol c_oo c_ci c_cj c_bq c_bm c_bp c_op c_or" style="display:flex;flex-direction: column;justify-content: space-between;gap: 0.5rem;">
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
      let element = document.querySelectorAll(
        'tr[data-testid^="account-zone-selector-row--"]'
      );
      if (element.length != 0 && !zonesFetched) {
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
            '[data-testid^="account-zone-selector-row--"]'
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
