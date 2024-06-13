import React, { useState, useEffect } from 'react';
import '../../styles/Story/Credit.scss';
import UserService from '../../service/UserService';
import CreditService from '../../service/CreditService';

function Credit() {
	return (
		<section className="Mystory_container">
			<CreditInfo />
			<CreditCount />
		</section>
	);
}

function CreditCount() {
	const [amount, setAmount] = useState('');
	const [balance, setBalance] = useState(0);
	const [showInput, setShowInput] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchCurrentUser = async () => {
			try {
				const user = await UserService.getCurrentUser();
				setCurrentUser(user);
				console.log('Current user:', user);
			} catch (error) {
				console.error('Failed to fetch current user:', error);
			}
		};

		fetchCurrentUser();
	}, []);

	const handleAmountChange = (e) => {
		setAmount(e.target.value);
	};

	const handleAddCredit = async () => {
		if (isLoading) return;
		setIsLoading(true);

		try {
			if (currentUser && currentUser.mno) {
				console.log('Adding credit:', amount);
				await CreditService.addCredit(currentUser.mno, amount);
				alert('Credit added successfully!');
				setAmount('');
				const updatedBalance = await CreditService.getBalance(currentUser.mno);
				setBalance(updatedBalance);
				console.log('Updated balance:', updatedBalance);
			}
		} catch (error) {
			alert('Error adding credit');
			console.error('Error adding credit:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleInput = async () => {
		setShowInput((prev) => !prev);
		if (!showInput && currentUser && currentUser.mno) {
			try {
				const updatedBalance = await CreditService.getBalance(currentUser.mno);
				setBalance(updatedBalance);
				console.log('Fetched balance on toggle:', updatedBalance);
			} catch (error) {
				console.error('Error fetching balance:', error);
			}
		}
	};

	return (
		<div className="Credit">
			<div className="creditInfo">
				<p className="CreditSize">나의 보유금액: {balance}₩</p>
				<button className="btnstlye" type="button" onClick={toggleInput} disabled={isLoading}>
					충전하기
				</button>
			</div>
			{showInput && (
				<div className="addCredit">
					<input
						type="number"
						value={amount}
						onChange={handleAmountChange}
						placeholder="Enter amount"
						className="amountInput"
					/>
					<div className="addCreditBtn">
						{' '}
						{/* 새로운 div 추가 */}
						<button className="btnstlye2" type="button" onClick={handleAddCredit} disabled={isLoading}>
							{isLoading ? 'Adding...' : 'Add Credit'}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

function CreditInfo() {
	return (
		<div className="story storyInfo">
			<span className="story_number story_child">충전하기</span>
		</div>
	);
}

export default Credit;
