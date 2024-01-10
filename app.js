
// Cart to store selected items
const cart = [];

// Purchase history to store completed purchases
const purchaseHistory = [];

// Function to add item to the cart
function addItem(itemName, itemPrice) {
    // Add item to the cart
    cart.push({ name: itemName, price: itemPrice });

    // Update the cart display
    displayCart();

    // Update the total price
    updateTotal();
}

// Function to remove item from the cart
function removeItem(index) {
    // Remove the item from the cart array
    cart.splice(index, 1);

    // Update the cart display
    displayCart();

    // Update the total price
    updateTotal();
}

// Function to complete the purchase
function completePurchase() {
    // Calculate the total price
    if (cart.length === 0) {
        // Display an alert if the cart is empty
        alert('Cannot complete purchase. Shopping cart is empty.');
        return;
    }

    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    // Display a simple completion message
    alert(`Purchase completed!\nTotal: $${totalPrice.toFixed(2)}`);

    // Add the current cart to the purchase history
    purchaseHistory.push([...cart]);

    // Clear the shopping cart
    cart.length = 0;

    // Update the cart display
    displayCart();

    // Update the total price
    updateTotal();
}

// Function to display items in the cart
function displayCart() {
    const cartItemsElement = document.getElementById('cart-items');
    cartItemsElement.innerHTML = '';

    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;

        // Add a remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'مسح المنتج';
        removeButton.onclick = () => removeItem(index);

        listItem.appendChild(removeButton);
        cartItemsElement.appendChild(listItem);
    });
}

// Function to update the total price
function updateTotal() {
    const totalElement = document.getElementById('total');
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);
    totalElement.textContent = totalPrice.toFixed(2);
}

function generateReport() {
    // Get the report content element
    const reportContentElement = document.getElementById('report-content');

    // Clear previous content
    reportContentElement.innerHTML = '';

    // Initialize overall total price
    let overallTotalPrice = 0;

    // Display the purchase history in the report table
    purchaseHistory.forEach((purchase, purchaseIndex) => {
        // Create a table row for each purchase
        const row = document.createElement('tr');

        // Create cells for purchase number, items, and total price
        const purchaseCell = document.createElement('td');
        const itemsCell = document.createElement('td');
        const totalPriceCell = document.createElement('td');

        // Initialize counts and total price for each purchase
        let itemCounts = {};
        let totalPurchasePrice = 0;

        // Calculate counts and total price
        purchase.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
            totalPurchasePrice += item.price;
        });

        // Populate cells with data
        purchaseCell.textContent = `Purchase ${purchaseIndex + 1}`;
        itemsCell.textContent = JSON.stringify(itemCounts);
        totalPriceCell.textContent = `$${totalPurchasePrice.toFixed(2)}`;

        // Append cells to the row
        row.appendChild(purchaseCell);
        row.appendChild(itemsCell);
        row.appendChild(totalPriceCell);

        // Append the row to the table
        reportContentElement.appendChild(row);

        // Add to the overall total price
        overallTotalPrice += totalPurchasePrice;
    });

    // Add a row for overall total
    const overallTotalRow = document.createElement('tr');
    const overallTotalLabelCell = document.createElement('td');
    overallTotalLabelCell.textContent = 'Overall Total';
    const overallTotalCell = document.createElement('td');
    overallTotalCell.textContent = `$${overallTotalPrice.toFixed(2)}`;
    overallTotalRow.appendChild(overallTotalLabelCell);
    overallTotalRow.appendChild(overallTotalCell);
    reportContentElement.appendChild(overallTotalRow);
}
function generateFinalReport() {
    const reportContentElement = document.getElementById('report-content');

    // Ensure the content is not empty
    if (!reportContentElement.innerHTML.trim()) {
        alert('No report to generate. Please create a report first.');
        return;
    }
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const options = {
        margin: 10,
        filename: `تقرير_${dateString}.pdf`, // Set filename with the current date
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 2},
        jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'}
    };

    // Use html2pdf to generate PDF
    html2pdf().from(reportContentElement).set(options).save();
}
// Function to generate the final report in PDF