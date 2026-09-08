# Soil support and flowing discharge (September 2026)

## Problems corrected

The previous track rut depth included a constant per frame, with no accumulated
compression limit. Wet tracks also excavated a second rut outside the compression
model. Support heavily weighted the lowest part of each footprint, then subtracted
additional sinkage proportional to the depth of previously excavated ground.
These terms compounded, so a machine could keep burying itself. Displaced rut
soil was concentrated at two points instead of along the track edges.

Bucket dumping previously predicted a ballistic landing point and immediately
added the entire released volume there. There was no airborne volume or visible
flight. A 2% visual cutoff could also erase the shape of residual bucket contents.

## Physical basis and implementation

* **Bearing:** average pressure is normal force / bearing area. The Bekker–Wong
  relation is `p = (kc / b + kphi) z^n`. The implementation uses kPa and metres,
  a nominal 20,000 kg machine, 1,700 kg/m³ bulk soil, two 3.65 × 0.5 m tracks,
  and `n = 1.1`. Moduli and moisture adjustments are explicitly tuned for this
  simulator, not measured for a particular excavator or site. The JPL/Aarhus
  ROAMS study explains the relation and the need for measured soil parameters:
  [Balling et al., GVSETS 2019, pp. 3–4](https://dartslab.jpl.nasa.gov/References/pdf/2019-cdt-ndtv.pdf).
* **Finite compression:** a separate per-cell compression history approaches a
  material-dependent 2.5–22 cm limit exponentially. Demand scales with elapsed
  time; extra passes cannot repeatedly remove the same pore space. Permanent
  displacement is already represented by terrain height. Only 18% of the
  equilibrium bearing sinkage is used as recoverable chassis deflection.
  Excavation remains independent of this compression budget. The upper bearing
  portion of each track footprint bridges small holes while a fully excavated
  footprint can still descend. Side berms are distributed along the track.
* **Cutting resistance:** soil strength follows a simplified effective-stress
  form, `tau = cohesion + normalStress * tan(frictionAngle)`. Inward arm travel
  slows with soil strength; lifting out remains possible. Cutting gets a larger
  available-force scale. Non-cutting vertical plunges stop after shallow
  penetration, even for small frame increments. See
  [USACE, Soil Forces](https://www.hec.usace.army.mil/confluence/rasdocs/rassed1d/1d-sediment-transport-technical-reference-manual/bstem-technical-reference-manual/bank-failure/layer-method/soil-forces).
* **Discharge:** gravity must overcome floor friction, or point away from an
  inverted bucket floor. A bounded rate empties the load over time. Released
  volume stays in moving packets, accelerated by 9.81 m/s², and is deposited only
  on contact. Truck overflow travels across the rim before falling. Terrain
  contacts lose tangential speed through friction; steep surfaces permit sliding.
  Local slope relaxation forms a pile. Static friction is necessary for finite
  stable granular slopes, and the maximum stable slope and repose angle need not
  coincide: [Lee & Herrmann, Angle of Repose and Angle of Marginal Stability](https://arxiv.org/abs/cond-mat/9211016).

## Performance and validation

The stream has at most 384 volume-carrying packets, represented by 3,072 small
instanced grains in one draw call. Its capacity applies backpressure at the
bucket; it never discards or instantly lands overflow packets. Pairwise particle
collisions are not needed. Gravity integrates analytically between contacts;
collision substeps are at most 1/60 second. Reset clears the stream and terrain
compression state. `snapshot().airborneDumpVolume` reports dumped soil in flight.

`npm test` checks load/area/material response, ten-minute compression saturation,
30/60/120 Hz agreement, granular flow thresholds, ballistic timing, volume
conservation and full-pool behavior. `npm run smoke` also exercises the real
heightfield, bucket discharge, truck catching and overflow. `SMOKE_SOIL_ONLY=1`
runs the soil scenarios and saves four rendered flow frames. The old direct
ballistic-deposit helper remains only for isolated landing-math diagnostics;
normal bucket dumping always uses the stream.

## Limits

This remains a calibrated real-time approximation, not geotechnical engineering
software or a full DEM/MPM solver. Heightfields cannot form undercuts or caves.
The stream collides with terrain and the truck bed, not every individual twig,
rock or machine surface. Grain visuals represent groups of material; compaction
changes bulk volume, while the discharge tests conserve transported bulk volume.
Soil history is reset with the scene; excavation does not automatically turn a
cell into fresh loose fill. Friction and repose share the existing 34° gameplay
baseline, rather than claiming they are universally identical soil properties.
