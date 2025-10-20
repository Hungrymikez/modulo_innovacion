// public/js/app.js
document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = '';

    let files = [];
    let projects = [];

    // Initialize UI elements
    const projectSelect = document.getElementById('projectSelect');
    const searchProject = document.getElementById('searchProject');
    const totalFiles = document.getElementById('totalFiles');
    const resultsCount = document.getElementById('resultsCount');

    // Load initial data
    Promise.all([
        fetch(`${API_BASE}/api/files/projects`).then(r => r.json()),
        fetch(`${API_BASE}/api/files?showModified=false`).then(r => r.json()),
        fetch(`${API_BASE}/api/files?showModified=true`).then(r => r.json())
    ]).then(([proj, originalFiles, modifiedFiles]) => {
        projects = proj;
        files = [...originalFiles, ...modifiedFiles];
        populateProjects(projects);
        updateCounts(originalFiles.length, modifiedFiles.length);
        displayFiles(originalFiles, modifiedFiles);
    }).catch(err => {
        console.error(err);
        alert('Error cargando datos iniciales del servidor');
    });

    // Populate project dropdowns
    function populateProjects(projectsList) {
        projectsList.forEach(project => {
            const option1 = document.createElement('option');
            option1.value = project.id;
            option1.textContent = project.name;
            projectSelect.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = project.id;
            option2.textContent = project.name;
            searchProject.appendChild(option2);
        });
    }

    // Update counts
    function updateCounts(originalCount, modifiedCount) {
        const totalCount = originalCount + modifiedCount;
        totalFiles.textContent = `${totalCount} archivo${totalCount !== 1 ? 's' : ''}`;
        resultsCount.textContent = `${totalCount} archivo${totalCount !== 1 ? 's' : ''} encontrado${totalCount !== 1 ? 's' : ''}`;
        document.getElementById('originalCount').textContent = originalCount;
        document.getElementById('modifiedCount').textContent = modifiedCount;
    }

    // Open modal
    document.getElementById('uploadBtn').addEventListener('click', function() {
        const modal = new bootstrap.Modal(document.getElementById('uploadModal'));
        modal.show();
    });

    // File select button
    document.getElementById('selectFileBtn').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });

    // File input change
    document.getElementById('fileInput').addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            document.getElementById('fileNameDisplay').innerHTML = 
                `<div class="alert alert-success mb-0"><i class="fas fa-check-circle me-2"></i> ${fileName}</div>`;
        }
    });

    // Drag & drop
    document.getElementById('dropZone').addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('border-primary');
        this.classList.remove('border-dashed');
    });
    document.getElementById('dropZone').addEventListener('dragleave', function() {
        this.classList.remove('border-primary');
        this.classList.add('border-dashed');
    });
    document.getElementById('dropZone').addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('border-primary');
        this.classList.add('border-dashed');
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            document.getElementById('fileInput').files = e.dataTransfer.files;
            document.getElementById('fileNameDisplay').innerHTML = 
                `<div class="alert alert-success mb-0"><i class="fas fa-check-circle me-2"></i> ${file.name}</div>`;
        }
    });

    // Upload submit
    document.getElementById('uploadForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('fileInput');
        const projectSelect = document.getElementById('projectSelect');
        const reportDate = document.getElementById('reportDate');
        const sgpsCode = document.getElementById('sgpsCode');
        const studyCenterName = document.getElementById('studyCenterName');
        const regional = document.getElementById('regional');
        const projectResponsibles = document.getElementById('projectResponsibles');
        const responsible = document.getElementById('responsible');
        const progress = document.getElementById('progress');
        const observations = document.getElementById('observations');

        if (!fileInput.files.length || !projectSelect.value || !reportDate.value || !responsible.value || !progress.value) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }

        document.getElementById('uploadText').classList.add('d-none');
        document.getElementById('uploadSpinner').classList.remove('d-none');

        try {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('projectId', projectSelect.value);
            formData.append('reportDate', reportDate.value);
            formData.append('sgpsCode', sgpsCode.value);
            formData.append('studyCenterName', studyCenterName.value);
            formData.append('regional', regional.value);
            formData.append('projectResponsibles', projectResponsibles.value);
            formData.append('responsible', responsible.value);
            formData.append('progress', progress.value);
            formData.append('observations', observations.value);

            const resp = await fetch(`${API_BASE}/api/files/upload`, {
                method: 'POST',
                body: formData
            });
            if (!resp.ok) throw new Error('Error subiendo archivo');
            await