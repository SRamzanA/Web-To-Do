const textInputToAdd = document.querySelector(".tasks__input-add-task")
const buttonAddTask = document.querySelector(".tasks__btn-add-task")
const tasksContainer = document.querySelector(".tasks__container")
const taskList = document.querySelector(".tasks__to-do") // Список задач (DOM)
const taskDoneList = document.querySelector(".tasks__done") // Список выполненных задач (DOM)
let taskDoneCalc = document.querySelector(".tasks__done > h1")

const navSectionTitle = document.querySelector(".nav__section-title > h1")
const sectionsItemColumn = document.querySelector(".sections__item-column")
const sectionsInput = document.querySelector(".sections__input")
const sectionsButton = document.querySelector(".sections__button")
const sectionItem = document.querySelector(".sections__item")
const setActiveSectionButton = document.querySelector(".sections__del-item-button")

const searchButton = document.querySelector(".search__button")
const searchInput = document.querySelector(".search__input")


class Section {
    constructor(name, active) {
        this.name = name
        this.id = Date.now()
        this.tasks = []
        this.active = active
    }

    render() {
        let sectionHTML = `
            <div class="sections__item" data-section-id="${this.id}">
                <p>${this.name}</p>
                <div class="sections__del-item-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </div>
            </div>
        `
        sectionsItemColumn.insertAdjacentHTML("beforeend", sectionHTML)
    }

}

class SectionManager {
    constructor() {
        this.sections = [] // Список для экземпляров Section (Разделов)
    }

    addSection(name) {
        const newSection = new Section(name, false)
        this.sections.push(newSection)
        newSection.render()
    }

}

let manager = new SectionManager()

function addDefoltSection() {
    if (!manager.sections.find(item => item.name == "My Tasks")) { // Если нету раздела "My Tasks"
        manager.addSection("My Tasks")
        manager.sections.find(item => item.name == "My Tasks").active = true
        localStorage.setItem("manager", JSON.stringify(manager))
    }
}

let activeSection = manager.sections.find(item => item.active == true)

function addSectionToList() {
    if (sectionsInput.value.trim().length !== 0) {
        let inputText = sectionsInput.value

        if (!manager.sections.find(item => item.name == inputText)) { // Если уже нет такого названия
            manager.addSection(inputText)
            localStorage.setItem("manager", JSON.stringify(manager))
        }
    } else {
        sectionsInput.placeholder = "The name repeats"
        setTimeout(() => {
            sectionsInput.placeholder = "Add a section"
        }, 2000)
    }

    sectionsInput.value = ""
}

sectionsButton.addEventListener("click", addSectionToList)
sectionsInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        addSectionToList()
    }
})

sectionsItemColumn.addEventListener("click", (event) => {
    if (event.target.closest(".sections__del-item-button")) { // Нажатие на удалить раздел
        let wtdel = confirm("Delete it?")
        if (wtdel == true) {
            let item = event.target.closest(".sections__item")
            let sectionItem = manager.sections.find(section => section.id == item.dataset.sectionId)
            if (!sectionItem.active == true) {
                manager.sections = manager.sections.filter(section => section.id != item.dataset.sectionId)
                item.remove()
            } else {
                alert("The active partition cannot be deleted")
            }
        }

    } else if (event.target.closest(".sections__item")) { // Нажатие на Item раздел
        let item = event.target.closest(".sections__item")
        manager.sections = manager.sections.map(section => {
            section.active = false
            return section
        })
        manager.sections.find(section => section.id == item.dataset.sectionId).active = true
        sectionListUpdate()
        taskListUpdate()
        navSectionTitle.innerHTML = activeSection.name
    }
    localStorage.setItem("manager", JSON.stringify(manager))
})





class Task {
    constructor(text, id, completed) {
        this.text = text
        this.id = id
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


function emptyTaskListMessage() {
    taskList.innerHTML = ""
    const emptyItem = `
        <div class="empty-item">
            <h1>No tasks</h1>
        </div>`
    taskList.insertAdjacentHTML("beforeend", emptyItem)
}

function taskDoneCalculate() { // Счет выполненных задач и вывод
    let calcDone = activeSection.tasks.filter(item => item.completed === true)
    taskDoneCalc.innerHTML = `Done - ${calcDone.length}`
}

function addToDo() {
    if (textInputToAdd.value.trim().length !== 0) {
        let taskItem = new Task(textInputToAdd.value, Date.now(), false)
        activeSection.tasks.push(taskItem)
        taskItem.addToTaskList() // Добавление задачи на страницу
        localStorage.setItem("manager", JSON.stringify(manager))
    }
    textInputToAdd.value = ""
}
buttonAddTask.addEventListener("click", addToDo)
textInputToAdd.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        addToDo()
    }
})


function checkTasks() {
    if (activeSection.tasks.filter(item => item.completed === false).length === 0) { // Если нет невыполненных
        emptyTaskListMessage()
    }

    if (activeSection.tasks.filter(item => item.completed === true).length === 0) { // Если нет выполненных
        taskDoneCalc.innerHTML = ""
    } else {
        taskDoneCalculate()
    }
}

tasksContainer.addEventListener("click", (event) => {
    const item = event.target.closest(".item")
    if (item) {
        const itemID = item.dataset.taskId

        if (event.target.closest(".item__btn-del")) { // Нажатие на "удалить задачу"
            manager.sections.map(section => { // Проход по всему списку
                section.tasks = section.tasks.filter(task => task.id !== parseInt(itemID))
            })

            item.remove()

            localStorage.setItem("manager", JSON.stringify(manager))

            checkTasks()

        } else if (event.target.closest(".item__btn-done")) { // Нажатие на кнопку "выполнить задачу"

            // tasks.find(task => task.id === parseInt(itemID))
            let taskFind = null
            for (let i = 0; i < manager.sections.length; i++) {
                taskFind = manager.sections[i].tasks.find(task => task.id === parseInt(itemID))
                if (taskFind) {
                    break
                }
            }
            
            taskFind.completed = true
            item.remove()

            let taskItem = new Task(taskFind.text, taskFind.id, taskFind.completed)
            taskItem.addToTaskDoneList()

            localStorage.setItem("manager", JSON.stringify(manager))

            if (activeSection.tasks.filter(item => item.completed === false).length === 0) {
                emptyTaskListMessage()
            }
            taskDoneCalculate()
        }
    }
})





function searchFunction(searchText) {
    let allTaskArray = []
    manager.sections.map(section => { // Находим задачи всех разделов
        section.tasks.map(task => {
            allTaskArray.push(task)
        })
    })

    let seachArray = allTaskArray.filter(task => {
        return task.text.toLowerCase().includes(searchText.toLowerCase())
    })
    
    console.log("Проверено объектов", allTaskArray)
    console.log("Найдено объектов", seachArray)

    taskList.innerHTML = ""
    if (seachArray.filter(task => task.completed === true).length !== 0) {
        taskDoneList.innerHTML = `<h1>Done - ${seachArray.filter(task => task.completed === true).length}</h1>`
    } else {
        taskDoneList.innerHTML = `<h1></h1>`
    }

    if (seachArray.length !== 0) {
        seachArray.forEach(task => {
            let newTask = new Task(task.text, task.id, task.completed)
            if (newTask.completed == false) {
                newTask.addToTaskList()
            } else if (newTask.completed == true) {
                newTask.addToTaskDoneList()
            }
        })
    } else {
        emptyTaskListMessage()
    }
    navSectionTitle.innerHTML = "Found tasks"
}

function startSearchFunction() {
    if (searchInput.value.trim().length !== 0) {
        searchFunction(searchInput.value)
    }
}
searchInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        startSearchFunction()
    }
})
searchButton.addEventListener("click", startSearchFunction)




function taskListUpdate() {
    taskList.innerHTML = ""
    taskDoneList.innerHTML = "<h1></h1>"
    taskDoneCalc = document.querySelector(".tasks__done > h1")
    activeSection = manager.sections.find(item => item.active == true)
    activeSection.tasks.forEach(item => { // Перебор и вывод задач из списка (Выпосленные/Невыполненные)
        let taskItem = new Task(item.text, item.id, item.completed)
        if (item.completed === false) {
            taskItem.addToTaskList()
        } else {
            taskItem.addToTaskDoneList()
        }
    })
    checkTasks()
}
function sectionListUpdate() {
    sectionsItemColumn.innerHTML = ""
    manager.sections.forEach(item => {
        item.render()
    })
    navSectionTitle.innerHTML = activeSection.name
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("manager")) {
        const parseManager = JSON.parse(localStorage.getItem("manager"))
        if (parseManager.sections.length !== 0) { // если разделов > 0
            manager.sections = parseManager.sections.map(item => {
                const section = new Section(item.name, item.active)
                section.id = item.id
                section.tasks = item.tasks
                return section
            })
        } else {
            addDefoltSection()
        }
    } else {
        addDefoltSection()
    }

    activeSection = manager.sections.find(item => item.active == true)
    if (!activeSection) { // Если нет активного раздела
        manager.sections[0].active = true
        activeSection = manager.sections.find(item => item.active == true)
    }
    console.log("Active", activeSection)

    sectionListUpdate()
    taskListUpdate()
})