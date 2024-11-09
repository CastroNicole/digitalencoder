import React, { useState } from "react";
import './App.css';

function App() {
  const [data, setData] = useState('');
  const [signal, setSignal] = useState({});

  const handleDataChange = (e) => {
    setData(e.target.value);
  };

  const encodeNRZL = (data) => {
    const signal = [];
    let x = 0;
    const high = 10;
    const low = 40;

    data.split('').forEach((bit) => {
      const y = bit === '1' ? high : low;
      signal.push({ x1: x, y1: y, x2: x + 20, y2: y});
      x += 20;
    });

    return signal;
  };

  const encodeNRZI = (data) => {
    const signal = [];
    let x = 0;
    const high = 10;
    const low = 40;
    let previousLevel = low;
  
    data.split('').forEach((bit) => {
      if (bit === '1') {
        previousLevel = previousLevel === low ? high : low;
      }
      signal.push({ x1: x, y1: previousLevel, x2: x + 20, y2: previousLevel });
      x += 20;
    });
    
    return signal;
  };

  const encodeBipolarAMI = (data) => {
    const signal = [];
    let x = 0;
    const positive = 10;
    const zero = 25;
    const negative = 40;
    let lastMark = negative;
  
    data.split('').forEach((bit) => {
      if (bit === '1') {
        lastMark = (lastMark === positive) ? negative : positive;
        signal.push({ x1: x, y1: lastMark, x2: x + 20, y2: lastMark });
      } else {
        signal.push({ x1: x, y1: zero, x2: x + 20, y2: zero });
      }
      x += 20;
    });
  
    return signal;
  };

  const encodePseudoternary = (data) => {
    const signal = [];
    let x = 0;
    const positive = 10;
    const zero = 25;
    const negative = 40;
    let lastMark = negative;
  
    data.split('').forEach((bit) => {
      if (bit === '0') {
        lastMark = (lastMark === positive) ? negative : positive;
        signal.push({ x1: x, y1: lastMark, x2: x + 20, y2: lastMark });
      } else {
        signal.push({ x1: x, y1: zero, x2: x + 20, y2: zero });
      }
      x += 20;
    });
  
    return signal;
  };

  const encodeManchester = (data) => {
    const signal = [];
    let x = 0;
    const low = 10;
    const high = 40;
  
    data.split('').forEach((bit) => {
      if (bit === '1') {
        signal.push({ x1: x, y1: high, x2: x + 10, y2: high });
        signal.push({ x1: x + 10, y1: high, x2: x + 10, y2: low }); 
        signal.push({ x1: x + 10, y1: low, x2: x + 20, y2: low });
      } else {
        signal.push({ x1: x, y1: low, x2: x + 10, y2: low });
        signal.push({ x1: x + 10, y1: low, x2: x + 10, y2: high });
        signal.push({ x1: x + 10, y1: high, x2: x + 20, y2: high });
      }
      x += 20;
    });
  
    return signal;
  };

  const encodeDifferentialManchester = (data) => {
    const signal = [];
    let x = 0;
    const low = 10;
    const high = 40;
    let previousLevel = low;
  
    data.split('').forEach((bit) => {
      if (bit === '0') {
        previousLevel = previousLevel === low ? high : low;
        signal.push({ x1: x, y1: previousLevel, x2: x + 10, y2: previousLevel });
        previousLevel = previousLevel === low ? high : low; 
        signal.push({ x1: x + 10, y1: previousLevel, x2: x + 20, y2: previousLevel });
      } else {
        signal.push({ x1: x, y1: previousLevel, x2: x + 10, y2: previousLevel });
        previousLevel = previousLevel === low ? high : low;
        signal.push({ x1: x + 10, y1: previousLevel, x2: x + 20, y2: previousLevel });
      }
      x += 20;
    });
  
    return signal;
  };
  
  const visualizeSignal = () => {
    setSignal({
      NRZL: encodeNRZL(data),
      NRZI: encodeNRZI(data),
      BipolarAMI: encodeBipolarAMI(data),
      Pseudoternary: encodePseudoternary(data),
      Manchester: encodeManchester(data),
      DifferentialManchester: encodeDifferentialManchester(data)
    });
  };

  return (
    <div className="App">
      <h1>Digital Signal Encoder</h1>
      <div>
        <input
          type="text"
          value={data}
          onChange={handleDataChange}
          placeholder="Enter Digital Data (e.g., 11010101)"
        />
        <button onClick={visualizeSignal}>Visualize Signal</button>
      </div>
      <div className="signals">
        <div>
          <h2>NRZ-L</h2>
          <SignalDisplay signal={signal.NRZL} />
        </div>
        <div>
          <h2>NRZ-I</h2>
          <SignalDisplay signal={signal.NRZI} />
        </div>
        <div>
          <h2>Bipolar AMI</h2>
          <SignalDisplay signal={signal.BipolarAMI} />
        </div>
        <div>
          <h2>Pseudoternary</h2>
          <SignalDisplay signal={signal.Pseudoternary} />
        </div>
        <div>
          <h2>Manchester</h2>
          <SignalDisplay signal={signal.Manchester} />
        </div>
        <div>
          <h2>Differential Manchester</h2>
          <SignalDisplay signal={signal.DifferentialManchester} />
        </div>
      </div>
    </div>
  );
}

const SignalDisplay = ({ signal }) => {
  if (!signal) return null;

  const lines = [];
  const divisions = [];

  for (let i = 0; i < signal.length - 1; i++) {
    const { x1, y1, x2, y2 } = signal[i];
    const { y1: nextY1 } = signal[i + 1];

    if (y2 !== nextY1) {
      lines.push(
        <line
          key={`${i}-transition`}
          x1={x2}
          y1={y2}
          x2={x2}
          y2={nextY1}
          stroke="black"
          strokeWidth="2"
        />
      );
    }

    lines.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="black"
        strokeWidth="2"
      />
    );

    divisions.push(
      <line
        key={`division-${i}`}
        x1={x1}
        y1={0}
        x2={x1}
        y2={50}
        stroke="#ddd"
        strokeWidth="1"
        strokeDasharray="4"
      />
    );
  }

  const lastSegment = signal[signal.length - 1];
  lines.push(
    <line
      key={signal.length - 1}
      x1={lastSegment.x1}
      y1={lastSegment.y1}
      x2={lastSegment.x2}
      y2={lastSegment.y2}
      stroke="black"
      strokeWidth="2"
    />
  );

  divisions.push(
    <line
      key={`division-end`}
      x1={lastSegment.x2}
      y1={0}
      x2={lastSegment.x2}
      y2={50}
      stroke="#ddd"
      strokeWidth="1"
      strokeDasharray="4"
    />
  );

  return (
    <svg width="220" height="50">
      {divisions}
      {lines}
    </svg>
  );
};



export default App;
