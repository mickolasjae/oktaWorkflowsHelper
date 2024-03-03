function getLocalStorageKeyValue(key, callback) {
  chrome.storage.local.get([key], function(result) {
    callback(result[key]);
  });
}


document.addEventListener("DOMContentLoaded", function () {
  getLocalStorageKeyValue("workflowsdata", function(data) {
    
    if (data) {
      console.log("Retrieved workflowsdata:", data);
      
      
      populateDOM(data); 
    } else {
      console.log("No workflowsdata found");
    }
  });
});
function populateDOM(response) {
  // Create a button element for popping out the extension
  const popOutButton = document.createElement('button');
  popOutButton.className = 'dt-button buttons-html5 dt-button-custom';
  popOutButton.textContent = 'Pop Out';
  popOutButton.addEventListener('click', function() {
    chrome.windows.create({
      url: chrome.runtime.getURL('popup.html'),
      type: 'popup',
      width: 1920, // Adjust window width as needed
      height: 1080, // Adjust window height as needed
    });
  });
  // Append the button before the DataTable
  const newFlowsTableid = document.querySelector('#NewFlowsTable');
  newFlowsTableid.parentElement.insertBefore(popOutButton, newFlowsTableid);
//Begin flows table
function processJsonObjects(jsonObjects, hostname) {
  return jsonObjects.map(obj => {
    // Existing processing logic remains unchanged
    const displayPreview = obj.display.preview.map(p => `${p.module} - ${p.name}`).join(", ");
    const displayStr = `Preview: ${displayPreview}, EventConnectorName: ${obj.display.eventConnecterName}, IsCallable: ${obj.display.isCallable}`;
    const oauthAppsCount = `${obj.oAuth2Apps.length}`;
    const privilegesStr = obj.privileges.map(p => `${p.resource} - ${p.privilege}`).join(", ");
    // Check if channel_key is 'http' and construct api_endpoint_url accordingly
    let apiEndpointUrl = null;
    if (obj.channel_key === 'http') {
      apiEndpointUrl = `https://${hostname}/api/flow/${obj.alias}/invoke?clientToken=${obj.client_token}`;
    }
    else {
      apiEndpointUrl = "n/a"
    }
    // Constructing the URL for the href
    const flowUrl = `https://${response.hostname}/app/folders/${obj.group_id}/flows/${obj.id}`; // Adjust the URL path as needed
    // Embedding the URL in an HTML anchor tag and appending to the name
    const nameWithHref = `<a href="${flowUrl}" target="_blank">${obj.name}</a>`;
    // Return the new object with all the combined processed values including the new api_endpoint_url key
    return {
      ...obj, // Spread the original properties of obj
      name: nameWithHref, // Update the name with the href
      display: displayStr,
      oAuth2AppsCount: oauthAppsCount,
      privileges: privilegesStr,
      api_endpoint_url: apiEndpointUrl,
      download_flow: ""
    };
  });
}
const hostname = response.hostname; // The actual hostname should be used here
const processedJson = processJsonObjects(response.flows, hostname);
  flowColumns = []
  // Loop through the keys of the first flow object to generate column titles
  Object.keys(processedJson[0]).forEach(key => {
    if(key==='oAuth2Apps' || key==='display' || key==='privileges' || key==='blob_hash' || key==='execution_count'
    || key==='last_run_success' || key==='last_run_fail'){
      flowColumns.push({ title: key, visible: false });
    } else {
      flowColumns.push({ title: key });
    }
  });
  const flowRows= processedJson.map(obj => Object.values(obj));
function extractFloIds(jsonObjects) {
  const ids = jsonObjects.map(obj => obj.flo.id);
  return ids;
}


const listOfObjects = response.detailedFlows
const floIds = extractFloIds(listOfObjects);
function findMethodsContainingFloIds(listOfObjects, floIds) {
  const foundMethods = [];
  listOfObjects.forEach(obj => {
    obj.flo.methods.forEach(method => {
      Object.keys(method.node.model.inputs.data).forEach(inputKey => {
        const input = method.node.model.inputs.data[inputKey];
        if (input.value && floIds.includes(input.value.data)) {
          foundMethods.push({
            parentId: obj.flo.id, // The flo.id of the current object
            helperId: input.value.data // The specific floId from the list that was found in the input
          });}});});});
  return foundMethods;
  
}
// function findStashesInFlows(listOfObjects) {
//   const stashesFound = [];

//   listOfObjects.forEach(obj => {
//     if (obj.flo && obj.flo.methods) {
//       obj.flo.methods.forEach(method => {
//         Object.keys(method.node.model.inputs.data).forEach(inputKey => {
//           const input = method.node.model.inputs.data[inputKey];
//           // Check if the inputKey is 'stash' and input.value.data exists
//           if (inputKey === "stash") {
//             stashesFound.push({
              
//               stashData: input.value.data // The specific data of the stash
              
//             });
//           }
//         });
//       });
//     }
//   });

//   return stashesFound;
// }
// const stashes = findStashesInFlows(listOfObjects, floIds)
// console.log(stashes)

const connectedFlows = findMethodsContainingFloIds(listOfObjects, floIds);
// Initialize an empty array to hold the data for DataTable
let dataTableRows = [];
// Loop through each connectedFlow to populate the dataTableRows
connectedFlows.forEach(connectedFlow => {
  // Find parent flow details
  let parentFlow = response.flows.find(flow => flow.id === connectedFlow.parentId);
  let parentFlowName = parentFlow ? parentFlow.name : 'Unknown Parent Flow';
  // Find helper flow details
  let helperFlow = response.flows.find(flow => flow.id === connectedFlow.helperId);
  let helperFlowName = helperFlow ? helperFlow.name : 'Unknown Helper Flow';
  // Create a separate row entry for each helper
  dataTableRows.push({
    parentId: connectedFlow.parentId,
    parentName: parentFlowName,
    helperId: connectedFlow.helperId,
    helperName: helperFlowName
  });
});
// console.log(dataTableRows)
dataTableRows.sort()
function mergeArrays(responseFlows, parentHelperFlowCorrelation) {
  // First, transform parentHelperFlowCorrelation into a structure that groups by parentId
  const helpersByParentId = parentHelperFlowCorrelation.reduce((acc, curr) => {
    const { parentId, helperId } = curr;
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(helperId);
    return acc;
  }, {});

  return responseFlows.map(flow => {
    const helperIds = helpersByParentId[flow.id] || [];
    const helperFlows = helperIds.map(id => responseFlows.find(helper => helper.id === id)).filter(Boolean);

    // Concatenate helper flow names, IDs, and group IDs
    const helperFlowNames = helperFlows.map(helper => helper.name || "n/a").join(", ");
    const helperFlowIds = helperFlows.map(helper => helper.id || "n/a").join(", ");
    const helperGroupIds = helperFlows.map(helper => helper.group_id || "n/a").join(", ");

    return {
      ...flow, // Include all original flow properties
      helperFlowName: helperFlowNames || "n/a",
      helperFlowId: helperFlowIds || "n/a",
      helperGroupId: helperGroupIds || "n/a"
    };
  });
}
// Example usage:
const mergedArrays = mergeArrays(processedJson, dataTableRows);
mergedArrays.forEach(merged => {
  // console.log(merged)
})





newFlowColomns=[]
Object.keys(mergedArrays[0]).forEach(key => {
    newFlowColomns.push({ title: key });
  })

// console.log(newFlowColomns)
const newFlowRows= mergedArrays.map(obj => Object.values(obj));
// console.log(newFlowRows)



const newFlowTable = new DataTable('#NewflowsTable', 
  {
    columns: newFlowColomns,
    data: newFlowRows,
    columnDefs: [
        {
            data: null,
            defaultContent: '<button>Download Flow</button>',
            targets: -4
        }
    ],
    paging: true, // Ensure paging is enabled
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, 'All']
    ],
    layout: {
    top2End: {buttons: ['copy', 'csv']},
    topStart: 'search',
    topEnd: 'pageLength'
  },
  stateSave: true,
  fixedHeader: true,
  colReorder: true,
    },
)
newFlowTable.on('click', 'button', function (e) {
    e.preventDefault(); // Prevent the default button action

    let tr = $(this).closest('tr'); // Find the closest table row to the clicked button
    let data = newFlowTable.row(tr).data(); // Use the DataTable API to get the data for the row

    // Assuming the "name" column is the one you're interested in and it contains HTML
    let htmlContent = data[19];
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlContent, 'text/html');
    let flowName = doc.body.textContent || ""; // Extract just the text content, stripping away any HTML tags
    console.log(flowName)

    // Construct the download URL using the flow ID (adjust the index if the flow ID is at a different position)
    const url = `https://${response.hostname}/app/api/publisher/flopack/export?orgId=${response.id}&floId=${data[13]}`;

    // Initiate the download, naming the file based on the flow's name extracted from the HTML content
    chrome.downloads.download({
        filename: `${flowName}.flow`,
        url: url
    });
});

}

