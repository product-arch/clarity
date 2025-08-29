import React from 'react';
import MorphText from './components/Temp';

const App = () => {
  return (
    <>
      <div className="scroll-buffer" />
      <MorphText from="chaotic" to="clarity" />
      <div className="scroll-buffer" />
      <div style={{ color: 'red', textAlign: 'center', marginTop: '40vh' }}>
        React is Working ✅
      </div>
    </>
  );
};

export default App;
