"use client"

import { useState } from "react"
import { signOut } from "firebase/auth"
import { useAddTransaction } from "../../hooks/useAddTransaction"
import { useGetTransactions } from "../../hooks/useGetTransactions"
import { useGetUserInfo } from "../../hooks/useGetUserInfo"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { auth } from "../../config/firebase-config"
import "./styles.css"

export const Ecodib = () => {
  const { addTransaction } = useAddTransaction()
  const { transactions, transactionTotals } = useGetTransactions()
  const { name, profilePhoto } = useGetUserInfo()
  const navigate = useNavigate()

  const [description, setDescription] = useState("")
  const [transactionAmount, setTransactionAmount] = useState(0)
  const [transactionType, setTransactionType] = useState("expense")

  const { balance, income, expenses } = transactionTotals

  const onSubmit = async (e) => {
    e.preventDefault()
    addTransaction({
      description,
      transactionAmount,
      transactionType,
    })

    setDescription("")
    setTransactionAmount("")
  }

  const signUserOut = async () => {
    try {
      await signOut(auth)
      localStorage.clear()
      navigate("/")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="ecodib-app">
      <div className="header">
        {/* Logo container */}
        <div className="logo-text-container" aria-label="Logo Ecodib et slogan">
          <svg
            className="wallet-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M2 7h18a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H2V7z" />
            <path d="M2 7v2h18V7" />
            <circle cx="20" cy="11" r="1.5" />
          </svg>
          <div>
            <h1 className="title">Ecodib</h1>
            <p className="subtitle">l'App de suivi des dépenses</p>
          </div>
        </div>

        {profilePhoto && (
          <div className="profile-header">
            <img 
              className="profile-photo" 
              src={profilePhoto || "/placeholder.svg"} 
              alt={`Profil de ${name}`} 
            />
            <div className="user-info">
              <h2>Ecodib de {name} 👋</h2>
              <button className="sign-out-button" onClick={signUserOut}>
                Déconnexion
              </button>
            </div>
          </div>
        )}
        
        <div className="navigation">
          <Link to="/reports" className="nav-link">
            <button className="nav-button">📊 Rapports</button>
          </Link>
          <Link to="/budget" className="nav-link">
            <button className="nav-button">🪙 Budget</button>
          </Link>
          <Link to="/aide" className="nav-link">
            <button className="nav-button">❓ Aide</button>
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="ecodib">
        <div className="container">
          <div className="balance">
            <h3>Votre Solde</h3>
            <h2>{balance} fcfa</h2>
          </div>

          <div className="summary">
            <div className="income">
              <h4>Revenus</h4>
              <p>{income} fcfa</p>
            </div>
            <div className="expense">
              <h4>Dépenses</h4>
              <p>{expenses} fcfa</p>
            </div>
          </div>

          <form className="add-transaction" onSubmit={onSubmit}>
            <h3>Ajouter une transaction</h3>
            <input
              type="text"
              placeholder="Description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="number"
              placeholder="Montant"
              value={transactionAmount}
              required
              onChange={(e) => setTransactionAmount(e.target.value)}
            />

            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="expense"
                  value="expense"
                  checked={transactionType === "expense"}
                  onChange={(e) => setTransactionType(e.target.value)}
                />
                <label htmlFor="expense">Dépenses</label>
              </div>

              <div className="radio-option">
                <input
                  type="radio"
                  id="income"
                  value="income"
                  checked={transactionType === "income"}
                  onChange={(e) => setTransactionType(e.target.value)}
                />
                <label htmlFor="income">Revenus</label>
              </div>
            </div>

            <button type="submit">Ajouter la transaction</button>
          </form>
        </div>

        <div className="transactions">
          <h3>Transactions Récentes</h3>
          <ul>
            {transactions.map((transaction) => {
              const { description, transactionAmount, transactionType, id } = transaction
              const displayType = transactionType === "expense" ? "Dépense" : "Revenu"

              return (
                <li key={id || Math.random()}> {/* Fallback key si id manque */}
                  <div>
                    <h4>{description}</h4>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{displayType}</p>
                  </div>
                  <p
                    style={{
                      color: transactionType === "expense" ? "#dc3545" : "#28a745",
                      fontWeight: "bold"
                    }}
                  >
                    {transactionType === "expense" ? "-" : "+"} {transactionAmount} fcfa
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}