import React, { useState, useEffect } from 'react';
import './logic.css';

const Logic = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [expression, setExpression] = useState("");
    const [truthTable, setTruthTable] = useState([]);
    const allowedSymbols = ['p', 'q', 'r', 's', 't', '(', ')', '¬', '∧', '∨', '⇒', '⇔'];

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const handleButtonClick = (text) => {
        setExpression((prev) => prev + text);
    };

    const handleInputChange = (e) => {
        const input = e.target.value;
        if (input.split('').every((char) => allowedSymbols.includes(char) || char === '')) {
            setExpression(input);
        }
    };

    function getVariables(expression) {
        let variables = "";
        for (let i = 0; i < expression.length; i++) {
            let ch = expression[i];
            if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                if (!variables.includes(ch)) {
                    variables += ch;
                }
            }
        }
        return variables;
    }

    function generateTruthTable(variables) {
        const n = variables.length;
        const table = [];
        for (let i = 0; i < Math.pow(2, n); i++) {
            const row = [];
            for (let j = 0; j < n; j++) {
                const bitValue = Math.floor(i / Math.pow(2, n - 1 - j)) % 2;
                row.push(bitValue);
            }
            table.push(row);
        }
        return table;
    }

    function evaluateExpression(expression, truthValues) {
        let expr = expression;
        for (const [key, value] of Object.entries(truthValues)) {
            expr = expr.replace(new RegExp(key, 'g'), value.toString());
        }
        expr = expr.replace(/¬/g, '!');
        expr = expr.replace(/∧/g, '&&');
        expr = expr.replace(/∨/g, '||');
        expr = expr.replace(/⇒/g, '<=');
        expr = expr.replace(/⇔/g, '===');
        expr = expr.replace(/⊕/g, '^');
        return eval(expr);
    }

    const generateTruthTableWithResults = () => {
        const variables = getVariables(expression);
        const table = generateTruthTable(variables);
        const results = table.map(row => {
            const truthValues = {};
            for (let i = 0; i < row.length; i++) {
                truthValues[variables[i]] = row[i];
            }
            const result = evaluateExpression(expression, truthValues);
            return [...row, result ? 1 : 0];
        });
        setTruthTable({ variables, results });
    };

    return (
        <div>
            <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
                <h1>Genarate a Truth Table</h1>
                <p className="description">Create and explore truth tables for your logical expressions.</p>

                <div className="field">
                    <label htmlFor="expression" className={`ex ${isDarkMode ? 'dark-mode' : ''}`}>Expression</label>
                    <input
                        type="text"
                        className={`expression ${isDarkMode ? 'dark-mode' : ''}`}
                        placeholder="Enter the logical expression"
                        value={expression}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="keyboard">
                    {allowedSymbols.map((symbol) => (
                        <button
                            key={symbol}
                            className={`button ${isDarkMode ? 'dark' : ''}`}
                            onClick={() => handleButtonClick(symbol)}
                        >
                            {symbol}
                        </button>

                    ))}
                    <button className={`button ${isDarkMode ? 'dark' : ''}`} onClick={() => setExpression('')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" aria-hidden="true"><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg>

                    </button>

                </div>

                <button className={`button ${isDarkMode ? 'dark' : ''}`} onClick={generateTruthTableWithResults}>Generate</button>
                <button className={`button ${isDarkMode ? 'dark' : ''}`} onClick={toggleTheme}>
                    {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>

                {truthTable.variables && (
                    <div className="results">
                        <h2>Résultats</h2>
                        <table className={`table ${isDarkMode ? 'dark-mode' : ''}`}>
                            <thead>
                                <tr>
                                    {truthTable.variables.split("").map((variable, index) => (
                                        <th key={index}>{variable}</th>
                                    ))}
                                    <th>Results</th>
                                </tr>
                            </thead>
                            <tbody>
                                {truthTable.results.map((row, index) => (
                                    <tr key={index}>
                                        {row.map((value, idx) => (
                                            <td key={idx}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Logic;
