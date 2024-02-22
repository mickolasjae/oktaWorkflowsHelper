document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "getText" },
      function (response) {
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

        // Populate Flows Table
        // Function to create a collapsible content block
function createCollapsibleContent(data) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'none'; // Start hidden
    const content = document.createElement('pre'); // Use pre for formatted text, or customize as needed
    content.textContent = JSON.stringify(data, null, 2);
    wrapper.appendChild(content);
    
    // Toggle display on click
    wrapper.addEventListener('click', () => {
      wrapper.style.display = wrapper.style.display === 'none' ? '' : 'none';
    });
    
    return wrapper;
  }
  
  // Populate Flows Table with dynamic data handling
  const flowsTableBody = document.getElementById("FlowsTable").getElementsByTagName("tbody")[0];
  flowsTableBody.innerHTML = ""; // Clear existing rows
  
  response.flows.forEach((flow) => {
    const row = document.createElement("tr");
    
    // Function to add cell to the row
    const addCell = (content) => {
      const cell = document.createElement("td");
      if (typeof content === 'object') { // If content is an object, make it collapsible
        const collapsibleContent = createCollapsibleContent(content);
        cell.appendChild(collapsibleContent);
        cell.addEventListener('click', () => collapsibleContent.style.display = '');
      } else {
        cell.textContent = content;
      }
      row.appendChild(cell);
    };
    
    // Add cells for simple keys
    addCell(flow.id);
    addCell(flow.org_id);
    addCell(flow.group_id);
    addCell(flow.user_id);
    addCell(flow.name);
    addCell(flow.uuid);
    addCell(flow.description);
    addCell(flow.client_token);
    
    // Handle complex keys
    // For display key
    if (flow.display) {
      addCell({preview: flow.display.preview.map(p => ({module: p.module, name: p.name, kernel: p.kernel})), eventConnectorName: flow.display.eventConnectorName, isCallable: flow.display.isCallable});
    } else {
      addCell('None');
    }
    
    // For oAuth2Apps
    if (flow.oAuth2Apps && flow.oAuth2Apps.length > 0) {
      addCell(flow.oAuth2Apps);
    } else {
      addCell('None');
    }
    
    // For privileges
    if (flow.privileges && flow.privileges.length > 0) {
      addCell(flow.privileges.map(p => ({resource: p.resource, privilege: p.privilege})));
    } else {
      addCell('None');
    }
    
    flowsTableBody.appendChild(row);
  });

        const tables = [
          { id: "OrgDetailsTable", label: "Org Details" },
          { id: "PlanDetailsTable", label: "Plan Details" },
          { id: "FeaturesTable", label: "Features" },
          { id: "UserAgreementsTable", label: "User Agreements" },
          { id: "GroupsTable", label: "Groups" },
          { id: "ProjectsTable", label: "Projects" },
          { id: "FlowsTable", label: "Flows"}
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
      }
    );
  });
});
