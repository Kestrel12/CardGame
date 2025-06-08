import { useState, useEffect } from 'react';
import { create } from 'react-modal-promise'
import type * as CSS from 'csstype';

function GameEndModal({ message, isOpen, onResolve, onReject }:
	{ message: string, isOpen: boolean, onResolve: ((c: string) => void), onReject: (() => void) }) {

	
	useEffect(() => {
		if (isOpen) { setModalStyle({ display: "block" }); }
		else { setModalStyle({ display: "none" }); }
	}, [isOpen]);
	
	return (
		<div style={{ display: "none" }} className="modal">
			<h3>
				{message}
			</h3>
			<div className="button">
				Restart
			</div>
		</div>
	);
}

export const promiseGameEnd = create(GameEndModal);