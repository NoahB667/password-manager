function savePassword() {
    let website = document.getElementById("website").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!website || !username || !password) {
        alert("All fields are required!");
        return;
    }

    let encryptedPassword = btoa(password); // Base64 encryption (not very secure)

    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];
    passwords.push({ website, username, password: encryptedPassword });
    localStorage.setItem("passwords", JSON.stringify(passwords));

    alert("Password saved successfully!");
    displayPasswords();
}

function displayPasswords() {
    let passwordList = document.getElementById("passwordList");
    passwordList.innerHTML = "";

    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];

    passwords.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${item.website} - ${item.username} - 
            <span onclick="togglePassword(${index})" style="cursor:pointer;color:blue;">Show</span>
            <button onclick="deletePassword(${index})">Delete</button>`;
        passwordList.appendChild(li);
    });
}

function togglePassword(index) {
    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];
    let password = atob(passwords[index].password); // Decode Base64
    alert("Password: " + password);
}

function deletePassword(index) {
    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];
    passwords.splice(index, 1);
    localStorage.setItem("passwords", JSON.stringify(passwords));
    displayPasswords();
}

let db;
let request = indexedDB.open("passwordManagerDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    db.createObjectStore("passwords", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
};

function savePasswordIndexedDB(website, username, password) {
    let encryptedPassword = btoa(password);

    let transaction = db.transaction(["passwords"], "readwrite");
    let store = transaction.objectStore("passwords");
    store.add({ website, username, password: encryptedPassword });

    alert("Password saved securely!");
}

function generatePassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let password = "";
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    document.getElementById("generatedPassword").value = password;
}

function generateCustomPassword() {
    let length = document.getElementById("passwordLength").value;
    let includeNumbers = document.getElementById("includeNumbers").checked;
    let includeSymbols = document.getElementById("includeSymbols").checked;

    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()-_=+";

    let password = "";
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    document.getElementById("generatedPassword").value = password;
}

document.getElementById("generatedPassword").addEventListener("click", function() {
    document.getElementById("password").value = this.value;
});