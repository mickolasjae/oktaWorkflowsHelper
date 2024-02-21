document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "getText"}, function(response) {
            // Basic details
            document.getElementById("id").innerText = response.id;
            document.getElementById("active").innerText = response.active;
            document.getElementById("created").innerText = response.created;
            document.getElementById("name").innerText = response.name;
            document.getElementById("hostname").innerText = response.hostname;
            document.getElementById("externalid").innerText = response.externalid;
            document.getElementById("namespace").innerText = response.namespace;

            // Plan details
            document.getElementById("planDetails").innerText = `Plan Name: ${response.plan.name}, Level: ${response.plan.level}`;

            // Iteratively update other sections (features, userAgreements, privileges, groups, projects)
            // Example for Features
            let featuresDetails = 'Features:\n' + response.features.map(feature => `ID: ${feature.id}, Resource ID: ${feature.resource_id}, Code: ${feature.code}, Multiplier: ${feature.multiplier}, Resource Type: ${feature.resource.type}, Pivot Multiplier: ${feature._pivot_multiplier}`).join('\n');
            document.getElementById("featuresDetails").innerText = featuresDetails;

            // Similarly update for userAgreements, privileges, groups, projects
            // Please adjust the logic below to transform each array to a string or structured HTML as needed

            // Example: User Agreements
            let userAgreementsDetails = 'User Agreements:\n' + response.userAgreements.map(ua => `User ID: ${ua.user_id}, Key: ${ua.key}, Accepted: ${ua.accepted}`).join('\n');
            document.getElementById("userAgreementsDetails").innerText = userAgreementsDetails;

            let privilegeDetails = 'Privileges:\n' + response.privileges.map(privilege => `Resource: ${privilege.resource}, Privilege: ${privilege.privilege}`).join('\n');
            document.getElementById("privilegesDetails").innerText = privilegeDetails;

             // Adding Groups details
             let groupsDetails = 'Groups:<br>' + response.groups.map(group => `
             <strong>ID:</strong> ${group.id}, 
             <strong>Org ID:</strong> ${group.org_id}, 
             <strong>User ID:</strong> ${group.user_id}, 
             <strong>Code:</strong> ${group.code}, 
             <strong>Name:</strong> ${group.name}, 
             <strong>Description:</strong> ${group.description}, 
             <strong>Created:</strong> ${group.created}, 
             <strong>Updated:</strong> ${group.updated}, 
             <strong>Privileges:</strong> ${group.privileges.map(priv => `${priv.resource}: ${priv.privilege}`).join(', ')}
             <br>`).join('<br>');
         document.getElementById("groupsDetails").innerHTML = groupsDetails;
            

         // Adding Projects details
         let projectsDetails = 'Projects:<br>' + response.projects.map(project => `
         <strong>ID:</strong> ${project.id},
         <strong>Name:</strong> ${project.name},
         <strong>Description:</strong> ${project.description},
         <strong>Status:</strong> ${project.status},
         <strong>Created:</strong> ${project.created},
         <strong>Updated:</strong> ${project.updated},
         <strong>Owner ID:</strong> ${project.owner_id}
         <br><br>`).join('');
     document.getElementById("projectsDetails").innerHTML = projectsDetails;
        });
    });
});
