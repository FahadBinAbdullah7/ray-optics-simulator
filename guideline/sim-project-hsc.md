TenTen HSC — Interactive Simulation Needs Analysis
Date: April 23, 2026 Scope: HSC (Grades 11–12) — Physics, Chemistry, Math, Biology Context: May 17 press release targets TenTen Memory, image responses, and 3–5 interactive simulations per grade. This document prioritizes which simulations to build, based on analysis-hsc-quality.md data and HSC curriculum mapping.


Critical Assumption — Platform Must Be Confirmed First
Open question before any sim is built: Can TenTen's chat surface currently render an embedded <iframe> or interactive <canvas> widget? If TenTen today can only render text + images, "interactive simulations" is a platform engineering task, not a content task — and the May 17 timeline is at risk regardless of which sims are chosen. Farhanur must confirm this with the web/app team before sprint planning.


Terminology — What Counts as a Simulation
Not every visual need in the data is a simulation. This document distinguishes:

Type
Definition
Example
Tool to fix it
Static diagram
Single fixed image — no interaction
FBD on inclined plane, Haversian system cross-section, DNA replication fork
Image (already in roadmap)
Interactive stepper
User clicks through steps; no live parameter variation
Mitosis phase browser, mRNA codon builder
Simple HTML stepper
True simulation
User adjusts a parameter; output updates in real time
Projectile with angle/velocity sliders, circuit with adjustable R
JS simulation (p5.js, matter.js, Desmos, Three.js)


The image roadmap in analysis-hsc-quality.md handles static diagrams. This document focuses only on true simulations and steppers where interactivity adds insight that neither text nor a static image can provide.


Build vs. Fork Decision — PhET First
PhET Interactive Simulations (University of Colorado, CC BY license) already covers:

Projectile Motion, Forces & Motion (Physics)
Circuit Construction Kit (Physics)
Molecule Shapes, pH Scale, Acid-Base Solutions (Chemistry)
Function Builder, Graphing Quadratics (Math)

Forking/embedding PhET is 5–10x faster than building from scratch, and the sims are pedagogically validated. For each simulation below, the Build approach field flags whether a PhET embed is viable. If it is, the sprint estimate roughly halves.


May 17 Shortlist — Build These First
If the team has ~3 weeks and 1–2 frontend engineers, each sim is roughly 3–5 dev-days. Realistic shipping capacity: 3–5 simulations total, not per subject.

Priority
Sim
Subject
Why first
Build approach
Est. dev-days
1
Projectile Motion Simulator
Physics
5 occurrences in data; most-documented Physics sim need; PhET fork eliminates most build work
Fork PhET (embed + Bangla UI)
2–3
2
Function Grapher with Sliders
Math
Math has 14.3% dislike rate (3–5x all other subjects); geometry/graph visual gap directly causes dislikes; Desmos API is a 1-day embed
Desmos API embed
1–2
3
Vector Addition Explorer
Physics
4 occurrences; resolves #1 recurring student failure (component decomposition on inclined plane) — unique to sliders, no static image fixes this
Fork PhET / p5.js
3–4
4
Mitosis / Meiosis Phase Explorer
Biology
5 occurrences; student explicitly asked "chitro diye bujhao"; TenTen's ASCII fallback was acknowledged to be useless
HTML stepper + SVG
3–4
5
Electron Configuration Visualizer
Chemistry
3 occurrences; Aufbau/Hund's rule errors are sequential-logic failures — a stepper catches them; low build complexity
Vanilla JS
2


Total estimated dev-days: 11–16. Feasible in 3 weeks with 1 FE engineer if PhET forks are used for Physics items.


Physics — Simulation Candidates
SIM-P1: Projectile Motion Simulator
Chapter: HSC Physics 1st Paper, Chapter 3 — Kinematics
What it simulates: Student sets initial velocity (v₀) and launch angle (θ) via sliders. Simulation shows the parabolic trajectory animating in real time, labels maximum height (H), horizontal range (R), and time of flight (T) with live formula updates as sliders move.
Why it helps: 5 occurrences in data. Board questions frequently ask "find R and H for v₀=20 m/s, θ=30°". TenTen gives correct derivations but students cannot visualize why H and R trade off as θ varies (e.g., same R at θ=30° and θ=60°). A slider that shows this symmetry builds intuition no text derivation can.
Complexity: Low (PhET fork)
Build approach: Fork PhET "Projectile Motion" sim, replace UI language strings with Bangla, embed via iframe.
Priority: Critical


SIM-P2: Vector Addition Explorer
Chapter: HSC Physics 1st Paper, Chapter 2 — Vectors
What it simulates: Student places two force vectors (magnitude + direction via sliders). Sim constructs the triangle law and parallelogram law visually, with the resultant vector labeled in magnitude and angle. Toggle between graphical view and component (x/y) decomposition.
Why it helps: 4 occurrences. The documented failure pattern: "mg sin theta ar mg cos theta ekane keno — ekdomoi buji nai" (session 11617 — angle of repose, the single highest-frequency Physics session in the data). The student sees the formula but not the geometry. A draggable vector showing perpendicular and parallel components resolves this. No static image fully covers this because the angle changes problem to problem.
Complexity: Medium
Build approach: Fork PhET "Vector Addition" sim, or build with p5.js (~300 lines).
Priority: Critical


SIM-P3: Inclined Plane Force Decomposer
Chapter: HSC Physics 1st Paper, Chapter 4 — Newton's Laws / Friction
What it simulates: Student adjusts inclination angle (θ). Free body diagram updates live — shows N, mg, mg·sinθ, mg·cosθ, and friction force (fs). Student toggles "static" vs "kinetic" friction mode. At angle of repose, the sim highlights the equilibrium condition (fs = mg·sinθ).
Why it helps: 7 occurrences — the single highest-frequency image need in the entire 200-session dataset. A static FBD image is already in the image roadmap and should be built. This sim adds the dynamic angle-sweep insight: students see force components change live as θ increases, building the intuition behind the formula rather than just seeing a labeled diagram.
Complexity: Low–Medium
Build approach: Build with p5.js (~200 lines). Can share code structure with SIM-P2.
Priority: High


SIM-P4: DC Circuit — Equivalent Resistance Simulator
Chapter: HSC Physics 2nd Paper, Chapter 3 — Current Electricity
What it simulates: Student adds resistors in series/parallel via drag-and-drop (or simple toggles). Circuit displays equivalent resistance live, current through each branch, and voltage drop per resistor. Student adjusts source voltage and individual resistor values.
Why it helps: Not in top-frequency image data, but equivalent resistance is a core numerical chapter where students struggle to set up the formula before computing. Interactive circuit building bridges the gap between "drawing the circuit" and "writing the equation."
Complexity: Medium
Build approach: Fork PhET "Circuit Construction Kit" (CC licensed), restrict to resistor-only mode for simplicity.
Priority: High


SIM-P5: Satellite Orbit & Gravitational Field Visualizer
Chapter: HSC Physics 1st Paper, Chapter 6 — Gravitation
What it simulates: Student varies orbital radius (r). Sim updates orbital velocity (v), escape velocity (v_e), and period (T) in real time. Field line density shown around Earth changes with r. Toggle: "geostationary orbit" locks r to 42,164 km and shows the angular velocity match.
Why it helps: 4 occurrences in data. Orbit problems are purely spatial — students cannot visualize why orbital velocity decreases as r increases (inverse square law) from the formula alone. The geostationary toggle makes that specific concept — the matching angular velocity — immediately intuitive.
Complexity: Medium
Build approach: Build with p5.js (2D top-down projection — no 3D needed).
Priority: Medium


Chemistry — Simulation Candidates
Chemistry has the lowest image-dependency (26%) and the highest like rate in the full population (97%). Most HSC Chemistry failures in the data are NLU errors (the "bikriya/bikroy" confusion, session 35966) or knowledge gaps, not visual gaps. Simulations have lower ROI here. Three genuine candidates exist — do not build more to hit a quota.
SIM-C1: Electron Configuration / Orbital Box Visualizer
Chapter: HSC Chemistry 1st Paper, Chapter 2 — Atomic Structure
What it simulates: Student types an atomic number (1–36). Sim fills orbitals step-by-step following Aufbau, Hund's rule, and Pauli exclusion — showing box notation (↑↓ arrows) and spdf notation building live. Student can pause at any orbital to inspect which rule applies.
Why it helps: 3 occurrences in data. Orbital filling rules are sequential and rule-governed — exactly the type of logic that benefits from a stepper. Students frequently write the wrong configuration for d-block elements (Cr, Cu exceptions). A live visualizer catches errors before they become exam mistakes.
Complexity: Low
Build approach: Vanilla JS/HTML (~200 lines). No external library needed.
Priority: High


SIM-C2: Periodic Trend Explorer
Chapter: HSC Chemistry 1st Paper, Chapter 2 — Periodic Table
What it simulates: Student selects a property (atomic radius, ionization energy, electronegativity, electron affinity). Color gradient overlay appears on an s/p/d/f block periodic table with directional arrows. Student can hover individual elements to see exact values and group/period comparisons.
Why it helps: 2 occurrences in data. Periodic trend direction questions appear in HSC MCQ and CQ every year. Students memorize rules but confuse direction (e.g., ionization energy increases across a period but decreases down a group). A color-coded gradient makes this pattern inspectable rather than recitable.
Complexity: Low–Medium
Build approach: SVG periodic table + JS color overlay (~400 lines). Element data from JSON (118 elements, 4–5 properties).
Priority: Medium


SIM-C3: Reaction Energy Profile / Activation Energy Visualizer
Chapter: HSC Chemistry 1st Paper, Chapter 5 — Chemical Kinetics
What it simulates: Student adjusts activation energy (Ea) and temperature (T) via sliders. Sim shows the energy profile (reactants → transition state → products), updates rate constant (k) via Arrhenius equation live, and shows the Maxwell-Boltzmann curve with the fraction of molecules above Ea highlighted. Exothermic/endothermic toggle changes product energy level.
Why it helps: 1 direct occurrence in data, but the Arrhenius equation is a near-guaranteed HSC question. The conceptual link between Ea, temperature, and rate is almost never understood without a visual — students plug into the formula without grasping why raising T by 10°C roughly doubles k.
Complexity: Medium
Build approach: p5.js for the energy diagram; Maxwell-Boltzmann curve pre-computed (not real-time simulated).
Priority: Medium


Math — Simulation Candidates
Math's 14.3% dislike rate is the sharpest negative signal in the entire dataset — 3–5x worse than every other subject. All three dislike categories (over-explanation for micro-questions, truncated responses, no visual support for geometry) point to the same root cause: TenTen gives text when the student needed a picture. Simulations here have the highest measurable ROI.
SIM-M1: Function Grapher with Parameter Sliders
Chapter: HSC Math 1st Paper, Chapter 1 — Functions; Chapter 4 — Coordinate Geometry
What it simulates: Student types a function (e.g., f(x) = sqrt(x²-3x+2), or a conic equation). Graph renders immediately. Named constants (a, b, c) auto-generate sliders. Domain restrictions auto-detected and highlighted on a number line below. Toggle: Cartesian / polar.
Why it helps: 3 occurrences for domain/range problems; 2 for function behavior; 2 for conic/circle equations. More critically: Math's 14.3% dislike rate clusters on dense algebraic explanations without visual support. A function grapher gives students a reference frame to verify TenTen's algebra against what the curve looks like — they can catch truncated or wrong answers themselves.
Complexity: Low
Build approach: Desmos API embed (free, well-maintained, supports Arabic/Bangla labels). 1–2 days of integration work.
Priority: Critical


SIM-M2: Triangle / Polygon Geometry Constructor
Chapter: HSC Math 1st Paper, Chapter 3 — Trigonometry; Chapter 4 — Coordinate Geometry
What it simulates: Student inputs vertices (x, y) or side lengths + angles. Sim draws the triangle/polygon, labels all sides and angles, shows the circumscribed circle, and computes area, perimeter, and diagonal lengths live. Overlay toggles: cosine rule, sine rule, circumradius.
Why it helps: 3 occurrences for triangle problems (cosine rule, circumradius). Students frequently set up the wrong angle-side correspondence. A labeled live diagram with the formula overlay makes the correspondence explicit.
Complexity: Low–Medium
Build approach: Desmos Geometry API, or p5.js (~300 lines).
Priority: High


SIM-M3: Integration Area Visualizer
Chapter: HSC Math 2nd Paper, Chapter 5 — Integration
What it simulates: Student enters a function and two bounds (a, b). Sim shades the area under the curve, shows the Riemann sum approximation with an adjustable rectangle count (n), and displays the exact computed area. Student drags bounds to see area update. Toggle: signed vs absolute area.
Why it helps: 1 direct occurrence. But integration is a full HSC chapter with high board exam weight. Students who cannot visualize "what the integral represents" make setup errors before any algebra begins. The Riemann sum slider also builds understanding of why the integral formula works — not just how to apply it.
Complexity: Medium
Build approach: Desmos API (handles function graphing) + custom shading overlay (~3 days).
Priority: Medium


SIM-M4: Conic Section Classifier and Explorer
Chapter: HSC Math 1st Paper, Chapter 4 — Coordinate Geometry
What it simulates: Student enters the general equation (ax²+bxy+cy²+dx+ey+f=0). Sim identifies the conic type (circle, ellipse, parabola, hyperbola), plots it, labels center/foci/directrix/axis intercepts, and shows the discriminant (b²-4ac) that determines the type. Student can drag coefficients to morph between conic types.
Why it helps: 3 occurrences for circle/conic section problems. Students cannot classify a general conic equation without expanding — the sim makes classification and geometry immediate and interactive.
Complexity: Medium
Build approach: Desmos API or custom Canvas renderer. The discriminant classification logic is ~50 lines of JS.
Priority: Medium


Biology — Simulation Candidates
Honest assessment: most high-frequency Biology needs (DNA replication fork, Haversian system, cardiac anatomy diagram) are static diagrams or steppers, not parametric simulations. Biology has 2 genuine sim candidates and 1 stepper. Do not pad to 5 sims.
SIM-B1: Mitosis / Meiosis Phase Explorer (Interactive Stepper)
Chapter: HSC Biology 1st Paper, Chapter 2 — Cell Division
What it simulates: Student clicks "Next Phase" through Mitosis (Prophase → Metaphase → Anaphase → Telophase) and Meiosis (Prophase-I with bivalent → Metaphase-I → Anaphase-I → Telophase-I → Meiosis-II phases). Each phase shows a labeled diagram with chromosomes, spindle fibers, bivalents, and cell membrane. Clicking a labeled term shows a tooltip definition.
Why it helps: 5 occurrences — tied for highest-frequency image need in the dataset. One student explicitly asked "chitro diye bujhao" about bivalent vs homologous chromosomes (session 24504). TenTen's acknowledged ASCII fallback ("ami ekhon sorashori chhobhi aakte pari na...") was useless. This is a stepper, not a parametric simulation, but it is the single most impactful visual for Biology.
Critical dependency: Biology SME must validate each phase diagram for anatomical accuracy before shipping. This is likely the critical path, not the JS build.
Complexity: Medium (JS is simple; accurate SVG drawings per phase are the hard part)
Build approach: HTML stepper with SVG cell diagrams per phase.
Priority: Critical


SIM-B2: Mendelian Genetics Cross Simulator
Chapter: HSC Biology 1st Paper, Chapter 3 — Genetics
What it simulates: Student selects genotypes for two parents (AA, Aa, or aa for each trait). Sim generates the Punnett square live, calculates phenotype ratios (3:1 for monohybrid, 9:3:3:1 for dihybrid), and shows probabilities as fractions and percentages. Toggle: monohybrid vs. dihybrid cross.
Why it helps: Not in the top-frequency image data (less common in the 200-session sample) but genetics is a genuinely simulatable concept — change parent genotype, see Punnett square update instantly. This is the only Biology chapter where parametric interaction creates unavailable insight. Genetics appears in almost every HSC board paper as a CQ question.
Complexity: Low
Build approach: Vanilla JS + HTML table (~150 lines). No external library needed.
Priority: High


SIM-B3: Human Heart — Cardiac Cycle Animator (Interactive Explorer)
Chapter: HSC Biology 2nd Paper, Chapter 4 — Blood and Circulatory System
What it simulates: Labeled cross-section of the heart (RA, LA, RV, LV, valves, SA node, AV node). Student clicks Play to see blood flow animated through systole → diastole → atrial systole. Each phase highlights relevant chambers and valves. Clicking a label shows a definition popup.
Why it helps: 2 occurrences directly. Cardiac anatomy is high-weight in HSC Biology. This is an interactive explorer (no adjustable parameters), but the blood flow animation conveys chamber sequencing that no static diagram can — students consistently confuse systole/diastole directionality.
Critical dependency: Anatomically accurate heart SVG must be reviewed by Biology SME.
Complexity: Medium
Build approach: SVG animation (CSS keyframes + JS) on a pre-drawn anatomy base.
Priority: Medium


Cross-Subject Summary Table
#
Sim Name
Subject
Type
Priority
Complexity
Build Approach
Est. Dev-days
P1
Projectile Motion Simulator
Physics
True sim
Critical
Low
Fork PhET
2–3
P2
Vector Addition Explorer
Physics
True sim
Critical
Medium
Fork PhET / p5.js
3–4
P3
Inclined Plane Force Decomposer
Physics
True sim
High
Low–Med
p5.js
2–3
P4
DC Circuit Resistance Simulator
Physics
True sim
High
Medium
Fork PhET Circuit Kit
2–3
P5
Satellite & Gravitational Field Visualizer
Physics
True sim
Medium
Medium
p5.js
3–4
C1
Electron Configuration Visualizer
Chemistry
Stepper
High
Low
Vanilla JS
2
C2
Periodic Trend Explorer
Chemistry
Interactive explorer
Medium
Low–Med
SVG + JS
2–3
C3
Reaction Energy Profile / Arrhenius
Chemistry
True sim
Medium
Medium
p5.js
3–4
M1
Function Grapher with Sliders
Math
True sim
Critical
Low
Desmos API embed
1–2
M2
Triangle / Polygon Geometry Constructor
Math
True sim
High
Low–Med
Desmos Geo / p5.js
2–3
M3
Integration Area Visualizer
Math
True sim
Medium
Medium
Desmos + custom
3
M4
Conic Section Explorer
Math
True sim
Medium
Medium
Desmos / Canvas
3
B1
Mitosis / Meiosis Phase Explorer
Biology
Stepper
Critical
Medium
HTML stepper + SVG
3–4
B2
Mendelian Genetics Cross Simulator
Biology
True sim
High
Low
Vanilla JS
2
B3
Human Heart Cardiac Cycle Animator
Biology
Interactive explorer
Medium
Medium
SVG animation
3–5



What Is NOT a Simulation (Stays in Image Roadmap)
These high-frequency needs from analysis-hsc-quality.md should be built as static images, not simulations. Nothing varies — a diagram fixes them:

Free body diagram on inclined plane (7 occurrences) — static image
DNA replication fork structure (3 occurrences) — static image
Haversian system cross-section (2 occurrences) — static image
Carnot cycle P-V diagram (2 occurrences) — static image
Lewis dot structures / molecular structure (3 occurrences) — static image
Electromagnetic spectrum chart (1 occurrence) — static image
Recombinant DNA technology flowchart (2 occurrences) — static image (no parameters to vary)


Open Risks
Platform rendering — Confirm iframe/canvas rendering in TenTen chat before sprint planning. If not currently supported, simulations require a new "sim viewer" surface, adding 1–2 weeks of infra work upstream of any content build. This is the single largest schedule risk.

PhET licensing — PhET sims are CC BY licensed and free for use. Verify with legal whether 10MS's commercial context requires attribution display in-product (it does, but confirm the placement).

Desmos API licensing — Desmos API is free for non-commercial use. The commercial license has a cost. Confirm before building M1, M2, M3 on it.

SME review bottleneck — Biology steppers (B1, B3) and Chemistry sims require SME validation of diagrams before shipping. Parallelize SME review with dev work or it becomes the critical path.

PhET Bangla localization — PhET sims are in English. Forking requires extracting and translating UI strings. Estimate 0.5–1 day per sim for localization.

"3D cell" and "molecular orbital viewer" mentioned in the press release brief are High complexity and will not ship well by May 17. Recommend cutting both from the May 17 scope. A 3Dmol.js embed of a pre-loaded fixed molecule (e.g., water, benzene) is buildable in 1–2 days; a fully interactive 3D cell explorer is not.


