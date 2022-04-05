import React, { Component } from 'react'
import Board from './Board'
import './_game.css'

export default class GameClass extends Component {
	constructor(props) {
		super(props)
		this.state = {
		   xIsNext: true,
		   stepNumber: 0,
		   squares: Array(9).fill(null)
		}
	}

	handleClick(i){
		const squares = this.state.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
		squares: squares,
		xIsNext: !this.state.xIsNext,
		}, function () {
			console.log(this.state.squares)
		});
	}

	render() {
		const winner = calculateWinner(this.state.squares);
		let status;
		if (winner) {
			status = 'Winner: ' + winner.player;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}
		return (
			<div className='game'>
				<div className="game-board">
					<span className='status'>{status}</span>
					<Board
						winningSquares={winner ? winner.line : []}
						handleClick={(i)=>this.handleClick(i)}
						squares={this.state.squares}
					/>
				</div>
			</div>
		)
	}
}

function calculateWinner(squares) {
	const lines = [
	  [0, 1, 2],
	  [3, 4, 5],
	  [6, 7, 8],
	  [0, 3, 6],
	  [1, 4, 7],
	  [2, 5, 8],
	  [0, 4, 8],
	  [2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
	  const [a, b, c] = lines[i];
	  if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
		// return squares[a];
		return { player: squares[a], line: [a, b, c] };
	  }
	}
	return null;
  }