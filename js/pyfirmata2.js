const { createApp } = Vue;

createApp({
    data() {
        return {
            currentLevelIndex: 0,
            availableBlocks: [], 
            selectedBlocks: [],  
            logs: [],
            isTyping: false,
            feedbackMsg: "",
            feedbackType: "",
            levelComplete: false,
            
            // Variáveis da Mecânica de Vidas (Chances)
            chances: 3,
            showSolution: false,
            currentSolutionDisplay: [],
            
            // Variáveis de Progresso e Certificado
            totalErros: 0,
            dataAtual: new Date().toLocaleDateString('pt-BR'),
            
            // 50 Desafios Completos e Estruturados (Multi-linhas)
            levels: [
                // --- MÓDULO 1: SAÍDAS DIGITAIS E TIMING COMPLETO ---
                {
                    id: 1, concept: "Inicialização de LED",
                    story: "Precisamos de criar a infraestrutura básica para acionar um atuador digital.",
                    instruction: "Importe o Arduino, instancie a placa na COM4, configure o pino digital 13 como saída e ligue o LED.",
                    blocks: [
                        { id: 'b1', text: 'from pyfirmata2 import Arduino' },
                        { id: 'b2', text: 'placa = Arduino("COM4")' },
                        { id: 'b3', text: 'led = placa.get_pin("d:13:o")' },
                        { id: 'b4', text: 'led.write(1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "LED inicializado e aceso com sucesso!"
                },
                {
                    id: 2, concept: "Desligamento e Pausa Segura",
                    story: "Um bom script garante que o LED acenda por um tempo e depois o sistema seja libertado.",
                    instruction: "Importe o tempo, use o sleep por 2 segundos, apague o LED do pino 13 e encerre a conexão da placa.",
                    blocks: [
                        { id: 'b1', text: 'import time' },
                        { id: 'b2', text: 'time.sleep(2.0)' },
                        { id: 'b3', text: 'led.write(0)' },
                        { id: 'b4', text: 'placa.exit()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Fluxo de paragem executado corretamente!"
                },
                {
                    id: 3, concept: "Estrutura do Ciclo Blink",
                    story: "O efeito pisca-pisca clássico necessita de uma estrutura de repetição contínua.",
                    instruction: "Crie um loop infinito onde o LED liga, aguarda 0.5s, desliga e aguarda mais 0.5s.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    led.write(1)' },
                        { id: 'b3', text: '    time.sleep(0.5)' },
                        { id: 'b4', text: '    led.write(0)' },
                        { id: 'b5', text: '    time.sleep(0.5)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Loop de pisca-pisca a rodar sem paragens!"
                },
                {
                    id: 4, concept: "Blink Duplo Alternado",
                    story: "Configuração de dois LEDs que piscam de forma invertida para sinalização de aviso.",
                    instruction: "Monte o código onde o ledA liga enquanto o ledB desliga, aguarda 1s, e depois invertem os estados.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    ledA.write(1)' },
                        { id: 'b3', text: '    ledB.write(0)' },
                        { id: 'b4', text: '    time.sleep(1.0)' },
                        { id: 'b5', text: '    ledA.write(0)' },
                        { id: 'b6', text: '    ledB.write(1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6']], successLog: "Sinalizador alternado ativo!"
                },
                {
                    id: 5, concept: "Configuração de Semáforo (Setup)",
                    story: "Antes de rodar a lógica do trânsito, é necessário o mapeamento completo dos pinos.",
                    instruction: "Mapeie os três LEDs do semáforo: Vermelho (d:11:o), Amarelo (d:10:o) e Verde (d:9:o).",
                    blocks: [
                        { id: 'b1', text: 'vrm = placa.get_pin("d:11:o")' },
                        { id: 'b2', text: 'ama = placa.get_pin("d:10:o")' },
                        { id: 'b3', text: 'vrd = placa.get_pin("d:9:o")' }
                    ],
                    solutions: [
                        ['b1', 'b2', 'b3'], ['b1', 'b3', 'b2'], ['b2', 'b1', 'b3'],
                        ['b2', 'b3', 'b1'], ['b3', 'b1', 'b2'], ['b3', 'b2', 'b1']
                    ], successLog: "Hardware do semáforo completamente mapeado!"
                },
                {
                    id: 6, concept: "Rotina de Trânsito Segura",
                    story: "O semáforo deve seguir a ordem correta para evitar acidentes de trânsito simulados.",
                    instruction: "Ligue o Verde por 3s, depois desligue o Verde e ligue o Amarelo por 1s.",
                    blocks: [
                        { id: 'b1', text: 'vrd.write(1)' },
                        { id: 'b2', text: 'time.sleep(3.0)' },
                        { id: 'b3', text: 'vrd.write(0)' },
                        { id: 'b4', text: 'ama.write(1)' },
                        { id: 'b5', text: 'time.sleep(1.0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Transição Verde-Amarelo validada!"
                },
                {
                    id: 7, concept: "Fechamento de Ciclo do Semáforo",
                    story: "Para fechar a lógica, o amarelo deve apagar antes que o vermelho assuma o controlo.",
                    instruction: "Apague o Amarelo, ligue o Vermelho, espere 4s e depois desligue o Vermelho.",
                    blocks: [
                        { id: 'b1', text: 'ama.write(0)' },
                        { id: 'b2', text: 'vrm.write(1)' },
                        { id: 'b3', text: 'time.sleep(4.0)' },
                        { id: 'b4', text: 'vrm.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Ciclo completo do semáforo finalizado!"
                },
                {
                    id: 8, concept: "Inicialização Preventiva",
                    story: "Ao iniciar circuitos, convém garantir que as saídas comecem em nível lógico baixo.",
                    instruction: "Crie a rotina inicial desligando explicitamente o ledA e o ledB antes do sleep protetor.",
                    blocks: [
                        { id: 'b1', text: 'ledA.write(0)' },
                        { id: 'b2', text: 'ledB.write(0)' },
                        { id: 'b3', text: 'time.sleep(0.2)' }
                    ],
                    solutions: [['b1', 'b2', 'b3'], ['b2', 'b1', 'b3']], successLog: "Estado inicial limpo!"
                },
                {
                    id: 9, concept: "Contador de Pulsações Finitas",
                    story: "Nem todos os loops devem durar para sempre. Vamos limitar as piscadas usando um range.",
                    instruction: "Faça um laço para repetir 5 vezes a ação de ligar o LED e esperar 0.2 segundos.",
                    blocks: [
                        { id: 'b1', text: 'for i in range(5):' },
                        { id: 'b2', text: '    led.write(1)' },
                        { id: 'b3', text: '    time.sleep(0.2)' },
                        { id: 'b4', text: '    led.write(0)' },
                        { id: 'b5', text: '    time.sleep(0.2)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "O LED piscou exatamente 5 vezes!"
                },
                {
                    id: 10, concept: "Controlo por Flag Booleana",
                    story: "Loops controlados por variáveis booleanas permitem interrupções dinâmicas de software.",
                    instruction: "Defina uma flag como True, inicie o loop baseado nela e mude a flag para False no fim.",
                    blocks: [
                        { id: 'b1', text: 'rodando = True' },
                        { id: 'b2', text: 'while rodando:' },
                        { id: 'b3', text: '    led.write(1)' },
                        { id: 'b4', text: '    rodando = False' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Loop condicional executado uma única vez!"
                },

                // --- MÓDULO 2: SINAIS PWM (VARIAÇÃO DE INTENSIDADE) ---
                {
                    id: 11, concept: "Configuração de Canal PWM",
                    story: "Para modular a potência elétrica de um pino, precisamos de o configurar como 'p'.",
                    instruction: "Mapeie o pino digital 6 como PWM, ajuste a sua intensidade inicial para 20% (0.2) e pause.",
                    blocks: [
                        { id: 'b1', text: 'led_pwm = placa.get_pin("d:6:p")' },
                        { id: 'b2', text: 'led_pwm.write(0.2)' },
                        { id: 'b3', text: 'time.sleep(0.5)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Modulação PWM ativada com brilho suave!"
                },
                {
                    id: 12, concept: "Rampa Fade In Dinâmica",
                    story: "Vamos fazer a luminosidade do LED aumentar gradualmente usando divisões matemáticas.",
                    instruction: "Crie um loop contável de 0 a 10 que escreve a fração correspondente no pino PWM a cada 0.1s.",
                    blocks: [
                        { id: 'b1', text: 'for i in range(11):' },
                        { id: 'b2', text: '    led_pwm.write(i / 10.0)' },
                        { id: 'b3', text: '    time.sleep(0.1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Efeito Fade-In executado perfeitamente!"
                },
                {
                    id: 13, concept: "Rampa Fade Out Reversa",
                    story: "Agora faremos o processo inverso: reduzir o brilho até apagar completamente.",
                    instruction: "Crie um loop que percorre o range invertido de 10 até 0, reduzindo o brilho do LED.",
                    blocks: [
                        { id: 'b1', text: 'for i in range(10, -1, -1):' },
                        { id: 'b2', text: '    led_pwm.write(i / 10.0)' },
                        { id: 'b3', text: '    time.sleep(0.1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Efeito Fade-Out finalizado!"
                },
                {
                    id: 14, concept: "Pulsação Contínua (Coração)",
                    story: "Combinando as duas rampas num ciclo infinito, criamos um efeito de respiração/pulsação.",
                    instruction: "Monte a estrutura onde o loop infinito executa um fade de subida e logo em seguida um fade de descida.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    for u in range(6): led_pwm.write(u/5.0)' },
                        { id: 'b3', text: '    for u in range(5, -1, -1): led_pwm.write(u/5.0)' },
                        { id: 'b4', text: '    time.sleep(0.2)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Pulsação cíclica ativa!"
                },
                {
                    id: 15, concept: "Brilho Cruzado de LEDs",
                    story: "Controlo de dois LEDs onde um ganha intensidade enquanto o outro perde energia simultaneamente.",
                    instruction: "No laço de 0 a 5, escreva i/5.0 no ledA e (5-i)/5.0 no ledB.",
                    blocks: [
                        { id: 'b1', text: 'for i in range(6):' },
                        { id: 'b2', text: '    ledA.write(i / 5.0)' },
                        { id: 'b3', text: '    ledB.write((5 - i) / 5.0)' },
                        { id: 'b4', text: '    time.sleep(0.1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Brilho cruzado balanceado!"
                },
                {
                    id: 16, concept: "Setup Inicial de LED RGB",
                    story: "LEDs RGB necessitam de três pinos configurados em modo PWM para misturar cores.",
                    instruction: "Defina os objetos para Vermelho (pino 9), Verde (pino 10) e Azul (pino 11) em modo PWM.",
                    blocks: [
                        { id: 'b1', text: 'pr = placa.get_pin("d:9:p")' },
                        { id: 'b2', text: 'pg = placa.get_pin("d:10:p")' },
                        { id: 'b3', text: 'pb = placa.get_pin("d:11:p")' }
                    ],
                    solutions: [
                        ['b1', 'b2', 'b3'], ['b1', 'b3', 'b2'], ['b2', 'b1', 'b3'],
                        ['b2', 'b3', 'b1'], ['b3', 'b1', 'b2'], ['b3', 'b2', 'b1']
                    ], successLog: "Canais RGB prontos para mistura cromática!"
                },
                {
                    id: 17, concept: "Mistura de Cor: Amarelo",
                    story: "A cor amarela pura obtém-se combinando 100% de luz vermelha e 100% de luz verde.",
                    instruction: "Escreva potência máxima nos pinos Vermelho e Verde, e zere o sinal do Azul.",
                    blocks: [
                        { id: 'b1', text: 'pr.write(1.0)' },
                        { id: 'b2', text: 'pg.write(1.0)' },
                        { id: 'b3', text: 'pb.write(0.0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3'], ['b2', 'b1', 'b3']], successLog: "LED RGB configurado em Amarelo!"
                },
                {
                    id: 18, concept: "Mistura de Cor: Ciano Turquesa",
                    story: "Para obter ciano, misturamos intensidades máximas de Verde e Azul.",
                    instruction: "Zere o pino Vermelho, envie 1.0 para o Verde e envie 1.0 para o Azul.",
                    blocks: [
                        { id: 'b1', text: 'pr.write(0.0)' },
                        { id: 'b2', text: 'pg.write(1.0)' },
                        { id: 'b3', text: 'pb.write(1.0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3'], ['b1', 'b3', 'b2']], successLog: "Ciano gerado com sucesso!"
                },
                {
                    id: 19, concept: "Modulação de Cor Personalizada",
                    story: "Podemos criar tons pastéis enviando valores decimais fracionados aos pinos RGB.",
                    instruction: "Gere uma cor personalizada: 40% Vermelho, 80% Verde e 20% Azul.",
                    blocks: [
                        { id: 'b1', text: 'pr.write(0.4)' },
                        { id: 'b2', text: 'pg.write(0.8)' },
                        { id: 'b3', text: 'pb.write(0.2)' }
                    ],
                    solutions: [
                        ['b1', 'b2', 'b3'], ['b1', 'b3', 'b2'], ['b2', 'b1', 'b3'],
                        ['b2', 'b3', 'b1'], ['b3', 'b1', 'b2'], ['b3', 'b2', 'b1']
                    ], successLog: "Tom personalizado renderizado no hardware!"
                },
                {
                    id: 20, concept: "Desativação Cromática Total",
                    story: "Ao desligar um sistema RGB, todos os canais analógicos devem ir a zero para evitar brilhos residuais.",
                    instruction: "Envie sinal 0.0 para os três canais e execute o encerramento da placa de forma sequencial.",
                    blocks: [
                        { id: 'b1', text: 'pr.write(0.0)' },
                        { id: 'b2', text: 'pg.write(0.0)' },
                        { id: 'b3', text: 'pb.write(0.0)' },
                        { id: 'b4', text: 'placa.exit()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "RGB totalmente apagado e isolado!"
                },

                // --- MÓDULO 3: ENTRADAS DIGITAIS (BOTÕES E CHAVES) ---
                {
                    id: 21, concept: "Setup Completo de Entrada",
                    story: "Para ler botões sem travar o script, precisamos de configurar o pino de entrada e a amostragem de dados.",
                    instruction: "Configure o pino 2 como entrada digital, ative a amostragem contínua da placa e faça uma pausa técnica.",
                    blocks: [
                        { id: 'b1', text: 'btn = placa.get_pin("d:2:i")' },
                        { id: 'b2', text: 'placa.samplingOn()' },
                        { id: 'b3', text: 'time.sleep(0.5)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Sistema de monitorização digital ativo!"
                },
                {
                    id: 22, concept: "Leitura com Estrutura Condicional",
                    story: "Vamos criar uma lógica reativa: o LED deve responder instantaneamente ao estado físico do botão.",
                    instruction: "Leia o estado do botão. Se for igual a 1, acenda o LED; caso contrário, apague-o.",
                    blocks: [
                        { id: 'b1', text: 'estado = btn.read()' },
                        { id: 'b2', text: 'if estado == 1:' },
                        { id: 'b3', text: '    led.write(1)' },
                        { id: 'b4', text: 'else:' },
                        { id: 'b5', text: '    led.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Lógica condicional de acionamento validada!"
                },
                {
                    id: 23, concept: "Prevenção de Erros de Inicialização",
                    story: "Nas primeiras frações de segundo, leituras de pinos podem retornar 'None'. É preciso filtrar.",
                    instruction: "Se a leitura do botão não for nula, execute a leitura e valide se está pressionado.",
                    blocks: [
                        { id: 'b1', text: 'leitura = btn.read()' },
                        { id: 'b2', text: 'if leitura is not None:' },
                        { id: 'b3', text: '    print("Sinal detetado:", leitura)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Tratamento de exceção de dados nulos ativo!"
                },
                {
                    id: 24, concept: "Controlo Conectivo Biestável",
                    story: "Implementação de dois botões de pressão: um funciona estritamente como LIGA e outro como DESLIGA.",
                    instruction: "Se btnLiga ler 1, liga o LED. Se btnDesliga ler 1, desliga o LED.",
                    blocks: [
                        { id: 'b1', text: 'if btnLiga.read() == 1:' },
                        { id: 'b2', text: '    led.write(1)' },
                        { id: 'b3', text: 'if btnDesliga.read() == 1:' },
                        { id: 'b4', text: '    led.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Sistema bimanual operacional!"
                },
                {
                    id: 25, concept: "Interrupção de Loop por Botão",
                    story: "Queremos que um loop infinito corra tarefas até que alguém pressione fisicamente um botão de emergência.",
                    instruction: "Crie um loop True. Se o botão de pânico ler 1, quebre a execução usando break.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    if btnPanico.read() == 1:' },
                        { id: 'b3', text: '        break' },
                        { id: 'b4', text: '    time.sleep(0.1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Interrupção física de segurança estruturada!"
                },
                {
                    id: 26, concept: "Contador Dinâmico de Cliques",
                    story: "Sempre que detetamos um clique, incrementamos uma variável interna. Precisamos de um pequeno delay para debounce.",
                    instruction: "Se o botão for acionado, adicione +1 à variável cliques e espere 0.3s para evitar leituras falsas.",
                    blocks: [
                        { id: 'b1', text: 'if btn.read() == 1:' },
                        { id: 'b2', text: '    cliques = cliques + 1' },
                        { id: 'b3', text: '    time.sleep(0.3)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Contador com debounce lógico ativo!"
                },
                {
                    id: 27, concept: "Sinalizador de Dupla Confirmação",
                    story: "Para ativar uma máquina, ambos os botões de segurança devem estar pressionados ao mesmo tempo.",
                    instruction: "Construa a condicional AND (E) verificando se btnA e btnB estão ativos simultaneamente.",
                    blocks: [
                        { id: 'b1', text: 'if btnA.read() == 1 and btnB.read() == 1:' },
                        { id: 'b2', text: '    led.write(1)' },
                        { id: 'b3', text: 'else:' },
                        { id: 'b4', text: '    led.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Lógica AND industrial implementada!"
                },
                {
                    id: 28, concept: "Lógica OU de Ativação",
                    story: "Um alarme residencial deve disparar se a janela OU a porta forem abertas (sensores abertos de nível alto).",
                    instruction: "Use o operador lógico 'or' para disparar o buzzer se sensorA ou sensorB lerem 1.",
                    blocks: [
                        { id: 'b1', text: 'if sensorA.read() == 1 or sensorB.read() == 1:' },
                        { id: 'b2', text: '    buzzer.write(1)' },
                        { id: 'b3', text: 'else:' },
                        { id: 'b4', text: '    buzzer.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Lógica OR de segurança ativa!"
                },
                {
                    id: 29, concept: "Alternador de Estado (Toggle)",
                    story: "Inverter o estado atual de um LED com base no clique do botão exige o uso do operador 'not'.",
                    instruction: "Leia o estado do LED, mude para o oposto lógico e aplique de novo no pino.",
                    blocks: [
                        { id: 'b1', text: 'if btn.read() == 1:' },
                        { id: 'b2', text: '    estado_atual = led.read()' },
                        { id: 'b3', text: '    led.write(not estado_atual)' },
                        { id: 'b4', text: '    time.sleep(0.4)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Função de clique basculante (Toggle) funcional!"
                },
                {
                    id: 30, concept: "Bloqueio Temporizado por Botão",
                    story: "Ao clicar no botão, um LED deve piscar rapidamente e bloquear novas leituras por um período fixo.",
                    instruction: "Se botão for 1, ligue o LED, espere 1.5s, desligue-o e faça um log de sistema.",
                    blocks: [
                        { id: 'b1', text: 'if btn.read() == 1:' },
                        { id: 'b2', text: '    led.write(1)' },
                        { id: 'b3', text: '    time.sleep(1.5)' },
                        { id: 'b4', text: '    led.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Temporização reativa concluída!"
                },

                // --- MÓDULO 4: ENTRADAS ANALÓGICAS E SENSORES ---
                {
                    id: 31, concept: "Setup e Leitura Analógica",
                    story: "Sensores analógicos (como o potenciómetro) enviam leituras contínuas entre 0.0 e 1.0.",
                    instruction: "Mapeie o pino analógico A0, ligue a amostragem e armazene a primeira leitura real numa variável.",
                    blocks: [
                        { id: 'b1', text: 'pot = placa.get_pin("a:0:i")' },
                        { id: 'b2', text: 'placa.samplingOn()' },
                        { id: 'b3', text: 'time.sleep(0.1)' },
                        { id: 'b4', text: 'valor = pot.read()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Conversor Analógico-Digital ativo!"
                },
                {
                    id: 32, concept: "Filtro de Ruído Analógico",
                    story: "Para evitar comandos baseados em dados inválidos (None), o processamento só ocorre sob validação firme.",
                    instruction: "Verifique se o valor não é None. Se for válido, multiplique por 100 para obter a percentagem.",
                    blocks: [
                        { id: 'b1', text: 'val = pot.read()' },
                        { id: 'b2', text: 'if val is not None:' },
                        { id: 'b3', text: '    percentagem = val * 100' },
                        { id: 'b4', text: '    print(percentagem)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Filtro de consistência analógica ativado!"
                },
                {
                    id: 33, concept: "Controlo Direto Potenciómetro-PWM",
                    story: "Vamos criar um dimmer de iluminação onde a rotação física do potenciómetro dita o brilho do LED.",
                    instruction: "Dentro do loop, leia o potenciómetro e, se válido, passe o valor diretamente para o LED PWM.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    v = pot.read()' },
                        { id: 'b3', text: '    if v is not None:' },
                        { id: 'b4', text: '        led_pwm.write(v)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Dimmer analógico em tempo real ativo!"
                },
                {
                    id: 34, concept: "Zonamento de Limiar Analógico",
                    story: "Sistemas de proteção disparam alarmes caso uma leitura ultrapasse valores críticos de segurança.",
                    instruction: "Se a leitura do potenciómetro for superior a 0.8, ligue o buzzer; caso contrário, desligue-o.",
                    blocks: [
                        { id: 'b1', text: 'if v is not None:' },
                        { id: 'b2', text: '    if v > 0.8:' },
                        { id: 'b3', text: '        buzzer.write(1)' },
                        { id: 'b4', text: '    else:' },
                        { id: 'b5', text: '        buzzer.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Threshold de segurança validado!"
                },
                {
                    id: 35, concept: "Setup de Sensor LDR Crepuscular",
                    story: "Um LDR deteta a luminosidade ambiental. Vamos mapeá-lo num pino analógico dedicado.",
                    instruction: "Defina o LDR no pino analógico A5 como entrada e limpe os logs de sistema.",
                    blocks: [
                        { id: 'b1', text: 'ldr = placa.get_pin("a:5:i")' },
                        { id: 'b2', text: 'placa.samplingOn()' },
                        { id: 'b3', text: 'time.sleep(0.1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Sensor fotoresistor inicializado!"
                },
                {
                    id: 36, concept: "Automação Crepuscular Noturna",
                    story: "Se a iluminação do LDR cair abaixo de 0.35, significa que anoiteceu e os postes devem acender.",
                    instruction: "Crie a condicional que avalia o LDR e liga o LED se o ambiente estiver escuro.",
                    blocks: [
                        { id: 'b1', text: 'luz = ldr.read()' },
                        { id: 'b2', text: 'if luz is not None and luz < 0.35:' },
                        { id: 'b3', text: '    led.write(1)' },
                        { id: 'b4', text: 'else:' },
                        { id: 'b5', text: '    led.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Iluminação pública automatizada com sucesso!"
                },
                {
                    id: 37, concept: "Mapeamento Analógico Inverso",
                    story: "Queremos que o brilho do LED seja inversamente proporcional à luz: quanto mais escuro, mais forte o LED brilha.",
                    instruction: "Calcule o brilho subtraindo o valor do LDR a 1.0, e injete o resultado no pino PWM.",
                    blocks: [
                        { id: 'b1', text: 'leitura_ldr = ldr.read()' },
                        { id: 'b2', text: 'if leitura_ldr is not None:' },
                        { id: 'b3', text: '    brilho_calculado = 1.0 - leitura_ldr' },
                        { id: 'b4', text: '    led_pwm.write(brilho_calculado)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Lógica inversa proporcional funcional!"
                },
                {
                    id: 38, concept: "Leitura Dupla de Sensores",
                    story: "Aplicações avançadas comparam dados de múltiplos sensores para tomadas de decisão complexas.",
                    instruction: "Leia o potenciómetro e o LDR consecutivamente dentro do mesmo bloco de processamento.",
                    blocks: [
                        { id: 'b1', text: 'dado_pot = pot.read()' },
                        { id: 'b2', text: 'dado_ldr = ldr.read()' },
                        { id: 'b3', text: 'if dado_pot is not None and dado_ldr is not None:' },
                        { id: 'b4', text: '    print("Sensores sincronizados")' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Sincronização de dados analógicos validada!"
                },
                {
                    id: 39, concept: "Média Móvel Contra Ruído",
                    story: "Para estabilizar leituras oscilantes, tiramos a média matemática de duas amostras sucessivas.",
                    instruction: "Leia a primeira amostra, espere 0.05s, leia a segunda e divida a soma por 2.",
                    blocks: [
                        { id: 'b1', text: 'a1 = pot.read()' },
                        { id: 'b2', text: 'time.sleep(0.05)' },
                        { id: 'b3', text: 'a2 = pot.read()' },
                        { id: 'b4', text: 'if a1 and a2: media = (a1 + a2) / 2.0' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Estabilizador matemático ativo!"
                },
                {
                    id: 40, concept: "Desativação Segura de Sensores",
                    story: "Antes de fechar o programa, desativamos o relatório de dados analógicos para limpar a fila da serial.",
                    instruction: "Mande o comando placa.exit() após garantir uma última leitura de encerramento.",
                    blocks: [
                        { id: 'b1', text: 'print("Último valor:", pot.read())' },
                        { id: 'b2', text: 'placa.exit()' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Barramento analógico finalizado!"
                },

                // --- MÓDULO 5: MOTORES DC (PONTE H) E SERVOS ---
                {
                    id: 41, concept: "Setup de Servomotor",
                    story: "Os servomotores utilizam o modo de configuração 's' para receber comandos em graus angulares (0° a 180°).",
                    instruction: "Configure o pino digital 10 como servo, defina o ângulo inicial para 0° e aguarde o movimento físico.",
                    blocks: [
                        { id: 'b1', text: 'servo = placa.get_pin("d:10:s")' },
                        { id: 'b2', text: 'servo.write(0)' },
                        { id: 'b3', text: 'time.sleep(0.6)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Eixo do servo calibrado na origem!"
                },
                {
                    id: 42, concept: "Varredura Angular Completa",
                    story: "Vamos programar o braço mecânico para mover-se estrategicamente para as suas posições extremas de trabalho.",
                    instruction: "Mova o servo para 90°, espere 0.5s, altere para 180° e aguarde a estabilização do motor.",
                    blocks: [
                        { id: 'b1', text: 'servo.write(90)' },
                        { id: 'b2', text: 'time.sleep(0.5)' },
                        { id: 'b3', text: 'servo.write(180)' },
                        { id: 'b4', text: 'time.sleep(0.5)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Teste de varredura posicional concluído!"
                },
                {
                    id: 43, concept: "Controlo Potenciómetro-Servo",
                    story: "Mapeando o potenciómetro (0.0 a 1.0) para controlar diretamente o ângulo do servo (0 a 180 graus).",
                    instruction: "Leia o potenciómetro, multiplique por 180, converta para inteiro e envie o comando ao servo.",
                    blocks: [
                        { id: 'b1', text: 'v_pot = pot.read()' },
                        { id: 'b2', text: 'if v_pot is not None:' },
                        { id: 'b3', text: '    angulo = int(v_pot * 180)' },
                        { id: 'b4', text: '    servo.write(angulo)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Controlo de servo articulado por potenciómetro ativo!"
                },
                {
                    id: 44, concept: "Acionamento Condicional Angular",
                    story: "Se o botão for pressionado, a cancela do estacionamento deve abrir a 90°. Caso contrário, permanece fechada a 0°.",
                    instruction: "Monte a estrutura condicional if/else associando o estado do botão aos ângulos do servo.",
                    blocks: [
                        { id: 'b1', text: 'if btn.read() == 1:' },
                        { id: 'b2', text: '    servo.write(90)' },
                        { id: 'b3', text: 'else:' },
                        { id: 'b4', text: '    servo.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Cancela automatizada operacional!"
                },
                {
                    id: 45, concept: "Setup de Direção de Motor DC",
                    story: "Motores DC controlados por Pontes H (L298N) necessitam de dois pinos digitais para ditar o sentido de rotação.",
                    instruction: "Configure os pinos digitais 4 e 5 como saídas de controlo de direção do motor.",
                    blocks: [
                        { id: 'b1', text: 'in1 = placa.get_pin("d:4:o")' },
                        { id: 'b2', text: 'in2 = placa.get_pin("d:5:o")' },
                        { id: 'b3', text: 'time.sleep(0.1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3'], ['b2', 'b1', 'b3']], successLog: "Sentidos da Ponte H inicializados!"
                },
                {
                    id: 46, concept: "Marcha em Frente do Motor",
                    story: "Para o motor girar para a frente, um pino de direção deve estar em nível ALTO e o outro em nível BAIXO.",
                    instruction: "Escreva nível 1 no IN1 e nível 0 no IN2 para acionar a rotação direta.",
                    blocks: [
                        { id: 'b1', text: 'in1.write(1)' },
                        { id: 'b2', text: 'in2.write(0)' },
                        { id: 'b3', text: 'time.sleep(2.0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Motor a girar em marcha para a frente!"
                },
                {
                    id: 47, concept: "Inversão de Rotação (Marcha-Atrás)",
                    story: "Para inverter o sentido do motor (marcha-atrás), trocam-se os estados lógicos dos pinos de direção.",
                    instruction: "Inverta a lógica: escreva 0 no IN1 e 1 no IN2, mantendo o motor ativo.",
                    blocks: [
                        { id: 'b1', text: 'in1.write(0)' },
                        { id: 'b2', text: 'in2.write(1)' },
                        { id: 'b3', text: 'time.sleep(2.0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Inversão de polaridade dinâmica validada!"
                },
                {
                    id: 48, concept: "Travagem Eletrónica Ativa",
                    story: "Para imobilizar o motor DC instantaneamente, ambos os pinos da Ponte H devem ser levados a zero.",
                    instruction: "Crie a rotina de paragem total limpando os sinais de IN1 e IN2 em simultâneo.",
                    blocks: [
                        { id: 'b1', text: 'in1.write(0)' },
                        { id: 'b2', text: 'in2.write(0)' },
                        { id: 'b3', text: 'print("Motor imobilizado")' }
                    ],
                    solutions: [['b1', 'b2', 'b3'], ['b2', 'b1', 'b3']], successLog: "Travagem estática concluída!"
                },

                // --- MÓDULO 6: CALLBACKS AVANÇADOS E EXCEÇÕES ---
                {
                    id: 49, concept: "Estrutura Base de Callbacks",
                    story: "Callbacks processam eventos de sensores de forma assíncrona, ativando funções apenas quando há alterações.",
                    instruction: "Declare a função 'processar', registe-a como callback no LDR e ative o relatório de dados do pino.",
                    blocks: [
                        { id: 'b1', text: 'def processar(valor): print(valor)' },
                        { id: 'b2', text: 'ldr.register_callback(processar)' },
                        { id: 'b3', text: 'ldr.enable_reporting()' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Mecanismo assíncrono ativado!"
                },
                {
                    id: 50, concept: "Encerramento Industrial Robusto",
                    story: "O topo das boas práticas: envolver o loop principal num bloco Try/Except para capturar o encerramento do utilizador.",
                    instruction: "Crie o bloco try com loop infinito e capture a saída do teclado executando placa.exit().",
                    blocks: [
                        { id: 'b1', text: 'try:' },
                        { id: 'b2', text: '    while True: time.sleep(1)' },
                        { id: 'b3', text: 'except KeyboardInterrupt:' },
                        { id: 'b4', text: '    placa.exit()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Arquitetura de software profissional validada! PARABÉNS!"
                }
            ]
        }
    },
    computed: {
        currentLevel() {
            return this.levels[this.currentLevelIndex];
        }
    },
    mounted() {
        this.carregarProgresso();
        this.addLog("Iniciando interpretador Python 3.10...", "log-info");
        this.addLog("Procurando placas Arduino conectadas...", "log-info");
        setTimeout(() => { this.loadLevel(); }, 1000);
    },
    methods: {
        shuffleArray(array) {
            let shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        async loadLevel() {
            this.isTyping = true;
            await this.typeWriter(`Carregando Laboratório ${this.currentLevel.id}/50: ${this.currentLevel.concept}...`, "log-info");
            await this.typeWriter(this.currentLevel.story, "log-default");
            
            this.chances = 3;
            this.showSolution = false;
            this.currentSolutionDisplay = [];
            this.selectedBlocks = [];
            this.availableBlocks = this.shuffleArray(this.currentLevel.blocks);
            this.feedbackMsg = "";
            this.isTyping = false;
        },

        selectBlock(block) {
            this.availableBlocks = this.availableBlocks.filter(b => b.id !== block.id);
            this.selectedBlocks.push(block);
            this.feedbackMsg = "";
        },

        removeBlock(index) {
            const block = this.selectedBlocks.splice(index, 1)[0];
            this.availableBlocks.push(block);
            this.feedbackMsg = "";
        },

        clearBlocks() {
            this.availableBlocks.push(...this.selectedBlocks);
            this.selectedBlocks = [];
            this.feedbackMsg = "";
        },

        async runCode() {
            if (this.levelComplete || this.isTyping) return;

            const userSequence = this.selectedBlocks.map(b => b.id);
            const isCorrect = this.currentLevel.solutions.some(solution => {
                return JSON.stringify(solution) === JSON.stringify(userSequence);
            });

            if (isCorrect) {
                this.feedbackType = "success";
                this.feedbackMsg = "Sintaxe Válida! Script executado.";
                this.levelComplete = true; 
                await this.typeWriter(this.currentLevel.successLog, "log-success");
                setTimeout(() => { this.nextLevel(); }, 2000);
            } else {
                this.chances--; 
                this.totalErros++; 
                this.salvarProgresso();
                
                if (this.chances > 0) {
                    this.feedbackType = "error";
                    this.feedbackMsg = `IndentationError ou SyntaxError: Tentativas restantes: ${this.chances}. Revise o código!`;
                    this.addLog(`Traceback (most recent call last). Falhas cometidas: ${3 - this.chances}.`, "log-error");
                } else {
                    this.feedbackType = "error";
                    this.feedbackMsg = "Falha crítica na compilação!";
                    this.addLog("AttributeError: Revelando gabarito...", "log-error");
                    this.displaySolution();
                }
            }
        },

        displaySolution() {
            this.showSolution = true;
            const solutionIds = this.currentLevel.solutions[0];
            this.currentSolutionDisplay = solutionIds.map(id => {
                return this.currentLevel.blocks.find(b => b.id === id);
            });
        },

        nextLevel() {
            if (this.currentLevelIndex < this.levels.length - 1) {
                this.currentLevelIndex++;
                this.levelComplete = false;
                this.salvarProgresso();
                this.loadLevel();
            } else {
                this.levelComplete = true;
                this.selectedBlocks = [];
                this.availableBlocks = [];
                this.showSolution = false;
                this.salvarProgresso();
            }
        },

        salvarProgresso() {
            const saveDado = { nivel: this.currentLevelIndex, erros: this.totalErros };
            localStorage.setItem('pyfirmata2_save', JSON.stringify(saveDado));
        },

        carregarProgresso() {
            const saveSalvo = localStorage.getItem('pyfirmata2_save');
            if (saveSalvo) {
                try {
                    const dados = JSON.parse(saveSalvo);
                    this.currentLevelIndex = parseInt(dados.nivel, 10) || 0;
                    this.totalErros = parseInt(dados.erros, 10) || 0;
                    if(this.currentLevelIndex > 0 && this.currentLevelIndex < this.levels.length) {
                        this.addLog(`[SISTEMA] Progresso restaurado a partir do Nível ${this.currentLevelIndex + 1}.`, "log-success");
                    }
                } catch(e) {
                    console.error("Erro ao ler o arquivo de save:", e);
                }
            }
        },

        resetGame() {
            if(confirm("Isso apagará todo o seu progresso. Tem certeza?")) {
                localStorage.removeItem('pyfirmata2_save');
                this.currentLevelIndex = 0;
                this.totalErros = 0;
                this.levelComplete = false;
                this.logs = [];
                this.addLog("Limpando memória do interpretador...", "log-info");
                setTimeout(() => this.loadLevel(), 1000);
            }
        },

        exportarPDF() {
            const elemento = document.getElementById('relatorio-pdf');
            elemento.style.display = 'block'; 
            const opt = {
                margin:       10,
                filename:     `Certificado-pyFirmata2-${Date.now()}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(elemento).save().then(() => {
                elemento.style.display = 'none';
            });
        },

        addLog(text, type = "log-default") {
            this.logs.push({ text, type });
            this.scrollToBottom();
        },

        typeWriter(text, type) {
            return new Promise(resolve => {
                this.logs.push({ text: "", type });
                let currentLogIndex = this.logs.length - 1;
                let i = 0;
                const interval = setInterval(() => {
                    this.logs[currentLogIndex].text += text.charAt(i);
                    this.scrollToBottom();
                    i++;
                    if (i === text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 15); 
            });
        },

        scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) {
                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(() => { terminal.scrollTop = terminal.scrollHeight; }, 50);
                }
            });
        }
    }
}).mount('#app');