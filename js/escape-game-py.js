const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- Estado do Jogo ---
        const currentLevelIndex = ref(0);
        const attempts = ref(3); // Inicia com 3 tentativas
        const score = ref(0);
        const logs = ref([]);
        const isTyping = ref(false);
        const feedbackMsg = ref("");
        const feedbackType = ref("");
        const levelComplete = ref(false);
        const gameOver = ref(false);
        const userSelection = ref(null);
        const terminalBody = ref(null);
        const testResults = ref([]); // Histórico do PDF

        // --- ROTEIRO DO JOGO (Seu array original) ---
        // COLE AQUI TODOS OS SEUS 20 NÍVEIS ORIGINAIS
        const levels = ref([
            {
                id: 1, 
                concept: "Marcação de Banco de Dados",
                instruction: "Permita que este teste acesse o banco de dados do Django.",
                codeTemplate: [
                    "<span class='dec'>@pytest.mark.</span><span class='keyword'>???</span>", 
                    "<span class='builtin'>def</span> <span class='func'>test_user_creation</span>():", 
                    "    <span class='keyword'>pass</span>"
                ],
                options: ["django_db", "database", "use_db", "db_access"],
                correctAnswer: "django_db",
                successLog: "Marcação aplicada! Banco de dados disponível para o teste."
            },
            {
                id: 2, 
                concept: "Django Test Client",
                instruction: "Use a fixture padrão do pytest-django para simular requisições HTTP.",
                codeTemplate: [
                    "<span class='builtin'>def</span> <span class='func'>test_homepage</span>(<span class='keyword'>???</span>):", 
                    "    response = <span class='keyword'>???</span>.get('/')"
                ],
                options: ["client", "request", "browser", "http"],
                correctAnswer: "client",
                successLog: "Fixture injetada. Requisição simulada com sucesso."
            }
            // ADICIONE O RESTANTE DO SEU ARRAY AQUI (ID: 3 até ID: 20)
        ]);

        const currentLevel = computed(() => levels.value[currentLevelIndex.value]);
        const progressPercentage = computed(() => ((currentLevelIndex.value) / levels.value.length) * 100);

        // --- Lógica Principal ---
        const formatCodeLine = (line) => {
            if (line.includes("???")) {
                if (userSelection.value) {
                    return line.replaceAll("???", `<span class="code-slot filled">${userSelection.value}</span>`);
                }
                return line.replaceAll("???", `<span class="code-slot">?</span>`);
            }
            return line;
        };

        const scrollToBottom = () => {
            nextTick(() => {
                if (terminalBody.value) { 
                    terminalBody.value.scrollTop = terminalBody.value.scrollHeight; 
                }
            });
        };

        const addLog = (text, type = "log-info") => {
            logs.value.push({ text, type });
            scrollToBottom();
        };

        const typeWriter = (text, type) => {
            return new Promise(resolve => {
                logs.value.push({ text: "", type });
                let currentLogIndex = logs.value.length - 1; 
                let i = 0;
                
                const interval = setInterval(() => {
                    logs.value[currentLogIndex].text += text.charAt(i);
                    scrollToBottom(); 
                    i++;
                    
                    if (i === text.length) { 
                        clearInterval(interval); 
                        resolve(); 
                    }
                }, 15); // Velocidade do terminal Pytest
            });
        };

        const loadLevel = async () => {
            isTyping.value = true;
            await typeWriter(`pytest test_suite.py::test_case_${currentLevel.value.id}`, "log-info");
            await typeWriter(`Descobrindo contexto: [${currentLevel.value.concept}]`, "log-default");
            isTyping.value = false;
        };

        const resetTurn = () => {
            userSelection.value = null; 
            attempts.value = 3; // Reseta as tentativas por fase
            levelComplete.value = false; 
            feedbackMsg.value = ""; 
            feedbackType.value = "";
        };

        const nextLevel = () => {
            if (currentLevelIndex.value < levels.value.length - 1) {
                currentLevelIndex.value++;
                resetTurn();
                loadLevel();
            } else {
                gameOver.value = true;
                addLog("========= 100% passed =========", "log-success");
                addLog("Relatório gerado. Sessão finalizada.", "log-info");
            }
        };

        const selectOption = (option) => {
            if (levelComplete.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;
            feedbackMsg.value = ""; 
        };

        const runCode = async () => {
            if (!userSelection.value || levelComplete.value || isTyping.value) return;

            if (userSelection.value === currentLevel.value.correctAnswer) {
                // Acertou
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> PASSED [100%]";
                levelComplete.value = true;
                
                testResults.value.push({ level: currentLevel.value.id, status: 'PASSED' });

                await typeWriter(currentLevel.value.successLog, "log-success");
                setTimeout(nextLevel, 2000);

            } else {
                // Errou
                attempts.value--;
                if (attempts.value <= 0) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> FAILED. A resposta correta era: <strong>${currentLevel.value.correctAnswer}</strong>`;
                    levelComplete.value = true;
                    
                    testResults.value.push({ level: currentLevel.value.id, status: 'FAILED' });
                    
                    addLog("AssertionError: O teste falhou. Avançando forçadamente.", "log-error");
                    setTimeout(nextLevel, 3500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> FAILED. Tentativas restantes: ${attempts.value}`;
                    addLog(`E       Erro de asserção detectado. Retrying...`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Proficiência alta em testes automatizados.";
            if (score.value < (levels.value.length * 0.7)) performanceMsg = "Recomenda-se revisão da sintaxe do Pytest e fixtures do Django.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #5eb177; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #5eb177; margin: 0;">Relatório de Execução: Pytest</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Testes Backend</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Execução:</strong> ${data}</p>
                    <p>Este documento atesta a conclusão da simulação de testes unitários para a framework Django, cobrindo Fixtures, Mocks, Asserções e Client HTTP.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Coverage Report</h3>
                        <p style="font-size: 28px; color: ${score.value >= (levels.value.length * 0.7) ? '#5eb177' : (score.value >= (levels.value.length * 0.5) ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${levels.value.length} Testes Válidos (PASSED)</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado pelo simulador PYTEST.ESCAPE
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Pytest_Coverage_Report_${new Date().toISOString().slice(0,10)}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(printElement).save();
        };

        const resetGame = () => {
            currentLevelIndex.value = 0; 
            score.value = 0; 
            logs.value = []; 
            testResults.value = [];
            gameOver.value = false;
            resetTurn();
            addLog("Coletando suite de testes...", "log-info");
            setTimeout(() => loadLevel(), 1000);
        };

        onMounted(() => {
            addLog("================ test session starts ================", "log-info");
            addLog("platform linux -- Python 3.11.0, pytest-7.4.3, pluggy-1.3.0", "log-default");
            addLog("plugins: django-4.5.2", "log-default");
            setTimeout(() => { loadLevel(); }, 1500);
        });

        return {
            levels,
            currentLevelIndex,
            currentLevel,
            progressPercentage,
            attempts,
            score,
            logs,
            isTyping,
            feedbackMsg,
            feedbackType,
            levelComplete,
            gameOver,
            userSelection,
            terminalBody,
            formatCodeLine,
            selectOption,
            runCode,
            saveResultPDF,
            resetGame
        };
    }
}).mount('#app');