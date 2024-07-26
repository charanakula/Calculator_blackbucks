import React from 'react';

const Button = ({ value, onClick }) => {
  return (
    <button className="button" onClick={() => onClick(value)}>
      {value}
    </button>
  );
};

export default Button;
