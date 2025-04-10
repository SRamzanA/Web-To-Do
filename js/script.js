const textInputToAdd = document.querySelector(".tasks__input-add-task")
const buttonAddTask = document.querySelector(".tasks__btn-add-task")
const taskList = document.querySelector(".tasks__item-container")

let tasks = [] // Массив для экземпляров класса Task



buttonAddTask.addEventListener("click", () => { // Добавление задачи
    if (textInputToAdd.value.trim().length !== 0) {
        let taskItem = new Task(textInputToAdd.value, Date.now(), false) // Создание Экземпляра Task
        tasks.push(taskItem) // Добаление экземпляра в список
        taskItem.addToTaskList() // Добавление задачи на taskList (DOM)
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }
    textInputToAdd.value = ""
})

class Task {
    constructor(text, id, completed) {
        this.text = text,
        this.id = id,
        this.completed = completed
    }

    addToTaskList() {
        if (document.querySelector(".empty-item")) {
            taskList.innerHTML = ""
        }
        let taskHTML = `
            <div class="item" data-task-completed="${this.completed}" data-task-id="${this.id}">
            <div class="item__content">${this.text}</div>
            <div class="item__buttons">
                <button class="item__btn-done">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                </button>
                <button class="item__btn-del">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
            `
        taskList.insertAdjacentHTML("beforeend", taskHTML)

    }
}


taskList.addEventListener("click", (event) => {
    if (event.target.closest(".item__btn-del")) { // Нажатие на "удалить задачу"
        const item = event.target.closest(".item")
        const itemID = item.dataset.taskId
        tasks = tasks.filter(task => task.id !== parseInt(itemID))
        item.remove()
        localStorage.setItem("tasks", JSON.stringify(tasks))

        if (tasks.length === 0) {
            addEmptyItem()
        }
    }
})

function addEmptyItem() {
    const emptyItem = `
        <div class="empty-item">
            <h1>No tasks</h1>
        </div>`
    taskList.insertAdjacentHTML("beforeend", emptyItem)
}


document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("tasks")) {
        tasks = JSON.parse(localStorage.getItem("tasks")) // Парсинг tasks из localStorage
    }
    
    taskList.innerHTML = "" 
    if (tasks.length !== 0) {
        tasks.forEach(item => {
            taskItem = new Task(item.text, item.id, item.completed)
            taskItem.addToTaskList()
        })
    } else {
        addEmptyItem()
    }
})



