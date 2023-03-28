
window.onload = () => {
    document.getElementById("save").onclick = () => {
        var apikey = document.getElementById("apikey").value ?? "";
        var engine = document.getElementById("engine").value ?? "";
        chrome.storage.sync.set({
            apikey,
            engine
        })
        const saveButton = document.getElementById("save");
        saveButton.innerText = "Saved!";
    }

    chrome.storage.sync.get(["apikey", "engine"], (result) => {
        document.getElementById("apikey").value = result.apikey ?? "";
        document.getElementById("engine").value = result.engine ?? "";
    })
}