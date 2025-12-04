async function loadMainProfile() {
    const res = await fetch("/api/profile");
    const data = await res.json();

    document.getElementById("profileName").innerText = data.name;
    document.getElementById("profileDescription").innerText = data.description;
}

loadMainProfile();
