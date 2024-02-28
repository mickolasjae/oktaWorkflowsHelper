

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
try {
        var orgId = res.id;
        //var groups = res.groups;
        var url = document.documentURI;
        const parsedUrl = new URL(url);
        const hostnameParts = parsedUrl.hostname.split(".");
        let oktaSubdomain = hostnameParts.length > 2 ? hostnameParts[0] : null;
        let oktaEnvironment = hostnameParts.includes("oktapreview") ? "oktapreview" : "okta";
        const generatedUrl = `https://${oktaSubdomain}.workflows.${oktaEnvironment}.com`;



        
        async function getGroups(url) {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return await response.json()}
        var groups = await getGroups(generatedUrl+"/app/api/group?org_id="+orgId)
        // console.log(groups)
    
    
        // Collect all fetch promises in an array
        let fetchPromises = groups.map(group => {
            let groupUrl = generatedUrl + "/app/api/flo?org_id=" + orgId + "&group_id=" + group.id;
            return fetch(groupUrl).then(response => response.json());
        });

        async function getConnectors(url){
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return await response.json()
        }
        const connectors = await getConnectors(generatedUrl + "/app/api/org/channels")
        //console.log(connectors)

        // Collect all stash promises in an array
        let stashesPromises = groups.map(group => {
            let stashesUrl = generatedUrl + "/app/api/stash?orgId=" + orgId + "&groupId=" + group.id;
            return fetch(stashesUrl).then(response => response.json());
        });
        let stashes = await Promise.all(stashesPromises)
        let actualStashes = []
        var stashesIds = []
        let processedStashes = stashes.forEach(stash => {
            const newStash = stash.forEach(table => {
                actualStashes.push(table)
                stashesIds.push(table.stashId)
                
            })
        })
        console.log(actualStashes)
        console.log(stashesIds)
        let fetchStashPromises = stashesIds.map(stashId => {
            let stashUrl = generatedUrl + "/app/api/stash/" + stashId + "/row?orgId=" + orgId;
            return fetch(stashUrl).then(response => response.json());
          });

          let stashDetails = await Promise.all(fetchStashPromises)



        let flowsResults = await Promise.all(fetchPromises);

 
        

        // Assuming each fetch operation returns an array of flows, 
        // and you want to concatenate all these arrays.
        let allFlows = flowsResults.flat(); // Use .flat() if you expect nested arrays and want to flatten them

        //const allFlows = await fetchAllFlows(); // Example function to fetch all flows

        var flowIds = []
        allFlows.forEach(flow => {
            flowIds.push(flow.id)
        })
        // console.log(flowIds)
        
        // var stashesIds = []
        stashes.forEach(stash => {
            stashesIds.push(stash.stashId)
            })
            
        
     

        

        let fetchFlowPromises = flowIds.map(flowId => {
            let flowUrl = generatedUrl + "/app/api/publisher/flo/" + flowId;
            return fetch(flowUrl).then(response => response.json());
          });

        let flowDetailedResults = await Promise.all(fetchFlowPromises);
        // console.log(allFlowDetailedResults)

       

        

        
        var flows = {
            id: res.id,
            active: res.active,
            created: res.created,
            name: res.name,
            hostname: res.hostname,
            externalid: res.externalid,
            namespace: res.namespace,
            // plan: { ...res.plan },
            // features: [...res.features],
            // userAgreements: [...res.userAgreements],
            // privileges: [...res.privileges],
            groups: [...groups],
            projects: [...res.projects],
            flows: [...allFlows],
            detailedFlows: [...flowDetailedResults],
            flowConnectors: [...connectors],
            stashes: [...actualStashes],
            stashDetails: [...stashDetails]
        };

        return flows; // Return the constructed object
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // Or handle the error as appropriate
    }
}


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