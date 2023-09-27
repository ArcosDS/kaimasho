document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.getElementById("aggiungiTrasferta");
    const tableBody = document.getElementById("trasferteTableBody");
    const totaleCostoTrasferte = document.getElementById("totaleCostoTrasferte");
    const totaleGiorniTrasferta = document.getElementById("totaleGiorniTrasferta");
    const totaleGiorniEstera = document.getElementById("totaleGiorniEstera");
    const totaleGiorniNazionale = document.getElementById("totaleGiorniNazionale");
    const meseAnnoInput = document.getElementById("meseAnno");

    let lastRowId = 0; // Variabile per l'ID incrementale dell'ultima riga

    addButton.addEventListener("click", function () {
        // Creazione di una nuova riga
        const newRow = document.createElement("tr");
        lastRowId++; // Incrementa l'ID per la nuova riga

        // Imposta l'ID per la riga
        newRow.dataset.rowId = lastRowId;
            
            // Aggiungi campi input per i dati della trasferta
            const idCell = document.createElement("td");
            idCell.textContent = ""; // Lascia vuoto per ora

            const dataInizioCell = document.createElement("td");
            const dataInizioInput = document.createElement("input");
            dataInizioInput.type = "date";
            dataInizioInput.addEventListener("change", function () {
                // Calcolo del giorno della settimana in base alla data
                const date = new Date(dataInizioInput.value);
                const giornoSettimana = getGiornoSettimanaItaliano(date);
                giornoInizioInput.value = giornoSettimana;
            });
            dataInizioCell.appendChild(dataInizioInput);

            const giornoInizioCell = document.createElement("td");
            const giornoInizioInput = document.createElement("input");
            giornoInizioInput.type = "text";
            giornoInizioCell.appendChild(giornoInizioInput);

            const dataFineCell = document.createElement("td");
            const dataFineInput = document.createElement("input");
            dataFineInput.type = "date";
            dataFineInput.addEventListener("change", function () {
                const date = new Date(dataFineInput.value);
                const giornoSettimana = getGiornoSettimanaItaliano(date);
                giornoFineInput.value = giornoSettimana;
            });
            dataFineCell.appendChild(dataFineInput);
		

            const giornoFineCell = document.createElement("td");
            const giornoFineInput = document.createElement("input");
            giornoFineInput.type = "text";
            giornoFineCell.appendChild(giornoFineInput);

            const descrizioneCell = document.createElement("td");
            const descrizioneInput = document.createElement("input");
            descrizioneInput.type = "text";
            descrizioneCell.appendChild(descrizioneInput);

			const numGiorniCell = document.createElement("td");
            const numGiorniInput = document.createElement("input");
            numGiorniInput.type = "number";
            numGiorniInput.step = "1";
            numGiorniCell.appendChild(numGiorniInput);

            const costoCell = document.createElement("td");
            const costoInput = document.createElement("input");
            costoInput.type = "number";
            costoInput.step = "0.01";
            costoCell.appendChild(costoInput);

            const trasfertaEsteraCell = document.createElement("td");
            const trasfertaEsteraInput = document.createElement("input");
            trasfertaEsteraInput.type = "checkbox";
            trasfertaEsteraCell.appendChild(trasfertaEsteraInput);

            // Aggiungi le celle alla riga
			newRow.appendChild(idCell);
			newRow.appendChild(dataInizioCell);
			newRow.appendChild(giornoInizioCell);
			newRow.appendChild(dataFineCell);
			newRow.appendChild(giornoFineCell);
			newRow.appendChild(descrizioneCell);
			newRow.appendChild(numGiorniCell);
			newRow.appendChild(costoCell);
			newRow.appendChild(trasfertaEsteraCell);

			// Aggiungi la riga alla tabella
			tableBody.appendChild(newRow);

			// Aggiungi un controllo per evitare intervalli di date sovrapposti
			if (checkDateOverlap()) {
				alert("Le date delle trasferte non possono sovrapporsi.");
				return;
			}

			// Calcola il costo della trasferta e il totale dei giorni
			const costoTrasferta = calcolaCostoTrasferta();
			const giorniEstera = trasfertaEsteraInput.checked ? numeroGiorni : 0;
			const giorniNazionale = trasfertaEsteraInput.checked ? 0 : numeroGiorni;

			// Aggiorna i totali
			updateTotalCost();
			updateTotalGiorni(giorniEstera, giorniNazionale);

			// Aggiungi la riga alla tabella
			tableBody.appendChild(newRow);

			// Calcolo dei giorni della trasferta
			function calcolaGiorniTrasferta() {
				const dataInizio = new Date(dataInizioInput.value);
				const dataFine = new Date(dataFineInput.value);
				

				// Calcola il numero di giorni tra la data di inizio e la data di fine
				const millisecondsInDay = 24 * 60 * 60 * 1000;
				const numeroGiorni = Math.round((dataFine - dataInizio) / millisecondsInDay) + 1;

				// Inserisci il costo nella cella
				numGiorniInput.value = numeroGiorni;
				return numeroGiorni
			}

			

			// Calcolo del costo della trasferta
			function calcolaCostoTrasferta() {
				const numeroGiorni = numGiorniInput.value;
				const trasfertaEstera = trasfertaEsteraInput.checked;
				const forfettarioNazionaleInput = document.getElementById("forfettarioNazionale");
				let costoGiornaliero = parseFloat(forfettarioNazionaleInput.value);

				// Verifica se la trasferta è estera e imposta il costo giornaliero corretto
				if (trasfertaEstera) {
					const forfettarioEsteroInput = document.getElementById("forfettarioEstero");
					costoGiornaliero = parseFloat(forfettarioEsteroInput.value);
					
				}

				// Calcola il costo della trasferta in base al costo giornaliero
				const costoTrasferta = numeroGiorni * costoGiornaliero;

				// Inserisci il costo nella cella
				costoInput.value = costoTrasferta.toFixed(2);
				return costoTrasferta;
			}
			
			// Controlla se le date delle trasferte si sovrappongono
			function checkDateOverlap() {
				// Ottieni le date di inizio e fine della nuova trasferta
				const nuovaDataInizio = new Date(dataInizioInput.value);
				const nuovaDataFine = new Date(dataFineInput.value);

				// Scorre tutte le righe esistenti e controlla se c'è sovrapposizione
				const rows = tableBody.querySelectorAll("tr");
				for (const row of rows) {
					if (row.dataset.rowId !== newRow.dataset.rowId) {
						const dataInizio = new Date(row.querySelector("td[data-campo='dataInizio']").firstElementChild.value);
						const dataFine = new Date(row.querySelector("td[data-campo='dataFine']").firstElementChild.value);

						if (!(nuovaDataFine < dataInizio || nuovaDataInizio > dataFine)) {
							// Le date si sovrappongono
							return true;
						}
					}
				}

				// Nessuna sovrapposizione trovata
				return false;
			}

			// Funzione per aggiornare il totale del costo delle trasferte
			function updateTotalCost() {
				let totalCost = 0;
				const rows = tableBody.querySelectorAll("tr");

				rows.forEach((row) => {
					// Leggi il valore del costo dalla riga e aggiungilo al totale
					const costoCell = row.querySelector("td[data-campo='costoTrasferta'] input");
					if (costoCell) {
						const costo = parseFloat(costoCell.value);
						if (!isNaN(costo)) {
							totalCost += costo;
						}
					}
				});

				// Aggiorna il totale nel documento
				totaleCostoTrasferte.textContent = totalCost.toFixed(2) + " €";
			}

			// Funzione per aggiornare il totale dei giorni di trasferta
			function updateTotalGiorni(giorniEstera, giorniNazionale) {
				// Aggiorna il totale dei giorni totali
				const totalGiorni = giorniEstera + giorniNazionale;
				totaleGiorniTrasferta.textContent = totalGiorni;

				// Aggiorna il totale dei giorni esteri e nazionali
				totaleGiorniEstera.textContent = giorniEstera;
				totaleGiorniNazionale.textContent = giorniNazionale;
			}
		
			// Aggiungi eventi di cambio alle date e al flag trasferta estera
			dataInizioInput.addEventListener("change", calcolaGiorniTrasferta);
			dataFineInput.addEventListener("change", calcolaGiorniTrasferta);
			trasfertaEsteraInput.addEventListener("change", calcolaGiorniTrasferta);
			dataInizioInput.addEventListener("change", calcolaCostoTrasferta);
			dataFineInput.addEventListener("change", calcolaCostoTrasferta);
			trasfertaEsteraInput.addEventListener("change", calcolaCostoTrasferta);
			

			// Inizializza il numero dei giorni della trasferta
			calcolaGiorniTrasferta();
			// Inizializza il costo della trasferta
			calcolaCostoTrasferta();
						
			
        });



        // Funzione per calcolare il costo totale delle trasferte
        function updateTotalCost() {
            let totalCost = 0;
            const rows = tableBody.querySelectorAll("tr");

            rows.forEach((row) => {
                // Leggi il valore del costo dalla riga e aggiungilo al totale
                const costoCell = row.querySelector("td[data-campo='costoTrasferta']");
                if (costoCell) {
                    const costo = parseFloat(costoCell.textContent.replace("€", "").replace(",", "."));
                    if (!isNaN(costo)) {
                        totalCost += costo;
                    }
                }
            });

            // Aggiorna il totale nel documento
            totaleCostoTrasferte.textContent = totalCost.toFixed(2) + " €";
        }

        // Funzione per ottenere il giorno della settimana in italiano
        function getGiornoSettimanaItaliano(date) {
            const giorniSettimana = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
            return giorniSettimana[date.getDay()];
        }

        // Imposta il valore di default per il campo Mese-Anno
        const dataOdierna = new Date();
        const meseAnnoDefault = (dataOdierna.getMonth() === 0 ? 12 : dataOdierna.getMonth()) + "-" + dataOdierna.getFullYear();
        meseAnnoInput.value = meseAnnoDefault;
    });

