const display = document.getElementById('display');
const historyBtn = document.getElementById('historyBtn');

function appendNumber(number) {
    display.value += number;
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        if (display.value.includes('/0')) {
            throw new Error('Division par zéro interdite');
        }
        const result = eval(display.value);
        display.value = result;
        window.electronAPI.sendNotification('Calcul réussi !');
        window.electronAPI.saveHistory(display.value);
    } catch (error) {
        window.electronAPI.sendNotification('Erreur : ' + error.message);
    }
}

// Afficher historique
historyBtn.addEventListener('click', async () => {
    const history = await window.electronAPI.getHistory();
    alert('Historique:\n' + history.join('\n'));
});