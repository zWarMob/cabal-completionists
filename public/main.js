var playedMusic = 0;
document.addEventListener("click", playMusic);
document.addEventListener("mouseover", playMusic);
function playMusic() {
  if (playedMusic > 1) {
  } else if (playedMusic) {
    playedMusic += 1;
  } else {
    playedMusic = true;
    var audioDS1 = new Audio("ds1.mp3");
    var audioDS2 = new Audio("ds2.mp3");
    setTimeout(() => {
      audioDS1.play();
    }, 100);
    setTimeout(() => {
      audioDS2.play();
    }, 54100);
  }
}

$(document).on("click", "input[type='checkbox']", (evt) => {
  console.log(evt);
  let checked = evt.target.checked;
  let ds = evt.target.dataset;

  if (ds.item !== undefined) {
    checkItem(ds.tab, ds.subtab, ds.item, checked);
  } else {
    if (ds.subtab !== undefined) {
      checkLoopItems(ds.tab, ds.subtab, checked);
    } else {
      checkLoopSubTabs(ds.tab, checked);
    }
  }

  updateCollection();
});

$(document).on("focusout", "input.items-collected", (evt) => {
  console.log(evt);
  let val = evt.target.value;
  let ds = evt.target.dataset;

  if (collection[ds.tab][ds.subtab][ds.item].collected != val) {
    collection[ds.tab][ds.subtab][ds.item].collected = val;

    updateCollection();
  }
  // let checked = evt.target.checked;
  // let ds = evt.target.dataset;
  // if (ds.item !== undefined) {
  //   checkItem(ds.tab, ds.subtab, ds.item, checked);
  // } else {
  //   if (ds.subtab !== undefined) {
  //     checkLoopItems(ds.tab, ds.subtab, checked);
  //   } else {
  //     checkLoopSubTabs(ds.tab, checked);
  //   }
  // }
  // updateCollection();
});

function checkLoopSubTabs(tab, checked) {
  for (let subTab in collection[tab]) {
    checkLoopItems(tab, subTab, checked);
  }
}

function checkLoopItems(tab, subTab, checked) {
  for (let item in collection[tab][subTab]) {
    checkItem(tab, subTab, item, checked);
  }
}

function checkItem(tab, subTab, item, checked) {
  collection[tab][subTab][item].lookingFor = checked;
  let checkbox = document.querySelector(
    `[type="checkbox"][data-subtab="${subTab}"][data-item="${item}"]`
  );
  checkbox.checked = checked;

  checkbox.parentElement.parentElement.classList.toggle("lookingFor");
}

function updateCollection() {
  console.log("🔥");
  db.collection("collections").doc(userId).set(collection);
}

function populateTabs() {
  var tabString = "";
  var tabContentString = "";
  var isFirstTab = true;

  for (tab in orderedCollection) {
    var tabFix = tab.toLowerCase();
    tabString += `<div id="${tabFix}" data-tab-name="${tab}" class="tab-link${
      isFirstTab ? " active" : ""
    }">${tab}<input type="checkbox" data-tab="${tab}"></div>`;
    tabContentString += `<div id="${tabFix}-content" class="tab-content${
      isFirstTab ? " active" : ""
    }"></div>`;
    isFirstTab = false;
  }
  $(".tabs").html(tabString);
  $(".content").html(tabContentString);

  for (tab in orderedCollection) {
    var tabFix = tab.toLowerCase();
    populateSubTabs(tab, tabFix);
  }
}

function populateSubTabs(tab, tabFix) {
  var tabObj = orderedCollection[tab];
  var subTabString = "";
  var subTabContentString = "";
  var isFirstSubTab = true;

  for (subTab in tabObj) {
    var subTabFix = subTab
      .toLowerCase()
      .replace("'", "")
      .replaceAll(" ", "")
      .replaceAll("(", "")
      .replaceAll(")", "");
    subTabString += `<div id="${subTabFix}" data-subtab-name="${subTab}" class="subtab-link${
      isFirstSubTab ? " active" : ""
    }"><input type="checkbox" data-tab="${tab}" data-subtab="${subTab}">${subTab}</div>`;
    subTabContentString += `<div id="${subTabFix}-content" class="sub-tab-content${
      isFirstSubTab ? " active" : ""
    }"></div>`;
    isFirstSubTab = false;
  }

  var tabContent = `<div class="subtabs">${subTabString}</div><div class="subtab-content">${subTabContentString}</div>`;
  $(`#${tabFix}-content`).html(tabContent);

  for (subTab in tabObj) {
    let every = false;
    let some = false;

    var subTabFix = subTab
      .toLowerCase()
      .replace("'", "")
      .replaceAll(" ", "")
      .replaceAll("(", "")
      .replaceAll(")", "");

    //checkbox check
    let allChecks = [];
    let subTabData = collection[tab][subTab];
    for (let i in subTabData) {
      allChecks.push(subTabData[i].lookingFor);
    }
    if (allChecks.every((x) => x == true)) {
      every = true;
    } else if (allChecks.some((x) => x == true)) {
      some = true;
    }
    if (every) {
      if ($(`#${subTabFix} input[type="checkbox"]`)[0] == undefined) {
        debugger;
      }
      $(`#${subTabFix} input[type="checkbox"]`)[0].checked = true;
    } else if (some) {
      $(`#${subTabFix} input[type="checkbox"]`)[0].indeterminate = true;
    }

    populateSubTab(subTab, subTabFix, tab);
  }
}

function populateSubTab(subTab, subTabFix, tab) {
  var subTabObj = orderedCollection[tab][subTab];
  if (subTab == "Special") {
    var i = 1;
    console.log(tab, subTab);
  }
  var subTabData = collection[tab][subTab];
  var subTabContentItemsString = "";

  for (subTabItem in subTabObj) {
    console.log(subTabItem, tab, subTab);
    var subTabItemFolderFix = subTabItem.replaceAll("/", "");
    subTabContentItemsString += `<div class="item ${
      subTabData[subTabItem].lookingFor ? "lookingFor" : ""
    }">
            <div class="item-name">${subTabItem}</div>
            <div class="item-image"><img src="item-images/${subTabItemFolderFix}.png" /></div>
            
            <div class="item-required">
            <!-- yo -->
                <input class="items-collected" placeholder="0" value="${
                  subTabData[subTabItem].collected || ""
                }" data-tab="${tab}" data-subtab="${subTab}" data-item="${subTabItem}" />/${
      subTabData[subTabItem].required
    }<input type="checkbox" data-type="item" data-tab="${tab}" data-subtab="${subTab}" data-item="${subTabItem}" ${
      subTabData[subTabItem].lookingFor ? "checked" : ""
    }>
            </div>
        </div>`;
  }
  $(`#${subTabFix}-content`).html(subTabContentItemsString);
}

$(document).on("click", ".tab-link", (evt) => {
  tab = evt.currentTarget.id;

  tabcontents = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontents.length; i++) {
    tabcontents[i].className = tabcontents[i].className.replace(" active", "");
  }

  tablinks = document.getElementsByClassName("tab-link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tab + "-content").className += " active";
  evt.currentTarget.className += " active";
});

$(document).on("click", ".subtab-link", (evt) => {
  var subtab = evt.currentTarget.id;
  var subtabName = evt.currentTarget.dataset.subtabName;

  subtabcontents = document.getElementsByClassName("sub-tab-content");
  for (i = 0; i < subtabcontents.length; i++) {
    subtabcontents[i].className = subtabcontents[i].className.replace(
      " active",
      ""
    );
  }

  subtablinks = document.getElementsByClassName("subtab-link");
  for (i = 0; i < subtablinks.length; i++) {
    subtablinks[i].className = subtablinks[i].className.replace(" active", "");
  }

  document.getElementById(subtab + "-content").className += " active";
  evt.currentTarget.className += " active";
});
