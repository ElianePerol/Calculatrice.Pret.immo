function getResult(){
    const result = document.querySelector('.result');
    result.removeAttribute("hidden");

    const tbody = document.querySelector("tbody");
    const amount = document.querySelector("#amount").value;
    const rate = document.querySelector("#rate").value/12;
    const length = document.querySelector("#length").value*12;
    const monthlyExp = (amount*rate)/(1-(1+rate)**-(-length));

    console.log(amount);
    console.log(rate);
    console.log(length);
    console.log(monthlyExp);

    // for (let i = 0; i <= length; i++) {
    //     const row = `                
    //     <tr>
    //         <td>${i + 1}</td>
    //         <td>
    //             ${amount} €
    //         </td>
    //         <td>
    //             ${mensualite} €
    //         </td>
    //         <td>
    //             ${montant} €
    //         </td>
    //         <td>
    //             ${amortization} €
    //         </td>
    //         <td>
    //             ${amount-amortization} €
    //         </td>
    //     </tr>
    //     `;

    //     tbody.insertAdjacentHTML("beforeend", row);
    // }
 }