import { useState, useEffect } from 'react';
import { create } from 'react-modal-promise'
import type * as CSS from 'csstype';

function SuitSelectComponent({ isOpen, onResolve, onReject }:
	{isOpen: boolean, onResolve:((c: string) => void), onReject: (() => void)}) {

	const [modalStyle, setModalStyle] = useState({
		display: "none"
	} as CSS.Properties)

	useEffect(() => {
		if (isOpen) { setModalStyle({ display: "block" }); }
		else { setModalStyle({ display: "none" }); }
	}, [isOpen])



	return (
		<div style={modalStyle} className="modal">
			<h3>
				Wild Card &mdash; Pick a Suit!
			</h3>
			<div className="button" onClick={() => onResolve("hearts") }>
				<span style={{ color: "red" }}>♥</span>
			</div>
			<div className="button" onClick={() => onResolve("spades")}>
				♠
			</div>
			<div className="button" onClick={() => onResolve("diams")}>
				<span style={{ color: "red" }}>♦</span>
			</div>
			<div className="button" onClick={() => onResolve("clubs")}>
				♣
			</div>
		</div>
    );
}

export const promiseSuitSelect = create(SuitSelectComponent);