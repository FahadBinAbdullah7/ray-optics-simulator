TenTen Class 6–10 Interactive Simulation Opportunities
Analyst: Crystal (Data Analyst) BQ Data window: Jan 1 – Apr 23, 2026 Primary table: raw_product_content.tentenai_messages_v3


Data Quality Notes
Intent classification: 0% coverage for this window. Topic frequency derived from bilingual keyword-bucket regex on raw user_message text.

"Other" bucket is large. 60–80% of messages per grade fall outside keyword buckets — dominated by solve-this requests, follow-up fragments, image submissions. Keyword-matched counts are a floor.

SSC = classes 9 + 10 combined. No class-level split available in BQ.

"general" subject category is unclassified. Class-8 has 13,521 such messages; SSC has 24,095. Subject-level counts are undercounts.


Volume Summary
Grade
Total Messages
Unique Users
Sessions
Class 6
14,521
653
5,170
Class 7
25,351
939
8,981
Class 8
40,905
1,659
14,940
SSC (9+10)
109,743
5,896
42,920
Total
190,520
9,147
72,011



Subject Frequency Data (Keyword-matched messages)
Classes 6–8 Science
Topic Cluster
Class 6
Class 7
Class 8
Force & Motion
206
360
864
Cell & Life Processes
127
234
297
Matter & Atoms
28
136
189
Ecosystem & Environment
38
10
171
Plant & Photosynthesis
91
77
91
Electricity
9
24
71
Human Body Systems
7
36
44
Chemistry Basics
12
27
61

Math Across Grades
Topic Cluster
Class 6
Class 7
Class 8
SSC
Number Theory
123
135
169
403
Fractions, Decimals & Ratios
53
58
72
168
Geometry & Mensuration
21
64
55
342
Algebra & Equations
22
36
46
141
Trigonometry
2
6
33
379
Coordinate Geometry
1
3
14
151

SSC Science Subjects
Topic Cluster
Physics
Chemistry
Biology
Force & Motion (Newton)
4,169
—
—
Atomic Structure
—
680
—
Acid, Base & Salt
—
545
—
Periodic Table & Elements
—
486
—
Light & Optics
467
—
—
Cell & Cell Division
—
—
331
Chemical Reactions
—
327
—
Chemical Bonding
—
262
—
Organic Chemistry
—
183
—
Work, Energy & Power
397
—
—
Electricity & Circuits
296
—
—
Genetics & Heredity
—
—
84



Per-Grade Simulation List
Class 6
#
Simulation
Subject + Chapter
What It Does
Confusion Pattern Addressed
Frequency Signal
Complexity
Priority
6-A
Force & Motion Explorer
Science — Force, Motion, Speed
Drag a ball on a surface; adjust mass and friction; arrows show force vectors; watch speed change
Students confuse force with speed; cannot visualize why the same push gives different acceleration on different surfaces
206 msgs
Medium
Critical
6-B
Cell Structure 3D Viewer
Science — Plant and Animal Cells
Rotate a 3D cell; tap organelles for name + function labels
Students memorize organelle names without location context
127 msgs
Medium
High
6-C
Photosynthesis Process Flow
Science — Photosynthesis
Animated flow: sunlight + water + CO2 → glucose + O2; sliders adjust light intensity
Students know the equation but cannot explain what changes when variables shift
91 msgs
Low
High
6-D
Fraction Number Line
Math — Fractions and Decimals
Place fractions on a draggable number line; compare 1/2 vs 3/4 visually
Students cannot intuit fraction size without calculation
53 msgs
Low
High
6-E
Ecosystem Food Web Builder
Science — Ecosystem
Drag producers/consumers/decomposers into a food web; remove one organism and see cascading effects
Students understand linear chains but cannot reason about interdependency
38 msgs
Low
Medium

Class 7
#
Simulation
Subject + Chapter
What It Does
Confusion Pattern Addressed
Frequency Signal
Complexity
Priority
7-A
Force & Motion Explorer
Science — Force and Motion
Reusable from 6-A; higher volume at Class 7
Same confusion; stronger signal
360 msgs
Medium
Critical
7-B
Cell 3D Viewer
Science — Living World and Cell
Reusable from 6-B; NCTB revisits cell in Class 7 with more organelle detail
Repeat confusion compounds
234 msgs
Medium
Critical
7-C
Atomic Model Builder
Science — Matter and Atoms
Build Bohr model by placing electrons in shells; adjust atomic number and watch shell configuration
Students cannot visualize why shells fill in order; confuse atomic number with mass number
136 msgs (4.8x increase from Class 6)
Medium
High
7-D
Geometry Shape Builder
Math — Angles, Triangles, Quadrilaterals
Drag vertices to build triangles/quadrilaterals; see angle sum update live; auto-classify
Students apply angle-sum rules without understanding why
64 msgs
Medium
High
7-E
Human Body Systems Navigator
Science — Digestive and Circulatory Systems
Tap a system on a body diagram for animated flow; zoom into organ for function label
Body system questions jump from 7 to 36 msgs — curriculum introduces systems at Class 7
36 msgs
High
Medium

Class 8
#
Simulation
Subject + Chapter
What It Does
Confusion Pattern Addressed
Frequency Signal
Complexity
Priority
8-A
Force & Motion Explorer
Science — Newton's Laws
Reusable from 6-A/7-A; adds third-law reaction pairs visualization
864 msgs — 4x Class 6 volume; Newton's laws are harder at this level
864 msgs
Medium
Critical
8-B
Circuit Builder (Series & Parallel)
Science — Electricity and Circuits
Place resistors, batteries, bulbs in series or parallel; measure voltage/current; see equivalent resistance
Electricity jumps from 24 (Class 7) to 71 (Class 8); students cannot predict effect of removing a component
71 msgs (shared with SSC)
Medium
Critical
8-C
Atomic Structure Extended
Science — Atoms, Molecules, Elements
Bohr model builder + periods/groups; see valence electrons and predict bonding
Matter/Atoms rises 39% from Class 7; curriculum deepens
189 msgs
Medium
High
8-D
Mitosis/Meiosis Step Viewer
Science — Cell Division
Step through phases; see chromosomes align/split; count chromosome number at each stage
297 msgs cell at Class 8; phase sequence and chromosome count are dominant error types
297 msgs
High
High
8-E
Ecosystem Cascade Simulator
Science — Ecosystem
Build food web; simulate population shock; see predator/prey adjust
Ecosystem signal jumps from 10 (Class 7) to 171 (Class 8); students cannot reason about population dynamics
171 msgs
High
Medium
8-F
Fraction → Decimal → Percentage
Math — Fractions, Percentage
Three-way converter with visual bar; drag fraction slider and see decimal + percentage update
Persistent across 3 grades; rounding errors compound at Class 8
72 msgs
Low
Medium

SSC (Classes 9 + 10)
#
Simulation
Subject + Chapter
What It Does
Confusion Pattern Addressed
Frequency Signal
Complexity
Priority
S-A
Newton's Laws Interactive
Physics — Force, Newton's Laws, Friction
Apply force vectors; see acceleration change; add friction; visualize 3rd law reaction pairs
4,169 msgs — single largest topic cluster in entire dataset
4,169 msgs
Medium
Critical
S-B
Atomic Structure & Electron Config
Chemistry — Atomic Structure
Build Bohr model; fill shells using Aufbau principle; see energy levels; predict ion formation
680 msgs — #1 chemistry cluster. Students confuse atomic number, mass number, electron config under ions
680 msgs
Medium
Critical
S-C
Acid-Base pH Simulator
Chemistry — Acid, Base, and Salt
Add acid or base to water; watch pH change; mix acid+base and see neutralization; identify salt formed
545 msgs — #2 chemistry cluster. Students cannot predict pH after mixing or name resulting salt
545 msgs
Low
Critical
S-D
Trigonometry Unit Circle
Math / H.Math — Trigonometry
Rotate a point on unit circle; see sin/cos/tan update live; right-triangle breakdown visible
379 msgs — #2 math cluster at SSC. Students memorize trig tables without geometric intuition
379 msgs
Medium
Critical
S-E
Ray Optics: Lens & Mirror
Physics — Light, Reflection, Refraction
Place object at different positions relative to convex/concave lens or mirror; see image position, type, magnification
467 msgs — #2 physics cluster. Image formation rules are rote-memorized without causal understanding
467 msgs
Medium
High
S-F
Circuit Builder (Series & Parallel)
Physics — Electricity, Ohm's Law
Add resistors in series/parallel; apply Ohm's law; measure equivalent resistance; remove component and see effect
296 msgs; "চল বিদ্যুৎ" is one of the most-viewed SSC liveclass chapters. Shared sim with Class 8
296 msgs
Medium
High
S-G
Geometry Theorem Prover
Math — Pythagoras, Congruence, Similarity
Drag triangle vertices; see Pythagorean relation update; identify congruence/similarity conditions automatically
342 msgs; 79 dedicated Pythagoras liveclass sessions. Students apply theorem without seeing why it holds
342 msgs
Medium
High
S-H
3D Cell Viewer + Mitosis Stepper
Biology — Cell and Cell Division
Organelle viewer + phase-step animation; SSC revisits with higher chromosome rigor
331 msgs — #1 biology cluster. Phase sequence and chromosome count errors persist at SSC level
331 msgs
High
High
S-I
Chemical Reaction Balancer
Chemistry — Chemical Reactions
Input reactants/products; see atom count on each side; adjust coefficients until balance passes
327 msgs — #4 chemistry cluster. Students miss that atom counts must match on both sides
327 msgs
Low
High
S-J
Periodic Table Explorer
Chemistry — Periodic Table
Click an element: see Bohr model, electron config, group/period position, key reactions; filter by metal/nonmetal
486 msgs — #3 chemistry cluster. Students memorize elements without understanding the periodic system
486 msgs
Medium
High
S-K
Coordinate Geometry Grapher
Math — Coordinate Geometry, Straight Lines
Plot points, draw lines; adjust slope/intercept sliders; see equation update; find distance and midpoint
151 msgs; students confuse slope sign with direction of line
151 msgs
Low
Medium



Priority Recommendations (Quality-based, no timeline)
Tier 1 — Highest impact per frequency and confusion depth
Force & Motion Explorer (grades 6–SSC, 5,599 msgs combined) — single most-asked topic across all grades. One reusable sim with grade-appropriate scenarios. The Newton's Laws confusion is documented as systematic — students cannot connect formula to physical intuition.
Atomic Structure & Electron Configuration (Class 7, 8, SSC Chemistry; 1,005 msgs combined) — Bohr model at junior level, Aufbau + ions at SSC. Same fundamental confusion compounds across 3 years of curriculum.
Trigonometry Unit Circle (SSC, 379 msgs) — SSC board exams are trig-heavy. Students are clearly memorizing tables without geometric grounding. Unit circle is the canonical fix.
Acid-Base pH Simulator (SSC, 545 msgs) — Most visually tractable chemistry sim. pH strip + neutralization reaction covers the #2 chemistry cluster.
Cell 3D Viewer + Division Stepper (grades 6–SSC, 989 msgs combined) — Cell structure and division are the #1 biology cluster at every grade. One build serves 4 grade levels.
Tier 2 — Strong signal, targeted subjects
Ray Optics: Lens & Mirror (SSC Physics, 467 msgs) — Optics is the classic "memorize the rules" failure. Interactive object placement breaks that.
Circuit Builder (Class 8 + SSC, 367 msgs combined) — Shared across two grade bands. Series/parallel equivalence is a permanent exam topic.
Geometry Theorem Prover (SSC Math, 342 msgs; 79 liveclass sessions) — Pythagoras and congruence are high-weight exam topics.
Periodic Table Explorer (SSC Chemistry, 486 msgs) — Reference tool that students return to across multiple chemistry chapters.
Tier 3 — Moderate signal, lower-grade reference
Photosynthesis Process Flow (Class 6–7, 168 msgs) — Low effort, illustrative. Good for press release demo.
Fraction Number Line (Class 6–8, 183 msgs) — Simplest possible build. Persistent confusion.
Chemical Reaction Balancer (SSC, 327 msgs) — Pure logic visualizer. No physics engine needed.


SQL Reference
-- Grade x subject volume
SELECT grade, normalized_conversation_category AS subject, COUNT(*) AS total_messages
FROM `raw_product_content.tentenai_messages_v3`
WHERE user_message_created_at BETWEEN '2026-01-01' AND '2026-04-23'
  AND grade IN ('class-6', 'class-7', 'class-8', 'ssc')
GROUP BY grade, subject ORDER BY grade, total_messages DESC;

-- SSC Physics keyword bucket
SELECT
  CASE
    WHEN REGEXP_CONTAINS(LOWER(user_message), r'force|বল|newton|নিউটন|friction|gravity|motion|গতি|velocity|বেগ|acceleration|momentum') THEN 'Force & Motion'
    WHEN REGEXP_CONTAINS(LOWER(user_message), r'light|আলো|refraction|reflection|lens|mirror') THEN 'Light & Optics'
    WHEN REGEXP_CONTAINS(LOWER(user_message), r'work|energy|শক্তি|power|ক্ষমতা|kinetic|potential') THEN 'Work, Energy & Power'
    WHEN REGEXP_CONTAINS(LOWER(user_message), r'electric|বিদ্যুৎ|current|resistance|circuit|ohm|voltage') THEN 'Electricity & Circuits'
    ELSE 'Other'
  END AS topic_cluster,
  COUNT(*) AS msg_count
FROM `raw_product_content.tentenai_messages_v3`
WHERE user_message_created_at BETWEEN '2026-01-01' AND '2026-04-23'
  AND grade = 'ssc' AND normalized_conversation_category = 'physics'
GROUP BY topic_cluster ORDER BY msg_count DESC;


Caveats
Intent classification is 0% populated for Jan–Apr 2026. All counts include solve-my-question messages alongside concept-clarification requests.
SSC = classes 9+10 combined. No BQ split available.
Curriculum alignment is analyst-informed. Engineering should validate chapter names against the product catalog before building.



Source: raw_product_content.tentenai_messages_v3, Jan 1 – Apr 23, 2026 Data freshness confirmed: MAX(user_message_created_at_date_time) = 2026-04-23T12:04:49Z


