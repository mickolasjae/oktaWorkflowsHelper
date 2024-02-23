document.addEventListener("DOMContentLoaded", function () {
  // Query the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      // Extract tab information
      const activeTab = tabs[0];
      const tabId = activeTab.id;

      // Sending message to service worker
      const port = chrome.runtime.connect({ name: "flowgram" });
      port.postMessage({ type: "getText"}); // Include tabId in the message

      // Listening for response from service worker
      port.onMessage.addListener(function(response) {
          // Handle response from service worker
          console.log("Received response from service worker:", response);
          populateDOM(response);
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

          // Plan Details
          const PlansTableBody = document.getElementById("PlanDetailsTable").getElementsByTagName("tbody")[0];
          PlansTableBody.innerHTML = "";
          const planRow = document.createElement("tr");
          const planIdCell = document.createElement("td");
          planIdCell.textContent = response.plan.id;
          planRow.appendChild(planIdCell);
          const planNameCell = document.createElement("td");
          planNameCell.textContent = response.plan.name;
          planRow.appendChild(planNameCell);
          const planDisplayNameCell = document.createElement("td");
          planDisplayNameCell.textContent = response.plan.displayname;
          planRow.appendChild(planDisplayNameCell);
          const planIntervalCell = document.createElement("td");
          planIntervalCell.textContent = response.plan.interval;
          planRow.appendChild(planIntervalCell);
          const planTierCell = document.createElement("td");
          planTierCell.textContent = response.plan.tier;
          planRow.appendChild(planTierCell);
          PlansTableBody.appendChild(planRow);

          // Features
          const FeaturesTableBody = document.getElementById("FeaturesTable").getElementsByTagName("tbody")[0];
          FeaturesTableBody.innerHTML = "";
          response.features.forEach((feature) => {
              const featureRow = document.createElement("tr");
              Object.values(feature).forEach(value => {
                  const cell = document.createElement("td");
                  cell.textContent = value;
                  featureRow.appendChild(cell);
              });
              FeaturesTableBody.appendChild(featureRow);
          });

          // User Agreements
          const UserAgreementsTableBody = document.getElementById("UserAgreementsTable").getElementsByTagName("tbody")[0];
          UserAgreementsTableBody.innerHTML = "";
          response.userAgreements.forEach((ua) => {
              const userAgreementRow = document.createElement("tr");
              Object.values(ua).forEach(value => {
                  const cell = document.createElement("td");
                  cell.textContent = value;
                  userAgreementRow.appendChild(cell);
              });
              UserAgreementsTableBody.appendChild(userAgreementRow);
          });

          // Groups
          const GroupsTableBody = document.getElementById("GroupsTable").getElementsByTagName("tbody")[0];
          GroupsTableBody.innerHTML = "";
          response.groups.forEach((group) => {
              const groupRow = document.createElement("tr");
              Object.values(group).forEach(value => {
                  const cell = document.createElement("td");
                  cell.textContent = value ?? "N/A";
                  groupRow.appendChild(cell);
              });
              GroupsTableBody.appendChild(groupRow);
          });

          // Projects
          const ProjectsTableBody = document.getElementById("ProjectsTable").getElementsByTagName("tbody")[0];
          ProjectsTableBody.innerHTML = "";
          response.projects.forEach((project) => {
              const projectRow = document.createElement("tr");
              Object.values(project).forEach(value => {
                  const cell = document.createElement("td");
                  cell.textContent = value;
                  projectRow.appendChild(cell);
              });
              ProjectsTableBody.appendChild(projectRow);
          });

          // Flows
          const FlowsTableBody = document.getElementById("FlowsTable").getElementsByTagName("tbody")[0];
          FlowsTableBody.innerHTML = "";
          response.flows.forEach((flow) => {
              const flowRow = document.createElement("tr");
              Object.values(flow).forEach(value => {
                  const cell = document.createElement("td");
                  cell.textContent = value;
                  flowRow.appendChild(cell);
              });
              FlowsTableBody.appendChild(flowRow);
          });

          // Loop through each table and create a button to toggle visibility
          const tables = [
              { id: "OrgDetailsTable", label: "Org Details" },
              { id: "PlanDetailsTable", label: "Plan Details" },
              { id: "FeaturesTable", label: "Features" },
              { id: "UserAgreementsTable", label: "User Agreements" },
              { id: "GroupsTable", label: "Groups" },
              { id: "ProjectsTable", label: "Projects" },
              { id: "FlowsTable", label: "Flows" }
          ];

          tables.forEach(function (table) {
              const button = document.createElement("button");
              button.innerText = `Show ${table.label}`;
              button.className = "collapsible-button";
              const content = document.getElementById(table.id);
              if (content) {
                  content.before(button);
                  content.style.display = "none";
                  button.addEventListener("click", function () {
                      if (content.style.display === "none") {
                          content.style.display = "";
                          button.innerText = `Hide ${table.label}`;
                      } else {
                          content.style.display = "none";
                          button.innerText = `Show ${table.label}`;
                      }
                  });
              }
          });
      }
  });
});
