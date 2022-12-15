import React, { useState, useReducer } from "react";
import Board from "./Board";

const reducer = (state, action) => {
  switch (action.type) {
    case "JUMP":
      return {
        ...state,
        xIsNext: action.payload.step % 2 === 0,
        history: state.history.slice(0, action.payload.step + 1),
      };
    case "MOVE":
      return {
        ...state,
        history: state.history.concat({
          squares: action.payload.squares,
        }),
        xIsNext: !state.xIsNext,
      };  
      case "SETOPLAYER":
        return {
          ...state,
          xIsNext: false, 
        };  
    default:
      return state;
  }
};

export default function Game() {
  const [state, dispatch] = useReducer(reducer, {
    xIsNext:true,
    history: [{ squares: Array(9).fill(null) }],
  });
  const { xIsNext, history } = state;
  const [cover, setCover] = useState(true);
  const [player, setPlayer] = useState("");
  const [match, setMatch] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [loading, setLoading] = useState(true);

  function launchToast() {
    var x = document.getElementById("toast");
    x.className = "show";
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 5000);
  }

  const handleClick = () => {
    setMatch(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    launchToast();
  };

  const jumpTo = (step) => { 
    dispatch({ type: "JUMP", payload: { step } });
  };
  const handleMove = (i) => {
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    dispatch({ type: "MOVE", payload: { squares } });
  };  
  const setOPlayer=()=> {
    setPlayer("O")
    dispatch({ type: "SETOPLAYER"}); 
    console.log(player,'here dispatch')

  }

  const current = history[history.length - 1];
  const winner = calculateWinner(current.squares);
  const status = winner
    ? winner === "D"
      ? "Draw"
      :   winner + " WINS! "
    : `${xIsNext ? "X" : "O"}'S TURN!`; 

  const moves = history.map((step, move) => {
    const desc = "PLAY AGAIN"; 
    if(!move){
        return (
            <button  className="match-button" onClick={() => jumpTo(move)}>{desc}</button>
        );
    } return(
        <div></div>
    )
  });

  return (
    <div>
      {cover ? (
        <div>
          <div className="btn-start" onClick={() => setCover(false)}>
            {"tik tak toe XO"}
          </div>
        </div>
      ) : (
        <div>
          {player === "" || match === false ? (
            <div className="homescreen">
              <div className="header">WELCOME</div>
              <div className="pick-player">PICK YOUR PLAYER</div>
              <div type="button" onClick={() => setActiveId("one")}>
                <div onClick={() => setPlayer("X")} className="x">
                  X
                </div>
                <div
                  className={
                    activeId === "one" ? `rectangle1${activeId}` : "rectangle1"
                  }
                ></div>
              </div>
              <div type="button" onClick={() => setActiveId("two")}>
                <div onClick={() => setOPlayer()}  className="o">
                  O
                </div>
                <div
                  className={
                    activeId === "two" ? `rectangle2${activeId}` : "rectangle2"
                  }
                ></div>
              </div>
              <button onClick={handleClick} className="match-button">
                MATCH ME WITH MY OPPONENT
              </button>
            </div>
          ) : (
            <div>
              {!loading ? (
                <div className={winner ? "game disabled" : "game"}>
                  <div className="pick-player">{status}</div>

                  {/* <div id="toast">NOW IN GAME</div> */}
                  <div className="game-board">
                    <Board
                      onClick={(i) => handleMove(i)}
                      squares={current.squares}
                    ></Board>
                  </div>
                  <div className="game-info">
                    {winner? moves: null}
                  </div> 
                  {/* <button onClick={()=>console.log('first button')} className="match-button">
                PLAY AGAIN
              </button>
              <button onClick={()=>console.log('2nd button')} className="match-button">
                SEE RECORD
              </button> */}
                </div>
              ) : (
                <div>
                  <div className="pick-player">
                    Waiting to find your opponent...
                  </div>
                  <div className="x">X</div>
                  <div className="o">O</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
const calculateWinner = (squares) => {
  const winnerLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let isDraw = true;
  for (let i = 0; i < winnerLines.length; i++) {
    const [a, b, c] = winnerLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) { 
        console.log(squares[a].setActiveId,squares[b],squares[c],'LOKOKDANSKJDBAKSJDBWEQB')
      return squares[a]; 
    }
    if (!squares[a] || !squares[b] || !squares[c]) {
      isDraw = false;
    }
  }
  if (isDraw) return "D";
  return null;
};
