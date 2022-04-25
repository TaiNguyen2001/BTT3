const btnDeleteAll = document.querySelector('.btn-delete-all') as HTMLDivElement
const taskInputFieldSelector = document.querySelector(".add-task-input") as HTMLInputElement
const taskListSelector = document.querySelector(".todo-list") as HTMLUListElement
const checkBtnSelector = document.querySelector(".check-all-btn") as HTMLDivElement
const taskQuantitySelector = document.querySelector(".task-quantity") as HTMLSpanElement
const controlSectionSelector = document.querySelector(".todo-list-control") as HTMLDivElement
const doneBtnSelector = document.querySelector(".btn-complete") as HTMLDivElement
const activeBtnSelector = document.querySelector(".btn-active") as HTMLDivElement
const allBtnSelector = document.querySelector(".btn-all") as HTMLDivElement
const taskSeclector = document.querySelectorAll('.check-task') as NodeList

type Task = {
  content:string;
  status: boolean;
  id: number
}
let tasks: Task[] = []

window.addEventListener('load', () => {
  try {
    tasks = JSON.parse(localStorage.getItem('tasks') || '[]')

  } catch {
    tasks = []
  }

  if (tasks.length > 0 ) {
    let num : number = 0
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
  let id : number = 0
  taskInputFieldSelector.addEventListener("keypress", function (e) {
    let task = {} as Task

    const addTask : string = taskInputFieldSelector.value.trim()
    if (e.key === "Enter") {
      if (addTask === "") {
        alert("Please fill the placehold")
        return
      }
      for ( let i = 0; i < tasks.length ; i++) {
        if (tasks[i].content === addTask) {
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
  //check all done
  checkBtnSelector.addEventListener('click', function () {
    let num : number = 0
    taskListSelector.innerHTML = ''
    tasks = JSON.parse(localStorage.getItem("tasks") || '[]')
    btnDeleteAll.style.visibility = "visible"
    tasks.forEach( task => { 
      if (task.status) {
        num ++
      }
    })
    if (num === tasks.length) {
      for (let  i : number = 0; i<tasks.length; i++) {
        tasks[i].status = false
      }
      localStorage.setItem("tasks", JSON.stringify(tasks))
      btnDeleteAll.style.visibility = "hidden"
    }
    else {
      for(let  i : number = 0; i < tasks.length; i++){
        tasks[i].status = true
      }
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
    tasks = JSON.parse(localStorage.getItem("tasks") || '[]')
    tasks.forEach( task => {
      render(task)
    })
  })
  activeBtnSelector.addEventListener('click', function () {
    if(!activeBtnSelector.classList.contains("active")){
      doneBtnSelector.classList.remove("active")
      activeBtnSelector.classList.add("active")
      allBtnSelector.classList.remove("active")
    }
    btnDeleteAll.style.visibility = "hidden"
    displayActive()
  })

  doneBtnSelector.addEventListener('click', function () {
    if (!doneBtnSelector.classList.contains("active")) {
      doneBtnSelector.classList.add("active")
      activeBtnSelector.classList.remove("active")
      allBtnSelector.classList.remove("active")
    }
    displayDone()
  })

  allBtnSelector.addEventListener('click', function (){
    if (!allBtnSelector.classList.contains("active")) {
      doneBtnSelector.classList.remove("active")
      activeBtnSelector.classList.remove("active")
      allBtnSelector.classList.add("active")
    }
    displayAll()
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

  task_text.addEventListener('dblclick', function () {
    this.removeAttribute('readonly')
    let oldText : string  = task_text.value 
    let idEL = this.parentElement!.getAttribute('data-id')
    task_text.focus()
    task_text.setSelectionRange(task_text.value.length, task_text.value.length)
    this.addEventListener('blur', function () {
      task_text.setAttribute('readonly', 'readonly')
      let newText: string = task_text.value
      for (let i : number = 0; i < tasks.length; i++ ) {
        if (tasks[i].id === parseInt(idEL!)) {
          if (newText.trim() === '') {
            tasks.splice(i,1)
            localStorage.setItem("tasks", JSON.stringify(tasks))
            taskListSelector.innerHTML = ""
            tasks.forEach(task => {
              render(task)
            })
            if(tasks.length === 0){
              controlSectionSelector.style.display = 'none'
            }
            if (doneBtnSelector.classList.contains("active")) {
              doneBtnSelector.classList.remove("active")
              activeBtnSelector.classList.remove("active")
              allBtnSelector.classList.add("active")
            }
            else if (activeBtnSelector.classList.contains("active")) {
              doneBtnSelector.classList.remove("active")
              activeBtnSelector.classList.remove("active")
              allBtnSelector.classList.add("active")
            }
            return
          }
          for (let j : number = 0; j < tasks.length; j++) {
            if (newText === tasks[j].content) {
              alert("Please do not enter the same task")
              task_text.value = oldText
              return
            }
          }
          tasks[i].content = newText
          localStorage.setItem("tasks", JSON.stringify(tasks))
        }
      }
    })
  })  
  //Romove each task
  task_btn.addEventListener('click', function () {
    let idEl = this.parentElement!.getAttribute('data-id')
    for (let i = 0; i < tasks.length; i++) {
      let index : number = tasks.findIndex( function (o:Task){ 
        return o.id === parseInt(idEl!)
      })
      if (index !== -1) tasks.splice(index, 1);
    }
    taskQuantitySelector.innerText = `${tasks.length} tasks left`
    localStorage.setItem("tasks", JSON.stringify(tasks))
    taskListSelector.removeChild(task_el)
    if ( tasks.length === 0) {
      checkBtnSelector.style.visibility = "hidden"
      controlSectionSelector.style.display = 'none'
      btnDeleteAll.style.visibility = "hidden"
      return
    }
    tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    let num : number = 0
    for (let i = 0; i<tasks.length; i++) {
      if (tasks[i].status) {
        num++
      }
    }
    if (num === 0 ) {
      btnDeleteAll.style.visibility = "hidden"
    }
  })

  task_checkbox.addEventListener('click', function () {
    let idEl = this.parentElement!.getAttribute('data-id')
    let index : number = -1
    let numDoneTask : number = 0
    for (let i = 0; i < tasks.length; i++) {
       index = tasks.findIndex(function (o) {
        return o.id === parseInt(idEl!)
      })
    }
    if (index !== -1) {
      tasks[index].status = !tasks[index].status;
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
    tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    tasks.forEach(task => {
      if (task.status == true) {
        numDoneTask ++
      }
    })
    if (numDoneTask > 0) {
      btnDeleteAll.style.visibility = "visible"
      return
    }
    btnDeleteAll.style.visibility = "hidden"
    
  })
  
  checkBtnSelector.style.visibility = "visible"
  controlSectionSelector.style.display = 'flex'
  
  btnDeleteAll.addEventListener('click', function () {
    deleteDone()
    btnDeleteAll.style.visibility = "hidden"
  })
}
//Delte all done tasks
function deleteDone () {
  let tasks1 : Task[] = tasks.filter(function(task){
    if (task.status === false) {
      return task
    }
  })
  tasks = tasks1;
  localStorage.setItem("tasks", JSON.stringify(tasks))
  taskListSelector.innerHTML = ""
  tasks.forEach( task => {
    render(task)
  })
  doneBtnSelector.classList.remove("active")
  activeBtnSelector.classList.remove("active")
  allBtnSelector.classList.add("active")
  if (tasks.length === 0) {
    controlSectionSelector.style.display = "none"
    btnDeleteAll.style.visibility = "hidden"
    checkBtnSelector.style.visibility = "hidden"
  }
} 

function displayActive () {
  taskListSelector.innerHTML = ""
  tasks = JSON.parse(localStorage.getItem("tasks") || '[]')
  tasks.forEach(task => {
    if(task.status === false){
      render(task)
      btnDeleteAll.style.visibility = "hidden"
    }
  })
}

function displayDone () {
  taskListSelector.innerHTML = ""
  tasks = JSON.parse(localStorage.getItem("tasks") || '[]')
  tasks.forEach(task => {
    if (task.status) {
      render(task)
      btnDeleteAll.style.visibility = "visible"
    }
  })
}

function displayAll () {
  taskListSelector.innerHTML = ""
  tasks = JSON.parse(localStorage.getItem("tasks")  || '[]')
  tasks.forEach( task => {
    render(task)
    if (task.status) {
      btnDeleteAll.style.visibility = "visible"
    }
  })
}
