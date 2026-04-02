const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        // --- Estado Inicial ---
        const stats = ref({
            quality: 70,     // Saúde do código
            docs: 50,        // Documentação disponível
            tests: 50,       // Cobertura de testes
            maintenance: 80  // Facilidade de manutenção
        });
        
        const day = ref(1);
        const maxDays = ref(20); // Meta: Lançar a versão 1.0 no dia 20
        
        const gameActive = ref(true);
        const gameWon = ref(false);
        const gameOverReason = ref("");
        const lastActionExplanation = ref("");
        const logs = ref([]);

        // --- Computeds ---
        const finalScore = computed(() => {
            const avgStats = (stats.value.quality + stats.value.docs + stats.value.tests + stats.value.maintenance) / 4;
            const dayBonus = day.value * 15;
            return Math.floor(avgStats * 6 + dayBonus);
        });
        
        const getLowestStat = () => {
            let keys = Object.keys(stats.value);
            let minKey = keys[0];
            let minVal = stats.value[keys[0]];
            keys.forEach(key => {
                if (stats.value[key] < minVal) {
                    minVal = stats.value[key];
                    minKey = key;
                }
            });
            return { key: minKey, val: minVal };
        };

        const advisorTip = computed(() => {
            if (!gameActive.value) return "Simulação finalizada. Verifique o relatório.";

            const lowest = getLowestStat();
            
            if (day.value >= maxDays.value - 3) {
                return "Estamos na reta final (Release Candidate)! Mantenha todos os status acima de 30% para o lançamento.";
            }

            if (lowest.val <= 40) {
                switch(lowest.key) {
                    case 'quality': 
                        return "⚠️ ALERTA: O código está 'espaguete'. A equipe está demorando para entender a lógica. Refatore agora!";
                    case 'docs': 
                        return "⚠️ ALERTA: 'Bus Factor' crítico. Se um desenvolvedor sair, o conhecimento se perde. Escreva documentação!";
                    case 'tests': 
                        return "⚠️ ALERTA: O sistema está instável. Bugs regressivos estão aparecendo. Aumente a cobertura de testes.";
                    case 'maintenance': 
                        return "⚠️ ALERTA: O cliente está furioso com bugs em produção. Faça correções urgentes (Hotfix), mesmo que gere dívida técnica.";
                }
            }

            return "O projeto está estável. Tente equilibrar Qualidade e Testes para garantir sustentabilidade a longo prazo.";
        });

        // --- Métodos ---
        const getBarColor = (value) => {
            if (value > 60) return '#10B981'; // Verde Gherkin
            if (value > 30) return '#d9a05b'; // Laranja/Amarelo Gherkin
            return '#EF4444'; // Vermelho Gherkin
        };

        const endGame = (won, reason) => {
            gameActive.value = false;
            gameWon.value = won;
            gameOverReason.value = reason;
        };

        const checkGameStatus = () => {
            const lowest = getLowestStat().val;
            
            // Condição de Derrota
            if (lowest <= 0) {
                endGame(false, "FALÊNCIA DO PROJETO: Um dos pilares essenciais chegou a 0%. O sistema tornou-se insustentável e foi cancelado pela diretoria.");
                return;
            }

            // Condição de Fim de Prazo
            if (day.value > maxDays.value) {
                if (lowest >= 30) {
                    endGame(true, "SUCESSO! Você gerenciou os trade-offs de engenharia e lançou a Versão 1.0 com um software estável.");
                } else {
                    endGame(false, "LANÇAMENTO FRACASSADO: O prazo acabou, mas o software estava instável demais. O lançamento foi abortado.");
                }
            }
        };

        const performAction = (action) => {
            if (!gameActive.value) return;

            // 1. Entropia: Tudo piora um pouco
            const entropy = 3;
            stats.value.quality -= entropy;
            stats.value.docs -= entropy;
            stats.value.tests -= entropy;
            stats.value.maintenance -= entropy;

            const boost = 25; 
            const cost = 10;  

            switch(action) {
                case 'refactor':
                    stats.value.quality += boost;
                    stats.value.maintenance -= cost;
                    lastActionExplanation.value = "♻️ Refatoração: Você limpou o código e reduziu a complexidade. Isso facilita alterações futuras, mas consumiu tempo da manutenção.";
                    break;
                case 'docs':
                    stats.value.docs += boost;
                    stats.value.tests -= cost;
                    lastActionExplanation.value = "📝 Documentação: O conhecimento foi registrado na Wiki. A equipe agora trabalha mais rápido, mas deixamos de escrever novos testes.";
                    break;
                case 'test':
                    stats.value.tests += boost;
                    stats.value.quality += 5;
                    stats.value.docs -= cost;
                    lastActionExplanation.value = "🛡️ Testes Automatizados: Criamos uma rede de segurança. O deploy é mais seguro, mas a documentação ficou levemente desatualizada.";
                    break;
                case 'fix':
                    stats.value.maintenance += boost;
                    stats.value.quality -= cost;
                    lastActionExplanation.value = "🚑 Hotfix: Bug corrigido em produção! O cliente está feliz, mas a solução rápida gerou dívida técnica.";
                    break;
            }

            // Normalização
            Object.keys(stats.value).forEach(key => {
                if (stats.value[key] > 100) stats.value[key] = 100;
                if (stats.value[key] < 0) stats.value[key] = 0;
            });

            // Registra Log
            logs.value.push({ day: day.value, action: action, result: lastActionExplanation.value });

            // Avança o dia
            day.value++;
            checkGameStatus();
        };

        const resetGame = () => {
            stats.value = { quality: 70, docs: 50, tests: 50, maintenance: 80 };
            day.value = 1;
            gameActive.value = true;
            gameWon.value = false;
            lastActionExplanation.value = "";
            logs.value = [];
        };

        const saveResultPDF = () => {
            const dataStr = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = gameWon.value 
                ? "Gestão excelente! O balanceamento entre qualidade e entrega foi mantido com sucesso." 
                : "Atenção: O projeto sofreu colapso técnico. Revise as práticas de engenharia de software.";
            
            // Certificado em PDF
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Engenharia de Software</h1>
                    <h2 style="color: #555; margin: 5px 0;">Simulador: Project.Sim</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${dataStr}</p>
                    <p><strong>Status do Projeto:</strong> <span style="color: ${gameWon.value ? '#10B981' : '#EF4444'}">${gameWon.value ? 'LANÇADO' : 'CANCELADO'}</span></p>
                    <p>Este documento atesta as decisões arquiteturais e de gerenciamento de tempo tomadas durante ${day.value - 1} dias de Sprint, equilibrando Refatoração, Documentação, Testes e Hotfixes.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Nível de Maturidade Atingido</h3>
                        <p style="font-size: 28px; color: ${gameWon.value ? '#10B981' : '#EF4444'}; margin: 15px 0;">
                            <strong>${finalScore.value} Pontos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                        
                        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <div style="display: flex; justify-content: space-around; font-size: 13px; color: #555;">
                            <span>Qualidade: ${Math.round(stats.value.quality)}%</span>
                            <span>Docs: ${Math.round(stats.value.docs)}%</span>
                            <span>Testes: ${Math.round(stats.value.tests)}%</span>
                            <span>Manutenção: ${Math.round(stats.value.maintenance)}%</span>
                        </div>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado pelo simulador PROJECT.SIM
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `ProjectSim_Report_${new Date().toISOString().slice(0,10)}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(printElement).save();
        };

        return {
            stats,
            day,
            maxDays,
            gameActive,
            gameWon,
            gameOverReason,
            lastActionExplanation,
            finalScore,
            advisorTip,
            getBarColor,
            performAction,
            resetGame,
            saveResultPDF
        };
    }
}).mount('#app');