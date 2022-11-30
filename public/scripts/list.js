//--------------------------------------------------------------
//******* SHOW THE LIST NAME SECTION
//--------------------------------------------------------------
const showListNamePanel = () => (newListPanel.style.display = "block");

const cancelCreateList = () => (newListPanel.style.display = "none");

//--------------------------------------------------------------
//******* DECLARATE VARIABLE FOR EDITING FUNCTION
//--------------------------------------------------------------
let actualItemId;
let editingItem = false;

//--------------------------------------------------------------
//******* CREATE DOING LIST IN DOM
//--------------------------------------------------------------
const createDoingLists = (doings) => {
  const createList = document.createElement("ul");
  createList.classList.add("list-items");

  for (const item of doings) {
    const itemList = document.createElement("li");
    itemList.classList.add("list-item-container");
    itemList.innerHTML = `
      <p class="list-item">${item.text}</p>
      <div>
        <button id="edit" data-itemid="${item._id}">
          <i class="fas fa-edit function-btn"></i>
        </button>
        <button id="delete" data-itemid="${item._id}">
          <i class="fas fa-trash function-btn"></i>
        </button>
      </div>`;
    createList.appendChild(itemList);
  }
  return createList;
};

//--------------------------------------------------------------
//******* FETCHING DATA
//--------------------------------------------------------------
const fetchItem = async (actualForm) => {
  const listId = actualForm.dataset.listid;

  try {
    const response = await fetch(`/get/${listId}`);
    if (response.ok) {
      const listData = await response.json();
      const fetchListItem = createDoingLists(listData);
      // Select the specific list
      let actualContainer;
      for (const container of doingListContainer) {
        if (listId === container.dataset.listid) {
          actualContainer = container;
        }
      }
      actualContainer.innerHTML = "";
      actualContainer.appendChild(fetchListItem);

      // Select the buttons of the items
      const editBtns = document.querySelectorAll("#edit");
      const deleteBtns = document.querySelectorAll("#delete");
      // Delete item
      deleteBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          deleteItem(btn);
        });
      });

      // Editing item
      editBtns.forEach((editBtn) => {
        editBtn.addEventListener("click", () => {
          editItem(editBtn);
        });
      });
    }
  } catch (error) {
    alarm("Something went wrong. We are not able to load the items!");
  }
};

//--------------------------------------------------------------
//******* SAVE THE INCOMEING COMMENTS DATA
//--------------------------------------------------------------
const saveItem = async (event) => {
  event.preventDefault();

  const listId = event.currentTarget.dataset.listid;
  const input = event.currentTarget.querySelector("input");
  const newItem = input.value;
  // Check if new item or editing
  if (!editingItem) {
    try {
      const response = await fetch(`/${listId}`, {
        method: "POST",
        body: JSON.stringify({
          listId: listId,
          listItem: newItem,
        }),
        headers: {
          "content-type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Saved item");
        input.value = "";
      }
    } catch (error) {
      alert("Something went wrong! We are not able to save this list item");
    }
  } else {
    try {
      const response = await fetch(`/editing/${actualItemId}`, {
        method: "POST",
        body: JSON.stringify({
          listItem: newItem,
        }),
        headers: {
          "content-type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Edited item");
        editingItem = false;
        input.value = "";
      }
    } catch (error) {
      alert("Editing false!");
    }
  }
};

//--------------------------------------------------------------
//******* DELETE LIST'S ITEM
//--------------------------------------------------------------
const deleteItem = async (itemBtn) => {
  const actualItemId = itemBtn.dataset.itemid;
  const actualListContainer = itemBtn.parentElement.parentElement.parentElement;
  const actualList = itemBtn.parentElement.parentElement;

  const response = await fetch(`/deleteitem/${actualItemId}`, {
    method: "POST",
  });
  if (response.ok) {
    actualListContainer.removeChild(actualList);
  }
};

//--------------------------------------------------------------
//******* EDITING LIST'S ITEM
//--------------------------------------------------------------
const editItem = (item) => {
  editingItem = true;
  actualItemId = item.dataset.itemid;
  const content = item.parentElement.previousElementSibling.textContent;
  // Select the actual input and add the specified text content
  const listContainer =
    item.parentElement.parentElement.parentElement.parentElement;
  const actualForm = listContainer.previousElementSibling;
  const input = actualForm.firstElementChild.children[1];
  input.value = content;
};
