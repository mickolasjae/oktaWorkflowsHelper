

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

async function processResponse(res) {
    var orgId = res.id;
    var groups = res.groups;
    var url = document.documentURI;
    const parsedUrl = new URL(url);
    const hostnameParts = parsedUrl.hostname.split(".");
    let oktaSubdomain = hostnameParts.length > 2 ? hostnameParts[0] : null;
    let oktaEnvironment = hostnameParts.includes("oktapreview") ? "oktapreview" : "okta";
    const generatedUrl = `https://${oktaSubdomain}.workflows.${oktaEnvironment}.com`;

    // Collect all fetch promises in an array
    let fetchPromises = groups.map(group => {
        let groupUrl = generatedUrl + "/app/api/flo?org_id=" + orgId + "&group_id=" + group.id;
        return fetch(groupUrl).then(response => response.json());
    });

    try {
        // Await all fetch operations
        let flowsResults = await Promise.all(fetchPromises);

        // Assuming each fetch operation returns an array of flows, 
        // and you want to concatenate all these arrays.
        let allFlows = flowsResults.flat(); // Use .flat() if you expect nested arrays and want to flatten them

        var text = {
            id: res.id,
            active: res.active,
            created: res.created,
            name: res.name,
            hostname: res.hostname,
            externalid: res.externalid,
            namespace: res.namespace,
            plan: { ...res.plan },
            features: [...res.features],
            userAgreements: [...res.userAgreements],
            privileges: [...res.privileges],
            groups: [...res.groups],
            projects: [...res.projects],
            flows: allFlows // This now includes flows from all fetch responses
        };

        return text; // Return the constructed object
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // Or handle the error as appropriate
    }
}

// // Modified processResponse to return the processed data
// function processResponse(res) {

//     var orgId = res.id;
//     var groups = res.groups;
//     var url = document.documentURI;
//     const parsedUrl = new URL(url);
//     const hostnameParts = parsedUrl.hostname.split(".");
//     let oktaSubdomain = hostnameParts.length > 2 ? hostnameParts[0] : null;
//     let oktaEnvironment = hostnameParts.includes("oktapreview") ? "oktapreview" : "okta";
//     const generatedUrl = `https://${oktaSubdomain}.workflows.${oktaEnvironment}.com`;
    
//     for (let group of groups) { // Use `for...of` for iterating over array elements
//         let groupUrl = generatedUrl + "/app/api/flo?org_id=" + orgId + "&group_id=" + group.id;
    
//         fetch(groupUrl)
//             .then(response => response.json())
//             .then(flows => {
//                 // //console.log(flows); // Assuming `flows` is the array or object you're interested in
//                 // if (Array.isArray(flows)) { // Check if flows is an array
//                 //     for (let flow of flows) { // Use `for...of` to iterate over array elements
//                 //         //console.log(flow.id);
//                 //     }
//                 // } else {
//                 //     console.log("Flows is not an array.");
//                 // }
                
//                 console.log(flows)
//                 var text = {
//                     id: res.id,
//                     active: res.active,
//                     created: res.created,
//                     name: res.name,
//                     hostname: res.hostname,
//                     externalid: res.externalid,
//                     namespace: res.namespace,
//                     plan: { ...res.plan }, // Directly copy the plan object
//                     features: [...res.features], // Directly copy the features array
//                     userAgreements: [...res.userAgreements], // Directly copy the user agreements array
//                     privileges: [...res.privileges], // Directly copy the privileges array
//                     groups: [...res.groups], // Directly copy the groups array,
//                     projects: [...res.projects], // Directly copy the projects array
//                     flows: [...flows]
//                 }
                
                
//             })
            
//             .catch(error => console.error("Error fetching data:", error));
//     }

//     // var text = {
//     //     id: res.id,
//     //     active: res.active,
//     //     created: res.created,
//     //     name: res.name,
//     //     hostname: res.hostname,
//     //     externalid: res.externalid,
//     //     namespace: res.namespace,
//     //     plan: { ...res.plan }, // Directly copy the plan object
//     //     features: [...res.features], // Directly copy the features array
//     //     userAgreements: [...res.userAgreements], // Directly copy the user agreements array
//     //     privileges: [...res.privileges], // Directly copy the privileges array
//     //     groups: [...res.groups], // Directly copy the groups array,
//     //     projects: [...res.projects] // Directly copy the projects array
//     // }
//     return text // Return the processed data
    
// }

async function fetchDataFromUrl(url) {
    const response = await fetch(url+"/app/api/org")
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
        const appApiOrg = await fetchDataAndProcess(); // Corrected variable name for response   
        // console.log(appApiOrg)     
        chrome.runtime.onMessage.addListener(
            function (message, sender, sendResponse) {
                if (message.type === "getText") { // Changed 'switch' to 'if' for simplicity
                    sendResponse(appApiOrg)
                }
            }
        )
        var port = chrome.runtime.connect({name: "flowgram"});
        port.postMessage(appApiOrg);
        
        

    } catch (error) {
        console.error('Error:', error)
    }
})()