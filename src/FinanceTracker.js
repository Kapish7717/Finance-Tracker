import React, { useState } from 'react';

const FinanceTracker = () => {
  // Helper function to format number in Indian currency format (e.g., 1,00,000)
  const formatIndianRupees = (num) => {
    const formatted = num.toFixed(2);
    const [wholePart, decimal] = formatted.split('.');
    const lastThree = wholePart.substring(wholePart.length - 3);
    const otherNumbers = wholePart.substring(0, wholePart.length - 3);
    const indianFormat = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return `₹${indianFormat ? indianFormat + ',' + lastThree : lastThree}${decimal ? '.' + decimal : ''}`;
  };

  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', category: 'Salary', amount: 50000, date: '2025-02-01' },
    { id: 2, type: 'expense', category: 'Rent', amount: 15000, date: '2025-02-01' },
    { id: 3, type: 'expense', category: 'Groceries', amount: 4000, date: '2025-02-02' },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Rent', 'Business', 'Other'],
    expense: ['Rent', 'Groceries', 'Utilities', 'Transportation', 'Entertainment', 'Healthcare', 'Education', 'Shopping', 'Other']
  };

  const calculateTotals = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const transaction = {
      id: transactions.length + 1,
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    };
    setTransactions([...transactions, transaction]);
    setNewTransaction({
      type: 'expense',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const totals = calculateTotals();

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
    },
    header: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#1a365d',
    },
    summaryCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '20px',
    },
    card: {
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: 'white',
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '10px',
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    input: {
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      width: '100%',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#1a365d',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #dee2e6',
      color: '#1a365d',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #dee2e6',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Personal Finance Tracker</h1>

      {/* Summary Cards */}
      <div style={styles.summaryCards}>
        <div style={styles.card}>
          <h3>Total Income</h3>
          <p style={{ color: '#22c55e', fontSize: '24px' }}>{formatIndianRupees(totals.income)}</p>
        </div>
        <div style={styles.card}>
          <h3>Total Expenses</h3>
          <p style={{ color: '#ef4444', fontSize: '24px' }}>{formatIndianRupees(totals.expenses)}</p>
        </div>
        <div style={styles.card}>
          <h3>Balance</h3>
          <p style={{ color: '#3b82f6', fontSize: '24px' }}>{formatIndianRupees(totals.balance)}</p>
        </div>
      </div>

      {/* Add Transaction Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          style={styles.input}
          value={newTransaction.type}
          onChange={(e) => setNewTransaction({
            ...newTransaction,
            type: e.target.value,
            category: ''
          })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <select
          style={styles.input}
          value={newTransaction.category}
          onChange={(e) => setNewTransaction({
            ...newTransaction,
            category: e.target.value
          })}
          required
        >
          <option value="">Select Category</option>
          {categories[newTransaction.type].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount in ₹"
          style={styles.input}
          value={newTransaction.amount}
          onChange={(e) => setNewTransaction({
            ...newTransaction,
            amount: e.target.value
          })}
          required
        />

        <input
          type="date"
          style={styles.input}
          value={newTransaction.date}
          onChange={(e) => setNewTransaction({
            ...newTransaction,
            date: e.target.value
          })}
          required
        />

        <button type="submit" style={styles.button}>
          Add Transaction
        </button>
      </form>

      {/* Recent Transactions */}
      <div style={styles.card}>
        <h3>Recent Transactions</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td style={styles.td}>{transaction.date}</td>
                <td style={styles.td}>{transaction.type}</td>
                <td style={styles.td}>{transaction.category}</td>
                <td style={{
                  ...styles.td,
                  color: transaction.type === 'income' ? '#22c55e' : '#ef4444'
                }}>
                  {formatIndianRupees(transaction.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceTracker;