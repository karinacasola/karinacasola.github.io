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
            
            // 30 Desafios baseados em I/O (Input/Output) em Java
            levels: [
                {
                    id: 1, 
                    concept: "Importando a Classe File", 
                    story: "Antes de manipular qualquer arquivo em Java, precisamos importar as classes corretas do pacote java.io.", 
                    instruction: "Monte a estrutura básica para importar a classe File e iniciar sua classe principal.",
                    blocks: [
                        { id: 'b1', text: 'import java.io.File;' },
                        { id: 'b2', text: 'public class Manipulador {' },
                        { id: 'b3', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Pacote java.io importado com sucesso!"
                },
                {
                    id: 2, 
                    concept: "Instanciando um Arquivo", 
                    story: "A classe File representa o caminho e o nome do arquivo, mas não cria o arquivo físico imediatamente.", 
                    instruction: "Dentro do método main, instancie um objeto File apontando para 'dados.txt'.",
                    blocks: [
                        { id: 'b1', text: 'public static void main(String[] args) {' },
                        { id: 'b2', text: '    File arquivo = new File("dados.txt");' },
                        { id: 'b3', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Objeto File instanciado! O caminho agora está mapeado na memória."
                },
                {
                    id: 3, 
                    concept: "Verificando se o Arquivo Existe", 
                    story: "É uma boa prática verificar se um arquivo físico já existe antes de tentar lê-lo ou apagá-lo.", 
                    instruction: "Use o método exists() da classe File dentro de um bloco condicional (if).",
                    blocks: [
                        { id: 'b1', text: 'if (arquivo.exists()) {' },
                        { id: 'b2', text: '    System.out.println("Encontrado!");' },
                        { id: 'b3', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Verificação de segurança estruturada. Prevenção de erros garantida."
                },
                {
                    id: 4, 
                    concept: "Apagando um Arquivo (Delete)", 
                    story: "Para deletar um arquivo do sistema operacional, usamos o método delete() da classe File.", 
                    instruction: "Crie o fluxo que verifica se o arquivo existe e, caso positivo, apague-o.",
                    blocks: [
                        { id: 'b1', text: 'if (arquivo.exists()) {' },
                        { id: 'b2', text: '    arquivo.delete();' },
                        { id: 'b3', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Comando de exclusão (Delete do CRUD) validado."
                },
                {
                    id: 5, 
                    concept: "Obrigação do Tratamento de Exceções", 
                    story: "Operações de I/O são arriscadas (o disco pode estar cheio, sem permissão, etc). O Java exige tratamento de exceção (IOException).", 
                    instruction: "Monte o bloco try-catch básico usado para envolver operações de escrita.",
                    blocks: [
                        { id: 'b1', text: 'try {' },
                        { id: 'b2', text: '    // Operações de I/O' },
                        { id: 'b3', text: '} catch (Exception e) {' },
                        { id: 'b4', text: '    System.out.println("Erro!");' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Tratamento de exceções blindou seu código contra quebras bruscas."
                },
                {
                    id: 6, 
                    concept: "O Try-with-Resources", 
                    story: "O Java 7 introduziu o 'try-with-resources', que fecha os arquivos automaticamente após o uso, dispensando o método close().", 
                    instruction: "Inicie um bloco try abrindo parênteses para declarar o recurso antes das chaves.",
                    blocks: [
                        { id: 'b1', text: 'try (FileWriter fw = new FileWriter("log.txt")) {' },
                        { id: 'b2', text: '    // Usa o fw' },
                        { id: 'b3', text: '} catch (Exception e) { }' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Recurso auto-fechável declarado! Evitamos vazamento de memória."
                },
                {
                    id: 7, 
                    concept: "Gravando Texto Básico (FileWriter)", 
                    story: "O FileWriter abre um canal direto para enviar caracteres para o disco.", 
                    instruction: "Complete o bloco usando o método write() para gravar 'Inicio' no arquivo.",
                    blocks: [
                        { id: 'b1', text: 'try (FileWriter fw = new FileWriter("log.txt")) {' },
                        { id: 'b2', text: '    fw.write("Inicio");' },
                        { id: 'b3', text: '} catch (Exception e) {}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Escrita (Create/Update) direta efetuada com sucesso no FileWriter."
                },
                {
                    id: 8, 
                    concept: "Modo Append (Não Sobrescrever)", 
                    story: "Por padrão, o FileWriter apaga o arquivo se ele já existir. Para adicionar texto ao final, ativamos o modo 'append'.", 
                    instruction: "Instancie o FileWriter passando o valor booleano 'true' como segundo parâmetro.",
                    blocks: [
                        { id: 'b1', text: 'boolean append = true;' },
                        { id: 'b2', text: 'try (FileWriter fw = new FileWriter("log.txt", append)) {' },
                        { id: 'b3', text: '    fw.write("Nova Linha");' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Modo Append ativado! Preservamos o histórico do arquivo."
                },
                {
                    id: 9, 
                    concept: "Otimização com BufferedWriter", 
                    story: "O FileWriter escreve byte a byte, o que é lento. O BufferedWriter junta um pacote (buffer) na RAM antes de ir ao disco.", 
                    instruction: "Crie a estrutura aninhada envolvendo o FileWriter dentro de um BufferedWriter.",
                    blocks: [
                        { id: 'b1', text: 'FileWriter fw = new FileWriter("dados.txt");' },
                        { id: 'b2', text: 'BufferedWriter bw = new BufferedWriter(fw);' },
                        { id: 'b3', text: 'bw.write("Otimizado!");' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Performance de escrita aprimorada com o uso de Buffer de memória."
                },
                {
                    id: 10, 
                    concept: "Quebras de Linha", 
                    story: "Ao invés de digitar '\\n', que varia dependendo do sistema, o BufferedWriter tem um método nativo seguro.", 
                    instruction: "Use bw.newLine() após escrever o primeiro texto para pular uma linha.",
                    blocks: [
                        { id: 'b1', text: 'bw.write("Primeira linha");' },
                        { id: 'b2', text: 'bw.newLine();' },
                        { id: 'b3', text: 'bw.write("Segunda linha");' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Quebra de linha universal implementada de forma segura."
                },
                {
                    id: 11, 
                    concept: "Gravando Vetores", 
                    story: "Muito do trabalho de persistência é salvar os dados de um array em linhas de um arquivo.", 
                    instruction: "Monte o laço for-each (for aprimorado) para gravar cada 'nome' do array 'nomes'.",
                    blocks: [
                        { id: 'b1', text: 'for (String nome : nomes) {' },
                        { id: 'b2', text: '    bw.write(nome);' },
                        { id: 'b3', text: '    bw.newLine();' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Array transposto para o arquivo linha a linha."
                },
                {
                    id: 12, 
                    concept: "PrintWriter para Impressão Fácil", 
                    story: "O PrintWriter permite usar os familiares comandos print() e println(), muito similar ao System.out.", 
                    instruction: "Envolva o FileWriter com um PrintWriter e use o método println().",
                    blocks: [
                        { id: 'b1', text: 'try (FileWriter fw = new FileWriter("arq.txt");' },
                        { id: 'b2', text: '     PrintWriter pw = new PrintWriter(fw)) {' },
                        { id: 'b3', text: '    pw.println("Formatado facilmente!");' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "PrintWriter configurado! O uso de println() agora está liberado para arquivos."
                },
                {
                    id: 13, 
                    concept: "Iniciando a Leitura: Scanner", 
                    story: "A maneira mais didática de ler arquivos em Java é usando a classe Scanner.", 
                    instruction: "Instancie um objeto Scanner passando um objeto File como fonte, não o System.in.",
                    blocks: [
                        { id: 'b1', text: 'File fonte = new File("log.txt");' },
                        { id: 'b2', text: 'try (Scanner leitor = new Scanner(fonte)) {' },
                        { id: 'b3', text: '    // Pronto para ler' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Scanner vinculado ao arquivo físico. Canal de leitura aberto."
                },
                {
                    id: 14, 
                    concept: "Lendo uma Linha Específica", 
                    story: "Assim como lemos dados do usuário com nextLine(), fazemos o mesmo com o Scanner focado no arquivo.", 
                    instruction: "Puxe a primeira linha do arquivo lido pelo Scanner para dentro de uma variável String.",
                    blocks: [
                        { id: 'b1', text: 'Scanner sc = new Scanner(new File("arq.txt"));' },
                        { id: 'b2', text: 'String linha = sc.nextLine();' },
                        { id: 'b3', text: 'System.out.println(linha);' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Leitura de linha efetuada. Dados transferidos do disco para a RAM."
                },
                {
                    id: 15, 
                    concept: "O Laço de Leitura Completa", 
                    story: "Dificilmente lemos só a primeira linha. Usamos o laço while condicionado ao método hasNextLine() para ler o arquivo até o fim.", 
                    instruction: "Construa o while testando se há uma próxima linha e então imprima essa linha.",
                    blocks: [
                        { id: 'b1', text: 'while (sc.hasNextLine()) {' },
                        { id: 'b2', text: '    System.out.println(sc.nextLine());' },
                        { id: 'b3', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Laço iterador construído! O arquivo inteiro pode ser extraído agora."
                },
                {
                    id: 16, 
                    concept: "Buscando Padrões (Busca Textual)", 
                    story: "Para procurar uma palavra no arquivo, integramos a leitura do Scanner com o método .contains() da classe String.", 
                    instruction: "Leia as linhas em um while e, se a linha contiver a palavra 'ERRO', acione um alerta.",
                    blocks: [
                        { id: 'b1', text: 'while (sc.hasNextLine()) {' },
                        { id: 'b2', text: '    String lin = sc.nextLine();' },
                        { id: 'b3', text: '    if (lin.contains("ERRO")) {' },
                        { id: 'b4', text: '        System.out.println("Alerta!");' },
                        { id: 'b5', text: '    }' },
                        { id: 'b6', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6']], 
                    successLog: "Filtro de leitura aplicado. Busca textual funcional."
                },
                {
                    id: 17, 
                    concept: "Tratamento Específico: FileNotFoundException", 
                    story: "Quando tentamos ler um arquivo que não existe, o Scanner dispara uma exceção específica.", 
                    instruction: "Use a estrutura catch focada apenas na ausência física do arquivo.",
                    blocks: [
                        { id: 'b1', text: 'try (Scanner sc = new Scanner(new File("vazio.txt"))) {' },
                        { id: 'b2', text: '} catch (FileNotFoundException e) {' },
                        { id: 'b3', text: '    System.out.println("O arquivo sumiu!");' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Tratamento de ausência de arquivos executado. O sistema não irá travar."
                },
                {
                    id: 18, 
                    concept: "Leitura Otimizada: BufferedReader", 
                    story: "Assim como o BufferedWriter otimiza a escrita, o BufferedReader e FileReader formam a dupla para ler grandes textos.", 
                    instruction: "Instancie as duas classes aninhadas no bloco try-with-resources.",
                    blocks: [
                        { id: 'b1', text: 'try (FileReader fr = new FileReader("dados.txt");' },
                        { id: 'b2', text: '     BufferedReader br = new BufferedReader(fr)) {' },
                        { id: 'b3', text: '    // Leitura pronta' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Leitura bufferizada ativada."
                },
                {
                    id: 19, 
                    concept: "A Estrutura de Repetição Clássica", 
                    story: "Lemos o arquivo via BufferedReader dentro de um while onde atribuímos e testamos a linha por 'null' simultaneamente.", 
                    instruction: "Declare a String linha e construa o while que extrai br.readLine().",
                    blocks: [
                        { id: 'b1', text: 'String linha;' },
                        { id: 'b2', text: 'while ((linha = br.readLine()) != null) {' },
                        { id: 'b3', text: '    System.out.println(linha);' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "A idiomática e elegante estrutura de leitura BufferedReader rodando 100%!"
                },
                {
                    id: 20, 
                    concept: "Contagem de Linhas", 
                    story: "Como saber o tamanho de um arquivo sem abri-lo? Podemos processar estatísticas enquanto lemos.", 
                    instruction: "Usando BufferedReader, crie o contador que incrementa até o final do loop null.",
                    blocks: [
                        { id: 'b1', text: 'int qtd = 0;' },
                        { id: 'b2', text: 'while (br.readLine() != null) {' },
                        { id: 'b3', text: '    qtd++;' },
                        { id: 'b4', text: '}' },
                        { id: 'b5', text: 'System.out.println(qtd);' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Estatística de dimensionamento textual executada."
                },
                {
                    id: 21, 
                    concept: "Criando um Backup (Read + Write)", 
                    story: "Vamos unir as peças. Lemos do arquivo de origem e escrevemos no destino na mesma repetição.", 
                    instruction: "Organize o bloco try com as duas declarações e depois faça o loop copiador.",
                    blocks: [
                        { id: 'b1', text: 'try (BufferedReader br = new BufferedReader(new FileReader("A.txt"));' },
                        { id: 'b2', text: '     BufferedWriter bw = new BufferedWriter(new FileWriter("B.txt"))) {' },
                        { id: 'b3', text: '    String lin;' },
                        { id: 'b4', text: '    while ((lin = br.readLine()) != null) { bw.write(lin); bw.newLine(); }' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Pipeline de transferência e Backup de disco perfeitamente selado."
                },
                {
                    id: 22, 
                    concept: "Substituição de Valores em Massa", 
                    story: "Podemos processar a linha lida antes de gravá-la, por exemplo, trocando vírgulas por pontos.", 
                    instruction: "Pegue a string 'lin', use o replace() mudando vírgula para ponto, e grave.",
                    blocks: [
                        { id: 'b1', text: 'while ((lin = br.readLine()) != null) {' },
                        { id: 'b2', text: '    String linLimpa = lin.replace(",", ".");' },
                        { id: 'b3', text: '    bw.write(linLimpa);' },
                        { id: 'b4', text: '    bw.newLine();' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Parse e alteração de arquivo em trânsito feita (ETL Básico)."
                },
                {
                    id: 23, 
                    concept: "Java NIO: O Novo I/O", 
                    story: "O pacote java.nio simplifica drasticamente a manipulação de caminhos (Paths).", 
                    instruction: "Importe o pacote e utilize Paths.get() para apontar para um arquivo.",
                    blocks: [
                        { id: 'b1', text: 'import java.nio.file.Paths;' },
                        { id: 'b2', text: 'import java.nio.file.Path;' },
                        { id: 'b3', text: 'Path caminho = Paths.get("relatorio.txt");' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Interfaces NIO carregadas e objeto Path criado."
                },
                {
                    id: 24, 
                    concept: "NIO: Leitura em Um Único Comando", 
                    story: "Com o NIO, podemos dispensar os laços while e carregar um arquivo inteiro para a memória de uma vez.", 
                    instruction: "Importe a Lista e use readAllLines para carregar o arquivo em uma variável.",
                    blocks: [
                        { id: 'b1', text: 'import java.nio.file.Files;' },
                        { id: 'b2', text: 'import java.util.List;' },
                        { id: 'b3', text: 'var todasLinhas = Files.readAllLines(caminho);' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Leitura mágica do NIO efetuada com sucesso!"
                },
                {
                    id: 25, 
                    concept: "NIO: Gravação Rápida", 
                    story: "Da mesma forma que lêmos, com Files.write() transferimos todo um pacote de dados para o arquivo físico instantaneamente.", 
                    instruction: "Execute o método Files.write enviando o 'caminho' e os dados.",
                    blocks: [
                        { id: 'b1', text: 'try {' },
                        { id: 'b2', text: '    Files.write(caminho, todasLinhas);' },
                        { id: 'b3', text: '} catch (Exception e) {}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "A gravação super-veloz e compacta do NIO efetuada."
                },
                {
                    id: 26, 
                    concept: "Múltiplas Funções no Main", 
                    story: "Um programa real orquestra a manipulação através de métodos modulares chamados no main.", 
                    instruction: "Declare o método main chamando funções fictícias de criar e depois ler.",
                    blocks: [
                        { id: 'b1', text: 'public static void main(String[] args) {' },
                        { id: 'b2', text: '    String nomeArq = "banco.txt";' },
                        { id: 'b3', text: '    criarArquivo(nomeArq);' },
                        { id: 'b4', text: '    lerArquivo(nomeArq);' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Modularização confirmada. O Main coordena os procedimentos."
                },
                {
                    id: 27, 
                    concept: "Proteção de Escopo ao Gravar", 
                    story: "O FileWriter que é criado num método morre no fim dele, obrigando o uso do try-with-resources para proteger a gravação.", 
                    instruction: "Construa o método 'registrar' que recebe um texto e apenas anexa no log.",
                    blocks: [
                        { id: 'b1', text: 'public static void registrar(String txt) {' },
                        { id: 'b2', text: '    try (FileWriter fw = new FileWriter("log", true)) {' },
                        { id: 'b3', text: '        fw.write(txt + "\\n");' },
                        { id: 'b4', text: '    } catch (Exception e) {}' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Procedimento seguro isolado de I/O construído."
                },
                {
                    id: 28, 
                    concept: "O Fluxo CRUD (Update Fake)", 
                    story: "Não há um '.updateLine()' em Java. Para editar uma linha, lemos tudo, modificamos na memória e sobrescrevemos o disco.", 
                    instruction: "Em NIO, leia, troque o valor do índice 0 e regrave usando Files.write().",
                    blocks: [
                        { id: 'b1', text: 'var lis = Files.readAllLines(path);' },
                        { id: 'b2', text: 'lis.set(0, "Substituido");' },
                        { id: 'b3', text: 'Files.write(path, lis);' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Operação UPDATE do arquivo finalizada via re-salvamento."
                },
                {
                    id: 29, 
                    concept: "Apagar Rastro (Delete Seguro)", 
                    story: "Garantimos que nenhum arquivo indesejado continue no disco, utilizando a classe File tradicional.", 
                    instruction: "Declare o File, garanta o if de existência e chame delete().",
                    blocks: [
                        { id: 'b1', text: 'File alvo = new File("temporario.txt");' },
                        { id: 'b2', text: 'if (alvo.exists()) {' },
                        { id: 'b3', text: '    boolean sumiu = alvo.delete();' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Rastros deletados do Sistema Operacional."
                },
                {
                    id: 30, 
                    concept: "Arquitetura I/O Completa", 
                    story: "O teste final. Agrupe a gravação em PrintWriter para montar um pequeno sistema logador automatizado.", 
                    instruction: "Monte o pipeline: Try com PW, loop For, escrita do print, fechamento.",
                    blocks: [
                        { id: 'b1', text: 'try (PrintWriter pw = new PrintWriter(new FileWriter("fim.txt"))) {' },
                        { id: 'b2', text: '    for (int i = 0; i < 3; i++) {' },
                        { id: 'b3', text: '        pw.println("Proc: " + i);' },
                        { id: 'b4', text: '    }' },
                        { id: 'b5', text: '} catch (Exception e) { }' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "ESTRUTURA I/O COMPLETADA! O fluxo FileWriter, formatação e ciclo vital foi finalizado com maestria."
                }
            ]
        }
    },
    computed: {
        currentLevel() {
            // TRAVA DE SEGURANÇA: impede que o Vue crashe se o local storage salvar um level inexistente.
            if (this.currentLevelIndex >= this.levels.length) {
                return this.levels[0];
            }
            return this.levels[this.currentLevelIndex];
        }
    },
    mounted() {
        try {
            this.carregarProgresso();
            this.addLog("Iniciando JVM (Java Virtual Machine)...", "log-info");
            this.addLog("Carregando pacotes java.io e java.nio...", "log-info");
            setTimeout(() => { this.loadLevel(); }, 1000);
        } catch (e) {
            console.error("Erro na inicialização:", e);
            this.addLog("Erro crítico de inicialização: " + e.message, "log-error");
        }
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
            await this.typeWriter(`Carregando Desafio ${this.currentLevel.id}: ${this.currentLevel.concept}...`, "log-info");
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
                this.feedbackMsg = "Sintaxe de I/O Válida! Stream processada com sucesso.";
                this.levelComplete = true; 
                await this.typeWriter(this.currentLevel.successLog, "log-success");
                setTimeout(() => { this.nextLevel(); }, 2000);
            } else {
                this.chances--; 
                this.totalErros++; 
                this.salvarProgresso();
                
                if (this.chances > 0) {
                    this.feedbackType = "error";
                    this.feedbackMsg = `Erro de I/O (IOException): Tentativas restantes: ${this.chances}. Revise o stream ou pacotes!`;
                    this.addLog(`Exception in thread "main" java.io.IOException: Invalid stream operation. Vidas estouradas: ${3 - this.chances}.`, "log-error");
                } else {
                    this.feedbackType = "error";
                    this.feedbackMsg = "Falha crítica de ponteiro de arquivo!";
                    this.addLog("FatalError: Revelando gabarito da API...", "log-error");
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
                this.addLog("[SISTEMA] Parabéns! Todos os desafios de Arquivos e I/O em Java foram concluídos.", "log-success");
            }
        },

        salvarProgresso() {
            const saveDado = { nivel: this.currentLevelIndex, erros: this.totalErros };
            localStorage.setItem('java_io_save', JSON.stringify(saveDado));
        },

        carregarProgresso() {
            const saveSalvo = localStorage.getItem('java_io_save');
            if (saveSalvo) {
                try {
                    const dados = JSON.parse(saveSalvo);
                    this.currentLevelIndex = parseInt(dados.nivel, 10) || 0;
                    this.totalErros = parseInt(dados.erros, 10) || 0;
                    
                    // TRAVA DE SEGURANÇA 2: Garante que o index puxado não é maior que o array de fases atual
                    if (this.currentLevelIndex >= this.levels.length) {
                        this.currentLevelIndex = 0;
                    }

                    if(this.currentLevelIndex > 0 && this.currentLevelIndex < this.levels.length) {
                        this.addLog(`[SISTEMA] Progresso restaurado a partir do Nível ${this.currentLevelIndex + 1}.`, "log-success");
                    }
                } catch(e) {
                    console.error("Erro ao ler o arquivo de save:", e);
                }
            }
        },

        resetGame() {
            if(confirm("Isso apagará todo o seu progresso no curso de Java I/O. Tem certeza?")) {
                localStorage.removeItem('java_io_save');
                this.currentLevelIndex = 0;
                this.totalErros = 0;
                this.levelComplete = false;
                this.logs = [];
                this.addLog("Limpando buffers de memória da JVM...", "log-info");
                setTimeout(() => this.loadLevel(), 1000);
            }
        },

        exportarPDF() {
            const elemento = document.getElementById('relatorio-pdf');
            if (elemento) {
                elemento.style.display = 'block'; 
                const opt = {
                    margin:       10,
                    filename:     `Certificado-Java-IO-${Date.now()}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                html2pdf().set(opt).from(elemento).save().then(() => {
                    elemento.style.display = 'none';
                });
            } else {
                console.warn("Elemento 'relatorio-pdf' não encontrado na view principal.");
            }
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