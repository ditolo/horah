let globalTime = "00:00:00";
let globalNow = "00:00:00";
let refTimes = [];

// === Conversión ===
const timeToSeconds = (h, m, s) => parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);

const secondsToHMS = (secs) => {
    secs = (secs + 24 * 3600) % (24 * 3600);
    let h = Math.floor(secs / 3600);
    let m = Math.floor((secs % 3600) / 60);
    let s = secs % 60;
    return h.toString().padStart(2, "0") + ":" +
        m.toString().padStart(2, "0") + ":" +
        s.toString().padStart(2, "0");
}

// === Hora actual ===
const updateTime = () => {
    let now = new Date();
    const formattedTime =
        now.getHours().toString().padStart(2, "0") + ":" +
        now.getMinutes().toString().padStart(2, "0") + ":" +
        now.getSeconds().toString().padStart(2, "0");
    document.getElementById('time-parent').textContent = formattedTime;
    globalNow = formattedTime;
}

// === Guardar H ===
const saveTime = () => {
    let h = document.getElementById("inputH").value || "0";
    let m = document.getElementById("inputM").value || "0";
    let s = document.getElementById("inputS").value || "0";
    globalTime =
        h.toString().padStart(2, "0") + ":" +
        m.toString().padStart(2, "0") + ":" +
        s.toString().padStart(2, "0");
    document.getElementById("lastTime").textContent = globalTime;

    // Guardar en localStorage
    localStorage.setItem("globalTime", globalTime);
}

// === Diferencia entre ahora y H ===
const diffTime = () => {
    let [h1, m1, s1] = globalNow.split(":");
    let [h2, m2, s2] = globalTime.split(":");
    let t1 = timeToSeconds(h1, m1, s1);
    let t2 = timeToSeconds(h2, m2, s2);
    let diff = Math.abs(t1 - t2);
    document.getElementById('diftime-parent').textContent = secondsToHMS(diff);
}

// === Guardar referencia X ===
const saveAdditionalTime = () => {
    let h = document.getElementById("refH").value || "0";
    let m = document.getElementById("refM").value || "0";
    let s = document.getElementById("refS").value || "0";
    let ref =
        h.toString().padStart(2, "0") + ":" +
        m.toString().padStart(2, "0") + ":" +
        s.toString().padStart(2, "0");
    refTimes.push(ref);

    // Guardar array en localStorage
    localStorage.setItem("refTimes", JSON.stringify(refTimes));
}

// === Eliminar referencia ===
const deleteRef = (index) => {
    refTimes.splice(index, 1);
    localStorage.setItem("refTimes", JSON.stringify(refTimes));
    printTimes();
}

// === Pintar tabla ===
const printTimes = () => {
    const tbody = document.getElementById("calcTableBody");
    tbody.innerHTML = "";

    let [hH, mH, sH] = globalTime.split(":");
    let Hsecs = timeToSeconds(hH, mH, sH);

    let [hn, mn, sn] = globalNow.split(":");
    let nowSecs = timeToSeconds(hn, mn, sn);

    refTimes.forEach((ref, index) => {
        let [hr, mr, sr] = ref.split(":");
        let refSecs = timeToSeconds(hr, mr, sr);

        let plusSecs = Hsecs + refSecs;
        let minusSecs = Hsecs - refSecs;

        let diffPlus = (plusSecs - nowSecs + 24 * 3600) % (24 * 3600);
        let diffMinus = (minusSecs - nowSecs + 24 * 3600) % (24 * 3600);

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${ref}</td>
            <td>${secondsToHMS(plusSecs)}</td>
            <td>${secondsToHMS(diffPlus)}</td>
            <td>${secondsToHMS(minusSecs)}</td>
            <td>${secondsToHMS(diffMinus)}</td>
            <td><button class="delete" onclick="deleteRef(${index})">❌</button></td>
        `;
        tbody.appendChild(row);
    });
}

// === Recuperar datos al cargar la página ===
window.onload = () => {
    // Recuperar H
    const savedH = localStorage.getItem("globalTime");
    if (savedH) {
        globalTime = savedH;
        document.getElementById("lastTime").textContent = globalTime;
    }

    // Recuperar referencias
    const savedRefs = localStorage.getItem("refTimes");
    if (savedRefs) {
        refTimes = JSON.parse(savedRefs);
    }

    // Pintar tabla al inicio
    printTimes();
}

// === Intervalos ===
setInterval(updateTime, 1000);
setInterval(diffTime, 1000);
setInterval(printTimes, 1000);
