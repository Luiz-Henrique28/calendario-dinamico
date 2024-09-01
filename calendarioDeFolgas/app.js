const ano = new Date().getFullYear()
const mes = new Date().getMonth()
const dataPrimeiroDia = localStorage.getItem('data')

let campoPrimeiroDiaAposFolga = document.getElementById('firstDayInput');

function obterDiasDoMes(mes) {
    return new Date(ano, mes, 0).getDate();
}

function obterDiasDaSemana(dia, mes){
    let data = new Date(ano, mes, dia).getDay()
    switch(data){
        case 0:
            return "domingo"
        case 1:
            return "segunda"
        case 2:
            return "terça"
        case 3:
            return "quarta"
        case 4:
            return "quinta"
        case 5:
            return "sexta"
        case 6:
            return "sábado"
    }
}

function obterDiasDoMes(ano, mes) {
    return new Date(ano, mes + 1, 0).getDate();  // Dias no mês
}

function obterNomeDoMes(mes) {
    const data = new Date();
    data.setMonth(mes);
    return data.toLocaleString('pt-BR', { month: 'long' });
}

function obterPrimeiroDiaAposFolga() {
    let primeiroDiaAposFolga = campoPrimeiroDiaAposFolga.value;
    if(primeiroDiaAposFolga != ""){
        localStorage.setItem('data', primeiroDiaAposFolga)
        let ciclo = calcularCicloNoAno(primeiroDiaAposFolga);
        gerarCalendario(mes, ano, ciclo);
    } 
    return primeiroDiaAposFolga;
}

function calcularCicloNoAno(primeiroDiaDeCiclo) {
    let cicloTotal = 6;  // 4 dias de trabalho + 2 dias de folga
    let trabalhoDias = 4;  // 4 primeiros dias do ciclo são trabalho
    let dataInicio = new Date(primeiroDiaDeCiclo);  // Data de início do ciclo

    const cicloDias = [];

    for (let i = 0; i < 12; i++) {
        for (let j = 1; j <= obterDiasDoMes(ano, i); j++) {

            let dataAtual = new Date(ano, i, j);
            let diasPassados = Math.floor((dataAtual - dataInicio) / (1000 * 60 * 60 * 24));
            let cicloAtual = ((diasPassados % cicloTotal) + cicloTotal) % cicloTotal;

            cicloDias[i] = cicloDias[i] || [];
            cicloDias[i][j] = (cicloAtual < trabalhoDias) ? "trabalho" : "folga"
        }
    }

    return cicloDias
}

function gerarCalendario(mes, ano, cicloDias) {
    const calendarBody = document.getElementById("calendar-body");
    document.querySelector('.calendar h3').innerHTML = obterNomeDoMes(mes)
    calendarBody.innerHTML = "";

    const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();  // Primeiro dia da semana no mês
    const diasNoMes = obterDiasDoMes(ano, mes);  // Número de dias no mês

    let data = 1;
    for (let i = 0; i < 6; i++) {  // linhas de semana 
        let row = document.createElement("tr");

        // Preenche cada dia da semana
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < primeiroDiaDoMes) {
                let cell = document.createElement("td");
                cell.appendChild(document.createTextNode(""));
                row.appendChild(cell);
            } else if (data > diasNoMes) {
                break;
            } else {
                let cell = document.createElement("td");
                cell.appendChild(document.createTextNode(data));
                cell.classList.add("fw-bold")

                if(cicloDias[mes][data] === "trabalho") cell.classList.add("text-danger")
                else cell.classList.add("text-success")

                row.appendChild(cell);
                data++;
            }
        }
        calendarBody.appendChild(row);
    }
}


function obterIndiceDoMes(nomeDoMes) {
    const nomesDosMeses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    return nomesDosMeses.indexOf(nomeDoMes);
}


function passarParaEsquerda(){
    let nomeDoMes = document.getElementById('mes').innerText
    let indexDoMesAtual = obterIndiceDoMes(nomeDoMes) - 1

    if(indexDoMesAtual >= 0){
        let ciclo = calcularCicloNoAno(dataPrimeiroDia);
        gerarCalendario(indexDoMesAtual, ano, ciclo);
    }
}

function passarParaDireita(){
    let nomeDoMes = document.getElementById('mes').innerText
    let indexDoMesAtual = obterIndiceDoMes(nomeDoMes) + 1
    
    if(indexDoMesAtual <= 11){
        let ciclo = calcularCicloNoAno(dataPrimeiroDia);
        gerarCalendario(indexDoMesAtual, ano, ciclo);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (dataPrimeiroDia) {
        campoPrimeiroDiaAposFolga.value = dataPrimeiroDia
        let ciclo = calcularCicloNoAno(dataPrimeiroDia);
        gerarCalendario(mes, ano, ciclo);
    }
})