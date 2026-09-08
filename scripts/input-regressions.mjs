// Exercise the real DOM handlers, including cancellation paths absent from normal play.
export async function runInputRegressions(cdp) {
  const result = await cdp.send("Runtime.evaluate", {
    expression: `(${browserChecks.toString()})()`,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  }
  return result.result.value;
}

async function browserChecks() {
  const checks = [];
  const sim = window.__excavatorSim;
  const canvas = document.getElementById("sim-canvas");
  const stick = document.querySelector('[data-joystick="left"]');
  const drive = document.querySelector('[data-drive="forward"]');
  const frame = async () => {
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  };
  const key = (type, target = window, extra = {}) => {
    const event = new KeyboardEvent(type, { code: "KeyD", key: "d", bubbles: true, cancelable: true, ...extra });
    target.dispatchEvent(event);
    return event;
  };
  const pointer = (target, type, id, x = 100, y = 100) => target.dispatchEvent(new PointerEvent(type, {
    bubbles: true, cancelable: true, pointerType: "touch", pointerId: id, clientX: x, clientY: y,
  }));
  const startStick = (id, direction = 1) => {
    const rect = (stick.querySelector(".mobile-stick-pad") ?? stick).getBoundingClientRect();
    pointer(stick, "pointerdown", id, rect.left + rect.width / 2 + 28 * direction, rect.top + rect.height / 2);
  };
  const pressed = () => Boolean(document.querySelector('[data-key="KeyD"].active'));
  const reset = async () => {
    key("keyup");
    document.getElementById("reset-button").click();
    await frame();
  };

  await reset();
  key("keydown");
  await frame();
  checks.push(["keyboard regression setup activates swing", pressed()]);
  window.dispatchEvent(new Event("blur"));
  await frame();
  checks.push(["focus loss releases keyboard input", !pressed()]);

  await reset();
  key("keydown");
  await frame();
  document.getElementById("reset-button").click();
  await frame();
  checks.push(["reset releases held keyboard input", !pressed()]);
  key("keydown", window, { repeat: true });
  await frame();
  checks.push(["held key repeat cannot restart after reset", !pressed()]);

  await reset();
  const select = document.getElementById("pattern-select");
  const selectEvent = key("keydown", select);
  await frame();
  checks.push(["settings keyboard navigation does not drive machine", !pressed() && !selectEvent.defaultPrevented]);
  await reset();
  const shortcut = key("keydown", window, { ctrlKey: true });
  await frame();
  checks.push(["browser shortcuts do not drive machine", !pressed() && !shortcut.defaultPrevented]);

  await reset();
  startStick(810);
  checks.push(["touch regression setup moves joystick", sim.snapshot().mobileAxes.leftX > 0]);
  window.dispatchEvent(new Event("blur"));
  checks.push(["focus loss releases touch input", Object.values(sim.snapshot().mobileAxes).every(value => value === 0)]);

  await reset();
  startStick(811);
  const ownedAxis = sim.snapshot().mobileAxes.leftX;
  startStick(812, -1);
  const secondTouchAxis = sim.snapshot().mobileAxes.leftX;
  pointer(window, "pointerup", 812);
  checks.push(["second touch cannot steal or release occupied joystick", ownedAxis > 0 && secondTouchAxis === ownedAxis && sim.snapshot().mobileAxes.leftX === ownedAxis]);
  await reset();
  startStick(811);
  pointer(stick, "lostpointercapture", 811);
  checks.push(["lost joystick capture returns to neutral", sim.snapshot().mobileAxes.leftX === 0]);

  await reset();
  pointer(drive, "pointerdown", 813);
  pointer(drive, "pointerdown", 814);
  pointer(window, "pointerup", 813);
  checks.push(["drive remains held until last touch releases", sim.snapshot().mobileAxes.leftTrack === 1 && drive.classList.contains("active")]);
  await reset();
  pointer(drive, "pointerdown", 814);
  pointer(drive, "lostpointercapture", 814);
  checks.push(["lost drive capture returns to neutral", sim.snapshot().mobileAxes.leftTrack === 0 && !drive.classList.contains("active")]);

  await reset();
  pointer(canvas, "pointerdown", 815, 100, 100);
  pointer(canvas, "pointerdown", 816, 200, 100);
  pointer(canvas, "pointermove", 816, 220, 100);
  pointer(canvas, "pointermove", 815, 120, 100);
  pointer(canvas, "pointerup", 816, 220, 100);
  const beforeOrbit = sim.snapshot().orbit;
  pointer(canvas, "pointermove", 815, 120, 100);
  const afterOrbit = sim.snapshot().orbit;
  checks.push(["pinch to one finger does not jump camera", beforeOrbit.azimuth === afterOrbit.azimuth && beforeOrbit.elevation === afterOrbit.elevation]);
  pointer(canvas, "lostpointercapture", 815, 120, 100);
  pointer(canvas, "pointermove", 815, 160, 140);
  checks.push(["lost canvas capture stops camera drag", sim.snapshot().orbit.azimuth === afterOrbit.azimuth]);

  await reset();
  key("keydown");
  startStick(817);
  Object.defineProperty(document, "hidden", { configurable: true, value: true });
  document.dispatchEvent(new Event("visibilitychange"));
  const hiddenElapsed = sim.snapshot().elapsed;
  await frame();
  checks.push(["hidden page pauses physics", sim.snapshot().elapsed === hiddenElapsed]);
  delete document.hidden;
  document.dispatchEvent(new Event("visibilitychange"));
  await frame();
  checks.push(["hidden page releases keyboard and touch", !pressed() && Object.values(sim.snapshot().mobileAxes).every(value => value === 0)]);
  await reset();
  return checks;
}
