var playedMusic = 0;
document.addEventListener("click", playMusic);
document.addEventListener("mouseover", playMusic);
function playMusic() {
  if (playedMusic > 1) {
  } else if (playedMusic) {
    playedMusic += 1;
  } else {
    playedMusic = true;
    var audioDS1 = new Audio("public/ds1.mp3");
    var audioDS2 = new Audio("public/ds2.mp3");
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
});

populateTabs();

function populateTabs() {
  var tabString = "";
  var tabContentString = "";
  var isFirstTab = true;

  for (tab in collection) {
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

  for (tab in collection) {
    var tabFix = tab.toLowerCase();
    populateSubTabs(tab, tabFix);
  }
}
$(".tab-link").click((evt) => {
  var tab = evt.currentTarget.id;
  // var tabName = evt.currentTarget.dataset.tabName;

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

function populateSubTabs(tab, tabFix) {
  var tabObj = collection[tab];
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
    var subTabFix = subTab
      .toLowerCase()
      .replace("'", "")
      .replaceAll(" ", "")
      .replaceAll("(", "")
      .replaceAll(")", "");
    populateSubTab(subTab, subTabFix, tab);
  }
}
$(".subtab-link").click((evt) => {
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

function populateSubTab(subTab, subTabFix, tab) {
  if (subTab == "Special") {
    var i = 1;
    console.log(tab, subTab);
  }
  var subTabObj = collection[tab][subTab];
  var subTabContentItemsString = "";

  for (subTabItem in subTabObj) {
    var subTabItemFolderFix = subTabItem.replaceAll("/", "");
    subTabContentItemsString += `<div class="item">
            <div class="item-name">${subTabItem}</div>
            <div class="item-image"><img src="item-images/${subTabItemFolderFix}.png" /></div>
            
            <div class="item-required">
                <input class="items-collected" placeholder="0" data-tab="${tab}" data-subtab="${subTab}" data-item="${subTabItem}"/>/${subTabObj[subTabItem].required}<input type="checkbox" data-type="item" data-tab="${tab}" data-subtab="${subTab}" data-item="${subTabItem}">
            </div>
        </div>`;
  }
  $(`#${subTabFix}-content`).html(subTabContentItemsString);
}

$(".tab-link").click((evt) => {
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
