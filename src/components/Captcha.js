import React, { useState, useEffect } from "react";

function Captcha({ onVerify }) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [input, setInput] = useState("");

  useEffect(() => {
    generate();
  }, []);

  const generate = () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    setA(x);
    setB(y);
  };

  const verify = () => {
    if (parseInt(input) === a + b) {
      alert("Captcha Verified");
      onVerify(true);
    } else {
      alert("Wrong Captcha");
      generate();
    }
  };

  return (
    <div>
      <p>{a} + {b} = ?</p>
      <input onChange={(e) => setInput(e.target.value)} />
      <button onClick={verify}>Verify</button>
    </div>
  );
}

export default Captcha;