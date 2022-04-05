import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router';
import io from "socket.io-client";
import BoardFunction from "./BoardFunction";

const socket = io("ws://localhost:4000");
// const socket_client = new WebSocket('wss://chat-server-spring.herokuapp.com/chat');


function GameFunction() {
  const [game, setGame] = useState(Array(9).fill(''));
  const [turnNumber, setTurnNumber] = useState(0);
  const [myTurn, setMyTurn] = useState(true);
  const [winner, setWinner] = useState(false);
  const [winnerLine, setWinnerLine] = useState([]);

  const [xo, setXO] = useState('X');
  const [player, setPlayer] = useState('');
  const [hasOpponent, setHasOpponent] = useState(false);
  const [share, setShare] = useState(false);

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
    setMyTurn(false);
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
    winning_combinations.forEach((c) => {
      if (game[c[0]] === game[c[1]] && game[c[0]] === game[c[2]] && game[c[0]] !== '') {
        setWinner(true);
        setWinnerLine(c)
        console.log(c)
      }
    });

    if (turnNumber === 0) {
      setMyTurn(xo === 'X' ? true : false);
    }
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
      setXO('O');
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


  return (
    <div className="game-board">

      <div className="room_invite"> 
        Room: {room} 
        <button className="btn" onClick={() => setShare(!share)}>
          {share ? "Nascondi link" : "Mostra link" }
        </button>
      </div>

      {share ? (<p>{`${window.location.href}?room=${room}`}</p> ) : null}

      <p>
        {hasOpponent ? 
          <> Prossima mossa: {myTurn ? <b>Tu</b> : 'Avversario'} </> : 'In attesa di avversario...'}
      </p>

      <BoardFunction game={game} sendTurn={sendTurn} winnerLine={winnerLine}/>

      <p>
        {winner ? <span>We have a winner: {player}</span> : turnNumber === 9 ? <span>It's a tie!</span> : <br />}
      </p>

      {winner || turnNumber === 9 ? (
        <button className="restart" onClick={sendRestart}> Restart </button>
      ) : null}

    </div>
  );
}

export default GameFunction;
