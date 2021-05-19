let tc = document.querySelector(".ticket_container");
let allFilters = document.querySelectorAll(".filter");
let action = document.querySelector(".add");
let modalVisible = false;
let selectedPriority;
let deleteBtn = document.querySelector(".delete");

function loadTickets(colour) {

    let alltasks = localStorage.getItem("allTasks");
    alltasks = JSON.parse(alltasks);
    if (colour != null) {
        alltasks = alltasks.filter(function (data) {
            return (data.priority == colour);
        })
    }

    for (let k = 0; k < alltasks.length; k++) {


        let ticket = document.createElement("div");

        ticket.classList.add("ticket");
        ticket.innerHTML = `<div class="ticket_colour ticket_colour_${alltasks[k].priority}"></div>
        <div class="ticket_id">#${alltasks[k].ticketId}</div>
        <div class="task"> ${alltasks[k].task} </div>`;

        tc.appendChild(ticket);
        ticket.addEventListener("click", function (e) {
            if (e.currentTarget.classList.contains("active")) {
                e.currentTarget.classList.remove("active");
            } else {
                e.currentTarget.classList.add("active");
            }
        });

    }

}

loadTickets();

for (let i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", handleFilter)
}

function handleFilter(e) {
    // let filterColor = e.currentTarget.children[0].classList[0].split("_")[0];
    // tc.style.backgroundColor = filterColor;

    let span = e.currentTarget.children[0];
    let style = getComputedStyle(span);
    let colour = style.backgroundColor;

    if (colour == "rgb(255, 0, 0)") {
        colour = "red";
    }
    else if (colour == "rgb(0, 128, 0)") {
        colour = "green";
    }
    else if (colour == "rgb(255, 255, 0)") {
        colour = "yellow";
    }
    else if (colour == "rgb(255, 192, 203)") {
        colour = "pink";
    }

    tc.innerHTML = "";
    if (e.currentTarget.classList.contains("active")) {
        e.currentTarget.classList.remove("active");
        loadTickets();
    } else {

        let activeFilter = document.querySelector(".filter.active");
        if (activeFilter) {
            activeFilter.classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        loadTickets(colour);
    }

}

deleteBtn.addEventListener("click", function (e) {

    let selectedTickets = document.querySelectorAll(".ticket.active");
    let allTasks = JSON.parse(localStorage.getItem("allTasks"));

    for (let j = 0; j < selectedTickets.length; j++) {

        selectedTickets[j].remove();
        let ticketid = selectedTickets[j].querySelector(".ticket_id").innerText;
        allTasks = allTasks.filter(function (data) {
            return (("#" + data.ticketId) != ticketid);
        })
    }
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
})

action.addEventListener("click", handleAction);

function handleAction(e) {
    if (!modalVisible) {

        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `<div class="text_container" contenteditable="true" data-type="false">Enter your text here.... </div>
                        <div class="priority_container">
                          <div class="red_filter modal_filter" ></div >
                          <div class="green_filter modal_filter"></div>
                          <div class="yellow_filter modal_filter"></div>
                          <div class="pink_filter modal_filter active"></div>
                        </div >`;

        tc.appendChild(modal);
        selectedPriority = "pink";
        let fetchedModal = document.querySelector(".text_container");

        fetchedModal.addEventListener("click", function (e) {
            if (e.currentTarget.getAttribute("data-type") == "false") {
                e.currentTarget.innerText = "";
                e.currentTarget.setAttribute("data-type", "true");
            }
        });

        modalVisible = true;
        fetchedModal.addEventListener("keypress", addTicket.bind(this, fetchedModal));

        // let modal = document.createElement("div");
        // modal.classList.add("modal");
        // modal.innerHTML = ` <div class="text_container" contenteditable="true"> </div>
        //                 <div class="priority_container">
        //                    <div class="red_filter modal_filter" ></div >
        //                    <div class="green_filter modal_filter"></div>
        //                    <div class="yellow_filter modal_filter"></div>
        //                    <div class="pink_filter modal_filter"></div>
        //                 </div >`;
        // tc.appendChild(modal);

        let modalFilter = document.querySelectorAll(".modal_filter");
        for (let i = 0; i < modalFilter.length; i++) {
            modalFilter[i].addEventListener("click", selectPriority.bind(this, fetchedModal));
        }

    }

}
function addTicket(taskModal, e) {

    if (e.key == "Enter" && e.shiftKey == false && taskModal.innerText.trim() != "") {

        let task = taskModal.innerText;
        let ticket = document.createElement("div");
        let id = uid();

        // ticket.classList.add("ticket");
        // ticket.innerHTML = `<div class="ticket_colour ticket_colour_${selectedPriority}"></div>
        // <div class="ticket_id">#${id}</div>
        // <div class="task"> ${task} </div>`;
        // tc.appendChild(ticket);

        document.querySelector(".modal").remove();
        modalVisible = false;
       

        let allTasks = localStorage.getItem("allTasks");
        if (allTasks == null) {
            let data = [{ "ticketId": id, "task": task, "priority": selectedPriority }];
            localStorage.setItem("allTasks", JSON.stringify(data));
        } else {
            let data = JSON.parse(allTasks);
            data.push({ "ticketId": id, "task": task, "priority": selectedPriority });
            localStorage.setItem("allTasks", JSON.stringify(data));

        }
        
        
        let activeFilter = document.querySelector(".filter.active");
        tc.innerHTML = "" ; 
        if(activeFilter){
           let colour = e.currentTarget.children[0].classList[0].split("-")[0];
           loadTickets(colour);
        }else{
            loadTickets();
        }

        ticket.addEventListener("click", function (e) {
            if (e.currentTarget.classList.contains("active")) {
                e.currentTarget.classList.remove("active");
            } else {
                e.currentTarget.classList.add("active");
            }
        })
    } else if (e.key == "Enter" && e.shiftKey == false) {

        e.preventDefault();
        alert("Error! You have not typed anything in the text area.")
    }

}

function selectPriority(taskModal, e) {

    let activeFilter = document.querySelector(".modal_filter.active");
    activeFilter.classList.remove("active");
    selectedPriority = e.currentTarget.classList[0].split("_")[0];
    e.currentTarget.classList.add("active");
    taskModal.click();
    taskModal.focus();

}
