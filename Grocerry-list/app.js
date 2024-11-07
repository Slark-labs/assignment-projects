const items_url = "http://localhost:8000/api/items";
const groceryContainer = document.getElementById("grocery-container");
let currentItemId = null; // To store the ID of the item being edited

// Event listener for the form submission
document.getElementById("grocery-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const itemInput = document.getElementById("grocery").value;
    const prizeInput = document.getElementById("prize").value; // Ensure this input exists in your HTML

    if (currentItemId) {
        updateItem(currentItemId, itemInput, prizeInput);
    } else {
        addItem(itemInput, prizeInput);
    }

    // Clear input fields
    document.getElementById("grocery").value = '';
    document.getElementById("prize").value = '';
});

// Function to add a new item
const addItem = (name, prize) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("name", name);
    urlencoded.append("prize", prize);

    fetch(items_url, {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            getItems(); // Refresh item list
        })
        .catch(error => console.error(error));
};

// Function to get items from the API
const getItems = () => {
    fetch(items_url)
        .then(response => response.json())
        .then(data => {
            DisplayData(data.items); // Pass the array of items to DisplayData
        })
        .catch(error => console.error(error));
};
// Set up initial page number and items per page
let currentPage = 1;
const itemsPerPage = 5; // Adjust as needed

// Function to fetch data (assuming it's from a JSON file or API)
async function fetchData() {
    try {
        const response = await fetch('items/ITEMs_MOCK_DATA.json'); // Replace with actual path
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const itemData = await response.json();
        DisplayData(itemData); // Initial data display with pagination
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to display paginated items in the list
const DisplayData = (itemData) => {
    const groceryList = document.querySelector(".grocery-list");
    groceryList.innerHTML = ''; // Clear existing items

    // Calculate start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Get only the items for the current page
    const paginatedItems = itemData.slice(startIndex, endIndex);

    // Display items for the current page
    paginatedItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.className = "grocery-item";

        listItem.innerHTML = `
            <div class="item-content">
                <p class="title">${item.name}</p>
                <p class="prize">Price: $${item.prize}</p>
                <p class="id">ID: ${item.id}</p>
                <div class="btn-container">
                    <button type="button" class="edit-btn" onclick="setEdit('${item.id}', '${item.name}', '${item.prize}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button type="button" class="delete-btn" onclick="DeleteItem('${item.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        groceryList.appendChild(listItem);
    });

    // Update pagination controls
    displayPaginationControls(itemData);
};

// Function to create and display pagination controls
const displayPaginationControls = (itemData) => {
    const paginationContainer = document.querySelector(".pagination-container");
    paginationContainer.innerHTML = ''; // Clear existing controls

    const totalItems = itemData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPageButtons = 9; // Number of page buttons to display at a time

    // Create "Previous" button
    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.innerText = "Previous";
        prevButton.onclick = () => {
            currentPage--;
            DisplayData(itemData); // Update displayed items
        };
        paginationContainer.appendChild(prevButton);
    }

    // Create page number buttons
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Adjust startPage if near the end
    if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.innerText = i;
        pageButton.className = i === currentPage ? "active" : "";
        pageButton.onclick = () => {
            currentPage = i;
            DisplayData(itemData); // Update displayed items
        };
        paginationContainer.appendChild(pageButton);
    }

    // Create "Next" button
    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.innerText = "Next";
        nextButton.onclick = () => {
            currentPage++;
            DisplayData(itemData); // Update displayed items
        };
        paginationContainer.appendChild(nextButton);
    }
};


// Load and display the data with pagination
fetchData();



// Function to set item for editing
const setEdit = (id, name, prize) => {
    currentItemId = id; // Set current item ID
    document.getElementById("grocery").value = name; // Set input value to item name
    document.getElementById("prize").value = prize; // Set input value to item prize
};

const updateItem = (id, name, prize) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("name", name);
    urlencoded.append("prize", prize);

    fetch(`http://localhost:8000/api/items/${id}`, {
        method: "PUT",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            currentItemId = null; // Reset current item ID
            getItems(); // Refresh item list
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
};


// Function to delete an item
const DeleteItem = (id) => {
    fetch(`http://localhost:8000/api/items/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            getItems(); // Refresh item list after deletion
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
};

// Initial fetch of items when the page loads
getItems();
