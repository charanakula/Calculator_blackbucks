import React, { useState, useEffect } from 'react';
import Display from './Display';
import Button from './Button';
import '../styles/styles.css';
import axios from 'axios';
import Modal from './Modal';

const Calculator = () => {
  const [currentInput, setCurrentInput] = useState('0');
  const [previousInput, setPreviousInput] = useState(null);
  const [operation, setOperation] = useState(null);
  const [history, setHistory] = useState([]); // State to store history
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    fetchHistory(); // Fetch history on component mount
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/history'); // Use axios.get for fetching
      const data = response.data;
      setHistory(data.history); // Assuming history data is in an array named 'history'
      setShowHistoryModal(true); // Open history modal after fetching
    } catch (error) {
      console.error(error); // Handle errors
    }
  };

  const handleClick = (value) => {
    if (value === 'history') {
      fetchHistory(); // Fetch history when history button is clicked
      return; // Exit the function after handling history button
    }

    if (value === 'delete') {
      handleDelete(); // Call delete function if value is 'delete'
      return; // Exit the function after handling delete button
    }

    if (isNaN(value)) { // Check if it's an operation symbol
      setOperation(value);
      setCurrentInput(currentInput === '0' ? value : currentInput); // Set operation symbol or keep current input if not 0
    } else if (operation === null) {
      setCurrentInput(currentInput === '0' ? value : currentInput + value); // Handle number input before operation
    } else {
      setPreviousInput(currentInput);
      setCurrentInput(value);
    }

    // Add a temporary press effect (optional)
    const button = document.querySelector(`button[value="${value}"]`);
    if (button) {
      button.classList.add('pressed');
      setTimeout(() => button.classList.remove('pressed'), 100); // Remove after 100ms
    }
  };

  const handleEqual = () => {
    if (operation !== null && previousInput !== null) {
      const prev = parseFloat(previousInput);
      const curr = parseFloat(currentInput);
      let result;
      switch (operation) {
        case '+':
          result = prev + curr;
          break;
        case '-':
          result = prev - curr;
          break;
        case '*':
          result = prev * curr;
          break;
        case '/':
          if (curr === 0) {
            result = 'Error'; // Handle division by zero
          } else {
            result = prev / curr;
          }
          break;
        default:
          break;
      }
      setOperation(null);
      setPreviousInput(null);
      setCurrentInput(result.toString());

      // Update history after calculation
      const newHistory = { expression: `${previousInput} ${operation} ${currentInput}`, result };
      setHistory([...history, newHistory]);
      sendHistory(newHistory); // Send history to backend for storage (optional)
    }
  };

  const sendHistory = async (historyData) => {
    try {
      const response = await fetch('http://localhost:5000/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyData),
      });
      if (!response.ok) {
        console.error('Error sending history:', await response.text());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    if (currentInput.length > 1) {
      setCurrentInput(currentInput.slice(0, -1)); // Remove the last character
    } else {
      setCurrentInput('0'); // Reset to '0' if only one character is left
    }
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false); // Close history modal
  };

  return (
    <div className="App">
      <Display value={currentInput} />
      <div className="button-container">
        <Button value="7" onClick={handleClick} />
        <Button value="8" onClick={handleClick} />
        <Button value="9" onClick={handleClick} />
        <Button value="/" onClick={handleClick} className="operation" />
        <Button value="4" onClick={handleClick} />
        <Button value="5" onClick={handleClick} />
        <Button value="6" onClick={handleClick} />
        <Button value="*" onClick={handleClick} className="operation" />
        <Button value="1" onClick={handleClick} />
        <Button value="2" onClick={handleClick} />
        <Button value="3" onClick={handleClick} />
        <Button value="-" onClick={handleClick} className="operation" />
        <Button value="0" onClick={handleClick} />
        <Button value="." onClick={handleClick} /> {/* Add decimal button */}
        <Button value="=" onClick={handleEqual} />
        <Button value="AC" onClick={() => setCurrentInput('0')} /> {/* Clear button */}
        <Button value="del" onClick={handleClick} /> {/* Delete button */}
        <Button value="hist" onClick={fetchHistory} /> {/* Fetch history on click */}
      </div>
      {showHistoryModal && (
        <Modal onClose={closeHistoryModal}>
          <h2>History</h2>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                {entry.expression} = {entry.result}
              </li>
            ))}
          </ul>
          <p>Last Result: {currentInput}</p> 
        </Modal>
      )}
    </div>
  );
};

export default Calculator;
