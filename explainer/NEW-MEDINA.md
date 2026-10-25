# Creating a New Medina: a ten-part LUMEN documentary

A chapter-by-chapter documentary on Venkat Dhulipala's *Creating a New Medina: State Power, Islam, and the Quest for Pakistan in Late Colonial North India* (Cambridge University Press, 2015).

**The book's argument in one sentence:** Pakistan was not a vague slogan that became a state by accident. In the United Provinces (today's Uttar Pradesh), Muslim League politicians and leading Deobandi clerics imagined it, publicly and in detail, as a sovereign Islamic state, a "new Medina", and that founding vision helps explain Pakistan's later crises.

**The question the series asks:** why did the Muslims of a province that would never be part of Pakistan fight hardest to create it?

## Format and rules

- **Look:** `meta.look: "cinema"` in the LUMEN engine (`explainer/engine/cinema.js`). The film is letterboxed with grain and flicker. The camera moves in one-point perspective through rooms and archive corridors. Chapters open on intertitle cards, typewriter supers give location and date, and sources run in the bottom bar. The pacing aims at Kubrick (symmetry, silence, slow push-ins) and at Aditya Dhar (numbered chapters, hard cuts on a drum hit, big location slates).
- **Score:** `music: "cinema"`, an original numpy score: a D tanpura drone, low strings (Dm, B♭, Gm, A), a distant heartbeat and a high solo line.
- **Voice:** an original Kokoro blend, `bm_george:0.55+am_onyx:0.45` at 0.93 speed.
- **Fairness:**
  - The narration paraphrases the book. Quotations are short and attributed.
  - Every contested claim gets a verdict card (well supported / supported with caveats / debated / contested / thin evidence) that names who disagrees.
  - Every episode gives critics a full chapter.
  - Communities are never drawn as stand-ins. Real figures appear as generic silhouettes on dossier cards, not likenesses.
- **Images:** all imagery is original vector art. The maps use Natural Earth outlines (public domain) and are approximate for the 1940s. The `photo` element can show public-domain photographs (Wikimedia Commons, Library of Congress) with credits, once the environment's network allows those hosts. They are not reachable from this build environment today.
- **Builders:** `explainer/tools/new_medina/eNN.py` writes each `episode.json`. Then follow `explainer/SKILL.md` section 5.

## Episodes

| # | Title | Book | What it covers | Set pieces |
|---|---|---|---|---|
| 1 | **The Séance** | Introduction | A 1955 séance summons Jinnah's spirit, which sees "flashes of evil pictures about Pakistan". It sets out the standard account (Jalal's bargaining counter; "insufficiently imagined"), the U.P. paradox, the new-Medina thesis, hostage-population theory, Madani's and Usmani's rival Medinas, Ambedkar, and the screen slashed at *Forty Crores* (1946). Critics (Devji, S. I. Khan, Mehta) get a full chapter, then why it matters today. | Séance table, archive corridor, partition map, cinema slash, verdict board |
| 2 | **The Broken Coalition** | Ch. 1: Nationalists, Communalists and the 1937 Elections | The 1935 Act and limited provincial democracy. In U.P. Muslim politics it was not yet settled who counted as a "nationalist" and who as a "communalist". Election alliances crossed communal lines, and Congress's sweep set up the ministry-making fiasco. | Ballot map of U.P., the coalition that never formed |
| 3 | **Four-Anna Members** | Ch. 2: Muslim Mass Contacts and the Rise of the Muslim League | Congress's Muslim mass-contact drive against the League's own mass campaign. The League won by-elections, held the 1937 Lucknow session, and Jinnah became the Qaid-i-Azam. Thanawi's Deobandi circle came over to the League, while Madani's camp stayed with Congress. | Membership counters, by-election results, the 1937 Lucknow session |
| 4 | **Two Lawyers from Bombay** | Ch. 3 | Ambedkar's *Thoughts on Pakistan* and how Jinnah and the League answered it. The maps, the questions of finance and defence, and the Gandhi–Jinnah talks of 1944. | Ambedkar's maps, the 1944 talks |
| 5 | **The Ideal Goal** | Ch. 4: Muslim League and the Idea of Pakistan in the U.P. | How U.P. League leaders and local workers explained Pakistan in towns and qasbahs: Aligarh students, pamphlets, and the "geo-body". | Pamphlets, Aligarh, local meetings |
| 6 | **The Other Medina** | Ch. 5: Ulama at the Forefront of Politics | The nationalist ulama's case against Pakistan: Madani's composite nationalism and the critiques by Sajjad, Seoharvi and Manglori ("slavery" for minority-province Muslims). | Dossiers, the Jamiatul Ulama-i-Hind split |
| 7 | **Letters to Madina** | Ch. 6: Urdu Press, Public Opinion and Controversies | The reader debate on Pakistan in the Bijnor bi-weekly *Madina* (1942–43), with letters from Bombay to Chittagong to Raichur. | Newspaper wall, map of letter origins |
| 8 | **The Shaikhul Islam** | Ch. 7: Fusing Islam and State Power | Shabbir Ahmad Usmani's vision of Pakistan as the new Medina, the founding of the Jamiatul Ulama-i-Islam, and his part in the League's 1945–46 campaign. Tests the claim from E1 that the ulama were decisive. | Usmani's speeches, Medina-to-Pakistan arcs |
| 9 | **The Referendum** | Ch. 8: The Referendum on Pakistan | The 1945–46 elections: the League's campaign, Congress's replies (Nehru: "What kind of stan do you want?"; Kidwai), and the results (65% of the U.P. Muslim vote, all six central seats). | Election night, stat counters, OSS report |
| 10 | **Rivers of Blood, and After** | Epilogue and Conclusion | Partition's aftermath in U.P.: migration and those who stayed. The muhajirs in Pakistan, down to Altaf Husain's 2004 Delhi speech. W. C. Smith on Pakistan as an Islamic state. Then the series verdict: what holds up, what doesn't, and why the book matters for India, Pakistan and the world today. | Final verdict board, the séance callback |

## Sources used across the series

- The book itself, and the archives it cites (as quoted in it).
- Reviews:
  - Ian Talbot, *Journal of Asian Studies* 74:4 (2015)
  - Gail Minault, H-Asia (2015)
  - David Gilmartin, *JAS* 74:1 (2015)
  - Barbara Metcalf, *The Book Review* (2015)
  - Faisal Devji, "Young Fogeys", *The Wire* (4 October 2015)
  - Yasmin Khan, *American Historical Review* 121:1 (2016)
  - Manan Ahmed Asif, *The Caravan* (2015)
  - Sohaib I. Khan, *The Marginalia Review*
  - Pratap Bhanu Mehta, *Indian Express* (2015)
- Dhulipala's reply: "Revisiting *Creating a New Medina*", *Islamic Studies* 57 (2018).
- Ayesha Jalal, *The Sole Spokesman* (1985), the main thesis the book argues against.
