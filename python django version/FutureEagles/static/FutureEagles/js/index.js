
const dropContentList = {
    "Edit":"edit task",
    // "Change status":"change task status",
    "Delete":"delete task"
}
const url = "ws://localhost:8000/ws/FutureEagles/"
const socket = new WebSocket(url);



function showMobileNav() {
    let openSideBar = document.getElementById("sidebar");
    let hamburger = document.getElementById("toggle").children;
    let mainContent = document.getElementById("center");
    if (openSideBar.style.left < "0px") {
        openSideBar.style.left = "0px"
        
        //turn sidebar hamburger into a X
        hamburger.item(2).style.display = "none"
        hamburger.item(0).style.cssText = `
            transform: rotate(45deg) translate(5px, 5px);
            transition: 1s
        `
        hamburger.item(1).style.cssText = `
            transform: rotate(-45deg) ;
            transition: 1s;
        `
        mainContent.style.backgroundColor = "rgba(0,0,0,0.3)"
    } else {
        openSideBar.style.cssText ="left:-310px"

        //turn sidebar X into hamburger
        hamburger.item(2).style.display = "block"
        hamburger.item(0).style.cssText = `
            transform: rotate(0deg);
            transition: 1s
        `
        hamburger.item(1).style.cssText = `
            transform: rotate(0deg);
            transition: 1s;
        `
        mainContent.style.backgroundColor = "white"

    }
}


function openPopup (container) {
    // console.log(container)
    container.style.display = "flex"
} //opens popup conainer recieved from function parameter

function closePopup (container) {
    // console.log(container)
    container.style.display = "none"
    if (container.className == "popup-to-delete") {
        container.remove()
    } // important to stop creating many popup containers will delete edit popup container from html
} //closes popup conainer recieved from function parameter




// socket.onopen = function(event) {
//     console.log("sockets started")
//     console.log('connection is open')
//     console.log(event)
//     socket.send('Thanks for connecting')

//     for(let i=0;i<=2;i++){
//         displayNewTask("sleep","now")
//     } //test the limits of creating task using js dom using automatic data of 100 task

//     socket.send("change task status")

// } //when page first opens

socket.onmessage = function(event) {
    console.log('message is recieved')
    // console.log(event['data'])
    // getMe(event['data'])
    // up(event['data'])
    data = event['data']
    // console.log(data)
} //when server sends data to frontend

socket.onclose = function(event) {
    console.log('connection is closed')
} //

// socket.onerror = function(event) {
//     console.log(event)
// }


sendTaskData=function(message) {
    // console.log("tester")
    let popupContainer = document.querySelector("#popup-container")
    user = document.querySelector('.profile-user').innerText
    user_id = document.querySelector('.profile-user').id
    task=document.querySelector('#new-task').value
    taskDate=document.querySelector('#task-date').value
    socket.send([message,user,user_id,task,taskDate])
    // console.log(message,user,user_id,task,taskDate)
    closePopup(popupContainer)
    displayNewTask(task,taskDate)
}

testSocket = function(data){
    socket.send(data)
    let splitData = data.split(",")
    if (splitData[0] == "delete task") {
        console.log("deleting task")
        document.querySelector(`#${splitData[1]}`).remove()
    } else if (splitData[0] == "edit task") {
        editTaskPopup(splitData)
    }
} //sends data to consumer.py for db queries

function displayNewTask(task,taskDate) {
    let ul = document.querySelector("#list-container")
    let li = document.createElement("li");
    let profile = document.querySelector(".profile-user")
    li.id=task //sets the current list item to the index

    let taskDiv = document.createElement("div");
    taskDiv.id = "task"
    taskDiv.innerText = task
    li.appendChild(taskDiv);

    let dateDiv = document.createElement("div");
    dateDiv.id = "end-date";
    dateDiv.innerText = taskDate
    li.appendChild(dateDiv);

    let statusDiv = document.createElement("div");
    statusDiv.id = "status"
    statusDiv.innerText = "active"
    li.appendChild(statusDiv)

    let dropdown = document.createElement("div");
    dropdown.id = "dropdown"
    let settingsDivContainer = document.createElement("div");
    settingsDivContainer.id = "settings-container"
    let settingsDiv = document.createElement("div");
    settingsDiv.id = "settings"
    for (let i = 0;i <= 2;i++) {
        let span = document.createElement("span");
        settingsDiv.appendChild(span)
    } //creates settings button
    let dropdownContent = document.createElement("div");
    dropdownContent.id = "dropdown-content"
    // dropContentList = ["link 1","link 2","link 3"]
    // for (let j = 0;j<=dropContentList.length-1;j++) {
    //     let dropdownLink = document.createElement("a");
    //     dropdownLink.innerText = dropContentList[j]
    //     console.log(dropContentList[j])
    //     dropdownContent.appendChild(dropdownLink)
    // }


    // dropContentList = {
    //     "link 1":"first",
    //     "link 2":"second",
    //     "link 3":"third"
    // }
    for (const key in dropContentList) {
        let dropdownLink = document.createElement("a");
        dropdownLink.innerText = key
        dropdownLink.id = `${dropContentList[dropdownLink.innerText]},${task},${profile.id}` //sets dropdown item element id to object key and gets the current list item index
        // dropdownLink.id = JSON.stringify({
        //     "backend task":dropContentList[dropdownLink.innerText],
        //     "task id":li.id,
        //     "task":task
        // })
        dropdownLink.addEventListener("click",function(){
            console.log(dropdownLink.id)
            testSocket(dropdownLink.id) 
        }) //when dropdown item clicked it sends data to backend consumer
        dropdownContent.appendChild(dropdownLink)
    } //creates dropdown menu when hovering over settings button

    settingsDivContainer.appendChild(settingsDiv)
    dropdown.appendChild(settingsDivContainer)
    dropdown.appendChild(dropdownContent)
    li.appendChild(dropdown)
    ul.appendChild(li)
} //apends new task to task container

function editTaskPopup(data) {
    // console.log(data)

    const prevData = `${data[1]},${data[2]},${data[3]},${data[4]},${data[5]}`
    const splitPrevData = prevData.split(",")

    let centerDiv = document.querySelector("#center")

    let popupContainer = document.createElement("div");;
    popupContainer.id = "popup-container"
    popupContainer.className = "popup-to-delete"

    let popup = document.createElement("div")
    popup.className = "popup"

    let popupHeader = document.createElement("div");
    popupHeader.className = "popup-header"
    let closePopupButton = document.createElement("button");
    closePopupButton.innerText = "X"
    closePopupButton.addEventListener("click",function() {
        closePopup(popupContainer)
    })

    let popupBody = document.createElement("div");
    popupBody.className = "popup-body"
    let popupBodyText = document.createElement("h3");
    popupBodyText.innerText = "Edit task below."
    
    let popupFooter = document.createElement("div");
    popupFooter.id = "popup-footer"
    let taskInput = document.createElement("input")
    taskInput.id = "new-task-input"
    taskInput.value = splitPrevData[0]

    let duedateInput = document.createElement("input");
    duedateInput.id = "task-date-input"
    duedateInput.type = "date"
    duedateInput.value = splitPrevData[1]

    let statusInputActive = document.createElement("input");
    statusInputActive.type = "radio"
    statusInputActive.id = "active"
    statusInputActive.value = "active"
    statusInputActive.name = "status"
    let activeLabel = document.createElement("label");
    activeLabel.innerText = "Active"
    activeLabel.htmlFor = "active"

    let statusInputNonActive = document.createElement("input");
    statusInputNonActive.type = "radio"
    statusInputNonActive.id = "non active"
    statusInputNonActive.value = "non active"
    statusInputNonActive.name = "status"
    // statusInputNonActive.checked = true
    let nonactiveLabel = document.createElement("label");
    nonactiveLabel.innerText = "deactivate"
    nonactiveLabel.htmlFor = "non active"

    if (splitPrevData[2] == "active") {
        statusInputActive.checked = true
    } else if (splitPrevData[2] == "non active") {
        statusInputNonActive.checked = true
    }

    let saveButton = document.createElement("button")
    saveButton.innerHTML = "Save"
    saveButton.addEventListener("click",function() {
        saveData(splitPrevData)
        closePopup(popupContainer)
    })

    
    popupHeader.append(closePopupButton)
    popupBody.append(popupBodyText)
    popupFooter.append(taskInput)
    popupFooter.append(duedateInput)
    popupFooter.append(document.createElement("br"))
    popupFooter.append(statusInputActive)
    popupFooter.append(activeLabel)
    popupFooter.append(statusInputNonActive)
    popupFooter.append(nonactiveLabel)
    popupFooter.append(document.createElement("br"))
    popupFooter.append(document.createElement("br"))


    popup.append(popupHeader)
    popup.append(popupBody)
    popup.append(popupFooter)
    popupFooter.append(saveButton)

    popupContainer.append(popup)
    centerDiv.append(popupContainer)

    openPopup(popupContainer)
} //creates a new popup div to edit currently selected task

function saveData(splitPrevData) {

    const radioButtons = document.querySelectorAll("input[name='status']");
    let selectedSize;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedSize = radioButton.value;
            break;
        }
    }
    const newDataJSON = {
        "task":document.querySelector("#new-task-input").value,
        "due date":document.querySelector("#task-date-input").value,
        "status":selectedSize,
        "user":splitPrevData[4],
        "user id":splitPrevData[5],
    }
    const newData = `${newDataJSON["task"]},${newDataJSON["due date"]},${selectedSize},${splitPrevData[3]},${splitPrevData[4]}`

    testSocket(`finished editing,${splitPrevData},${newData}`)
} //sends data to testSocket function with data message of finished editing so it will send data to consumer.py file for db query to change task entry