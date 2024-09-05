import React from "react";
import "./Table.css";
import { Link } from "react-router-dom";

function Aigame() {
  const [winner, setwinner] = React.useState("No winner");
  const [turn, setturn] = React.useState("X");

  const localboard = `---------`;

  if (!localStorage.getItem("AIboard")) {
    localStorage.setItem("AIboard", localboard);
  }

  function check_winner(AIboard) {
    const winningCombinations = [
      // Rows
      [AIboard[0][0], AIboard[0][1], AIboard[0][2]],
      [AIboard[1][0], AIboard[1][1], AIboard[1][2]],
      [AIboard[2][0], AIboard[2][1], AIboard[2][2]],
      // Columns
      [AIboard[0][0], AIboard[1][0], AIboard[2][0]],
      [AIboard[0][1], AIboard[1][1], AIboard[2][1]],
      [AIboard[0][2], AIboard[1][2], AIboard[2][2]],
      // Diagonals
      [AIboard[0][0], AIboard[1][1], AIboard[2][2]],
      [AIboard[0][2], AIboard[1][1], AIboard[2][0]],
    ];

    for (let combo of winningCombinations) {
      if (combo[0] !== "-" && combo[0] === combo[1] && combo[1] === combo[2]) {
        return combo[0];
      }
    }
    return AIboard.flat().includes("-") ? null : "tie";
  }

  const [board, setboard] = React.useState({
    0: "-",
    1: "-",
    2: "-",
    3: "-",
    4: "-",
    5: "-",
    6: "-",
    7: "-",
    8: "-",
  });

  function minimax(new_board, isMaximizing) {
    let scores = {
      X: -1,
      O: 1,
      tie: 0,
    };
    let result = check_winner(new_board);
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let best_score = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (new_board[i][j] === "-") {
            new_board[i][j] = "O";
            let score = minimax(new_board, false);
            new_board[i][j] = "-";
            best_score = Math.max(score, best_score);
          }
        }
      }
      return best_score;
    } else {
      let best_score = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (new_board[i][j] === "-") {
            new_board[i][j] = "X";
            let score = minimax(new_board, true);
            new_board[i][j] = "-";
            best_score = Math.min(score, best_score);
          }
        }
      }
      return best_score;
    }
  }

  function bestMove(AIboard) {
    let move;
    let best_score = -Infinity;
    console.log("This function has been called");
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (AIboard[i][j] === "-") {
          AIboard[i][j] = "O";
          let score = minimax(AIboard, false);
          AIboard[i][j] = "-";
          if (score > best_score) {
            best_score = score;
            console.log("i and j from best move function 👋: ", i, j);
            move = { i, j };
          }
        }
      }
    }
    return move;
  }

  function handleEvent(e, f, g) {
    if (board[e] === "-" && winner === "No winner" && turn === "X") {
      setboard((prevstate) => ({ ...prevstate, [e]: "X" }));
      let flag = Array.from(localStorage.getItem("AIboard"));
      let AIboard = [];
      while (flag.length) AIboard.push(flag.splice(0, 3));
      console.log(AIboard);
      AIboard[f][g] = "X";
      localStorage.setItem("AIboard", AIboard.join("").split(",").join(""));

      // Minimax function
      console.log("Before minmax: ", AIboard);
      let ai_move = bestMove(AIboard);
      if (ai_move) {
        AIboard[ai_move.i][ai_move.j] = "O";        
        localStorage.setItem("AIboard", AIboard.join("").split(",").join(""));
        // localStorage.setItem("AIboard", AIboard);
        console.log("After minimaxing: ", AIboard, ai_move.i, ai_move.j);
        setboard((prevstate) => ({
          ...prevstate,
          [ai_move.i * 3 + ai_move.j]: "O",
        }));
      }
    }
  }

  // Check for winners

  React.useEffect(() => {
    if (
      board["0"] === board["1"] &&
      board["1"] === board["2"] &&
      board["2"] !== "-"
    ) {
      setwinner(board["0"]);
    } else if (
      board["3"] === board["4"] &&
      board["4"] === board["5"] &&
      board["5"] !== "-"
    ) {
      setwinner(board["3"]);
    } else if (
      board["6"] === board["7"] &&
      board["7"] === board["8"] &&
      board["8"] !== "-"
    ) {
      setwinner(board["6"]);
    } else if (
      board["0"] === board["3"] &&
      board["3"] === board["6"] &&
      board["6"] !== "-"
    ) {
      setwinner(board["0"]);
    } else if (
      board["1"] === board["4"] &&
      board["4"] === board["7"] &&
      board["7"] !== "-"
    ) {
      setwinner(board["1"]);
    } else if (
      board["2"] === board["5"] &&
      board["5"] === board["8"] &&
      board["8"] !== "-"
    ) {
      setwinner(board["2"]);
    } else if (
      board["0"] === board["4"] &&
      board["4"] === board["8"] &&
      board["8"] !== "-"
    ) {
      setwinner(board["0"]);
    } else if (
      board["2"] === board["4"] &&
      board["4"] === board["6"] &&
      board["6"] !== "-"
    ) {
      setwinner(board["2"]);
    }
  }, [board]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          fontSize: "1.4rem",
        }}
      >
        You are playing as X
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "-16px",
        }}
      >
        <button>
          <Link to="/">Go back</Link>
        </button>
        <button
          style={{
            color: "red",
          }}
          onClick={() => {
            setwinner("No winner");
            setboard({
              0: "-",
              1: "-",
              2: "-",
              3: "-",
              4: "-",
              5: "-",
              6: "-",
              7: "-",
              8: "-",
            });
            setturn("X");
            localStorage.setItem("AIboard", localboard);
          }}
        >
          Reset
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "25px",
          color: "green",
        }}
      >
        {winner && winner !== "No winner" ? `${winner} won!` : "No one won!"}
      </div>

      <table>
        <tbody>
          <tr>
            <td
              onClick={() => {
                handleEvent(0, 0, 0);
              }}
            >
              {" "}
              {board["0"]}{" "}
            </td>
            <td
              onClick={() => {
                handleEvent(1, 0, 1);
              }}
            >
              {" "}
              {board["1"]}{" "}
            </td>
            <td
              onClick={() => {
                handleEvent(2, 0, 2);
              }}
            >
              {" "}
              {board["2"]}{" "}
            </td>
          </tr>
          <tr>
            <td
              onClick={() => {
                handleEvent(3, 1, 0);
              }}
            >
              {" "}
              {board["3"]}{" "}
            </td>
            <td
              onClick={() => {
                handleEvent(4, 1, 1);
              }}
            >
              {" "}
              {board["4"]}{" "}
            </td>
            <td
              onClick={() => {
                handleEvent(5, 1, 2);
              }}
            >
              {" "}
              {board["5"]}{" "}
            </td>
          </tr>
          <tr>
            <td
              onClick={() => {
                handleEvent(6, 2, 0);
              }}
            >
              {" "}
              {board["6"]}{" "}
            </td>
            <td
              onClick={() => {
                handleEvent(7, 2, 1);
              }}
            >
              {" "}
              {board["7"]}{" "}
            </td>
            <td
              onClick={() => {
                handleEvent(8, 2, 2);
              }}
            >
              {" "}
              {board["8"]}{" "}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Aigame;
