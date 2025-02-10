[![DOI](https://zenodo.org/badge/930331951.svg)](https://doi.org/10.5281/zenodo.14845124)

## *SisSolXR* - Sistema Solar em Realidade Mista

*Exploração Imersiva e Interativa do Sistema Solar em Realidade Mista para Educação em Astronomia*

Este documento está dividido em duas partes:

- [Instalando o Aplicativo SisSolXR](#instalando-o-aplicativo-sissolxr)
- [Utilizando o Aplicativo SisSolXR para Atividades Educacionais](#utilizando-o-aplicativo-sissolxr-para-atividades-educacionais)

Esta é uma aplicação web de Realidade Aumentada que simula o Sistema Solar, permitindo a interação síncrona de múltiplos usuários em Realidade Virtual (RV) conectados em uma rede local.

## Instalando o Aplicativo SisSolXR

Esta seção fornece instruções detalhadas para configurar e executar a aplicação localmente, utilizando um notebook como servidor Wi-Fi hotspot para conectar os óculos de RV.

### Pré-requisitos

Antes de começar, você precisará ter o seguinte instalado no seu computador (notebook que atuará como servidor):

1.  **Node.js e npm (Node Package Manager):**  São necessários para executar o servidor JavaScript e gerenciar as dependências do projeto.

    *   **Para verificar se o Node.js e npm estão instalados, abra o terminal (ou prompt de comando no Windows) e execute:**
        ```bash
        node -v
        npm -v
        ```
        Se ambos os comandos retornarem números de versão, eles já estão instalados. Caso contrário, siga as instruções abaixo para instalá-los.

    *   **Instalação do Node.js e npm:**
        *   **Ubuntu:**
            ```bash
            sudo apt update
            sudo apt install nodejs npm
            ```
            Após a instalação, verifique as versões novamente com `node -v` e `npm -v`.
        *   **Windows:**
            1.  Acesse o site oficial do Node.js: [https://nodejs.org/](https://nodejs.org/)
            2.  Baixe o instalador LTS (versão recomendada).
            3.  Execute o instalador e siga as instruções na tela. O instalador inclui o npm.
            4.  Após a instalação, abra o prompt de comando e verifique as versões com `node -v` e `npm -v`.

### Configuração do Projeto

1.  **Clone o repositório do GitHub:**
    Se você ainda não tem o código do projeto, clone o repositório do GitHub para o seu computador usando o Git:
    ```bash
    git clone https://github.com/jocoteles/SisSolXR.git
    cd SisSolXR
    ```

2.  **Instale as dependências do projeto:**
    Navegue até a pasta do projeto no terminal (se já não estiver lá) e execute o seguinte comando para instalar as dependências listadas no arquivo `package.json` (express e socket.io):
    ```bash
    npm install
    ```
    Este comando irá ler o arquivo `package.json` e instalar as bibliotecas necessárias na pasta `node_modules`.

    Após a instalação, o npm pode reportar algumas vulnerabilidades de segurança nas dependências. **É altamente recomendado corrigir essas vulnerabilidades executando o seguinte comando:**
    ```bash
    npm audit fix
    ```
    Este comando irá tentar atualizar automaticamente as dependências para versões seguras, sem introduzir alterações significativas na funcionalidade do projeto.

### Geração de Certificados SSL (HTTPS)

Como a aplicação utiliza HTTPS, você precisará gerar certificados SSL autoassinados para executar o servidor localmente. Você pode usar o `openssl` (geralmente já instalado no Ubuntu e disponível para Windows, pode ser necessário instalar separadamente no Windows ou usar um ambiente como WSL).

1.  **Gere a chave privada (`key.pem`) e o certificado autoassinado (`cert.pem`):**
    Abra o terminal (ou prompt de comando no Windows) na raiz do seu projeto e execute o seguinte comando `openssl`. Este comando irá criar uma pasta `ssl` (se não existir) e gerar os arquivos `key.pem` e `cert.pem` dentro dela.

    ```bash
    mkdir ssl
    openssl req -x509 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj '/CN=localhost'
    ```
    Durante a execução deste comando, você será solicitado a fornecer algumas informações. Você pode simplesmente pressionar Enter para a maioria das perguntas, pois para uso local, os valores padrão são suficientes. O importante é que o `Common Name (CN)` seja `localhost` ou `127.0.0.1` se solicitado.

    Após a execução, você terá os arquivos `key.pem` e `cert.pem` dentro da pasta `ssl`.

### Executando o Servidor Node.js

1.  **Inicie o servidor:**
    Com as dependências instaladas e os certificados SSL gerados, você pode iniciar o servidor Node.js. No terminal, dentro da pasta do projeto, execute:
    ```bash
    node index.js
    ```
    Você deverá ver a seguinte mensagem no terminal indicando que o servidor está rodando:
    ```
    server running at https://127.0.0.1:8080 and https://10.42.0.1:8080
    ```
    **Observação:** `10.42.0.1` é um exemplo de endereço IP que pode ser atribuído ao seu notebook quando configurado como hotspot. O endereço real pode variar dependendo da configuração do seu hotspot.

### Configuração do Wi-Fi Hotspot

Para que os óculos de RV se conectem ao servidor, você precisa configurar seu notebook como um hotspot Wi-Fi. As instruções variam dependendo do seu sistema operacional:

#### Ubuntu (Usando NetworkManager - método comum em interfaces gráficas)

1.  **Abra as Configurações de Rede:** Clique no ícone de rede na barra superior e selecione "Configurações de Wi-Fi" ou "Editar Conexões".
2.  **Crie um novo Hotspot:**
    *   Clique no botão "+" para adicionar uma nova conexão.
    *   Escolha "Wi-Fi" como tipo de conexão e clique em "Criar...".
    *   Na janela "Edição de Wi-Fi", na aba "Wi-Fi":
        *   **Nome da conexão:** Dê um nome para sua rede hotspot (ex: `SisSolXR-Hotspot`).
        *   **Modo:** Selecione "Hotspot".
        *   **SSID:** Defina o nome que a rede Wi-Fi hotspot terá (ex: `SisSolXR-Network`).
    *   Na aba "Segurança Wi-Fi":
        *   **Segurança:** Escolha "WPA & WPA2 Pessoal".
        *   **Senha:** Defina uma senha para sua rede Wi-Fi.
    *   Na aba "Configurações IPv4":
        *   **Método:** Selecione "Compartilhado com outros computadores".
    *   Clique em "Salvar".
3.  **Ative o Hotspot:**
    *   Clique novamente no ícone de rede na barra superior.
    *   Procure o nome da rede hotspot que você criou (`SisSolXR-Hotspot` no exemplo) e clique nele para ativar.
4.  **Verifique o Endereço IP do Servidor (Notebook):**
    Abra o terminal no seu notebook e execute:
    ```bash
    ip addr show wlp... ## Substitua wlp... pelo nome da sua interface wireless (ex: wlp2s0). Geralmente começa com wlp ou wlan
    ```
    Procure por `inet` dentro do bloco da sua interface wireless. O endereço IP listado lá (geralmente algo como `10.42.0.1` ou `192.168.42.1`) é o endereço que os óculos de RV usarão para acessar a aplicação.

#### Windows 10/11 (Usando Hotspot Móvel)

1.  **Abra as Configurações:** Clique no menu Iniciar e selecione "Configurações" (ícone de engrenagem).
2.  **Vá para "Rede e Internet" > "Hotspot móvel".**
3.  **Ative o "Hotspot móvel".**
4.  **Configure o Hotspot (opcional):**
    *   Clique em "Editar" para alterar o nome da rede (SSID) e a senha.
    *   Anote o "Nome da rede" e a "Senha" para usar nos óculos de RV.
5.  **Verifique o Endereço IP do Servidor (Notebook):**
    Abra o Prompt de Comando como administrador (clique com o botão direito no menu Iniciar e selecione "Prompt de Comando (Admin)" ou "Terminal (Admin)") e execute:
    ```bash
    ipconfig
    ```
    Procure pelo adaptador "Adaptador Ethernet sem fio Wi-Fi" ou similar (pode variar dependendo do adaptador). O endereço IP listado como "Endereço IPv4" é o endereço que os óculos de RV usarão para acessar a aplicação. Geralmente será algo como `192.168.137.1` ou similar.

### Acessando a Aplicação nos Óculos de RV (Clientes)

1.  **Conecte os óculos de RV à rede Wi-Fi Hotspot criada no notebook.**  Procure pelo nome da rede (SSID) que você configurou (ex: `SisSolXR-Network` ou o nome do Hotspot Móvel do Windows) nas configurações de Wi-Fi dos seus óculos de RV e conecte-se usando a senha configurada.

2.  **Abra o navegador web nos óculos de RV.**

3.  **Digite o endereço HTTPS no navegador:**
    Na barra de endereço do navegador, digite `https://[ENDERECO_IP_DO_SERVIDOR]:8080`, substituindo `[ENDERECO_IP_DO_SERVIDOR]` pelo endereço IP que você verificou no seu notebook (ex: `https://10.42.0.1:8080` ou `https://192.168.137.1:8080`).

    **Importante:** Certifique-se de usar `https://` e não `http://`, pois o servidor está configurado para HTTPS.

4.  **Aceite o aviso de certificado (se houver):**
    Como você está usando um certificado autoassinado, o navegador pode exibir um aviso de que a conexão não é segura. Isso é esperado para certificados autoassinados em um ambiente local. Você precisará prosseguir e aceitar o risco/avançar para o site (a mensagem exata varia conforme o navegador).

5.  **A aplicação deverá carregar nos óculos de RV.** Se tudo estiver configurado corretamente, a página web da aplicação Sistema Solar será carregada nos óculos de RV.

### Interação Síncrona e Teste Multi-Usuário

Com o servidor rodando e os óculos de RV conectados e acessando a aplicação, qualquer interação (como pressionar botões na interface web em um dos óculos) que emita eventos `stagePressed` ou `resetPressed` através do Socket.IO será sincronizada entre todos os clientes conectados.

Para testar a sincronização multi-usuário:

1.  Conecte múltiplos óculos de RV à mesma rede hotspot e acesse a aplicação em cada um deles seguindo os passos acima.
2.  Interaja com os botões ou elementos interativos na aplicação em um dos óculos.
3.  Observe que as mudanças ou ações devem ser refletidas em tempo real nos outros óculos de RV conectados, demonstrando a sincronização.

### Notas Importantes

*   **Rede Local:** Esta configuração é projetada para uma rede local fechada criada pelo hotspot Wi-Fi do seu notebook. Os óculos de RV e o notebook devem estar conectados à mesma rede para comunicação.
*   **HTTPS é Necessário:** A aplicação utiliza HTTPS devido a possíveis restrições de funcionalidades de Realidade Aumentada/Realidade Virtual em navegadores quando acessadas via HTTP inseguro, especialmente em contextos de dispositivos VR.
*   **Sincronização via Socket.IO:** A sincronização entre os clientes é gerenciada pelo Socket.IO. Eventos como pressionar botões são transmitidos pelo servidor e retransmitidos para todos os clientes conectados, garantindo a experiência multi-usuário síncrona.
*   **Desempenho:** Esta aplicação foi testada em um notebook bastante modesto (processador Intel Core I5, 8 GB de memória RAM e sistema operacional Linux) como servidor e dez óculos Meta Quest 2 como clientes simultaneamente. Mesmo nessas condições não foi observada lentidão ou perda de desempenho da aplicação.
*   **Firewall:** Se você tiver um firewall ativo no seu notebook, certifique-se de que ele não está bloqueando a comunicação na porta 8080 (ou a porta que você estiver usando para o servidor Node.js).

Com estas instruções, você deve ser capaz de configurar e executar a aplicação Sistema Solar em Realidade Aumentada localmente com múltiplos óculos de RV conectados.


## Utilizando o Aplicativo SisSolXR para Atividades Educacionais

O SisSolXR foi projetado para proporcionar uma experiência imersiva e interativa de aprendizado sobre o Sistema Solar dentro de um ambiente de Realidade Mista.  Utilizando óculos de Realidade Virtual (RV) compatíveis com rastreamento de mãos, a aplicação permite que estudantes e educadores explorem o Sistema Solar em escala, dentro do espaço físico de uma sala de aula ou laboratório de ensino. Para uma descrição mais completa do uso no ambiente educacional, incluiremos em breve um artigo científico.

**Objetivos Educacionais:**

*   Visualizar e compreender as **escalas de tamanho e distância** no Sistema Solar.
*   Explorar as **órbitas e movimentos** dos planetas ao redor do Sol.
*   Comparar os **diâmetros planetários** em escala.
*   Compreender a **dimensão do Sol** em relação aos planetas.
*   Promover a **interação e colaboração** entre estudantes no ambiente de aprendizado.

### O Ambiente de Realidade Mista

Ao iniciar o SisSolXR em óculos de RV, os participantes são colocados em um ambiente de Realidade Mista que integra o espaço físico real da sala de aula com elementos virtuais:

*   **Espaço Real Integrado:** Os estudantes continuam vendo o ambiente físico da sala de aula através dos óculos de RV, permitindo a interação com colegas e o professor, e a movimentação livre no espaço.
*   **Janela para o Espaço Sideral:** Paredes virtuais são sobrepostas nas paredes da sala, criando a ilusão de um espaço aberto acima do teto, como uma "janela para o espaço sideral" (o "espaço superior"). O espaço da sala ao nível do chão é chamado de "espaço inferior".
*   **Objetos Virtuais Interativos:**  O Sol e os planetas do Sistema Solar são renderizados como objetos 3D virtuais dentro deste ambiente misto.

### Interação com o Aplicativo

A interação no SisSolXR é feita principalmente através do **rastreamento das mãos**:

*   **Mãos Virtuais:** As mãos dos usuários são rastreadas e representadas virtualmente como "luvas virtuais" no ambiente misto.
*   **Apertar Botões:**  Botões virtuais podem ser pressionados com as mãos virtuais para iniciar ações e navegar na aplicação.
*   **Painel de Controle:** Um painel de controle virtual é invocado por um botão inicial no centro da sala. Este painel, visível apenas para quem o invocou (geralmente o professor), permite controlar as etapas da atividade e selecionar planetas.

### Etapas da Atividade Educacional SisSolXR

O SisSolXR é estruturado em quatro etapas principais, cada uma focada em diferentes aspectos do Sistema Solar:

**Etapa 1: Raios Orbitais em Escala no Espaço Superior**

*   **Objetivo:** Visualizar as distâncias relativas dos planetas ao Sol (raios orbitais) em escala.
*   **Descrição:** Os planetas são posicionados no "espaço superior" (acima do teto virtual), em planos orbitais a cerca de 10 metros do solo. Os raios orbitais são transformados (Transformação Constante - TC) para caber no espaço virtual, com Mercúrio mais próximo do Sol e Netuno mais distante. Os diâmetros e velocidades de translação dos planetas são ajustados (Transformação Não-Linear - TNL) para serem visíveis e perceptíveis a essa distância. As velocidades de rotação são menos relevantes nesta etapa.
*   **Conteúdo Educacional:** Escala do Sistema Solar, distâncias planetárias, órbitas planetárias.

**Etapa 2: Apreciação Individual dos Planetas no Espaço Inferior**

*   **Objetivo:** Explorar cada planeta individualmente, focando em suas características visuais e movimentos.
*   **Descrição:** Os planetas são trazidos um a um para o "espaço inferior" (nível da sala). Seus diâmetros e velocidades de translação são ajustados (TNL) para que tenham um tamanho apreciável (30-40cm de diâmetro) e órbitas menores (2m de raio) ao redor do Sol, a cerca de 1,5m do solo. A inclinação dos eixos de rotação planetária é representada fielmente. O Sol também é renderizado no "espaço inferior", mas com um diâmetro reduzido (20cm) para focar nos planetas.
*   **Conteúdo Educacional:** Características dos planetas (superfície, atmosfera), período orbital, período de rotação, inclinação axial.

**Etapa 3: Diâmetros Planetários em Escala no Espaço Inferior**

*   **Objetivo:** Comparar os tamanhos dos planetas em escala relativa.
*   **Descrição:** Os planetas permanecem no "espaço inferior". Os diâmetros dos planetas são ajustados usando uma Transformação Constante (TC) para representar a escala de tamanho entre eles. Os raios orbitais e velocidades de translação são novamente ajustados (TNL) para visualização. O Sol permanece com o mesmo tamanho e posição da Etapa 2 (não está em escala nesta etapa).
*   **Conteúdo Educacional:** Tamanho relativo dos planetas, comparação de dimensões planetárias.

**Etapa 4: Sol em Escala no Espaço Superior**

*   **Objetivo:** Demonstrar o tamanho real do Sol em escala com os planetas (da Etapa 3).
*   **Descrição:** Apenas o Sol é transformado nesta etapa. Seu diâmetro é ajustado usando a mesma Transformação Constante (TC) da Etapa 3, resultando em um Sol enorme (12 metros de diâmetro). O Sol é então elevado lentamente para o "espaço superior" até que sua superfície fique a cerca de 2 metros do solo, mostrando sua imensidão em relação ao espaço da sala e aos tamanhos planetários da Etapa 3.
*   **Conteúdo Educacional:** Tamanho do Sol em escala com os planetas, a magnitude do Sol no Sistema Solar.

### Dinâmica da Atividade Educacional

Uma possível dinâmica para conduzir uma atividade educacional com SisSolXR é a seguinte:

1.  **Preparação Inicial:** Reúna os estudantes em círculo no centro da sala. Explique brevemente sobre a atividade e o uso dos óculos de RV. Dê instruções sobre como interagir e o que evitar fazer com as mãos para não sair da aplicação acidentalmente.
2.  **Distribuição e Ajuste dos Óculos:** Distribua os óculos de RV aos estudantes, auxiliando no ajuste correto e confortável em seus rostos.
3.  **Início da Etapa 1 (Raios Orbitais):** Peça aos estudantes para olharem para cima (espaço superior). Inicie a Etapa 1 no painel de controle. Conduza uma discussão sobre o que eles observam no "céu virtual", fazendo perguntas sobre o que representam os objetos e suas posições. Explore os conteúdos relacionados à Etapa 1 (escalas de distância, órbitas, movimento orbital).
4.  **Etapa 2 (Planetas Individuais):** Inicie a Etapa 2 e traga os planetas um a um para o "espaço inferior".  Conduza a exploração de cada planeta, incentivando os estudantes a observar suas características, aparência da atmosfera, inclinações dos eixos de rotação, e a interagir (se aproximar, "tocar"). Discuta os conteúdos da Etapa 2 (características planetárias, rotação, translação). Adicionalmente, pode-se explorar as causas das estações do ano devido à inclinação do eixo de rotação planetário.
5.  **Etapa 3 (Diâmetros Planetários):** Inicie a Etapa 3. Incentive os estudantes a se movimentarem livremente na sala para comparar os tamanhos dos diferentes planetas em escala. Explore os conteúdos da Etapa 3 (tamanhos relativos dos planetas).
6.  **Etapa 4 (Sol em Escala):** Finalize a atividade com a Etapa 4. Prepare os estudantes para a visualização do Sol em escala. Inicie a Etapa 4 e observem juntos a ascensão do Sol gigante no "espaço superior". Conclua a discussão com os conteúdos da Etapa 4 (tamanho do Sol e sua importância).
7.  **Encerramento e Discussão Final:** Após a Etapa 4, retire os óculos dos estudantes. Promova uma discussão final sobre o que aprenderam, suas impressões e dúvidas.

### Materiais Necessários

*   **Notebook Servidor:** Um notebook com capacidade de configurar um hotspot Wi-Fi e rodar o servidor web SisSolXR.
*   **Óculos de Realidade Virtual (Meta Quest 2 ou similares):**  Óculos de RV com capacidade de rastreamento de mãos e navegador web integrado. Idealmente, um conjunto de óculos para os estudantes e um para o professor (já testamos de forma bem sucedida com até 11 óculos de RV).
*   **Espaço Físico Adequado:** Uma sala ou laboratório com área entre 30 e 50 m² para permitir a adequada acomodação dos planetas e a movimentação dos estudantes.

### Considerações Finais

*   **Adaptação ao Nível Escolar:** Adapte a linguagem e o vocabulário da discussão aos diferentes níveis de escolaridade dos estudantes.
*   **Interação e Perguntas:** Incentive a interação dos estudantes entre si e com o professor, e estimule perguntas ao longo da atividade.
*   **Observação e Registro:** Durante a atividade, observe as reações e interações dos estudantes para enriquecer o relato da experiência e aprimorar futuras aplicações.

Ao utilizar o SisSolXR seguindo estas orientações, educadores podem proporcionar aos estudantes uma experiência de aprendizado imersiva, interativa e memorável sobre o Sistema Solar, explorando conceitos complexos de escala, movimento e características planetárias de uma forma inovadora e engajadora.

## Dependências e Bibliotecas de Código Aberto Utilizadas

Este projeto utiliza as seguintes bibliotecas de código aberto:

*   **Express.js:**  Licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT). Usado para gerenciamento do servidor web (framework Express.js).
*   **Socket.IO:** Licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT). Usado para comunicação em tempo real (Socket.IO).
*   **A-Frame:** Licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT). Usado para criação da cena de Realidade Aumentada (A-Frame).

As licenças MIT permitem o uso, modificação e distribuição dessas bibliotecas tanto para fins comerciais quanto não comerciais, desde que o aviso de copyright e a permissão sejam mantidos. Para mais detalhes, consulte os links para as licenças acima ou os arquivos de licença originais dentro dos pacotes das bibliotecas.

---
Esta aplicação é a concretização de uma das ações dentro do projeto "Astronomia e cultura astronômica: do céu real ao céu virtual" financiado pelo CNPq por meio da Chamada CNPq/MCTI/FNDCT 39/2022 “Programa de Apoio a Museus e Centros de Ciência e Tecnologia e a Espaços Científico-Culturais” (processo 407086/2022-6) dentro da Linha 3: Divulgação Científica e Educação Museal.
