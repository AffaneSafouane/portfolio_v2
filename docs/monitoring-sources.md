# Sources de veille — Ticket 2

Vérification effectuée le **23 novembre 2026** par requête HTTP directe : chaque flux retenu a répondu `200` et contenait des entrées RSS 2.0 ou Atom parsables. Les liens peuvent changer ; l'agrégateur doit tolérer leur indisponibilité. La veille porte sur le **développement agentique dans le génie logiciel**, avec une ouverture aux outils IA pour développeurs et aux pratiques web proches. Les six flux EN restent majoritaires ; les deux flux FR apportent un complément. La page affiche un badge `EN` ou `FR` pour chaque source et actualité.

## Flux retenus pour l'agrégation serveur

| Langue | Source | URL exacte du flux | Site ou chaîne | Contrôle |
| --- | --- | --- | --- | --- |
| EN | Sloth Bytes | <https://rss.beehiiv.com/feeds/wnEIOSd99q.xml> | <https://www.slothbytes.dev/archive> | `200`, RSS, 20 entrées |
| EN | Fireship | <https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA> | <https://www.youtube.com/@Fireship> | `200`, Atom, 15 entrées |
| EN | The Coding Sloth | <https://www.youtube.com/feeds/videos.xml?channel_id=UCxVPH8W2ayMey1-b0SY8rBQ> | <https://www.youtube.com/@TheCodingSloth> | `200`, Atom, 15 entrées |
| EN | Dev.to — `ai` | <https://dev.to/feed/tag/ai> | <https://dev.to/t/ai> | `200`, RSS, 12 entrées |
| EN | Medium — `software-engineering` | <https://medium.com/feed/tag/software-engineering> | <https://medium.com/tag/software-engineering> | `200`, RSS, 10 entrées |
| EN | Simon Willison's Weblog | <https://simonwillison.net/atom/everything/> | <https://simonwillison.net/> | `200`, Atom, 30 entrées |
| FR | Grafikart | <https://www.youtube.com/feeds/videos.xml?channel_id=UCj_iGliGCkLcHSZ8eqVNPDQ> | <https://www.youtube.com/@grafikart> | `200`, Atom, 15 entrées |
| FR | Journal du Hacker | <https://www.journalduhacker.net/rss> | <https://www.journalduhacker.net/> | `200`, RSS, 25 entrées |

Les identifiants YouTube viennent des liens `rel="alternate"` des pages de chaîne ; les trois URL Atom correspondantes ont été ouvertes et parsées. Le flux Sloth Bytes ci-dessus indique `Sloth Bytes` comme titre et renvoie vers son domaine dans le canal RSS. La page d'archive expose un autre lien RSS, `https://rss.hiivinternal.com/feeds/wnEIOSd99q.xml`, dont le domaine n'a pas été résolu pendant le contrôle ; `https://www.slothbytes.dev/feed` n'a pas été résolu non plus. L'URL Beehiiv est celle à intégrer.

Les tags alternatifs `https://dev.to/feed/tag/typescript` et `https://medium.com/feed/tag/artificial-intelligence` ont aussi répondu `200` avec des entrées RSS. Ils ne font pas partie des huit flux retenus : le premier élargirait la veille à TypeScript en général, le second à l'IA hors génie logiciel. Les flux <https://martinfowler.com/feed.atom>, <https://github.blog/engineering/feed/> et <https://korben.info/feed> ont également répondu `200` et restent des possibilités de remplacement après réexamen éditorial.

## Références éditoriales et bibliographie statique

Ces liens sont des références consultables sur la page, pas des flux à agréger. Toutes les URL ci-dessous ont répondu `200` le 23 novembre 2026.

| Référence | URL exacte | Rôle |
| --- | --- | --- |
| Google Codelabs — Spec-Driven Development avec Antigravity CLI | <https://codelabs.developers.google.com/sdd-agy-cli?hl=fr> | Exemple primaire de spécification, planification, skills et sous-agents |
| Catalogue Google Codelabs | <https://codelabs.developers.google.com/> | Point d'entrée vers les ateliers techniques |
| GitHub Spec Kit | <https://github.github.com/spec-kit/> | Référence primaire sur un workflow de développement guidé par les spécifications |
| Anthropic — Equipping agents with Agent Skills | <https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills> | Référence primaire sur la spécialisation des agents par skills |
| Martin Fowler — Agentic Engineering | <https://www.martinfowler.com/bliki/AgenticEngineering.html> | Définition et rôle de la revue humaine |
| Martin Fowler — Maintainability sensors for coding agents | <https://martinfowler.com/articles/sensors-for-coding-agents.html> | Contrôles reproductibles et maintenabilité |
| Kimi AI Resources | <https://www.kimi.ai/fr/resources/> | Ressources complémentaires sur les outils IA ; ne sert pas de preuve pour les affirmations techniques |
| Superhuman AI Archive | <https://www.superhuman.ai/archive> | Newsletter consultable pour la découverte de sujets ; recoupement requis |
| Archives Sloth Bytes | <https://www.slothbytes.dev/archive> | Consultation des numéros et de leurs sources |

`https://www.superhuman.ai/feed` répond `404` : Superhuman AI reste dans la bibliographie et n'entre pas dans l'agrégateur. Les newsletters, agrégateurs communautaires et vidéos servent à repérer les sujets ; la rédaction des explications techniques se fonde sur les documentations et publications primaires recoupées.
