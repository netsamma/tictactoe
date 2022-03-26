import React, { Component } from 'react'
import Square from './Square'

export default class Board extends Component {

	render() {
		return (
			<div className='board'>
				{this.renderRow(1, [0,1,2])}
				{this.renderRow(2, [3,4,5])}
				{this.renderRow(3, [6,7,8])}
			</div>
		)
  	}
	
	renderRow(row_key, indexes){
		return (
			<div key={row_key}>
				{indexes.map((value) => 
					(this.renderSquare(value))
				)} 
			</div>
		)	
	}

	renderSquare(i){
		return (
			<Square 
				key={i}
				isWinning={this.props.winningSquares.includes(i)}
				value={this.props.squares[i]}
				handleClick={() => this.props.handleClick(i)}
			/>
		)	
	}

}
