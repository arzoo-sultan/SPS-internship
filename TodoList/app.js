let points=0
let streak=0
let tasks=JSON.parse(localStorage.getItem("tasks"))||[]
let selectedIndex=0

const input=document.getElementById("taskInput")
const list=document.getElementById("taskList")

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks))
}

function formatTime(sec){
let m=Math.floor(sec/60)
let s=sec%60
return `${m}:${s<10?"0":""}${s}`
}

function render(){
list.innerHTML=""

tasks.forEach((task,i)=>{
let li=document.createElement("li")
if(i===selectedIndex) li.classList.add("selected")

li.innerHTML=`
<div class="task-top">
<span class="${task.completed?'completed':''}"
onclick="toggleTask(${i})">${task.text}</span>

<div class="actions">
<span class="edit" onclick="editTask(event,${i})">✏️</span>
<span class="delete" onclick="deleteTask(${i})">✖</span>
</div>
</div>

<div class="timer">
⏱ <span id="time-${i}">${formatTime(task.time)}</span>
<button onclick="startTimer(${i})">▶</button>
<button onclick="pauseTimer(${i})">⏸</button>
<button onclick="resetTimer(${i})">🔄</button>
</div>
`

list.appendChild(li)
})

updateProgress()
}

function updateProgress(){
let done=tasks.filter(t=>t.completed).length
let total=tasks.length
document.getElementById("progress").style.width=
(total?done/total*100:0)+"%"
}

function addTask(){
if(!input.value) return

tasks.push({
text:input.value,
completed:false,
rewarded:false,
time:1500,
interval:null
})

input.value=""
save()
render()
}

function toggleTask(i){
let t=tasks[i]
t.completed=!t.completed

if(t.completed && !t.rewarded){
points+=10
streak+=1
t.rewarded=true
}

document.getElementById("points").innerText=points
document.getElementById("streak").innerText=streak

save()
render()
}

function editTask(e,i){
e.stopPropagation()
let txt=prompt("Edit task",tasks[i].text)
if(txt){
tasks[i].text=txt
save()
render()
}
}

function deleteTask(i){
tasks.splice(i,1)
if(selectedIndex>0) selectedIndex--
save()
render()
}

/* Pomodoro */
function startTimer(i){
if(tasks[i].interval) return

tasks[i].interval=setInterval(()=>{
tasks[i].time--
document.getElementById(`time-${i}`).innerText=
formatTime(tasks[i].time)

if(tasks[i].time<=0){
clearInterval(tasks[i].interval)
tasks[i].interval=null
alert("Pomodoro finished!")
}
},1000)
}

function pauseTimer(i){
clearInterval(tasks[i].interval)
tasks[i].interval=null
}

function resetTimer(i){
pauseTimer(i)
tasks[i].time=1500
render()
}

/* Keyboard Controls */
document.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){
addTask()
}

if(e.key==="ArrowDown"){
if(selectedIndex<tasks.length-1) selectedIndex++
render()
}

if(e.key==="ArrowUp"){
if(selectedIndex>0) selectedIndex--
render()
}

if(e.key==="Delete"){
deleteTask(selectedIndex)
}

if(e.key===" "){
e.preventDefault()
toggleTask(selectedIndex)
}

if(e.key==="e"){
editTask(new Event("click"),selectedIndex)
}

if(e.ctrlKey && e.key==="Enter"){
startTimer(selectedIndex)
}

})

document.getElementById("addBtn").addEventListener("click",addTask)

render()