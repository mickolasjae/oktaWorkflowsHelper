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
// Ensure response and detailedFlows are defined and have the expected structure
    // Function to extract 'id' values from each 'flo' object
function extractFloIds(jsonObjects) {
  const ids = jsonObjects.map(obj => obj.flo.id);
  return ids;
}
const listOfObjects = response.detailedFlows
// Extracting 'id' values
const floIds = extractFloIds(listOfObjects);


function findMethodsContainingFloIds(listOfObjects, floIds) {
  const foundMethods = [];

  // Iterate through each object in the list
  listOfObjects.forEach(obj => {
    // Iterate through each method of the current object's flo
    obj.flo.methods.forEach(method => {
      Object.keys(method.node.model.inputs.data).forEach(inputKey => {
        const input = method.node.model.inputs.data[inputKey];
        // Check if the input's value matches any of the floIds we're looking for
        if (input.value && floIds.includes(input.value.data)) {
          // If found, add the method, the flo.id of the current object, and the matching floId to the list
          foundMethods.push({
            //method: method, // The method where the floId was found
            parentFlow: obj.flo.id, // The flo.id of the current object
            helperFlow: input.value.data // The specific floId from the list that was found in the input
          });
        }
      });
    });
  });

  return foundMethods;
}

const methodsContainingFloIds = findMethodsContainingFloIds(listOfObjects, floIds);
console.log(methodsContainingFloIds);

  // Mapping of parentFlow IDs to their helper flows' IDs
  const helperFlowsMapping = methodsContainingFloIds.reduce((acc, {parentFlow, helperFlow}) => {
    if (!acc[parentFlow]) {
      acc[parentFlow] = [];
    }
    acc[parentFlow].push(helperFlow);
    return acc;
  }, {});


  const flowColumns = [];

  
  // Loop through the keys of the first flow object to generate column titles
  Object.keys(response.flows[0]).forEach(key => {
    if(key==='oAuth2Apps' || key==='display' || key==='privileges'){
      flowColumns.push({ title: key, visible: false });
    } else {
      flowColumns.push({ title: key });
    }
  });

  const api_endpoint_url = "api_endpoint_url";
  flowColumns.push({title: api_endpoint_url});
  const helper_flows = "helper_flows";
  flowColumns.push({title: helper_flows});

  // Reorder the columns to have 'name' as the first column and 'description' as the second
  const reorderedColumns = [flowColumns.find(column => column.title === 'name')];
  const descriptionColumn = flowColumns.find(column => column.title === 'description');
  if (descriptionColumn) {
    reorderedColumns.push(descriptionColumn);
  }
  flowColumns.forEach(column => {
    if (column.title !== 'name' && column.title !== 'description') {
      reorderedColumns.push(column);
    }
  });

  const allFlowData = [];
  response.flows.forEach(flow => {





    let api_endpoint_url = "";
    if (flow.channel_key === "http") {
      api_endpoint_url = `https://${response.hostname}/api/flow/${flow.alias}/invoke?clientToken=${flow.client_token}`;
    }
    // Map the flow data to match the column order
    const rowData = reorderedColumns.map(column => {
      const key = column.title;
      switch (key) {
        case 'api_endpoint_url':
          // Return a cell with a link
          return api_endpoint_url;
        case 'name':
          // Return a cell with a link for the flow name
          const flowUrl = `https://${response.hostname}/app/folders/${flow.group_id}/flows${flow.id}`;
          return `<a href="${flowUrl}" target="_blank">${flow.name}</a>`;
        case 'helper_flows':
          return helper_flows
        default:
          // For other columns, return the value as usual
          return flow[key] || "N/A";
      }
    });
    allFlowData.push(rowData);
  });

  

  // Create a button element for popping out the extension
  const popOutButton = document.createElement('button');
  popOutButton.textContent = 'Pop Out';
  popOutButton.addEventListener('click', function() {
    chrome.windows.create({
      url: chrome.runtime.getURL('popup.html'),
      type: 'popup',
      width: 800, // Adjust window width as needed
      height: 600, // Adjust window height as needed
    });
  });



  // Append the button before the DataTable
  const flowsTable = document.querySelector('#FlowsTable');
  flowsTable.parentElement.insertBefore(popOutButton, flowsTable);

  // Initialize the DataTable with flowColumns and allFlowData
  const flowTable = new DataTable('#FlowsTable', {
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, 'All']
    ],
    colReorder: true,
    columns: reorderedColumns,
    data: allFlowData,
    paging: true, // Ensure paging is enabled
  });
}
