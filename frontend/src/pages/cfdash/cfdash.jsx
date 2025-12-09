import React, { useState } from "react";
import "./cfdash.css";
import { TreeDeciduous, Car, Smartphone, Droplets, Zap } from 'lucide-react'; // Assuming you have lucide-react, or remove icons if not

const CarbonFootprintDash = () => {
  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [months, setMonths] = useState(1);

  // 1. UPDATED WASTE DATA with EPA/WARM Conversion Rates
  // Added energyPerKg (kWh) and waterPerKg (Liters)
  const wasteData = {
    "plastic-bags": { 
      co2PerKg: 1.5,      // EPA Data
      energyPerKg: 5.8,   // EPA Data
      waterPerKg: 23,     // EPA Data
      name: "Plastic Bags",
      decomposition: "450+ years",
      recyclable: true 
    },
    "plastic-bottles": { 
      co2PerKg: 1.5,      // EPA Data (PET)
      energyPerKg: 5.8, 
      waterPerKg: 23, 
      name: "Plastic Bottles",
      decomposition: "450+ years",
      recyclable: true 
    },
    "paper-waste": { 
      co2PerKg: 1.0,      // EPA Data
      energyPerKg: 4.0,   // EPA Data
      waterPerKg: 26,     // EPA Data
      name: "Paper & Cardboard",
      decomposition: "2-6 weeks",
      recyclable: true 
    },
    "food-waste": { 
      co2PerKg: 2.5, 
      energyPerKg: 0,     // N/A for standard recycling energy savings
      waterPerKg: 0,
      name: "Food Waste (Landfill)",
      decomposition: "5-30 years",
      recyclable: false,
      compostable: true 
    },
    "glass": { 
      co2PerKg: 0.3,      // EPA Data
      energyPerKg: 0.8,   // EPA Data
      waterPerKg: 4,      // EPA Data
      name: "Glass",
      decomposition: "1 million+ years",
      recyclable: true 
    },
    "metal": { 
      co2PerKg: 9.0,      // EPA Data (Aluminum focus)
      energyPerKg: 14.0,  // EPA Data
      waterPerKg: 8,      // EPA Data
      name: "Metal & Aluminum",
      decomposition: "100+ years",
      recyclable: true 
    },
    "textile": { 
      co2PerKg: 6.8, 
      energyPerKg: 8.0,   // Est.
      waterPerKg: 100,    // High water footprint
      name: "Textiles",
      decomposition: "200-400 years",
      recyclable: true 
    },
    "electronics": { 
      co2PerKg: 15.2, 
      energyPerKg: 20.0, 
      waterPerKg: 15, 
      name: "E-Waste",
      decomposition: "1000+ years",
      recyclable: true,
      hazardous: true 
    },
  };

  // Constants for Real World Equivalents
  const TREE_CO2_ABSORPTION = 22; // kg CO2 per tree per year (Global Carbon Seq. Standard)
  const CAR_EMISSION_PER_KM = 0.19; // kg CO2 per km
  const PHONE_CHARGE_KWH = 0.012; // kWh per smartphone charge
  const SHOWER_LITERS = 65; // Liters per average shower

  // Calculate carbon footprint
  const calculateFootprint = () => {
    if (!wasteType) return null;

    const waste = wasteData[wasteType];
    const totalKg = quantity * months;
    
    // 1. Calculate Base Metrics
    const totalEmissions = totalKg * waste.co2PerKg;
    const totalEnergy = totalKg * (waste.energyPerKg || 0);
    const totalWater = totalKg * (waste.waterPerKg || 0);

    // 2. Calculate Savings (If Recycled)
    // EPA data assumes these values are SAVED if recycled vs virgin production
    const savedEmissions = totalEmissions; 
    const savedEnergy = totalEnergy;
    const savedWater = totalWater;

    // 3. Composting Logic (Specific for Food)
    const emissionsIfComposted = totalEmissions * 0.1; // 90% reduction
    const savedEmissionsCompost = totalEmissions - emissionsIfComposted;

    // 4. Real World Equivalents
    const treesEquivalent = (totalEmissions / TREE_CO2_ABSORPTION).toFixed(1);
    const carKmEquivalent = (totalEmissions / CAR_EMISSION_PER_KM).toFixed(0);
    const phoneChargesEquivalent = (totalEnergy / PHONE_CHARGE_KWH).toFixed(0);
    const showersEquivalent = (totalWater / SHOWER_LITERS).toFixed(0);

    // Format helpers
    const formatEmissions = (value) => {
      if (value < 1) return (value * 1000).toFixed(0) + " g CO₂";
      if (value < 1000) return value.toFixed(2) + " kg CO₂";
      return (value / 1000).toFixed(2) + " tonnes CO₂";
    };

    return {
      totalEmissions: formatEmissions(totalEmissions),
      savedEmissions: formatEmissions(savedEmissions),
      savedEmissionsCompost: formatEmissions(savedEmissionsCompost),
      emissionsIfComposted: formatEmissions(emissionsIfComposted),
      
      // Raw numbers for display
      totalEnergy: totalEnergy.toFixed(1),
      totalWater: totalWater.toFixed(0),
      
      // Equivalents
      treesEquivalent,
      carKmEquivalent,
      phoneChargesEquivalent,
      showersEquivalent,
      
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
              {Object.keys(wasteData).map((key) => (
                 <option key={key} value={key}>{wasteData[key].name}</option>
              ))}
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
                  <span>♻️ Recyclable (High Impact)</span>
                </div>
              )}
              {currentWaste.compostable && (
                <div className="info-row compostable">
                  <span>🌱 Compostable</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Results Cards */}
        <div className="cfdash-results-section">
          {results ? (
            <>
              {/* 1. Main CO2 Card */}
              <div className="result-card primary">
                <div className="result-icon">🌍</div>
                <div className="result-content">
                  <div className="result-value">{results.totalEmissions}</div>
                  <div className="result-label">CO₂ Footprint Created</div>
                </div>
              </div>

              {/* 2. Real World Equivalents Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                
                {/* Trees */}
                <div className="result-card">
                   <div className="result-icon">🌲</div>
                   <div className="result-content">
                     <div className="result-value">{results.treesEquivalent}</div>
                     <div className="result-label">Trees needed to absorb this</div>
                   </div>
                </div>

                {/* Car Miles */}
                <div className="result-card">
                   <div className="result-icon">🚗</div>
                   <div className="result-content">
                     <div className="result-value">{results.carKmEquivalent} km</div>
                     <div className="result-label">Driving distance equivalent</div>
                   </div>
                </div>
              </div>

              {/* 3. Recycling Savings (Energy & Water) - ONLY if recyclable */}
              {currentWaste?.recyclable && (
                <>
                  <h4 style={{marginTop: '20px', marginBottom: '10px', color: '#2e7d32'}}>♻️ If You Recycle This:</h4>
                  
                  <div className="result-card secondary">
                    <div className="result-icon">⚡</div>
                    <div className="result-content">
                      <div className="result-value">{results.totalEnergy} kWh</div>
                      <div className="result-label">Energy Saved</div>
                      <div className="result-savings">Enough to charge {results.phoneChargesEquivalent} phones!</div>
                    </div>
                  </div>

                  {currentWaste.waterPerKg > 0 && (
                    <div className="result-card secondary">
                      <div className="result-icon">💧</div>
                      <div className="result-content">
                        <div className="result-value">{results.totalWater} L</div>
                        <div className="result-label">Water Saved</div>
                        <div className="result-savings">Equals {results.showersEquivalent} showers!</div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* 4. Composting Savings - ONLY if compostable */}
              {currentWaste?.compostable && (
                <div className="result-card secondary">
                  <div className="result-icon">🌱</div>
                  <div className="result-content">
                    <div className="result-value">{results.savedEmissionsCompost}</div>
                    <div className="result-label">CO₂ Saved by Composting</div>
                  </div>
                </div>
              )}
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