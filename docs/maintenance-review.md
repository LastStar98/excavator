# Maintenance review — 2026-09-08

## Fixed defects

- Keyboard and touch controls remained active after focus loss or a hidden tab.
  Focus/visibility changes now release controls; hidden pages skip simulation work.
- Reset kept held keyboard inputs, hydraulic targets, and warning cooldowns.
  Reset clears these and refreshes the HUD immediately. OS key repeats cannot
  reactivate a held control until a fresh key press.
- Settings navigation and browser shortcuts also drove the excavator. Editable
  targets, composition events, and modified shortcuts are now excluded.
- A second touch could take over a joystick and release the first touch's axis.
  Each joystick now keeps one pointer owner.
- Releasing one of two touches on a drive button stopped both. Drive input now
  remains active until the last pointer releases.
- Lost pointer capture left joystick, drive, and camera gestures active.
  Capture loss now follows the same cleanup path as pointer cancellation.
- Transitioning from pinch to one-finger orbit used stale coordinates and jumped
  the camera. The remaining finger now becomes the new drag reference.
- Stability used distance from the map origin instead of the chassis, so driving
  changed the estimated load moment even at the same arm pose.
- The orbit camera only followed one quarter of chassis travel. Its target now
  moves with the chassis, including terrain height changes.
- FPS used the capped physics timestep, overstating performance on slow devices.
  It now measures actual frame time and ignores non-frame HUD refreshes.

## Verification and deployment

- Added DOM regression checks for interruption, reset, shortcuts, pointer
  ownership, capture loss, and pinch transitions.
- Added unit checks for translation-invariant reach and camera tracking.
- Browser input tests now advance the production physics step at 60 Hz instead
  of assuming enough frames will render within a short wall-clock delay.
- Smoke tests launch a private local server, support Windows/macOS/Linux Chrome,
  and can test the production build. Readiness/reset timeouts fail explicitly.
- Pull requests run build, unit, and browser checks; Pages deployment depends on
  successful checks. Write permissions are limited to the deployment job.
- Updated vulnerable Vite/build dependencies within existing version ranges.
  The npm audit result changed from four vulnerable packages to zero.

## Scope and remaining limits

Local verification: production build and type checking passed; 83 Chrome browser
checks and two unit tests passed; no browser runtime errors were reported.
Rendering used software WebGL in the test environment, so its FPS is not a
hardware performance benchmark.

The physics model remains an approximation for a browser simulator. Passing
regressions does not validate it for operating or training on real machinery.
The large simulation module and its in-page diagnostic API remain in place;
splitting them is a separate refactor. The production bundle still triggers
Vite's large-chunk advisory. Physical phones and Safari require device testing;
the automated browser suite exercises Chrome with mobile viewport emulation.
