function updateClock() {
    let now = new Date();

    document.getElementById("time").textContent =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    document.getElementById("date").textContent =
        now.toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric"
        });
}

updateClock();
setInterval(updateClock, 1000);


let biggestIndex = 10;


function openWindow(name) {
    let win = document.getElementById(name + "-window");

    if (!win) {
        return;
    }

    win.style.display = "block";

    biggestIndex++;
    win.style.zIndex = biggestIndex;

    showNotification(name + " opened");
}


function closeWindow(name) {
    let win = document.getElementById(name + "-window");

    if (!win) {
        return;
    }

    win.style.display = "none";
}

let windows = document.querySelectorAll(".window");

windows.forEach(function(win) {

    let header = win.querySelector(".window-header");

    let moving = false;
    let offsetX = 0;
    let offsetY = 0;


    win.addEventListener("mousedown", function() {
        biggestIndex++;
        win.style.zIndex = biggestIndex;
    });


    header.addEventListener("mousedown", function(event) {

        moving = true;

        let rect = win.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        biggestIndex++;
        win.style.zIndex = biggestIndex;
    });


    document.addEventListener("mousemove", function(event) {

        if (!moving) {
            return;
        }

        win.style.left = event.clientX - offsetX + "px";
        win.style.top = event.clientY - offsetY + "px";
        win.style.transform = "none";
    });


    document.addEventListener("mouseup", function() {
        moving = false;
    });

});

let icons = document.querySelectorAll(".app-icon");

icons.forEach(function(icon) {

    icon.addEventListener("click", function() {

        icons.forEach(function(other) {
            other.classList.remove("selected");
        });

        icon.classList.add("selected");

        let name = icon.getAttribute("data-window");

        openWindow(name);
    });

});

let notes = JSON.parse(localStorage.getItem("novaNotes")) || [];
let currentNote = 0;


function saveNotesToStorage() {
    localStorage.setItem("novaNotes", JSON.stringify(notes));
}


function loadNotes() {

    let list = document.getElementById("notes-list");

    list.innerHTML = "";


    if (notes.length === 0) {

        notes.push({
            title: "Welcome Note",
            content: "This is your NOVA notes app. Create something!"
        });

        saveNotesToStorage();
    }


    notes.forEach(function(note, index) {

        let item = document.createElement("div");

        item.className = "note-item";
        item.textContent = note.title || "Untitled";


        item.addEventListener("click", function() {
            selectNote(index);
        });


        list.appendChild(item);
    });


    selectNote(currentNote);
}


function selectNote(index) {

    if (!notes[index]) {
        return;
    }

    currentNote = index;

    document.getElementById("note-title").value = notes[index].title;
    document.getElementById("note-content").value = notes[index].content;


    let items = document.querySelectorAll(".note-item");

    items.forEach(function(item) {
        item.classList.remove("active");
    });


    if (items[index]) {
        items[index].classList.add("active");
    }
}


function addNote() {

    notes.push({
        title: "New Note",
        content: ""
    });

    currentNote = notes.length - 1;

    saveNotesToStorage();
    loadNotes();

    showNotification("New note created");
}


function saveNote() {

    if (!notes[currentNote]) {
        return;
    }

    notes[currentNote].title =
        document.getElementById("note-title").value;

    notes[currentNote].content =
        document.getElementById("note-content").value;

    saveNotesToStorage();
    loadNotes();

    showNotification("Note saved");
}


loadNotes();

let calculatorValue = "0";


function addToCalculator(value) {

    if (calculatorValue === "0") {
        calculatorValue = "";
    }

    calculatorValue += value;

    document.getElementById("calc-display").value =
        calculatorValue;
}


function clearCalculator() {

    calculatorValue = "0";

    document.getElementById("calc-display").value =
        calculatorValue;
}


function calculate() {

    try {

        let answer = Function(
            "return " + calculatorValue
        )();

        calculatorValue = String(answer);

        document.getElementById("calc-display").value =
            calculatorValue;

    } catch (error) {

        calculatorValue = "Error";

        document.getElementById("calc-display").value =
            calculatorValue;

        setTimeout(clearCalculator, 1000);
    }
}

let focusSeconds = 25 * 60;
let focusInterval = null;


function updateTimer() {

    let minutes = Math.floor(focusSeconds / 60);
    let seconds = focusSeconds % 60;

    document.getElementById("timer").textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}


function startTimer() {

    if (focusInterval !== null) {
        return;
    }

    focusInterval = setInterval(function() {

        if (focusSeconds > 0) {

            focusSeconds--;
            updateTimer();

        } else {

            clearInterval(focusInterval);
            focusInterval = null;

            showNotification("Focus session complete!");
        }

    }, 1000);
}


function pauseTimer() {

    clearInterval(focusInterval);
    focusInterval = null;
}


function resetTimer() {

    clearInterval(focusInterval);

    focusInterval = null;
    focusSeconds = 25 * 60;

    updateTimer();
}


updateTimer();

function toggleTheme() {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {

        localStorage.setItem("novaTheme", "light");
        showNotification("Light mode enabled");

    } else {

        localStorage.setItem("novaTheme", "dark");
        showNotification("Dark mode enabled");
    }
}


if (localStorage.getItem("novaTheme") === "light") {
    document.body.classList.add("light");
}

let notificationTimeout;


function showNotification(message) {

    let notification =
        document.getElementById("notification");

    let text =
        document.getElementById("notification-text");

    text.textContent = message;

    notification.style.display = "block";


    clearTimeout(notificationTimeout);


    notificationTimeout = setTimeout(function() {
        notification.style.display = "none";
    }, 2500);
}

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        document.querySelectorAll(".window").forEach(function(win) {
            win.style.display = "none";
        });
    }

});
