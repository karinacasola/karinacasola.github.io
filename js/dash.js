document.addEventListener('DOMContentLoaded', () => {
    
    // Verificação de Segurança para o Chart.js
    if (typeof Chart === 'undefined') {
        console.error("Chart.js não carregado.");
        return;
    }

    // Cores e Fontes Globais do Chart.js ajustadas para o Dark Mode
    Chart.defaults.color = '#A0A0A0';
    Chart.defaults.font.family = 'Satoshi, sans-serif';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;

    // 1. Gráfico de Consumo (Barras)
    const canvasEnergy = document.getElementById('energyChart');
    if (canvasEnergy) {
        new Chart(canvasEnergy.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Energia (kWh)',
                    data: [38, 42, 45, 41, 43, 28, 30],
                    backgroundColor: 'rgba(62, 142, 255, 0.8)', // Azul do seu Blog
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { 
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' }, 
                        title: { display: true, text: 'kWh', color: '#A0A0A0' } 
                    }
                }
            }
        });
    }

    // 2. Gráfico DLI (Linhas)
    const canvasDLI = document.getElementById('dliChart');
    if (canvasDLI) {
        new Chart(canvasDLI.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [
                    { 
                        label: 'Zona A', 
                        data: [15.2, 16.1, 14.8, 15.5, 15.9, 12.3, 14.1], 
                        borderColor: '#3E8EFF', 
                        backgroundColor: 'rgba(62, 142, 255, 0.1)',
                        fill: true,
                        tension: 0.4, // Deixa a linha suave/arredondada
                        pointBackgroundColor: '#3E8EFF',
                        pointRadius: 4
                    },
                    { 
                        label: 'Meta DLI', 
                        data: [17, 17, 17, 17, 17, 17, 17], 
                        borderColor: '#A0A0A0', 
                        borderDash: [5, 5], 
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top', align: 'end' }
                },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { 
                        min: 10, // Melhora a visão flutuante do gráfico
                        grid: { color: 'rgba(255,255,255,0.05)' }, 
                        title: { display: true, text: 'mol/m²/d', color: '#A0A0A0' } 
                    }
                }
            }
        });
    }
});