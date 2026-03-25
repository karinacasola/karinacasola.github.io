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
            
            // 50 Desafios de MicroPython para ESP32
            levels: [
                // === BLOCO 1: GPIO BÁSICO (1-10) ===
                {
                    id: 1, concept: "Piscar LED Interno", story: "O pino 2 do ESP32 tem um LED azul. Precisamos acendê-lo e apagá-lo.", instruction: "Ligue e desligue o pino 2 usando delay.",
                    blocks: [
                        { id: 'b1', text: 'from machine import Pin' }, { id: 'b2', text: 'import time' },
                        { id: 'b3', text: 'led = Pin(2, Pin.OUT)' }, { id: 'b4', text: 'led.value(1)' },
                        { id: 'b5', text: 'time.sleep(1)' }, { id: 'b6', text: 'led.value(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6'], ['b2', 'b1', 'b3', 'b4', 'b5', 'b6']],
                    successLog: "LED aceso e apagado. Hello World do Hardware concluído!"
                },
                {
                    id: 2, concept: "Loop Infinito (Blink)", story: "Agora queremos que o LED pisque infinitamente.", instruction: "Crie um loop while True para piscar o LED.",
                    blocks: [
                        { id: 'b1', text: 'while True:' }, { id: 'b2', text: '    led.on()' },
                        { id: 'b3', text: '    time.sleep(0.5)' }, { id: 'b4', text: '    led.off()' }, { id: 'b5', text: '    time.sleep(0.5)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5'], ['b1', 'b4', 'b3', 'b2', 'b5']],
                    successLog: "Loop infinito estabelecido. Blink contínuo!"
                },
                {
                    id: 3, concept: "Leitura de Botão", story: "Precisamos detectar quando um usuário aperta o botão no Pino 4.", instruction: "Configure o pino 4 como entrada (IN).",
                    blocks: [
                        { id: 'b1', text: 'from machine import Pin' }, { id: 'b2', text: 'btn = Pin(4, Pin.IN)' },
                        { id: 'b3', text: 'estado = btn.value()' }, { id: 'b4', text: 'print(estado)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Botão lido com sucesso!"
                },
                {
                    id: 4, concept: "Botão com Pull-Up", story: "Para evitar flutuação (ruído), o botão precisa de um resistor interno de PULL_UP.", instruction: "Configure a entrada com PULL_UP.",
                    blocks: [
                        { id: 'b1', text: 'btn = Pin(4, Pin.IN, Pin.PULL_UP)' }, { id: 'b2', text: 'if btn.value() == 0:' },
                        { id: 'b3', text: '    print("Pressionado!")' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Pull-up ativado. Ruído eliminado."
                },
                {
                    id: 5, concept: "Botão Controlando LED", story: "Se o botão for pressionado, o LED deve ligar. Caso contrário, desligar.", instruction: "Use if/else para associar a leitura do botão ao LED.",
                    blocks: [
                        { id: 'b1', text: 'if btn.value() == 1:' }, { id: 'b2', text: '    led.on()' },
                        { id: 'b3', text: 'else:' }, { id: 'b4', text: '    led.off()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Lógica condicional aplicada ao hardware."
                },
                {
                    id: 6, concept: "Toggle (Alternar Estado)", story: "Há um jeito elegante de piscar sem 'on/off', apenas invertendo o estado atual.", instruction: "Use o método .toggle() (ou inverte o valor) dentro do loop.",
                    blocks: [
                        { id: 'b1', text: 'while True:' }, { id: 'b2', text: '    led.value(not led.value())' },
                        { id: 'b3', text: '    time.sleep(1)' }, { id: 'b4', text: '    led.toggle()' }
                    ],
                    solutions: [['b1', 'b2', 'b3'], ['b1', 'b4', 'b3']], successLog: "Estado alternado com eficiência."
                },
                {
                    id: 7, concept: "Semáforo: Vermelho", story: "Vamos criar um semáforo. Ligue o LED vermelho (Pino 5).", instruction: "Instancie o Pino 5 como saída e ligue.",
                    blocks: [
                        { id: 'b1', text: 'red = Pin(5, Pin.OUT)' }, { id: 'b2', text: 'red.value(1)' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Sinal vermelho acionado!"
                },
                {
                    id: 8, concept: "Semáforo Completo", story: "Faça a transição Verde -> Amarelo -> Vermelho.", instruction: "Ordene os blocos de estado.",
                    blocks: [
                        { id: 'b1', text: 'green.on()' }, { id: 'b2', text: 'time.sleep(5)' },
                        { id: 'b3', text: 'green.off(); yellow.on()' }, { id: 'b4', text: 'time.sleep(2)' },
                        { id: 'b5', text: 'yellow.off(); red.on()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Ciclo de trânsito simulado."
                },
                {
                    id: 9, concept: "Pino Touch", story: "O ESP32 possui pinos sensíveis ao toque humano.", instruction: "Faça a leitura de um TouchPad (Pino 4).",
                    blocks: [
                        { id: 'b1', text: 'from machine import TouchPad, Pin' }, { id: 'b2', text: 't = TouchPad(Pin(4))' },
                        { id: 'b3', text: 'valor = t.read()' }, { id: 'b4', text: 'print(valor)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Capacitância lida com sucesso."
                },
                {
                    id: 10, concept: "Lógica Touch", story: "Acenda o LED se o toque for forte (valor menor que 100).", instruction: "Leia o touch e crie um if.",
                    blocks: [
                        { id: 'b1', text: 'if t.read() < 100:' }, { id: 'b2', text: '    led.on()' },
                        { id: 'b3', text: 'else:' }, { id: 'b4', text: '    led.off()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Lâmpada touch ativada."
                },
                // === BLOCO 2: SINAIS ANALÓGICOS - PWM & ADC (11-20) ===
                {
                    id: 11, concept: "PWM Básico", story: "Para controlar o brilho do LED, usamos PWM (Pulse Width Modulation).", instruction: "Importe e configure o PWM no Pino 2 com frequência de 1000Hz.",
                    blocks: [
                        { id: 'b1', text: 'from machine import Pin, PWM' }, { id: 'b2', text: 'pwm_led = PWM(Pin(2))' },
                        { id: 'b3', text: 'pwm_led.freq(1000)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Frequência PWM configurada."
                },
                {
                    id: 12, concept: "Controle de Brilho", story: "Altere o Duty Cycle (0 a 1023) para ajustar a luminosidade para 50%.", instruction: "Defina o duty cycle para 512 (metade).",
                    blocks: [
                        { id: 'b1', text: 'pwm_led.duty(512)' }
                    ],
                    solutions: [['b1']], successLog: "Brilho reduzido pela metade."
                },
                {
                    id: 13, concept: "Efeito Fading (Fade In)", story: "Crie um efeito de fade in (brilho aumentando gradualmente).", instruction: "Faça um loop for variando o duty do PWM.",
                    blocks: [
                        { id: 'b1', text: 'for i in range(1024):' }, { id: 'b2', text: '    pwm_led.duty(i)' },
                        { id: 'b3', text: '    time.sleep(0.01)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Efeito visual Fade In rodando."
                },
                {
                    id: 14, concept: "Leitura Analógica (ADC)", story: "Precisamos ler a posição de um potenciômetro (Pino 34).", instruction: "Configure o pino 34 como ADC e faça a leitura.",
                    blocks: [
                        { id: 'b1', text: 'from machine import Pin, ADC' }, { id: 'b2', text: 'pot = ADC(Pin(34))' },
                        { id: 'b3', text: 'pot.atten(ADC.ATTN_11DB)' }, { id: 'b4', text: 'valor = pot.read()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Tensão máxima expandida para 3.3V (11DB). Potenciômetro lido."
                },
                {
                    id: 15, concept: "Mapeamento Analógico", story: "Ligue o potenciômetro direto ao brilho do LED.", instruction: "Leia o ADC e jogue o valor direto no duty do PWM.",
                    blocks: [
                        { id: 'b1', text: 'while True:' }, { id: 'b2', text: '    leitura = pot.read()' },
                        { id: 'b3', text: '    pwm_led.duty(leitura // 4)' }, { id: 'b4', text: '    time.sleep(0.1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Controle manual de brilho perfeito."
                },
                {
                    id: 16, concept: "Controlando um Servo", story: "Servomotores usam PWM em 50Hz.", instruction: "Configure a frequência de um pino de servo para 50Hz.",
                    blocks: [
                        { id: 'b1', text: 'servo = PWM(Pin(15))' }, { id: 'b2', text: 'servo.freq(50)' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Sinal do Servo calibrado em 50Hz."
                },
                {
                    id: 17, concept: "Movendo o Servo", story: "O Duty para servos (em 10 bits) varia entre ~40 (0°) e ~115 (180°).", instruction: "Gire o servo para 90 graus (duty ~77).",
                    blocks: [
                        { id: 'b1', text: 'servo.duty(77)' }, { id: 'b2', text: 'time.sleep(1)' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Posicionamento do braço mecânico concluído."
                },
                {
                    id: 18, concept: "Sensor DHT11 (Temperatura)", story: "Hora de medir o clima! Importe a biblioteca dht e configure no pino 4.", instruction: "Instancie o objeto DHT11.",
                    blocks: [
                        { id: 'b1', text: 'import dht' }, { id: 'b2', text: 'from machine import Pin' },
                        { id: 'b3', text: 'sensor = dht.DHT11(Pin(4))' }
                    ],
                    solutions: [['b1', 'b2', 'b3'], ['b2', 'b1', 'b3']], successLog: "Driver de temperatura carregado."
                },
                {
                    id: 19, concept: "Lendo Temperatura e Umidade", story: "Antes de pegar os dados, você deve chamar sensor.measure().", instruction: "Realize a medição e armazene as variáveis.",
                    blocks: [
                        { id: 'b1', text: 'sensor.measure()' }, { id: 'b2', text: 't = sensor.temperature()' },
                        { id: 'b3', text: 'h = sensor.humidity()' }, { id: 'b4', text: 'print(t, h)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4'], ['b1', 'b3', 'b2', 'b4']], successLog: "Telemetria ambiental captada."
                },
                {
                    id: 20, concept: "Alarme de Calor", story: "Se a temperatura passar de 30°C, acenda o LED vermelho.", instruction: "Crie a lógica if para o alarme.",
                    blocks: [
                        { id: 'b1', text: 'if t > 30:' }, { id: 'b2', text: '    red_led.on()' },
                        { id: 'b3', text: 'else:' }, { id: 'b4', text: '    red_led.off()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Alarme térmico configurado."
                },
                // === BLOCO 3: I2C & DISPLAYS (21-30) ===
                {
                    id: 21, concept: "Iniciando Barramento I2C", story: "Displays OLED usam I2C. Defina SCL no 22 e SDA no 21.", instruction: "Importe e instancie o SoftI2C.",
                    blocks: [
                        { id: 'b1', text: 'from machine import Pin, SoftI2C' },
                        { id: 'b2', text: 'i2c = SoftI2C(scl=Pin(22), sda=Pin(21))' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Barramento I2C operacional."
                },
                {
                    id: 22, concept: "OLED (SSD1306)", story: "Crie o objeto do display informando a resolução (128x64).", instruction: "Instancie o ssd1306 passando o i2c.",
                    blocks: [
                        { id: 'b1', text: 'import ssd1306' },
                        { id: 'b2', text: 'display = ssd1306.SSD1306_I2C(128, 64, i2c)' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Display OLED inicializado."
                },
                {
                    id: 23, concept: "Escrevendo no Display", story: "Mande um texto para a tela na posição x=0, y=0.", instruction: "Escreva e não esqueça do display.show().",
                    blocks: [
                        { id: 'b1', text: 'display.text("Ola Wokwi", 0, 0)' },
                        { id: 'b2', text: 'display.show()' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Pixels desenhados no OLED."
                },
                {
                    id: 24, concept: "Limpando o Display", story: "A tela sobrepõe textos. Antes de um novo texto, limpe a tela.", instruction: "Use o método fill(0) para apagar.",
                    blocks: [
                        { id: 'b1', text: 'display.fill(0)' },
                        { id: 'b2', text: 'display.text("Tchau", 0, 10)' },
                        { id: 'b3', text: 'display.show()' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Buffer limpo e tela atualizada."
                },
                {
                    id: 25, concept: "NeoPixel (Fita de LEDs)", story: "Importe e inicie a fita endereçável (Pino 13, 8 LEDs).", instruction: "Importe neopixel e instancie.",
                    blocks: [
                        { id: 'b1', text: 'import neopixel' },
                        { id: 'b2', text: 'np = neopixel.NeoPixel(Pin(13), 8)' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Protocolo WS2812B estabelecido."
                },
                {
                    id: 26, concept: "NeoPixel: Ligando cor", story: "Mude a cor do primeiro LED (índice 0) para vermelho (R, G, B) e aplique.", instruction: "Passe a tupla (255,0,0) e chame np.write().",
                    blocks: [
                        { id: 'b1', text: 'np[0] = (255, 0, 0)' },
                        { id: 'b2', text: 'np.write()' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Pixel colorido e aceso."
                },
                {
                    id: 27, concept: "NeoPixel: Limpar Todos", story: "Crie um laço for para apagar os 8 LEDs de uma vez.", instruction: "Atribua (0,0,0) iterando o tamanho da fita.",
                    blocks: [
                        { id: 'b1', text: 'for i in range(8):' },
                        { id: 'b2', text: '    np[i] = (0, 0, 0)' },
                        { id: 'b3', text: 'np.write()' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Todos os pixels apagados."
                },
                {
                    id: 28, concept: "Sensor Ultrassônico HC-SR04", story: "Meça a distância! O SR04 requer um pulso no pino Trigger.", instruction: "Instancie Trigger OUT e Echo IN.",
                    blocks: [
                        { id: 'b1', text: 'trig = Pin(5, Pin.OUT)' },
                        { id: 'b2', text: 'echo = Pin(18, Pin.IN)' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Pinos do Sonar mapeados."
                },
                {
                    id: 29, concept: "O Pulso do Sonar", story: "Para iniciar a leitura, o pino trig deve ir a HIGH por 10 microsegundos.", instruction: "Use time.sleep_us para o pulso.",
                    blocks: [
                        { id: 'b1', text: 'trig.value(1)' },
                        { id: 'b2', text: 'time.sleep_us(10)' },
                        { id: 'b3', text: 'trig.value(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Onda sonora emitida."
                },
                {
                    id: 30, concept: "Lendo Tempo de Pulso", story: "Usamos machine.time_pulse_us para medir a resposta do ECHO.", instruction: "Capture o pulso de nível 1.",
                    blocks: [
                        { id: 'b1', text: 'from machine import time_pulse_us' },
                        { id: 'b2', text: 't = time_pulse_us(echo, 1, 30000)' },
                        { id: 'b3', text: 'distancia = (t * 0.0343) / 2' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Distância calculada em centímetros!"
                },
                // === BLOCO 4: INTERNET DAS COISAS - WIFI & WEB (31-40) ===
                {
                    id: 31, concept: "Ativando o WiFi", story: "Hora de colocar o ESP na nuvem. Inicie a interface STA (Station).", instruction: "Importe network e ative a interface.",
                    blocks: [
                        { id: 'b1', text: 'import network' },
                        { id: 'b2', text: 'wlan = network.WLAN(network.STA_IF)' },
                        { id: 'b3', text: 'wlan.active(True)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Antena WiFi energizada."
                },
                {
                    id: 32, concept: "Conectando na Rede", story: "Conecte-se ao roteador informando SSID e senha.", instruction: "Use wlan.connect() com suas credenciais.",
                    blocks: [
                        { id: 'b1', text: 'wlan.connect("MinhaRede", "senha123")' }
                    ],
                    solutions: [['b1']], successLog: "Handshake iniciado..."
                },
                {
                    id: 33, concept: "Aguardando Conexão", story: "A conexão leva tempo. Crie um loop que espera até wlan.isconnected() ser True.", instruction: "Use while not e delay.",
                    blocks: [
                        { id: 'b1', text: 'while not wlan.isconnected():' },
                        { id: 'b2', text: '    pass' },
                        { id: 'b3', text: 'print("Conectado!", wlan.ifconfig())' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "IP obtido. Conexão bem-sucedida!"
                },
                {
                    id: 34, concept: "Requisição GET HTTP", story: "Use urequests para pegar dados de uma API externa.", instruction: "Importe urequests, chame um GET e mostre o texto.",
                    blocks: [
                        { id: 'b1', text: 'import urequests' },
                        { id: 'b2', text: 'resposta = urequests.get("http://api.com/dados")' },
                        { id: 'b3', text: 'print(resposta.text)' },
                        { id: 'b4', text: 'resposta.close()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Dados JSON parseados com sucesso."
                },
                {
                    id: 35, concept: "Enviando Dados (POST)", story: "Mande um payload JSON para o seu servidor simulado.", instruction: "Faça um urequests.post passando json=payload.",
                    blocks: [
                        { id: 'b1', text: 'dados = {"temp": 25.4}' },
                        { id: 'b2', text: 'r = urequests.post("http://api.com/up", json=dados)' },
                        { id: 'b3', text: 'r.close()' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Payload POST transmitido à nuvem."
                },
                {
                    id: 36, concept: "MQTT: Instanciando Cliente", story: "MQTT é leve e perfeito para IoT. Importe umqtt e crie o cliente.", instruction: "Instancie MQTTClient.",
                    blocks: [
                        { id: 'b1', text: 'from umqtt.simple import MQTTClient' },
                        { id: 'b2', text: 'client = MQTTClient("esp32_id", "broker.mqtt.com")' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Objeto MQTTClient gerado."
                },
                {
                    id: 37, concept: "MQTT: Conectando", story: "Conecte o cliente ao broker Mosquitto da rede.", instruction: "Simplesmente chame o connect.",
                    blocks: [
                        { id: 'b1', text: 'client.connect()' },
                        { id: 'b2', text: 'print("Broker acessado.")' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Sessão MQTT estabelecida."
                },
                {
                    id: 38, concept: "MQTT: Publicando (Publish)", story: "Publique a string 'ON' no tópico 'casa/luz'.", instruction: "Use client.publish(tópico, mensagem).",
                    blocks: [
                        { id: 'b1', text: 'client.publish("casa/luz", "ON")' }
                    ],
                    solutions: [['b1']], successLog: "Mensagem publicada para todos os inscritos."
                },
                {
                    id: 39, concept: "MQTT: Inscrevendo (Subscribe)", story: "Para ouvir tópicos, você deve definir um callback e se inscrever (subscribe).", instruction: "Defina o set_callback e use subscribe.",
                    blocks: [
                        { id: 'b1', text: 'client.set_callback(recebeu_msg)' },
                        { id: 'b2', text: 'client.subscribe("casa/alarme")' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Inscrição concluída. Escutando tópico."
                },
                {
                    id: 40, concept: "MQTT: Loop de Escuta", story: "Para não travar tudo, mantenha a verificação do broker ativa não-bloqueante.", instruction: "Use client.check_msg() no seu while True.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    client.check_msg()' },
                        { id: 'b3', text: '    time.sleep(0.5)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Rotina de polling não-bloqueante em execução."
                },
                // === BLOCO 5: INTERRUPÇÕES, TIMERS & DEEP SLEEP (41-50) ===
                {
                    id: 41, concept: "Interrupção de Hardware (IRQ)", story: "Em vez de ler botões sem parar (polling), avise o chip APENAS quando for clicado.", instruction: "Defina uma função handler.",
                    blocks: [
                        { id: 'b1', text: 'def botao_pressionado(pino):' },
                        { id: 'b2', text: '    print("Interrupção acionada!")' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Handler de IRQ alocado na memória."
                },
                {
                    id: 42, concept: "Registrando o IRQ", story: "Atrele o Pino 4 à função 'botao_pressionado' na Borda de Descida (FALLING).", instruction: "Chame btn.irq().",
                    blocks: [
                        { id: 'b1', text: 'btn.irq(trigger=Pin.IRQ_FALLING, handler=botao_pressionado)' }
                    ],
                    solutions: [['b1']], successLog: "Hardware IRQ mapeado com sucesso."
                },
                {
                    id: 43, concept: "Timer por Hardware", story: "Execute um código exatamente a cada 2 segundos, não importa o que aconteça.", instruction: "Importe e instancie Timer(0).",
                    blocks: [
                        { id: 'b1', text: 'from machine import Timer' },
                        { id: 'b2', text: 'tim = Timer(0)' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Timer 0 do chip ativado."
                },
                {
                    id: 44, concept: "Iniciando o Timer", story: "Defina o Timer para modo PERIODIC em 2000ms, chamando a função 'pisca'.", instruction: "Configure a rotina do timer.",
                    blocks: [
                        { id: 'b1', text: 'tim.init(period=2000, mode=Timer.PERIODIC, callback=pisca)' }
                    ],
                    solutions: [['b1']], successLog: "Interrupção de timer agendada!"
                },
                {
                    id: 45, concept: "Real Time Clock (RTC)", story: "Mantenha a contagem de tempo real configurando a data atual.", instruction: "Instancie o RTC e ajuste (datetime tuple).",
                    blocks: [
                        { id: 'b1', text: 'from machine import RTC' },
                        { id: 'b2', text: 'rtc = RTC()' },
                        { id: 'b3', text: 'rtc.datetime((2026, 3, 25, 0, 12, 32, 0, 0))' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Relógio em tempo real sincronizado."
                },
                {
                    id: 46, concept: "Sistema de Arquivos", story: "Para não perder dados ao desligar, grave num arquivo .txt dentro da flash do ESP.", instruction: "Abra 'log.txt' para escrita e grave.",
                    blocks: [
                        { id: 'b1', text: 'with open("log.txt", "w") as f:' },
                        { id: 'b2', text: '    f.write("Sistema reiniciado.")' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Memória não-volátil (Flash) gravada."
                },
                {
                    id: 47, concept: "Lendo Arquivos Internos", story: "Leia os arquivos contidos no seu chip usando a biblioteca os.", instruction: "Importe os e liste o diretório atual.",
                    blocks: [
                        { id: 'b1', text: 'import os' },
                        { id: 'b2', text: 'arquivos = os.listdir()' },
                        { id: 'b3', text: 'print(arquivos)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Diretório do MicroPython listado."
                },
                {
                    id: 48, concept: "Preparo para Deep Sleep", story: "Sistemas à bateria precisam dormir. Configure o pino 0 (Wake Up) para acordar o chip.", instruction: "Importe esp32 e defina a fonte de despertar.",
                    blocks: [
                        { id: 'b1', text: 'import esp32' },
                        { id: 'b2', text: 'wake_pin = Pin(0, Pin.IN)' },
                        { id: 'b3', text: 'esp32.wake_on_ext0(pin=wake_pin, level=esp32.WAKEUP_ALL_LOW)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Gatilho ext0 de despertar armado."
                },
                {
                    id: 49, concept: "Hibernando (Deep Sleep)", story: "Agora, mande o ESP32 dormir, desligando WiFi, Bluetooth e CPU, gastando microampères.", instruction: "Use machine.deepsleep().",
                    blocks: [
                        { id: 'b1', text: 'import machine' },
                        { id: 'b2', text: 'print("Entrando em Deep Sleep...")' },
                        { id: 'b3', text: 'machine.deepsleep()' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "ZZZ... Energia reduzida a 10µA."
                },
                {
                    id: 50, concept: "Desafio Final: O Loop IoT", story: "Junte tudo: Leia o sensor, conecte WiFi e vá dormir por 10 segundos.", instruction: "Construa o algoritmo mestre de telemetria.",
                    blocks: [
                        { id: 'b1', text: 'conectar_wifi()' },
                        { id: 'b2', text: 'temp = ler_sensor()' },
                        { id: 'b3', text: 'enviar_nuvem(temp)' },
                        { id: 'b4', text: 'machine.deepsleep(10000)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "SISTEMA IOT COMPLETO CONCLUÍDO! VOCÊ ZEROU O LABORATÓRIO!"
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
        // 1. Carrega o save do usuário ao montar o app
        this.carregarProgresso();

        this.addLog("Iniciando ambiente MicroPython (Firmware 1.20)...", "log-info");
        this.addLog("Verificando cache de memória...", "log-info");
        
        setTimeout(() => {
            this.loadLevel();
        }, 1000);
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
            await this.typeWriter(`Carregando Laboratório ${this.currentLevel.id}: ${this.currentLevel.concept}...`, "log-info");
            await this.typeWriter(this.currentLevel.story, "log-default");
            
            // Reseta Estado do Nível e Chances
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
            // Trava de segurança: impede duplo clique ou cliques enquanto o script analisa
            if (this.levelComplete || this.isTyping) return;

            const userSequence = this.selectedBlocks.map(b => b.id);
            
            const isCorrect = this.currentLevel.solutions.some(solution => {
                return JSON.stringify(solution) === JSON.stringify(userSequence);
            });

            if (isCorrect) {
                // SUCESSO
                this.feedbackType = "success";
                this.feedbackMsg = "Sintaxe Válida! Código compilado.";
                this.levelComplete = true; 

                await this.typeWriter(this.currentLevel.successLog, "log-success");

                setTimeout(() => {
                    this.nextLevel();
                }, 2000);

            } else {
                // ERRO
                this.chances--; 
                this.totalErros++; 
                this.salvarProgresso(); // Salva estado para não burlar dando refresh da página
                
                if (this.chances > 0) {
                    this.feedbackType = "error";
                    this.feedbackMsg = `SyntaxError: Tentativas restantes: ${this.chances}. Revise o código!`;
                    this.addLog(`Traceback (most recent call last). Chips estourados: ${3 - this.chances}.`, "log-error");
                } else {
                    // ZEROU AS CHANCES - MOSTRA SOLUÇÃO
                    this.feedbackType = "error";
                    this.feedbackMsg = "Curto-circuito na placa!";
                    this.addLog("Guru Meditation Error: Core 1 panic'ed. Revelando gabarito...", "log-error");
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
                this.salvarProgresso(); // Salva que avançou de nível
                this.loadLevel();
            } else {
                this.levelComplete = true;
                this.selectedBlocks = [];
                this.availableBlocks = [];
                this.showSolution = false;
                this.salvarProgresso(); // Salva a conclusão
            }
        },

        // --- SISTEMA DE SALVAMENTO ---
        salvarProgresso() {
            const saveDado = {
                nivel: this.currentLevelIndex,
                erros: this.totalErros
            };
            localStorage.setItem('iot_esp32_save', JSON.stringify(saveDado));
        },

        carregarProgresso() {
            const saveSalvo = localStorage.getItem('iot_esp32_save');
            if (saveSalvo) {
                try {
                    const dados = JSON.parse(saveSalvo);
                    // O parseInt obriga o navegador a tratar como número inteiro
                    this.currentLevelIndex = parseInt(dados.nivel, 10) || 0;
                    this.totalErros = parseInt(dados.erros, 10) || 0;
                    
                    // Só emite o aviso se realmente já tiver passado do Nível 1 e ainda não finalizou
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
                localStorage.removeItem('iot_esp32_save');
                this.currentLevelIndex = 0;
                this.totalErros = 0;
                this.levelComplete = false;
                this.logs = [];
                this.addLog("Formatando Flash... Memória limpa.", "log-info");
                setTimeout(() => this.loadLevel(), 1000);
            }
        },

        // --- SISTEMA DE EXPORTAÇÃO PDF ---
        exportarPDF() {
            const elemento = document.getElementById('relatorio-pdf');
            
            // Exibe a div oculta apenas para a captura
            elemento.style.display = 'block'; 
            
            const opt = {
                margin:       10,
                filename:     `Certificado-MicroPython-ESP32-${Date.now()}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Gera o PDF e logo depois volta a esconder a div
            html2pdf().set(opt).from(elemento).save().then(() => {
                elemento.style.display = 'none';
            });
        },

        // --- SISTEMA DE LOGS E TYPING ---
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
                    setTimeout(() => {
                        terminal.scrollTop = terminal.scrollHeight;
                    }, 50);
                }
            });
        }
    }
}).mount('#app');