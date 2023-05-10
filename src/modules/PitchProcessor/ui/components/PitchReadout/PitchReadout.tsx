interface PitchReadoutProps { running: boolean, latestPitch: number }

export default function PitchReadout({ running, latestPitch }: PitchReadoutProps) {
  return (
    <div className="Pitch-readout">
      {latestPitch 
        ? `${latestPitch.toFixed(1)} Hz`
        : running 
          ? "Listening..."
          : "Paused"}
    </div>
  );
}
