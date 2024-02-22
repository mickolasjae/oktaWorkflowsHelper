function extractOktaInfo(url) {
    return new Promise((resolve, reject) => {
        try {
            const parsedUrl = new URL(url)
            const hostnameParts = parsedUrl.hostname.split('.')
            let oktaSubdomain = hostnameParts.length > 2 ? hostnameParts[0] : null
            let oktaEnvironment = hostnameParts.includes('oktapreview') ? 'oktapreview' : 'okta'
            const generatedUrl = `https://${oktaSubdomain}.workflows.${oktaEnvironment}.com`
            resolve(generatedUrl) // Resolve the promise with the generated URL
        } catch (error) {
            reject(error) // Reject the promise if there's an error
        }
    })
}

// Modified processResponse to return the processed data
function processResponse(res) {
    var text = {
        id: res.id,
        active: res.active,
        created: res.created,
        name: res.name,
        hostname: res.hostname,
        externalid: res.externalid,
        namespace: res.namespace,
        plan: { ...res.plan }, // Directly copy the plan object
        features: [...res.features], // Directly copy the features array
        userAgreements: [...res.userAgreements], // Directly copy the user agreements array
        privileges: [...res.privileges], // Directly copy the privileges array
        groups: [...res.groups], // Directly copy the groups array,
        projects: [...res.projects] // Directly copy the projects array
    }
    return text // Return the processed data
}

async function fetchDataFromUrl(url) {
    const response = await fetch(url + "/app/api/org")
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()}

// Async function to orchestrate the flow
async function fetchDataAndProcess() {
    try {
        const currentURL = document.documentURI;
        const generatedUrl = await extractOktaInfo(currentURL) // Wait for the URL
        const responseData = await fetchDataFromUrl(generatedUrl) // Fetch data using the URL
        const processedData = processResponse(responseData) // Process the fetched data
        
        return processedData; // Return the processed data for further use
    } catch (error) {
        console.error('Error in fetchDataAndProcess:', error)
    }
}

// Using the async function in the main block
(async () => {
    try {
        const dataForUse = await fetchDataAndProcess(); // Corrected variable name for response        
        chrome.runtime.onMessage.addListener(
            function (message, sender, sendResponse) {
                if (message.type === "getText") { // Changed 'switch' to 'if' for simplicity
                    sendResponse(dataForUse)
                }
            }
        )
    } catch (error) {
        console.error('Error:', error)
    }
})()