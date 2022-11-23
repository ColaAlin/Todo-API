const addButton = document.querySelector("#add-todo");
const deleteButton = document.querySelector("#delete-todo");
const inputTodo = document.querySelector("#todo-input");
const todoList = document.querySelector("#list");

let todos = [];

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((load) => load.json())
    .then((todosApiList) => {
      todos = todosApiList;

      renderTodos();
    });
}
loadTodos();

addButton.addEventListener("click", () => {
  const newTodoText = inputTodo.value;
  const newTodo = {
    description: newTodoText,
    done: false,
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newTodoFromApi) => {
      todos.push(newTodoFromApi);
      renderTodos();
    });
  inputTodo.value = "";
  loadTodos();
});

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const newLi = document.createElement("li");
    newLi.className = "new-list";
    newLi.dataset.id = todo.id;
    newLi.addEventListener("change", () => updateDone(todo.id));
    const label = document.createElement("label");
    const input = document.createElement("input");
    if (todo.done === true) {
      input.checked = true;
    }
    input.type = "checkbox";
    newLi.append(input, label);
    label.innerText = todo.description;
    todoList.appendChild(newLi);
  });
}

function updateDone(todoid) {
  const currentTodo = todos.find((todo) => todo.id === todoid);
  currentTodo.done = !currentTodo.done;

  fetch("http://localhost:4730/todos/" + currentTodo.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(currentTodo),
  })
    .then((res) => res.json())
    .then(() => {});
}

deleteButton.addEventListener("click", () => {
  let deleteRequests = [];
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].done === true) {
      const id = todos[i].id;

      const currentRequest = fetch("http://localhost:4730/todos/" + id, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {});
      deleteRequests.push(currentRequest);
    }
  }
  Promise.all(deleteRequests).then(() => {
    loadTodos();
  });
});
