# Excavator Web Simulator

## Controls

- `W/A/S/D`: left joystick
- Arrow keys: right joystick
  - `Left Arrow`: bucket scoop/curl toward the machine
  - `Right Arrow`: bucket dump/open away from the machine
- `B`: left crawler reverse
- `G`: left crawler forward
- `N`: right crawler reverse
- `H`: right crawler forward

The default control pattern is ISO. `A/D` swing direction was reversed after play testing so the on-screen rotation matches the expected left-stick feel.

## Mobile play

- Touch screens show a game-style overlay with left and right joysticks.
- Left joystick maps to the same axes as `W/A/S/D`.
- Right joystick maps to the same axes as the arrow keys.
- `FWD` and `REV` drive both crawler tracks forward or backward.
- `L` and `R` pivot the crawler base with differential track drive.
- Drag on the 3D view to orbit the camera. Pinch the 3D view to zoom.

## GitHub Pages hosting

This app is static after `npm run build`, so it can run from GitHub Pages without installing anything on a phone.

1. Create a GitHub repository and push this project to the `main` branch.
2. Do not upload `node_modules`, `dist`, or log files. They are ignored by `.gitignore`.
3. In the repository, open Settings > Pages and set Source to GitHub Actions.
4. The included workflow builds the app and deploys the `dist` folder automatically.
5. Open the Pages URL on the phone browser and rotate the phone to landscape for the mobile controls.

## Current Physics Model

- Hydraulic controls are not instant transforms. Input drives target flow, joint velocities follow with first-order response, and digging load increases pressure.
- Bucket penetration is sampled across the cutting edge, not just at one point. Contact depth, edge angle, bucket curl, stick pull, slope, and current bucket load all add resistance and damp boom/stick/bucket velocity.
- Digging removes a swept strip from the terrain heightfield. The removed terrain volume is capped by remaining bucket capacity and is added to the bucket at the same volume.
- Bucket contents use an internal dynamic surface instead of a generic blob, so the soil visibly rises inside the bucket as volume is loaded and clears when dumped.
- When the bucket is full and still pushes into the ground, soil is displaced into side berms instead of disappearing or overfilling the bucket.
- Dumping depends on bucket angle and angular speed. Soil falls as small gravity-driven chunks, and deposited volume is conserved when it lands on terrain or in the truck.
- Deposited soil uses local heightfields and relaxes slopes toward an approximate 34 degree angle of repose, so ground piles and truck-bed loads spread instead of forming vertical spikes.
- Soil rendering uses procedural color, bump, and roughness textures plus scattered stones, dry clods, and irregular falling soil chunks.
- The crawler base uses independent left/right track commands with hydraulic lag. The upper structure still swings independently from the lower carriage.
- Moving crawler tracks compact the terrain under each track, leave shallow ruts, push a portion of soil into side berms, and add small terrain-dependent travel resistance.
- Joint limits are tuned as a browser-scale backhoe approximation: wider boom/stick travel and a deeper bucket curl range so left-arrow bucket curl can close hard enough to hold soil.

This is still a browser-friendly approximation, not a validated hydraulic or granular soil solver.
