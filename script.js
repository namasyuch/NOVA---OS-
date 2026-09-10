/* ================= CLOCK ================= */

function updateClock() {

    let now = new Date();

    let time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    let date = now.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric"
    });

    document.getElementById("time").textContent = time;
    document.getElementById("date").textContent = date;
}

updateClock();

setInterval(updateClock, 1000);


/* ================= WINDOWS ================= */

let biggestIndex = 10;

function openWindow(name) {

    let windowElement = document.getElementById(name + "-window");

    if (!windowElement) {
        return;
    }

    windowElement.style.display = "block";

    biggestIndex++;

    windowElement.style.zIndex = biggestIndex;

    showNotification(name.charAt(0).toUpperCase() + name.slice(1) + " opened");
}


function closeWindow(name) {

    let windowElement = document.getElementById(name + "-window");

    if (!windowElement) {
        return;
    }

    windowElement.style.display = "none";
}


/* ================= BRING WINDOW TO FRONT ================= */

document.querySelectorAll(".window").forEach(function(windowElement) {

    windowElement.addEventListener("mousedown", function() {

        biggestIndex++;

        windowElement.style.zIndex = biggestIndex;

    });

});


/* ================= DRAGGING ================= */

let windows = document.querySelectorAll(".window");

windows.forEach(function(windowElement) {

    let header = windowElement.querySelector(".window-header");

    let moving = false;

    let offsetX = 0;
    let offsetY = 0;


    header.addEventListener("mousedown", function(event) {

        moving = true;

        let rect = windowElement.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        biggestIndex++;

        windowElement.style.zIndex = biggestIndex;

    });


    document.addEventListener("mousemove", function(event) {

        if (!moving) {
            return;
        }

        let x = event.clientX - offsetX;
        let y = event.clientY - offsetY;

        windowElement.style.left = x + "px";
        windowElement.style.top = y + "px";

        windowElement.style.transform = "none";

    });


    document.addEventListener("mouseup", function() {

        moving = false;

    });

});


/* ================= DESKTOP ICONS ================= */

let icons = document.querySelectorAll(".app-icon");

icons.forEach(function(icon) {

    icon.addEventListener("click", function() {

        icons.forEach(function(otherIcon) {
            otherIcon.classList.remove("selected");
        });

        icon.classList.add("selected");

        let windowName = icon.getAttribute("data-window");

        openWindow(windowName);

    });

});


/* ================= NOTES ================= */

let notes = JSON.parse(localStorage.getItem("novaNotes")) || [];

let currentNote = 0;


function loadNotes() {

    let list = document.getElementById("notes-list");

    list.innerHTML = "";


    if (notes.length === 0) {

        let firstNote = {
            title: "Welcome Note",
            content: "This is your NOVA notes app. Create something!"
        };

        notes.push(firstNote);

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

    document.getElementById("note-title").value =
        notes[index].title;

    document.getElementById("note-content").value =
        notes[index].content;


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


function saveNotesToStorage() {

    localStorage.setItem(
        "novaNotes",
        JSON.stringify(notes)
    );

}


loadNotes();


/* ================= CALCULATOR ================= */

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


/* ================= FOCUS TIMER ================= */

let focusSeconds = 25 * 60;

let focusInterval = null;


function updateTimer() {

    let minutes = Math.floor(focusSeconds / 60);

    let seconds = focusSeconds % 60;

    let displayMinutes = String(minutes).padStart(2, "0");

    let displaySeconds = String(seconds).padStart(2, "0");

    document.getElementById("timer").textContent =
        displayMinutes + ":" + displaySeconds;
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


/* ================= THEME ================= */

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


/* ================= NOTIFICATIONS ================= */

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


/* ============ KEYBOARD SHORTCUTS ============ */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        document.querySelectorAll(".window").forEach(function(windowElement) {

            windowElement.style.display = "none";

        });

    }

});
