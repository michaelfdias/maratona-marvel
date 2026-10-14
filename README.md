# 🍿 Maratona Marvel

Uma lista interativa e gratuita para organizar uma maratona de filmes da Marvel — desde o MCU até histórias complementares dos X-Men, Homem-Aranha, Deadpool e outras adaptações.

**Acesse:** https://michaelfdias.github.io/maratona-marvel/

> O projeto é um **guia para organizar o que assistir**. Ele não reproduz filmes, não é um serviço de streaming e não exige cadastro.

## Como funciona

A lista reúne **70 filmes em 12 seções**, seguindo uma **ordem editorial recomendada**: os lançamentos do MCU formam o eixo principal e algumas franquias complementares aparecem em blocos estratégicos.

Você pode:

- Marcar filmes como vistos, acompanhar o progresso geral e por seção e marcar/desmarcar uma seção inteira.
- Filtrar entre **MCU (40 filmes)**, **MCU + recomendados (52)** e **Todos (70)**.
- Buscar por título ou ano, alternar entre a ordem sugerida e o agrupamento por ano de lançamento. **O filtro e o texto buscado são lembrados após recarregar a página.**
- Expandir ou recolher seções, consultar comentários e abrir sinopses.
- Registrar datas de exibição e avaliar filmes de **1 a 5 estrelas**.
- Escolher entre **Claro**, **Escuro** e **OLED (preto absoluto)**, além do idioma dos títulos, informações exibidas e modo minimalista.
- Exportar e importar um **backup JSON** do progresso e das preferências.
- Compartilhar a lista diretamente pelo **WhatsApp**.

O site usa o armazenamento local do navegador: suas marcações e preferências permanecem no dispositivo, sem conta e sem sincronização automática. A aparência escolhida é compartilhada pelas quatro páginas; preferências antigas de modo escuro continuam compatíveis. O estado expandido/recolhido das seções também é lembrado.

## Execução local

É um site estático, construído principalmente em **HTML, CSS e JavaScript**, sem framework, banco de dados ou etapa de build.

Para explorar o código, abra `index.html` em um navegador. Para testar todas as rotas e os caminhos absolutos usados no GitHub Pages, sirva o projeto em um ambiente HTTP com o prefixo `/maratona-marvel/` ou publique uma cópia no GitHub Pages.

## Arquivos principais

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Aplicação, catálogo dos filmes, interface e lógica de progresso. |
| `sobre/index.html` | Apresentação do projeto. |
| `ordem-recomendada/index.html` | Metodologia da sequência editorial. |
| `privacidade/index.html` | Política de privacidade e serviços utilizados. |
| `shared-footer.css` | Estilos compartilhados do rodapé e do botão flutuante. |
| `oled-theme.css` | Paleta OLED com preto absoluto, compartilhada pelas quatro páginas. |
| `back-to-top.js` | Comportamento do botão “Voltar ao topo” nas páginas. |
| [`docs/ESPECIFICACAO.md`](docs/ESPECIFICACAO.md) | **Documentação viva completa**, decisões, contratos funcionais, histórico e guia para reconstrução do produto. |

## Privacidade e limitações

O progresso é salvo no `localStorage` do navegador. Para trocar de dispositivo, use **Exportar** e **Importar**. O site utiliza **Cloudflare Web Analytics** para estatísticas de acesso e está hospedado no **GitHub Pages**. Os links de filmes abrem pesquisas externas, não transmissões.

A seleção editorial **não é a cronologia oficial única** e pode conter títulos futuros sujeitos a alterações. Algumas séries da Marvel ficam fora do escopo, que é centrado em longas-metragens.

## Sobre o projeto

Projeto independente, feito para tornar maratonas mais fáceis de acompanhar e prazerosas de compartilhar. Não possui vínculo oficial com Marvel, Disney, Sony ou outros titulares das franquias.

**Toda grande história fica melhor quando é compartilhada.**

Para compreender **todas as decisões e implementar um projeto equivalente**, comece pela [especificação completa](docs/ESPECIFICACAO.md).