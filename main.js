// ------------- Basic value verification functions - start --------
function isValidInteger(value) {
    const parsedValue = parseFloat(value);
    return Number.isInteger(parsedValue);
}

function isValidFloat(value) {
    const parsedValue = parseFloat(value);
    return (value % 1 !== 0);
}

function nonNull(value) {
    return value != "";
}

function isGreaterThan(value, min) {
    return value >= min;
}

function isLowerThan(value, max) {
    return value <= max;
}
// ------------- Basic value verification functions - end ---------


// ------------- Input verification functions - start ------------- 
function errorAmount(value) {
    if (
        isValidInteger(value) &&
        nonNull(value) &&
        isGreaterThan(value, 1000)
    ) {
        document.querySelector("#amount").classList.remove('error-border');
        return false
        }
    document.querySelector("#amount").classList.add('error-border');   
    return true
}

function errorRate(value) {
    if (
        isValidFloat(value) &&
        nonNull(value) &&
        isGreaterThan(value, 1.01) &&
        isLowerThan(value, 1.99)
    ) {
        document.querySelector("#rate").classList.remove('error-border');
        return false
        }
    document.querySelector("#rate").classList.add('error-border');
    return true
}

function errorLength(value) {
    if (
        isValidInteger(value) &&
        nonNull(value) &&
        isGreaterThan(value, 1) &&
        isLowerThan(value, 30)
    ) {
        document.querySelector("#length").classList.remove('error-border');
        return false
        }
    document.querySelector("#length").classList.add('error-border');
    return true
}
// ------------- Input verification functions - end --------------


// ------------- Error handling functions - start ----------------
function errorDisplay(errors) {
    const errorDisplay = document.getElementById('error-display');
    errorDisplay.style.display = 'none';

    if (errors.length == 1) {
        errorDisplay.style.display = 'block';
        errorDisplay.classList.add('error-message');
        errorDisplay.textContent = 'Veuillez remplir le champ "' + errors.join(', ') + '" avec des données valides !';
        return true;
    }
    else if (errors.length > 1) {
        errorDisplay.style.display = 'block';
        errorDisplay.classList.add('error-message');
        errorDisplay.textContent = 'Veuillez remplir les champs "' + errors.join(', ') + '" avec des données valides !';
        return true;
    }
    else return false
}

function errorMessage(amount, rate, length) {
    let errors = [];

    if (errorAmount(amount)) {
        errors.push('montant emprunté');
    }
    if (errorRate(rate)) {
         errors.push('taux nominal');
    }
    if (errorLength(length)) {
         errors.push('durée de remboursement');
    }

    return errorDisplay(errors);
}
// ------------- Error handling functions - end -----------------


// ------------- Result functions - start -----------------------
function generateResult() {
    const result = document.querySelector('.result');
    result.removeAttribute("hidden");

    const tbody = document.querySelector("tbody");

    const amount = document.querySelector("#amount").value;
    const rate = (document.querySelector("#rate").value/12)/100;
    const length = document.querySelector("#length").value*12;

    const monthlyPayment = (amount*((rate*((1+rate)**length))/(((1+rate)**length)-1))).toFixed(2);
    let monthlyAmount = amount;
    let interest = 0;
    let amortization = 0;
    let remainingBalance = 0;

    for (let i = 1; i <= length; i++) {
        const row = `                
        <tr>
            <td>${i}</td>
            <td>
                ${monthlyAmount = (monthlyAmount-amortization).toFixed(2)} €
            </td>
            <td>
                ${monthlyPayment} €
            </td>
            <td>
                ${interest=(monthlyAmount*rate).toFixed(2)} €
            </td>
            <td>
                ${amortization=(monthlyPayment-interest).toFixed(2)} €
            </td>
            <td>
                ${remainingBalance=(monthlyAmount-amortization).toFixed(2)} €
            </td>
        </tr>`;

        tbody.insertAdjacentHTML("beforeend", row);
    }

    console.log(monthlyAmount);
}

function getResult() {    
    const amount = document.querySelector("#amount").value;
    const rate = document.querySelector("#rate").value;
    const length = document.querySelector("#length").value;

    console.log(amount);
    console.log(rate);
    console.log(length);

    const result = document.querySelector('.result');
    result.setAttribute("hidden", "hidden");
    if (!errorMessage(amount, rate, length)) {
        document.querySelector("#result-table tbody").innerHTML = "";
        generateResult();
    }
}
// ------------- Result functions - end -------------------------


// ------------- Export to PDF functions - start ----------------

/* Export to PDF using html2pdf
function getResultPDF() {
    document.querySelector('#export-pdf').addEventListener('click', function () {
        
        const resultTable = document.querySelector('#result-table');
        const logo = document.querySelector("#logo");

        // Creates a wrapper div that holds the logo and table together
        const wrapperDiv = document.createElement('div');

        // Creates a container div for the logo and centers it
        const logoDiv = document.createElement('div');
        logoDiv.style.textAlign = "center";
        logoDiv.style.marginBottom = "20px";
        logoDiv.appendChild(logo.cloneNode(true));


        wrapperDiv.appendChild(logoDiv);
        wrapperDiv.appendChild(resultTable.cloneNode(true));
        
        let opt = {
            margin:       [5, 15, 5, 15], 
            filename:     'Tableau-amortissement.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['css', 'avoid-all'] , before: '#page2el' },
        };

        html2pdf()
            .from(wrapperDiv).set(opt).save().then(() => {
            // Clean up the wrapper div after generating the PDF
            wrapperDiv.remove();
        });
    });
}
*/


// Export to PDF using jsPDF
function getResultPDF() {

    const resultPDF = new jsPDF('p', 'pt', 'a4');

    resultPDF.setTextColor(35, 63, 104);

    // Adds title
    let startY = 40; // Top margin
    resultPDF.setFontSize(18);
    resultPDF.text("Tableau d'amortissement", 170, startY);
    startY += 50; // Line break
    
    // Adds table headers
    resultPDF.setFontSize(12);
    let colWidthTitle = [30, 75, 168, 242, 300, 392];
    let headers = ["Mois", "Solde initial", "Échéance", "Intérêts", "Amortissement", "Solde restant"];
    headers.forEach((header, i) => {
        resultPDF.addImage(logo, 'PNG', 452, 20, 80, 28);
        resultPDF.text(header, colWidthTitle[i], startY);
    });
    startY += 30; // Line break after header

    // Setting up the function to create a new page if needed
    function addPage() {
        resultPDF.addPage();
        startY = 50; // Top margin
        resultPDF.setFontSize(12);
        headers.forEach((header, i) => {
            resultPDF.addImage(logo, 'PNG', 490, 25, 80, 28);
            resultPDF.text(header, colWidthTitle[i], startY);
        });
        startY += 30; // Line break after header
    }

    // Adds table rows
    let colWidthContent = [35, 23, 120, 193, 261, 345];
    let rows = document.querySelectorAll("table tbody tr");
    rows.forEach((row) => {
        if (startY > 800) { // Checks if we need to add a new page (A4 page height - margins)
            addPage();
        }

        let cols = row.querySelectorAll("td");
        cols.forEach((col, i) => {
            // replace(/(\r\n|\n|\r)/gm, "") removes auto-generated line breaks
            resultPDF.text(col.textContent.replace(/(\r\n|\n|\r)/gm, ""), colWidthContent[i], startY);
        });
        startY += 20; // Moves to the next row
        
    });

    // Downloads the pdf file
    resultPDF.save("result.pdf");
}

const pdfExportBtn = document.querySelector("#export-pdf");
// No parentheses to the function, otherwise it runs on page loading rather than on click
pdfExportBtn.addEventListener("click", getResultPDF); 

// ------------- Export to PDF functions - end ------------------





// Commentaires Kévin
// form.addEventListener("submit", function(event)) {
//     if (
//         nonNull(amount.value) && 
//         isValidInteger(amount) &&
//         isGreaterThan(amount,1) &&
//         isLowerThan(amount, 30) 
//         )
// }
// remove "onclick" from button, add "submit" to type, ad "id="form" to form
// 
// faire du test de fonctions en utilisant Jest