//=============================== VARIABILI GLOBALI =====================================
// Inizializza una variabile per l'oggetto Missione
let missioni = [];
let rimborsiChilometrici = [];

let totali = [];
// Definisci una variabile JavaScript e assegna il tuo oggetto JSON ad essa
var configData = {
"descrizioneMissioni": [
  { "codice": "001", "descrizione": "Rimborso forfettario spese di trasferta ufficio cliente Kearney Roma. (Art. 51 comma 5 dpr 917/86)" },
  { "codice": "002", "descrizione": "Missione B" },
  // Altri elementi dell'array...
],
"trasferteDefault": [
	{ "giorno": 1, "partenza" : 1, "destinazione": 3, note: ""},
	{ "giorno": 1, "partenza" : 3, "destinazione": 2, note: ""},
	{ "giorno": 2, "partenza" : 2, "destinazione": 3, note: ""},
	{ "giorno": 2, "partenza" : 3, "destinazione": 2, note: ""},
	{ "giorno": 3, "partenza" : 2, "destinazione": 3, note: ""},
	{ "giorno": 3, "partenza" : 3, "destinazione": 2, note: ""},
	{ "giorno": 4, "partenza" : 2, "destinazione": 3, note: ""},
	{ "giorno": 4, "partenza" : 3, "destinazione": 2, note: ""},
	{ "giorno": 5, "partenza" : 2, "destinazione": 3, note: ""},
	{ "giorno": 5, "partenza" : 3, "destinazione": 1, note: ""}
  // Altri elementi dell'array...
],
"distanze": [
    { tratta: [1, 2], distanza: 256 },
    { tratta: [2, 3], distanza: 25 },
    { tratta: [1, 3], distanza: 271 }
    // ... altre tratte
]
// Altre proprietà dell'oggetto JSON...
};


// Variabile di sessione per gli indirizzi (esempio)
let indirizzi = [
    { id: 1, nome: "Casa Sestino", dettagli: { via: "Via Marche 37", cap: "52038", citta: "Sestino (AR)" } },
    { id: 2, nome: "Casa Monterotondo", dettagli: { via: "Via Dei Frati Minori 10", cap: "00015", citta: "Monterotondo (RM)" } },
    { id: 3, nome: "Kearney Roma", dettagli: { via: "Via Piemonte 127", cap: "00187", citta: "Roma" } }
    // ... altri indirizzi
];


// Variabile di sessione per le note (esempio)
let note = ["A/R", "Nota 2", ""];


//======================== Funzioni Globali ==================================

// Funzione per calcolare i totali e aggiornare la tabella dei totali
function aggiornaTotali() {
	let totalGiorniTrasferta = 0;
	let totalGiorniEstera = 0;
	let totalGiorniNazionale = 0;
	let totalCostoTrasferte = 0;
	let totalRimborsiKM = 0;

	missioni.forEach((missione) => {
		totalCostoTrasferte += parseFloat(missione.costo);
		totalGiorniTrasferta += parseInt(missione.numeroGiorni);

		if (missione.trasfertaEstera) {
			totalGiorniEstera += parseInt(missione.numeroGiorni);
		} else {
			totalGiorniNazionale += parseInt(missione.numeroGiorni);
		}
	});
	
	rimborsiChilometrici.forEach((rimborso) => {
        totalRimborsiKM += parseFloat(rimborso.rimborso); // Assumendo che ogni rimborso abbia un campo 'totale'
    });


	// Aggiorna i totali nella tabella dei totali
	document.getElementById("totaleCostoTrasferte").textContent = totalCostoTrasferte.toFixed(2) + " €";
	document.getElementById("totaleGiorniTrasferta").textContent = totalGiorniTrasferta;
	document.getElementById("totaleGiorniEstera").textContent = totalGiorniEstera;
	document.getElementById("totaleGiorniNazionale").textContent = totalGiorniNazionale;
	
	// Aggiorna i totali nella tabella dei rimborsi chilometrici
    document.getElementById("totaleRimborsiKM").textContent = totalRimborsiKM.toFixed(2) + " €";

    // Aggiorna il rimborso totale
    let rimborsoTotale = totalCostoTrasferte + totalRimborsiKM;
    document.getElementById("rimborsoTotale").value = rimborsoTotale.toFixed(2); // arrotonda a 2 decimali
}

function setMeseAnnoDefault(){
		// Ottieni la data corrente
	const dataCorrente = new Date();

	// Calcola il mese precedente
	const mesePrecedente = dataCorrente.getMonth() === 0 ? 12 : dataCorrente.getMonth();

	// Calcola l'anno corrente
	const annoCorrente = dataCorrente.getFullYear();

	// Formatta il mese e l'anno nel formato "yyyy-MM" per il valore predefinito
	const mesePrecedenteFormattato = mesePrecedente < 10 ? `0${mesePrecedente}` : `${mesePrecedente}`;
	const valorePredefinito = `${annoCorrente}-${mesePrecedenteFormattato}`;

	// Imposta il valore predefinito nell'input "periodo"
	document.getElementById("periodo").value = valorePredefinito;
}


// Funzione per ottenere il giorno della settimana in italiano
function getGiornoSettimanaItaliano(date) {
	const giorniSettimana = [
		"Domenica",
		"Lunedì",
		"Martedì",
		"Mercoledì",
		"Giovedì",
		"Venerdì",
		"Sabato",
	];
	return giorniSettimana[date.getDay()];
}



// Funzione per calcolare il costo totale delle trasferte
function updateTotalCost() {
	let totalCost = 0;
	let totalGiorniNazionale = 0;
	let totalGiorniEstera = 0;
	const tableBody = document.getElementById("trasferteTableBody");
	const rows = tableBody.querySelectorAll("tr");
	
	// Specifica il valore dell'attributo "name" che stai cercando
	const nomeAttributo = "costoMissione";

	// Trova tutti gli elementi con l'attributo "name" specifico
	const costiMissione = document.querySelectorAll(`[name="${nomeAttributo}"]`);

	// Crea un array per memorizzare i valori dei vari elementi
	const valoriAttributo = [];

	// Itera attraverso gli elementi e ottieni il valore dell'attributo "name"
	costiMissione.forEach(function(elemento) {
		const valoreAttributo = parseFloat(elemento.value);
		totalCost+=valoreAttributo;
		valoriAttributo.push(valoreAttributo);
	});
	const totaleCostoTrasferte = document.getElementById("totaleCostoTrasferte");
	// Aggiorna il totale nel documento
	totaleCostoTrasferte.textContent = totalCost.toFixed(2) + " €";
}

function updateCalculatedFields(){
	//aggiorna totali
	aggiornaCostoProvvisorio();
	aggiornaGiorniProvvisori();
	aggiornaMissioni();
	aggiornaTotali();
}



//==================================== MISSIONI ==========================================


// Calcolo dei giorni della trasferta
function calcolaGiorniTrasferta(dataInizio, dataFine) {
	// Calcola il numero di giorni tra la data di inizio e la data di fine
	const millisecondsInDay = 24 * 60 * 60 * 1000;
	const numeroGiorni = Math.round((dataFine - dataInizio) / millisecondsInDay) + 1;
	return numeroGiorni;
}



// Calcolo dei giorni della trasferta
function calcolaCostoTrasfertaParam(giornoIn, giornoFin, trasfertaEstera) {
	const dataFine = giornoFin;
	const dataInizio = giornoIn;
	const giorni = calcolaGiorniTrasferta(new Date(dataInizio), new Date(dataFine));

	let costoGiornaliero = parseFloat(document.getElementById("forfettarioNazionale").value);

	// Verifica se la trasferta è estera e imposta il costo giornaliero
	if (trasfertaEstera) {
		costoGiornaliero = parseFloat(document.getElementById("forfettarioEstero").value);
	}

	// Calcola il costo della trasferta in base al costo giornaliero
	const costoTrasferta = giorni * costoGiornaliero;

	return costoTrasferta;
}


// Funzione per aggiungere una nuova Missione all'oggetto e salvarlo nella sessione
function aggiungiMissione(id, dataInizio, giornoInizio, dataFine, giornoFine, descrizione, numeroGiorni, costo, trasfertaEstera) {

    // Crea un oggetto Missione con i dati
    const nuovaMissione = {
        id,
		dataInizio,
		giornoInizio,
		dataFine,
		giornoFine,
        descrizione,
        numeroGiorni,
        costo,
        trasfertaEstera
    };

    // Aggiungi la nuova Missione all'array delle Missioni
    missioni.push(nuovaMissione);

    // Salva l'array delle Missioni nella sessione
    sessionStorage.setItem('missioni', JSON.stringify(missioni));
    // Chiamate iniziali
    popolaMissioni();


}

// Funzione per calcolare il nuovo ID
function calcolaNuovoId() {
    // Trova il massimo ID tra le missioni esistenti
    const massimoId = missioni.reduce((maxId, missione) => {
        return Math.max(maxId, missione.id || 0);
    }, 0);

    // Restituisci il nuovo ID incrementato di 1
    return massimoId + 1;
}


function aggiornaMissioni() {
    // Recupera i nuovi valori dei costi forfettari
    const costoForfettarioNazionale = parseFloat(document.getElementById("forfettarioNazionale").value);
    const costoForfettarioEstero = parseFloat(document.getElementById("forfettarioEstero").value);

    // Itera su tutte le missioni e aggiorna i costi in base ai nuovi valori
    for (const missione of missioni) {
        const numeroGiorni = missione.numeroGiorni;
        let costo = 0;

        if (missione.trasfertaEstera) {
            costo = costoForfettarioEstero * numeroGiorni;
        } else {
            costo = costoForfettarioNazionale * numeroGiorni;
        }

        // Aggiorna il costo nella missione
        missione.costo = costo;
    }

    // Aggiorna tutte le righe della tabella
    const tableBody = document.getElementById("trasferteTableBody");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
        const id = parseInt(row.querySelector("td:first-child").textContent);
        const missione = missioni.find((m) => m.id === id);

        if (missione) {
            // Aggiorna i valori delle celle nella riga
            row.querySelector("td:nth-child(7)").textContent = missione.numeroGiorni;

            row.querySelector('input[data-field="costo"]').value = missione.costo.toFixed(2);

            // Aggiorna il checkbox "Trasferta Estera"
            const checkbox = row.querySelector("td:nth-child(9) input");
            checkbox.checked = missione.trasfertaEstera;
        }
    });

    // Aggiorna i totali
    updateTotalCost();
    updateTotalGiorni();
}

function aggiornaGiorniProvvisori(){
	const dataFine = document.getElementById("dataFine").value;
	const dataInizio = document.getElementById("dataInizio").value;
	document.getElementById("numeroGiorniMissioneTemp").value = calcolaGiorniTrasferta(new Date(dataInizio), new Date(dataFine))
}

function aggiornaCostoProvvisorio(){	
	document.getElementById("costoMissioneTemp").value = calcolaCostoTrasferta() + " €";
}

function updateCheckBoxMissioneEstera(){
	aggiornaCostoProvvisorio();
}

function updateMissionRow(id) {
    // Verifica se esiste una missione con l'ID specificato
    const missione = missioni.find((missione) => missione.id === id);

    if (missione) {
        // Ottieni la riga della tabella delle missioni corrispondente all'ID
        const row = document.querySelector(`#trasferteTableBody tr[data-id="${id}"]`);

        if (row) {
            // Ottieni i valori dai campi input della riga
            const dataInizioInput = row.querySelector('[data-field="dataInizio"]');
            const dataFineInput = row.querySelector('[data-field="dataFine"]');
            const esteroInput = row.querySelector('[data-field="trasfertaEstera"]');
            
            // Ottieni i valori dell'intestazione
            const forfettarioNazionale = parseFloat(document.getElementById("forfettarioNazionale").value);
            const forfettarioEstero = parseFloat(document.getElementById("forfettarioEstero").value);

            // Aggiorna i campi giornoinizio, giornofine, numero giorni e costo
            const dataInizio = new Date(dataInizioInput.value);
            const dataFine = new Date(dataFineInput.value);
            const giornoInizio = getGiornoSettimanaItaliano(dataInizio);
            const giornoFine = getGiornoSettimanaItaliano(dataFine);
            const numeroGiorni = calcolaGiorniTrasferta(dataInizio, dataFine);
            const estero = esteroInput.checked;
            let costo = estero ? forfettarioEstero * numeroGiorni : forfettarioNazionale * numeroGiorni;
            if (isNaN(costo)) costo = 0;


            // Aggiorna i valori nei campi della riga
            row.querySelector('[data-field="giornoInizio"]').textContent = giornoInizio;
            row.querySelector('[data-field="giornoFine"]').textContent = giornoFine;

            row.querySelector('[data-field="numeroGiorni"]').textContent = numeroGiorni;
            row.querySelector('[data-field="costo"]').value = costo.toFixed(2);

            // Aggiorna i dati nell'oggetto missioni
            missione.dataInizio = dataInizio;
            missione.dataFine = dataFine;
            missione.giornoInizio = giornoInizio;
            missione.giornoFine = giornoFine;
            missione.numeroGiorni = numeroGiorni;
            missione.costo = costo;
            missione.trasfertaEstera = estero;
        }

        // Aggiorna i totali		
        aggiornaMissioni();
        aggiornaTotali();
    }

}

// Funzione per aggiornare il totale dei giorni
function updateTotalGiorni() {
	const nomeAttributo = "numeroGiorni";

	// Trova tutti gli elementi con l'attributo "name" specifico
	const giorniMissione = document.querySelectorAll(`[name="${nomeAttributo}"]`);
	let totalGiorni = 0;
	let totaleGiorniE = 0;
	let totaleGiorniN = 0;
	giorniMissione.forEach(function (elemento) {
		const valoreAttributo = parseInt(elemento.value);
		const idElement = (elemento.id).split("_")[1]
		if((document.getElementById("trasfertaEstera_"+idElement)).checked)
			totaleGiorniE += valoreAttributo;
		else
			totaleGiorniN += valoreAttributo;
		totalGiorni += valoreAttributo;
	});

	// Aggiorna il totale nel documento
	document.getElementById("totaleGiorniTrasferta").textContent = totalGiorni;

	document.getElementById("totaleGiorniEstera").textContent = totaleGiorniE;
	document.getElementById("totaleGiorniNazionale").textContent = totaleGiorniN;
	
}

// Funzione per aggiungere una nuova riga alla tabella delle trasferte
	function aggiungiMissioneAllaTabella(id, dataInizio, giornoInizio, dataFine, giornoFine, descrizione, numeroGiorni, costo, trasfertaEstera) {
		// Seleziona la tabella e il corpo della tabella
		const table = document.getElementById("trasferteTable");
		const tableBody = document.getElementById("trasferteTableBody");

		// Crea una nuova riga (elemento <tr>)
		const newRow = document.createElement("tr");
		newRow.setAttribute("data-id", id);

		// Aggiungi le celle (elementi <td>) alla riga
		newRow.innerHTML = `
			<td>${id}</td>
			<td><input oninput="updateMissionRow(${id})" class="editable" data-id="${id}" data-field="dataInizio" type="date" value="${dataInizio}"></td>
			<td data-field="giornoInizio">${giornoInizio}</td>
			<td><input oninput="updateMissionRow(${id})" class="editable" data-id="${id}" data-field="dataFine" type="date" value="${dataFine}"></td>
			<td data-field="giornoFine">${giornoFine}</td>
			<td><select id="descMissioni${id}" oninput="updateMissionRow(${id})" class="editable-dropdown" data-id="${id}" data-field="descrizione" type="text" value="${descrizione}"></td>
			<td data-field="numeroGiorni">${numeroGiorni}</td>
			<td><input readonly class="editable" data-id="${id}" data-field="costo" type="number" step="0.01" value="${costo}"></td>
			<td><input oninput="updateMissionRow(${id})" class="editable" data-id="${id}" data-field="trasfertaEstera" type="checkbox" ${trasfertaEstera ? "checked" : ""}></td>
		`;
		
		

		// Aggiungi la riga al corpo della tabella
		tableBody.appendChild(newRow);

		// Aggiungi eventi di input alle celle editabili per gestire le modifiche
		const editableCells = newRow.querySelectorAll(".editable");
		editableCells.forEach((cell) => {
			cell.addEventListener("input", function () {
				const missionId = cell.getAttribute("data-id");
				const field = cell.getAttribute("data-field");
				const newValue = cell.value;

				// Aggiorna l'oggetto Missions con i nuovi valori
				aggiornaMissione(id, field, newValue);
				
			});
		});
		setDescrizioneMissioniDropDown("descMissioni"+id);
		aggiornaTotali();
	}

	// Funzione per aggiornare un campo specifico di una missione nell'oggetto Missions
	function aggiornaMissione(id, field, newValue) {
		const missione = missioni.find((missione) => missione.id === id);
		if (missione) {
			missione[field] = newValue;
		}
	}

//==================================== RIMBORSI KM ==========================================


// Funzione per popolare le tabelle con missioni di default
function popolaTabelleConRiborsiKM() {
  missioni.forEach(missione => {
        let dataInizio = new Date(missione.dataInizio);
	    let dataFine = new Date(missione.dataFine);
		while (dataInizio <= dataFine) {
		    let giornoInizio = dataInizio.getDay();
			let tratte = configData.trasferteDefault.filter(trasferta => trasferta.giorno === giornoInizio);
			tratte.forEach(tratta =>{
				// verificare se la data e' nel formato atteso
				aggiungiRimborsoKM(missione.id, formatYYYYMMDD(dataInizio), tratta.partenza, tratta.destinazione, tratta.note);
			});
		    dataInizio.setDate(dataInizio.getDate() + 1);
		}
        
    });
}

// Ridisegna la tabella dei rimborsi KM a partire dall'oggetto di sessione che ne contiene i valori
function aggiornaTabellaRimborsiKM(){
	let tableBody = document.getElementById("RKTableBody");
     while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }    
	rimborsiChilometrici.forEach(rimbrosoChilometrico =>{
		aggiungiRigaTabellaRimborsiKm(rimbrosoChilometrico);
	});
}

// Ridisegna la tabella dei rimborsi KM a partire dall'oggetto di sessione che ne contiene i valori
function aggiungiRigaTabellaRimborsiKm(rimborsoDaAggiungere){
    let tableBody = document.getElementById("RKTableBody");    
    const row = document.createElement("tr");

    row.id = "rimborsoKmRiga"+rimborsoDaAggiungere.id;
    row.insertCell(0).innerHTML = rimborsoDaAggiungere.idMissione;
    row.insertCell(1).innerHTML = rimborsoDaAggiungere.dataMissione;
    row.insertCell(2).innerHTML = getGiornoSettimanaItaliano(new Date(rimborsoDaAggiungere.dataMissione));
    row.insertCell(3).innerHTML = rimborsoDaAggiungere.partenza;
    row.insertCell(4).innerHTML = rimborsoDaAggiungere.arrivo;
    row.insertCell(5).innerHTML = rimborsoDaAggiungere.KM;
    row.insertCell(6).innerHTML = rimborsoDaAggiungere.note;
    row.insertCell(7).innerHTML = rimborsoDaAggiungere.rimborso;
    row.insertCell(8).innerHTML = `<td><button class="delete-row" onClick="deleteRow(${rimborsoDaAggiungere.id})">X</button></td>`;
	// Aggiungi la riga al corpo della tabella
	tableBody.appendChild(row);
}

// recupera la distanza (in KM con la virgola) tra due punti tra quelli censiti nel configFile a partire dagli id delle tratte
function recuperaDistanza(idPartenza, idArrivo){
	let trattaSelezionata = configData.distanze.find(d => (d.tratta.includes(parseInt(idPartenza)) && d.tratta.includes(parseInt(idArrivo))));
	console.log(parseFloat(trattaSelezionata.distanza));
	return parseFloat(trattaSelezionata.distanza);
}

function calcolaRimborsoChilometrico(chilometraggio){
	let tariffa = parseFloat(document.getElementById("tariffa").value); // valutare se sostituire con variabile di sessione
	return Math.ceil(parseFloat(tariffa*chilometraggio) * 100) / 100;
}


// Aggiunge un rimborsoKm alla variabile
// aggiorna la tabella dei rimborsi
function aggiungiRimborsoKM(idMissione, dataMissione, idPartenza, idArrivo, note){

	let partenzaObj = indirizzi.find(indirizzo => indirizzo.id == idPartenza);
	let arrivoObj = indirizzi.find(indirizzo => indirizzo.id == idArrivo);
	let partenzaIndirizzoCompleto = `${partenzaObj.dettagli.via}, ${partenzaObj.dettagli.citta}, ${partenzaObj.dettagli.cap}`;
	let arrivoIndirizzoCompleto = `${arrivoObj.dettagli.via}, ${arrivoObj.dettagli.citta}, ${arrivoObj.dettagli.cap}`;
	const idRow = getTrasferteKMId();
	let chilometraggio =  recuperaDistanza(idPartenza, idArrivo);

	let rimoborsoInEuro = calcolaRimborsoChilometrico(chilometraggio);
	// Aggiungi i valori alla variabile di sessione
    let rimborso = {
    	id: idRow,
        idMissione: idMissione,
        dataMissione: dataMissione,
        idPartenza: idPartenza,
        partenza: partenzaIndirizzoCompleto,
        idArrivo: idArrivo,
        arrivo: arrivoIndirizzoCompleto,
        note: note,
        KM: chilometraggio,
        rimborso: rimoborsoInEuro
    };
    rimborsiChilometrici.push(rimborso);
    aggiungiRigaTabellaRimborsiKm(rimborso);
    aggiornaTotali();
}

function aggiungiRimborsoChilometrico() {
    // Ottieni i valori dai campi di input
    let idMissione = document.getElementById("idMissioneRK").value;
    let dataMissione = document.getElementById("dataMissioneRK").value;
	let partenzaId = document.getElementById("partenza").value; // Assumendo che "partenza" sia l'ID del campo di input
	let arrivoId = document.getElementById("arrivo").value; // Assumendo che "arrivo" sia l'ID del campo di input
    let note = document.getElementById("noteRK").value;
	aggiungiRimborsoKM(idMissione, dataMissione, partenzaId, arrivoId, note);    
}

// Mantieni solo la funzione di aggiornamento delle etichette delle date
function updateDataLabel(inputId, labelId) {
    const inputData = document.getElementById(inputId);
    const inputDate = inputData.value;
    
    // Aggiorna l'etichetta della data con il giorno della settimana
    const labelElement = document.getElementById(labelId);
    labelElement.textContent = getGiornoSettimanaItaliano(new Date(inputDate));
}

function updateDataInizioLabel() {
    updateDataLabel("dataInizio", "giornoInizio");
	updateCalculatedFields();
}

function updateDataFineLabel() {
    updateDataLabel("dataFine", "giornoFine");
	updateCalculatedFields();
}


// Funzione per aggiungere uno zero davanti a numeri inferiori a 10 (per il formato "dd/mm/yyyy")
function aggiungiZero(numero) {
    return numero < 10 ? `0${numero}` : numero;
}

	
//============================== EVENTI ==========================================================
document.addEventListener("DOMContentLoaded", function () {
    const formMissioni = document.getElementById("formMissioni");
    const tableBody = document.getElementById("trasferteTableBody");
    const totaleCostoTrasferte = document.getElementById("totaleCostoTrasferte");
    const totaleGiorniTrasferta = document.getElementById("totaleGiorniTrasferta");
    const totaleGiorniEstera = document.getElementById("totaleGiorniEstera");
    const totaleGiorniNazionale = document.getElementById("totaleGiorniNazionale");

	
	const dataInizioInput = document.getElementById("dataInizio");
	dataInizioInput.addEventListener("input", updateDataInizioLabel);
	const dataFineInput = document.getElementById("dataFine");
	dataFineInput.addEventListener("input", updateDataFineLabel);
    
	let lastMissionId = 0; // Variabile per l'ID incrementale dell'ultima riga
    let dateRanges = []; // Array per memorizzare gli intervalli di date
	// Seleziona tutti i text box dell'intestazione
	const textInputs = document.querySelectorAll("#intestazione input[type='text']");
	// Aggiungi un gestore di eventi di input a ciascun text box
	textInputs.forEach(function (input) {
		input.addEventListener("input", function () {
			// Richiama la funzione di calcolo quando viene apportata una modifica
			calcolaRimborsi();
		});
	});
	setMeseAnnoDefault();
	setDescrizioneMissioniDropDown("descrizioneMissione");
	
	const navbar = document.querySelector('.navbar');

	navbar.addEventListener('mouseenter', () => {
		navbar.style.opacity = '1';
	});

	navbar.addEventListener('mouseleave', () => {
		navbar.style.opacity = '0';
	});
	
	// Aggiungi un event listener al bottone di salvataggio nella barra di navigazione
	const bottoneSalvaCSV = document.getElementById("salvaCsv");

	bottoneSalvaCSV.addEventListener("click", function () {
		
		 // Creazione di un oggetto Blob con il contenuto CSV
		 const blob = new Blob([serializzaIntestazioneToCSV(), serializzaMissioniToCSV(missioni), serializzaRimborsiChilometriciCSV(rimborsiChilometrici), serializzaTotaliToCSV(totali)], {
			// type: "text/csv;charset=utf-8",
		 });
		

		// Creazione di un oggetto URL per il Blob
		const url = window.URL.createObjectURL(blob);

		// Creazione di un elemento <a> per il download del file
		const downloadLink = document.createElement("a");
		downloadLink.href = url;

		// Generazione del nome del file
		const dataOdierna = new Date();
		const anno = dataOdierna.getFullYear();
		const mese = (dataOdierna.getMonth() + 1).toString().padStart(2, "0");
		const nomeFileDefault = `${anno}${mese}_rimborsi.csv`;

		// Assegnazione del nome di default per il download
		downloadLink.download = nomeFileDefault;

		// Aggiungi l'elemento <a> al documento e triggera il clic
		document.body.appendChild(downloadLink);
		downloadLink.click();

		// Rimuovi l'elemento <a> dopo il download (opzionale)
		document.body.removeChild(downloadLink);

		// Rilascio dell'URL del Blob
		window.URL.revokeObjectURL(url);
	});
	
	
	
	// Seleziona il bottone di caricamento e l'input file
	const caricaSalvataggioButton = document.getElementById("caricaSalvataggio");
	const fileInput = document.getElementById("fileInput");

	// Aggiungi un gestore di eventi al bottone
	caricaSalvataggioButton.addEventListener("click", function () {
		fileInput.click(); // Triggera il clic sull'input file nascosto
	});

	// Aggiungi un gestore di eventi all'input file
	fileInput.addEventListener("change", function (event) {
		const selectedFile = event.target.files[0]; // Ottieni il file selezionato
		if (selectedFile) {
			// Leggi il contenuto del file come testo
			const fileReader = new FileReader();
			fileReader.onload = function (e) {
				const csvData = e.target.result;
				// Ora hai il contenuto del file CSV in "csvData"
				// Puoi gestire il caricamento dei dati qui o chiamare una funzione per farlo
				// Ad esempio, puoi utilizzare una libreria come Papaparse per analizzare il CSV.
			};
			fileReader.readAsText(selectedFile);
		}
	});
	
	// Calcolo dei giorni della trasferta
	function calcolaCostoTrasferta() {	 
		const giornoFIn = document.getElementById("dataFine").value;
		const giornoIN = document.getElementById("dataInizio").value;
		return calcolaCostoTrasfertaParam(giornoIN, giornoFIn, document.getElementById("trasfertaEstera").checked);
	}
	
	function generateUniqueId(col, rowId) {
		return col + "_" + rowId;
	}
	
	function calcolaRimborsi() {
			// Ottieni i valori dai text box dell'intestazione
			const nome = document.getElementById("nome").value;
			const periodo = document.getElementById("periodo").value;
			const veicolo = document.getElementById("veicolo").value;
			const tariffaACI = parseFloat(document.getElementById("tariffa").value.replace("€", "").replace(",", "."));

			// Calcola il rimborso totale
			let rimborsoTotale = 0; // Inizializza il rimborso totale a zero

			// Aggiungi qui la logica per calcolare il rimborso totale in base alle tue specifiche
			// Puoi utilizzare i valori ottenuti sopra (nome, periodo, veicolo, tariffaACI) per i calcoli
			//calcolaCostoTrasferta();
			//updateTotalCost();
			// Aggiorna il campo "Rimborso Totale" nell'intestazione
			document.getElementById("rimborsoTotale").value = rimborsoTotale.toFixed(2) + " €";
	}
	
	formMissioni.addEventListener("submit", function(event) {
		event.preventDefault(); // Impedisce l'invio predefinito del modulo
		const id = calcolaNuovoId(); 
		const dataInizio = document.getElementById("dataInizio").value; // Inizializza dataInizio come un oggetto Data con la data corrente
		const giornoInizio = getGiornoSettimanaItaliano(new Date(dataInizio)); // Inizializza giornoInizio come una stringa vuota
		const dataFine = document.getElementById("dataFine").value; // Inizializza dataFine come un oggetto Data con la data corrente
		const giornoFine = getGiornoSettimanaItaliano(new Date(dataFine)); // Inizializza giornoFine come una stringa vuota
		const descrizione = document.getElementById("descrizioneMissione").text; // Inizializza descrizione come una stringa vuota
		const numeroGiorni = calcolaGiorniTrasferta(new Date(dataInizio),new Date(dataFine)); // Inizializza numeroGiorni come 0 (zero)		
		const trasfertaEstera = document.getElementById("trasfertaEstera").checked; // Inizializza trasfertaEstera come false (booleano falso)
		let costo = calcolaCostoTrasferta();
		aggiungiMissione(id, dataInizio, giornoInizio, dataFine, giornoFine, descrizione, numeroGiorni, costo, trasfertaEstera);
		aggiungiMissioneAllaTabella(id, dataInizio, giornoInizio, dataFine, giornoFine, descrizione, numeroGiorni, costo, trasfertaEstera);
		formMissioni.reset();
	});
	

	
	// Chiamate iniziali
	popolaIndirizzi("partenza");
	popolaIndirizzi("arrivo");
	popolaNote();

});


function serializzaIntestazioneToCSV(){

}


function serializzaTotaliToCSV(){}

function serializzaRimborsiChilometriciCSV(){
	const header = ["ID", "id Missione", "Data", "Giorno", "Partenza", "Destinazione", "Km", "Note","RImborso Chilometrico (€)"];
    const rows = rimborsiChilometrici.map((rimborso) => [
        rimborso.id,
        rimborso.idMissione,
		rimborso.dataMissione,
		getGiornoSettimanaItaliano(new Date(rimborso.dataMissione)),
		rimborso.partenza,
		rimborso.arrivo,
		rimborso.KM,
		rimborso.note,
		rimborso.rimborso,

    ]);

    rows.unshift(header); // Aggiungi l'intestazione come prima riga

    let csvContent = "";
    
    // Genera il contenuto CSV
    rows.forEach((row) => {
        csvContent += row.map(quoteCSVValue).join(",") + "\n";
    });

    // Crea un blob con il contenuto CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    return blob;
}

function serializzaMissioniToCSV(missioni) {
    const header = ["ID", "Data Inizio", "Giorno Inizio", "Data Fine", "Giorno Fine", "Descrizione", "Numero Giorni", "Costo Trasferta (€)", "Trasferta Estera"];
    const rows = missioni.map((missione) => [
        missione.id,
        missione.dataInizio,
        missione.giornoInizio,
        missione.dataFine,
        missione.giornoFine,
        missione.descrizione,
        missione.numeroGiorni,
        missione.costo,
        missione.trasfertaEstera ? "Sì" : "No",
    ]);

    rows.unshift(header); // Aggiungi l'intestazione come prima riga

    let csvContent = "";
    
    // Genera il contenuto CSV
    rows.forEach((row) => {
        csvContent += row.map(quoteCSVValue).join(",") + "\n";
    });

    // Crea un blob con il contenuto CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    return blob;
}

function quoteCSVValue(value) {
    if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
    } else if (typeof value === 'number') {
        return value.toString();
    } else if (typeof value === 'boolean') {
        return value ? "Sì" : "No";
    } else if (value instanceof Date) {
        return value.toLocaleDateString('it-IT'); // Formatta la data come stringa
    } else {
        return ''; // Tratta altri tipi come stringa vuota
    }
}

function esportaMissioniInCSV() {
    const blob = serializzaMissioniToCSV(missioni);

    // Crea un URL per il blob e crea un link per il download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
	
	// Generazione del nome del file
    const dataOdierna = new Date();
    const anno = dataOdierna.getFullYear();
    const mese = (dataOdierna.getMonth() + 1).toString().padStart(2, "0");
    const nomeFileDefault = `${anno}${mese}_rimborsi.csv`;
    a.download = nomeFileDefault; // Imposta il nome del file CSV
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

function setDescrizioneMissioniDropDown(id){
	// Ottenere il riferimento all'elemento select
	var selectDescrizioneMissione = document.getElementById(id);

	// Ottenere l'array di descrizioni delle missioni dal tuo oggetto JSON
	var descrizioniMissioni = configData.descrizioneMissioni;

	// Iterare attraverso l'array e creare dinamicamente gli elementi option
	descrizioniMissioni.forEach(function(missione) {
	  var option = document.createElement("option");
	  option.value = missione.codice; // Valore da inviare al server (se necessario)
	  option.text = missione.descrizione; // Testo da visualizzare nell'opzione
	  selectDescrizioneMissione.appendChild(option); // Aggiungi l'opzione al select
	});
}



// Funzione per popolare il dropdown delle missioni
function popolaMissioni() {
    let select = document.getElementById("idMissioneRK");
    select.innerHTML = ""; // Pulisci le opzioni esistenti
    // Crea un nuovo elemento opzione
	var eoption = document.createElement("option");

	// Imposta il testo e il valore per l'opzione "Nessuna selezione"
	eoption.text = "seleziona missione";
	eoption.value = "";

	// Aggiungi l'opzione al campo select
	select.add(eoption, select.options[0]);
    missioni.forEach(missione => {
        let option = document.createElement("option");
        option.value = missione.id;
        option.textContent = "Missione " + missione.id;
        select.appendChild(option);
    });
}

// Funzione per popolare il dropdown delle date
function popolaDate() {
    let select = document.getElementById("dataMissioneRK");
    select.innerHTML = "";

	// Crea un nuovo elemento opzione
	var option = document.createElement("option");

	// Imposta il testo e il valore per l'opzione "Nessuna selezione"
	option.text = "seleziona data";
	option.value = "";

	// Aggiungi l'opzione al campo select
	select.add(option, select.options[0]);
    let idMissioneSelezionata = document.getElementById("idMissioneRK").value;
    let missione = missioni.find(m => m.id == idMissioneSelezionata);
    let dataInizio = new Date(missione.dataInizio);
    let dataFine = new Date(missione.dataFine);
    while (dataInizio <= dataFine) {
        let option = document.createElement("option");
        option.value = dataInizio.toISOString().split("T")[0];
        option.textContent = dataInizio.toISOString().split("T")[0];
        select.appendChild(option);
        dataInizio.setDate(dataInizio.getDate() + 1);
    }
}

// Funzione per popolare il dropdown degli indirizzi
function popolaIndirizzi(idSelect) {
    let select = document.getElementById(idSelect);
    indirizzi.forEach(indirizzo => {
        let option = document.createElement("option");
        option.value = indirizzo.id;
        option.textContent = indirizzo.nome;
        select.appendChild(option);
    });
}

// Funzione per popolare il dropdown delle note
function popolaNote() {
    let select = document.getElementById("noteRK");
    note.forEach(nota => {
        let option = document.createElement("option");
        option.value = nota;
        option.textContent = nota;
        select.appendChild(option);
    });
}

// Funzione per calcolare la distanza
function calcolaDistanza() {
    let partenza = document.getElementById("partenza").value;
    let arrivo = document.getElementById("arrivo").value;
    let trattaSelezionata = configData.distanze.find(d => (d.tratta.includes(parseInt(partenza)) && d.tratta.includes(parseInt(arrivo))));
    if (trattaSelezionata) {
        document.getElementById("tempKM").value = trattaSelezionata.distanza;
    }
}

// Funzione per calcolare il rimborso
function calcolaRimborso() {
    let tariffa = parseFloat(document.getElementById("tariffa").value);
    let km = parseFloat(document.getElementById("tempKM").value);
    document.getElementById("rimborsoKMtmp").value = tariffa * km;
}

function aggiornaDate() {
    let idMissioneSelezionata = document.getElementById("idMissioneRK").value;
    let missione = missioni.find(m => m.id == idMissioneSelezionata);
    if (missione) {
       popolaDate();
    }
}

function aggiornaDistanza() {
    calcolaDistanza();
    calcolaRimborso();
}

function mostraInputNote() {
    let select = document.getElementById("noteRK");
    let input = document.getElementById("inputNote");
    
    if (select.value) {
        input.value = select.value;
        input.style.display = "block";
        input.focus();
    } else {
        input.style.display = "none";
    }
}

function aggiornaNota() {
    let select = document.getElementById("noteRK");
    let input = document.getElementById("inputNote");
    
    let notaSelezionata = select.options[select.selectedIndex];
    notaSelezionata.text = input.value;
    notaSelezionata.value = input.value;
    
    input.style.display = "none";
}

function aggiungiRimborsoChilometrico() {
    // Ottieni i valori dai campi di input
    let idMissione = document.getElementById("idMissioneRK").value;
    let dataMissione = document.getElementById("dataMissioneRK").value;
	let partenzaId = document.getElementById("partenza").value; // Assumendo che "partenza" sia l'ID del campo di input
	let arrivoId = document.getElementById("arrivo").value; // Assumendo che "arrivo" sia l'ID del campo di input

	let partenzaObj = indirizzi.find(indirizzo => indirizzo.id == partenzaId);
	let arrivoObj = indirizzi.find(indirizzo => indirizzo.id == arrivoId);

	let partenzaIndirizzoCompleto = `${partenzaObj.dettagli.via}, ${partenzaObj.dettagli.citta}, ${partenzaObj.dettagli.cap}`;
	let arrivoIndirizzoCompleto = `${arrivoObj.dettagli.via}, ${arrivoObj.dettagli.citta}, ${arrivoObj.dettagli.cap}`;

    let note = document.getElementById("noteRK").value;
    let tempKM = document.getElementById("tempKM").value;
    let rimborsoKMtmp = document.getElementById("rimborsoKMtmp").value;
    


    // Aggiungi i valori alla tabella

    let tableBody = document.getElementById("RKTableBody");
    
	
    
    const row = document.createElement("tr");
    const idRow = getTrasferteKMId();
    row.id= "rimborsoKmRiga"+idRow;
    row.insertCell(0).innerHTML = idMissione;
    row.insertCell(1).innerHTML = dataMissione;
    row.insertCell(2).innerHTML = getGiornoSettimanaItaliano(new Date(dataMissione));
    row.insertCell(3).innerHTML = partenzaIndirizzoCompleto;
    row.insertCell(4).innerHTML = arrivoIndirizzoCompleto;
    row.insertCell(5).innerHTML = tempKM;
    row.insertCell(6).innerHTML = note;
    row.insertCell(7).innerHTML = rimborsoKMtmp;
    row.insertCell(8).innerHTML = `<td><button class="delete-row" onClick="deleteRow(${idRow})">X</button></td>`;

		
		

		// Aggiungi la riga al corpo della tabella
		tableBody.appendChild(row);

    // Aggiungi i valori alla variabile di sessione
    let rimborso = {
    	id: idRow,
        idMissione: idMissione,
        dataMissione: dataMissione,
        partenza: partenzaIndirizzoCompleto,
        arrivo: arrivoIndirizzoCompleto,
        note: note,
        KM: tempKM,
        rimborso: rimborsoKMtmp
    };
    rimborsiChilometrici.push(rimborso);
    aggiornaTotali();
}

// genera il prossimo id della lista dei rimborsi chilometrici
function getTrasferteKMId(){
	// Inizializza una variabile per tenere traccia dell'id massimo
	let idMassimo = -1; // Inizializzalo a un valore basso

	// Itera attraverso gli oggetti nell'array
	for (const oggetto of rimborsiChilometrici) {
	  // Converte l'id in un numero (potrebbe essere una stringa)
	  const idNumero = parseInt(oggetto.id, 10);

	  // Verifica se l'id è maggiore dell'attuale id massimo
	  if (!isNaN(idNumero) && idNumero > idMassimo) {
		idMassimo = idNumero;
	  }
	}

	return idMassimo;
	

}

function deleteRow(id){

	// Suppose you have the ID of the row you want to delete
	const rowIdToDelete = "rimborsoKmRiga"+id; // Replace with the actual ID you want to delete

	// Get the row element by its ID
	const rowToDelete = document.getElementById(rowIdToDelete);

	// Check if the row element exists before attempting to delete it
	if (rowToDelete) {
	  // Use the parentElement property to access the <tbody> or <table> element
	  const parentElement = rowToDelete.parentElement;

	  // Remove the row from the DOM
	  parentElement.removeChild(rowToDelete);
	} else {
	  console.log("Row not found with ID: " + rowIdToDelete);
	}
	
	
	eliminaOggettoPerID(rimborsiChilometrici, id);
	aggiornaTotali();
}

function eliminaOggettoPerID(array, idDaEliminare) {
  // Cerca l'indice dell'oggetto con l'ID specificato nell'array
  const indiceDaEliminare = array.findIndex(oggetto => oggetto.id === idDaEliminare);

  // Verifica se l'indice è valido (-1 indica che l'elemento non è stato trovato)
  if (indiceDaEliminare !== -1) {
    // Utilizza splice per rimuovere l'oggetto dall'array
    array.splice(indiceDaEliminare, 1);
  }
}

function calcolaMissione(startDay, endDay){
	const id = calcolaNuovoId(); 
	const dataInizio = startDay; 
	const giornoInizio = getGiornoSettimanaItaliano(new Date(dataInizio)); // Inizializza giornoInizio come una stringa vuota
	const dataFine = endDay; // Inizializza dataFine come un oggetto Data con la data corrente
	const giornoFine = getGiornoSettimanaItaliano(new Date(dataFine)); // Inizializza giornoFine come una stringa vuota
	const descrizione = configData[0]; // Inizializza descrizione come una stringa vuota
	const numeroGiorni = calcolaGiorniTrasferta(new Date(dataInizio),new Date(dataFine)); // Inizializza numeroGiorni come 0 (zero)		
	const trasfertaEstera = false; // Inizializza trasfertaEstera come false (booleano falso)
	let costo = calcolaCostoTrasfertaParam(dataInizio, giornoFine, trasfertaEstera);
	aggiungiMissione(id, dataInizio, giornoInizio, dataFine, giornoFine, descrizione, numeroGiorni, costo, trasfertaEstera);
	aggiungiMissioneAllaTabella(id, dataInizio, giornoInizio, dataFine, giornoFine, descrizione, numeroGiorni, costo, trasfertaEstera);
}
 
 
function popolazioneAutomatica(){
	popolaTabelleConMissioni();
	popolaTabelleConRiborsiKM();
	// Aggiorna i totali		
	aggiornaMissioni();
	aggiornaTotali();
} 
// Funzione per popolare le tabelle con missioni di default
function popolaTabelleConMissioni() {
  // Ottieni il periodo selezionato
  const periodoInput = document.getElementById('periodo');
  const periodoValue = periodoInput.value; // Assume che il valore sia nel formato "yyyy-mm"

  // Divide il periodo in anno e mese
  const [anno, mese] = periodoValue.split('-');

  // Ottieni il numero di giorni nel mese
  const giorniNelMese = new Date(anno, mese, 0).getDate();

  // Inizia a popolare le tabelle
  for (let giorno = 1; giorno <= giorniNelMese; giorno++) {
    const data = new Date(anno, mese - 1, giorno);
    const giornoSettimana = data.getDay(); // 0 = Domenica, 1 = Lunedì, ..., 6 = Sabato

    // Se il giorno è un lunedì (1) o un venerdì (5), aggiungi una missione
    if (giornoSettimana === 1) {
      // Crea la stringa nel formato "yyyy-mm-dd"
      const giornoFormat = data.getDate().toString().padStart(2, '0');
	const dataIn = `${anno}-${mese}-${giornoFormat}`;
      
	  calcolaMissione(dataIn, prossimoVenerdiOUltimoGiornoDelMese(dataIn));
      
    }
  }
}

function formatYYYYMMDD(dateIn){
	const anno = dateIn.getFullYear();
  	const mese = dateIn.getMonth();
  	const annoFormat = anno.toString();
  	const meseFormat = (mese + 1).toString().padStart(2, '0');
  	const giornoFormat = dateIn.getDate().toString().padStart(2, '0');
	return `${annoFormat}-${meseFormat}-${giornoFormat}`;

}


function prossimoVenerdiOUltimoGiornoDelMese(dataInput) {
  // Clona la data di input per non modificarla direttamente
  const data = new Date(dataInput);

  // Trova il giorno corrente della settimana (0 = Domenica, 1 = Lunedì, ..., 6 = Sabato)
  const giornoSettimana = data.getDay();

  // Calcola il numero di giorni rimanenti nel mese
  const anno = data.getFullYear();
  const mese = data.getMonth();
  const giorniNelMese = new Date(anno, mese + 1, 0).getDate();
  const giorniRimanenti = giorniNelMese - data.getDate();

  // Calcola il numero di giorni necessari per raggiungere il prossimo venerdì
  const giorniDaVenerdi = (5 - giornoSettimana + 7) % 7;
  data.setDate(data.getDate() + giorniDaVenerdi);
 
  // Formatta la data nel formato "yyyy-mm-dd"
  const annoFormat = anno.toString();
  const meseFormat = (mese + 1).toString().padStart(2, '0');
  const giornoFormat = data.getDate().toString().padStart(2, '0');

  return `${annoFormat}-${meseFormat}-${giornoFormat}`;
}


