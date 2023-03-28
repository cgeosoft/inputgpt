const systemTemplate = [
    `You are an browser assistant  to autocomplete forms in the page {page}.`,
    `Do not include 'As a browser assistant' in your responses.`,
].join()

function generate(prompt, params, cb) {
    const startTs = Date.now();
    const xmlHttp = new XMLHttpRequest();

    chrome.storage.sync.get(["apikey", "engine"], (result) => {

        if (!result.apikey) {
            toast("Please set your API key in the extension options", "#3949AB");
            cb();
            return
        }

        xmlHttp.open("POST", "https://api.openai.com/v1/chat/completions", true); // false for synchronous request
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.setRequestHeader("Authorization", `Bearer ${result.apikey}`);

        xmlHttp.onload = () => {
            if (xmlHttp.status === 401) {
                toast("Invalid API key", "#D32F2F");
                cb();
                return
            }

            if (xmlHttp.status !== 200) {
                console.log({
                    status: xmlHttp.status,
                    statusText: xmlHttp.statusText
                });
                toast(`Error: ${xmlHttp.statusText}`, "#D32F2F");
                cb();
                return
            }

            const response = JSON.parse(xmlHttp.responseText);
            const endTs = Date.now();

            const cost =
                response.usage.completion_tokens * 0.06 / 1000 +
                response.usage.prompt_tokens * 0.03 / 1000

            toast([
                `Model..: ${response.model}`,
                `Tokens.: ${response.usage.total_tokens}`,
                `Cost...: $${cost}`,
                `Time...: ${endTs - startTs}ms`
            ].join("<br>"));

            console.log(response);

            cb(response.choices[0].message.content);
        };

        xmlHttp.onerror = () => {
            console.log({
                status: xmlHttp.status,
                statusText: xmlHttp.statusText
            });
            toast(`Error: ${xmlHttp.statusText}`, "#D32F2F");
            cb();
        };

        let systemPrompt = systemTemplate
            .replace("{page}", window.location.host)

        if (params.short) {
            systemPrompt += `Return only one sentence.`
        }

        xmlHttp.send(JSON.stringify({
            model: result.engine || "gpt-4",
            messages: [{
                role: "system",
                content: systemPrompt
            }, {
                role: "user",
                content: prompt
            }]
        }));
    });
}

function toast(message, backgroundColor) {
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "10px";
    toast.style.right = "10px";
    toast.style.padding = "10px";
    toast.style.borderRadius = "5px";
    toast.style.border = "1px solid #444";
    toast.style.backgroundColor = backgroundColor ?? "#263238";
    toast.style.color = "white";
    toast.style.zIndex = "99"
    toast.style.fontFamily = "monospace";
    toast.style.width = "200px";
    toast.innerHTML = `<strong>InputGPT:</strong><br>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

let loader

document.addEventListener("keydown", (event) => {

    const elem = document.activeElement;

    if (
        event.key !== "Enter" ||
        !event.altKey ||
        ["INPUT", "TEXTAREA"].includes(elem.tagName) === false ||
        elem.value.startsWith("!gpt") === false
    ) {
        return
    }

    event.preventDefault();
    event.stopPropagation();

    console.log("Generating...");

    const prompt = elem.value.replace("!gpt", "").trim();
    elem.value = "loading..."

    loader = setInterval(() => {
        elem.value += "."
    }, 500);       

    elem.setAttribute("disabled", "disabled");

    generate(prompt, {
        short: elem.tagName === "INPUT",
    }, (result) => {
        clearInterval(loader);        
        elem.value = result ?? `!gpt ${prompt}`;
        elem.removeAttribute("disabled");
        elem.focus();
    });
});