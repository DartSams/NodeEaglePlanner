
const settingsDropdownContentList = {
    "Edit":"edit task",
    "Delete":"delete task"
}
// const url = "ws://localhost:8000/ws/FutureEagles/"
// const socket = new WebSocket(url);
const socket = io(); //initializes socket io connection and automatically emits connection message

const Months = {
    1:"January",
    2:"February",
    3:"March",
    4:"April",
    5:"May",
    6:"June",
    7:"July",
    8:"August",
    9:"September",
    10:"October",
    11:"November",
    12:"December",
}

function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i].innerText === what.innerText) {
            count++;
            // console.log(array[i].innerText)
            if (count > 1) {
                // console.log(array[i].innerText)
                array[i].remove()
            }
        }
    }
    return count
} //iterates through list of dom elements and if same one (what) is in more than once it removes from dom


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


function openPopup (container,popup,note) {
    container.style.display = "flex"
    if (popup.id == "list-popup" ) {
        popup.style.cssText = `
            width:300px
        `
    } else if (popup.id == "note-popup") {
        popup.style.cssText = `
            width:80%
        `
        if (note) {
            document.querySelector("#new-note-tag").value = note.id
            document.querySelector("#new-note").value = note.innerText
        }
    }
    
} //opens popup conainer recieved from function parameter

function closePopup (container) {
    container.style.display = "none"
    if (container.className == "popup-to-delete") {
        container.remove()
        return
    } // important to stop creating many popup containers will delete edit popup container from html
    // let popupContainer = document.querySelector("#new-note").value = ""
    else if (container.children.id == "note-popup") {
        document.querySelector("#new-note").value = ""
    } else {
        container.style.display = "none"
    }
} //closes popup conainer recieved from function parameter




// socket.emit('testing emit', {
//     msg:"test sucsseful"
// }) //emit json data to backend node under a specific message example <testing emit>


sendTaskData=function(message) {
    let popupContainer = document.querySelector("#popup-container")
    let user = document.querySelector('.profile-user').innerText
    let user_id = document.querySelector('.profile-user').id
    if (message == "add new task") {
        taskValue=document.querySelector('#new-task').value
        taskDate=document.querySelector('#task-date').value
        // socket.send([message,user,user_id,task,taskDate])

        if (socket.connected){
            socket.emit('add new task', {
                msg:message,
                user:user,
                user_id:user_id,
                task:taskValue,
                due_date:taskDate
            }) //creates new entry in task table
          } else {
            console.log(socket)
          }
        closePopup(popupContainer)
        displayNewTask(taskValue,taskDate)
    } else if (message == "add new note") {
        let note = document.querySelector("#new-note").value;
        let noteTag = document.querySelector("#new-note-tag").value
        // socket.send([message,user,user_id,note,noteTag])
        if (socket.connected){
            socket.emit('add new note', {
                msg:message,
                user:user,
                user_id:user_id,
                note:note,
                note_tag:noteTag
            }) //emit json data to backend node under a specific message example <testing emit>
          } else {
            console.log(socket)
          }
        closePopup(popupContainer)
        displayNewNote(note,noteTag)
    }
}

testSocket = function(data){
    // socket.send(data)
    // socket.emit("finished editing note",{
    //     msg:data
    // })
    let splitData = data.split(",")
    if (splitData[0] == "delete task") {
        console.log("deleting task")
        console.log(splitData)
        socket.emit("delete task",{
            task:splitData[1],
            status:splitData[3],
            due_date:splitData[2],
            id:splitData[5]
        })
        document.querySelector(`#${splitData[1]}`).remove() //removes the task element in list-container with the id of task name
    } else if (splitData[0] == "edit task") {
        editTaskPopup(splitData)
    } else if (splitData[0] == "finished editing note") {
        socket.emit("finished editing note",{
            msg:splitData[0],
            user:splitData[1],
            id:splitData[2],
            original_note:splitData[3],
            original_tag:splitData[4],
            new_note:splitData[7],
            new_tag:splitData[8]
        })
    } else if (splitData[0] == "delete note") {
        console.log(splitData)
        socket.emit("delete note",{
            msg:splitData[0],
            user:splitData[1],
            id:splitData[2],
            note:splitData[3]
        })
    } 
} //sends data to consumer.py for db queries

function displayNewTask(task,taskDate) {
    // console.log(task)
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

    for (const key in settingsDropdownContentList) {
        let dropdownLink = document.createElement("a");
        dropdownLink.innerText = key
        dropdownLink.id = `${settingsDropdownContentList[dropdownLink.innerText]},${task},${statusDiv.innerText},${dateDiv.innerText},${profile.id}` //sets dropdown item element id to object key and gets the current list item index
        // console.log(dropdownLink.id)
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
    // socket.emit('testing emit', {
    //     msg:data
    // }) //emit json data to backend node under a specific message example <testing emit>
    const prevData = `${data[1]},${data[2]},${data[3]},${data[4]},${data[5]}`
    // console.log(prevData)
    const splitPrevData = prevData.split(",")
    console.log(splitPrevData)

    let centerDiv = document.querySelector("#center")

    let popupContainer = document.createElement("div");
    popupContainer.id = "popup-container"
    popupContainer.className = "popup-to-delete"

    let popup = document.createElement("div")
    popup.className = "popup"
    popup.style.width = "300px"

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
    // console.log(splitPrevData)
    saveButton.addEventListener("click",function() {
        saveData(splitPrevData)
        closePopup(popupContainer)
        window.location.reload()
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

    openPopup(popupContainer,popup)
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
        "due_date":document.querySelector("#task-date-input").value,
        "status":selectedSize,
        "user":splitPrevData[3],
        "user id":splitPrevData[4],
    }
    const newData = `${newDataJSON["task"]},${newDataJSON["due date"]},${selectedSize},${splitPrevData[3]},${splitPrevData[4]}`
    console.log(newData)
    // testSocket(`finished editing task,${splitPrevData},${newData}`)

    socket.emit("finished editing task",{
        // msg:splitPrevData,
        original_task:splitPrevData[0],
        original_date:splitPrevData[1],
        original_status:splitPrevData[2],
        // new_task:newData[0],
        // new_date:newData[1],
        // new_status:newData[2],
        new_task:newDataJSON.task,
        new_date:newDataJSON.due_date,
        new_status:newDataJSON.status,
        user:splitPrevData[3],
        id:splitPrevData[4],
    })
    document.querySelector("#new-task-input").value = ""
    document.querySelector("#task-date-input").value = ""
} //sends data to testSocket function with data message of finished editing task so it will send data to consumer.py file for db query to change task entry


function displayNewNote(note,tag) {
    let x = Math.floor(Math.random() * 256);
    let y = 100+ Math.floor(Math.random() * 256);
    let z = 50+ Math.floor(Math.random() * 256);
    if (x && y && z > 240) {
        x-=20;
        y-=30;
        z-=30
    }
    let randomColor = `rgb(${x},${y},${z})`
    console.log(note)
    let notesList = document.querySelector("#notes-list")
    let noteItem = document.createElement("li");
    noteItem.className = `note ${tag}`
    noteItem.style.backgroundColor = `${randomColor}`
    let preText = document.createElement("pre");
    preText.innerText = note

    noteItem.append(preText)
    notesList.prepend(noteItem)
} //creates new notes list item with a random background color

function displayTaggedNotes(tag) {
    console.log(`${tag}`)

    if (tag != "all") {
        let noteListReset = document.querySelector("#notes-list").children;
        for (let i = 0;i<noteListReset.length;i++) {
            noteListReset[i].style.display = ""
        } //this is to reset all notes display

        let noteList = document.querySelector("#notes-list").children;
        for (let i = 0;i<noteList.length;i++) {
            if (noteList[i].id != `${tag}`) {
                noteList[i].style.display = "none"
            }
        } //this searches all notes in note list and checks if the id matches the current tag function parameter if not change css style display to none
    } else {
        let noteListReset = document.querySelector("#notes-list").children;
        for (let i = 0;i<noteListReset.length;i++) {
            noteListReset[i].style.display = ""
        } //this is to reset all notes display
    }
}

function selectNote(element) {
    console.log(element)
    let center = document.querySelector("#center")

    let selectedNoteContainer = document.createElement("div");
    selectedNoteContainer.id = "selected-note-container"
    selectedNoteContainer.className = "popup-to-delete"

    let popupNote = document.createElement("div");
    popupNote.id = "selected-note"
    popupNote.style.backgroundColor = element.style.backgroundColor

    let closeNote = document.createElement("div");
    closeNote.id = "close-note"
    closeNote.innerText = "X"
    closeNote.addEventListener("click",function() {
        closePopup(selectedNoteContainer)
    })
    let pre = document.createElement("pre");
    pre.innerText = element.innerText
    let editNoteDiv = document.createElement("div");
    editNoteDiv.id = "selected-note-settings"
    let editNote = document.createElement("button");
    editNote.innerText = "Edit"
    editNote.id = `${document.querySelector(".profile-user").innerText},${document.querySelector(".profile-user").id},${element.innerText},${element.id}`
    editNote.addEventListener("click",function() {
        editNotePopup(editNote.id.split(","))
    })
    let deleteNote = document.createElement("button");
    deleteNote.innerText = "Delete"

    const newDataJSON = {
        "user":document.querySelector(".profile-user").innerText,
        "user id":document.querySelector(".profile-user").id,
        "note":pre.innerHTML,
    }
    deleteNote.addEventListener("click",function() {
        testSocket(`delete note,${newDataJSON["user"]},${newDataJSON["user id"]},${pre.innerHTML}`)
        element.remove()
        closePopup(selectedNoteContainer)
    })
    popupNote.append(closeNote)
    popupNote.append(pre)
    editNoteDiv.append(editNote)
    editNoteDiv.append(deleteNote)
    popupNote.append(editNoteDiv)
    selectedNoteContainer.append(popupNote)
    center.append(selectedNoteContainer)
} //when clicking on a note opens a popup displaying the note for easier read and allows editing/deleting


function editNotePopup(data) {
    let centerDiv = document.querySelector("#center")

    let popupContainer = document.createElement("div");;
    popupContainer.id = "popup-container"
    popupContainer.className = "popup-to-delete"

    let popup = document.createElement("div")
    popup.className = "popup"
    popup.id = "note-popup"

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

    let noteTagInput = document.createElement("input");
    noteTagInput.id = "edited-tag-input"
    noteTagInput.value = data[3]

    let textareaInput = document.createElement("textarea");
    textareaInput.id = "edit-note-input"
    textareaInput.type = "date"
    textareaInput.value = data[2]

    let saveButton = document.createElement("button")
    saveButton.innerHTML = "Save"
    saveButton.id = ""
    saveButton.addEventListener("click",function() {
        saveNoteData(data)
        closePopup(popupContainer)
        window.location.reload()
    })

    
    popupHeader.append(closePopupButton)
    popupBody.append(popupBodyText)

    popupFooter.append(noteTagInput)
    popupFooter.append(textareaInput)
    popupFooter.append(document.createElement("br"))
    popup.append(popupHeader)
    popup.append(popupBody)
    popup.append(popupFooter)
    popupFooter.append(saveButton)

    popupContainer.append(popup)
    centerDiv.append(popupContainer)

    openPopup(popupContainer,popup)
} //creates a new popup div to edit currently selected task

function saveNoteData(prevData) {    
    const newDataJSON = {
        "user":prevData[0],
        "user id":prevData[1],
        "note":document.querySelector("#edit-note-input").value,
        "note_tag":document.querySelector("#edited-tag-input").value,
    }
    const newData = `${newDataJSON["user"]},${newDataJSON["user id"]},${newDataJSON["note"]},${newDataJSON["note_tag"]}`

    testSocket(`finished editing note,${prevData},${newData}`)
    document.querySelector("#edit-note-input").value = ""
    document.querySelector("#edited-tag-input").value = ""
} //saves the new note and sends to the cosnumer.py file with data message of finished editing note

function getDaysInMonth(month,year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    return new Date(year, month, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month+1, 0).getDate();
};

function createMonth(monthHolder,dayHolder,tasks) {
    console.log(tasks)
    // console.log(tasks[0].task)
    let centerDiv = document.querySelector("#center")
    let calendarContainer = document.createElement("div");
    calendarContainer.id = "calendar-container"
    let calendarHeader = document.createElement("div");
    calendarHeader.id = "calendar-header"
    let prevMonthDiv = document.createElement("div");
    prevMonthDiv.id = "prev-month"
    let prevMonthButton = document.createElement("button");
    prevMonthButton.innerText = "???"
    prevMonthDiv.addEventListener("click",function() {
        console.log("previous month")
        document.querySelector("#calendar-container").remove()
        createMonth(monthHolder-1,getDaysInMonth(monthHolder-1,2022),tasks)
    })

    let currentMonthYear = document.createElement("div");
    currentMonthYear.id = "current-month-year"
    currentMonthYear.innerText = `${Months[monthHolder]} 2022`

    let nextMonthDiv = document.createElement("div");
    nextMonthDiv.id = "next-month"
    let nextMonthButton = document.createElement("button");
    nextMonthButton.innerText = "???"
    nextMonthDiv.addEventListener("click",function() {
        console.log("next month")
        document.querySelector("#calendar-container").remove()
        createMonth(monthHolder+1,getDaysInMonth(monthHolder+1,2022),tasks)
    })

    let dayContainer = document.createElement("div");
    dayContainer.id = "days-container"
    let ulDays = document.createElement("ul");
    ulDays.id = "month"
    let num = 0
    for (let i=1;i<=dayHolder;i++) {
        let liDay = document.createElement("li");
        liDay.id = "day"

        let dayNum = document.createElement("div");
        dayNum.id = "day-number"
        dayNum.innerText = i
        
        let dayTask = document.createElement("div");
        dayTask.id = "day-task"
        for (let key in tasks) {
            month = tasks[key].due_date.replace("'","").split("-")
            day = tasks[key].due_date.split("-")
            // console.log(day)
            if (i == day[2] &&  Months[monthHolder] == Months[parseInt(month[1])] ) {
                let task = document.createElement("div");
                task.innerText = tasks[num].task
                // console.log(tasks[num].task)
                dayTask.append(task)
                num++
            } else {
                dayNum.innerText = i
            } 
        } 
        liDay.append(dayNum)
        liDay.append(dayTask)
        ulDays.append(liDay)
    }


    dayContainer.append(ulDays)
    prevMonthDiv.append(prevMonthButton)
    nextMonthDiv.append(nextMonthButton)
    calendarHeader.append(prevMonthDiv)
    calendarHeader.append(currentMonthYear)
    calendarHeader.append(nextMonthDiv)
    calendarContainer.append(calendarHeader)
    calendarContainer.append(dayContainer)
    centerDiv.append(calendarContainer)
}