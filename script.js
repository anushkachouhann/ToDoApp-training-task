const todoText = document.getElementById("todo-text");
const todoAlert = document.getElementById("alert");
const todoList = document.getElementById("todo-list");
const addUpdate = document.getElementById("addUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list"));
if (!todo) {
  todo = [];
}

function CreateToDo() {
  if (todoText.value === "") {
    todoAlert.innerText = "Please enter your todo items!";
    todoText.focus();
  } else {
    let isAvailable = false;
    todo.forEach((element) => {
      if (element.item == todoText.value) isAvailable = true;
    });

    if (isAvailable) {
      setAlertMessage("This item already present in the list!");
      return;
    } else {
      let li = document.createElement("li");
      const todoItems = `
    <span title="Hit double click and complete" ondblclick="CompletedToDo(this)"> ${todoText.value}
    <span>
    <button type="button" class="edit todo-controls mr-10" onclick="UpdateToDo(this)">Edit</button>
    <button type="button" class="delete todo-controls" onclick="DeleteToDo(this)">Delete</button>
    </div>
    </div>`;
      li.innerHTML = todoItems;
      todoList.appendChild(li);

      if (!todo) todo = [];

      let itemList = {
        item: todoText.value,
        status: false,
      };
      todo.push(itemList);
      setLocalStorage();
    }
    todoText.value = "";
    setAlertMessage("Todo Item Created Successfully !!");
    location.reload();

  }
}

function ReadToDo() {
  todoList.innerHTML = "";
  todo.forEach((element) => {
    let li = document.createElement("li");
    li.className = "flex justify-between items-center p-2 border-b";

    let style = "";
    if (element.status) {
      style = "style='text-decoration: line-through'";
    }
    const todoItems = ` 
  <div style="${style}" class="ml-10" title="Double click to complete" ondblclick="CompletedToDo(this)">
    ${element.item} 
  </div>
  <div>
        <button class="status todo-controls ${element.status ? "inactive" : "active"}" onclick="ToggleStatus(this)">
          ${element.status ? "Inactive" : "Active"}
        </button>
    ${
      !element.status
        ? '<button class="edit todo-controls mr-2" onclick="UpdateToDo(this)">Edit</button>'
        : ""
    }
    <button class="delete todo-controls" onclick="DeleteToDo(this)">Delete</button>
  </div>`;
    li.innerHTML = todoItems;
    todoList.appendChild(li);
  });
}
ReadToDo();

function UpdateToDo(e) {
  const li = e.closest("li"); 
  const textDiv = li.querySelector("div:first-child"); 

  if (textDiv.style.textDecoration === "") {
    todoText.value = textDiv.innerText.trim();
    updateText = textDiv;

    addUpdate.innerText = "Update Task";
    addUpdate.onclick = UpdateOnSelectionItems;
    todoText.focus();
  }
}
function UpdateOnSelectionItems() {
  if (todo.some((element) => element.item === todoText.value.trim())) {
    setAlertMessage("This item already present in the list!");
    return;
  }
 
  todo.forEach((element) => {
    if (element.item === updateText.innerText.trim()) {
      element.item = todoText.value.trim();
    }
  });
  setLocalStorage();
 
  updateText.innerText = todoText.value.trim();
  addUpdate.innerText = "Add Task";
  addUpdate.onclick = CreateToDo;
  todoText.value = "";
  setAlertMessage("Todo item Updated Successfully!");
}

function DeleteToDo(e) {
  let dltValue = e.parentElement.parentElement.querySelector("div").innerText;
  if (confirm(`Are you sure. Do you want to delete this ${dltValue}`)) {
    e.parentElement.parentElement.setAttribute("class", "deleted-item");
    todoText.focus();

    todo = todo.filter((element) => element.item !== dltValue.trim());

    setTimeout(() => {
      e.parentElement.parentElement.remove();
    }, 1000);
    setLocalStorage();
    ReadToDo();
  }
}

function CompletedToDo(e) {
  if (e.parentElement.querySelector("div").style.textDecoration === "") {
    const img = document.createElement("img");
    img.src = "/images/check-mark.png";
    img.className = "todo-controls";
    e.parentElement.querySelector("div").style.textDecoration = "line-through";
    e.parentElement.querySelector("div").appendChild(img);
    e.parentElement.querySelector("img.edit").remove();

    todo.forEach((element) => {
      if (
        e.parentElement.querySelector("div").innerText.trim() == element.item
      ) {
        element.status = true;
      }
    });
    setLocalStorage();
    ReadToDo();
    setAlertMessage("Todo item completed Successfully!");
  }
}
function setAlertMessage(message) {
  todoAlert.removeAttribute("class");
  todoAlert.innerText = message;
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 1000);
}

function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

function ToggleStatus(e) {
  const li = e.closest("li");
  const textDiv = li.querySelector("div:first-child");
  const taskText = textDiv.innerText.trim();

  todo.forEach((element) => {
    if (element.item === taskText) {
      element.status = !element.status;  
    }
  });
  setLocalStorage();
  ReadToDo(); 
}
