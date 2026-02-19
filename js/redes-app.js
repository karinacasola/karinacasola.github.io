document.addEventListener('DOMContentLoaded', () => {
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                activeTopicIndex: 0,
                topics: [
                    {
                        id: 'internet_works',
                        shortTitle: 'Navegação Web',
                        icon: 'bi bi-globe2',
                        title: 'COMO A INTERNET FUNCIONA?',
                        nodes: [
                            { label: 'Dispositivo', icon: 'bi bi-laptop', sub: 'Usuário' },
                            { label: 'Roteador Wi-Fi', icon: 'bi bi-router', sub: 'Rede Local' },
                            { label: 'Provedor (ISP)', icon: 'bi bi-building', sub: 'Acesso à Internet' },
                            { label: 'Servidor Web', icon: 'bi bi-hdd-rack', sub: '(Site)' }
                        ],
                        miniDiagramTitle: 'Mini Diagrama: Carregando um Site',
                        steps: [
                            '1. O usuário digita o endereço do site (URL).',
                            '2. O DNS converte o nome em um endereço IP numérico.',
                            '3. A requisição é enviada através do provedor (ISP).',
                            '4. O servidor de destino envia os dados do site de volta.',
                            '5. O navegador exibe a página web.'
                        ],
                        note: 'A internet funciona usando pacotes de dados.<br>Todas as informações viajam como pequenas unidades fragmentadas.'
                    },
                    {
                        id: 'internet_provided',
                        shortTitle: 'Provedores',
                        icon: 'bi bi-buildings',
                        title: 'COMO A INTERNET É FORNECIDA?',
                        nodes: [
                            { label: 'Sua Casa', icon: 'bi bi-house', sub: '' },
                            { label: 'Última Milha', icon: 'bi bi-cable', sub: 'Cabo / Fibra' },
                            { label: 'Provedor (ISP)', icon: 'bi bi-hdd-network', sub: 'Serviço de Rede' },
                            { label: 'Backbone Global', icon: 'bi bi-globe', sub: 'Cabos Submarinos' },
                            { label: 'Data Centers', icon: 'bi bi-server', sub: 'Servidores' }
                        ],
                        miniDiagramTitle: 'Mini Diagrama: Tipos de Conexão',
                        steps: [
                            '1. O usuário solicita um conteúdo na rede.',
                            '2. O roteador envia o pedido através do provedor (ISP).',
                            '3. O ISP conecta-se ao backbone global.',
                            '4. A requisição alcança o servidor de destino.',
                            '5. Os dados retornam pelo mesmo caminho até o usuário.'
                        ],
                        note: 'ISP = Seu provedor de acesso.<br>Backbone = Rede central de altíssima velocidade.<br>Largura de Banda = A velocidade da sua conexão.'
                    },
                    {
                        id: 'mobile_network',
                        shortTitle: 'Rede 4G / 5G',
                        icon: 'bi bi-phone-vibrate',
                        title: 'COMO A REDE MÓVEL (4G/5G) FUNCIONA?',
                        nodes: [
                            { label: 'Celular', icon: 'bi bi-phone', sub: 'Área de Cobertura' },
                            { label: 'Torre Celular', icon: 'bi bi-broadcast', sub: 'Sinais de Rádio' },
                            { label: 'Núcleo de Rede', icon: 'bi bi-diagram-3', sub: 'Operadora' },
                            { label: 'Internet', icon: 'bi bi-cloud-arrow-up', sub: 'Rede Externa' },
                            { label: 'Servidor', icon: 'bi bi-hdd-rack', sub: 'Site destino' }
                        ],
                        miniDiagramTitle: 'Mini Diagrama: "Handover" (Transição)',
                        steps: [
                            '1. O celular envia sinal de rádio para a torre mais próxima.',
                            '2. A torre se conecta ao núcleo central da operadora.',
                            '3. Os dados são roteados para a internet e para o servidor.',
                            '4. A resposta retorna através do núcleo até a torre.',
                            '5. A torre transmite os dados de volta para o celular.'
                        ],
                        note: 'Mais torres = Maior velocidade de conexão.<br>A distância afeta diretamente a qualidade do sinal.<br>Handover = Capacidade do celular trocar de torre em movimento sem a internet cair.'
                    },
                    {
                        id: 'vpn_works',
                        shortTitle: 'VPN',
                        icon: 'bi bi-shield-lock',
                        title: 'COMO UMA VPN FUNCIONA?',
                        nodes: [
                            { label: 'Sua Internet', icon: 'bi bi-laptop', sub: 'Desprotegida' },
                            { label: 'Túnel Criptografado', icon: 'bi bi-lock', sub: 'Dentro da Rede' },
                            { label: 'Servidor VPN', icon: 'bi bi-server', sub: 'IP Oculto' },
                            { label: 'Servidor Web', icon: 'bi bi-globe', sub: 'Destino Final' }
                        ],
                        miniDiagramTitle: 'Principais Benefícios',
                        steps: [
                            '1. O usuário se conecta através do aplicativo da VPN.',
                            '2. O aplicativo criptografa (embaralha) os dados.',
                            '3. Os dados vão em segurança para o servidor VPN, que os repassa.',
                            '4. O servidor do site responde e envia os dados de volta à VPN.',
                            '5. A VPN devolve as informações seguras ao dispositivo.'
                        ],
                        note: 'VPN = Rede Privada Virtual (Virtual Private Network).<br>Adiciona uma camada extra de segurança e garante anonimato do seu endereço.'
                    },
                    {
                        id: 'cloud_computing',
                        shortTitle: 'Nuvem (Cloud)',
                        icon: 'bi bi-cloud',
                        title: 'COMO FUNCIONA A COMPUTAÇÃO EM NUVEM?',
                        nodes: [
                            { label: 'Dispositivo', icon: 'bi bi-laptop', sub: 'Usuário' },
                            { label: 'Internet', icon: 'bi bi-wifi', sub: 'Conexão' },
                            { label: 'A Nuvem', icon: 'bi bi-clouds', sub: 'Data Centers' }
                        ],
                        miniDiagramTitle: 'Mini Diagrama: Serviços em Nuvem',
                        steps: [
                            '1. O usuário solicita um dado, arquivo ou serviço.',
                            '2. O dispositivo se conecta à internet.',
                            '3. A requisição é roteada para um servidor na Nuvem.',
                            '4. Os servidores processam e armazenam os dados.',
                            '5. A resposta é renderizada e enviada de volta ao dispositivo.'
                        ],
                        note: 'Escalabilidade = Facilidade para expandir recursos.<br>Acesso Remoto = Disponível de qualquer lugar com internet.<br>Redundância = Cópias de segurança garantem a proteção dos dados.'
                    }
                ]
            };
        },
        computed: {
            activeTopic() {
                return this.topics[this.activeTopicIndex];
            }
        }
    }).mount('#vue-network-app');
});