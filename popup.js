document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getText" }, function (response) {
            // Basic details
            document.getElementById("id").innerText = response.id;
            document.getElementById("active").innerText = response.active;
            document.getElementById("created").innerText = response.created;
            document.getElementById("name").innerText = response.name;
            document.getElementById("hostname").innerText = response.hostname;
            document.getElementById("externalid").innerText = response.externalid;
            document.getElementById("namespace").innerText = response.namespace;

            // // Plan details
            //document.getElementById("PlanLevel").innerText = response.namespace;
            const PlansTableBody = document.getElementById('PlanDetailsTable').getElementsByTagName('tbody')[0];
            PlansTableBody.innerHTML = '';
            // Create a new row
            const row = document.createElement('tr');
            // Create a cell for each property and append it to the row
            const idCell = document.createElement('td');
            idCell.textContent = response.plan.id;
            row.appendChild(idCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = response.plan.name;
            row.appendChild(nameCell);

            const displaynameCell = document.createElement('td');
            displaynameCell.textContent = response.plan.displayname;
            row.appendChild(displaynameCell);

            const intervalCell = document.createElement('td');
            intervalCell.textContent = response.plan.interval;
            row.appendChild(intervalCell);

            const tierCell = document.createElement('td');
            tierCell.textContent = response.plan.tier;
            row.appendChild(tierCell);
            // Append the row to the table body
            PlansTableBody.appendChild(row);


            // let featuresDetails = 'Features:\n' + response.features.map(feature => `ID: ${feature.id}, Resource ID: ${feature.resource_id}, Code: ${feature.code}, Multiplier: ${feature.multiplier}, Resource Type: ${feature.resource.type}, Pivot Multiplier: ${feature._pivot_multiplier}`).join('\n');
            // document.getElementById("featuresDetails").innerText = featuresDetails;
            // Assuming response.features is available and contains your data
            const FeaturesTable = document.getElementById('FeaturesTable').getElementsByTagName('tbody')[0];

            // Clear existing rows in the table body to avoid duplicates if this function runs multiple times
            FeaturesTable.innerHTML = '';

            response.features.forEach(feature => {
                // Create a new row
                const row = document.createElement('tr');

                // Create a cell for each property and append it to the row
                const idCell = document.createElement('td');
                idCell.textContent = feature.id;
                row.appendChild(idCell);

                const resourceIdCell = document.createElement('td');
                resourceIdCell.textContent = feature.resource_id;
                row.appendChild(resourceIdCell);

                const codeCell = document.createElement('td');
                codeCell.textContent = feature.code;
                row.appendChild(codeCell);

                const multiplierCell = document.createElement('td');
                multiplierCell.textContent = feature.multiplier;
                row.appendChild(multiplierCell);

                const resourceTypeCell = document.createElement('td');
                resourceTypeCell.textContent = feature.resource.type; // Assuming 'resource' is an object with a 'type' property
                row.appendChild(resourceTypeCell);

                const pivotMultiplierCell = document.createElement('td');
                pivotMultiplierCell.textContent = feature._pivot_multiplier;
                row.appendChild(pivotMultiplierCell);

                // Append the row to the table body
                FeaturesTable.appendChild(row);
            });

            // Similarly update for userAgreements, privileges, groups, projects
            // Please adjust the logic below to transform each array to a string or structured HTML as needed

            // Example: User Agreements
            // let userAgreementsDetails = 'User Agreements:\n' + response.userAgreements.map(ua => `User ID: ${ua.user_id}, Key: ${ua.key}, Accepted: ${ua.accepted}`).join('\n');
            // document.getElementById("userAgreementsDetails").innerText = userAgreementsDetails;

            // let privilegeDetails = 'Privileges:\n' + response.privileges.map(privilege => `Resource: ${privilege.resource}, Privilege: ${privilege.privilege}`).join('\n');
            // document.getElementById("privilegesDetails").innerText = privilegeDetails;
            // Assuming response.userAgreements is available and contains your data
            const userAgreementsTableBody = document.getElementById('UserAgreementsTable').getElementsByTagName('tbody')[0];

            // Clear existing rows to avoid duplicates if this function runs multiple times
            userAgreementsTableBody.innerHTML = '';

            response.userAgreements.forEach(ua => {
                // Create a new row
                const row = document.createElement('tr');

                // Create and append a cell for the User ID
                const userIdCell = document.createElement('td');
                userIdCell.textContent = ua.user_id;
                row.appendChild(userIdCell);

                // Create and append a cell for the Key
                const keyCell = document.createElement('td');
                keyCell.textContent = ua.key;
                row.appendChild(keyCell);

                // Create and append a cell for Accepted status
                const acceptedCell = document.createElement('td');
                acceptedCell.textContent = ua.accepted;
                row.appendChild(acceptedCell);

                // Append the row to the table body
                userAgreementsTableBody.appendChild(row);
            });

            // Adding Groups details
            // Assuming response.groups is available and contains your data
            // Adjusting the Groups section in popup.js to make privileges collapsible
            const groupsTableBody = document.getElementById('GroupsTable').getElementsByTagName('tbody')[0];
            groupsTableBody.innerHTML = ''; // Clear existing rows

            response.groups.forEach(group => {
                const row = document.createElement('tr');

                // Append cells for each property except 'privileges' which needs special treatment
                ['id', 'org_id', 'user_id', 'code', 'name', 'description', 'created', 'updated'].forEach(key => {
                    const cell = document.createElement('td');
                    cell.textContent = group[key] || 'N/A'; // Handling null or undefined values
                    row.appendChild(cell);
                });

                // Special treatment for 'privileges' to make it collapsible
                const privilegesCell = document.createElement('td');
                row.appendChild(privilegesCell);

                const btn = document.createElement('button');
                btn.textContent = 'Show Privileges';
                btn.className = 'collapsible';

                const contentDiv = document.createElement('div');
                contentDiv.className = 'content';
                contentDiv.innerHTML = group.privileges.map(priv => `${priv.resource}: ${priv.privilege}`).join(', ');

                privilegesCell.appendChild(btn);
                privilegesCell.appendChild(contentDiv);

                btn.onclick = function () {
                    this.textContent = contentDiv.style.display === 'block' ? 'Show Privileges' : 'Hide Privileges';
                    contentDiv.style.display = contentDiv.style.display === 'block' ? 'none' : 'block';
                };

                groupsTableBody.appendChild(row);
            });


            // Populate Projects Table
            const projectsTableBody = document.getElementById('ProjectsTable').getElementsByTagName('tbody')[0];
            projectsTableBody.innerHTML = ''; // Clear existing rows

            response.projects.forEach(project => {
                const row = document.createElement('tr');

                // Function to create a cell and append it to the row
                const addCell = (text) => {
                    const cell = document.createElement('td');
                    cell.textContent = text;
                    row.appendChild(cell);
                };

                // Create and append cells for each project property
                addCell(project.id);
                addCell(project.name);
                addCell(project.created);
                addCell(project.updated);

                // Append the row to the table body
                projectsTableBody.appendChild(row);
            });
        });
    });
});
