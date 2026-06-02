import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const chromePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const remotePort = 9348 + Math.floor(Math.random() * 500);
const profileDir = join(root, ".chrome-smoke-profile");
const screenshotPath = join(root, "smoke-after.png");

await mkdir(profileDir, { recursive: true });

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${remotePort}`,
    `--user-data-dir=${profileDir}`,
    "--window-size=1440,900",
    "http://127.0.0.1:5173",
  ],
  { stdio: "ignore" },
);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readJson(url, attempts = 60) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      lastError = error;
    }
    await delay(150);
  }
  throw lastError ?? new Error(`Unable to read ${url}`);
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let id = 0;
  const pending = new Map();
  const events = [];

  socket.addEventListener("message", (message) => {
    const data = JSON.parse(message.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) {
        reject(new Error(data.error.message));
      } else {
        resolve(data.result);
      }
      return;
    }
    events.push(data);
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener("open", () => {
      resolve({
        events,
        send(method, params = {}) {
          id += 1;
          socket.send(JSON.stringify({ id, method, params }));
          return new Promise((commandResolve, commandReject) => {
            pending.set(id, { resolve: commandResolve, reject: commandReject });
          });
        },
        close() {
          socket.close();
        },
      });
    });
    socket.addEventListener("error", reject);
  });
}

async function main() {
  try {
    const targets = await readJson(`http://127.0.0.1:${remotePort}/json`);
    const page = targets.find((target) => target.type === "page") ?? targets[0];
    if (!page?.webSocketDebuggerUrl) {
      throw new Error("No debuggable Chrome page found");
    }

    const cdp = await createCdpClient(page.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Log.enable");
    await delay(1800);

    const readState = async () => {
      const result = await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          const text = (id) => document.getElementById(id)?.textContent ?? "";
          const value = (id) => Number(document.getElementById(id)?.value ?? 0);
          const canvas = document.getElementById("sim-canvas");
          return {
            title: document.title,
            canvasWidth: canvas?.clientWidth ?? 0,
            canvasHeight: canvas?.clientHeight ?? 0,
            swing: text("swing-text"),
            boom: text("boom-text"),
            stick: text("stick-text"),
            bucket: text("bucket-text"),
            travel: text("travel-text"),
            travelDirection: text("travel-direction-text"),
            bucketMeter: value("bucket-meter"),
            truckPercent: text("truck-load-text"),
            soilText: text("soil-text"),
            pressure: value("pressure-meter"),
            mission: text("mission-state"),
            fps: Number(text("fps-text") || 0)
          };
        })()`,
        returnByValue: true,
      });
      return result.result.value;
    };

    const before = await readState();

    const holdKey = async (key, code, keyCode) => {
      await cdp.send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key,
        code,
        windowsVirtualKeyCode: keyCode,
        nativeVirtualKeyCode: keyCode,
      });
      await delay(650);
      const state = await readState();
      await cdp.send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key,
        code,
        windowsVirtualKeyCode: keyCode,
        nativeVirtualKeyCode: keyCode,
      });
      await delay(160);
      return state;
    };

    const holdKeys = async (keys) => {
      for (const [key, code, keyCode] of keys) {
        await cdp.send("Input.dispatchKeyEvent", {
          type: "keyDown",
          key,
          code,
          windowsVirtualKeyCode: keyCode,
          nativeVirtualKeyCode: keyCode,
        });
      }
      await delay(1200);
      const state = await readState();
      for (const [key, code, keyCode] of keys.toReversed()) {
        await cdp.send("Input.dispatchKeyEvent", {
          type: "keyUp",
          key,
          code,
          windowsVirtualKeyCode: keyCode,
          nativeVirtualKeyCode: keyCode,
        });
      }
      await delay(160);
      return state;
    };

    const resetSim = async () => {
      await cdp.send("Runtime.evaluate", {
        expression: `document.getElementById("reset-button")?.click()`,
        returnByValue: true,
      });
      await delay(500);
      return readState();
    };

    const readDebug = async () => {
      const result = await cdp.send("Runtime.evaluate", {
        expression: `window.__excavatorSim?.snapshot()`,
        returnByValue: true,
      });
      return result.result.value;
    };

    let syntheticPointerId = 700;
    const pointerDrag = async (selector, dx, dy, holdMs = 650, moveTarget = "window") => {
      syntheticPointerId += 1;
      const pointerId = syntheticPointerId;
      const start = await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          const init = { bubbles: true, cancelable: true, pointerId: ${pointerId}, pointerType: "touch", clientX: x, clientY: y };
          el.dispatchEvent(new PointerEvent("pointerdown", init));
          const target = ${JSON.stringify(moveTarget)} === "element" ? el : window;
          target.dispatchEvent(new PointerEvent("pointermove", { ...init, clientX: x + ${dx}, clientY: y + ${dy} }));
          return { x, y };
        })()`,
        returnByValue: true,
      });
      await delay(holdMs);
      const state = await readState();
      const snapshot = await readDebug();
      const startValue = start.result.value;
      await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          const target = ${JSON.stringify(moveTarget)} === "element" && el ? el : window;
          const x = ${(startValue?.x ?? 0) + dx};
          const y = ${(startValue?.y ?? 0) + dy};
          target.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, cancelable: true, pointerId: ${pointerId}, pointerType: "touch", clientX: x, clientY: y }));
        })()`,
        returnByValue: true,
      });
      await delay(160);
      return { state, snapshot };
    };

    const pointerPress = async (selector, holdMs = 700) => {
      syntheticPointerId += 1;
      const pointerId = syntheticPointerId;
      const start = await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true, pointerId: ${pointerId}, pointerType: "touch", clientX: x, clientY: y }));
          return { x, y };
        })()`,
        returnByValue: true,
      });
      await delay(holdMs);
      const state = await readState();
      const snapshot = await readDebug();
      const startValue = start.result.value;
      await cdp.send("Runtime.evaluate", {
        expression: `window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, cancelable: true, pointerId: ${pointerId}, pointerType: "touch", clientX: ${startValue?.x ?? 0}, clientY: ${startValue?.y ?? 0} }))`,
        returnByValue: true,
      });
      await delay(160);
      return { state, snapshot };
    };

    const afterSwing = await holdKey("d", "KeyD", 68);
    const afterBoom = await holdKey("ArrowDown", "ArrowDown", 40);
    const afterStick = await holdKey("w", "KeyW", 87);
    const afterBucket = await holdKey("ArrowLeft", "ArrowLeft", 37);
    const afterLeftForward = await holdKey("g", "KeyG", 71);
    await resetSim();
    const afterRightForward = await holdKey("h", "KeyH", 72);
    await resetSim();
    const afterBothForward = await holdKeys([
      ["g", "KeyG", 71],
      ["h", "KeyH", 72],
    ]);

    const beforeReverse = await resetSim();
    const afterLeftReverse = await holdKey("b", "KeyB", 66);
    await resetSim();
    const afterRightReverse = await holdKey("n", "KeyN", 78);
    const beforeBothReverse = await resetSim();
    const afterBothReverse = await holdKeys([
      ["b", "KeyB", 66],
      ["n", "KeyN", 78],
    ]);
    await resetSim();
    const soilBefore = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.snapshot()`,
      returnByValue: true,
    });
    const soilDig = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceDigPass()`,
      returnByValue: true,
    });
    const soilAfterDig = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.snapshot()`,
      returnByValue: true,
    });
    const soilDump = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceTruckDump()`,
      returnByValue: true,
    });
    const soilAfterDump = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.snapshot()`,
      returnByValue: true,
    });
    await resetSim();
    const playableDig = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forcePlayableDigPass()`,
      returnByValue: true,
    });
    await resetSim();
    const fineGrainSettlement = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceFineGrainSettlement()`,
      returnByValue: true,
    });
    await resetSim();
    const soilPush = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceFullBucketPush()`,
      returnByValue: true,
    });
    await resetSim();
    const cuttingFlowPhysics = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceCuttingFlowPhysics()`,
      returnByValue: true,
    });
    await resetSim();
    const bucketKinematics = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceBucketKinematics()`,
      returnByValue: true,
    });
    await resetSim();
    const trackPass = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceTrackPass()`,
      returnByValue: true,
    });
    await resetSim();
    const pitSink = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceExcavatorPitSink()`,
      returnByValue: true,
    });
    await resetSim();
    const truckCollision = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceTruckCollision()`,
      returnByValue: true,
    });
    await resetSim();
    const armTruckCollision = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceArmTruckCollision()`,
      returnByValue: true,
    });
    await resetSim();
    const armSubsoilResistance = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceArmSubsoilResistance()`,
      returnByValue: true,
    });
    await resetSim();
    const armWorldObjectPhysics = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceArmWorldObjectPhysics()`,
      returnByValue: true,
    });
    await resetSim();
    const truckLoadPhysics = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceTruckLoadPhysics()`,
      returnByValue: true,
    });
    await resetSim();
    const terrainMaterialPhysics = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceTerrainMaterialPhysics()`,
      returnByValue: true,
    });
    await resetSim();
    const roughTrack = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceRoughTrackSupport()`,
      returnByValue: true,
    });
    await resetSim();
    const worldObjectPhysics = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceWorldObjectPhysics()`,
      returnByValue: true,
    });
    await resetSim();
    const mapDiversity = await cdp.send("Runtime.evaluate", {
      expression: `window.__excavatorSim?.forceMapDiversity()`,
      returnByValue: true,
    });
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 844,
      height: 390,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await cdp.send("Page.reload", { ignoreCache: true });
    await delay(1800);
    const mobileUi = await cdp.send("Runtime.evaluate", {
      expression: `(() => {
        const controls = document.getElementById("mobile-controls");
        const left = document.getElementById("mobile-left-joystick");
        const right = document.getElementById("mobile-right-joystick");
        const drive = document.querySelector(".mobile-drive-pad");
        const driveMenu = document.querySelector('[data-mobile-menu="drive"]');
        const topbar = document.querySelector(".topbar");
        const fwd = document.querySelector('[data-drive="forward"]');
        const styles = controls ? getComputedStyle(controls) : null;
        const topbarStyles = topbar ? getComputedStyle(topbar) : null;
        const rect = controls?.getBoundingClientRect();
        const driveRect = drive?.getBoundingClientRect();
        return {
          visible: Boolean(controls && styles?.display !== "none" && rect && rect.width > 0 && rect.height > 0),
          leftReady: Boolean(left?.getBoundingClientRect().width),
          rightReady: Boolean(right?.getBoundingClientRect().width),
          driveHiddenInitially: Boolean(drive && driveRect && driveRect.width === 0 && driveRect.height === 0),
          menuReady: Boolean(driveMenu?.getBoundingClientRect().width),
          topbarHidden: Boolean(topbar && topbarStyles?.display === "none"),
          driveReady: Boolean(fwd?.getBoundingClientRect().width),
          width: rect?.width ?? 0,
          height: rect?.height ?? 0,
          driveLeft: driveRect?.left ?? 999,
          driveTop: driveRect?.top ?? 999,
          driveWidth: driveRect?.width ?? 0,
          driveHeight: driveRect?.height ?? 0
        };
      })()`,
      returnByValue: true,
    });
    const mobileBeforeLeft = await resetSim();
    const mobileLeft = await pointerDrag("#mobile-left-joystick", 0, -48, 650);
    const mobileBeforeRight = await resetSim();
    const mobileRight = await pointerDrag("#mobile-right-joystick", -48, 0, 650);
    await cdp.send("Runtime.evaluate", {
      expression: `document.querySelector('[data-mobile-menu="drive"]')?.click()`,
      returnByValue: true,
    });
    await delay(180);
    const mobileMenuUi = await cdp.send("Runtime.evaluate", {
      expression: `(() => {
        const panel = document.getElementById("mobile-menu-panel");
        const drive = document.querySelector(".mobile-drive-pad");
        const fwd = document.querySelector('[data-drive="forward"]');
        const driveRect = drive?.getBoundingClientRect();
        return {
          panelOpen: Boolean(panel && !panel.classList.contains("hidden")),
          driveReady: Boolean(fwd?.getBoundingClientRect().width),
          driveLeft: driveRect?.left ?? 999,
          driveTop: driveRect?.top ?? 999,
          driveWidth: driveRect?.width ?? 0,
          driveHeight: driveRect?.height ?? 0
        };
      })()`,
      returnByValue: true,
    });
    const mobileBeforeForward = await resetSim();
    const mobileForward = await pointerPress('[data-drive="forward"]', 760);
    const mobileBeforeReverse = await resetSim();
    const mobileReverse = await pointerPress('[data-drive="reverse"]', 760);
    await resetSim();
    const orbitBefore = await readDebug();
    await pointerDrag("#sim-canvas", 92, -28, 220, "element");
    const orbitAfter = await readDebug();
    await delay(300);
    const after = await readState();

    await cdp.send("Runtime.evaluate", {
      expression: `document.querySelector('[data-camera="bucket"]')?.click()`,
      returnByValue: true,
    });
    await delay(700);
    const screenshot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
    await writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));

    const errors = cdp.events.filter((event) => {
      if (event.method === "Runtime.exceptionThrown") {
        return true;
      }
      if (event.method === "Log.entryAdded") {
        const entry = event.params?.entry;
        return entry?.level === "error" && entry?.source !== "network";
      }
      return false;
    });

    const beforeSwing = Number.parseInt(before.swing, 10);
    const afterSwingValue = Number.parseInt(afterSwing.swing, 10);
    const beforeBoom = Number.parseInt(before.boom, 10);
    const afterBoomValue = Number.parseInt(afterBoom.boom, 10);
    const beforeStick = Number.parseInt(before.stick, 10);
    const afterStickValue = Number.parseInt(afterStick.stick, 10);
    const beforeBucket = Number.parseInt(before.bucket, 10);
    const afterBucketValue = Number.parseInt(afterBucket.bucket, 10);
    const beforeTravel = Number.parseFloat(before.travel);
    const afterBothForwardValue = Number.parseFloat(afterBothForward.travel);
    const beforeBothReverseTravel = Number.parseFloat(beforeBothReverse.travel);
    const afterBothReverseValue = Number.parseFloat(afterBothReverse.travel);
    const soilBeforeValue = soilBefore.result.value;
    const soilDigValue = soilDig.result.value;
    const soilAfterDigValue = soilAfterDig.result.value;
    const soilDumpValue = soilDump.result.value;
    const soilAfterDumpValue = soilAfterDump.result.value;
    const playableDigValue = playableDig.result.value;
    const fineGrainSettlementValue = fineGrainSettlement.result.value;
    const soilPushValue = soilPush.result.value;
    const cuttingFlowPhysicsValue = cuttingFlowPhysics.result.value;
    const bucketKinematicsValue = bucketKinematics.result.value;
    const trackPassValue = trackPass.result.value;
    const pitSinkValue = pitSink.result.value;
    const truckCollisionValue = truckCollision.result.value;
    const armTruckCollisionValue = armTruckCollision.result.value;
    const armSubsoilResistanceValue = armSubsoilResistance.result.value;
    const armWorldObjectPhysicsValue = armWorldObjectPhysics.result.value;
    const truckLoadPhysicsValue = truckLoadPhysics.result.value;
    const terrainMaterialPhysicsValue = terrainMaterialPhysics.result.value;
    const roughTrackValue = roughTrack.result.value;
    const worldObjectPhysicsValue = worldObjectPhysics.result.value;
    const mapDiversityValue = mapDiversity.result.value;
    const mobileUiValue = mobileUi.result.value;
    const mobileMenuUiValue = mobileMenuUi.result.value;
    const mobileBeforeLeftStick = Number.parseInt(mobileBeforeLeft.stick, 10);
    const mobileLeftStick = Number.parseInt(mobileLeft.state.stick, 10);
    const mobileBeforeRightBucket = Number.parseInt(mobileBeforeRight.bucket, 10);
    const mobileRightBucket = Number.parseInt(mobileRight.state.bucket, 10);
    const mobileBeforeForwardTravel = Number.parseFloat(mobileBeforeForward.travel);
    const mobileForwardTravel = Number.parseFloat(mobileForward.state.travel);
    const mobileBeforeReverseTravel = Number.parseFloat(mobileBeforeReverse.travel);
    const mobileReverseTravel = Number.parseFloat(mobileReverse.state.travel);
    const peakPressure = Math.max(
      afterSwing.pressure,
      afterBoom.pressure,
      afterStick.pressure,
      afterBucket.pressure,
      afterLeftForward.pressure,
      afterRightForward.pressure,
      afterBothForward.pressure,
      afterLeftReverse.pressure,
      afterRightReverse.pressure,
      afterBothReverse.pressure,
      after.pressure,
    );

    const checks = [
      ["title", before.title === "Excavator Web Simulator"],
      ["canvas", before.canvasWidth > 0 && before.canvasHeight > 0],
      [
        "fps",
        afterSwing.fps > 0 ||
          afterBoom.fps > 0 ||
          afterStick.fps > 0 ||
          afterBucket.fps > 0 ||
          afterLeftForward.fps > 0 ||
          afterRightForward.fps > 0 ||
          afterBothForward.fps > 0 ||
          afterLeftReverse.fps > 0 ||
          afterRightReverse.fps > 0 ||
          afterBothReverse.fps > 0 ||
          after.fps > 0,
      ],
      ["pressure", peakPressure > before.pressure],
      ["left stick D reverses swing", Number.isFinite(beforeSwing) && Number.isFinite(afterSwingValue) && afterSwingValue < beforeSwing],
      ["right stick up/down boom", Number.isFinite(beforeBoom) && Number.isFinite(afterBoomValue) && afterBoomValue !== beforeBoom],
      ["left stick W/S stick", Number.isFinite(beforeStick) && Number.isFinite(afterStickValue) && afterStickValue !== beforeStick],
      ["left arrow scoops bucket toward machine", Number.isFinite(beforeBucket) && Number.isFinite(afterBucketValue) && afterBucketValue < beforeBucket],
      [
        "G left track forward",
        afterLeftForward.travelDirection === "좌피벗" || afterLeftForward.travelDirection === "전진 선회",
      ],
      [
        "H right track forward",
        afterRightForward.travelDirection === "우피벗" || afterRightForward.travelDirection === "전진 선회",
      ],
      [
        "G/H both tracks forward",
        Number.isFinite(beforeTravel) &&
          Number.isFinite(afterBothForwardValue) &&
          afterBothForwardValue > beforeTravel &&
          afterBothForward.travelDirection === "전진",
      ],
      [
        "B left track reverse",
        afterLeftReverse.travelDirection === "우피벗" || afterLeftReverse.travelDirection === "후진 선회",
      ],
      [
        "N right track reverse",
        afterRightReverse.travelDirection === "좌피벗" || afterRightReverse.travelDirection === "후진 선회",
      ],
      [
        "B/N both tracks reverse",
        Number.isFinite(beforeBothReverseTravel) &&
          Number.isFinite(afterBothReverseValue) &&
          afterBothReverseValue > beforeBothReverseTravel &&
          afterBothReverse.travelDirection === "후진",
      ],
      ["soil debug api", Boolean(soilBeforeValue && soilDigValue && soilDumpValue)],
      [
        "bucket cut removes visible terrain",
        soilDigValue?.removed > 0.02 && soilDigValue.afterHeight < soilDigValue.beforeHeight - 0.015,
      ],
      [
        "digging emits fine soil grains",
        (soilAfterDigValue?.fineGrainCount ?? 0) >= 1 &&
          (soilAfterDigValue?.activeFineGrainVolume ?? 0) + (soilAfterDigValue?.settledFineGrainVolume ?? 0) > 0.01,
      ],
      [
        "removed soil is conserved across bucket and fine grains",
        Math.abs(
          (soilAfterDigValue?.bucketLoad ?? 0) +
            (soilAfterDigValue?.activeFineGrainVolume ?? 0) +
            (soilAfterDigValue?.settledFineGrainVolume ?? 0) -
            (soilDigValue?.removed ?? -1),
        ) < 0.003,
      ],
      [
        "bucket load surface fills after digging",
        soilAfterDigValue?.bucketVisualLoad > 0.05 && soilAfterDigValue?.bucketVisualLoad < 1,
      ],
      [
        "playable bucket cuts soil through resistance",
        playableDigValue?.removed > 0.015 &&
          playableDigValue?.afterHeight < playableDigValue?.beforeHeight - 0.008 &&
          playableDigValue?.bucketLoad > 0.015 &&
          (playableDigValue?.bucketLoad ?? 0) + (playableDigValue?.bucketTransitLoad ?? 0) > 0.01 &&
          !playableDigValue?.blocked &&
          Math.abs(playableDigValue?.velocityAfter ?? 0) > 0.25 &&
          playableDigValue?.pressure > 0.2,
      ],
      [
        "truck dump falls as physical conserved soil",
        soilDumpValue?.emitted > 0.02 &&
          soilDumpValue?.dumped > 0.02 &&
          Math.abs((soilDumpValue?.dumped ?? 0) - (soilDumpValue?.emitted ?? -1)) < 0.006 &&
          Math.abs((soilAfterDumpValue?.truckLoad ?? 0) - (soilDumpValue?.dumped ?? -1)) < 0.002 &&
          (soilAfterDumpValue?.bucketLoad ?? 1) < 0.002 &&
          soilDumpValue?.activeAfter === 0 &&
          soilDumpValue?.gravityDelta > 0.08,
      ],
      ["bucket load surface clears after dumping", (soilAfterDumpValue?.bucketVisualLoad ?? 1) < 0.01],
      [
        "fine grains settle into physical volume",
        fineGrainSettlementValue?.spawnedVolume > 0.05 &&
          Math.abs((fineGrainSettlementValue?.settledVolume ?? 0) - fineGrainSettlementValue.spawnedVolume) < 0.004 &&
          fineGrainSettlementValue?.activeAfter === 0 &&
          fineGrainSettlementValue?.terrainGain > 0.035,
      ],
      [
        "full bucket pushes soil into berms",
        soilPushValue?.displaced > 0.02 &&
          soilPushValue?.centerDrop > 0.01 &&
          soilPushValue?.bermRise > 0.003 &&
          soilPushValue?.bucketLoad > 1.5,
      ],
      [
        "cutting flow particles use physics before entering bucket",
        cuttingFlowPhysicsValue?.spawnedVolume > 0.12 &&
          cuttingFlowPhysicsValue?.capturedVolume > 0.12 &&
          Math.abs(cuttingFlowPhysicsValue?.transitRemaining ?? 1) < 0.003 &&
          cuttingFlowPhysicsValue?.gravityDelta > 0.08 &&
          cuttingFlowPhysicsValue?.activeFlowAfter === 0,
      ],
      [
        "bucket linkage and scoop geometry are coherent",
        bucketKinematicsValue?.edgeWidth > 0.86 &&
          bucketKinematicsValue?.pocketBehindEdge > 0.32 &&
          bucketKinematicsValue?.tipBelowPocket > 0.06 &&
          bucketKinematicsValue?.sideOrthogonality < 0.02 &&
          bucketKinematicsValue?.cylinderDelta > 0.08 &&
          bucketKinematicsValue?.linkSymmetry < 0.025,
      ],
      [
        "crawler tracks compact soil and raise berms",
        trackPassValue?.compacted > 0.02 &&
          trackPassValue?.rutDrop > 0.01 &&
          trackPassValue?.bermRise > 0.001 &&
          trackPassValue?.trackSoilWork > 0.02,
      ],
      [
        "excavator sinks into dug pit",
        pitSinkValue?.lowered > 0.4 &&
          pitSinkValue?.afterGround < pitSinkValue?.beforeGround - 0.22 &&
          pitSinkValue?.afterY < pitSinkValue?.beforeY - 0.16 &&
          pitSinkValue?.chassisSinkage > 0.01,
      ],
      [
        "truck collision blocks crawler body",
        truckCollisionValue?.blocked &&
          truckCollisionValue?.afterX < truckCollisionValue?.beforeX - 0.08 &&
          truckCollisionValue?.collisionCount > 0 &&
          truckCollisionValue?.pressure > 0.4,
      ],
      [
        "truck collision blocks arm and bucket joints",
        armTruckCollisionValue?.collided &&
          armTruckCollisionValue?.angleBlocked &&
          Math.abs(armTruckCollisionValue?.velocityAfter ?? 1) < 0.001 &&
          armTruckCollisionValue?.penetration > 0.02 &&
          armTruckCollisionValue?.collisionCount > 0 &&
          armTruckCollisionValue?.pressure > 0.4,
      ],
      [
        "buried arm links register pressure without input lag",
        armSubsoilResistanceValue?.resisted &&
          !armSubsoilResistanceValue?.blocked &&
          Math.abs(armSubsoilResistanceValue?.velocityAfter ?? 0) > 0.2 &&
          armSubsoilResistanceValue?.maxSubmerged > 0.22 &&
          armSubsoilResistanceValue?.averageSubmerged > 0.08 &&
          armSubsoilResistanceValue?.pressure > 0.45,
      ],
      [
        "bucket carries light and heavy world objects",
        armWorldObjectPhysicsValue?.movableHit &&
          armWorldObjectPhysicsValue?.movableTravel > 0.025 &&
          armWorldObjectPhysicsValue?.liftedObject &&
          armWorldObjectPhysicsValue?.liftHeight > 0.04 &&
          armWorldObjectPhysicsValue?.carriedMass > 0.1 &&
          armWorldObjectPhysicsValue?.heavyLifted &&
          armWorldObjectPhysicsValue?.heavyLiftHeight > 0.04 &&
          armWorldObjectPhysicsValue?.heavyCarriedMass > 1 &&
          !armWorldObjectPhysicsValue?.immovableBlocked &&
          armWorldObjectPhysicsValue?.penetration > 0.02 &&
          armWorldObjectPhysicsValue?.collisionCount > 0 &&
          armWorldObjectPhysicsValue?.pressure > 0.35,
      ],
      [
        "loaded truck sags, tilts, and compacts tire ruts",
        truckLoadPhysicsValue?.accepted > 4.5 &&
          truckLoadPhysicsValue?.loadRatio > 0.6 &&
          truckLoadPhysicsValue?.sag > 0.12 &&
          Math.abs(truckLoadPhysicsValue?.pitch ?? 0) > 0.01 &&
          Math.abs(truckLoadPhysicsValue?.roll ?? 0) > 0.01 &&
          truckLoadPhysicsValue?.compacted > 0.004 &&
          truckLoadPhysicsValue?.rutDrop > 0.0015 &&
          truckLoadPhysicsValue?.bodyYDrop > 0.07,
      ],
      [
        "terrain material zones alter track and bucket physics",
        terrainMaterialPhysicsValue?.mudWetness > 0.65 &&
          terrainMaterialPhysicsValue?.mudSinkMultiplier > 1.45 &&
          terrainMaterialPhysicsValue?.mudDragMultiplier > 1.4 &&
          terrainMaterialPhysicsValue?.gravelHardpack > 0.4 &&
          terrainMaterialPhysicsValue?.gravelBucketMultiplier > 1.2 &&
          terrainMaterialPhysicsValue?.mudCompacted > terrainMaterialPhysicsValue?.dryCompacted * 1.15 &&
          terrainMaterialPhysicsValue?.mudRutDrop > terrainMaterialPhysicsValue?.dryRutDrop * 1.15 &&
          terrainMaterialPhysicsValue?.hardResistance > terrainMaterialPhysicsValue?.softResistance * 1.12,
      ],
      [
        "rough ground tilts and loads crawler tracks",
        Math.abs(roughTrackValue?.roll ?? 0) > 0.015 &&
          Math.abs(roughTrackValue?.pitch ?? 0) > 0.004 &&
          roughTrackValue?.sinkage > 0.012 &&
          roughTrackValue?.pressure > 0.1,
      ],
      [
        "visible world objects use collision physics",
        worldObjectPhysicsValue?.debrisTravel > 0.035 &&
          worldObjectPhysicsValue?.hardTravel > 0.035 &&
          worldObjectPhysicsValue?.railTravel > 0.035 &&
          worldObjectPhysicsValue?.pressure > 0.35,
      ],
      [
        "expanded map has diverse physical terrain zones",
        mapDiversityValue?.terrainSize >= 92 &&
          mapDiversityValue?.spacing < 0.46 &&
          mapDiversityValue?.heightRange > 0.35 &&
          mapDiversityValue?.materialZones >= 4 &&
          mapDiversityValue?.wetlandWetness > 0.6 &&
          mapDiversityValue?.gravelFan > 0.55 &&
          mapDiversityValue?.hardBench > 0.58 &&
          mapDiversityValue?.haulRoadCompaction > 0.62 &&
          mapDiversityValue?.roughSlope > 0.025 &&
          mapDiversityValue?.farColliderCount >= 12 &&
          mapDiversityValue?.colliderKinds >= 6,
      ],
      [
        "mobile overlay visible",
        mobileUiValue?.visible &&
          mobileUiValue?.leftReady &&
          mobileUiValue?.rightReady &&
          mobileUiValue?.driveHiddenInitially &&
          mobileUiValue?.menuReady &&
          mobileUiValue?.topbarHidden,
      ],
      [
        "mobile drive controls open from menu",
        mobileMenuUiValue?.panelOpen &&
          mobileMenuUiValue?.driveReady &&
          mobileMenuUiValue?.driveLeft <= 18 &&
          mobileMenuUiValue?.driveTop <= 92 &&
          mobileMenuUiValue?.driveWidth <= 112 &&
          mobileMenuUiValue?.driveHeight <= 80,
      ],
      [
        "mobile left joystick drives WASD axes",
        Number.isFinite(mobileBeforeLeftStick) &&
          Number.isFinite(mobileLeftStick) &&
          mobileLeftStick > mobileBeforeLeftStick &&
          mobileLeft.snapshot?.mobileAxes?.leftY > 0.5,
      ],
      [
        "mobile right joystick curls bucket",
        Number.isFinite(mobileBeforeRightBucket) &&
          Number.isFinite(mobileRightBucket) &&
          mobileRightBucket < mobileBeforeRightBucket &&
          mobileRight.snapshot?.mobileAxes?.rightX < -0.5,
      ],
      [
        "mobile FWD button drives both tracks",
        Number.isFinite(mobileBeforeForwardTravel) &&
          Number.isFinite(mobileForwardTravel) &&
          (mobileForwardTravel > mobileBeforeForwardTravel || mobileForward.snapshot?.trackSoilWork > 0.02) &&
          mobileForward.snapshot?.mobileAxes?.leftTrack > 0.8 &&
          mobileForward.snapshot?.mobileAxes?.rightTrack > 0.8,
      ],
      [
        "mobile REV button drives both tracks backward",
        Number.isFinite(mobileBeforeReverseTravel) &&
          Number.isFinite(mobileReverseTravel) &&
          (mobileReverseTravel > mobileBeforeReverseTravel || mobileReverse.snapshot?.trackSoilWork > 0.02) &&
          mobileReverse.snapshot?.mobileAxes?.leftTrack < -0.8 &&
          mobileReverse.snapshot?.mobileAxes?.rightTrack < -0.8,
      ],
      [
        "mobile canvas drag orbits camera",
        Math.abs((orbitAfter?.orbit?.azimuth ?? 0) - (orbitBefore?.orbit?.azimuth ?? 0)) > 0.08 ||
          Math.abs((orbitAfter?.orbit?.elevation ?? 0) - (orbitBefore?.orbit?.elevation ?? 0)) > 0.04,
      ],
      ["runtime errors", errors.length === 0],
    ];

    const failed = checks.filter(([, ok]) => !ok);
    console.log(
      JSON.stringify(
        {
          before,
          afterSwing,
          afterBoom,
          afterStick,
          afterBucket,
          afterLeftForward,
          afterRightForward,
          afterBothForward,
          beforeReverse,
          afterLeftReverse,
          afterRightReverse,
          beforeBothReverse,
          afterBothReverse,
          soilBefore: soilBeforeValue,
          soilDig: soilDigValue,
          soilAfterDig: soilAfterDigValue,
          soilDump: soilDumpValue,
          soilAfterDump: soilAfterDumpValue,
          playableDig: playableDigValue,
          fineGrainSettlement: fineGrainSettlementValue,
          soilPush: soilPushValue,
          cuttingFlowPhysics: cuttingFlowPhysicsValue,
          bucketKinematics: bucketKinematicsValue,
          trackPass: trackPassValue,
          pitSink: pitSinkValue,
          truckCollision: truckCollisionValue,
          armTruckCollision: armTruckCollisionValue,
          armSubsoilResistance: armSubsoilResistanceValue,
          armWorldObjectPhysics: armWorldObjectPhysicsValue,
          truckLoadPhysics: truckLoadPhysicsValue,
          terrainMaterialPhysics: terrainMaterialPhysicsValue,
          roughTrack: roughTrackValue,
          worldObjectPhysics: worldObjectPhysicsValue,
          mapDiversity: mapDiversityValue,
          mobileUi: mobileUiValue,
          mobileMenuUi: mobileMenuUiValue,
          mobileBeforeLeft,
          mobileLeft,
          mobileBeforeRight,
          mobileRight,
          mobileBeforeForward,
          mobileForward,
          mobileBeforeReverse,
          mobileReverse,
          orbitBefore,
          orbitAfter,
          after,
          screenshotPath,
          checks,
          errors,
        },
        null,
        2,
      ),
    );

    cdp.close();
    if (failed.length > 0) {
      throw new Error(`Smoke checks failed: ${failed.map(([name]) => name).join(", ")}`);
    }
  } finally {
    chrome.kill();
  }
}

main().catch((error) => {
  chrome.kill();
  console.error(error);
  process.exit(1);
});
