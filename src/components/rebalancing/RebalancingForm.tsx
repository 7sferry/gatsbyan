/************************
 * Made by [MR Ferry™]  *
 * on April 2026        *
 ************************/

import React from "react";
import { getNumberValueFromRupiah, onChangeRupiah, rp } from "../../utils/VcaUtils.tsx";
import "../value-averaging/ValueAveraging.css";

interface Asset {
  name: string;
  currentValue: string;
  targetPercent: string;
}

interface RebalanceResult {
  name: string;
  currentValue: number;
  currentPercent: number;
  targetPercent: number;
  targetValue: number;
  difference: number;
}

function calculateRebalancing(assets: Asset[]): RebalanceResult[] | null {
  const parsed = assets.map((a) => ({
    name: a.name || "—",
    currentValue: getNumberValueFromRupiah(a.currentValue),
    targetPercent: parseFloat(a.targetPercent) || 0,
  }));

  const totalValue = parsed.reduce((sum, a) => sum + a.currentValue, 0);
  if (totalValue <= 0) return null;

  const totalTargetPercent = parsed.reduce((sum, a) => sum + a.targetPercent, 0);
  if (Math.abs(totalTargetPercent - 100) > 0.01) return null;

  return parsed.map((a) => {
    const currentPercent = (a.currentValue / totalValue) * 100;
    const targetValue = (a.targetPercent / 100) * totalValue;
    return {
      name: a.name,
      currentValue: a.currentValue,
      currentPercent,
      targetPercent: a.targetPercent,
      targetValue,
      difference: targetValue - a.currentValue,
    };
  });
}

export function RebalancingForm() {
  const [assets, setAssets] = React.useState<Asset[]>([
    { name: "", currentValue: "", targetPercent: "" },
    { name: "", currentValue: "", targetPercent: "" },
  ]);
  const [resultElement, setResultElement] = React.useState<React.ReactNode>(null);

  const updateAsset = (index: number, field: keyof Asset, value: string) => {
    const updated = [...assets];
    updated[index] = { ...updated[index], [field]: value };
    setAssets(updated);
  };

  const addAsset = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setAssets([...assets, { name: "", currentValue: "", targetPercent: "" }]);
  };

  const removeAsset = (e: React.BaseSyntheticEvent, index: number) => {
    e.preventDefault();
    if (assets.length <= 2) return;
    setAssets(assets.filter((_, i) => i !== index));
  };

  const clearResult = (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    setResultElement(null);
  };

  const calculate = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const totalTargetPercent = assets.reduce((sum, a) => sum + (parseFloat(a.targetPercent) || 0), 0);
    if (Math.abs(totalTargetPercent - 100) > 0.01) {
      setResultElement(<p>{`Total target alokasi harus 100% (saat ini ${totalTargetPercent.toFixed(2)}%)`}</p>);
      return;
    }

    const results = calculateRebalancing(assets);
    if (!results) {
      setResultElement(<p>Nilai portfolio harus lebih dari 0</p>);
      return;
    }

    const totalValue = results.reduce((sum, r) => sum + r.currentValue, 0);
    setResultElement(
      <>
        <p>{`Total nilai portfolio: ${rp(totalValue)}`}</p>
        {results.map((r, i) => (
          <div key={i} style={{ marginBottom: "0.75rem" }}>
            <p style={{ fontWeight: 600, marginBottom: "0.2rem" }}>{r.name}</p>
            <p style={{ marginBottom: "0.1rem" }}>
              {`Saat ini: ${rp(r.currentValue)} (${r.currentPercent.toFixed(2)}%) → Target: ${rp(r.targetValue)} (${r.targetPercent.toFixed(2)}%)`}
            </p>
            <p style={{ color: r.difference > 0 ? "#4ade80" : r.difference < 0 ? "#ff8a8a" : "#dfdfdf" }}>
              {r.difference > 0
                ? `Beli senilai ${rp(r.difference)}`
                : r.difference < 0
                  ? `Jual senilai ${rp(Math.abs(r.difference))}`
                  : "Sudah seimbang"}
            </p>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="vca-wrapper">
      <div className="vca-card">
        <form id="rebalancing-form" onSubmit={calculate}>
          {assets.map((asset, index) => (
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
                  Aset {index + 1}
                </span>
                {assets.length > 2 && (
                  <button
                    className="vca-btn vca-btn-delete"
                    style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem", flex: "none" }}
                    onClick={(e) => removeAsset(e, index)}
                  >
                    Hapus
                  </button>
                )}
              </div>
              <div className="vca-field" style={{ marginBottom: "0.5rem" }}>
                <label htmlFor={`assetName-${index}`}>Nama aset</label>
                <input
                  type="text"
                  name={`assetName-${index}`}
                  id={`assetName-${index}`}
                  className="vca-input"
                  placeholder="cth: BBCA, Emas, Obligasi"
                  autoComplete="off"
                  onChange={(e) => updateAsset(index, "name", e.target.value)}
                  value={asset.name}
                  required
                />
              </div>
              <div className="vca-field-row">
                <div className="vca-field" style={{ marginBottom: 0 }}>
                  <label htmlFor={`currentValue-${index}`}>Nilai saat ini</label>
                  <input
                    type="text"
                    name={`currentValue-${index}`}
                    id={`currentValue-${index}`}
                    className="vca-input"
                    placeholder="Rp"
                    autoComplete="off"
                    onChange={(e) => updateAsset(index, "currentValue", onChangeRupiah(e))}
                    value={asset.currentValue}
                    required
                  />
                </div>
                <div className="vca-field" style={{ marginBottom: 0 }}>
                  <label htmlFor={`targetPercent-${index}`}>Target (%)</label>
                  <input
                    type="number"
                    name={`targetPercent-${index}`}
                    id={`targetPercent-${index}`}
                    className="vca-input"
                    min={0}
                    max={100}
                    step="0.01"
                    placeholder="%"
                    required
                    onChange={(e) => updateAsset(index, "targetPercent", e.target.value)}
                    value={asset.targetPercent}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="vca-buttons" style={{ marginBottom: "0.5rem" }}>
            <button className="vca-btn vca-btn-clear" onClick={addAsset}>
              + Tambah Aset
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
