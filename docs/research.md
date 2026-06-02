# Excavator Web Simulator Research Notes

## Control Pattern

- Real excavators commonly use ISO and SAE joystick patterns. ISO maps the left stick to swing and stick, and the right stick to boom and bucket. SAE keeps swing and bucket on the same axes but swaps boom/stick between left and right sticks.
- The first implementation therefore exposes `ISO`, `SAE`, and `Arcade` modes. The user's requested keyboard mapping is preserved: `WASD` is the left stick and arrow keys are the right stick.
- Sources: Caterpillar joystick configuration notes mention left/right joystick configuration, lever pattern, and spool response settings: https://www.cat.com/en_US/articles/for-owners/excavator-joystick-controls.html. BigRentz summarizes ISO/SAE joystick differences: https://www.bigrentz.com/blog/excavator-controls. SAE J1177 covers hydraulic excavator operator control arrangement/direction: https://saemobilus.sae.org/standards/j1177_201906-hydraulic-excavator-operator-controls.

## Machine Response

- A credible web prototype should not move joints as instant keyboard transforms. Joystick input should drive a target spool/flow command, then joint speed should follow with deadband, first-order lag, inertia-like smoothing, and joint limits.
- The current implementation models this as target angular rates plus response modes: slow, medium, and fast. It also counts repeated joint-limit hits as operator feedback.
- Sources: Caterpillar documents configurable spool response settings. Hydraulic excavator control research describes flow/pressure coupling, delay, overshoot, and the difficulty of precise trajectory control in load-sensing hydraulic systems: https://www.mdpi.com/2075-1702/11/1/10 and https://www.mdpi.com/2075-1702/10/11/987.

## Training UX

- Existing training simulators emphasize more than arm motion: cab/external views, control pattern selection, task modules, safety errors, cycle time, fill amount, idle time, and precision metrics.
- The prototype includes cab, external, bucket, and task cameras; truck loading; safety-zone violations; idle percentage; bucket load; limit impacts; stability; and elapsed time.
- Sources: Simlog's Hydraulic Excavator simulator describes SAE/ISO pattern support, indoor/outdoor views, joystick hardware, vibration options, task modules, and performance metrics: https://www.simlog.com/product/hydraulic-excavator-personal-simulator/. CM Labs tracked excavator training material emphasizes safe operation, productivity metrics, trenching, loading, and jobsite scenarios: https://tech-labs.com/resources/cm-labs/tracked-excavator-simulator-training-pack.

## Soil And Terrain

- Excavator bucket filling is commonly studied with DEM for granular motion and MPM/continuum methods for large deformation. That points the prototype toward many small visual grains, moving clods, and force/resistance terms rather than a single smooth height edit.
- Full 3D level-set or voxel terrain can represent near-vertical faces better than a 2.5D heightfield, but it is heavier. The web prototype keeps a heightfield for speed and compensates with deeper cut limits, slope relaxation, side berms, and transient particles.
- Tracked machine sinkage should not follow one ground sample at the machine center. Terramechanics references use pressure-sinkage and track contact area; this prototype samples the two crawler footprints and applies a small Bekker-like visual sinkage term based on disturbed depth and contact span.
- Sources: Excavator bucket filling comparison with DEM/MPM: https://www.sciencedirect.com/science/article/pii/S0022489806000565. Real-time earthmoving level-set/particle hybrid notes heightfield limitations and particle surcharge: https://www.iaarc.org/publications/proceedings_of_the_30th_isarc/realtime_simulation_of_mining_and_earthmoving_operations_a_level_setbased_model_for_toolinduced_terrain_deformations.html. Real-time multiscale earthmoving compares against DEM/MBD reference data: https://arxiv.org/abs/2011.00459. NASA terramechanics notes pressure-sinkage/Bekker tradeoffs and DEM/CRM fidelity costs: https://ntrs.nasa.gov/api/citations/20250006958/downloads/TM-20250006958.pdf.

## Web 3D Architecture

- A production version should use imported `.glb` models, primitive colliders, and a real physics engine such as Rapier for joints and contacts. The current MVP uses procedural Three.js meshes and kinematic joints because stable control feel is the first risk to solve.
- Three.js `Object3D` transforms and `WebGLRenderer.setAnimationLoop` are enough for this prototype. If the simulator grows into rigid-body terrain, attachments, or multiplayer, the next step is `Vite + React + @react-three/fiber + @react-three/rapier`.
- Sources: Three.js docs for Object3D and WebGLRenderer: https://threejs.org/docs/pages/Object3D.html and https://threejs.org/docs/pages/WebGLRenderer.html. Three.js physics manual notes that physics engines are typically stepped separately and synced to meshes: https://threejs.org/manual/en/physics.html. Rapier's JavaScript joints docs cover revolute joints suitable for boom/stick/bucket pivots: https://rapier.rs/docs/user_guides/javascript/joints/.

## Deliberate Doubts

- This is not a validated hydraulic model. It is a control-feel model: joystick input, lag, limits, load, and operator feedback are represented, but pump pressure and cylinder chamber dynamics are not solved.
- Soil is a heightfield approximation. It supports digging, bucket carry, dumping, and truck loading, but not granular particle flow.
- The arm is procedural. A production simulator should replace it with a rigged glTF model and use the same kinematic state to drive the visual rig.
- The key question for the next iteration is whether training value improves more from Rapier joint physics or from richer tasks and scoring. Based on existing simulators, richer tasks and better feedback may matter before exact low-level physics.
