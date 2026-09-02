# Assets originais

Material de design que **não** vai para o ar: mockups e peças de referência.

- `LAYOUT/` — os quatro layouts de página em 1080×1920, como vieram do design.
  Servem de referência; o site publicado segue o que está no Canva, que difere
  um pouco destes mockups (principalmente nos botões).
- `BOTOES_REDES/` — ícones de redes sociais. Não são usados: no site atual o
  botão "ACESSE NOSSAS REDES" leva direto para o Linktree.
- `PNGs/FAIXAS_01.png` — a faixa de cores do rodapé. No site ela é reproduzida
  com um `linear-gradient` em CSS, que fica nítido em qualquer largura.

## O que saiu daqui

Estes arquivos eram idênticos byte a byte aos que o site usa, então ficaram só
em `src/assets/` (mesmo conteúdo, nome sem espaço/acento para o S3):

| Antes, aqui | Agora, em `src/assets/` |
| --- | --- |
| `VIDEOS/VIDEO_TIA JU 10123.mp4` | `video/apresentacao.mp4` |
| `VIDEOS/_SIMULAÇÃO VOTO.mp4` | `video/simulacao-voto.mp4` |
| `PNGs/LOGO CAMPANHA_TIA JU_01@2x.png` | `img/logo.png` |
| `PNGs/FLOR GRANDE_03.png` | `img/flor.png` |

O `ASSETS_TIA JU.zip` original está fora do git (veja `.gitignore`) — guarde uma
cópia no Drive.
