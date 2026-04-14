/************************
 * Made by [MR Ferry™]  *
 * on April 2026        *
 ************************/

import React from "react";
import { getNumberValueFromRupiah, onChangeRupiah, rp } from "../../utils/VcaUtils.tsx";
import "../value-averaging/ValueAveraging.css";

interface Transaction {
  unitPrice: string;
  totalLot: string;
}

function calculateBreakEven(transactions: Transaction[]) {
  let totalCost = 0;
  let totalLot = 0;
  for (const tx of transactions) {
    const price = getNumberValueFromRupiah(tx.unitPrice) * 100;
    const lot = parseInt(tx.totalLot) || 0;
    totalCost += price * lot;
    totalLot += lot;
  }
  if (totalLot <= 0) return null;
  const breakEvenLotPrice = totalCost / totalLot;
  return {
    totalCost,
    totalLot,
    breakEvenUnitPrice: breakEvenLotPrice / 100,
    breakEvenLotPrice,
  };
}

export function BreakEvenForm() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([{ unitPrice: "", totalLot: "" }]);
  const [resultElement, setResultElement] = React.useState<React.ReactNode>(null);

  const updateTransaction = (index: number, field: keyof Transaction, value: string) => {
    const updated = [...transactions];
    updated[index] = { ...updated[index], [field]: value };
    setTransactions(updated);
  };

  const addTransaction = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setTransactions([...transactions, { unitPrice: "", totalLot: "" }]);
  };

  const removeTransaction = (e: React.BaseSyntheticEvent, index: number) => {
    e.preventDefault();
    if (transactions.length <= 1) return;
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const clearResult = (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    setResultElement(null);
  };

  const calculate = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const result = calculateBreakEven(transactions);
    if (!result) {
      setResultElement(<p>Total lot harus lebih dari 0</p>);
      return;
    }
    setResultElement(
      <>
        <p>{`Total pembelian: ${result.totalLot.toLocaleString("id-ID")} lot (${(result.totalLot * 100).toLocaleString("id-ID")} unit)`}</p>
        <p>{`Total modal: ${rp(result.totalCost)}`}</p>
        <p>{`Harga rata-rata (break-even): ${rp(result.breakEvenUnitPrice)}/unit atau ${rp(result.breakEvenLotPrice)}/lot`}</p>
      </>
    );
  };

  return (
    <div className="vca-wrapper">
      <div className="vca-card">
        <form id="break-even-form" onSubmit={calculate}>
          {transactions.map((tx, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.375rem",
                }}
              >
                <span style={{ fontFamily: "Work Sans, sans-serif", fontSize: "0.875rem", fontWeight: 500 }}>
                  Pembelian {index + 1}
                </span>
                {transactions.length > 1 && (
                  <button
                    className="vca-btn vca-btn-delete"
                    style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem", flex: "none" }}
                    onClick={(e) => removeTransaction(e, index)}
                  >
                    Hapus
                  </button>
                )}
              </div>
              <div className="vca-field-row">
                <div className="vca-field" style={{ marginBottom: 0 }}>
                  <label htmlFor={`unitPrice-${index}`}>Harga per unit</label>
                  <input
                    type="text"
                    name={`unitPrice-${index}`}
                    id={`unitPrice-${index}`}
                    className="vca-input"
                    placeholder="Rp"
                    autoComplete="off"
                    onChange={(e) => updateTransaction(index, "unitPrice", onChangeRupiah(e))}
                    value={tx.unitPrice}
                    required
                  />
                </div>
                <div className="vca-field" style={{ marginBottom: 0 }}>
                  <label htmlFor={`totalLot-${index}`}>Jumlah lot</label>
                  <input
                    type="number"
                    name={`totalLot-${index}`}
                    id={`totalLot-${index}`}
                    className="vca-input"
                    min={0}
                    placeholder="lot"
                    required
                    onChange={(e) => updateTransaction(index, "totalLot", e.target.value)}
                    value={tx.totalLot}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="vca-buttons" style={{ marginBottom: "0.5rem" }}>
            <button className="vca-btn vca-btn-clear" onClick={addTransaction}>
              + Tambah Pembelian
            </button>
          </div>
          <div className="vca-buttons">
            <button className="vca-btn vca-btn-calculate" type="submit">
              Calculate
            </button>
            <button className="vca-btn vca-btn-clear" onClick={clearResult}>
              Clear
            </button>
          </div>
        </form>
        {resultElement && <div className="vca-result">{resultElement}</div>}
      </div>
    </div>
  );
}
