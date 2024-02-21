const elements = document.querySelectorAll('MuiTypography-root MuiTypography-body1 resource-name css-1jytso2');

elements.forEach(element => {
  if (element.textContent.includes('camping')) {
    element.textContent = element.textContent.replace(/camping/g, 'foobar');
  }
});

function processResponse(res) {
    // Processing users
    if (Array.isArray(res.users)) {
        console.log("Total users: " + res.users.length);
        res.users.forEach(user => {
            console.log(`id: ${user.id}, email: ${user.email}, First Name: ${user.first_name}, Last Name: ${user.last_name}`);
        });
    } else {
        console.log("No users array found in response.");
    }

    // Processing plan
    if (res.plan) {
        console.log(`Plan ID: ${res.plan.id}`);
        console.log(`Plan Name: ${res.plan.name}`);
        console.log(`Display Name: ${res.plan.displayname}`);
        console.log(`Interval: ${res.plan.interval}`);
        console.log(`Price: ${res.plan.price}`);
        console.log(`Level: ${res.plan.level}`);

        // Assuming plan_levels is an array you'd like to log
        if (Array.isArray(res.plan.plan_levels)) {
            console.log("Plan Levels:");
            res.plan.plan_levels.forEach((level, index) => {
                console.log(`  ${index + 1}. ${level}`);
            });
        }
    } else {
        console.log("No plan data found in response.");
    }

    // Processing features
    if (Array.isArray(res.features)) {
        console.log("Features:");
        res.features.forEach(feature => {
            console.log(`ID: ${feature.id}, Code: ${feature.code}, Multiplier: ${feature.multiplier}, Type: ${feature.resource.type}`);
        });
    } else {
        console.log("No features array found in response.");
    }

    // Processing userAgreements
    if (Array.isArray(res.userAgreements)) {
        console.log("User Agreements:");
        res.userAgreements.forEach(agreement => {
            console.log(`User ID: ${agreement.user_id}, Key: ${agreement.key}, Accepted: ${agreement.accepted}`);
        });
    } else {
        console.log("No user agreements array found in response.");
    }

    // Processing privileges
    if (Array.isArray(res.privileges)) {
        console.log("Privileges:");
        res.privileges.forEach(privilege => {
            console.log(`Resource: ${privilege.resource}, Privilege: ${privilege.privilege}`);
        });
    } else {
        console.log("No privileges array found in response.");
    }

    // Processing groups
    if (Array.isArray(res.groups)) {
        console.log("Groups:");
        res.groups.forEach(group => {
            console.log(`ID: ${group.id}, Name: ${group.name}, Description: ${group.description}`);
            // Check if there's a privileges array within each group
            if (Array.isArray(group.privileges)) {
                console.log("  Privileges:");
                group.privileges.forEach(privilege => {
                    console.log(`    Resource: ${privilege.resource}, Privilege: ${privilege.privilege}`);
                });
            }
        });
    } else {
        console.log("No groups array found in response.");
    }

    // Processing projects
    if (Array.isArray(res.projects)) {
        console.log("Projects:");
        res.projects.forEach(project => {
            console.log(`ID: ${project.id}, Name: ${project.name}, Description: ${project.description}`);
            console.log(`  Display Name: ${project.display.name}, Color: ${project.display.color}`);
            console.log(`  Key: ${project.key}, Access Key: ${project.access_key}`);
            if (project.display.icon) {
                console.log(`  Icon: ${project.display.icon}`);
            }
            // Additional details can be logged as needed
        });
    } else {
        console.log("No projects array found in response.");
    }
}


url = document.documentURI
const parsedUrl = new URL(url);
const hostnameParts = parsedUrl.hostname.split('.');

// Extracting subdomain
let subdomain = null;
if (hostnameParts.length > 2) {
  subdomain = hostnameParts[0];
}

// Extracting environment
let environment = null;
if (hostnameParts.includes('oktapreview')) {
  environment = 'oktapreview';
} else {
  environment = 'okta';
}

const generatedUrl = `https://${subdomain}.workflows.${environment}.com/app/api/org`;

fetch(generatedUrl)
    .then(res => res.json())
    .then(res => {
        // Use the processResponse function to handle the response data
        processResponse(res);
        
        // Here's how you might prepare data to use or send elsewhere
        var text = {
            id: res.id,
            active: res.active,
            created: res.created,
            name: res.name,
            hostname: res.hostname,
            externalid: res.externalid,
            namespace: res.namespace,
            plan: { ...res.plan }, // Directly copy the plan object
            features: [...res.features], // Directly copy the features array
            userAgreements: [...res.userAgreements], // Directly copy the user agreements array
            privileges: [...res.privileges], // Directly copy the privileges array
            groups: [...res.groups], // Directly copy the groups array,
            projects: [...res.projects] // Directly copy the projects array
        };
        // Consider what you want to do with 'text' here, e.g., log it, send it in a message, or store it for later use
        chrome.runtime.onMessage.addListener(
            function (message, sender, sendResponse) {
                switch (message.type) {
                    case "getText":
                        sendResponse(text)
                        break;
                }
            }
        );

    }).catch(error => console.error('Error:', error));




