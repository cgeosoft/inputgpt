amplitude.init("ee5be71d48716bbde78fb5515e91437b", null, {
    serverZone: 'EU',
});

window.onload = () => {
    document.getElementById("save").onclick = () => {
        var apikey = document.getElementById("apikey").value ?? "";
        var engine = document.getElementById("engine").value ?? "gpt-4";
        chrome.storage.sync.set({
            apikey,
            engine
        })
        const saveButton = document.getElementById("save");
        saveButton.innerText = "Saved!";
        saveButton.style.backgroundColor = "#388E3C";
        setTimeout(() => {
            saveButton.innerText = "Save";
            saveButton.style.backgroundColor = "transparent";
        }, 2000);

        amplitude.track("saved", {
            engine,
        })
    }

    chrome.storage.sync.get(["apikey", "engine"], (result) => {
        document.getElementById("apikey").value = result.apikey ?? "";
        document.getElementById("engine").value = result.engine ?? "gpt-4";
    })
}