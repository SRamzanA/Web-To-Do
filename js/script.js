const textInputToAdd = document.querySelector(".tasks__input-add-task")
const buttonAddTask = document.querySelector(".tasks__btn-add-task")
const tasksContainer = document.querySelector(".tasks__container") // Общий контейнер задач
const taskList = document.querySelector(".tasks__to-do") // Список задач (DOM)
const taskDoneList = document.querySelector(".tasks__done") // Список выполненных задач (DOM)
const taskDoneCalc = document.querySelector(".tasks__done > h1")

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

    addToTaskDoneList() {
        let taskDoneHTML = `
            <div class="item" data-task-completed="${this.completed}" data-task-id="${this.id}">
            <div class="item__content" style="text-decoration: line-through; color: #9a9a9a;">${this.text}</div>
            <div class="item__buttons">
                <button class="item__btn-del">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
            `
        taskDoneList.insertAdjacentHTML("beforeend", taskDoneHTML)
    }
}


tasksContainer.addEventListener("click", (event) => {
    const item = event.target.closest(".item")
    if (item) {
        const itemID = item.dataset.taskId

        if (event.target.closest(".item__btn-del")) { // Нажатие на "удалить задачу"
            tasks = tasks.filter(task => task.id !== parseInt(itemID))

            item.remove()

            localStorage.setItem("tasks", JSON.stringify(tasks))

            if (tasks.filter(item => item.completed === false).length === 0) {
                taskList.innerHTML = ""
                addEmptyItem()
            }

            if (tasks.filter(item => item.completed === true).length === 0) {
                taskDoneCalc.innerHTML = ""
            } else {
                taskDoneCalculate()
            }
            
        } else if (event.target.closest(".item__btn-done")) { // Нажатие на кнопку "выполнить задачу"

            const taskFind = tasks.find(task => task.id === parseInt(itemID)) // Находим задачу
            taskFind.completed = true // Зачада выполнена : True
            item.remove()

            let taskItem = new Task(taskFind.text, taskFind.id, taskFind.completed)
            taskItem.addToTaskDoneList()

            localStorage.setItem("tasks", JSON.stringify(tasks))

            if (tasks.filter(item => item.completed === false).length === 0) {
                addEmptyItem()
            }
            taskDoneCalculate()
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


document.addEventListener("DOMContentLoaded", () => { // При перезагрузке страницы
    if (localStorage.getItem("tasks")) {
        tasks = JSON.parse(localStorage.getItem("tasks")) // Парсинг tasks из localStorage
    }
    
    taskList.innerHTML = "" 
    tasks.forEach(item => {
        let taskItem = new Task(item.text, item.id, item.completed)
        if (item.completed === false) {
            taskItem.addToTaskList()
        } else {
            taskItem.addToTaskDoneList()
        }
    })
    
    if (tasks.filter(item => item.completed === false).length === 0) {
        addEmptyItem()
    }
    
    if (tasks.filter(item => item.completed === true).length === 0) {
        taskDoneCalc.innerHTML = ""
    } else {
        taskDoneCalculate()
    }
})

function taskDoneCalculate() { // Счет выполненных задач и вывод
    let calcDone = tasks.filter(item => item.completed === true)
    taskDoneCalc.innerHTML = `Done - ${calcDone.length}`
}



