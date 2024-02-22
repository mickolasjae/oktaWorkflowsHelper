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
        
        response.flows.forEach((flow) => {
            console.log(flow)
            // const row = document.createElement("tr");
            // const addCell = (text) => {
            //   const cell = document.createElement("td");
            //   cell.textContent = text;
            //   row.appendChild(cell);
            // };
            // addCell(project.id);
            // addCell(project.name);
            // addCell(project.created);
            // addCell(project.updated);
            // projectsTableBody.appendChild(row);
          });



      }
    );
  });
});
