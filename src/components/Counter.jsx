import { useState } from "react";

const Counter = () => {
  const now = new Date();
  const key = now.toISOString().split("T")[0].replace(/-/g, "");
  const [score, setScore] = useState(Number(localStorage.getItem(key)) || 0);
  const [showScore, setShowScore] = useState(true);

  return (
    <>
      {showScore && (
        <div style={{ textAlign: "center" }}>
          <div>
            <button
              onClick={() => {
                setScore(0);
              }}
            >
              Reset
            </button>
          </div>
          {`Count-> ${score}`}
        </div>
      )}
      <div>
        <button
          onClick={() => {
            setShowScore(!showScore);
          }}
        >
          {!showScore ? "Show Count" : "Hide Count"}
        </button>
      </div>
      <div
        style={{ backgroundColor: "green", height: "100vh", margin: "16px" }}
        onClick={() => {
          const curentDate = now.toISOString().split("T")[0].replace(/-/g, "");
          setScore((val) => {
            return val + 1;
          });
          localStorage.setItem(curentDate, score + 1);
        }}
      ></div>
    </>
  );
};

export default Counter;
