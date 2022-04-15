import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router';
import io from "socket.io-client";
import Board from "./Board";
import './_game.css';

//const socket = io("ws://localhost:4000");
const socket = io('wss://zeroper.herokuapp.com');
//const socket = io("ws://192.168.10.79:4000");


function Game() {

  const [game, setGame] = useState(Array(9).fill(''));
  const [turnNumber, setTurnNumber] = useState(0);
  const [myTurn, setMyTurn] = useState(true);
  const [winner, setWinner] = useState(false);
  const [winnerLine, setWinnerLine] = useState([]);

  const [xo, setXO] = useState('🖤');
  const [player, setPlayer] = useState('');
  const [hasOpponent, setHasOpponent] = useState(false);
  const [share, setShare] = useState(false);
  const [invitedNumber, setInvitedNumber] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paramsRoom = params.get('room');
  const [room, setRoom] = useState(paramsRoom);

  const [turnData, setTurnData] = useState(false);

  const sendTurn = (index) => {
    if (!game[index] && !winner && myTurn && hasOpponent) {
      socket.emit('reqTurn', JSON.stringify({ index, value: xo, room }));
    }
  };

  const sendRestart = () => {
    socket.emit('reqRestart', JSON.stringify({ room }));
  };

  const restart = () => {
    setGame(Array(9).fill(''));
    setWinner(false);
    setWinnerLine([]);
    setTurnNumber(0);
  };

  const winning_combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  const random = () => {
    return Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('');
  };

  useEffect(() => {
    var line
    winning_combinations.forEach((c) => {
      if (game[c[0]] === game[c[1]] && game[c[0]] === game[c[2]] && game[c[0]] !== '') {
        setWinner(true);
        setWinnerLine(c)
        line = c
      }
    });
  }, [game, turnNumber, xo]);


  useEffect(() => {
    socket.on('playerTurn', (json) => {
      setTurnData(json);
    });

    socket.on('restart', () => {
      restart();
    });

    socket.on('opponent_joined', () => {
      setHasOpponent(true);
      setShare(false);
    });
  }, []);


  useEffect(() => {
    if (turnData) {
      const data = JSON.parse(turnData);
      let g = [...game];
      if (!g[data.index] && !winner) {
        g[data.index] = data.value;
        setGame(g);
        setTurnNumber(turnNumber + 1);
        setTurnData(false);
        setMyTurn(!myTurn);
        setPlayer(data.value);
      }
    }
  }, [turnData, game, turnNumber, winner, myTurn]);


  useEffect(() => {
    if (paramsRoom) {
      // means you are player 2
      setXO('🤍'); //0
      socket.emit('join', paramsRoom);
      setRoom(paramsRoom);
      setMyTurn(false);
    } else {
      // means you are player 1
      const newRoomName = random();
      socket.emit('create', newRoomName);
      setRoom(newRoomName);
      setMyTurn(true);
    }
  }, [paramsRoom]);

  const handleOnclickSend = () => {
    var url;
    var remotehost = "https://zeroper.netlify.com/";
    var localhost = encodeURI(window.location.href+"?room="+room);
    const isMobile = navigator.userAgentData.mobile;
    isMobile ? url = `whatsapp://send` : url = `https://web.whatsapp.com/send`
 
    url += `?text=${remotehost}?room=${room}`;
    window.open(url);
  }  

  return (
    <div className="game-board">

      <div className="room_invite"> 
        <p>Room: {room}</p>
        <button className="btn" onClick={() => handleOnclickSend()}>
          Send invite
        </button>
      </div>
      <p>
        {hasOpponent ? 
          <> Prossima mossa: {myTurn ? <b>Tu</b> : 'Avversario'} </> : 'In attesa di avversario...'}
      </p>

      <Board game={game} sendTurn={sendTurn} winnerLine={winnerLine}/>

      <p>
        {winner ? <span>We have a winner: {player}</span> : turnNumber === 9 ? <span>It's a tie!</span> : <br />}
      </p>

      {winner || turnNumber === 9 ? (
        <button className="restart" onClick={sendRestart}> Restart </button>
      ) : null}

    </div>
  );
}


//   const [game, setGame] = useState(Array(9).fill(''));
//   const [turnNumber, setTurnNumber] = useState(1);
//   const [myTurn, setMyTurn] = useState(true);
//   const [winner, setWinner] = useState(false);
//   const [winnerLine, setWinnerLine] = useState([]);
//   //const [symbols, setSymbols] = useState(['🖤', '🤍'])

//   const [nextPlayer, setNextPlayer] = useState('🖤');
//   const [player, setPlayer] = useState('');
//   const [hasOpponent, setHasOpponent] = useState(false);
//   const [share, setShare] = useState(false);

//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const paramsRoom = params.get('room');
//   const [room, setRoom] = useState(paramsRoom);

//   const [turnData, setTurnData] = useState(false);

//   const sendTurn = (index) => {
//     if (!game[index] && !winner && myTurn && hasOpponent) {
//       socket.emit('reqTurn', JSON.stringify({ index, value: nextPlayer, room }));
//     }
//   };

//   const sendRestart = () => {
//     socket.emit('reqRestart', JSON.stringify({ room }));
//   };

//   const restart = () => {
//     setGame(Array(9).fill(''));
//     setWinner(false);
//     setWinnerLine([]);
//     setTurnNumber(1);
//     setMyTurn(false);
//   };

//   const winning_combinations = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];
  
//   const random = () => {
//     return Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('');
//   };
  

//   useEffect(() => {
//     var line
//     winning_combinations.forEach((c) => {
//       if (game[c[0]] === game[c[1]] && game[c[0]] === game[c[2]] && game[c[0]] !== '') {
//         setWinner(true);
//         setWinnerLine(c)
//         line = c
//       }
//     });
//     console.log(line)
//     if (turnNumber === 0) {
//       setMyTurn(nextPlayer === '🤍' ? true : false);
//     }
//   }, [game, turnNumber, nextPlayer]);


//   useEffect(() => {
//     socket.on('playerTurn', (json) => {
//       setTurnData(json);
//     });

//     socket.on('restart', () => {
//       restart();
//     });

//     socket.on('opponent_joined', () => {
//       setHasOpponent(true);
//       setShare(false);
//     });
//   }, []);


//   useEffect(() => {
//     if (turnData) {
//       const data = JSON.parse(turnData);
//       let g = [...game];
//       if (!g[data.index] && !winner) {
//         g[data.index] = data.value;
//         setGame(g);
//         setTurnNumber(turnNumber + 1);
//         setTurnData(false);
//         setMyTurn(!myTurn);
//         setPlayer(data.value); 
//       }
//     }
//   }, [turnData, game, turnNumber, winner, myTurn]);


//   useEffect(() => {
//     if (paramsRoom) {
//       // means you are player 2
//       setNextPlayer('🤍');
//       socket.emit('join', paramsRoom);
//       setRoom(paramsRoom);
//       setMyTurn(false);
//     } else {
//       // means you are player 1
//       const newRoomName = random();
//       socket.emit('create', newRoomName);
//       setRoom(newRoomName);
//       setMyTurn(true);
//     }
//   }, [paramsRoom]);

//   const handleOnclickSend = () => {
//     var url;
//     var remotehost = "https://zeroper.netlify.com/";
//     var localhost = encodeURI(window.location.href+"?room="+room);
//     const isMobile = navigator.userAgentData.mobile;
//     isMobile ? url = `whatsapp://send` : url = `https://web.whatsapp.com/send`
 
//     url += `?text=${remotehost}?room=${room}`;
//     window.open(url);
//   }  

//   return (
//     <div className="game-board">

//       <div className="room_invite"> 
//         <p>Room: {room}</p>
//         <button className="btn" onClick={() => handleOnclickSend()}>
//           Send invite
//         </button>
//       </div>
//       <p>
//         {hasOpponent ? 
//           <> Prossima mossa: {myTurn ? <b>Tu</b> : 'Avversario'} </> : 'In attesa di avversario...'}
//       </p>

//       <Board game={game} sendTurn={sendTurn} winnerLine={winnerLine}/>

//       <p>
//         {winner ? <span>We have a winner: {player}</span> : turnNumber === 10 ? <span>It's a tie!</span> : <br />}
//       </p>

//       {winner || turnNumber === 9 ? (
//         <button className="restart" onClick={sendRestart}> Restart </button>
//       ) : null}

//     </div>
//   );
// }

export default Game;
