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

// Function to display items in the list
const DisplayData = (itemData) => {
    const groceryList = groceryContainer.querySelector(".grocery-list");
    groceryList.innerHTML = ''; // Clear existing items

    itemData.forEach(item => {
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
};

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
