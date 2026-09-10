async function loadDashboard() {

    const response = await fetch("/api/data");

    const data = await response.json();


    // Dashboard

    document.getElementById("income").innerText =
        "₹" + data.income.toFixed(2);

    document.getElementById("expenses").innerText =
        "₹" + data.expenses.toFixed(2);

    document.getElementById("balance").innerText =
        "₹" + data.balance.toFixed(2);

    document.getElementById("savingPercentage").innerText =
        data.savings_percentage + "%";


    // Financial Health

    const healthStatus =
        document.getElementById("healthStatus");

    healthStatus.innerText =
        data.health;

    healthStatus.className =
        "health-status " + data.health_class;


    let healthMessage = "";

    if (data.savings_percentage >= 30) {

        healthMessage =
            "Excellent! You are maintaining a strong savings rate.";

    } else if (data.savings_percentage >= 15) {

        healthMessage =
            "Good financial management. Keep improving your savings.";

    } else if (data.savings_percentage >= 5) {

        healthMessage =
            "Your savings are low. Try reducing unnecessary expenses.";

    } else {

        healthMessage =
            "Your expenses are consuming most of your income. Review your spending.";
    }

    document.getElementById("healthMessage").innerText =
        healthMessage;


    // Suggestions

    const suggestionBox =
        document.getElementById("suggestions");

    suggestionBox.innerHTML = "";

    data.suggestions.forEach(function (suggestion) {

        const p = document.createElement("p");

        p.innerText = "💡 " + suggestion;

        suggestionBox.appendChild(p);

    });


    // Category Analysis

    const categoryBox =
        document.getElementById("categoryAnalysis");

    categoryBox.innerHTML = "";

    const categories =
        Object.entries(data.categories);

    if (categories.length === 0) {

        categoryBox.innerHTML =
            "<p>No expenses added yet.</p>";

    } else {

        categories.forEach(function ([category, amount]) {

            const div =
                document.createElement("div");

            div.className =
                "category-box";

            div.innerHTML = `
                <strong>${category}</strong>
                ₹${amount.toFixed(2)}
            `;

            categoryBox.appendChild(div);

        });
    }


    // Expense table

    const table =
        document.getElementById("expenseTable");

    table.innerHTML = "";

    if (data.expenses_list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4">
                    No expenses added yet.
                </td>
            </tr>
        `;

    } else {

        data.expenses_list
            .slice()
            .reverse()
            .forEach(function (expense) {

                const row =
                    document.createElement("tr");

                row.innerHTML = `
                    <td>${expense.date}</td>

                    <td>${expense.category}</td>

                    <td>${expense.description || "-"}</td>

                    <td>₹${expense.amount.toFixed(2)}</td>
                `;

                table.appendChild(row);

            });
    }
}


// Income

document
    .getElementById("incomeForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const income =
            document.getElementById("incomeInput").value;


        const response =
            await fetch("/api/income", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    income: income
                })
            });


        const data =
            await response.json();


        if (data.success) {

            alert("Income updated successfully!");

            document
                .getElementById("incomeForm")
                .reset();

            loadDashboard();

        } else {

            alert(data.message);
        }

    });


// Expense

document
    .getElementById("expenseForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const amount =
            document.getElementById("amount").value;

        const category =
            document.getElementById("category").value;

        const description =
            document.getElementById("description").value;


        const response =
            await fetch("/api/expense", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    amount: amount,

                    category: category,

                    description: description

                })
            });


        const data =
            await response.json();


        if (data.success) {

            alert("Expense added successfully!");

            document
                .getElementById("expenseForm")
                .reset();

            loadDashboard();

        } else {

            alert(data.message);
        }

    });


// Reset

async function resetData() {

    const confirmation =
        confirm(
            "Are you sure you want to delete all financial data?"
        );


    if (!confirmation) {
        return;
    }


    await fetch("/api/reset", {
        method: "POST"
    });


    alert("Financial data reset successfully!");

    loadDashboard();
}


// Load dashboard

loadDashboard();