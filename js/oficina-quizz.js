const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- Estado do Jogo ---
        const currentQuestionIndex = ref(0);
        const attempts = ref(0);
        const score = ref(0);
        const logs = ref([]);
        const isTyping = ref(false);
        const feedbackMsg = ref("");
        const feedbackType = ref("");
        const showAnswer = ref(false);
        const gameOver = ref(false);
        const userSelection = ref(null);
        const terminalBody = ref(null);
        
        const maxAttempts = 3;

        // --- Banco de Questões (15 Perguntas Contextuais de IoT e pyFirmata2) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Viabilidade de Hardware em POC.",
                scenario: "Uma startup deseja validar a ideia de um sensor inteligente de forma rápida e sem soldar placas de circuito impresso logo no primeiro dia.",
                text: "Por que o Arduino Uno R3 é a escolha recomendada neste cenário inicial em vez de placas industriais de alto custo?",
                options: [
                    "Porque ele permite rodar MicroPython nativamente graças aos seus 2KB de RAM.",
                    "Devido ao seu suporte nativo ao protocolo MQTT e Wi-Fi embarcado no chip.",
                    "Pela sua arquitetura Plug and Play e baixo custo financeiro, permitindo 'errar rápido'.",
                    "Porque ele dispensa o uso do computador, processando redes neurais localmente."
                ],
                answer: "Pela sua arquitetura Plug and Play e baixo custo financeiro, permitindo 'errar rápido'."
            },
            {
                id: 2,
                instruction: "Separação de Papéis na Arquitetura.",
                scenario: "Um desenvolvedor quer integrar um modelo pesado de Visão Computacional (OpenCV) que envia um sinal para abrir uma cancela através de um Arduino.",
                text: "Na abordagem utilizando o protocolo Firmata, como as tarefas são divididas para evitar o estouro de memória do microcontrolador?",
                options: [
                    "Ambos dividem o processamento igualmente através de pareamento na nuvem.",
                    "O PC atua como 'cérebro' rodando o Python (OpenCV), e o Arduino atua como 'músculo' recebendo os comandos de hardware.",
                    "O Arduino armazena as imagens no StandardFirmata e o computador as exibe na interface.",
                    "O Arduino roda o OpenCV compilado em C++ e envia apenas o log para o terminal do PC."
                ],
                answer: "O PC atua como 'cérebro' rodando o Python (OpenCV), e o Arduino atua como 'músculo' recebendo os comandos de hardware."
            },
            {
                id: 3,
                instruction: "Superando Restrições de Memória.",
                scenario: "Você tenta enviar um script Python puro diretamente para dentro do chip do Arduino Uno R3, porém a IDE acusa erro de memória (out of memory).",
                text: "Qual a solução arquitetural adotada nesta oficina para contornar essa restrição e continuar programando a lógica em Python?",
                options: [
                    "Adicionar um resistor de 10k ohms para aumentar o barramento da placa.",
                    "Enviar o código compactado via módulo Bluetooth HC-05 para não usar o cabo USB.",
                    "Trocar a linguagem inteiramente para C++ e esquecer a integração em Python.",
                    "Utilizar a biblioteca pyFirmata2, rodando o código de fato no PC e comunicando remotamente com a placa."
                ],
                answer: "Utilizar a biblioteca pyFirmata2, rodando o código de fato no PC e comunicando remotamente com a placa."
            },
            {
                id: 4,
                instruction: "Preparação de Firmware.",
                scenario: "Um estudante conectou a placa ao notebook e rodou um script pyFirmata2 perfeito em Python. O terminal rodou sem erros, mas os LEDs não acenderam.",
                text: "Qual passo crucial de configuração do hardware foi esquecido antes de se rodar a lógica no computador?",
                options: [
                    "Carregar o firmware tradutor Standard Firmata na placa utilizando a Arduino IDE.",
                    "Ativar a depuração USB e o driver Bluetooth diretamente no chip ATmega328P.",
                    "Instalar a extensão de compilação C/C++ da Microsoft no VS Code.",
                    "Remover a importação da biblioteca 'time' do cabeçalho do script Python."
                ],
                answer: "Carregar o firmware tradutor Standard Firmata na placa utilizando a Arduino IDE."
            },
            {
                id: 5,
                instruction: "Comunicação Serial Sem Fio.",
                scenario: "Para dar mobilidade a um projeto robótico, o desenvolvedor deseja remover o cabo USB e utilizar um módulo Bluetooth (ex: HC-05).",
                text: "Na ótica do código escrito usando pyFirmata2, o que muda na programação para que essa conexão sem fio funcione?",
                options: [
                    "É necessário importar a biblioteca WifiFirmata específica para pacotes TCP/IP.",
                    "O comando placa.bluetoothOn() deve ser chamado antes da alocação de pinos.",
                    "Praticamente nada. O pyfirmata apenas apontará para uma 'porta COM virtual' criada pelo sistema operacional.",
                    "O script deverá ser dividido: uma parte roda no notebook e a outra dentro da RAM do HC-05."
                ],
                answer: "Praticamente nada. O pyfirmata apenas apontará para uma 'porta COM virtual' criada pelo sistema operacional."
            },
            {
                id: 6,
                instruction: "Gestão do Tempo de Execução.",
                scenario: "Ao traduzir a lógica de um pisca-pisca de C++ para Python, o aluno substituiu a instrução `delay(1000)` por `time.sleep(1000)`. O projeto pareceu ter travado por minutos.",
                text: "Qual a diferença semântica entre essas duas funções que provocou esse congelamento indesejado?",
                options: [
                    "O time.sleep() desliga a energia da placa, enquanto o delay() mantém o pino energizado.",
                    "O delay() trabalha com milissegundos, mas o time.sleep() do Python interpreta o valor em segundos.",
                    "O time.sleep(1000) entra em conflito com a rotina de amostragem (samplingOn).",
                    "A biblioteca 'time' bloqueia a comunicação Firmata em sistemas Windows."
                ],
                answer: "O delay() trabalha com milissegundos, mas o time.sleep() do Python interpreta o valor em segundos."
            },
            {
                id: 7,
                instruction: "Controle de Fluxo Interativo.",
                scenario: "No projeto de controle de iluminação via terminal, o desenvolvedor percebe que o loop não fica rodando freneticamente esperando dados, ao contrário da verificação `Serial.available()` do C++.",
                text: "Que recurso nativo do Python permite estacionar a execução da lógica de forma elegante até o usuário digitar um comando?",
                options: [
                    "A função nativa input() que pausa a thread aguardando a tecla Enter.",
                    "A chamada placa.samplingOn() que sincroniza a porta automaticamente.",
                    "O bloco if/else aninhado dentro da exceção KeyboardInterrupt.",
                    "A utilização de um segundo loop while True rodando em paralelo."
                ],
                answer: "A função nativa input() que pausa a thread aguardando a tecla Enter."
            },
            {
                id: 8,
                instruction: "Monitoramento Assíncrono de Entradas.",
                scenario: "O circuito tem um botão de segurança (push button) ligado ao pino 2. Contudo, ao usar `btn.read()`, o retorno no console é permanentemente `None`.",
                text: "Qual comando pré-requisito da biblioteca pyFirmata2 foi omitido no setup do script?",
                options: [
                    "placa.digital_read_enable()",
                    "placa.samplingOn()",
                    "time.sleep(1.0)",
                    "placa.get_pin('d:2:o')"
                ],
                answer: "placa.samplingOn()"
            },
            {
                id: 9,
                instruction: "Tratamento Robusto de Exceções.",
                scenario: "Sempre que o usuário aborta o script do termômetro pressionando Ctrl+C, a porta COM fica travada. Na segunda vez, ocorre um erro de 'Access Denied'.",
                text: "Como reestruturar a arquitetura do loop principal para garantir a libertação segura do hardware?",
                options: [
                    "Envolver todo o loop num bloco try/except e, caso ocorra KeyboardInterrupt, invocar placa.exit().",
                    "Definir a porta COM como 'read-only' nas propriedades avançadas do VS Code.",
                    "Escrever um if(Ctrl+C) que chama a função placa.samplingOff() no início do arquivo.",
                    "Delegar o fechamento da porta para o garbage collector nativo do microcontrolador."
                ],
                answer: "Envolver todo o loop num bloco try/except e, caso ocorra KeyboardInterrupt, invocar placa.exit()."
            },
            {
                id: 10,
                instruction: "Ilusão de Paralelismo em Hardware.",
                scenario: "No projeto do Alarme, acionamos o Buzzer e o LED sequencialmente no código Python (duas linhas de instrução seguidas). Para uma pessoa olhando, eles ligam perfeitamente juntos.",
                text: "Por que não existe atraso (delay) perceptível entre o acionamento mecânico dos dois componentes?",
                options: [
                    "Porque usamos a biblioteca Multiprocessing do Python para dividir os núcleos de execução.",
                    "Porque ambos compartilham a mesma trilha elétrica de terra (GND) na protoboard.",
                    "Porque a comunicação serial transporta os sinais em velocidades tão altas que a execução sequencial parece instantânea.",
                    "Devido ao recurso PWM que mescla os pulsos sonoros e luminosos na porta USB."
                ],
                answer: "Porque a comunicação serial transporta os sinais em velocidades tão altas que a execução sequencial parece instantânea."
            },
            {
                id: 11,
                instruction: "Gestão de Gargalos de CPU.",
                scenario: "Um script que monitora um LDR fica girando em um laço infinito simples (`while True`). Rapidamente, a ventoinha do notebook acelera e o uso de processador bate 100%.",
                text: "Qual técnica essencial foi ignorada no fim do loop para evitar esse consumo excessivo de recursos da máquina local?",
                options: [
                    "Compilação do código Python para linguagem binária .exe.",
                    "Adicionar um pequeno delay (ex: time.sleep(0.01)) para aliviar a carga ininterrupta de consultas.",
                    "Desligar a rotina assíncrona do samplingOn().",
                    "Reduzir o resistor da protoboard de 10K para 150 Ohms."
                ],
                answer: "Adicionar um pequeno delay (ex: time.sleep(0.01)) para aliviar a carga ininterrupta de consultas."
            },
            {
                id: 12,
                instruction: "Filtragem de Consistência de Dados.",
                scenario: "No monitor térmico, a tela do VS Code exibe ocasionalmente o erro matemático `TypeError: unsupported operand type for *` e o código colapsa na primeira leitura serial.",
                text: "Qual é a causa estrutural que exige uma condicional `if is not None:` antes de realizar cálculos?",
                options: [
                    "Valores analógicos do NTC vêm formatados em Hexadecimal, quebrando bibliotecas numéricas nativas.",
                    "O Arduino emite descargas eletrostáticas que embaralham a porta USB.",
                    "Antes da comunicação se estabilizar perfeitamente, a leitura pode retornar vazia (None), incapacitando equações.",
                    "O Python desativa as operações de multiplicação automaticamente quando o pino é analógico."
                ],
                answer: "Antes da comunicação se estabilizar perfeitamente, a leitura pode retornar vazia (None), incapacitando equações."
            },
            {
                id: 13,
                instruction: "Manutenção de Estado Lógico (Reset).",
                scenario: "Ao simular o semáforo automotivo, a repetição ininterrupta do ciclo acaba criando um glitch onde o farol verde dos carros e o verde dos pedestres colidem rapidamente.",
                text: "Nas boas práticas indicadas nos projetos, qual a solução corretiva adotada ao fim do fluxo do trânsito?",
                options: [
                    "Forçar o fechamento do script com placa.exit() e reiniciá-lo usando shell script.",
                    "Apagar explicitamente todos os LEDs num bloco de 'Reset' ao final do loop antes de permitir a próxima repetição.",
                    "Re-instanciar o objeto 'placa = Arduino()' a cada iteração do semáforo.",
                    "Alimentar o Arduino com 12V externos para evitar quedas de tensão nos LEDs."
                ],
                answer: "Apagar explicitamente todos os LEDs num bloco de 'Reset' ao final do loop antes de permitir a próxima repetição."
            },
            {
                id: 14,
                instruction: "Calibração e Fórmulas de Engenharia.",
                scenario: "Ao usar componentes como Termistores NTC em C++, costuma-se apelar para bibliotecas prontas que ocultam os cálculos analógicos. No Python, usamos blocos matemáticos explícitos.",
                text: "Qual a vantagem industrial de realizar a conversão do dado analógico usando módulos nativos (como 'math') diretamente no computador?",
                options: [
                    "Permite criar logs encriptados usando blockchain Firmata.",
                    "Ignora limitações de hardware do sensor, convertendo um termistor analógico em digital sem componentes novos.",
                    "Evita depender do Arduino e garante total transparência e controle sobre o ajuste de curvas da conversão logarítmica.",
                    "É o único modo aceito por painéis do VS Code."
                ],
                answer: "Evita depender do Arduino e garante total transparência e controle sobre o ajuste de curvas da conversão logarítmica."
            },
            {
                id: 15,
                instruction: "Lógica Crepuscular Baseada em Thresholds.",
                scenario: "Para o sistema de iluminação de emergência funcionar, o LED precisa brilhar se o ambiente ficar escuro (ex: sensor reportar níveis baixos, como 0.2).",
                text: "Dentre as abordagens abaixo, qual operador lógico garante o funcionamento correto de 'ligar no escuro' com um ponto de corte (threshold) em 0.5?",
                options: [
                    "if luz_atual < 0.5: led.write(1) else: led.write(0)",
                    "if luz_atual == 0.5: led.write(1)",
                    "if luz_atual > 0.5: led.write(1) else: led.write(0)",
                    "if not luz_atual: led.write(1) else: led.write(0.5)"
                ],
                answer: "if luz_atual < 0.5: led.write(1) else: led.write(0)"
            }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

        // --- Lógica Principal (Terminal e Fluxo de Jogo) ---
        const scrollToBottom = () => {
            nextTick(() => {
                if (terminalBody.value) { 
                    terminalBody.value.scrollTop = terminalBody.value.scrollHeight; 
                }
            });
        };

        const addLog = (text, type = "log-default") => {
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
                }, 15); // Velocidade de digitação otimizada para textos mais longos
            });
        };

        const loadQuestion = async () => {
            isTyping.value = true;
            await typeWriter(`Iniciando análise do bloco ${currentQuestion.value.id}/15...`, "log-info");
            await typeWriter(currentQuestion.value.scenario, "log-default");
            isTyping.value = false;
        };

        const resetTurn = () => {
            userSelection.value = null; 
            attempts.value = 0; 
            showAnswer.value = false; 
            feedbackMsg.value = ""; 
            feedbackType.value = "";
        };

        const nextQuestion = () => {
            if (currentQuestionIndex.value < questions.value.length - 1) {
                currentQuestionIndex.value++;
                resetTurn();
                loadQuestion();
            } else {
                gameOver.value = true;
                addLog("Validação de arquitetura finalizada com sucesso. Relatório Técnico liberado.", "log-success");
                addLog("Acesse o botão de PDF acima para gerar a documentação.", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Lógica validada! Parâmetro aprovado.";
                addLog("Status 200: Decisão arquitetural em conformidade com pyFirmata2.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Falha Crítica. Configuração ideal: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Erro 500: Fluxo interrompido por timeout. Avançando módulo.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Análise Incorreta. Tente novamente. Restam: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso 400: Parâmetro incompatível. Retentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            // Rola a tela para o topo prevenindo cortes por posicionamento do viewport no html2canvas
            window.scrollTo(0, 0);

            const data = new Date().toLocaleString('pt-BR');
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Mestre da Integração: Domínio excelente da Arquitetura IoT e bibliotecas Python.";
            if (score.value < 10) {
                performanceMsg = "Requer revisão de conceitos: Pratique mais sobre a manipulação de portas analógicas e gestão de loops (sleep/delay).";
            } else if (score.value < 14) {
                performanceMsg = "Bom desempenho: Conhecimento sólido da comunicação serial e controle de lógica na borda.";
            }
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório Técnico - Oficina IoT e Python</h1>
                    <h2 style="color: #555; margin: 5px 0;">Avaliação de Domínio do pyFirmata2</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Auditoria:</strong> ${data}</p>
                    <p>Este documento formaliza a conclusão e avaliação do teste de arquitetura tecnológica focado na integração de microcontroladores com Python utilizando o protocolo de abstração Firmata.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Indicador de Performance</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#10B981' : (score.value >= 10 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Pontos Válidos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento processado pelo Simulador Edge_IA_v2.0
                </p>
            `;

            // Configuração para gerar o nome do arquivo conforme solicitado
            const opt = {
                margin:       0.5,
                filename:     `relatorio-oficina-${new Date().getTime()}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(printElement).save();
        };

        const resetGame = () => {
            currentQuestionIndex.value = 0; 
            score.value = 0; 
            logs.value = []; 
            gameOver.value = false;
            resetTurn();
            addLog("Reiniciando instância pyFirmata2 e limpando memória RAM...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Módulo de Avaliação Python+Hardware...", "log-info");
            setTimeout(() => { loadQuestion(); }, 1000);
        });

        return {
            questions,
            currentQuestionIndex,
            currentQuestion,
            progressPercentage,
            attempts,
            score,
            logs,
            isTyping,
            feedbackMsg,
            feedbackType,
            showAnswer,
            gameOver,
            userSelection,
            terminalBody,
            selectOption,
            saveResultPDF,
            resetGame
        };
    }
}).mount('#app');