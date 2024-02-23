function getLocalStorageKeyValue(key, callback) {
  chrome.storage.local.get([key], function(result) {
      callback(result[key]);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Create the open button
  const openPopupButton = document.createElement("button");
  openPopupButton.textContent = "Open Popup";
  openPopupButton.style.padding = "10px 20px";
  openPopupButton.style.fontSize = "16px";
  openPopupButton.style.borderRadius = "5px";
  openPopupButton.style.border = "none";
  openPopupButton.style.cursor = "pointer";
  openPopupButton.style.backgroundColor = "#007bff";
  openPopupButton.style.color = "white";
  openPopupButton.style.marginBottom = "20px"; // Add space below the button
  openPopupButton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"; // Modern shadow effect
  openPopupButton.onmouseover = function() {
    this.style.opacity = "0.9"; // Slight hover effect for modern feel
  };
  openPopupButton.onmouseout = function() {
    this.style.opacity = "1"; // Revert hover effect
  };

  // Add event listener to open popup.html
  openPopupButton.addEventListener("click", function() {
    window.open('popup.html', '_blank', 'width=600,height=400'); // Opens popup.html in a new popup window
  });

  // Append the button to the body or a specific container within the document
  document.body.insertBefore(openPopupButton, document.body.firstChild);

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
        // Basic details
        document.getElementById("id").innerText = response.id;
        document.getElementById("active").innerText = response.active;
        document.getElementById("created").innerText = response.created;
        document.getElementById("name").innerText = response.name;
        document.getElementById("hostname").innerText = response.hostname;
        document.getElementById("externalid").innerText = response.externalid;
        document.getElementById("namespace").innerText = response.namespace;
        const PlansTableBody = document
          .getElementById("PlanDetailsTable")
          .getElementsByTagName("tbody")[0];
        PlansTableBody.innerHTML = "";
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        idCell.textContent = response.plan.id;
        row.appendChild(idCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = response.plan.name;
        row.appendChild(nameCell);

        const displaynameCell = document.createElement("td");
        displaynameCell.textContent = response.plan.displayname;
        row.appendChild(displaynameCell);

        const intervalCell = document.createElement("td");
        intervalCell.textContent = response.plan.interval;
        row.appendChild(intervalCell);

        const tierCell = document.createElement("td");
        tierCell.textContent = response.plan.tier;
        row.appendChild(tierCell);
        // Append the row to the table body
        PlansTableBody.appendChild(row);
        const FeaturesTable = document
          .getElementById("FeaturesTable")
          .getElementsByTagName("tbody")[0];
        FeaturesTable.innerHTML = "";

        response.features.forEach((feature) => {
          const row = document.createElement("tr");
          const idCell = document.createElement("td");
          idCell.textContent = feature.id;
          row.appendChild(idCell);
          const resourceIdCell = document.createElement("td");
          resourceIdCell.textContent = feature.resource_id;
          row.appendChild(resourceIdCell);
          const codeCell = document.createElement("td");
          codeCell.textContent = feature.code;
          row.appendChild(codeCell);
          const multiplierCell = document.createElement("td");
          multiplierCell.textContent = feature.multiplier;
          row.appendChild(multiplierCell);
          const resourceTypeCell = document.createElement("td");
          resourceTypeCell.textContent = feature.resource.type; // Assuming 'resource' is an object with a 'type' property
          row.appendChild(resourceTypeCell);
          const pivotMultiplierCell = document.createElement("td");
          pivotMultiplierCell.textContent = feature._pivot_multiplier;
          row.appendChild(pivotMultiplierCell);
          FeaturesTable.appendChild(row);
        });
        const userAgreementsTableBody = document
          .getElementById("UserAgreementsTable")
          .getElementsByTagName("tbody")[0];
        userAgreementsTableBody.innerHTML = "";
        response.userAgreements.forEach((ua) => {
          const row = document.createElement("tr");
          const userIdCell = document.createElement("td");
          userIdCell.textContent = ua.user_id;
          row.appendChild(userIdCell);
          const keyCell = document.createElement("td");
          keyCell.textContent = ua.key;
          row.appendChild(keyCell);
          const acceptedCell = document.createElement("td");
          acceptedCell.textContent = ua.accepted;
          row.appendChild(acceptedCell);
          userAgreementsTableBody.appendChild(row);
        });
        const groupsTableBody = document
          .getElementById("GroupsTable")
          .getElementsByTagName("tbody")[0];
        groupsTableBody.innerHTML = ""; // Clear existing rows
        response.groups.forEach((group) => {
          const row = document.createElement("tr");
          [
            "id",
            "org_id",
            "user_id",
            "code",
            "name",
            "description",
            "created",
            "updated",
          ].forEach((key) => {
            const cell = document.createElement("td");
            cell.textContent = group[key] || "N/A"; // Handling null or undefined values
            row.appendChild(cell);
          });
          // Special treatment for 'privileges' to make it collapsible
          const privilegesCell = document.createElement("td");
          row.appendChild(privilegesCell);
          const btn = document.createElement("button");
          btn.textContent = "Show Privileges";
          btn.className = "collapsible";
          const contentDiv = document.createElement("div");
          contentDiv.className = "content";
          contentDiv.innerHTML = group.privileges
            .map((priv) => `${priv.resource}: ${priv.privilege}`)
            .join(", ");
          privilegesCell.appendChild(btn);
          privilegesCell.appendChild(contentDiv);
          btn.onclick = function () {
            this.textContent =
              contentDiv.style.display === "block"
                ? "Show Privileges"
                : "Hide Privileges";
            contentDiv.style.display =
              contentDiv.style.display === "block" ? "none" : "block";
          };
          groupsTableBody.appendChild(row);
        });
        
        // Populate Projects Table
        const projectsTableBody = document
          .getElementById("ProjectsTable")
          .getElementsByTagName("tbody")[0];
        projectsTableBody.innerHTML = ""; // Clear existing rows

        response.projects.forEach((project) => {
          const row = document.createElement("tr");
          const addCell = (text) => {
            const cell = document.createElement("td");
            cell.textContent = text;
            row.appendChild(cell);
          };
          addCell(project.id);
          addCell(project.name);
          addCell(project.created);
          addCell(project.updated);
          projectsTableBody.appendChild(row);
        });

        const flowsTableBody = document
          .getElementById("FlowsTable")
          .getElementsByTagName("tbody")[0];
        flowsTableBody.innerHTML = ""; // Clear existing rows

        response.flows.forEach((flow) => {
          const row = document.createElement("tr");

          // Function to add cell to the row
          const addCell = (content) => {
            
            const cell = document.createElement("td");
            if (typeof content === "object" && content !== null) {
              // Simplify the display of objects for demonstration. Consider implementing a detailed display method.
              cell.textContent = JSON.stringify(content);
            } else {
              cell.textContent = content ?? "N/A"; // Use 'N/A' for undefined or null values
            }
            row.appendChild(cell);
          };

          // List of keys to add cells for, directly from flow object
          const keys = [
            "id",
            "org_id",
            "group_id",
            "user_id",
            "name",
            "uuid",
            "description",
            "client_token",
            "execution_count",
            "last_run",
            "active",
            "alias",
            "security_level",
            "created",
            "updated",
            "published",
            "scheduled",
            "locked",
            "last_run_success",
            "last_run_fail",
            "blob_hash",
            "type",
            "channel_key",
            "channel_version",
            "channel_method",
            "edited",
            "rust",
            "template_name",
            "role_type",
          ];

          // Add cells for simple keys
          keys.forEach((key) => addCell(flow[key]));
        //add display column




          const flowPrivilegesCell = document.createElement("td")
          row.appendChild(flowPrivilegesCell);
          const btnP = document.createElement("button");
          btnP.textContent = "Show Privileges";
          btnP.className = "collapsible";
          const contentDiv = document.createElement("div");
          contentDiv.className = "content";
          contentDiv.innerHTML = flow.privileges
            .map((flow) => `${flow.resource}: ${flow.privilege}`)
            .join(", ");
            flowPrivilegesCell.appendChild(btnP);
            flowPrivilegesCell.appendChild(contentDiv);
            btnP.onclick = function () {
            this.textContent =
              contentDiv.style.display === "block"
                ? "Show Privileges"
                : "Hide Privileges";
            contentDiv.style.display =
              contentDiv.style.display === "block" ? "none" : "block";
          };

          flowsTableBody.appendChild(row);
        });

        const tables = [
          { id: "OrgDetailsTable", label: "Org Details" },
          { id: "PlanDetailsTable", label: "Plan Details" },
          { id: "FeaturesTable", label: "Features" },
          { id: "UserAgreementsTable", label: "User Agreements" },
          { id: "GroupsTable", label: "Groups" },
          { id: "ProjectsTable", label: "Projects" },
          { id: "FlowsTable", label: "Flows" },
        ];

        // Loop through each table and create a button to toggle visibility
        tables.forEach(function (table) {
          var button = document.createElement("button");
          button.innerText = `Show ${table.label}`;
          button.className = "collapsible-button"; // Assign a class for styling if necessary
          var content = document.getElementById(table.id); // Get the table element

          if (content) {
            content.before(button); // Insert the button right before the table
            content.style.display = "none"; // Start with the table hidden

            // Add click event listener to the button to toggle the table visibility
            button.addEventListener("click", function () {
              if (content.style.display === "none") {
                content.style.display = ""; // Show the table
                button.innerText = `Hide ${table.label}`;
              } else {
                content.style.display = "none"; // Hide the table
                button.innerText = `Show ${table.label}`;
              }
            });
          }
        });
        function sortTable(table, columnIndex, asc = true) {
          const dirModifier = asc ? 1 : -1;
          const tbody = table.tBodies[0];
          const rows = Array.from(tbody.querySelectorAll("tr"));
  
          // Sort each row
          const sortedRows = rows.sort((a, b) => {
              const aText = a.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
              const bText = b.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
  
              return aText > bText ? (1 * dirModifier) : (-1 * dirModifier);
          });
  
          // Remove all existing TRs from the table
          while (tbody.firstChild) {
              tbody.removeChild(tbody.firstChild);
          }
  
          // Re-add the newly sorted rows
          tbody.append(...sortedRows);
  
          // Remember how the column is currently sorted
          table.querySelectorAll("th").forEach(th => th.classList.remove("asc", "desc"));
          table.querySelector(`th:nth-child(${columnIndex + 1})`).classList.toggle("asc", asc);
          table.querySelector(`th:nth-child(${columnIndex + 1})`).classList.toggle("desc", !asc);
      }
  
      // Attach click event listeners to all table headers in all tables
      document.querySelectorAll("table").forEach(table => {
          let asc = true;
          table.querySelectorAll("th").forEach((headerCell, columnIndex) => {
              headerCell.addEventListener("click", () => {
                  const isAsc = headerCell.classList.contains("asc");
                  sortTable(table, columnIndex, !isAsc);
              });
          });
      });
    }

  });

