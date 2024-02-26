function getLocalStorageKeyValue(key, callback) {
  chrome.storage.local.get([key], function(result) {
      callback(result[key]);
  });
}

document.addEventListener("DOMContentLoaded", function () {



  // // Create the open button
  // const openPopupButton = document.createElement("button");
  // openPopupButton.textContent = "Open Popup";
  // openPopupButton.style.padding = "10px 20px";
  // openPopupButton.style.fontSize = "16px";
  // openPopupButton.style.borderRadius = "5px";
  // openPopupButton.style.border = "none";
  // openPopupButton.style.cursor = "pointer";
  // openPopupButton.style.backgroundColor = "#007bff";
  // openPopupButton.style.color = "white";
  // openPopupButton.style.marginBottom = "20px"; // Add space below the button
  // openPopupButton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"; // Modern shadow effect
  // openPopupButton.onmouseover = function() {
  //   this.style.opacity = "0.9"; // Slight hover effect for modern feel
  // };
  // openPopupButton.onmouseout = function() {
  //   this.style.opacity = "1"; // Revert hover effect
  // };

  // // Add event listener to open popup.html
  // openPopupButton.addEventListener("click", function() {
  //   window.open('popup.html', '_blank', 'width=600,height=400'); // Opens popup.html in a new popup window
  // });

  // // Append the button to the body or a specific container within the document
  // document.body.insertBefore(openPopupButton, document.body.firstChild);

  getLocalStorageKeyValue("workflowsdata", function(data) {
    if (data) {
        console.log("Retrieved workflowsdata:", data);
        // Now you can use 'data' to manipulate DOM or perform other tasks in your popup
        // For example, you might want to populate the DOM with this data
        populateDOM(data); // Assuming 'data' is in the expected format for populateDOM
    } else {
        console.log("No workflowsdata found");
    }
});
    

      function populateDOM(response) {
        // // Basic details
        // document.getElementById("id").innerText = response.id;
        // document.getElementById("active").innerText = response.active;
        // document.getElementById("created").innerText = response.created;
        // document.getElementById("name").innerText = response.name;
        // document.getElementById("hostname").innerText = response.hostname;
        // document.getElementById("externalid").innerText = response.externalid;
        // document.getElementById("namespace").innerText = response.namespace;
        // const PlansTableBody = document
        //   .getElementById("PlanDetailsTable")
        //   .getElementsByTagName("tbody")[0];
        // PlansTableBody.innerHTML = "";
        // const row = document.createElement("tr");
        // const idCell = document.createElement("td");
        // idCell.textContent = response.plan.id;
        // row.appendChild(idCell);

        // const nameCell = document.createElement("td");
        // nameCell.textContent = response.plan.name;
        // row.appendChild(nameCell);

        // const displaynameCell = document.createElement("td");
        // displaynameCell.textContent = response.plan.displayname;
        // row.appendChild(displaynameCell);

        // const intervalCell = document.createElement("td");
        // intervalCell.textContent = response.plan.interval;
        // row.appendChild(intervalCell);

        // const tierCell = document.createElement("td");
        // tierCell.textContent = response.plan.tier;
        // row.appendChild(tierCell);

        // // Append the row to the table body
        // PlansTableBody.appendChild(row);
        // const FeaturesTable = document
        //   .getElementById("FeaturesTable")
        //   .getElementsByTagName("tbody")[0];
        // FeaturesTable.innerHTML = "";

        // response.features.forEach((feature) => {
        //   const row = document.createElement("tr");
        //   const idCell = document.createElement("td");
        //   idCell.textContent = feature.id;
        //   row.appendChild(idCell);
        //   const resourceIdCell = document.createElement("td");
        //   resourceIdCell.textContent = feature.resource_id;
        //   row.appendChild(resourceIdCell);
        //   const codeCell = document.createElement("td");
        //   codeCell.textContent = feature.code;
        //   row.appendChild(codeCell);
        //   const multiplierCell = document.createElement("td");
        //   multiplierCell.textContent = feature.multiplier;
        //   row.appendChild(multiplierCell);
        //   const resourceTypeCell = document.createElement("td");
        //   resourceTypeCell.textContent = feature.resource.type; // Assuming 'resource' is an object with a 'type' property
        //   row.appendChild(resourceTypeCell);
        //   const pivotMultiplierCell = document.createElement("td");
        //   pivotMultiplierCell.textContent = feature._pivot_multiplier;
        //   row.appendChild(pivotMultiplierCell);
        //   FeaturesTable.appendChild(row);
        // });
        // const userAgreementsTableBody = document
        //   .getElementById("UserAgreementsTable")
        //   .getElementsByTagName("tbody")[0];
        // userAgreementsTableBody.innerHTML = "";
        // response.userAgreements.forEach((ua) => {
        //   const row = document.createElement("tr");
        //   const userIdCell = document.createElement("td");
        //   userIdCell.textContent = ua.user_id;
        //   row.appendChild(userIdCell);
        //   const keyCell = document.createElement("td");
        //   keyCell.textContent = ua.key;
        //   row.appendChild(keyCell);
        //   const acceptedCell = document.createElement("td");
        //   acceptedCell.textContent = ua.accepted;
        //   row.appendChild(acceptedCell);
        //   userAgreementsTableBody.appendChild(row);
        // });
        // const groupsTableBody = document
        //   .getElementById("GroupsTable")
        //   .getElementsByTagName("tbody")[0];
        // groupsTableBody.innerHTML = ""; // Clear existing rows
        // response.groups.forEach((group) => {
        //   const row = document.createElement("tr");
        //   [
        //     "id",
        //     "org_id",
        //     "user_id",
        //     "code",
        //     "name",
        //     "description",
        //     "created",
        //     "updated",
        //   ].forEach((key) => {
        //     const cell = document.createElement("td");
        //     cell.textContent = group[key] || "N/A"; // Handling null or undefined values
        //     row.appendChild(cell);
        //   });
        //   // Special treatment for 'privileges' to make it collapsible
        //   const privilegesCell = document.createElement("td");
        //   row.appendChild(privilegesCell);
        //   const btn = document.createElement("button");
        //   btn.textContent = "Show Privileges";
        //   btn.className = "collapsible";
        //   const contentDiv = document.createElement("div");
        //   contentDiv.className = "content";
        //   contentDiv.innerHTML = group.privileges
        //     .map((priv) => `${priv.resource}: ${priv.privilege}`)
        //     .join(", ");
        //   privilegesCell.appendChild(btn);
        //   privilegesCell.appendChild(contentDiv);
        //   btn.onclick = function () {
        //     this.textContent =
        //       contentDiv.style.display === "block"
        //         ? "Show Privileges"
        //         : "Hide Privileges";
        //     contentDiv.style.display =
        //       contentDiv.style.display === "block" ? "none" : "block";
        //   };
        //   groupsTableBody.appendChild(row);
        // });
        
        // // Populate Projects Table
        // const projectsTableBody = document
        //   .getElementById("ProjectsTable")
        //   .getElementsByTagName("tbody")[0];
        // projectsTableBody.innerHTML = ""; // Clear existing rows

        // response.projects.forEach((project) => {
        //   const row = document.createElement("tr");
        //   const addCell = (text) => {
        //     const cell = document.createElement("td");
        //     cell.textContent = text;
        //     row.appendChild(cell);
        //   };
        //   addCell(project.id);
        //   addCell(project.name);
        //   addCell(project.created);
        //   addCell(project.updated);
        //   projectsTableBody.appendChild(row);
        // });

        //Flows Table


        // const flowsTableBody = $('#FlowsTable').DataTable({
        //     // DataTable options/configuration here
        // });


        // const flowsTableBody = document
        //   .getElementById("FlowsTable")
        //   .getElementsByTagName("tbody")[0];
        
        // flowsTableBody.innerHTML = ""; // Clear existing rows

         // Function to generate table headers based on object keys
         // const flowTable = new DataTable('#FlowsTable')
          // const flowColumns = [
          //   "id",
          //   "org_id",
          //   "group_id",
          //   "user_id",
          //   "name",
          //   "uuid",
          //   "description",
          //   "client_token",
          //   "display",
          //   "execution_count",
          //   "last_run",
          //   "active",
          //   "alias",
          //   "security_level",
          //   "created",
          //   "updated",
          //   "published",
          //   "scheduled",
          //   "locked",
          //   "last_run_success",
          //   "last_run_fail",
          //   "blob_hash",
          //   "log",
          //   "type",
          //   "channel_key",
          //   "channel_version",
          //   "channel_method",
          //   "edited",
          //   "rust",
          //   "template_name",
          //   "oAuth2Apps",
          //   "privileges",
          //   "role_type"
          // ]
          
          // Object.keys(response.flows[0]).forEach(key => {
          //   flowColumns.push({title: key})
          // });


          //           response.flows.forEach(flow => {
          //   var rowNode = flowTable.rowNode
          // .add(flow)
          // })


        //   flowColumns = []
        //   // flowColumns.push({title: "api_endpoint_url"})
        //   Object.keys(response.flows[0]).forEach(key => {
        //     // if (key !== "display" && key !== "oAuth2Apps" && key !== "privileges") {
        //     //     flowColumns.push({ title: key });
        //     // }
        //     flowColumns.push({title: key})
            
        // });
        // // flowColumns.push({title: "api_endpoint_url"})

          
        

        //   flowRows = [];
        //   //Get all unique keys from response.flows and sort them alphabetically
        //   const allKeys = response.flows.reduce((keys, flow) => {
        //       Object.keys(flow).forEach(key => {
        //           // if (!keys.includes(key) && key !== "display" && key !== "oAuth2Apps" && key !== "privileges") {
        //           //     keys.push(key);
        //           // }
        //           keys.push(key)
        //       });
        //       return keys;
        //   }, []);

          
        //   response.flows.forEach(flow => {
        //       const pairValues = flow[key] || "N/A";
        //       flowRows.push(pairValues);
        //   });
          
        //   console.log(flowRows);

        const flowColumns = [];
// Loop through the keys of the first flow object to generate column titles
Object.keys(response.flows[0]).forEach(key => {
  if(key==='oAuth2Apps' || key==='display' || key==='privileges'){
    flowColumns.push({ title: key, visible: false });
  }
  else {
    flowColumns.push({ title: key });
  }
  
});
var api_endpoint_url = "api_endpoint_url"
flowColumns.push({title: api_endpoint_url})

const allFlowData = [];
response.flows.forEach(flow => {
  let api_endpoint_url = "";
  if (flow.channel_key === "http") {
    api_endpoint_url = `https://${response.hostname}/api/flow/${flow.alias}/invoke?clientToken=${flow.client_token}`;
  }
  // Map the flow data to match the column order
  const rowData = flowColumns.map(column => {
    const key = column.title;
    switch (key) {
      case 'api_endpoint_url':
        // Return a cell with a link
        return api_endpoint_url
      case 'name':
        // Return a cell with a link for the flow name
        var flowUrl = "https://" + response.hostname + "/app/folders/" + flow.group_id + "/flows" + flow.id;
        var flowName = flow.name;
        return `<a href="${flowUrl}" target="_blank">${flowName}</a>`;
      default:
        // For other columns, return the value as usual
        return flow[key] || "N/A";
    }
  });
  allFlowData.push(rowData);
});

// Initialize the DataTable with flowColumns and allFlowData
const flowTable = new DataTable('#FlowsTable', {
  lengthMenu: [
    [10, 25, 50, -1],
    [10, 25, 50, 'All']
],
  
  columns: flowColumns,
  data: allFlowData
});
          // const allNew = flowColumns.forEach(flow => {
            
          // })



          

          
        //   flowTable.DataTable({
        //     columns: flowColumns // Pass the dynamically generated columns array
        // });

          



        
          



      //   const dataSet = [
      //     ['Tiger Nixon', 'System Architect', 'Edinburgh', '5421', '2011/04/25', '$320,800'],
      //     ['Garrett Winters', 'Accountant', 'Tokyo', '8422', '2011/07/25', '$170,750'],
      //     ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '1562', '2009/01/12', '$86,000'],
      //     ['Cedric Kelly', 'Senior Javascript Developer', 'Edinburgh', '6224', '2012/03/29', '$433,060'],
      //     ['Airi Satou', 'Accountant', 'Tokyo', '5407', '2008/11/28', '$162,700'],
      // ];
      
       

       
      // new DataTable('#FlowsTable', {
      //     columns: [
      //         { title: 'Name' },
      //         { title: 'Position' },
      //         { title: 'Office' },
      //         { title: 'Extn.' },
      //         { title: 'Start date' },
      //         { title: 'Salary' }
      //     ],
      //     data: dataSet
      // });


  //       response.flows.forEach((flow) => {
  //         // console.log(flow.id)
  //         const row = document.createElement("tr")
  //         const addCell = (text) => {
  //           const cell = document.createElement("td");
  //           cell.textContent = text || "N/A";
  //           row.appendChild(cell);
  //         }
  //   // Function to add a cell with a link
  //   const addCellWithLink = (text, url) => {
  //     const cell = document.createElement("td");
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.textContent = text;
  //     link.target = "_blank"; // Open link in a new tab
  //     cell.appendChild(link);
  //     row.appendChild(cell);
  // }

  // // Add a cell with a link to the flow
  // addCellWithLink(flow.name, `https://${response.hostname}/app/folders/${flow.group_id}/flows/${flow.id}`);


  //         //addCellWithLink(flow.name, "https://" + hostname + "/app/folders/" + flow.group_id + "/flows" + flow.id )
  //         addCell(flow.id)
  //         addCell(flow.org_id)
  //         addCell(flow.group_id)
  //         addCell(flow.user_id)
  //         addCell(flow.uuid)
  //         addCell(flow.description)
  //         addCell(flow.client_token)
  //         addCell(flow.execution_count)
  //         addCell(flow.last_run)
  //         addCell(flow.active)
  //         addCell(flow.alias)
  //         addCell(flow.security_level)
  //         addCell(flow.created)
  //         addCell(flow.updated)
  //         addCell(flow.published)
  //         addCell(flow.scheduled)
  //         addCell(flow.locked)
  //         addCell(flow.last_run_success)
  //         addCell(flow.last_run_fail)
  //         addCell(flow.blob_hash)
  //         addCell(flow.type)
  //         addCell(flow.channel_key)
  //         addCell(flow.channel_version)
  //         addCell(flow.channel_method)
  //         addCell(flow.edited)
  //         addCell(flow.rust)
  //         addCell(flow.template_name)
  //         addCell(flow.role_type)
  //         if (flow.channel_key === "http") {
  //           addCell("https://" + response.hostname + "/api/flow/" + flow.alias + "/invoke?clientToken=" + flow.client_token);
  //         }
  //         else{
  //           addCell("n/a")
  //         }
         
        //   //Priviliges Cell
        //   const flowPrivilegesCell = document.createElement("td")
        //   row.appendChild(flowPrivilegesCell);
        //   const btnP = document.createElement("button");
        //   btnP.textContent = "Show Privileges";
        //   btnP.className = "collapsible";
        //   const contentDiv = document.createElement("div");
        //   contentDiv.className = "content";
        //   contentDiv.innerHTML = flow.privileges
        //     .map((flow) => `${flow.resource}: ${flow.privilege}`)
        //     .join(", ");
        //     flowPrivilegesCell.appendChild(btnP);
        //     flowPrivilegesCell.appendChild(contentDiv);
        //     btnP.onclick = function () {
        //     this.textContent =
        //       contentDiv.style.display === "block"
        //         ? "Show Privileges"
        //         : "Hide Privileges";
        //     contentDiv.style.display =
        //       contentDiv.style.display === "block" ? "none" : "block";
        //   };
        //   flowsTableBody.appendChild(row)
        // });


        
    //     const tables = [
    //       { id: "OrgDetailsTable", label: "Org Details" },
    //       { id: "PlanDetailsTable", label: "Plan Details" },
    //       { id: "FeaturesTable", label: "Features" },
    //       { id: "UserAgreementsTable", label: "User Agreements" },
    //       { id: "GroupsTable", label: "Groups" },
    //       { id: "ProjectsTable", label: "Projects" },
    //       { id: "FlowsTable", label: "Flows" },
    //     ];

    //     // Loop through each table and create a button to toggle visibility
    //     tables.forEach(function (table) {
    //       var button = document.createElement("button");
    //       button.innerText = `Show ${table.label}`;
    //       button.className = "collapsible-button"; // Assign a class for styling if necessary
    //       var content = document.getElementById(table.id); // Get the table element

    //       if (content) {
    //         content.before(button); // Insert the button right before the table
    //         content.style.display = "none"; // Start with the table hidden

    //         // Add click event listener to the button to toggle the table visibility
    //         button.addEventListener("click", function () {
    //           if (content.style.display === "none") {
    //             content.style.display = ""; // Show the table
    //             button.innerText = `Hide ${table.label}`;
    //           } else {
    //             content.style.display = "none"; // Hide the table
    //             button.innerText = `Show ${table.label}`;
    //           }
    //         });
    //       }
    //     });
    //     function sortTable(table, columnIndex, asc = true) {
    //       const dirModifier = asc ? 1 : -1;
    //       const tbody = table.tBodies[0];
    //       const rows = Array.from(tbody.querySelectorAll("tr"));
  
    //       // Sort each row
    //       const sortedRows = rows.sort((a, b) => {
    //           const aText = a.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
    //           const bText = b.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
  
    //           return aText > bText ? (1 * dirModifier) : (-1 * dirModifier);
    //       });
  
    //       // Remove all existing TRs from the table
    //       while (tbody.firstChild) {
    //           tbody.removeChild(tbody.firstChild);
    //       }
  
    //       // Re-add the newly sorted rows
    //       tbody.append(...sortedRows);
  
    //       // Remember how the column is currently sorted
    //       table.querySelectorAll("th").forEach(th => th.classList.remove("asc", "desc"));
    //       table.querySelector(`th:nth-child(${columnIndex + 1})`).classList.toggle("asc", asc);
    //       table.querySelector(`th:nth-child(${columnIndex + 1})`).classList.toggle("desc", !asc);
    //   }
  
    //   // Attach click event listeners to all table headers in all tables
    //   document.querySelectorAll("table").forEach(table => {
    //       let asc = true;
    //       table.querySelectorAll("th").forEach((headerCell, columnIndex) => {
    //           headerCell.addEventListener("click", () => {
    //               const isAsc = headerCell.classList.contains("asc");
    //               sortTable(table, columnIndex, !isAsc);
    //           });
    //       });
    //   });
    }

  });

