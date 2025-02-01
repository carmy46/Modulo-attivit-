document.getElementById('data').addEventListener('change', function(e) {
    const data = new Date(this.value);
    const giorno = String(data.getDate()).padStart(2, '0');
    const mese = String(data.getMonth() + 1).padStart(2, '0');
    const anno = data.getFullYear();
    
    // Aggiorna il valore visualizzato
    this.dataset.formattedDate = `${giorno}/${mese}/${anno}`;
});

function handleSelectChange(selectElement, customInputId) {
    const customInput = document.getElementById(customInputId);
    if (selectElement.value === 'custom') {
        customInput.classList.remove('hidden');
        customInput.required = true;
        selectElement.required = false;
    } else {
        customInput.classList.add('hidden');
        customInput.required = false;
        selectElement.required = true;
    }
}

document.getElementById('activityForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Mostra l'indicatore di caricamento immediatamente
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Invio in corso...';
    button.disabled = true;

    const getValue = (selectId, customId) => {
        const select = document.getElementById(selectId);
        return select.value === 'custom' ? document.getElementById(customId).value : select.value;
    };
    
    const formData = {
        nome: getValue('nome', 'nomeCustom'),
        data: document.getElementById('data').value,
        luogo: getValue('luogo', 'luogoCustom'),
        tempo: getValue('tempo', 'tempoCustom'),
        attivita: getValue('attivita', 'attivitaCustom'),
        note: document.getElementById('note').value || ''
    };

    try {
        // Creiamo un form nascosto e un iframe per l'invio
        const form = document.createElement('form');
        const input = document.createElement('input');
        const iframe = document.createElement('iframe');
        
        form.method = 'POST';
        form.action = 'https://script.google.com/macros/s/AKfycbyu3HLgdmlMEF3pB67KMahxrKqyFqNrmim-hQwnOyEcHE_lmoKIfLXlKRQqZZswxXiu/exec';
        form.target = 'hidden-iframe';
        
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(formData);
        
        // Configura l'iframe 
        iframe.name = 'hidden-iframe';
        iframe.style.display = 'none';
        
        form.appendChild(input);
        document.body.appendChild(form);
        document.body.appendChild(iframe);
        
        // Invia i dati
        form.submit();
        
        // Reset del form e UI updates
        document.getElementById('activityForm').reset();
        
        // Nascondi i campi personalizzati
        document.querySelectorAll('.custom-input').forEach(input => {
            input.classList.add('hidden');
            input.required = false;
        });
        
        // Reimposta i select
        document.querySelectorAll('select').forEach(select => select.required = true);

        // Ripristina il pulsante
        button.textContent = originalText;
        button.disabled = false;

        // Mostra il toast di successo
        const toast = document.createElement('div');
        toast.textContent = '✅ Dati inviati con successo!';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1000;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
            // Rimuovi il form nascosto e l'iframe
            document.body.removeChild(form);
            document.body.removeChild(iframe);
        }, 3000);

    } catch (error) {
        console.error('Errore:', error);
        button.textContent = originalText;
        button.disabled = false;
        
        // Mostra il toast di errore
        const toast = document.createElement('div');
        toast.textContent = '❌ Errore durante l\'invio';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f44336;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1000;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}); 