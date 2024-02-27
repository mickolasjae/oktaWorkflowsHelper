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
  popOutButton.className = 'dt-button buttons-html5'
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
  const flowsTable = document.querySelector('#FlowsTable');
  flowsTable.parentElement.insertBefore(popOutButton, flowsTable);


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
      api_endpoint_url: apiEndpointUrl
    };
  });
}

const hostname = response.hostname; // The actual hostname should be used here
const processedJson = processJsonObjects(response.flows, hostname);

  flowColumns = []
  // Loop through the keys of the first flow object to generate column titles
  Object.keys(processedJson[0]).forEach(key => {
    if(key==='oAuth2Apps' || key==='display' || key==='privileges'){
      flowColumns.push({ title: key, visible: false });
    } else {
      flowColumns.push({ title: key });
    }
  });

  const flowRows= processedJson.map(obj => Object.values(obj));
console.log(flowColumns)
console.log(flowRows);
  // Initialize the DataTable with flowColumns and allFlowData
  const flowTable = new DataTable('#FlowsTable', {
    columns: flowColumns,
    data: flowRows,
    paging: true, // Ensure paging is enabled
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, 'All']
    ],
    // layout: {
      // topStart: {
      //     buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
  //     // }
  // },
  layout: {
    // top2Start: 'pageLength',
    top2End: {buttons: ['copy', 'csv', 'excel', 'pdf', 'print']},
    topStart: 'search',
    topEnd: 'pageLength',
    // bottomStart: 'info',
    // bottomEnd: 'search',
    // bottom2Start: 'info',
    // bottom2End: 'paging'
  },
  stateSave: true
    

    
  });
  
 
document.querySelectorAll('a.toggle-vis').forEach((el) => {
    el.addEventListener('click', function (e) {
        e.preventDefault();
 
        let columnIdx = e.target.getAttribute('data-column');
        let column = flowTable.column(columnIdx);
 
        // Toggle the visibility
        column.visible(!column.visible());
    });
});

//////end Flows Table







  //Function to extract 'id' values from each 'flo' object
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
            parentId: obj.flo.id, // The flo.id of the current object
            helperId: input.value.data // The specific floId from the list that was found in the input
          });
        }
      });
    });
  });

  return foundMethods;
}

const connectedFlows = findMethodsContainingFloIds(listOfObjects, floIds);
// console.log(connectedFlows);


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
dataTableRows.sort()
console.log(dataTableRows)

// Initialize or update the DataTable with the new rows
$('#ConnectedFlowsTable').DataTable({
  data: dataTableRows,
  columns: [
      { data: 'parentId', title: 'Parent ID' },
      { data: 'parentName', title: 'Parent Name' },
      { data: 'helperId', title: 'Helper ID' },
      { data: 'helperName', title: 'Helper Name' }
  ],
  stateSave: true
});

// // Create DataTable

 
// // Create chart
// const chart = Highcharts.chart('demo-output', {
//     chart: {
//         type: 'pie',
//         styledMode: true
//     },
//     title: {
//         text: 'Staff Count Per Position'
//     },
//     series: [
//         {
//             data: chartData(flowTable)
//         }
//     ]
// });
// // On each draw, update the data in the chart
// flowTable.on('draw', function () {
//   chart.series[0].setData(chartData(table));
// });










let connectorColumns = []

// console.log(connectorColumns)
//console.log(response.flowConnectors)

  connectorColumns.push({title:"channel_version_f2_id"})
  connectorColumns.push({title:"channel_version_id"})
  connectorColumns.push({title:"id"})
  connectorColumns.push({title:"name"})
  connectorColumns.push({title:"premium"})
  connectorColumns.push({title:"restricted"})
  connectorColumns.push({title:"apidocs"})
  connectorColumns.push({title:"banner"})
  connectorColumns.push({title:"category"})
  connectorColumns.push({title:"color"})
  connectorColumns.push({title:"connectordocs"})
  connectorColumns.push({title:"creator"})
  connectorColumns.push({title:"displayname"})
  connectorColumns.push({title:"enabled"})
  connectorColumns.push({title:"icon"})
  connectorColumns.push({title:"kind"})
  connectorColumns.push({title:"name"})
  connectorColumns.push({title:"realtimeavailable"})
  connectorColumns.push({title:"restricted"})
  connectorColumns.push({title:"recurrence"})
  connectorColumns.push({title:"supportemail"})

console.log(connectorColumns)

let connectorRows = [];

if (response.flowConnectors && response.flowConnectors.length > 0) {
    response.flowConnectors.forEach(connector => {
        connectorRows.push([
            connector.channel_version_f2_id || "n/a", 
            connector.channel_version_id || "n/a",
            connector.id || "n/a",
            connector.name || "n/a",
            connector.premium || "n/a",
            connector.restricted || "n/a",
            connector.display?.apidocs || "n/a",
            connector.display?.banner || "n/a",
            connector.display?.category || "n/a",
            connector.display?.color || "n/a",
            connector.display?.connectordocs || "n/a",
            connector.display?.creator || "n/a",
            connector.display?.displayname || "n/a",
            connector.display?.enabled || "n/a",
            connector.display?.icon || "n/a",
            connector.display?.kind || "n/a",
            connector.display?.name || "n/a",
            connector.display?.realtimeavailable || "n/a",
            connector.display?.restricted || "n/a",
            connector.display?.recurrence || "n/a",
            connector.display?.supportemail || "n/a"
        ]);
    });
} else {
    console.log("response.flowConnectors is empty or undefined");
}

console.log(connectorRows);

const connectorTable = new DataTable('#ConnectorsTable', {
  data: connectorRows,
  columns: connectorColumns,
  stateSave: true
})
  






//   const flowColumns = [];

  
//   // Loop through the keys of the first flow object to generate column titles
//   Object.keys(response.flows[0]).forEach(key => {
//     if(key==='oAuth2Apps' || key==='display' || key==='privileges'){
//       flowColumns.push({ title: key, visible: false });
//     } else {
//       flowColumns.push({ title: key });
//     }
//   });

//   const api_endpoint_url = "api_endpoint_url";
//   flowColumns.push({title: api_endpoint_url});
//   const helper_id = "helper_id"
//   const helper_name = "helper_name"
//   flowColumns.push({title: helper_id});
//   flowColumns.push({title: helper_name});


//   // Reorder the columns to have 'name' as the first column and 'description' as the second
//   const reorderedColumns = [flowColumns.find(column => column.title === 'name')];
//   const descriptionColumn = flowColumns.find(column => column.title === 'description');
//   if (descriptionColumn) {
//     reorderedColumns.push(descriptionColumn);
//   }
//   flowColumns.forEach(column => {
//     if (column.title !== 'name' && column.title !== 'description') {
//       reorderedColumns.push(column);
//     }
//   });

//   const allFlowData = [];
//   response.flows.forEach(flow => {





//     let api_endpoint_url = "";
//     if (flow.channel_key === "http") {
//       api_endpoint_url = `https://${response.hostname}/api/flow/${flow.alias}/invoke?clientToken=${flow.client_token}`;
//     }
//     // Map the flow data to match the column order
//     const rowData = reorderedColumns.map(column => {
//       const key = column.title;
//       switch (key) {
//         case 'api_endpoint_url':
//           // Return a cell with a link
//           return api_endpoint_url;
//         case 'name':
//           // Return a cell with a link for the flow name
//           const flowUrl = `https://${response.hostname}/app/folders/${flow.group_id}/flows/${flow.id}`;
//           return `<a href="${flowUrl}" target="_blank">${flow.name}</a>`;
//         default:
//           // For other columns, return the value as usual
//           return flow[key] || "N/A";
//       }
//     });
//     allFlowData.push(rowData);
//   });

  

//   // Create a button element for popping out the extension
//   const popOutButton = document.createElement('button');
//   popOutButton.textContent = 'Pop Out';
//   popOutButton.addEventListener('click', function() {
//     chrome.windows.create({
//       url: chrome.runtime.getURL('popup.html'),
//       type: 'popup',
//       width: 800, // Adjust window width as needed
//       height: 600, // Adjust window height as needed
//     });
//   });



//   // Append the button before the DataTable
//   const flowsTable = document.querySelector('#FlowsTable');
//   flowsTable.parentElement.insertBefore(popOutButton, flowsTable);

  // // Initialize the DataTable with flowColumns and allFlowData
  // const flowTable = new DataTable('#FlowsTable', {
    
  //   lengthMenu: [
  //     [10, 25, 50, -1],
  //     [10, 25, 50, 'All']
  //   ],
  //   layout: {
  //     topStart: {
  //         buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
  //     }
  // },

  //   colReorder: true,
  //   columns: reorderedColumns,
  //   data: allFlowData,
  //   paging: true, // Ensure paging is enabled
  // });
}
