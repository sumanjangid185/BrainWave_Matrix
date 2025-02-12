document.addEventListener("DOMContentLoaded", function () {
  const balanceEl = document.getElementById("balance");
  const incomeEl = document.getElementById("income");
  const expenseEl = document.getElementById("expense");
  const transactionList = document.getElementById("transaction-list");
  const transactionForm = document.getElementById("transaction-form");
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");
  const ctx = document.getElementById("expenseChart").getContext("2d");

  let transactions = [];

  // related too chart
  let expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Income", "Expense"],
        datasets: [{
            data: [0, 0],
            backgroundColor: ["#2ecc71", "#e74c3c"],
            borderWidth: 3,  
            hoverBorderWidth: 5  
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "5%", 
        layout: {
            padding: 10,

        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 16, // Increase label font size
                        weight: "bold"
                    },
                    color: "#333", // Change label color (optional)
                    padding: 15  // Add spacing between labels
                
                }
            }
        }
    }
});





  function updateUI() {
      let income = 0, expense = 0;

      transactions.forEach(transaction => {
          if (transaction.type === "income") {
              income += transaction.amount;
          } else {
              expense += transaction.amount;
          }
      });

      const balance = income - expense;

      balanceEl.textContent = `₹${balance}`;
      incomeEl.textContent = `₹${income}`;
      expenseEl.textContent = `₹${expense}`;

      expenseChart.data.datasets[0].data = [income, expense];
      expenseChart.update();
  }

  function addTransaction(description, amount, type) {
      const transaction = {
          id: Date.now(),
          description,
          amount: parseFloat(amount),
          type
      };

      transactions.push(transaction);
      renderTransaction(transaction);
      updateUI();
  }

  function renderTransaction(transaction) {
      const li = document.createElement("li");
      li.innerHTML = `
          ${transaction.description} - ₹${transaction.amount}
          <span class="remove" data-id="${transaction.id}">✖</span>
      `;
      transactionList.appendChild(li);
  }

  transactionForm.addEventListener("submit", function (e) {
      e.preventDefault();
      addTransaction(descriptionInput.value, amountInput.value, categoryInput.value);
      descriptionInput.value = "";
      amountInput.value = "";
  });

  transactionList.addEventListener("click", function (e) {
      if (e.target.classList.contains("remove")) {
          const id = parseInt(e.target.getAttribute("data-id"));
          transactions = transactions.filter(transaction => transaction.id !== id);
          e.target.parentElement.remove();
          updateUI();
      }
  });

  updateUI();
});
