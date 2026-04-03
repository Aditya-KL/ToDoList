let body = document.querySelector("body");
let mainPage = document.querySelector("#main-page");
let addPage = document.querySelector("#add-page");
let addBox = document.querySelector("#add-box");
let searchBtn = document.querySelector("#search-btn");
let themeBtn = document.querySelector("#theme-btn");
let addBtn = document.querySelector("#add-btn");
let cancelBtn = document.querySelector("#cancel-btn");
let applyBtn = document.querySelector("#apply-btn");
let backBtn = document.querySelector("#back-btn");
let priorityBtn = document.querySelectorAll(".priority-btn");
let themeImg = document.querySelector("#theme-img");
let addInput = document.querySelector("#add-input")
let searchInput = document.querySelector("#search-input");
let tasks = document.getElementById("tasks");
let select = document.getElementById("options");
let lists = document.querySelectorAll("li");
let result = document.querySelector("#result");
let listUL = ["high", "mid", "low", "checked"];
let mode = "light";

themeBtn.addEventListener("click", () => {
    if(mode == "light"){
        body.style.backgroundColor = "#222831";
        mainPage.style.backgroundColor = "#393e46";
        mainPage.style.color = "#fff";
        document.querySelector("h1").style.color = "#FE7743";
        document.querySelector("h2").style.color = "#FE7743";
        document.querySelector("#para").style.color = "#FE7743";
        addBox.style.backgroundColor = "#393e46";
        themeImg.src = "icons/sun.png"
        mode = "dark"
    }else{
        body.style.backgroundColor = " #DDDDDD";
        mainPage.style.backgroundColor = " #EFEEEA";
        mainPage.style.color = "black";
        document.querySelector("h1").style.color = "black";
        document.querySelector("h2").style.color = "black";
        document.querySelector("#para").style.color = "black";
        addBox.style.backgroundColor = " #EFEEEA";
        themeImg.src = "icons/moon.png"
        mode = "light"
    }
    saveData();
});

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    let filter = btn.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("selected"));
    btn.classList.add("selected");
    if (filter === "all") {
      listUL.forEach(id => {
        document.getElementById(id).style.display = "block";
      });
    } else {
      listUL.forEach(id => {
        let el = document.getElementById(id);
        el.style.display = (id === filter) ? "block" : "none";
      });
    }
  });
});


addBtn.addEventListener("click", () => {
    addPage.style.display = "flex";  
});

cancelBtn.addEventListener("click", () => {
    addPage.style.display = "none";  
    addInput.value = "";
    let selectedPriority = document.querySelector(".priority-btn.selected");
    selectedPriority.classList.remove("selected");
});

priorityBtn.forEach(button => {
    button.addEventListener("click", () => {
        priorityBtn.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});

applyBtn.addEventListener("click", ()=>{
    let selectedPriority = document.querySelector(".priority-btn.selected");
    if(!selectedPriority && addInput.value === ''){
        alert("Please provide name and priority for this task");
    }else if (!selectedPriority) {
        alert("Please select a priority for this task");
    }else if(addInput.value === ''){
        alert("Please provide a name for this task.");
    }else{
        let li = document.createElement("li");
        li.innerText = addInput.value;
        addInput.value = "";
        let span = document.createElement("span")
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        let priority = selectedPriority.dataset.priority;
        li.dataset.originalParent = priority;
        let parent;
        if (priority === "high") parent = document.getElementById("high");
        else if (priority === "mid") parent = document.getElementById("mid");
        else if (priority === "low") parent = document.getElementById("low");
        selectedPriority.classList.remove("selected");
        parent.appendChild(li);
        addPage.style.display = "none";
        saveData();
    }
});

function handleTaskClick(event) {
    let li = event.target;
    if (li.tagName === "LI") {
        const originalParentId = li.dataset.originalParent;
        li.classList.toggle("checked");
        if (li.classList.contains("checked")) {
            document.getElementById("checked").appendChild(li);
        } else {
            if (originalParentId) {
                document.getElementById(originalParentId).appendChild(li);
            }
        }
        saveData();
    } else if (li.tagName === "SPAN") {
        li.parentElement.remove();
        saveData();
    }
}
tasks.addEventListener("click", handleTaskClick);

function saveData(){
    let allTasks = [];
    document.querySelectorAll("#tasks li").forEach(li => {
    allTasks.push({
      text: li.childNodes[0].nodeValue.trim(),
      priority: li.dataset.originalParent,
      checked: li.classList.contains("checked")
    });
  });
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    localStorage.setItem("theme", mode);
};

function loadData() {
    const storedData = JSON.parse(localStorage.getItem("tasks"));
    if (!storedData) return;

    if (localStorage.getItem("theme") === "dark" && mode !== "dark") themeBtn.click();

    storedData.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.checked) li.classList.add("checked");
        li.dataset.originalParent = task.priority;

        const span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        let parentId = task.checked ? "checked" : task.priority;
        let parentElem = document.getElementById(parentId) || document.getElementById("tasks");
        parentElem.appendChild(li);
    });
}

window.addEventListener("DOMContentLoaded", loadData);