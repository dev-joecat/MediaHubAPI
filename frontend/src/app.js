// Define the API URL of your Azure Function App
const API_URL = 'https://<your-function-app-name>.azurewebsites.net/api';  // Replace with your actual function URL

// Get references to DOM elements
const createMediaForm = document.getElementById('createMediaForm');
const fetchByIdButton = document.getElementById('fetchByIdButton');
const mediaIdInput = document.getElementById('mediaIdInput');
const mediaContent = document.getElementById('mediaContent');
const mediaDisplay = document.getElementById('mediaDisplay');
const updateMediaForm = document.getElementById('updateMediaForm');
const deleteMediaButton = document.getElementById('deleteMediaButton');
const deleteMediaIdInput = document.getElementById('deleteMediaId');

// Function to handle Create Media (POST request with file upload)
const createMedia = async (e) => {
  e.preventDefault(); // Prevent the form from reloading the page

  const mediaTitle = document.getElementById('mediaTitle').value;
  const mediaDescription = document.getElementById('mediaDescription').value;
  const mediaFile = document.getElementById('mediaFile').files[0]; // Get the file from the input

  const formData = new FormData();
  formData.append('title', mediaTitle);
  formData.append('description', mediaDescription);
  formData.append('file', mediaFile);

  try {
    const response = await fetch(`${API_URL}/uploadMedia`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      mediaContent.textContent = `Media uploaded successfully: ${JSON.stringify(result, null, 2)}`;
    } else {
      mediaContent.textContent = `Error: ${response.status}`;
    }
  } catch (error) {
    mediaContent.textContent = `Network Error: ${error.message}`;
  }
};

// Function to fetch Media by ID (GET request)
const fetchMediaById = async () => {
  const mediaId = mediaIdInput.value; // Get the ID entered by the user

  if (!mediaId) {
    mediaContent.textContent = 'Please enter a valid media ID.';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/getMedia/${mediaId}`);
    if (response.ok) {
      const mediaData = await response.json();
      // Display the fetched media details
      mediaContent.textContent = `Title: ${mediaData.title}\nDescription: ${mediaData.description}\nURL: ${mediaData.url}`;
    } else {
      mediaContent.textContent = `Error: ${response.status} - Media not found.`;
    }
  } catch (error) {
    mediaContent.textContent = `Network Error: ${error.message}`;
  }
};

// Function to handle Update Media (PUT request with file upload)
const updateMedia = async (e) => {
  e.preventDefault(); // Prevent the form from reloading the page

  const mediaId = document.getElementById('selectMediaId').value;
  const mediaTitle = document.getElementById('updateMediaTitle').value;
  const mediaDescription = document.getElementById('updateMediaDescription').value;
  const mediaFile = document.getElementById('updateMediaFile').files[0];

  const formData = new FormData();
  formData.append('title', mediaTitle);
  formData.append('description', mediaDescription);

  if (mediaFile) {
    formData.append('file', mediaFile); // Include file if provided
  }

  try {
    const response = await fetch(`${API_URL}/putMedia/${mediaId}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      const result = await response.text(); // Expect plain text response
      mediaContent.textContent = result;
    } else {
      mediaContent.textContent = `Error: ${response.status}`;
    }
  } catch (error) {
    mediaContent.textContent = `Network Error: ${error.message}`;
  }
};

// Function to handle Delete Media (DELETE request)
const deleteMedia = async () => {
  const mediaId = deleteMediaIdInput.value; // Get the ID entered by the user

  if (!mediaId) {
    mediaContent.textContent = 'Please enter a valid media ID.';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/deleteMedia/${mediaId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const result = await response.text(); // Expect plain text response
      mediaContent.textContent = result;
    } else {
      mediaContent.textContent = `Error: ${response.status}`;
    }
  } catch (error) {
    mediaContent.textContent = `Network Error: ${error.message}`;
  }
};

// Attach event listeners
createMediaForm.addEventListener('submit', createMedia);
fetchByIdButton.addEventListener('click', fetchMediaById);
updateMediaForm.addEventListener('submit', updateMedia);
deleteMediaButton.addEventListener('click', deleteMedia);
