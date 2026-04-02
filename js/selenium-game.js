const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- Estado do Jogo --
        // -
        const menuOpen = ref(false);
        const currentMissionIndex = ref(0);
        const attempts = ref(0);
        const totalErrors = ref(0);
        const logs = ref([]);
        const isTyping = ref(false);
        const feedbackMsg = ref("");
        const feedbackType = ref("");
        const levelComplete = ref(false);
        const gameOver = ref(false);
        const userSelection = ref(null);
        const terminalBody = ref(null);
        
        // --- Banco de Missões (Selenium + Django) ---
        const missions = ref([
            {
                title: "1. Acessando o Painel Admin",
                description: "Inicie o teste navegando até a página de login do Django Admin na sua máquina local.",
                codePrefix: "from selenium import webdriver\ndriver = webdriver.Chrome()\n\n",
                codeSuffix: "",
                answer: 'driver.get("http://localhost:8000/admin/")',
                options: [
                    'driver.navigate("http://localhost:8000/admin/")',
                    'driver.get("http://localhost:8000/admin/")',
                    'driver.open_url("http://localhost:8000/admin/")',
                    'driver.go_to("http://localhost:8000/admin/")'
                ]
            },
            {
                title: "2. Localizando o Usuário",
                description: "Encontre o campo de texto para o nome de usuário. O Django por padrão usa o atributo 'name' como 'username'.",
                codePrefix: "from selenium.webdriver.common.by import By\n\nuser_input = ",
                codeSuffix: "",
                answer: 'driver.find_element(By.NAME, "username")',
                options: [
                    'driver.find_element(By.ID, "username")',
                    'driver.find_element(By.NAME, "username")',
                    'driver.find_element(By.CLASS_NAME, "username")',
                    'driver.get_element(By.NAME, "username")'
                ]
            },
            {
                title: "3. Preenchendo o Usuário",
                description: "Simule a digitação inserindo o texto 'admin' no elemento recém encontrado.",
                codePrefix: "user_input = driver.find_element(By.NAME, 'username')\n",
                codeSuffix: "",
                answer: 'user_input.send_keys("admin")',
                options: [
                    'user_input.type("admin")',
                    'user_input.write("admin")',
                    'user_input.send_keys("admin")',
                    'user_input.fill("admin")'
                ]
            },
            {
                title: "4. Localizando a Senha",
                description: "Agora localize o campo de senha usando XPath focado no atributo name.",
                codePrefix: "pass_input = ",
                codeSuffix: "",
                answer: 'driver.find_element(By.XPATH, "//input[@name=\'password\']")',
                options: [
                    'driver.find_element(By.XPATH, "//input[@name=\'password\']")',
                    'driver.find_element(By.XPATH, "/input[name=\'password\']")',
                    'driver.find_element(By.SELECTOR, "//input[password]")',
                    'driver.find_element(By.XPATH, "//password")'
                ]
            },
            {
                title: "5. Enviando o Formulário",
                description: "Em vez de clicar no botão de login, pressione a tecla ENTER (RETURN) dentro do campo de senha.",
                codePrefix: "from selenium.webdriver.common.keys import Keys\n\npass_input.send_keys('senha123')\n",
                codeSuffix: "",
                answer: 'pass_input.send_keys(Keys.RETURN)',
                options: [
                    'pass_input.submit()',
                    'pass_input.send_keys(Keys.ENTER)',
                    'pass_input.send_keys(Keys.RETURN)',
                    'pass_input.press(Keys.ENTER)'
                ]
            },
            {
                title: "6. Espera Explícita (Explicit Wait)",
                description: "Aguarde até que a div com ID 'content-main' (painel principal do Django) esteja presente na tela antes de continuar.",
                codePrefix: "from selenium.webdriver.support.ui import WebDriverWait\nfrom selenium.webdriver.support import expected_conditions as EC\n\n",
                codeSuffix: "",
                answer: 'WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "content-main")))',
                options: [
                    'driver.implicitly_wait(10, By.ID, "content-main")',
                    'WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "content-main")))',
                    'time.sleep(10)',
                    'WebDriverWait(driver, 10).wait((By.ID, "content-main"))'
                ]
            },
            {
                title: "7. Acessando o App de Usuários",
                description: "Encontre o link do menu lateral do Django cujo texto exato é 'Users'.",
                codePrefix: "users_link = ",
                codeSuffix: "\nusers_link.click()",
                answer: 'driver.find_element(By.LINK_TEXT, "Users")',
                options: [
                    'driver.find_element(By.TEXT, "Users")',
                    'driver.find_element(By.LINK_TEXT, "Users")',
                    'driver.find_element(By.PARTIAL_LINK_TEXT, "Users")',
                    'driver.find_element(By.A, "Users")'
                ]
            },
            {
                title: "8. Validação (Assertion)",
                description: "Use o assert do Python para garantir que a palavra 'Select user' está no título da página atual.",
                codePrefix: "",
                codeSuffix: "",
                answer: 'assert "Select user" in driver.title',
                options: [
                    'assert "Select user" == driver.page_source',
                    'assert "Select user" in driver.title',
                    'assertEqual("Select user", driver.title)',
                    'assert driver.title.contains("Select user")'
                ]
            },
            {
                title: "9. Adicionando Novo Usuário",
                description: "Encontre e clique no botão 'Add user +'. No Django admin, ele geralmente é um link com a classe 'addlink'.",
                codePrefix: "add_btn = ",
                codeSuffix: "\nadd_btn.click()",
                answer: 'driver.find_element(By.CLASS_NAME, "addlink")',
                options: [
                    'driver.find_element(By.CSS_CLASS, "addlink")',
                    'driver.find_element(By.CLASS_NAME, "addlink")',
                    'driver.find_elements(By.CLASS_NAME, "addlink")[0]',
                    'driver.get_element(By.CLASS, "addlink")'
                ]
            },
            {
                title: "10. Trabalhando com Checkboxes",
                description: "Marque a checkbox de 'Staff status'. No Django, esse input tem o ID 'id_is_staff'.",
                codePrefix: "staff_checkbox = driver.find_element(By.ID, 'id_is_staff')\nif not staff_checkbox.is_selected():\n    ",
                codeSuffix: "",
                answer: 'staff_checkbox.click()',
                options: [
                    'staff_checkbox.check()',
                    'staff_checkbox.select()',
                    'staff_checkbox.click()',
                    'staff_checkbox.set(True)'
                ]
            },
            {
                title: "11. Tratando Menus Dropdown (Select)",
                description: "Para selecionar um grupo em um menu <select>, precisamos usar a classe especial Select do Selenium.",
                codePrefix: "from selenium.webdriver.support.ui import Select\n\n",
                codeSuffix: "\ngroup_dropdown.select_by_visible_text('Editores')",
                answer: 'group_dropdown = Select(driver.find_element(By.ID, "id_groups"))',
                options: [
                    'group_dropdown = Select(driver.find_element(By.ID, "id_groups"))',
                    'group_dropdown = driver.find_element(By.ID, "id_groups")',
                    'group_dropdown = Dropdown(driver.find_element(By.ID, "id_groups"))',
                    'group_dropdown = Select.element(By.ID, "id_groups")'
                ]
            },
            {
                title: "12. Executando JavaScript",
                description: "O botão de salvar está lá embaixo. Para evitar erros de clique interceptado, role a página até o fim usando JS.",
                codePrefix: "",
                codeSuffix: "",
                answer: 'driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")',
                options: [
                    'driver.scroll_down()',
                    'driver.run_script("window.scrollTo(bottom);")',
                    'driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")',
                    'driver.execute_javascript("scroll_to_end()")'
                ]
            },
            {
                title: "13. Salvando o Formulário (CSS Selector)",
                description: "Encontre o botão de salvar usando um seletor CSS. Ele é um input cujo atributo name é '_save'.",
                codePrefix: "save_btn = ",
                codeSuffix: "\nsave_btn.click()",
                answer: 'driver.find_element(By.CSS_SELECTOR, "input[name=\'_save\']")',
                options: [
                    'driver.find_element(By.CSS, "input[name=\'_save\']")',
                    'driver.find_element(By.CSS_SELECTOR, "input[name=\'_save\']")',
                    'driver.find_element(By.SELECTOR, "input[name=\'_save\']")',
                    'driver.find_element(By.CSS_SELECTOR, ".input_save")'
                ]
            },
            {
                title: "14. Verificando Mensagem de Sucesso",
                description: "Após salvar, o Django exibe uma mensagem. Localize a lista de mensagens pela classe 'messagelist'.",
                codePrefix: "messages = ",
                codeSuffix: "\nassert 'was added successfully' in messages.text",
                answer: 'driver.find_element(By.CLASS_NAME, "messagelist")',
                options: [
                    'driver.find_element(By.CLASS_NAME, "messagelist")',
                    'driver.find_element(By.CLASS, "messagelist")',
                    'driver.find_elements(By.CLASS_NAME, "messagelist")',
                    'driver.find_element(By.NAME, "messagelist")'
                ]
            },
            {
                title: "15. Lendo Dados de uma Tabela",
                description: "Volte para a lista de usuários e encontre todas as linhas da tabela (<tr>) que ficam dentro do <tbody>.",
                codePrefix: "table_rows = ",
                codeSuffix: "\nprint(f'Encontrados {len(table_rows)} usuários.')",
                answer: 'driver.find_elements(By.XPATH, "//tbody/tr")',
                options: [
                    'driver.find_element(By.TAG_NAME, "tr")',
                    'driver.find_elements(By.CSS_SELECTOR, "tr.tbody")',
                    'driver.find_elements(By.XPATH, "//tbody/tr")',
                    'driver.find_elements(By.TAG_NAME, "tbody > tr")'
                ]
            },
            {
                title: "16. Limpando um Campo",
                description: "Você decidiu buscar por um usuário. Antes de digitar na barra de pesquisa, você deve limpar o campo.",
                codePrefix: "search_bar = driver.find_element(By.ID, 'searchbar')\n",
                codeSuffix: "\nsearch_bar.send_keys('karina')",
                answer: 'search_bar.clear()',
                options: [
                    'search_bar.empty()',
                    'search_bar.delete_all()',
                    'search_bar.clear()',
                    'search_bar.reset()'
                ]
            },
            {
                title: "17. Lidando com Alertas (Pop-ups JS)",
                description: "Imagine que ao deletar um usuário o Django exiba um alert() JS. Como você muda o foco para ele e aceita?",
                codePrefix: "alert = ",
                codeSuffix: "\nalert.accept()",
                answer: 'driver.switch_to.alert',
                options: [
                    'driver.get_alert()',
                    'driver.switch_to.alert',
                    'driver.focus_alert()',
                    'driver.switch_to_window("alert")'
                ]
            },
            {
                title: "18. Navegação: Voltando",
                description: "Simule o clique no botão 'Voltar' do navegador para retornar à página anterior.",
                codePrefix: "# Volta na história do navegador\n",
                codeSuffix: "",
                answer: 'driver.back()',
                options: [
                    'driver.go_back()',
                    'driver.previous()',
                    'driver.back()',
                    'driver.return()'
                ]
            },
            {
                title: "19. Captura de Tela (Evidência)",
                description: "Testes automatizados falharam? Tire um print da tela inteira do navegador e salve como 'erro_admin.png'.",
                codePrefix: "# Gera uma imagem do painel\n",
                codeSuffix: "",
                answer: 'driver.save_screenshot("erro_admin.png")',
                options: [
                    'driver.screenshot("erro_admin.png")',
                    'driver.save_screenshot("erro_admin.png")',
                    'driver.take_screenshot("erro_admin.png")',
                    'driver.print_screen("erro_admin.png")'
                ]
            },
            {
                title: "20. Encerrando a Sessão",
                description: "Missão cumprida. Finalize o WebDriver fechando todas as janelas e liberando o processo.",
                codePrefix: "# Encerra o WebDriver\n",
                codeSuffix: "",
                answer: 'driver.quit()',
                options: [
                    'driver.close()',
                    'driver.exit()',
                    'driver.stop()',
                    'driver.quit()'
                ]
            }
        ]);

        const currentMission = computed(() => missions.value[currentMissionIndex.value]);
        
        const progressPercentage = computed(() => ((currentMissionIndex.value) / missions.value.length) * 100);

        const codeLines = computed(() => {
            if (!currentMission.value) return [];
            // Junta prefixo, lacuna (???) e sufixo, depois divide por quebra de linha
            const fullCode = (currentMission.value.codePrefix || "") + "???" + (currentMission.value.codeSuffix || "");
            return fullCode.split('\n');
        });

        const successRate = computed(() => {
            const maxErrorsTolerated = missions.value.length * 2; 
            const calc = ((maxErrorsTolerated - totalErrors.value) / maxErrorsTolerated) * 100;
            return Math.max(0, calc).toFixed(0);
        });

        // --- Lógica Principal ---
        const formatCodeLine = (line) => {
            if (line.includes("???")) {
                if (userSelection.value) {
                    return line.replace("???", `<span class="code-slot filled">${userSelection.value}</span>`);
                }
                return line.replace("???", `<span class="code-slot">...</span>`);
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
                }, 15); // Velocidade do terminal
            });
        };

        // Embaralhador de Array
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const loadMission = async () => {
            isTyping.value = true;
            addLog("------------------------------------", "log-info");
            await typeWriter(`Carregando cenário: ${currentMission.value.title}`, "log-info");
            await typeWriter(`>> ${currentMission.value.description}`, "log-default");
            
            // Embaralha as opções do cenário atual
            currentMission.value.options = shuffleArray([...currentMission.value.options]);
            
            isTyping.value = false;
        };

        const resetMissionState = () => {
            userSelection.value = null; 
            attempts.value = 0; 
            levelComplete.value = false; 
            feedbackMsg.value = ""; 
            feedbackType.value = "";
        };

        const nextMission = () => {
            if (currentMissionIndex.value < missions.value.length - 1) {
                currentMissionIndex.value++;
                resetMissionState();
                loadMission();
            } else {
                gameOver.value = true;
                addLog("Bateria de testes finalizada. Desligando WebDriver...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (levelComplete.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;
            feedbackMsg.value = "";
        };

        const runCode = async () => {
            if (!userSelection.value || levelComplete.value || isTyping.value) return;

            if (userSelection.value === currentMission.value.answer) {
                // Acertou
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Script compilado e executado com sucesso! (Status 200)";
                levelComplete.value = true;
                
                await typeWriter(`✓ Cenário ${currentMissionIndex.value + 1} validado com sucesso.`, "log-success");

                setTimeout(nextMission, 2000);

            } else {
                // Errou
                attempts.value++;
                totalErrors.value++;
                
                if (attempts.value >= 3) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. Autocompletando código correto...`;
                    levelComplete.value = true;
                    userSelection.value = currentMission.value.answer; // Injeta a resposta correta
                    
                    await typeWriter(`✗ Falha Crítica. Injetando bypass de segurança...`, "log-error");
                    
                    setTimeout(nextMission, 3500);
                } else {
                    let chancesLeft = 3 - attempts.value;
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> SyntaxError/NoSuchElementException. Restam ${chancesLeft} chance(s).`;
                    addLog(`Erro na execução da instrução. Retrying...`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Automação sólida. Capacidade excelente em mapeamento e Selenium IDE.";
            if (successRate.value < 70) performanceMsg = "Recomenda-se revisão em XPath, CSS Selectors e rotinas do WebDriver.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de QA Automator</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação: Selenium + Django</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Auditoria:</strong> ${data}</p>
                    <p>Este documento atesta a capacidade técnica do analista na criação de scripts em Python para automação web, contornando barreiras em cenários críticos de teste.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Indicadores de Qualidade</h3>
                        <p style="font-size: 18px; color: #555; margin: 10px 0;">Cenários Processados: ${missions.value.length}</p>
                        <p style="font-size: 18px; color: ${totalErrors.value === 0 ? '#10B981' : '#EF4444'}; margin: 10px 0;">Desvios de Código: ${totalErrors.value}</p>
                        
                        <p style="font-size: 28px; color: ${successRate.value >= 70 ? '#10B981' : (successRate.value >= 50 ? '#d9a05b' : '#EF4444')}; margin: 25px 0 15px;">
                            <strong>Taxa de Sucesso: ${successRate.value}%</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado pelo QA.SIMULATOR
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Selenium_QA_Report_${new Date().toISOString().slice(0,10)}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(printElement).save();
        };

        const restartGame = () => {
            currentMissionIndex.value = 0; 
            totalErrors.value = 0; 
            logs.value = []; 
            gameOver.value = false;
            resetMissionState();
            addLog("Reiniciando instância WebDriver...", "log-info");
            setTimeout(() => loadMission(), 1000);
        };

        onMounted(() => {
            addLog("Iniciando WebDriver local...", "log-info");
            setTimeout(() => { loadMission(); }, 1000);
        });

        return {
            menuOpen,
            missions,
            currentMissionIndex,
            currentMission,
            progressPercentage,
            codeLines,
            successRate,
            attempts,
            totalErrors,
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
            restartGame
        };
    }
}).mount('#app');