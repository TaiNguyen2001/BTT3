const btnDeleteAll = document.querySelector('.btn-delete-all') as HTMLDivElement
const taskInputFieldSelector = document.querySelector(".add-task-input") as HTMLInputElement
const taskListSelector = document.querySelector(".todo-list") as HTMLUListElement
const checkBtnSelector = document.querySelector(".check-all-btn") as HTMLDivElement
const taskQuantitySelector = document.querySelector(".task-quantity") as HTMLSpanElement
const controlSectionSelector = document.querySelector(".todo-list-control") as HTMLDivElement
const doneBtnSelector = document.querySelector(".btn-complete") as HTMLDivElement
const activeBtnSelector = document.querySelector(".btn-active") as HTMLDivElement
const allBtnSelector = document.querySelector(".btn-all") as HTMLDivElement

type Task = {
    content:string;
    status: boolean;
    id: number
};
let tasks: Task[] = []

window.addEventListener('load', () => {
    try {
      tasks = JSON.parse(localStorage.getItem('tasks') || '[]')

    } catch {
      tasks = []
    }
  
    if(tasks.length > 0 ){
      let num = 0
      tasks.forEach(task => {
        render(task)
        if (task.status) {
          num++
        }
      })
      if (num > 0) {
        btnDeleteAll.style.visibility = 'visible'
      }
    }
    let id = 0
    taskInputFieldSelector.addEventListener("keypress", function (e) {
      let task = {} as Task

      const addTask = taskInputFieldSelector.value.trim()
      if( e.key === "Enter"){
        if(addTask === ""){
          alert("Please fill the placehold")
        }
        for( let i = 0; i < tasks.length ; i++){
          if(tasks[i].content === addTask){
            alert("Please do not enter the same task")
            return
          } 
        }
        task.content = addTask
        task.status = false
        task.id = id
        tasks.push(task)
        id ++
        render(task)
        localStorage.setItem("tasks", JSON.stringify(tasks))
        
      }
    })
})

function render(task : 
  {content:string;
  status: boolean;
  id: number}) {
  checkBtnSelector.style.visibility = "visible"
  
  const task_el = document.createElement('li')
  task_el.setAttribute("data-id", `${task.id}`)
  task_el.classList.add('todo-content')
  taskListSelector.appendChild(task_el)

  const task_checkbox = document.createElement("input")
  task_checkbox.classList.add("check-task")
  task_checkbox.type = 'checkbox'
  task_checkbox.checked = task.status
  task_el.appendChild(task_checkbox)

  const task_text = document.createElement("input")
  task_text.type = 'text'
  task_text.value = `${task.content}`
  task_text.setAttribute('readonly', 'readonly')
  task_el.appendChild(task_text)

  const task_btn = document.createElement("div")
  task_btn.classList.add("delete-task-btn")
  task_el.appendChild(task_btn)

  const delete_icon = document.createElement("i")
  delete_icon.classList.add("fa-solid")
  delete_icon.classList.add("fa-xmark")
  task_btn.appendChild(delete_icon)

  taskInputFieldSelector.value = ""
  taskQuantitySelector.innerText = `${tasks.length} tasks left`
}