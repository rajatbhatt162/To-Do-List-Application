const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const searchBox = document.getElementById("search-box");
const modalInput = document.getElementById("modal-input");
const editModal = document.getElementById("edit-modal");
let currentTaskElement = null; // To track the task being edited

// Load tasks from localStorage when the page is loaded
document.addEventListener("DOMContentLoaded", loadTasks);

// Function to add or update a task
function addTask() {
    const taskText = inputBox.value.trim();

    if (taskText === '') {
        alert("You must write something!");
        return;
    }

    // If editing a task
    if (currentTaskElement) {
        currentTaskElement.firstChild.textContent = taskText; // Update task text
        currentTaskElement = null; // Reset currentTaskElement after updating
    } else {
        // Create a new list item
        const li = document.createElement("li");
        li.textContent = taskText;

        // Append pencil (edit) and remove button to the task
        const buttonContainer = createButtonContainer(li);
        li.appendChild(buttonContainer);
        
        // Append the new list item to the container
        listContainer.appendChild(li);
    }

    // Save the task to localStorage
    saveTasks();

    // Clear the input box after adding/updating the task
    inputBox.value = '';
}

// Function to create button container for edit and remove buttons
function createButtonContainer(li) {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    // Create the pencil (edit) button using Font Awesome
    const editButton = document.createElement("i");
    editButton.className = "fas fa-pencil-alt"; // Font Awesome pencil icon class
    editButton.style.cursor = "pointer"; // To show it as clickable
    editButton.onclick = () => openModal(li);
    buttonContainer.appendChild(editButton);

    // Create the remove (close) button
    const removeButton = document.createElement("span");
    removeButton.textContent = "\u00D7"; // '×' symbol for the close button
    removeButton.className = "close";
    removeButton.onclick = () => removeTask(li); // Directly bind the remove function
    buttonContainer.appendChild(removeButton);

    return buttonContainer;
}

// Function to open the modal for editing
function openModal(li) {
    modalInput.value = li.firstChild.textContent; // Set input box in modal to the task text
    currentTaskElement = li; // Set the current task element being edited
    editModal.style.display = "block"; // Show the modal
}

// Function to close the modal
function closeModal() {
    editModal.style.display = "none"; // Hide the modal
}

// Function to update the task
function updateTask() {
    if (currentTaskElement) {
        const updatedText = modalInput.value.trim();
        if (updatedText === '') {
            alert("You must write something!");
            return;
        }
        currentTaskElement.firstChild.textContent = updatedText; // Update task text
        saveTasks(); // Save changes
        closeModal(); // Close the modal
        currentTaskElement = null; // Reset
    }
}

// Function to remove a task
function removeTask(li) {
    listContainer.removeChild(li); // Remove the task from the list
    saveTasks(); // Update localStorage
}

// Event delegation for checking tasks
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveTasks();  // Save the updated task list (including checked state)
    }
}, false);

// Save tasks to localStorage
function saveTasks() {
    const tasks = Array.from(listContainer.children).map(li => ({
        text: li.firstChild.textContent,
        checked: li.classList.contains("checked")
    }));

    // Save the array of tasks as a JSON string in localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            const li = document.createElement("li");
            li.textContent = task.text;

            if (task.checked) {
                li.classList.add("checked");
            }

            const buttonContainer = createButtonContainer(li);
            li.appendChild(buttonContainer);
            listContainer.appendChild(li);
        });
    }
}

// Function to search tasks
function searchTasks() {
    const filter = searchBox.value.toLowerCase();
    const liElements = listContainer.getElementsByTagName("li");

    for (let i = 0; i < liElements.length; i++) {
        const taskText = liElements[i].firstChild.textContent.toLowerCase();
        liElements[i].style.display = taskText.includes(filter) ? "" : "none";
    }
}

// Function to toggle theme
function toggleTheme() {
    document.body.classList.toggle("dark-theme");
}
