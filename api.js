async function loadProfile() {
    const res = await fetch("/api/profile");
    const data = await res.json();

    document.getElementById("profileName").innerText = data.name;
    document.getElementById("profileDescription").innerText = data.description;
    document.getElementById("profileEmail").innerText = data.email;
    document.getElementById("profileGithub").innerText = data.github;
    document.getElementById("profileGithub").href = data.github;

    if (data.photo) document.getElementById("profilePhoto").src = data.photo;

    const skillsList = document.getElementById("profileSkills");
    skillsList.innerHTML = "";
    data.skills.forEach(s => {
        const li = document.createElement("li");
        li.innerText = s;
        skillsList.appendChild(li);
    });
}

async function loadProfileToForm() {
    const res = await fetch("/api/profile");
    const p = await res.json();

    name.value = p.name;
    description.value = p.description;
    email.value = p.email;
    github.value = p.github;
    photo.value = p.photo;
    skills.value = p.skills.join(", ");
}

async function updateProfile(profile) {
    const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
    });

    return await res.json();
}
