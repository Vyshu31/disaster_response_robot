# ResQ — Multi-Robot Disaster Response Dashboard

React + Vite dashboard prototype for the Cloud-Integrated Multi-Robot Disaster Response System.

## Included in this prototype
- Responsive command-center dashboard UI
- Robot fleet cards: status, battery, signal and search progress
- Illustrative disaster-zone map with robot, victim and hazard markers
- Victim and hazard event stream
- Mission progress panel
- Simulated live updates (robot marker movement and battery changes)
- Demo connection toggle and mission pause/resume controls

## Important: demo mode
This is a front-end prototype using local demonstration data. It does **not** currently connect to ROS 2, the Edge Cloud, AWS, SLAM, camera streams, or real victim/hazard detectors. The map is illustrative, not a SLAM map. Do not treat the sample robot statuses, victim detections, hazards, or battery readings as real system data.

## Requirements
- Node.js 18 or newer
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
```
The production output is written to `dist/`.

## Planned integration
1. Define a stable telemetry schema for robot ID, pose, battery, state and connectivity.
2. Add a FastAPI service at the Edge station to bridge ROS 2 topics to browser-friendly WebSocket events.
3. Replace simulated robot state with live telemetry.
4. Replace the illustrative map with the SLAM occupancy grid/map image and map metadata.
5. Connect victim and hazard events from the perception pipeline.
6. Add a local mission/event database so the dashboard remains useful without internet.
7. Add AWS IoT Core for secure cloud messaging, Amazon S3 for map/image storage, and DynamoDB for mission metadata/history.
8. Implement retryable Edge-to-AWS synchronization with acknowledgements and timestamps.

## Suggested telemetry contract
```json
{
  "robot_id": "UGV-01",
  "timestamp": "2026-11-09T10:15:00Z",
  "status": "exploring",
  "pose": { "x": 2.4, "y": 1.7, "yaw": 0.4, "frame_id": "map" },
  "battery_percent": 86,
  "search_progress_percent": 64,
  "signal": "strong"
}
```

## Add to the existing project
Place this folder under your repository as `dashboard/`:
```text
disaster_response_robot/
  dashboard/
    src/
    index.html
    package.json
    README.md
```
Then run the npm commands from inside `dashboard/`.
