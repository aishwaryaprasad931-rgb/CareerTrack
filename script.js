
const form = document.getElementById("applicationForm");
const applicationList = document.getElementById("applicationList");

let applications = JSON.parse(
    localStorage.getItem("careerApplications") || "[]"
);

// Save applications
function saveData() {
    localStorage.setItem(
        "careerApplications",
        JSON.stringify(applications)
    );
}

// Add or update application
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const editId = document.getElementById("editId").value;

    const application = {
        id: editId || crypto.randomUUID(),
        company: document.getElementById("company").value.trim(),
        role: document.getElementById("role").value.trim(),
        date: document.getElementById("date").value,
        status: document.getElementById("status").value,
        link: document.getElementById("link").value.trim()
    };

    if (editId) {
        applications = applications.map(app =>
            app.id === editId ? application : app
        );
    } else {
        applications.push(application);
    }

    saveData();
    form.reset();
    document.getElementById("editId").value = "";
    document.getElementById("formTitle").textContent =
        "Add New Application";
    document.getElementById("submitBtn").textContent =
        "Add Application";

    renderApplications();
});

// Update dashboard statistics
function updateStats() {
    document.getElementById("total").textContent =
        applications.length;

    document.getElementById("shortlisted").textContent =
        applications.filter(a => a.status === "Shortlisted").length;

    document.getElementById("interviews").textContent =
        applications.filter(a => a.status === "Interview").length;

    document.getElementById("rejected").textContent =
        applications.filter(a => a.status === "Rejected").length;
}

// Display applications
function renderApplications() {
    applicationList.replaceChildren();

    const search = document.getElementById("search")
        .value.toLowerCase();

    const filter = document.getElementById("filter").value;

    const filtered = applications.filter(app => {
        const matchesSearch =
            app.company.toLowerCase().includes(search) ||
            app.role.toLowerCase().includes(search);

        const matchesStatus =
            filter === "All" || app.status === filter;

        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "No applications found. Add your first application!";
        applicationList.appendChild(empty);
    }

    filtered.forEach(app => {
        const card = document.createElement("div");
        card.className = "application-card";

        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = app.company;

        const role = document.createElement("p");
        role.textContent = "Role: " + app.role;

        const date = document.createElement("p");
        date.textContent = "Applied on: " + app.date;

        const status = document.createElement("span");
        status.className = "status";
        status.textContent = app.status;

        details.append(title, role, date, status);

        if (app.link) {
            const link = document.createElement("p");
            const anchor = document.createElement("a");
            anchor.href = app.link;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
            anchor.textContent = "View Application";

            link.appendChild(anchor);
            details.appendChild(link);
        }

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => editApplication(app.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteApplication(app.id));

        actions.append(editBtn, deleteBtn);
        card.append(details, actions);
        applicationList.appendChild(card);
    });

    updateStats();
}

// Edit application
function editApplication(id) {
    const app = applications.find(a => a.id === id);

    if (!app) return;

    document.getElementById("editId").value = app.id;
    document.getElementById("company").value = app.company;
    document.getElementById("role").value = app.role;
    document.getElementById("date").value = app.date;
    document.getElementById("status").value = app.status;
    document.getElementById("link").value = app.link;

    document.getElementById("formTitle").textContent =
        "Edit Application";

    document.getElementById("submitBtn").textContent =
        "Update Application";

    document.querySelector(".form-section")
        .scrollIntoView({ behavior: "smooth" });
}

// Delete application
function deleteApplication(id) {
    if (!confirm("Are you sure you want to delete this application?")) {
        return;
    }

    applications = applications.filter(app => app.id !== id);

    saveData();
    renderApplications();
}

// Search and filter
document.getElementById("search").addEventListener(
    "input", renderApplications
);

document.getElementById("filter").addEventListener(
    "change", renderApplications
);

// Initial display
renderApplications();
