const transactionList = document.getElementById('transaction-list');
const transactionCount = document.getElementById('transaction-count');
const apiStatusIndicator = document.getElementById('api-status');  // Element for the API status indicator
const errorMessage = document.createElement('div');
let lastTransactionCount = 0;

async function fetchTransactions() {
    try {
        const response = await fetch('https://qrgen.tongtji.com/api/transaction/get');

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        if (data.meta.code === 200 && data.meta.status === "success") {
            if (data.data.count !== lastTransactionCount) {
                renderTransactions(data.data.transaction, data.data.count);
                lastTransactionCount = data.data.count;
            }
            clearErrorMessage();
            updateApiStatus(true);
        } else {
            showErrorMessage(`Error: ${data.meta.message}`);
            updateApiStatus(false);
        }
    } catch (error) {
        showErrorMessage(`Failed to fetch transactions: ${error.message}`);
        updateApiStatus(false);
    }
}

const secretCountElement = document.createElement('div');
const jukiCountElement = document.createElement('div');
const wapoCountElement = document.createElement('div');
const brCountElement = document.createElement('div');
transactionList.parentElement.insertBefore(secretCountElement, transactionList);
transactionList.parentElement.insertBefore(jukiCountElement, transactionList);
transactionList.parentElement.insertBefore(wapoCountElement, transactionList);
transactionList.parentElement.insertBefore(brCountElement, transactionList);

function renderTransactions(transactions, count) {
    transactionList.innerHTML = '';
    transactionCount.textContent = `Total Transactions: ${count}`;

    // Initialize counters
    let secretCount = 0;
    let jukiCount = 0;
    let wapoCount = 0;
    let brCount = 0;

    transactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';

        transactionItem.innerHTML = `
            <p><strong>Vendor:</strong> ${transaction.name}</p>
            <p><strong>NIK:</strong> ${transaction.nik}</p>
            <p><strong>Full Name:</strong> ${transaction.fullname}</p>
            <p><strong>Created At:</strong> ${new Date(transaction.created_at).toLocaleString()}</p>
            <p class="takeaway"><strong>Takeaway:</strong> ${transaction.is_takeaway ? 'Yes' : 'No'}</p>
        `;

        transactionList.appendChild(transactionItem);

        // Count transactions for specific vendors
        if (transaction.name.toLowerCase() === 'secret') {
            secretCount++;
        } else if (transaction.name.toLowerCase() === 'juki') {
            jukiCount++;
        } else if (transaction.name.toLowerCase() === 'wapo') {
            wapoCount++;
        } else if (transaction.name.toLowerCase() === 'bintang rasa') {
            brCount++;
        }
    });

    // Update the vendor counts in the HTML
    secretCountElement.textContent = `Secret Transactions: ${secretCount}`;
    jukiCountElement.textContent = `Juki  Transactions: ${jukiCount}`;
    wapoCountElement.textContent = `Wapo Transactions: ${wapoCount}`;
    brCountElement.textContent = `Bintang Rasa Transactions: ${brCount}`;
}


// Function to display an error message
function showErrorMessage(message) {
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    transactionList.innerHTML = '';
    transactionList.appendChild(errorMessage);
    transactionCount.textContent = '';
}

// Function to clear the error message
function clearErrorMessage() {
    if (transactionList.contains(errorMessage)) {
        transactionList.removeChild(errorMessage);
    }
}

// Function to update the API status indicator
let i = 0;
function updateApiStatus(isActive) {
    if (isActive) {
        i++
        console.log('API Connection.. (' + i + ')')
        apiStatusIndicator.style.backgroundColor = 'green';
        apiStatusIndicator.title = 'API is active';
        apiStatusIndicator.classList.add('pulse');
    } else {
        console.log('API Not Connection..')
        apiStatusIndicator.style.backgroundColor = 'red';
        apiStatusIndicator.title = 'API is down';
        apiStatusIndicator.classList.remove('pulse');
    }
}


setInterval(fetchTransactions, 5000);

fetchTransactions();
