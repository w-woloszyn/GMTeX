function setExtensionInfo() {
    const manifest = browser.runtime.getManifest();
    document.name = manifest.name;
    document.getElementById("extension-name").textContent = manifest.name;
    document.getElementById("extension-author").textContent = manifest.author || 'Not specified';
    document.getElementById("extension-website").textContent = manifest.website;
    document.getElementById("extension-license").textContent = manifest.license || 'Not specified';
    document.getElementById("extension-version").textContent = manifest.version;
}

setExtensionInfo();
