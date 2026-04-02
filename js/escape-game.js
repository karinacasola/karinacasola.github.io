const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- Estado do Jogo ---
        const currentLevelIndex = ref(0);
        const attempts = ref(0);
        const score = ref(0);
        const logs = ref([]);
        const inventory = ref([]);
        const isTyping = ref(false);
        const feedbackMsg = ref("");
        const feedbackType = ref("");
        const showAnswer = ref(false);
        const gameOver = ref(false);
        const userSelection = ref(null);
        const terminalBody = ref(null);
        
        const maxAttempts = 3;

        // --- Banco de Níveis (Roteiro do Jogo) ---
        const levels = ref([
            {
                id: 1,
                concept: "Variáveis e String",
                story: "Você acorda em uma sala escura. Um terminal pisca à sua frente pedindo identificação. Defina seu status para continuar.",
                instruction: "Atribua o valor 'admin' para a variável usuario.",
                codeTemplate: [
                    "usuario = <span class='keyword'>???</span>",
                    "<span class='func'>print</span>(<span class='string'>'Bem-vindo, '</span> + usuario)"
                ],
                options: ["'admin'", "admin", "1234", "True"],
                correctAnswer: "'admin'",
                successLog: "Acesso concedido. Protocolos iniciais carregados..."
            },
            {
                id: 2,
                concept: "Condicional If/Else",
                story: "O sistema reiniciou. Você vê dois arquivos criptografados: 'porta_esquerda' e 'porta_direita'. A porta esquerda parece segura.",
                instruction: "Complete o IF para abrir a porta esquerda.",
                codeTemplate: [
                    "escolha = <span class='string'>'esquerda'</span>",
                    "<span class='keyword'>if</span> escolha == <span class='string'>'esquerda'</span>:",
                    "    <span class='func'>print</span>(<span class='string'>'Caminho seguro'</span>)",
                    "<span class='keyword'>???</span>:",
                    "    <span class='func'>print</span>(<span class='string'>'GAME OVER'</span>)"
                ],
                options: ["else", "elif", "then", "stop"],
                correctAnswer: "else",
                successLog: "Você escolheu o caminho seguro e contornou o firewall."
            },
            {
                id: 3,
                concept: "Listas e Indexação",
                story: "No corredor, você encontra uma caixa de ferramentas digitais. Você precisa pegar a 'chave_mestra' que está na primeira posição da lista.",
                instruction: "Acesse o primeiro item da lista (índice 0).",
                codeTemplate: [
                    "itens = [<span class='string'>'chave_mestra'</span>, <span class='string'>'lanterna'</span>, <span class='string'>'mapa'</span>]",
                    "meu_item = itens[<span class='keyword'>???</span>]",
                    "<span class='func'>print</span>(<span class='string'>'Item pego: '</span> + meu_item)"
                ],
                options: ["0", "1", "primeiro", "chave"],
                correctAnswer: "0",
                successLog: "Download de recurso concluído: Chave Mestra.",
                reward: "Chave Mestra"
            },
            {
                id: 4,
                concept: "Loops (For)",
                story: "Uma porta blindada bloqueia a saída. Ela tem 3 travas de segurança criptografadas. Hackeie todas sequencialmente.",
                instruction: "Use um loop FOR para iterar sobre a lista de travas.",
                codeTemplate: [
                    "travas = [<span class='string'>'T1'</span>, <span class='string'>'T2'</span>, <span class='string'>'T3'</span>]",
                    "<span class='keyword'>for</span> t <span class='keyword'>in</span> <span class='keyword'>???</span>:",
                    "    <span class='func'>desbloquear</span>(t)"
                ],
                options: ["travas", "range(3)", "lista", "t"],
                correctAnswer: "travas",
                successLog: "Travas de segurança T1, T2 e T3 desativadas com sucesso."
            },
            {
                id: 5,
                concept: "Input de Dados",
                story: "A porta principal exige uma conversão de dados. A dica do sistema é: 'Ano de lançamento'.",
                instruction: "O input retorna uma string. Converta para Inteiro (int).",
                codeTemplate: [
                    "senha = <span class='func'>input</span>(<span class='string'>'Digite o ano: '</span>)",
                    "<span class='keyword'>if</span> <span class='func'>???</span>(senha) == 2024:",
                    "    <span class='func'>abrir_saida_principal</span>()"
                ],
                options: ["int", "str", "float", "number"],
                correctAnswer: "int",
                successLog: "Autenticação máxima validada. Desligando travas de segurança...",
                reward: "Token de Acesso Root"
            }
        ]);

        const currentLevel = computed(() => levels.value[currentLevelIndex.value]);
        const progressPercentage = computed(() => ((currentLevelIndex.value) / levels.value.length) * 100);

        // --- Lógica Principal ---
        const formatCodeLine = (line) => {
            if (line.includes("???")) {
                if (userSelection.value) {
                    return line.replace("???", `<span class="code-slot filled">${userSelection.value}</span>`);
                }
                return line.replace("???", `<span class="code-slot">?</span>`);
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
                }, 20); // Velocidade do terminal Python
            });
        };

        const loadLevel = async () => {
            isTyping.value = true;
            await typeWriter(`Carregando Nível ${currentLevel.value.id} [${currentLevel.value.concept}]...`, "log-info");
            await typeWriter(currentLevel.value.story, "log-default");
            isTyping.value = false;
        };

        const resetTurn = () => {
            userSelection.value = null; 
            attempts.value = 0; 
            showAnswer.value = false; 
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
                addLog("Conexão encerrada. Relatório de performance gerado.", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;
            feedbackMsg.value = ""; // Limpa aviso prévio
        };

        const runCode = async () => {
            if (!userSelection.value || showAnswer.value || isTyping.value) return;

            if (userSelection.value === currentLevel.value.correctAnswer) {
                // Acertou
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Compilação concluída sem erros de sintaxe.";
                showAnswer.value = true;
                
                if (currentLevel.value.reward) {
                    inventory.value.push(currentLevel.value.reward);
                }

                await typeWriter(currentLevel.value.successLog, "log-success");
                setTimeout(nextLevel, 2000);

            } else {
                // Errou
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Trava acionada. O código correto era: <strong>${currentLevel.value.correctAnswer}</strong>`;
                    addLog("SyntaxError: invalid syntax. Abortando execução.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextLevel, 4000);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> SyntaxError: invalid syntax. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Traceback (most recent call last): Erro no script. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente lógica computacional. Código Python limpo e funcional.";
            if (score.value < 4) performanceMsg = "Recomenda-se revisão da sintaxe e estruturas base da linguagem Python.";
            
            const inventoryHtml = inventory.value.length > 0 
                ? `<p><strong>Itens Hackeados:</strong> ${inventory.value.join(', ')}</p>` 
                : '';

            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Execução Python</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Lógica Básica</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data de Execução:</strong> ${data}</p>
                    ${inventoryHtml}
                    <p>Este documento atesta que o usuário superou os testes de compilação envolvendo variáveis, condicionais, listas e loops iterativos no ambiente PY.ESCAPE.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Score Analítico</h3>
                        <p style="font-size: 28px; color: ${score.value >= 4 ? '#10B981' : (score.value >= 2 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${levels.value.length} Scripts Válidos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Status: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado e assinado pelo servidor PY.ESCAPE
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Python_Escape_Report_${new Date().toISOString().slice(0,10)}.pdf`,
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
            inventory.value = [];
            gameOver.value = false;
            resetTurn();
            addLog("Booting system... root access granted.", "log-info");
            setTimeout(() => loadLevel(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando py.escape kernel v3.1...", "log-info");
            setTimeout(() => { loadLevel(); }, 1000);
        });

        return {
            levels,
            currentLevelIndex,
            currentLevel,
            progressPercentage,
            attempts,
            score,
            logs,
            inventory,
            isTyping,
            feedbackMsg,
            feedbackType,
            showAnswer,
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