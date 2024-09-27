const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Load tasks from localStorage when the page is loaded
document.addEventListener("DOMContentLoaded", loadTasks);

// Function to add a new task
function addTask() {
  if (inputBox.value === '') {
    alert("You must write something!");
  } else {
    // Create a new list item
    let li = document.createElement("li");
    li.textContent = inputBox.value;

    // Append edit button to the task
    let editButton = document.createElement("span");
    editButton.textContent = "✎";
    editButton.className = "edit";
    li.appendChild(editButton);

    // Append remove button to the task
    let removeButton = document.createElement("span");
    removeButton.textContent = "\u00D7";
    removeButton.className = "close";
    li.appendChild(removeButton);

    // Append the new list item to the container
    listContainer.appendChild(li);

    // Save the task to localStorage
    saveTasks();

    // Clear the input box after adding the task
    inputBox.value = '';
  }
}

// Event delegation for checking tasks, editing them, and removing them
listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveTasks();  // Save the updated task list (including checked state)
  } else if (e.target.className === "close") {
    e.target.parentElement.remove();
    saveTasks();  // Save the updated task list after removal
  } else if (e.target.className === "edit") {
    let task = e.target.parentElement;
    let newValue = prompt("Edit the task:", task.firstChild.textContent);
    if (newValue) {
      task.firstChild.textContent = newValue;
      saveTasks();  // Save the updated task list after editing
    }
  }
}, false);

// Save tasks to localStorage
function saveTasks() {
  let tasks = [];
  let liElements = listContainer.getElementsByTagName("li");

  for (let i = 0; i < liElements.length; i++) {
    let task = {
      text: liElements[i].firstChild.textContent,
      checked: liElements[i].classList.contains("checked")
    };
    tasks.push(task);
  }

  // Save the array of tasks as a JSON string in localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  let savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    let tasks = JSON.parse(savedTasks);

    tasks.forEach(function (task) {
      let li = document.createElement("li");
      li.textContent = task.text;

      if (task.checked) {
        li.classList.add("checked");
      }

      // Add edit button
      let editButton = document.createElement("span");
      editButton.textContent = "✎";
      editButton.className = "edit";
      li.appendChild(editButton);

      // Add remove button
      let removeButton = document.createElement("span");
      removeButton.textContent = "\u00D7";
      removeButton.className = "close";
      li.appendChild(removeButton);

      listContainer.appendChild(li);
    });
  }
}
