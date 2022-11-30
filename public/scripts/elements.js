//-----------------------------------------------------
//******** SELECT DOM ELEMENTS
//-----------------------------------------------------
const createListBtn = document.querySelector(".add-list-btn");
const cancelListBtn = document.getElementById("list-name-cancel");
const addList = document.getElementById("list-name-btn");
const addItemBtn = document.getElementById("add-item-btn");

const newListPanel = document.querySelector(".add-new-list");
const doingListContainer = document.querySelectorAll(".doing-list-container");
const addItemForm = document.querySelectorAll(".add-item-form");
const listContainers = document.querySelectorAll(".items-container");

//-----------------------------------------------------
//******** EVENT LISTENERS
//-----------------------------------------------------
window.addEventListener("DOMContentLoaded", (e) => {
  for (let i = 0; i < addItemForm.length; i++) {
    fetchItem(addItemForm[i]);
  }
});

// CREATE NEW LIST OR CANCEL
createListBtn.addEventListener("click", showListNamePanel);
cancelListBtn.addEventListener("click", cancelCreateList);

// ADD NEW ITEM TO LIST AND DISPLAY THE THINGS TO DO

addItemForm.forEach((actualList) => {
  actualList.addEventListener("submit", (e) => {
    saveItem(e);
    fetchItem(actualList);
  });
});
