const calendar = document.getElementById("calendar");
const today = new Date();

let selectedDate = null;
let data = JSON.parse(localStorage.getItem("drinkData")) || {};

function dateKey(date) {
    return date.toISOString().split("T")[0];
}

function buildCalendar() {
    calendar.innerHTML = "";
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const key = dateKey(date);

        const div = document.createElement("div");
        div.className = "day";
        div.textContent = d;

        if (data[key]) {
            if (data[key].units === 0) div.classList.add("green");
            else if (data[key].units <= 2) div.classList.add("orange");
            else div.classList.add("red");
        }

        div.onclick = () => selectedDate = key;
        calendar.appendChild(div);
    }

    updateTotals();
}

function saveDay() {
    if (!selectedDate) {
        alert("Selecteer eerst een dag");
        return;
    }

    const units = parseInt(document.getElementById("units").value || 0);
    data[selectedDate] = { units };

    localStorage.setItem("drinkData", JSON.stringify(data));
    buildCalendar();
}

function updateTotals() {
    document.getElementById("todayTotal").textContent =
        data[dateKey(today)]?.units || 0;

    document.getElementById("weekTotal").textContent = totalThisWeek();
    document.getElementById("monthTotal").textContent = totalThisMonth();
}

function totalThisWeek() {
    let total = 0;
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());

    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        total += data[dateKey(d)]?.units || 0;
    }
    return total;
}

function totalThisMonth() {
    let total = 0;
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");

    for (let key in data) {
        if (key.startsWith(`${y}-${m}`)) {
            total += data[key].units;
        }
    }
    return total;
}

function exportCSV() {
    let csv = "Datum,Eenheden\n";
    for (let key in data) {
        csv += `${key},${data[key].units}\n`;
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "drinkdata.csv";
    a.click();
}

buildCalendar();
