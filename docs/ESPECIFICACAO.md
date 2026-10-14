# Especificação viva — Maratona Marvel

> **Documento de produto, engenharia, UX e evolução histórica**  
> **Versão documental:** 1.0 · **Referência:** implementação em `main` consultada em 14/10/2026 · **Idioma:** português brasileiro  
> **Repositório original:** https://github.com/michaelfdias/maratona-marvel  
> **Aplicação:** https://michaelfdias.github.io/maratona-marvel/  
> **Público-alvo secundário:** desenvolvedores e agentes de programação (por exemplo, Claude Code) que precisam **reconstruir uma experiência funcionalmente equivalente**, sem depender de contexto de conversa.
>
> **Hierarquia de verdade:** (1) código atual de `main` para comportamentos efetivamente existentes; (2) esta especificação para intenções, motivação, contratos e testes; (3) histórico de commits para decisões anteriores. Havendo divergência, registre-a e esclareça antes de modificar o produto. A documentação não autoriza concluir que algo foi testado visualmente apenas porque foi validado por leitura de código.

---

## 0. Como usar este documento como fonte de uma IA

Esta especificação não é apenas um backlog. É um **registro de produto**, com decisões aprovadas, mecanismos técnicos, formatos persistidos, critérios de aceite, casos de borda, compromissos de design, evolução e recursos rejeitados.

**Ao reconstruir do zero:**

1. Leia o `README.md` e este documento integralmente; examine o código-fonte atual, se disponível.
2. Reproduza as **regras de produto e interação**, não necessariamente a estrutura monolítica do HTML. Uma arquitetura modular moderna é possível, mas não deve alterar a experiência nem exigir login/backend.
3. Importe o catálogo de **70 IDs estáveis** e as sinopses; não substitua por uma listagem genérica nem reorganize silenciosamente a curadoria.
4. Implemente o modelo de dados, filtros, renderização, persistência, formulários e modos de exibição antes de refinamentos cinematográficos.
5. Garanta acessibilidade, Safari/iPhone, modo claro/escuro, controles por toque, performance mobile e importação/exportação.
6. Use a matriz de testes de aceite antes da publicação e não anuncie como validado algo que não executou.
7. Ao evoluir esta documentação, acrescente uma entrada ao diário de decisões e atualize a seção de **estado atual**, retirando prescrições de versões abandonadas.

### 0.1 Escopo do que é contrato e do que é liberdade

- **Contrato forte:** 70 filmes; 12 blocos; IDs estáveis; grupos; filtros; ordem editorial; seleção por filme ou seção; progresso local; configurações; persistência de seções; avaliações; backups; compartilhamento WhatsApp; identidade minimalista responsiva; páginas institucionais; separação entre lista pública e dados privados.
- **Contrato de comportamento:** toque no contador de uma seção expande/recolhe; toque no checkbox não; arraste em estrelas; voltar ao topo; preferência de tema compartilhada com páginas internas; celebrações no momento correto.
- **Contrato de design:** fundo calmo, vermelho Marvel apenas como destaque, hierarquia de leitura, tipografia responsiva, links com comportamento touch correto, rodapé cinematográfico full width, dedicatória sem caixas.
- **Liberdade de implementação:** frameworks, componentização, estado global, roteamento e bibliotecas leves, desde que o app continue rápido, acessível, publicável estaticamente, sem dependência de cadastro, sem regressões e fiel aos contratos.
- **Dado temporal:** anos futuros, nomes e disponibilidade dos filmes podem mudar; não pressupor que previsões editoriais são fatos imutáveis.

## 1. Visão, problema e posicionamento

### 1.1 Problema

Uma pessoa quer assistir aos filmes relacionados ao Universo Marvel, mas encontra três dificuldades: **qual ordem seguir**; **quais franquias são relevantes**; **quais títulos já viu ou ainda faltam**. Listas lineares comuns não ajudam a acompanhar um percurso extenso ou distinguir continuidade canônica de material contextual e opcional.

### 1.2 Proposta de valor

A **Maratona Marvel** é uma *watchlist editorial interativa*. Ela combina:

- **Curadoria:** orientação de visualização pensada para experiência narrativa e conexões entre filmes.
- **Organização pessoal:** estado de visto, data, avaliação, progresso e seções.
- **Controle do escopo:** do MCU estrito a uma maratona mais ampla.
- **Exploração contextual:** comentários e sinopses opcionais.
- **Autonomia:** sem conta, backend de usuário, cobrança ou sincronização obrigatória; backup sob controle do visitante.
- **Personalização e conforto:** bom uso no celular e desktop, modos claro/escuro e minimalista.
- **Afeto e compartilhamento:** identidade de cinéfilo, celebrações e convite para indicar a lista.

### 1.3 O que o produto NÃO é

- Não hospeda nem reproduz arquivos de vídeo; não fornece player, streaming, links ilícitos ou acesso aos filmes.
- Não é aplicação oficial da Marvel/Disney/Sony; não se atribui certificação ou chancela das franquias.
- Não mantém conta nem histórico sincronizado entre dispositivos; exportar/importar é a ferramenta de migração.
- Não promete disponibilidade atual em plataformas de streaming; o link do título **abre busca Google**.
- Não inclui todas as séries/especiais de streaming como itens do contador. A curadoria é de **longas-metragens**.
- Não promete ordem cronológica universal; a sequência é **editorialmente híbrida**, baseada no lançamento do MCU e nos blocos complementares.
- Não possui atualmente compartilhamento de **Instagram Stories** com cartaz/QR Code: esse experimento foi removido após avaliação negativa.

### 1.4 Princípios inegociáveis de UX

1. **Primeiro a lista:** nenhum efeito, publicidade, onboarding complexo ou navegação atrapalha a tarefa principal.
2. **Poucos cliques:** tornar diretamente acionáveis título da seção, subtítulo, contador, seta e espaço vazio do cabeçalho.
3. **Gestos não ambíguos:** o checkbox marca; o cabeçalho recolhe; a estrela avalia; o título de filme pesquisa.
4. **Estado durável:** recarregar não perde filmes, preferências ou seções recolhidas.
5. **Metadados proporcionais:** notas, anos, datas, estrelas e barra flutuante são opcionalmente visíveis.
6. **Indicação honesta:** compartilhamento descreve um guia, nunca conteúdo para assistir.
7. **Compatibilidade Safari:** evitar estados de foco/hover persistentes no toque e usar layout que não varie com a tipografia nativa.
8. **Respeito a movimento reduzido e acessibilidade:** não sacrificar teclado nem leitores de tela em nome da estética.
9. **Cuidar dos detalhes:** contraste, números tabulares, alinhamento vertical, alvos de toque e microcópia são parte do produto.
10. **Evoluir sem Frankenstein:** áreas transversais como o rodapé devem ter **design system único**, não CSS especial por página.

---

## 2. Arquitetura existente e opções de reconstrução

### 2.1 Implementação real (não idealizada)

Trata-se de uma aplicação estática com grande parte do HTML/CSS/JS **inline** em `index.html`, incluindo catálogo, sinopses e regras de interface. Não há compilação nem framework obrigatório. As páginas institucionais são HTMLs independentes.

| Caminho | Papel e observações |
| --- | --- |
| `/index.html` | Layout principal; CSS local; dataset `sections`; `synopses`; estado; renderização; interação; filtro; backups; celebrações; modal; menu minimalista. |
| `/sobre/index.html` | Página institucional de missão, recursos, privacidade básica, independência e contato. |
| `/ordem-recomendada/index.html` | Metodologia de ordenação, blocos X-Men/Aranha/Deadpool e distinção entre filtros. |
| `/privacidade/index.html` | Texto de política de privacidade sobre armazenamento, hospedagem e serviços externos. |
| `/shared-footer.css` | **Fonte CSS compartilhada** para rodapé em todas as páginas e botão fixo de voltar ao topo. |
| `/back-to-top.js` | **Script compartilhado** para atalho de retorno ao início e preferência persistida. |
| `/README.md` | Apresentação curta de uso e arquitetura. |
| `/docs/ESPECIFICACAO.md` | Este documento; fonte de requisitos, decisões e reconstrução. |

**Hospedagem:** GitHub Pages, com base de URLs sob `/maratona-marvel/`. **Analytics:** Cloudflare Web Analytics (beacon incluído nos documentos atuais). Sem base de dados de progresso, API proprietária ou registro de usuários.

**Atenção ao executar localmente:** há caminhos **absolutos** para `/maratona-marvel/shared-footer.css`, `/maratona-marvel/back-to-top.js` e páginas internas. Abrir `index.html` via `file://` pode funcionar parcialmente, mas um teste fiel deve usar servidor HTTP/HTTPS com essa base, ou adaptar os caminhos a outra hospedagem.

### 2.2 Arquitetura conceitual recomendada para implementação equivalente

Mesmo que o produto original seja monolítico, uma IA pode separar as responsabilidades:

- **Catálogo editorial**: matriz estática de seções e filmes; índice por ID; dicionário de sinopses.
- **Persistência**: um serviço `Storage` com leitura defensiva, escrita, schema/versão, exportação e importação.
- **Estado de apresentação**: preferências, filtro ativo, busca, agrupamento, sessões expandidas e sinopses temporárias.
- **Progresso**: funções puras para calcular vistos, percentuais, conclusão por seção, datas e avaliações.
- **Renderização**: componentes de capa, métricas, filtros, lista, linha de filme, seções, modal, rodapé e páginas institucionais.
- **Interação**: click/pointer/touch/keyboard, foco, modais, menu lateral, scroll e animação.
- **Serviços transversais**: preferência de tema compartilhada, configuração voltar ao topo, compartilhamento, analytics.
- **Testes**: unidades do domínio, integração de DOM e smoke visual mobile/desktop.

Essa divisão **é uma recomendação arquitetural**, não algo que já exista como módulos separados no original.

### 2.3 Abordagem de renderização atual

O código monta a lista com template strings e substitui `root.innerHTML` a cada alteração que exija novo desenho. Event handlers de lista são delegados ao elemento persistente `#list`, evitando registrar listeners individuais a cada reconstrução. O modelo de dados é separado do DOM. Estados efêmeros (ex.: sinopse expandida durante a sessão, gesto de arraste) coexistem com estado salvo em `localStorage`.

**Ao reconstruir:** preserve IDs e semântica dos controles. Evite perder foco de teclado ao renderizar; se alterar o DOM, restaure foco de forma intencional. Não use `innerHTML` com conteúdo não confiável sem escaping. A implementação atual usa função `esc` para caracteres HTML.

---

## 3. Domínio: catálogo, IDs, classes e ordem editorial

### 3.1 Universo da lista

**O snapshot consultado contém exatamente:**

- **70** filmes, todos com IDs únicos.
- **12** seções editoriais.
- **40** filmes `group: "mcu"`.
- **12** filmes `group: "recommended"`.
- **18** filmes `group: "optional"`.
- **52** com `tier: "high"` e **18** com `tier: "optional"`.
- **70** sinopses completas (uma por ID).
- Campo `star: true` em seis filmes, utilizado como marcador editorial no dataset (não confundir com avaliação privada).
- Dois títulos marcados `future: true` no snapshot de referência: *Vingadores: Doomsday* (2026) e *Vingadores: Guerras Secretas* (2027).

**O grupo não é o mesmo conceito de fase:** um bloco de X-Men pode conter itens recomendados e opcionais; o filtro depende do campo `group`, não da posição do filme na tela.

### 3.2 Esquema de dados de cada filme

Exemplo semanticamente fiel (campos originais preservados):

```json
{
  "id": "iron-man-2008",
  "pt": "Homem de Ferro",
  "en": "Iron Man",
  "year": 2008,
  "note": "Comentário editorial sobre relevância e contexto do filme.",
  "tier": "high",
  "star": false,
  "future": false,
  "group": "mcu"
}
```

**Contrato:**

| Campo | Tipo | Semântica |
| --- | --- | --- |
| `id` | string estável | Chave primária de progresso, datas, avaliação e sinopse. Não usar índice ou título como chave. |
| `pt` | string | Nome em português usado na interface por padrão. |
| `en` | string | Nome em inglês no seletor de idioma e na busca. |
| `year` | inteiro | Ano de lançamento editorial. Previsto quando `future` for verdadeiro. |
| `note` | string | Comentário editorial breve, opcionalmente visível na linha do filme. |
| `tier` | `"high" | "optional"` | Peso editorial; `"optional"` habilita o selo “Opcional”. |
| `star` | boolean | Sinalização presente no catálogo; não confundir com rating pessoal. |
| `future` | boolean | Filme ainda tratado como previsto no catálogo de referência. |
| `group` | `"mcu" | "recommended" | "optional"` | Determina escopo dos filtros. |

Seção: `{ name: string, subtitle: string, items: Film[] }`. A ordem dos objetos no array `sections` **é a ordem sugerida de exibição**.

### 3.3 Por que a ordem não é simplesmente cronológica

A principal narrativa segue a **ordem de lançamento do MCU**, preservando descobertas, introduções de personagens e significado de cenas pós-créditos. Contudo, franquias de outros estúdios não são misturadas indiscriminadamente por data. Elas são apresentadas **em blocos completos, inseridos antes de pontos do MCU onde suas referências são relevantes**. É por isso que X-Men aparece depois da Saga do Infinito e que os filmes anteriores de Homem-Aranha vêm antes de *Sem Volta para Casa*. Deadpool e conexões antecedem *Deadpool & Wolverine*. A ordem editorial é opinativa, explicada publicamente, não uma afirmação de continuidade canônica universal.

**Alternativa:** o usuário pode optar por **organizar por ano de lançamento** nas configurações; nesse caso a lista vira grupos por ano, com desempate pela sequência original (`sequence = sectionIndex * 100 + filmIndex`). O progresso acompanha os IDs, não a posição em tela.

### 3.4 Contrato dos três filtros

| Opção exibida | Regra | Total sem busca |
| --- | --- | ---: |
| **Todos os filmes** | Sem restrição de grupo | **70** |
| **MCU** | `film.group === "mcu"` | **40** |
| **MCU + recomendados** | `film.group !== "optional"` | **52** |

A aplicação combina filtro e busca usando **AND** (um filme precisa pertencer ao escopo *e* corresponder ao texto pesquisado). O denominador do progresso visível é a quantidade de filmes resultantes desses critérios.

### 3.5 Fonte de dados para uma reconstrução independente

Abaixo segue o **catálogo exato de referência**, extraído diretamente do `sections` atual. Inclui IDs, títulos, anos, classes, sinalização temporal e comentários editoriais. As **70 sinopses originais** aparecem no apêndice seguinte. Para futura curadoria, revise os dois apêndices em conjunto.

**Legenda:** `M` = MCU; `R` = recomendado; `O` = opcional. `★` identifica a marcação `star`; `⏳` indica `future`.


#### 1. Fase 1 · A formação da equipe

*Saga do Infinito · 2008–2012* — **6 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `iron-man-2008` | **Homem de Ferro** / *Iron Man* | 2008 | M | Tony Stark constrói a primeira armadura após ser capturado e inaugura o MCU. Introduz a tecnologia, o carisma e os conflitos que moldam os Vingadores. |
| `the-incredible-hulk-2008` | **O Incrível Hulk** / *The Incredible Hulk* | 2008 | M | Bruce Banner tenta controlar uma transformação provocada por radiação gama. Integra o MCU, embora o ator principal seja substituído nos filmes seguintes. |
| `iron-man-2-2010` | **Homem de Ferro 2** / *Iron Man 2* | 2010 | M | Tony enfrenta as consequências de revelar sua identidade e lida com rivais perigosos. Amplia o papel da SHIELD e introduz Natasha Romanoff. |
| `thor-2011` | **Thor** / *Thor* | 2011 | M | O príncipe de Asgard é enviado à Terra para aprender humildade. Apresenta Loki, os deuses asgardianos e a dimensão cósmica do universo Marvel. |
| `captain-america-the-first-avenger-2011` | **Capitão América: O Primeiro Vingador** / *Captain America: The First Avenger* | 2011 | M | Na Segunda Guerra, Steve Rogers recebe o soro do supersoldado. Sua história introduz a HYDRA e um artefato decisivo para a Saga do Infinito. |
| `the-avengers-2012` | **Os Vingadores** / *The Avengers* | 2012 | M ★ | Uma invasão liderada por Loki obriga os heróis a se unirem pela primeira vez. É o grande pagamento das histórias individuais da Fase 1. |

#### 2. Fase 2 · Expansão e conflito interno

*Saga do Infinito · 2013–2015* — **6 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `iron-man-3-2013` | **Homem de Ferro 3** / *Iron Man 3* | 2013 | M | Após a batalha de Nova York, Tony enfrenta ansiedade e uma nova ameaça. Explora quem ele é além da armadura e o custo pessoal de ser herói. |
| `thor-the-dark-world-2013` | **Thor: O Mundo Sombrio** / *Thor: The Dark World* | 2013 | M | Thor enfrenta uma força antiga ligada ao Éter. A trama apresenta uma Joia do Infinito e prepara elementos importantes para os próximos filmes. |
| `captain-america-the-winter-soldier-2014` | **Capitão América: O Soldado Invernal** / *Captain America: The Winter Soldier* | 2014 | M | Steve e Natasha descobrem uma conspiração dentro da SHIELD. Um thriller de espionagem que altera profundamente o equilíbrio político do MCU. |
| `guardians-of-the-galaxy-2014` | **Guardiões da Galáxia** / *Guardians of the Galaxy* | 2014 | M | Um grupo improvável de foras da lei precisa proteger um artefato cósmico. Expande o MCU para o espaço e aprofunda a história das Joias. |
| `avengers-age-of-ultron-2015` | **Vingadores: Era de Ultron** / *Avengers: Age of Ultron* | 2015 | M ★ | Uma tentativa de proteger a humanidade dá origem a Ultron. Reúne os Vingadores, apresenta novos heróis e planta conflitos para o futuro. |
| `ant-man-2015` | **Homem-Formiga** / *Ant-Man* | 2015 | M | Scott Lang assume um traje capaz de alterar seu tamanho para impedir um roubo perigoso. Introduz Hank Pym e conceitos ligados ao Reino Quântico. |

#### 3. Fase 3 · O auge da Saga do Infinito

*Saga do Infinito · 2016–2019* — **11 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `captain-america-civil-war-2016` | **Capitão América: Guerra Civil** / *Captain America: Civil War* | 2016 | M | Um conflito sobre a supervisão dos heróis divide os Vingadores em dois lados. Apresenta o Homem-Aranha de Tom Holland e o Pantera Negra. |
| `doctor-strange-2016` | **Doutor Estranho** / *Doctor Strange* | 2016 | M | Um cirurgião arrogante descobre as artes místicas após um acidente. Abre as portas para outras dimensões e para a magia no MCU. |
| `guardians-of-the-galaxy-vol.-2-2017` | **Guardiões da Galáxia Vol. 2** / *Guardians of the Galaxy Vol. 2* | 2017 | M | Peter Quill investiga suas origens enquanto os Guardiões aprendem o significado de família. Aprofunda os laços e as diferenças entre eles. |
| `spider-man-homecoming-2017` | **Homem-Aranha: De Volta ao Lar** / *Spider-Man: Homecoming* | 2017 | M | Peter Parker tenta conciliar escola e heroísmo sob a orientação de Tony Stark. Mostra o lado cotidiano do MCU após Guerra Civil. |
| `thor-ragnarok-2017` | **Thor: Ragnarok** / *Thor: Ragnarok* | 2017 | M | Thor enfrenta Hela e o destino de Asgard, com Hulk e Loki envolvidos. O desfecho se conecta diretamente ao começo de Guerra Infinita. |
| `black-panther-2018` | **Pantera Negra** / *Black Panther* | 2018 | M | T’Challa assume o trono de Wakanda e enfrenta um rival que questiona seu legado. Apresenta mais da nação e de sua tecnologia. |
| `avengers-infinity-war-2018` | **Vingadores: Guerra Infinita** / *Avengers: Infinity War* | 2018 | M ★ | Thanos reúne as Joias do Infinito enquanto heróis da Terra e do espaço tentam detê-lo. Um dos grandes pontos de convergência do MCU. |
| `ant-man-and-the-wasp-2018` | **Homem-Formiga e a Vespa** / *Ant-Man and the Wasp* | 2018 | M | Scott e Hope investigam os mistérios do Reino Quântico. A cena pós-créditos ajuda a conectar o filme aos eventos de Guerra Infinita. |
| `captain-marvel-2019` | **Capitã Marvel** / *Captain Marvel* | 2019 | M | Ambientado nos anos 1990, apresenta Carol Danvers e a origem de sua ligação com Nick Fury. Amplia a dimensão cósmica do MCU. |
| `avengers-endgame-2019` | **Vingadores: Ultimato** / *Avengers: Endgame* | 2019 | M ★ | Os heróis sobreviventes tentam reverter as consequências de Thanos. É a conclusão emocional e narrativa da Saga do Infinito. |
| `spider-man-far-from-home-2019` | **Homem-Aranha: Longe de Casa** / *Spider-Man: Far From Home* | 2019 | M | Peter viaja à Europa tentando seguir em frente após Ultimato. Explora o legado de Tony Stark e encerra a Fase 3. |

#### 4. Especial · A Saga X-Men

*Dos primeiros mutantes ao legado de Wolverine* — **11 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `x-men-2000` | **X-Men: O Filme** / *X-Men* | 2000 | R | Apresenta Wolverine, Xavier e Magneto. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `x2-2003` | **X-Men 2** / *X2* | 2003 | R | Aprofunda o conflito entre mutantes e humanos. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `x-men-the-last-stand-2006` | **X-Men: O Confronto Final** / *X-Men: The Last Stand* | 2006 | O | Fecha a trilogia original. É um complemento independente, sem necessidade para seguir a história central. |
| `x-men-origins-wolverine-2009` | **X-Men Origens: Wolverine** / *X-Men Origins: Wolverine* | 2009 | O | Explora o passado de Logan. É um complemento independente, sem necessidade para seguir a história central. |
| `x-men-first-class-2011` | **X-Men: Primeira Classe** / *X-Men: First Class* | 2011 | R | Mostra a origem da relação Xavier–Magneto. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `the-wolverine-2013` | **Wolverine: Imortal** / *The Wolverine* | 2013 | O | Aventura solo no Japão. É um complemento independente, sem necessidade para seguir a história central. |
| `x-men-days-of-future-past-2014` | **X-Men: Dias de um Futuro Esquecido** / *X-Men: Days of Future Past* | 2014 | R | Conecta gerações e altera a linha do tempo. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `x-men-apocalypse-2016` | **X-Men: Apocalipse** / *X-Men: Apocalypse* | 2016 | O | Continua a história da equipe jovem. É um complemento independente, sem necessidade para seguir a história central. |
| `logan-2017` | **Logan** / *Logan* | 2017 | R | Despedida marcante de Wolverine; importante para Deadpool & Wolverine. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `dark-phoenix-2019` | **X-Men: Fênix Negra** / *Dark Phoenix* | 2019 | O | Desfecho da equipe jovem. É um complemento independente, sem necessidade para seguir a história central. |
| `the-new-mutants-2020` | **Os Novos Mutantes** / *The New Mutants* | 2020 | O | História paralela, sem necessidade para o MCU. É um complemento independente, sem necessidade para seguir a história central. |

#### 5. Fase 4 · Novos heróis e novas lendas

*Saga do Multiverso · 2021* — **3 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `black-widow-2021` | **Viúva Negra** / *Black Widow* | 2021 | M | Uma história situada antes de Ultimato. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `shang-chi-and-the-legend-of-the-ten-rings-2021` | **Shang-Chi e a Lenda dos Dez Anéis** / *Shang-Chi and the Legend of the Ten Rings* | 2021 | M | Apresenta um novo herói. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `eternals-2021` | **Eternos** / *Eternals* | 2021 | M | Expande a mitologia cósmica. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |

#### 6. Especial · Os outros Homens-Aranha

*As histórias de Tobey Maguire e Andrew Garfield, antes de Sem Volta para Casa* — **5 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `spider-man-2002` | **Homem-Aranha** / *Spider-Man* | 2002 | R | Primeiro filme da trilogia de Tobey Maguire. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `spider-man-2-2004` | **Homem-Aranha 2** / *Spider-Man 2* | 2004 | R | Continua a jornada de Peter Parker. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `spider-man-3-2007` | **Homem-Aranha 3** / *Spider-Man 3* | 2007 | R | Encerra a trilogia de Tobey. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `the-amazing-spider-man-2012` | **O Espetacular Homem-Aranha** / *The Amazing Spider-Man* | 2012 | R | Nova versão com Andrew Garfield. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `the-amazing-spider-man-2-2014` | **O Espetacular Homem-Aranha 2: A Ameaça de Electro** / *The Amazing Spider-Man 2* | 2014 | R | Conclui a duologia de Andrew Garfield. Ajuda a reconhecer personagens e referências nos encontros entre universos. |

#### 7. Fase 4 · O multiverso se abre

*Saga do Multiverso · 2021–2022* — **4 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `spider-man-no-way-home-2021` | **Homem-Aranha: Sem Volta para Casa** / *Spider-Man: No Way Home* | 2021 | M | Um feitiço dá errado e coloca Peter diante das consequências do multiverso. Ganha muito mais impacto após os filmes de Tobey e Andrew. |
| `doctor-strange-in-the-multiverse-of-madness-2022` | **Doutor Estranho no Multiverso da Loucura** / *Doctor Strange in the Multiverse of Madness* | 2022 | M | Stephen Strange atravessa realidades alternativas para proteger uma jovem com poderes raros. WandaVision oferece contexto essencial para Wanda. |
| `thor-love-and-thunder-2022` | **Thor: Amor e Trovão** / *Thor: Love and Thunder* | 2022 | M | Continua a trajetória de seus protagonistas e amplia o universo Marvel. Vale acompanhar para conhecer melhor os personagens e suas relações. |
| `black-panther-wakanda-forever-2022` | **Pantera Negra: Wakanda Para Sempre** / *Black Panther: Wakanda Forever* | 2022 | M | A sucessão do legado de Wakanda. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |

#### 8. Fase 5 · Novas ameaças

*Saga do Multiverso · 2023* — **3 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `ant-man-and-the-wasp-quantumania-2023` | **Homem-Formiga e a Vespa: Quantumania** / *Ant-Man and the Wasp: Quantumania* | 2023 | M | Explora o Reino Quântico. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `guardians-of-the-galaxy-vol.-3-2023` | **Guardiões da Galáxia Vol. 3** / *Guardians of the Galaxy Vol. 3* | 2023 | M | Conclusão emocional de um ciclo da equipe. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `the-marvels-2023` | **As Marvels** / *The Marvels* | 2023 | M | Continuação conectada a Ms. Marvel e WandaVision. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |

#### 9. Especial · Deadpool e conexões

*As aventuras e referências que enriquecem Deadpool & Wolverine* — **4 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `fantastic-four-2005` | **Quarteto Fantástico** / *Fantastic Four* | 2005 | O | Conheça a formação clássica da Fox. É um complemento independente, sem necessidade para seguir a história central. |
| `fantastic-four-rise-of-the-silver-surfer-2007` | **Quarteto Fantástico e o Surfista Prateado** / *Fantastic Four: Rise of the Silver Surfer* | 2007 | O | Continuação da equipe original da Fox. É um complemento independente, sem necessidade para seguir a história central. |
| `deadpool-2016` | **Deadpool** / *Deadpool* | 2016 | R | Apresenta Wade Wilson; conteúdo adulto. Ajuda a reconhecer personagens e referências nos encontros entre universos. |
| `deadpool-2-2018` | **Deadpool 2** / *Deadpool 2* | 2018 | R | Fundamental para entender suas relações; conteúdo adulto. Ajuda a reconhecer personagens e referências nos encontros entre universos. |

#### 10. Fase 5 · Encontros e novas equipes

*Saga do Multiverso · 2024–2025* — **3 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `deadpool-and-wolverine-2024` | **Deadpool & Wolverine** / *Deadpool & Wolverine* | 2024 | M | Wade Wilson e Wolverine enfrentam problemas envolvendo a TVA e diferentes realidades. Deadpool 1–2, Logan e Loki enriquecem as referências. |
| `captain-america-brave-new-world-2025` | **Capitão América: Admirável Mundo Novo** / *Captain America: Brave New World* | 2025 | M | Sam Wilson lidera uma nova fase do Capitão América. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `thunderbolts*-2025` | **Thunderbolts*** / *Thunderbolts** | 2025 | M | Uma equipe formada por figuras improváveis. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |

#### 11. Fase 6 · Rumo ao desfecho

*Saga do Multiverso · 2025–2027* — **4 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `the-fantastic-four-first-steps-2025` | **Quarteto Fantástico: Primeiros Passos** / *The Fantastic Four: First Steps* | 2025 | M | Apresenta uma nova versão da Primeira Família. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `spider-man-brand-new-day-2026` | **Homem-Aranha: Um Novo Dia** / *Spider-Man: Brand New Day* | 2026 | M | Continua a história de Peter Parker depois de Sem Volta para Casa. Faz parte do MCU e acrescenta contexto à trajetória dos personagens. |
| `avengers-doomsday-2026` | **Vingadores: Doomsday** / *Avengers: Doomsday* | 2026 ⏳ | M ★ | Próximo grande encontro anunciado dos Vingadores, previsto para dezembro de 2026. A trama deve ampliar os conflitos multiversais. |
| `avengers-secret-wars-2027` | **Vingadores: Guerras Secretas** / *Avengers: Secret Wars* | 2027 ⏳ | M ★ | Grande evento anunciado para dezembro de 2027 e planejado como encerramento da Saga do Multiverso. |

#### 12. Extras · Outras adaptações da Marvel

*Complementos opcionais para curiosos* — **10 filmes**.

| ID estável | Título PT / original | Ano | Grupo | Nota editorial |
| --- | --- | ---: | :---: | --- |
| `hulk-2003` | **Hulk** / *Hulk* | 2003 | O | Versão independente de Ang Lee, não é prequela do Hulk de 2008. É um complemento independente, sem necessidade para seguir a história central. |
| `blade-1998` | **Blade, o Caçador de Vampiros** / *Blade* | 1998 | O | Filme de origem da trilogia de Wesley Snipes; conteúdo adulto. É um complemento independente, sem necessidade para seguir a história central. |
| `blade-ii-2002` | **Blade II** / *Blade II* | 2002 | O | Continuação da franquia de vampiros. É um complemento independente, sem necessidade para seguir a história central. |
| `blade-trinity-2004` | **Blade: Trinity** / *Blade: Trinity* | 2004 | O | Encerra a trilogia. É um complemento independente, sem necessidade para seguir a história central. |
| `daredevil-2003` | **Demolidor: O Homem Sem Medo** / *Daredevil* | 2003 | O | Versão cinematográfica anterior ao MCU. É um complemento independente, sem necessidade para seguir a história central. |
| `elektra-2005` | **Elektra** / *Elektra* | 2005 | O | Derivado do Demolidor de 2003. É um complemento independente, sem necessidade para seguir a história central. |
| `fantastic-four-2015` | **Quarteto Fantástico** / *Fantastic Four* | 2015 | O | Reboot independente da franquia. É um complemento independente, sem necessidade para seguir a história central. |
| `venom-2018` | **Venom** / *Venom* | 2018 | O | Universo Sony, com ligação pontual ao multiverso. É um complemento independente, sem necessidade para seguir a história central. |
| `venom-let-there-be-carnage-2021` | **Venom: Tempo de Carnificina** / *Venom: Let There Be Carnage* | 2021 | O | Contém conexão nas cenas adicionais. É um complemento independente, sem necessidade para seguir a história central. |
| `venom-the-last-dance-2024` | **Venom: A Última Rodada** / *Venom: The Last Dance* | 2024 | O | Conclusão da trilogia Sony. É um complemento independente, sem necessidade para seguir a história central. |

### 3.6 Sinopses originais vinculadas aos IDs

O seguinte dicionário de conteúdo é parte dos requisitos editoriais do snapshot. Ao migrar, **associe por ID**, nunca por nome ou posição. A apresentação padrão usa painéis individuais fechados; ler uma sinopse não marca o filme como visto.

#### Fase 1 · A formação da equipe

**Homem de Ferro** — `iron-man-2008`

Após ser capturado durante uma demonstração de armamentos, Tony Stark constrói uma armadura para escapar. De volta para casa, o empresário passa a questionar o impacto das armas de sua companhia e decide usar sua tecnologia para enfrentar novas ameaças.

**O Incrível Hulk** — `the-incredible-hulk-2008`

Bruce Banner vive escondido enquanto procura uma cura para a condição que o transforma em uma criatura de força extraordinária quando perde o controle. Sua tentativa de permanecer longe dos militares é ameaçada por um experimento que cria um adversário igualmente perigoso.

**Homem de Ferro 2** — `iron-man-2-2010`

Com sua identidade de Homem de Ferro conhecida mundialmente, Tony Stark enfrenta pressões do governo, problemas de saúde e um rival que desenvolve tecnologia semelhante à sua. Para superar essas ameaças, ele precisa aceitar a ajuda de antigos e novos aliados.

**Thor** — `thor-2011`

Thor, herdeiro do trono de Asgard, é banido para a Terra após desafiar as ordens do pai. Sem seus poderes, precisa aprender a conviver com humanos e demonstrar que merece seu martelo, enquanto seu irmão Loki trama para conquistar espaço em Asgard.

**Capitão América: O Primeiro Vingador** — `captain-america-the-first-avenger-2011`

Durante a Segunda Guerra Mundial, o jovem Steve Rogers quer servir ao país, mas não consegue se alistar por causa de sua saúde frágil. Selecionado para um experimento militar, torna-se o Capitão América e enfrenta uma organização que pretende usar uma energia misteriosa como arma.

**Os Vingadores** — `the-avengers-2012`

Quando Loki chega à Terra com um exército alienígena e ameaça a humanidade, Nick Fury reúne heróis que até então agiam separadamente. Homem de Ferro, Capitão América, Thor, Hulk, Viúva Negra e Gavião Arqueiro precisam superar suas diferenças para lutar juntos.

#### Fase 2 · Expansão e conflito interno

**Homem de Ferro 3** — `iron-man-3-2013`

Abalado pelos acontecimentos em Nova York, Tony Stark passa a depender cada vez mais de suas armaduras. Quando um terrorista conhecido como Mandarim ameaça pessoas próximas a ele, Tony enfrenta um desafio que coloca sua identidade e seus recursos à prova.

**Thor: O Mundo Sombrio** — `thor-the-dark-world-2013`

Uma antiga força desperta quando Jane Foster entra em contato com uma energia misteriosa. Thor precisa protegê-la e impedir que Malekith, líder dos Elfos Negros, utilize esse poder para mergulhar os Nove Reinos na escuridão.

**Capitão América: O Soldado Invernal** — `captain-america-the-winter-soldier-2014`

Tentando se adaptar ao mundo moderno, Steve Rogers trabalha para a SHIELD, mas descobre que nem tudo é o que parece. Ao lado de Natasha Romanoff e Sam Wilson, ele investiga uma conspiração enquanto é perseguido por um assassino extremamente habilidoso.

**Guardiões da Galáxia** — `guardians-of-the-galaxy-2014`

O aventureiro Peter Quill rouba um objeto cobiçado por forças poderosas e acaba formando uma aliança improvável com Gamora, Drax, Rocket e Groot. Entre fugas e desentendimentos, o grupo precisa impedir que o artefato seja usado para destruir mundos.

**Vingadores: Era de Ultron** — `avengers-age-of-ultron-2015`

Tony Stark e Bruce Banner tentam criar um sistema de defesa global, mas o projeto ganha consciência e conclui que a humanidade é o verdadeiro problema. Os Vingadores se reúnem para impedir Ultron e lidar com novos aliados e inimigos.

**Homem-Formiga** — `ant-man-2015`

O ex-presidiário Scott Lang recebe a oportunidade de mudar de vida quando o cientista Hank Pym o recruta para uma missão. Equipado com um traje que permite encolher e ampliar sua força, Scott precisa executar um roubo que poderá evitar uma grave ameaça.

#### Fase 3 · O auge da Saga do Infinito

**Capitão América: Guerra Civil** — `captain-america-civil-war-2016`

Após uma missão com consequências internacionais, os governos exigem maior controle sobre os Vingadores. A proposta divide a equipe entre os que defendem a supervisão e os que temem perder a liberdade de agir, transformando antigos aliados em adversários.

**Doutor Estranho** — `doctor-strange-2016`

O brilhante cirurgião Stephen Strange perde a precisão das mãos em um acidente e procura tratamentos que a medicina não oferece. Sua busca o leva a aprender artes místicas e a descobrir ameaças que ultrapassam a realidade conhecida.

**Guardiões da Galáxia Vol. 2** — `guardians-of-the-galaxy-vol.-2-2017`

Enquanto tentam manter a equipe unida, os Guardiões encontram um ser poderoso que afirma conhecer a verdadeira origem de Peter Quill. Revelações sobre família, lealdade e passado colocam os integrantes do grupo diante de decisões difíceis.

**Homem-Aranha: De Volta ao Lar** — `spider-man-homecoming-2017`

Depois de participar de uma missão com os Vingadores, Peter Parker volta à rotina escolar e tenta provar que está pronto para desafios maiores. Sua investigação sobre armas alienígenas o coloca no caminho de um criminoso conhecido como Abutre.

**Thor: Ragnarok** — `thor-ragnarok-2017`

Thor descobre que uma inimiga poderosa ameaça Asgard e acaba preso em um planeta distante, onde é forçado a lutar em uma arena. Para voltar para casa, precisa reunir aliados improváveis, incluindo Hulk e Loki, antes que seu mundo seja destruído.

**Pantera Negra** — `black-panther-2018`

Após a morte do pai, T’Challa retorna a Wakanda para assumir o trono e proteger os segredos de sua nação. Um adversário com ligação ao passado da família real desafia seu direito de governar e suas ideias sobre o papel de Wakanda no mundo.

**Vingadores: Guerra Infinita** — `avengers-infinity-war-2018`

Thanos inicia uma campanha para reunir seis Joias do Infinito e impor sua visão de equilíbrio ao universo. Heróis espalhados pela Terra e pelo espaço tentam impedir seus planos, mesmo sem saber se terão forças suficientes para detê-lo.

**Homem-Formiga e a Vespa** — `ant-man-and-the-wasp-2018`

Scott Lang tenta cumprir sua prisão domiciliar enquanto Hope van Dyne e Hank Pym buscam uma maneira de resgatar Janet do Reino Quântico. A missão se complica quando uma misteriosa mulher capaz de atravessar objetos também passa a disputar a tecnologia.

**Capitã Marvel** — `captain-marvel-2019`

Nos anos 1990, uma guerreira conhecida como Vers chega à Terra durante uma guerra entre povos alienígenas. Ao investigar lembranças fragmentadas de seu passado, ela conhece Nick Fury e descobre pistas sobre sua verdadeira identidade e seus poderes.

**Vingadores: Ultimato** — `avengers-endgame-2019`

Depois de uma perda devastadora, os Vingadores sobreviventes tentam encontrar uma forma de reparar os danos causados por Thanos. Uma possibilidade inesperada exige coragem, sacrifícios e a colaboração de heróis que ainda acreditam em uma segunda chance.

**Homem-Aranha: Longe de Casa** — `spider-man-far-from-home-2019`

Peter Parker viaja à Europa com colegas da escola na esperança de aproveitar as férias e deixar as responsabilidades heroicas de lado. Mas estranhas criaturas ameaçam cidades e um novo aliado chamado Mysterio surge para ajudá-lo.

#### Especial · A Saga X-Men

**X-Men: O Filme** — `x-men-2000`

Em um mundo no qual mutantes são temidos por suas habilidades, o professor Charles Xavier mantém uma escola para jovens com poderes especiais. Enquanto Wolverine e Vampira procuram um lugar seguro, Magneto prepara um plano para alterar a relação entre mutantes e humanos.

**X-Men 2** — `x2-2003`

Um ataque misterioso à Casa Branca amplia o medo dos mutantes e leva o governo a agir contra a escola de Xavier. Os X-Men precisam encontrar um inimigo que conhece profundamente seus poderes e ameaça toda a comunidade mutante.

**X-Men: O Confronto Final** — `x-men-the-last-stand-2006`

A descoberta de uma possível cura para as mutações divide opiniões e intensifica a tensão entre humanos e mutantes. Ao mesmo tempo, o retorno de uma força excepcional coloca os X-Men diante de um conflito pessoal e de uma batalha de grandes proporções.

**X-Men Origens: Wolverine** — `x-men-origins-wolverine-2009`

Logan atravessa décadas de conflitos ao lado de seu meio-irmão Victor Creed, até ser recrutado para um programa militar secreto. Traições e experiências perigosas ajudam a explicar como ele recebeu suas garras de adamantium e perdeu parte de suas lembranças.

**X-Men: Primeira Classe** — `x-men-first-class-2011`

Durante a Guerra Fria, o jovem Charles Xavier conhece Erik Lehnsherr, um mutante marcado por experiências traumáticas. Os dois formam uma equipe para impedir uma ameaça mundial, mas suas opiniões diferentes sobre a humanidade começam a separá-los.

**Wolverine: Imortal** — `the-wolverine-2013`

Atormentado por acontecimentos do passado, Logan viaja ao Japão a convite de um homem que conheceu décadas antes. Envolvido em disputas familiares e perseguições, ele se vê vulnerável de uma maneira inesperada e precisa decidir pelo que ainda vale lutar.

**X-Men: Dias de um Futuro Esquecido** — `x-men-days-of-future-past-2014`

Em um futuro no qual máquinas caçam mutantes, os X-Men elaboram um plano para evitar a catástrofe. A consciência de Wolverine é enviada ao passado, onde ele precisa reunir antigos aliados e impedir um acontecimento que mudará a história.

**X-Men: Apocalipse** — `x-men-apocalypse-2016`

Um mutante ancestral desperta após milhares de anos e decide reconstruir o mundo à sua imagem. Enquanto recruta seguidores poderosos, Charles Xavier e seus alunos tentam impedir a destruição e descobrir a extensão de suas próprias habilidades.

**Logan** — `logan-2017`

Em um futuro próximo, Logan vive isolado e cuida de um Charles Xavier debilitado. Seu desejo de permanecer fora dos conflitos termina quando uma menina com capacidades extraordinárias precisa de proteção contra forças que a perseguem.

**X-Men: Fênix Negra** — `dark-phoenix-2019`

Durante uma missão de resgate no espaço, Jean Grey entra em contato com uma força cósmica que amplifica seus poderes. Conforme perde o controle, antigos laços são colocados à prova e a equipe precisa decidir como proteger a todos.

**Os Novos Mutantes** — `the-new-mutants-2020`

Cinco jovens com habilidades extraordinárias são mantidos em uma instituição isolada, supostamente para aprender a controlar seus poderes. À medida que acontecimentos assustadores se intensificam, eles questionam as intenções de quem os mantém ali.

#### Fase 4 · Novos heróis e novas lendas

**Viúva Negra** — `black-widow-2021`

Natasha Romanoff é obrigada a confrontar lembranças de sua vida como espiã quando uma conspiração ligada ao programa que a treinou vem à tona. Ao reencontrar pessoas de seu passado, ela enfrenta um inimigo que controla assassinas altamente preparadas.

**Shang-Chi e a Lenda dos Dez Anéis** — `shang-chi-and-the-legend-of-the-ten-rings-2021`

Shang-Chi tenta levar uma vida discreta em São Francisco, mas seu passado volta quando homens ligados à organização dos Dez Anéis o encontram. Para proteger quem ama, ele precisa enfrentar o legado de sua família e habilidades que tentou abandonar.

**Eternos** — `eternals-2021`

Seres imortais enviados à Terra há milhares de anos voltam a se reunir quando uma antiga ameaça reaparece. Enquanto investigam o propósito de sua missão, os Eternos precisam confrontar escolhas feitas ao longo de séculos de convivência com a humanidade.

#### Especial · Os outros Homens-Aranha

**Homem-Aranha** — `spider-man-2002`

Após ser picado por uma aranha geneticamente modificada, o estudante Peter Parker descobre habilidades extraordinárias. Uma perda pessoal o faz entender o peso de suas escolhas, enquanto o misterioso Duende Verde ameaça sua cidade e as pessoas próximas a ele.

**Homem-Aranha 2** — `spider-man-2-2004`

Peter Parker enfrenta dificuldades para equilibrar faculdade, trabalho, relacionamentos e sua vida como Homem-Aranha. Quando um cientista brilhante sofre um acidente que transforma seus braços mecânicos em uma ameaça, Peter precisa decidir que tipo de vida deseja seguir.

**Homem-Aranha 3** — `spider-man-3-2007`

No auge da popularidade como Homem-Aranha, Peter Parker se vê dividido entre problemas afetivos, novos adversários e um estranho organismo que altera seu comportamento. Seus impulsos colocam à prova os vínculos que mais valoriza.

**O Espetacular Homem-Aranha** — `the-amazing-spider-man-2012`

Peter Parker investiga o desaparecimento de seus pais e encontra pistas em pesquisas conduzidas por um antigo colega do pai. Depois de adquirir poderes aracnídeos, ele precisa enfrentar uma criatura perigosa enquanto se aproxima de Gwen Stacy.

**O Espetacular Homem-Aranha 2: A Ameaça de Electro** — `the-amazing-spider-man-2-2014`

Peter Parker tenta manter seu relacionamento com Gwen Stacy enquanto enfrenta as consequências de ser o Homem-Aranha. O surgimento de Electro e o retorno de Harry Osborn ameaçam sua cidade e expõem segredos ligados à Oscorp.

#### Fase 4 · O multiverso se abre

**Homem-Aranha: Sem Volta para Casa** — `spider-man-no-way-home-2021`

Quando sua identidade secreta é revelada, Peter Parker procura Doutor Estranho para recuperar a vida que tinha. Um feitiço acaba afetando as fronteiras entre universos, trazendo visitantes inesperados e escolhas que colocarão sua responsabilidade à prova.

**Doutor Estranho no Multiverso da Loucura** — `doctor-strange-in-the-multiverse-of-madness-2022`

Doutor Estranho conhece America Chavez, uma jovem capaz de viajar entre universos, e tenta protegê-la de uma perseguição misteriosa. A busca por respostas o leva a realidades alternativas e a reencontrar personagens marcados por perdas recentes.

**Thor: Amor e Trovão** — `thor-love-and-thunder-2022`

Thor procura um novo propósito depois de muitas batalhas, mas retorna à ação quando um assassino de deuses ameaça diferentes mundos. Com a ajuda de Valquíria, Korg e Jane Foster, ele parte para impedir a próxima tragédia.

**Pantera Negra: Wakanda Para Sempre** — `black-panther-wakanda-forever-2022`

Wakanda enfrenta o luto e pressões externas após perder seu rei. Quando uma poderosa civilização submarina surge e exige uma decisão difícil, Shuri, Ramonda e os protetores do país precisam defender seu povo e preservar seu legado.

#### Fase 5 · Novas ameaças

**Homem-Formiga e a Vespa: Quantumania** — `ant-man-and-the-wasp-quantumania-2023`

Scott Lang, Hope e suas famílias são transportados para o Reino Quântico, onde descobrem povos, criaturas e conflitos desconhecidos. Para encontrar o caminho de volta, precisam enfrentar um governante que esconde ambições muito maiores.

**Guardiões da Galáxia Vol. 3** — `guardians-of-the-galaxy-vol.-3-2023`

Quando um dos Guardiões corre perigo, Peter Quill reúne a equipe para uma missão de resgate que revela acontecimentos dolorosos do passado de Rocket. O grupo precisa enfrentar um inimigo obcecado por controlar a evolução da vida.

**As Marvels** — `the-marvels-2023`

Carol Danvers percebe que seus poderes se conectaram misteriosamente aos de Monica Rambeau e Kamala Khan. As três passam a trocar de lugar sempre que usam suas habilidades, obrigando-as a trabalhar juntas contra uma ameaça intergaláctica.

#### Especial · Deadpool e conexões

**Quarteto Fantástico** — `fantastic-four-2005`

Durante uma missão espacial, quatro cientistas e um piloto são atingidos por radiação cósmica e desenvolvem poderes extraordinários. Enquanto aprendem a lidar com as transformações, enfrentam Victor Von Doom, que sofreu mudanças durante o mesmo acidente.

**Quarteto Fantástico e o Surfista Prateado** — `fantastic-four-rise-of-the-silver-surfer-2007`

O Quarteto Fantástico se prepara para uma nova etapa de suas vidas quando um misterioso ser prateado começa a aparecer pelo planeta. Sua chegada anuncia uma ameaça de escala mundial, obrigando a equipe a deixar questões pessoais de lado.

**Deadpool** — `deadpool-2016`

Wade Wilson, um ex-militar de humor ácido, aceita um tratamento experimental após receber um diagnóstico grave. A experiência lhe concede poderes de regeneração, mas o deixa desfigurado, dando início a uma busca irreverente por vingança.

**Deadpool 2** — `deadpool-2-2018`

Depois de uma perda pessoal, Deadpool tenta encontrar um novo propósito e acaba envolvido na proteção de um jovem mutante. A situação se complica com a chegada de Cable, um soldado vindo do futuro, e com a formação de uma equipe pouco convencional.

#### Fase 5 · Encontros e novas equipes

**Deadpool & Wolverine** — `deadpool-and-wolverine-2024`

Deadpool descobre que a existência de seu universo está ameaçada e procura uma versão de Wolverine para ajudá-lo. Os dois são arrastados para uma aventura envolvendo a Autoridade de Variância Temporal e personagens de diferentes realidades.

**Capitão América: Admirável Mundo Novo** — `captain-america-brave-new-world-2025`

Sam Wilson assume o papel de Capitão América e se vê envolvido em uma crise internacional após um encontro com o presidente dos Estados Unidos. Ao investigar uma conspiração, precisa escolher em quem confiar e impedir que o conflito se agrave.

**Thunderbolts*** — `thunderbolts*-2025`

Um grupo de agentes e anti-heróis é atraído para uma armadilha durante uma missão secreta. Sem poder confiar em seus antigos superiores, eles precisam colaborar para sobreviver e enfrentar uma ameaça relacionada a experiências do passado.

#### Fase 6 · Rumo ao desfecho

**Quarteto Fantástico: Primeiros Passos** — `the-fantastic-four-first-steps-2025`

Reed Richards, Sue Storm, Johnny Storm e Ben Grimm conciliam a vida familiar com a responsabilidade de proteger seu mundo. Quando uma ameaça cósmica surge, a equipe precisa enfrentar um desafio que envolve tanto o futuro da Terra quanto seus laços pessoais.

**Homem-Aranha: Um Novo Dia** — `spider-man-brand-new-day-2026`

Após os acontecimentos de Sem Volta para Casa, Peter Parker segue sua vida como Homem-Aranha em uma nova fase, enfrentando as consequências de suas escolhas. A aventura acompanha sua tentativa de proteger Nova York e encontrar um novo equilíbrio pessoal.

**Vingadores: Doomsday** — `avengers-doomsday-2026`

Os Vingadores e outros heróis do universo Marvel se preparam para enfrentar uma ameaça de proporções extraordinárias ligada ao Doutor Destino. Como o filme ainda não estreou, os detalhes oficiais da história permanecem limitados e sujeitos a mudanças.

**Vingadores: Guerras Secretas** — `avengers-secret-wars-2027`

Anunciado como um grande encontro de heróis e realidades, o filme dará continuidade aos eventos de Doomsday e ao encerramento planejado da Saga do Multiverso. Sua trama completa ainda não foi divulgada oficialmente.

#### Extras · Outras adaptações da Marvel

**Hulk** — `hulk-2003`

Bruce Banner trabalha em pesquisas envolvendo regeneração celular quando um acidente com radiação desencadeia uma transformação incontrolável. Enquanto tenta entender a origem de seus poderes, ele confronta traumas familiares e a perseguição dos militares.

**Blade, o Caçador de Vampiros** — `blade-1998`

Blade é um caçador que possui habilidades de vampiro, mas pode caminhar sob o sol. Determinado a impedir que vampiros dominem os humanos, ele investiga os planos de Deacon Frost e enfrenta uma ameaça ligada à sua própria origem.

**Blade II** — `blade-ii-2002`

Blade é obrigado a se aliar a um grupo de vampiros que costumava combater quando surge uma nova espécie de predadores. Mais perigosos e difíceis de deter, esses seres ameaçam tanto humanos quanto vampiros.

**Blade: Trinity** — `blade-trinity-2004`

Blade é perseguido pelas autoridades após ser incriminado e descobre que seus inimigos pretendem despertar um vampiro lendário. Com a ajuda de novos caçadores, ele tenta impedir que a ameaça se espalhe.

**Demolidor: O Homem Sem Medo** — `daredevil-2003`

Cego desde a infância, Matt Murdock desenvolve sentidos extraordinariamente aguçados e atua como advogado durante o dia. À noite, torna-se Demolidor e enfrenta o crime em Hell’s Kitchen, até cruzar o caminho de Elektra e do poderoso Rei do Crime.

**Elektra** — `elektra-2005`

Depois de sobreviver a acontecimentos traumáticos, Elektra torna-se uma assassina profissional. Ao receber uma missão que envolve um pai e sua filha, ela precisa decidir entre cumprir o contrato e proteger pessoas perseguidas por uma organização secreta.

**Quarteto Fantástico** — `fantastic-four-2015`

Quatro jovens participam de um experimento que os transporta para outra dimensão, onde uma exposição inesperada altera seus corpos. Ao retornar, precisam aprender a controlar habilidades extraordinárias e enfrentar as consequências de uma missão que saiu do controle.

**Venom** — `venom-2018`

O jornalista Eddie Brock investiga experiências ilegais conduzidas por uma empresa de biotecnologia e acaba se unindo a um organismo alienígena. Enquanto tenta conviver com a criatura chamada Venom, descobre planos que ameaçam a humanidade.

**Venom: Tempo de Carnificina** — `venom-let-there-be-carnage-2021`

Eddie Brock tenta estabelecer regras para sua convivência com Venom, mas sua investigação sobre o assassino Cletus Kasady desencadeia um novo perigo. A ameaça cresce quando outro simbionte surge e coloca a cidade em risco.

**Venom: A Última Rodada** — `venom-the-last-dance-2024`

Eddie Brock e Venom passam a ser perseguidos por forças humanas e alienígenas, enquanto uma ameaça ligada à origem dos simbiontes se aproxima. A dupla precisa tomar decisões difíceis para impedir consequências maiores.


---

## 4. Jornada do usuário e estrutura visual da home

### 4.1 Entrada na página

1. O visitante abre a URL pública no GitHub Pages.
2. O script de tema no `<head>` consulta a preferência local antes da pintura do CSS, atribui `html.dataset.theme` igual a `light` ou `dark` e ajusta a meta `theme-color`.
3. A home inicializa catálogo e dicionário de sinopses, lê progresso e preferências do `localStorage` com `try/catch`, aplica padrões, inicializa seções recolhidas e renderiza o estado.
4. A capa apresenta **Maratona Marvel**, ícone de claquete, texto explicativo e controle de configurações.
5. Abaixo, os números de filmes vistos, total, percentual, restantes e uma barra de progresso acessível apresentam a situação da lista ativa.
6. A pessoa escolhe um dos três filtros, opcionalmente pesquisa ou organiza por ano, marca filmes, expande seções e ajusta preferências.
7. Após o conteúdo, o rodapé reúne identidade, compartilhamento, ferramentas de backup (na home), links e dedicatória.

### 4.2 Cabeçalho e capa

- Identidade em tom **vermelho Marvel** em contraste com corpo branco/cinza-acinzentado no tema claro.
- Palavra **Maratona Marvel** com hierarquia tipográfica e ícone de claquete integrado ao título, mantendo dimensões/alinhamento corretos especialmente no Safari.
- Texto breve apresenta a proposta; evitar manchetes grandiosas que deem a entender um serviço de streaming.
- Botão de configurações tem ícone próprio, rótulo acessível e abre modal nativo `<dialog>`.
- No celular, a **capa vai de borda a borda**, enquanto a lista preserva margens laterais para leitura.
- No desktop, conteúdo centralizado com largura editorial (em geral limite próximo de **940px** para home).
- Tema claro/escuro não significa trocar o fundo da capa por um azul corporativo: a identidade vermelha é elemento central.

### 4.3 Cartão de progresso abaixo da capa

- À esquerda: ícone de **película/filme**, numerador de vistos, separador "/" e denominador total.
- Os três caracteres numéricos e a barra devem ser **alinhados verticalmente pelo mesmo eixo**; solução adotada: `inline-flex` em `.progress-numbers`, `align-items:center`, números tabulares e separador independente.
- Texto subordinado: "**filmes vistos · X% concluído**".
- À direita: número de filmes restantes, atualizado com os filtros e a busca.
- Barra `role="progressbar"` com mínimo 0, máximo 100 e `aria-valuenow` atualizado.
- A contagem **não é sempre 70**: filtro MCU e busca alteram numerador, denominador e percentual da **visão atual**.
- **Separar duas semânticas:** percentual visível depende da seleção filtrada; **conclusão total de maratona** depende dos **70 registros** marcados, mesmo se o usuário estiver pesquisando apenas um título.

### 4.4 Barra fixa de progresso (`stickyProgress`)

- Quando habilitada, ao ultrapassar o componente de progresso original, aparece uma barra superior compacta com "Progresso", vistos/total, trilho e percentual.
- Posição fixa, pequena distância do topo, superfície do tema, sombra discreta e bom contraste.
- Transição suave entrada/saída; respeitar `prefers-reduced-motion`.
- **Não é mostrada no modo minimalista**; tampouco deve encobrir a janela de configurações.
- O estado depende da posição da barra original (`getBoundingClientRect().bottom < 0`), rolagem, redimensionamento, `prefs.stickyProgress` e estado do modal.
- Deve permanecer inacessível a cliques quando escondida (na implementação existente, via `pointer-events:none`).
- No celular, evitar sobrepor notch, gestos e controles.

### 4.5 Filtros, busca e texto de ajuda

- Os três filtros formam controle visual compacto em que apenas um está ativo; `aria-pressed` acompanha o estado.
- O filtro selecionado usa **vermelho coerente com a capa nos dois temas**, não azul default.
- Campo de busca acompanha os filtros no desktop e se adapta em larguras reduzidas.
- Busca consulta `pt`, `en` e `year` no conjunto de filmes, com `toLocaleLowerCase('pt-BR')` e comparação textual. A busca não depende do idioma que está sendo exibido.
- A entrada traz placeholder/`aria-label` “Buscar filme” e um botão de limpar acessível, oculto quando não há texto.
- O texto contextual sob os filtros muda: todos → MCU + recomendados + opcionais; MCU → oficiais; recomendados → complementos sem extras.
- Um segundo texto orienta a marcar filmes e tocar no título para pesquisar.
- O título do filme **é um link para busca externa** no Google, aberto em nova aba com `rel="noopener noreferrer"`; não deve parecer botão de player.

### 4.6 Sem resultados

Se filtros + busca retornarem zero itens, apresentar indicação simples e legível de que não há filmes encontrados, sem exibir uma seção vazia. O progresso deve permanecer matematicamente válido: se denominador zero, percentual exibido igual a zero; nunca `NaN` ou divisão por zero.

---

## 5. Seções, expansão, seleção e persistência

### 5.1 Anatomia de uma seção

Uma `section.saga` possui:

1. **Checkbox circular** de marcação em massa, à esquerda.
2. **Título** com nome editorial e **subtítulo** (em português, normalmente fase/saga ou descrição temática).
3. **Contador clicável** de vistos/total da seção, por exemplo **0 / 6**, com largura constante e números tabulares.
4. **Seta triangular** de expandir/recolher, alinhada à direita.
5. Lista animada de filmes.

Na organização por ano, os mesmos mecanismos valem para seções de agrupamento **"2021", "2022"**, etc., e não apenas para os nomes dos blocos da curadoria.

### 5.2 Regras de clique e teclado

- Clicar ou tocar no **título**, **subtítulo**, **contador**, **seta** ou **espaço vazio do cabeçalho** alterna a expansão.
- O **checkbox circular não expande/recolhe**. Ele altera a marcação de todos os filmes visíveis da seção.
- O contador é um **`<button type="button">`** com `data-toggle-section`, `aria-expanded` e `aria-label` dinâmicos. Não deve ser um mero `<span>`.
- Título e seta são botões com a mesma ação, `aria-expanded` coerente e rótulo “Exibir/Ocultar filmes da seção …”.
- O clique no espaço vazio do `.sagahead` deve delegar ao trigger da seção, exceto quando começou no checkbox.
- A área de toque deve funcionar no iPhone, sem exigir acerto num hotspot estreito nem responder duas vezes por evento.
- Teclado: Enter/Espaço ativam botões e checkbox respeitando os comportamentos nativos.
- Estado visual: expansão/recolhimento com animação de altura/opacidade e triângulo rotacionando. Reduzir ou desativar com preferência de movimento reduzido.

### 5.3 Marcação do checkbox da seção

- **Vazio**: nenhum filme da seção marcado.
- **Indeterminado/amarelo**: parte dos filmes da seção marcada; atributo DOM `indeterminate=true`.
- **Concluído/verde**: todos marcados; checkbox checked.
- Esses indicadores se aplicam também aos checkbox de seleção individual com estilo circular consistente, mas a seleção parcial é característica da seção.
- A marcação em massa atualiza cada filme do conjunto **visível na seção** (respeitando filtro/ordem/busca), e seu registro de data. Não altera invisíveis por engano.
- Checkboxes usam SVG simples em CSS para marca verde / hífen amarelo e neutralidade cinza no vazio, sem bordas extras persistentes.
- Evitar `:hover` que fique preso em dispositivos touch; preservar `:focus-visible` para navegação por teclado.

### 5.4 Persistência das seções

O estado estável é um `Set<string> collapsedSections`. Nomes correspondentes estão salvos em `preferences.collapsedSections` no `localStorage`.

- Sem preferência válida: inicia com todas as seções **expandidas**.
- Clique individual: acrescenta ou remove nome do `Set`, atualiza a classe `.collapsed`, estado ARIA e grava `prefs.collapsedSections` via `savePrefs()`.
- **Recolher/Expandir todas**: itera os grupos **atualmente renderizados**, altera estados de expansão e salva o conjunto.
- Recarregar a página reidrata o `Set` e restaura a aparência de cada seção.
- Troca de filtro não deve apagar o estado de seções não presentes; nomes de seções ocultas permanecem salvos.
- Ordem por ano: a chave é o nome de grupo atual (por exemplo, “2022”). Não tentar indexar por posição.
- O estado é incluído no backup e restaurado se `preferences.collapsedSections` for array válido de strings.
- **Reset global** limpa o conjunto e retorna ao estado expandido, além de remover dados de progresso e restaurar padrões.
- As seções devem preservar seus próprios estados mesmo que a aplicação refaça o `innerHTML` ao marcar filmes.

### 5.5 Botão Expandir/Recolher todas

- Posicionado junto ao início da lista, visualmente secundário.
- A ação é **contextual**: se todos os grupos renderizados estiverem recolhidos, exibe “Expandir seções”; caso contrário, “Recolher seções”.
- O rótulo acessível e o título devem coincidir com a ação real.
- Respeita as seções renderizadas no filtro atual, sem descartar o estado de outros grupos.
- Funciona no modo minimalista, que apresenta apenas o conteúdo essencial.

---

## 6. Linha do filme e comportamento de progresso

### 6.1 Estrutura de cada linha

A lista combina:

- `input.check` circular para visto/não visto.
- Título localizável `pt` ou `en`; é link de **pesquisa Google**, não de streaming.
- Ano em exibição opcional; filmes futuros indicam “previsto”.
- Selo **Opcional** se `tier === "optional"`.
- Comentário editorial `note` se ativo e disponível.
- Painel de sinopse com botão “Sinopse” se houver texto e estiver habilitado.
- Avaliação por estrelas se ativa.
- Campo HTML `input[type=date]` se a opção estiver ativa.
- Layout adaptativo de linhas e colunas, sem quebra de nome truncando informação relevante.

### 6.2 Marcar/desmarcar como assistido

Ao marcar um filme:

1. Identificar o `id` estável do filme.
2. Salvar `watched: true` no mapa `progress[id]`.
3. Se já existia data salva, preservá-la; caso contrário, atribuir **data local de hoje** no formato `YYYY-MM-DD` (sem UTC que antecipe/atrase o dia).
4. Manter outros campos já registrados, inclusive rating.
5. Salvar progresso local e recalcular contadores, filtros e indicadores de seção.
6. Avaliar se completou uma seção ou os **70 filmes**, acionando celebração somente na transição apropriada.

Ao desmarcar:

- Persistir `watched: false`.
- **Limpar a data do filme**, definindo `date: ""`; esta foi uma escolha explícita de UX para não preservar data de um item que voltou a “não visto”.
- **Não apagar avaliação** automaticamente; são informações conceitualmente distintas.
- Atualizar estatísticas e indicadores.
- Se o usuário desmarcar durante a celebração de conclusão, interromper o final em andamento (`stopConfetti`).
- Não abrir confirmação individual desnecessária.

### 6.3 Registrar uma data

- Mostrar controle nativo `type="date"` somente quando `prefs.dates === true` e fora do modo minimalista.
- Para filme não visto, o campo fica desabilitado até a marcação.
- Alterar data coloca `watched: true` e salva a nova data.
- Ocultar a configuração de data **não apaga datas existentes**.
- A funcionalidade de “limpar data” por botão extra foi testada e depois removida para reduzir ruído. A data é limpa ao desmarcar o filme.
- O formato salvo deve permitir importação/exportação e validação simples `^\d{4}-\d{2}-\d{2}$`.

### 6.4 Avaliar com estrelas (opt-in)

- A opção de rating fica desativada por padrão. Ao ativar, mostrar cinco estrelas por filme com valores de **1 a 5**.
- Toque/click em estrela seleciona o valor; `aria-pressed` reflete a estrela escolhida.
- Arrastar horizontalmente atualiza **prévia visual**; confirmar valor ao soltar.
- A captura de ponteiro (`setPointerCapture`) impede perda acidental do gesto quando o dedo sai das estrelas.
- Threshold de deslocamento de aproximadamente **8px** distingue toque de arraste.
- **Limpar avaliação:** arrastar para a **esquerda** do primeiro ponto ativo (zona de limpeza) define rating **0**; não existe botão “X” visível.
- A zona de limpeza **não** deve disparar só por tocar perto da primeira estrela, evitando zerar acidentalmente.
- Teclado: `Delete`, `Backspace` ou `Home` limpam rating; manter foco plausível após salvar.
- Interromper prévias ao cancelar ponteiro ou perder captura.
- Não comprometer scroll vertical do touch (`touch-action:pan-y` nas estrelas).
- Estrelas selecionadas e de preview possuem estados de cor distintos e precisam de contraste em tema escuro.

### 6.5 Comentários e sinopses

- `prefs.notes` **habilitado por padrão**, mostrando notas editoriais e botão para sinopses individuais.
- Clicar “Sinopse” revela texto daquele filme sem marcar visto, mudar filtro nem ir a outra página.
- Múltiplas sinopses podem estar abertas em paralelo; não é accordion exclusivo.
- O estado das sinopses existe em `expandedSynopses` **em memória**; não há requisito de persistir entre recarregamentos.
- Botão com `aria-expanded` e `aria-controls` correspondendo ao painel específico.
- Painel abre com transição suave e sem saltos agressivos de altura; respeitar movimento reduzido.
- Ao desabilitar notas ou entrar no modo minimalista, ocultar notas e sinopses sem alterar progresso.
- Editar sinopses e notas exige rever fidelidade factual e risco de spoilers.

---

## 7. Ordenação, escopo e semântica de contagem

### 7.1 Ordenação recomendada

Ordem original de `sections` e ordem interna de `items`, independentemente da data em que o usuário marcou o filme. Os blocos complementares devem permanecer inteiros e nos pontos escolhidos pela curadoria.

### 7.2 Ordenação por ano

- Toggle `chronological` agrupa filmes do filtro atual por **ano**; um filme pode aparecer visualmente distante do bloco editorial.
- Ordenação ascendente por `year`, desempate estável por `sequence` editorial.
- Cabeçalho do grupo: ano; subtítulo “Lançamentos de ANO”.
- IDs, ratings e datas não são alterados.
- Como agrupamentos mudam, a conclusão de “seção” se refere ao grupo renderizado no modo corrente, não obrigatoriamente a uma fase original.

### 7.3 Busca e filtros

- Filtro `all`: todos os `group`.
- Filtro `mcu`: apenas `group=mcu`.
- Filtro `recommended`: todo `group≠optional` (inclui MCU).
- Busca: contém consulta normalizada em título PT, EN ou representação de ano; aplica-se após restrição de grupo.
- Mesmo que o filtro exiba 1 de 1 assistido e 100%, **não anunciar maratona inteira concluída** sem `all.every(watched)` nos 70.
- O botão “Recolher todas” atua sobre seções resultantes, não sobre as 12 seções editoriais ausentes.

---

## 8. Configurações e preferências

A interface usa modal HTML `<dialog id="settings">`, com título focável, controles agrupados, descrição de cada opção, fechamento por botão e comportamento nativo de Escape. Abertura via ícone de engrenagem na capa.

### 8.1 Grupos de configurações

**Visualização**
- `minimal`: **false** por padrão — modo minimalista máximo.
- `dark`: **false** — modo escuro explícito.
- `stickyProgress`: **true** — progresso flutuante ao rolar, não minimalista.
- `backToTop`: **true** — atalho circular no canto inferior direito, nas quatro páginas.

**Organização e conteúdo**
- `language`: **"pt"**; alternativa `"en"` apenas para títulos.
- `chronological`: **false** — ordem editorial por padrão.
- `notes`: **true** — comentários e sinopses disponíveis.
- `years`: **true** — ano de estreia visível.
- `dates`: **false** — datas pessoais ocultas.
- `ratings`: **false** — estrelas pessoais ocultas.

**Dados**
- Exportação JSON; importação JSON; botão de apagar tudo com confirmação explícita.

O modelo de configurações armazenado pode conter também `collapsedSections: string[]`. O estado dessa propriedade nasce implicitamente quando o usuário usa os controles de expansão.

### 8.2 Modo claro e escuro: regra de autoridade

**Escolha explícita do site prevalece sobre o tema do iPhone/OS.** Um bug real ocorreu porque páginas institucionais seguiam `prefers-color-scheme:dark` enquanto a home respeitava o localStorage.

Contrato:
- Tema inicial: **claro**, independentemente da aparência global do aparelho, salvo se `prefs.dark === true`.
- `html[data-theme="light"]` e `html[data-theme="dark"]` com variáveis explícitas (ex.: `--bg`, `--fg`, `--muted`, `--line`, `--surface`).
- Inicializar **antes de renderizar o CSS** para evitar flash de cores erradas.
- Ajustar `meta name="theme-color"` ao tema.
- Páginas internas leem a **mesma chave** e escutam `pageshow`, `storage` e `visibilitychange` para revalidar o tema (Safari pode restaurar páginas do cache de navegação sem refazer scripts).
- Não replicar regras individuais divergentes de `@media (prefers-color-scheme:dark)`.
- Cores do rodapé também variam com `data-theme`.

### 8.3 Modo minimalista máximo

Motivação: permitir acompanhar somente **filmes e anos** sem chrome visual excessivo.

- A home entra no estado `html.minimal`.
- Capa, progresso e controles (filtros, busca, ações selecionadas) migram para **menu lateral** em vez de permanecerem no fluxo da lista.
- O código original usa `miniTargets` com comentários-placeholder para mover elementos DOM ao `mini-drawer-content` sem destruí-los; ao desativar, devolve-os à posição.
- Ícone hambúrguer aparece somente no modo minimalista, independente da largura do viewport; bug antigo de aparecer no modo normal foi corrigido.
- Drawer abre sobre backdrop, tem botão fechar, e fecha com toque fora ou `Escape`; foco se move para fechar quando abre e retorna ao acionador quando fecha.
- Informações secundárias (notas, sinopses, ratings, datas etc.) ficam ocultas; anos ficam visíveis de forma compacta.
- Barra sticky de progresso é ocultada nesse modo; o botão geral “Voltar ao topo” segue sua configuração própria.
- Preferências não são perdidas ao entrar/sair; reativar modo normal restaura a apresentação.
- O menu lateral deve caber em telas estreitas, manter inputs acessíveis, não prender o scroll do documento após fechar nem sobrepor conteúdo.

---

## 9. Retornar ao topo e comportamento de scroll

**Componente compartilhado:** botão `#back-to-top` e script `back-to-top.js`.

- Fica fixo no **canto inferior direito** com ícone de seta para cima, superfície contrastante e borda/sombra discretas.
- Posicionado acima da safe area via `env(safe-area-inset-bottom, 0px)`.
- Torna-se visível quando o documento ultrapassa cerca de **450px** de rolagem, se habilitado.
- Some no começo da página, quando desativado, durante modal de configurações e enquanto menu lateral está aberto (regra CSS `html.drawer-open`).
- Clique aciona `window.scrollTo({top:0, behavior:"smooth"})`.
- Com `prefers-reduced-motion:reduce`, usar `behavior:"auto"`.
- O script escuta `scroll` (passivo, otimizado via `requestAnimationFrame`), `resize`, `pageshow`, mudanças de `localStorage` e visibilidade da página.
- A preferência é armazenada em `marvel-display-v1.backToTop` e sua mudança na home é anunciada por `CustomEvent("marvel-display-updated")`, para efeito imediato.
- Nas páginas institucionais, não há necessidade de duplicar o modal de preferências; o botão lê o estado que foi definido na home.

---

## 10. Persistência, backups e modelo de estado

### 10.1 Chaves de armazenamento

| Chave | Conteúdo | Duração |
| --- | --- | --- |
| `marvel-watchlist-v1` | Objeto indexado por ID do filme com visto/data/rating. | Até usuário limpar storage/resetar dados. |
| `marvel-display-v1` | Objeto com preferências de exibição e array de seções recolhidas. | Idem; também lido pelas páginas internas. |

Ambas as leituras usam `try/catch` para dados ausentes, JSON inválido, storage bloqueado ou versões anteriores; ausência implica padrões seguros.

### 10.2 Esquema do progresso

```json
{
  "iron-man-2008": {
    "watched": true,
    "date": "2026-10-14",
    "rating": 5
  },
  "thor-2011": {
    "watched": false,
    "date": "",
    "rating": 0
  }
}
```

O segundo exemplo é ilustrativo. O código real pode omitir propriedades ainda não utilizadas e combinar campos antigos via spread. **Não apagar dados desconhecidos sem razão**; ao importar, entretanto, a validação explicitamente seleciona campos previstos.

### 10.3 Esquema das preferências

```json
{
  "dark": false,
  "language": "pt",
  "chronological": false,
  "notes": true,
  "ratings": false,
  "years": true,
  "dates": false,
  "stickyProgress": true,
  "backToTop": true,
  "minimal": false,
  "collapsedSections": ["Fase 1 · A formação da equipe"]
}
```

O array `collapsedSections` só aparece após interação/salvamento na implementação atual. **IDs de filmes e nomes de seções são chaves de persistência**: não renomear sem migração deliberada.

### 10.4 Exportação

- Botão **Exportar** fica no rodapé da **home**, no bloco “Sua maratona, suas lembranças”.
- Gera `maratona-marvel-progresso.json` localmente via `Blob`/`URL.createObjectURL`/download de `<a>` temporário.
- Não envia arquivo a um servidor.
- Payload atual:

```json
{
  "version": 2,
  "exportedAt": "2026-10-14T12:00:00.000Z",
  "progress": {},
  "preferences": {}
}
```

`version: 2` é o valor utilizado no exportador atual; `exportedAt` é a data/hora ISO no momento real da operação; os dois objetos devem conter dados atuais.

### 10.5 Importação

- O botão **Importar** é um `<label>` com input oculto `type=file` e `accept="application/json,.json"`.
- Lê JSON localmente, rejeita payload sem objeto `progress` ou com progress como array.
- **Solicita confirmação** antes de substituir o progresso atual.
- Só aceita IDs presentes no catálogo; ignora registros externos.
- Por filme normaliza: `watched` booleano, `date` string em `YYYY-MM-DD` ou vazio, `rating` inteiro entre 1 e 5 ou zero.
- Importa campos de preferências booleanas explicitamente listados no código (tema, ordem, notas, ratings, anos, datas, sticky, backToTop), idioma permitido e `collapsedSections` quando válido.
- Salva, aplica preferências e renderiza.
- Mensagem de erro simples para JSON inválido; limpa valor do `input` para permitir selecionar o mesmo arquivo novamente.

**Detalhe de fidelidade do snapshot:** o exportador inclui **todas as propriedades `prefs`**, mas a lista de campos copiados pelo importador **não inclui `minimal` atualmente**. Isso é um detalhe da implementação atual, não uma intenção necessariamente desejável. Uma reimplementação mais consistente pode importar também `minimal` depois de atualizar requisitos e testes de compatibilidade.

### 10.6 Reset total

- Botão de limpeza exige confirmação com descrição inequívoca de irreversibilidade sem backup.
- Ao confirmar, progresso vira objeto vazio; escolhas retornam a `defaults`; seções recolhidas são limpas; busca/filtro volta ao padrão; preferências e progresso são persistidos e UI atualizada.
- Nunca apagar dados sem confirmação.
- O site não consegue recuperar dados excluídos pelo navegador quando não existe arquivo de backup.

### 10.7 Privacidade por arquitetura

- Progressos, datas pessoais e ratings residem localmente; não anexar essa informação a URL de compartilhamento, analytics ou pesquisa externa.
- Não guardar dados privados em query parameters acessíveis por terceiros.
- Distinguir **telemetria pública de acesso** de **dados locais da watchlist**.
- Não alegar sincronização entre equipamentos.
- Se adicionar conta/sync/ads no futuro, isso muda produto, privacidade, consentimento, documentação e testes; não é modificação cosmética.


---

## 11. Celebrações, feedback e movimento

### 11.1 Filosofia

A maratona tem valor afetivo e duração longa. O feedback de completar um bloco precisa recompensar sem distrair; a conclusão de **todos os filmes** merece uma comemoração **"wow"**, com diferenciação explícita. Não tocar música automaticamente, não bloquear interação, não navegar para fora da página e não iniciar comemorações quando o usuário simplesmente recarrega o site já concluído.

### 11.2 Conclusão de seção

Na transição de **seção incompleta → completa**:

- Comparar conjuntos de blocos completos antes/depois da alteração de checkbox.
- Aplicar classe transitória `section-celebrate` ao cabeçalho do grupo concluído, com realce breve.
- Emitir confetes em `<canvas>` temporário com **duas explosões** e duração aproximada de **2,95s**.
- Não exibir banner modal intrusivo; a animação deve ser contextual.
- Respeitar `prefers-reduced-motion` e interromper/limpar canvas corretamente.
- Se marcou um lote que completou vários grupos, a versão atual escolhe o primeiro novo grupo como alvo do destaque.

### 11.3 Conclusão de toda a maratona

**Condição inequívoca:** a expressão `all.length > 0 && all.every(f => progress[f.id]?.watched)` torna-se verdadeira pela primeira vez após uma mudança (`!wasComplete && marathonComplete()`). Não é suficiente haver 100% em filtro restrito.

Comportamento da comemoração final:

- Duração principal aproximada de **10.500ms**.
- **12 grandes ondas** de explosões escalonadas por regiões da tela, mais pequenas chuvas entre elas.
- **Oito tipos de partículas**, desenhadas no canvas: confete retangular, estrela, círculo, losango, serpentina, película cinematográfica, claquete e faísca.
- **Anéis dourados**, pequenos raios e aura/progresso com brilho complementam a animação.
- Paleta inclui vermelho, dourado, branco e algumas cores secundárias para contraste.
- Em dispositivos móveis (< ~650px de largura), emitir menos partículas; limites aproximados do script: **560** partículas simultâneas no mobile e **1.000** no desktop.
- Respeitar device pixel ratio com limite (ex.: `Math.min(devicePixelRatio, 1.75)`) para não sobrecarregar GPU/canvas.
- Renderização com `requestAnimationFrame` e delta time limitado.
- Fade out progressivo nos ~1,5s finais.
- Overlay com ícone de troféu e mensagem **“Missão cumprida!”** / **“Maratona concluída: 70 de 70 filmes! 🍿”** durante aproximadamente **5,1s**.
- `role="status"`, `aria-live="polite"`, sem bloquear cliques ou foco; `pointer-events:none`.
- Quando `prefers-reduced-motion: reduce`, **não animar partículas**, mas pode exibir a mensagem de conclusão sem movimento.
- Vibração leve em dispositivos que disponibilizem `navigator.vibrate`, encapsulada em verificação de recurso e tratamento de falha.
- Ao iniciar, parar animação anterior; ao terminar, cancelar RAF, remover canvas, desregistrar `resize`, cancelar timer do banner, retirar `victory-active`.
- Se o último filme for desmarcado durante a celebração, parar imediatamente.

**Cuidado com filmes futuros:** o total editorial é 70, incluindo `future`; o mecanismo atual **permite marcação** de títulos futuros. Não alterar silenciosamente a regra para excluir previstos do denominador: isso mudaria o produto.

### 11.4 Decisão histórica

A celebração inicial usava confetes comuns e era considerada pouco memorável. O requisito evoluiu para peças temáticas e duração longa. A solução foi feita **sem dependência de CDN de confetti**, com canvas próprio, redução de carga no celular e compatibilidade com redução de movimento. A escolha de um final exuberante não se aplica a cada checkbox nem a cada seção.

---

## 12. Identidade visual e sistema de design

### 12.1 Direção artística

**Editorial cinematográfico minimalista:** o site deve parecer um guia cuidado, não um catálogo de banners e posters, dashboard corporativo ou portal de streaming. Uma grande lista precisa ser leve para escanear, com densidade racional, títulos legíveis e poucos acentos cromáticos.

Pilares:
- Vermelho Marvel na capa, filtros ativos e acentos; evitar saturação em todos os elementos.
- Fundo claro levemente aquecido e superfície branca para controles, em vez de cinza puro brilhante em excesso.
- Tema escuro por escolha explícita com superfícies grafite/cinza-esverdeadas e contraste suficiente.
- Tipografia `Inter`/`system-ui`, títulos com peso e tracking controlados, textos de apoio menores e calmos.
- Ícones SVG inline leves (claquete, película, controles, compartilhamento, seta) para evitar fonte de ícones remota e desalinhamentos.
- Contornos discretos e arredondamentos coerentes; nenhum skeuomorfismo decorativo excessivo.
- Animações só quando comunicam estado ou celebram conquistas; sem parallax, flashes, scroll-jacking.

### 12.2 Tokens e cores aproximados extraídos da implementação

| Elemento | Tema claro | Tema escuro | Finalidade |
| --- | --- | --- | --- |
| `--bg` | `#fafaf9` | `#141615` | Fundo do documento. |
| `--fg` | `#242624` | `#e8eae6` | Texto principal. |
| `--muted` | `#777b75` | `#a0a59e` | Texto de apoio. |
| `--line` | `#e5e6e1` | `#363b37` | Linhas/bordas. |
| `--surface` | `#ffffff` | `#202421` | Superfícies elevadas. |
| Capa / ativo | próximo de `#D11F28` | Vermelho ajustado para contraste | Marca visual. |
| Rodapé `--credits-bg` | `#f4f0ed` | `#211d20` | Separação suave do conteúdo. |
| Borda rodapé | `#e7deda` | `#373036` | Transição delicada. |
| Sucesso checkbox | verde | verde adaptado | Seção/filme concluído. |
| Checkbox parcial | amarelo | amarelo adaptado | Alguns filmes marcados. |

Esses tokens refletem a **intenção** e os valores mais relevantes do CSS. O código atual possui refinamentos e overrides históricos; ao refatorar, criar uma camada única de tokens e conferir visualmente as diferenças em todos os breakpoints.

### 12.3 Diretrizes responsivas

- Home editorial com largura máxima próxima de **940px**; margens responsivas, sem overflow horizontal.
- Capas mobile full-bleed; rodapé também **full-bleed** em todas as quatro páginas.
- Breakpoints históricos incluem ~700px, 640px, 380px, 360px, 315px e até 300px para ajustes específicos.
- Não ampliar campos de ratings, datas ou filtros além da largura útil em dispositivos estreitos.
- Texto de sinopse deve ter espaçamento e fonte adequados a iPhone; não espremer parágrafos.
- O layout dos itens pode converter metadados em sublinhas; preservar associação visual ao título correto.
- Botões com alvo generoso, idealmente próximo de **44px** quando possível, sem inflar a altura de cada filme desnecessariamente.
- Respeitar área segura inferior `env(safe-area-inset-bottom)` para botão flutuante.
- Sobreposição/modal/menu deve ter camadas `z-index` coerentes e não deixar controles clicáveis por baixo.

### 12.4 Safari/iPhone: problemas reais que motivaram decisões

Houve várias correções motivadas pela experiência real de tocar e navegar no Safari:

1. **Fonte do título**: “Maratona” e “Marvel” aparentavam tamanhos diferentes; estrutura flex e métricas tipográficas estabilizadas.
2. **Ícone de claquete** não centralizava corretamente; integrar à composição com `inline-flex`/alinhamento e dimensões fixas, não margens mágicas.
3. **Ícone de película e “0 / 70”** com desalinhamento aparente; usar flex e barra "/" como elemento independente, com números tabulares e eixo vertical único.
4. **Checkbox com foco persistente** após toque e borda circular extra; tirar `:hover` de touchscreen, usar `-webkit-tap-highlight-color:transparent`, limitar halos ao `:focus-visible` de teclado.
5. **Item do rodapé “Ordem recomendada” aparentemente selecionado** mesmo sem clique; regras antigas da home conflitavam com arquivo compartilhado. Remover CSS legado e colocar `hover` só em dispositivos `(hover:hover) and (pointer:fine)`, além de neutralizar estado retido em touch.
6. **Tema interno divergente** do tema da home; fonte de verdade única no `localStorage`, CSS `data-theme` explícito e ressincronização no `pageshow`.
7. **Botão de fechar modal** aparecendo destacado inicialmente; evitar foco visual indesejado após clique, preservando foco de teclado acessível.
8. **Estrelas difíceis de arrastar** em touch; captura de ponteiro, prévia, limpeza intencional e `pan-y`.
9. **Links do rodapé** com arrow/icon espaçado demais; ajustar microespaçamento sem gerar caixas ou menus.

**Não inventar comportamentos testados:** essas são razões/documentações do histórico; a validação final em um Safari real depende de smoke test visual e de interação.

---

## 13. Rodapé — “Depois dos créditos”

### 13.1 Conceito de produto

O rodapé começou como uma soma de peças independentes (backup, contato, links, aviso, compartilhamento, dedicatória). Foi considerado um **“Frankenstein”** sem alinhamento ou identidade. A solução aprovada foi tratá-lo como **créditos finais**: um encerramento inspirador e editorial para a jornada cinematográfica.

Frase obrigatória de abertura:

> **Toda grande história fica melhor quando é compartilhada.**

Texto de apoio:

> Gostou da lista? Convide alguém para começar essa jornada com você.

Texto da área de backup, exclusiva da home:

> **Sua maratona, suas lembranças.**  
> Seu progresso e suas avaliações ficam neste navegador. Guarde uma cópia quando quiser.

### 13.2 Composição aprovada (estado atual)

- Uma grande **faixa horizontal 100% da viewport**, no fluxo do documento e fora do contêiner de largura restrita.
- **Fundo suave uniforme** em tema claro e escuro. **Não** é um cartão centralizado com bordas arredondadas e margens laterais.
- Um `.footer-inner` centralizado, max-width próximo de 940px, serve como grid editorial da faixa.
- Abertura à esquerda: marca/ícone pequeno, frase inspiradora, texto de convite e link WhatsApp.
- Home no desktop: área complementar à direita com progresso/backup; mobile empilha as áreas com divisor discreto.
- Páginas internas: mesmo visual e estrutura, mas **sem** Exportar/Importar, pois elas não controlam diretamente o progresso.
- Navegação institucional discreta centralizada com links **Maratona**, **Sobre o projeto**, **Ordem recomendada**, **Privacidade**; atributo `aria-current="page"` no destino atual.
- Dedicatória após a navegação, alinhada ao centro; **sem caixa**, sem coração decorativo adicional, sem linha/painel legal debaixo.
- Cuidado editorial: o fundo deve distinguir o rodapé do conteúdo sem sequestrar a atenção do texto principal.

### 13.3 Dedicatória: cópia e identidade

Texto de referência:

> **Feito com ❤️ para a Bia — porque a melhor parte de cada filme é assistir com você. — Papai**

Regras aprovadas:

- **Um único coração**, somente o que já integra a frase.
- “— Papai” permanece **na mesma linha de fluxo** da dedicatória; quebra natural apenas se a largura exigir. **Não** forçar bloco/assinatura numa linha separada.
- **Bia** e **Papai** mantêm aparência de links (sublinhado/acentuação) e levam aos **perfis de Instagram originalmente escolhidos**: `https://www.instagram.com/wanabbia/` e `https://www.instagram.com/michael.felix.dias/`.
- Links externos com `target="_blank"` e `rel="noopener noreferrer"`.
- Não remover links só porque Stories deixou de ser recurso do site: a dedicatória é uma área **pessoal do projeto**, não um módulo de compartilhamento.
- A dedicatória encerra emocionalmente o rodapé; sem ícone extra acima nem placa desenhada ao redor.

### 13.4 Informação legal

O usuário decidiu remover do **rodapé** a linha “Projeto independente, sem afiliação com … · Contato”. Essa informação **continua relevante nas páginas institucionais**, especialmente Sobre e Privacidade. Não recolocá-la no rodapé sem nova decisão; não concluir que a remoção do rodapé significa apagar a política legal inteira.

### 13.5 Como preservar a consistência técnica

- `shared-footer.css` é a fonte de verdade do design transversal. Não recriar `.footer-pages a:hover` divergente inline na home ou nas páginas internas.
- Estilo de link **hover apenas quando existe mouse real**; Safari touch deve neutralizar highlights retidos.
- `aria-current` controla a página ativa, não simular estado por clique anterior.
- O botão fixo `back-to-top` é outro componente compartilhado e pode usar o mesmo arquivo CSS.
- Os links de navegação são absolutos sob `/maratona-marvel/`, por vezes com query de versão para invalidação de cache. Em reimplementação, substitua por estratégia de cache eficiente, sem quebrar rotas.

---

## 14. Compartilhamento da lista

### 14.1 Requisito aprovado e atual

O link de rodapé **“Indicar pelo WhatsApp”** funciona de forma direta, sem caixa/botão chamativo, sem popover e sem menu intermediário.

- É um link `<a href="https://wa.me/?text=...">` com texto codificado via `encodeURIComponent`.
- Leva a uma mensagem predefinida, com URL pública **da lista**.
- Não incorpora progresso, datas, avaliação ou configurações privadas.
- Possui ícone de mensagem e pequena seta diagonal próxima ao texto; os dois devem parecer parte do mesmo CTA sublinhado, não estar excessivamente separados.
- O browser/OS decide se abre o app ou interface web do WhatsApp; não prometer que todos os dispositivos possuem app instalado.
- Novo destino em janela/aba com propriedades de segurança quando pertinente.
- A implementação utiliza apenas link, sem dependência de `navigator.share` nem imagem gerada.

### 14.2 Mensagem compartilhada aprovada

> 🍿 Já viu todos os filmes da Marvel? Ou quer começar uma maratona e não sabe por onde? 👀
>
> Encontrei uma lista interativa com 70 filmes, incluindo MCU, X-Men, Homem-Aranha e Deadpool, em uma ordem recomendada.
>
> 🎬 Você marca os que já assistiu, avalia seus favoritos e acompanha o que falta. É um guia de organização, não um serviço de streaming.
>
> 👉 https://michaelfdias.github.io/maratona-marvel/

Se o catálogo aumentar, ajustar a contagem em texto e assets junto da atualização de dados.

### 14.3 Soluções anteriores descartadas (NÃO reconstruir automaticamente)

1. Menu expansível com opções separadas WhatsApp / menu nativo / copiar URL. Rejeitado porque adicionava passos e deixava aparência de link “clicado” em touch.
2. Uso direto de `navigator.share` sem material: Instagram oferecia DM, mas não publicava links clicáveis em Stories.
3. Arte vertical 1080×1920 com “70 filmes” compartilhada como PNG: estética final insatisfatória.
4. QR Code na imagem + cópia de link + instrução para adicionar adesivo de Link no Instagram: funcionalidade trabalhosa, experiência dependente do app e ainda sem URL clicável automática.
5. Após avaliação, **tudo isso foi removido**: `share.js` foi excluído; o produto voltou à simplicidade do link WhatsApp.

**Motivação principal:** não oferecer uma experiência incompleta ou visualmente ruim somente para “suportar” mais destinos. Se uma nova solução de Stories for proposta, deverá ter **conceito visual aprovado, fluxo real testado e link efetivamente acessível**, sem romper a indicação por WhatsApp.

---

## 15. Páginas institucionais

### 15.1 Rotas

| Rota | Propósito |
| --- | --- |
| `/maratona-marvel/` | Home interativa / watchlist. |
| `/maratona-marvel/sobre/` | Contexto e objetivo do projeto. |
| `/maratona-marvel/ordem-recomendada/` | Justificativa editorial e metodologia da sequência. |
| `/maratona-marvel/privacidade/` | Armazenamento, analytics, links externos e política de privacidade. |

Cada página usa HTML sem backend; navegação clara de volta à maratona, capa temática, texto legível, rodapé compartilhado e botão de retornar ao topo.

### 15.2 Sobre o projeto

Cobrir as seguintes mensagens:
- É guia independente, sem cadastro e sem disponibilização de filmes.
- Catálogo de 70 títulos com MCU, recomendados e opcionais.
- Progresso individual/local, três filtros, duas ordenações, comentários e sinopses, tema e personalização, export/import.
- Diferenciar filmes oficiais da cronologia MCU e complementos de outras franquias.
- Aviso de independência editorial/não afiliação.
- Contato e sugestões em endereço de e-mail do projeto (no código atual: alias iCloud).

### 15.3 Ordem recomendada

Deve explicar **por que a ordem é híbrida**:
- MCU na ordem de lançamento como espinha dorsal.
- X-Men em bloco próprio para permitir reconhecer mutantes e referências em produções multiversais.
- Trilogia Tobey Maguire e duologia Andrew Garfield antes de *Sem Volta para Casa*.
- Filmes anteriores de Deadpool antes de *Deadpool & Wolverine*; alguns Quarteto Fantástico opcionais.
- Fases 4–6 retomam o MCU.
- Séries como *WandaVision* e *Loki* podem dar contexto, mas não integram o contador de **filmes**.
- Os três filtros com propósitos distintos.
- Permitir alternativa por ano de lançamento via configurações na home.

**Não chamar ordenação por ano de estrita sequência de estreia em todas as situações:** o agrupamento ordena por ano e desempata pela sequência editorial, sem data exata por dia/mês.

### 15.4 Privacidade

Explicar com clareza:
- `localStorage` guarda progresso e preferências; sem conta, sem banco próprio, sem sincronização automática.
- Exportação/importação de JSON e reset local; limpar storage do navegador também pode apagar registros.
- Hospedagem GitHub Pages (serviços técnicos de entrega).
- Cloudflare Web Analytics está instalado para estatísticas de visita/performance. Evitar prometer zero dados técnicos; a política descreve o serviço e remete ao fornecedor.
- Google, Instagram e WhatsApp são destinos externos; o tratamento de dados por eles segue suas próprias políticas.
- Endereço de contato disponibilizado em página institucional.
- O texto atual declara ausência de anúncios Google AdSense; adicionar publicidade exige revisão antes da ativação.
- Revisar a data “Última atualização” quando política mudar. Nunca copiar data sem verificar atualização real.
- Diferenciar dados de navegação técnica de dados locais da watchlist.

---

## 16. Acessibilidade, semântica e resiliência

### 16.1 Contratos de teclado/leitor de tela

- Links reais para navegação; botões reais para ações; inputs nativos para checkboxes, data e select.
- Controles de expansão com `aria-expanded` correto, título e rótulo de ação consistentes, botão da sinopse com `aria-controls`.
- Barra de progresso com `role=progressbar` e percentagem ARIA atualizada.
- Modal `<dialog>` com título, foco inicial apropriado e Escape.
- Barra fixa ao rolar e botão voltar ao topo não devem competir visualmente com modal/drawer.
- `focus-visible` para teclado; nenhum outline permanente após toque em dispositivo touch.
- Ícones puramente decorativos marcados `aria-hidden`; icon-only buttons com `aria-label`.
- Controles com `aria-pressed` quando representam filtro/valor ativo.
- Notificação de conclusão com `role="status"` e `aria-live="polite"`.
- Textos que contextualizam filtros devem mudar junto com a seleção, não ficar inconsistentes.
- Não sacrificar contraste em nome da suavidade.

### 16.2 Preferência de movimento reduzido

- Desativar ou reduzir animações de entrada, accordion, partículas, progresso pulsante e rolagem suave quando sistema solicitar.
- Manter feedback **estático** suficiente de conclusão mesmo sem confetes.
- Não impor vibração em ambientes não compatíveis; verificação de suporte e try/catch.

### 16.3 Robustez de dados

- Não assumir `localStorage` sempre disponível: leituras via `try/catch`; escrita com mensagem de erro ou alternativa de exportação.
- Nunca executar HTML dos títulos ou notas; escapar caracteres especiais antes de usar `innerHTML`.
- Filtrar IDs importados que não constam da curadoria.
- Normalizar ratings e datas importadas; considerar migrações explícitas se schema evoluir.
- Evitar recalcular a UI a cada pixel do gesto de estrelas; usar preview leve e commit ao soltar.
- Em animações, encerrar timers/listeners/RAF e destruir canvas ao finalizar.
- Não usar `setInterval` perpétuo sem necessidade.
- Link de compartilhamento jamais carregar informações privadas da watchlist.

### 16.4 SEO e conteúdo público

- Metas `title` e `description` por página, em português, descritivas e coerentes com conteúdo.
- Links internos navegáveis mesmo sem aplicação JavaScript quando possível.
- Conteúdo da home exige JS para lista dinâmica, mas páginas institucionais são HTML textual.
- Meta `theme-color` ajustada ao tema.
- **No snapshot da home consultado, não há prova de imagem Open Graph dedicada ou `rel=canonical`**. Considerar melhorias futuras, mas não listar como funcionalidade existente.
- Evitar títulos e descrições que impliquem oficialidade ou disponibilidade dos filmes.

---

## 17. Decisões arquiteturais e trade-offs (ADRs consolidados)

| ID | Decisão vigente | Alternativa descartada / problema | Por quê |
| --- | --- | --- | --- |
| ADR-001 | Site estático, sem conta nem backend de progresso | Login/backend obrigatório | Privacidade, simplicidade, hospedagem de baixo custo. |
| ADR-002 | `localStorage` e backup JSON | Sync automático não implementado | Autonomia e ausência de infraestrutura. |
| ADR-003 | 70 longas, 12 blocos, 3 grupos | Lista “tudo é MCU” | Distinguir canonicidade, contexto e curiosidades. |
| ADR-004 | MCU por lançamento + blocos especiais | Cronologia dos eventos ou mistura cega por ano | Experiência narrativa e conexões reconhecíveis. |
| ADR-005 | Campo `group` controla filtro, não fase/tier | Inferir de título ou posição | Correção, transparência, previsibilidade. |
| ADR-006 | Modo minimalista com drawer | Ocultar toda navegação sem recuperação | Foco na lista com controles acessíveis sob demanda. |
| ADR-007 | Estados de seções salvos | Accordion sem persistência | Não perder organização ao atualizar o site. |
| ADR-008 | Cabeçalho inteiramente acionável | Apenas pequena seta/título | Ergonomia touch e acessibilidade. |
| ADR-009 | Checkbox separado de expandir | Clique único para duas ações | Evitar alteração acidental de progresso. |
| ADR-010 | Datas opcionais; desmarcar limpa data | Botão “X” ou preservação incoerente | UI limpa e semântica consistente. |
| ADR-011 | Ratings opcionais com arraste e limpeza à esquerda | Botão de excluir estrelas | Menos ruído e interação fluida no celular. |
| ADR-012 | Confetes discretos por seção, finale rico para 70/70 | Mesmo efeito em todo marco | Ritmo emocional proporcional à conquista. |
| ADR-013 | Canvas customizado para finale | Biblioteca externa necessária | Controle de forma/performance e ausência de dependência. |
| ADR-014 | Tema explícito compartilhado | Páginas internas seguem tema OS | Consistência e respeito à escolha do usuário. |
| ADR-015 | Rodapé créditos finais full-bleed | Coleção de blocos desconexos | Identidade única e encerramento inspirador. |
| ADR-016 | WhatsApp direto | Menu popover e Stories com arte/QR | Menos passos e fluxo real confiável. |
| ADR-017 | Dedicatória com um coração, links e assinatura inline | Coração extra, caixa e linha “Papai” isolada | Respeito à mensagem pessoal original. |
| ADR-018 | Avisos legais nas páginas institucionais | Faixa legal extra no rodapé | Não interromper o encerramento emocional. |
| ADR-019 | Voltar ao topo opt-out | Sempre visível / sem configuração | Comodidade sem tirar escolha do visitante. |
| ADR-020 | Hover só para mouse real | Hover retido no Safari | Evitar falso visual de link clicado. |
| ADR-021 | Arquivo CSS do rodapé compartilhado | Overrides por página | Prevenir divergência e regressões. |
| ADR-022 | Páginas institucionais separadas | Tudo em popovers na home | SEO, navegação, leitura editorial e privacidade. |
| ADR-023 | Links dos filmes para busca pública | Player / link de streaming | Manter escopo legal e editorial. |
| ADR-024 | Sinopses independentes e opt-in | Todos os textos abertos permanentemente | Densidade, legibilidade e spoilers. |

**Como usar os ADRs:** ao mudar uma decisão, explicar o evento, a nova alternativa, as implicações e os testes. Não eliminar o registro antigo como se nunca tivesse sido tentado.

