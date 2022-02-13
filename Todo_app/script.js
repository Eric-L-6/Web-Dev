const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]');


const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');

const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_LIST_ID_KEY = 'task.selectedlistId';

//Local storage on user browser
//Load from local storage if exists, else empty list
//Stored as json object key value pair 
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

let selectedListId = localStorage.getItem(LOCAL_STORAGE_LIST_ID_KEY);

//Anytime we click, will add event listener for element
listsContainer.addEventListener('click', e => {

    //if we click list element, run code
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
});

tasksContainer.addEventListener('click', e => {

    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedList);
    }
});

deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
});

clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();

});

newListForm.addEventListener('submit', e => {
    //Prevents form from submitting (refreshing page by default)
    e.preventDefault();
    const listName = newListInput.value;

    if (listName != null && listName !== '') {
        const newList = createList(listName);
        newListInput.value = null;
        lists.push(newList);
        saveAndRender();
    }
});

newTaskForm.addEventListener('submit', e => {
    //Prevents form from submitting (refreshing page by default)
    e.preventDefault();
    const taskName = newTaskInput.value;

    if (taskName != null && taskName !== '') {
        const newTask = createTask(taskName);
        //clear input
        newTaskInput.value = null;
        lists.find(list => list.id === selectedListId).tasks.push(newTask);
        saveAndRender();
    }
});

//Task object / struct components
function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false};
}

//List object / struct components
function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [{id: 11, name: "hi", complete: false}]}
}

function saveAndRender() {
    save();
    render();
}

//Save lists to local storage as json key value pair
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_LIST_ID_KEY, selectedListId);
}

//Render lists
function render() {

    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find(list => list.id === selectedListId);

    if (selectedListId == null) {
        //No list selected, render no tasks
        listDisplayContainer.style.display = 'none';
    } else {
        //render if a list is selected, change title to selected list
        listDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        //importNode: creates a copy of given node/element
        const taskElement = document.importNode(taskTemplate.content, true);
        
        const checkbox = taskElement.querySelector('input');
        checkbox.id = task.id;
        checkbox.checked = task.complete;

        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);
    })
}

//Calculate number of tasks remaining and display
function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
    //For each item in list, create a li element and
    //Append to cleared listsContainer
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;

        if (list.id === selectedListId) {
            listElement.classList.add('active-list');
        }
        
        listsContainer.appendChild(listElement);
    });
}



//Clears all element contents
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();