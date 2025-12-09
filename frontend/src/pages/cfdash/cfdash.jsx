import React, { useState } from "react";
import "./cfdash.css";

const CarbonFootprintDash = () => {
  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [months, setMonths] = useState(1);

  // Waste data with CO2 emissions and disposal impact
  const wasteData = {
    "plastic-bags": { 
      co2PerKg: 5.9, 
      name: "Plastic Bags",
      decomposition: "450+ years",
      recyclable: true 
    },
    "plastic-bottles": { 
      co2PerKg: 3.8, 
      name: "Plastic Bottles",
      decomposition: "450+ years",
      recyclable: true 
    },
    "paper-waste": { 
      co2PerKg: 1.2, 
      name: "Paper & Cardboard",
      decomposition: "2-6 weeks",
      recyclable: true 
    },
    "food-waste": { 
      co2PerKg: 2.5, 
      name: "Food Waste (Landfill)",
      decomposition: "5-30 years",
      recyclable: false,
      compostable: true 
    },
    "glass": { 
      co2PerKg: 0.6, 
      name: "Glass",
      decomposition: "1 million+ years",
      recyclable: true 
    },
    "metal": { 
      co2PerKg: 4.1, 
      name: "Metal & Aluminum",
      decomposition: "100+ years",
      recyclable: true 
    },
    "textile": { 
      co2PerKg: 6.8, 
      name: "Textiles",
      decomposition: "200-400 years",
      recyclable: true 
    },
    "electronics": { 
      co2PerKg: 15.2, 
      name: "E-Waste",
      decomposition: "1000+ years",
      recyclable: true,
      hazardous: true 
    },
  };

  // Constants
  const TREE_CO2_ABSORPTION = 21; // kg CO2 per tree per year
  const LANDFILL_METHANE_FACTOR = 0.5; // Additional emissions from landfill decomposition

  // Calculate carbon footprint
  const calculateFootprint = () => {
    if (!wasteType) return null;

    const waste = wasteData[wasteType];
    const totalKg = quantity * months;
    
    // Direct emissions from waste production/disposal
    let directEmissions = totalKg * waste.co2PerKg;
    
    // Additional methane emissions from landfill
    const additionalEmissions = totalKg * LANDFILL_METHANE_FACTOR;
    const totalEmissions = directEmissions + additionalEmissions;

    // Recycling impact - if recyclable, reduce by 80%
    const recyclingFactor = waste.recyclable ? 0.2 : 1;
    const emissionsIfRecycled = totalEmissions * recyclingFactor;
    const savedEmissions = totalEmissions - emissionsIfRecycled;

    // Composting impact for food waste
    const compostingFactor = waste.compostable ? 0.1 : 1;
    const emissionsIfComposted = totalEmissions * compostingFactor;
    const savedEmissionsCompost = totalEmissions - emissionsIfComposted;

    // Tree equivalent
    const treesEquivalent = (totalEmissions / TREE_CO2_ABSORPTION).toFixed(2);
    const treesIfRecycled = (emissionsIfRecycled / TREE_CO2_ABSORPTION).toFixed(2);

    // Format emissions in kg (more readable than 0.something tonnes)
    const formatEmissions = (value) => {
      if (value < 1) {
        return (value * 1000).toFixed(0) + " g CO₂"; // grams
      } else if (value < 1000) {
        return value.toFixed(2) + " kg CO₂"; // kilograms
      } else {
        return (value / 1000).toFixed(2) + " tonnes CO₂";
      }
    };

    return {
      totalEmissions: formatEmissions(totalEmissions),
      emissionsIfRecycled: formatEmissions(emissionsIfRecycled),
      emissionsIfComposted: formatEmissions(emissionsIfComposted),
      savedEmissions: formatEmissions(savedEmissions),
      savedEmissionsCompost: formatEmissions(savedEmissionsCompost),
      treesEquivalent,
      treesIfRecycled,
      totalKg,
    };
  };

  const results = calculateFootprint();
  const currentWaste = wasteType ? wasteData[wasteType] : null;

  return (
    <div className="cfdash-container">
      <div className="cfdash-header">
        <h1 className="cfdash-title">Waste Impact Calculator</h1>
        <h2 className="cfdash-subtitle">See how your waste affects the environment</h2>
        <p className="cfdash-description">
          Understand the environmental impact of different waste types and discover how recycling or composting can make a difference.
        </p>
      </div>

      <div className="cfdash-content">
        {/* Left: Input Form */}
        <div className="cfdash-form-section">
          <div className="form-group">
            <label htmlFor="waste-type" className="form-label">
              What type of waste?
            </label>
            <select
              id="waste-type"
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              className="form-select"
            >
              <option value="">Choose waste type...</option>
              <option value="plastic-bags">Plastic Bags</option>
              <option value="plastic-bottles">Plastic Bottles</option>
              <option value="paper-waste">Paper & Cardboard</option>
              <option value="food-waste">Food Waste</option>
              <option value="glass">Glass</option>
              <option value="metal">Metal & Aluminum</option>
              <option value="textile">Textiles & Clothes</option>
              <option value="electronics">Electronics & E-Waste</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity" className="form-label">
              How much? <span className="current-value">{quantity} kg</span>
            </label>
            <input
              id="quantity"
              type="range"
              min="0.1"
              max="100"
              step="0.5"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="form-slider"
            />
            <div className="slider-labels">
              <span>0.1 kg</span>
              <span>100 kg</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="months" className="form-label">
              Time period
            </label>
            <select
              id="months"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="form-select"
            >
              <option value={1}>1 Month</option>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>1 Year</option>
            </select>
          </div>

          {currentWaste && (
            <div className="waste-info">
              <h3>Quick Facts</h3>
              <div className="info-row">
                <span>Takes to break down:</span>
                <strong>{currentWaste.decomposition}</strong>
              </div>
              {currentWaste.recyclable && (
                <div className="info-row recyclable">
                  <span>♻️ Can be recycled</span>
                </div>
              )}
              {currentWaste.compostable && (
                <div className="info-row compostable">
                  <span>🌱 Can be composted</span>
                </div>
              )}
              {currentWaste.hazardous && (
                <div className="info-row hazardous">
                  <span>⚠️ Harmful to environment</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Results Cards */}
        <div className="cfdash-results-section">
          {results ? (
            <>
              <div className="result-card primary">
                <div className="result-icon">🌍</div>
                <div className="result-content">
                  <div className="result-value">{results.totalEmissions}</div>
                  <div className="result-label">Pollution created<br/>(if thrown away)</div>
                </div>
              </div>

              {currentWaste?.recyclable && (
                <div className="result-card secondary">
                  <div className="result-icon">♻️</div>
                  <div className="result-content">
                    <div className="result-value">{results.emissionsIfRecycled}</div>
                    <div className="result-label">Pollution if recycled</div>
                    <div className="result-savings">You save {results.savedEmissions} pollution!</div>
                  </div>
                </div>
              )}

              {currentWaste?.compostable && (
                <div className="result-card secondary">
                  <div className="result-icon">🌱</div>
                  <div className="result-content">
                    <div className="result-value">{results.emissionsIfComposted}</div>
                    <div className="result-label">Pollution if composted</div>
                    <div className="result-savings">You save {results.savedEmissionsCompost} pollution!</div>
                  </div>
                </div>
              )}

              <div className="result-card">
                <div className="result-icon">🌲</div>
                <div className="result-content">
                  <div className="result-value">{results.treesEquivalent}</div>
                  <div className="result-label">Trees needed to clean this up</div>
                </div>
              </div>
            </>
          ) : (
            <div className="result-placeholder">
              <p>👈 Pick a waste type to see its impact</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprintDash;
