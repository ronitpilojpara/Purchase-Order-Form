import React, { useState, useEffect } from "react";


function TalentDetails({ poType = "", disabled = false, onSectionsChange }) {
  const defaultTalents = [
    {
      name: "Monika Goyal Test",
      selected: false,
      contract: "",
      billRate: "",
      billCurrency: "USD",
      stBr: "",
      stCurrency: "USD",
      otBr: "",
      otCurrency: "USD",
    },
    {
      name: "Shaili Khatri",
      selected: false,
      contract: "",
      billRate: "",
      billCurrency: "USD",
      stBr: "",
      stCurrency: "USD",
      otBr: "",
      otCurrency: "USD",
    },
  ];

  const emptySection = {
    jobTitle: "",
    reqId: "",
    talents: JSON.parse(JSON.stringify(defaultTalents)),
  };

  const [sections, setSections] = useState([JSON.parse(JSON.stringify(emptySection))]);

  const jobList = [
    { title: "Application Development", reqId: "OWNAL_2344" },
    { title: "Business Administrator", reqId: "CLK_12880" },
  ];

  useEffect(() => {
    if (typeof onSectionsChange === "function") {
      onSectionsChange(sections);
    }
  }, [sections, onSectionsChange]);

  const handleJobChange = (index, value) => {
    const found = jobList.find((j) => j.title === value);
    const updated = [...sections];
    updated[index].jobTitle = value;
    updated[index].reqId = found ? found.reqId : "";
    // reset talents to defaults when job changed
    updated[index].talents = JSON.parse(JSON.stringify(defaultTalents));
    setSections(updated);
  };

  const toggleTalent = (sIndex, tIndex) => {
    // For Individual PO, ensure only one talent is selected in total
    const updated = [...sections];

    if (poType === "Individual") {
      // clear all selections first
      updated.forEach((sec) => {
        sec.talents.forEach((t) => (t.selected = false));
      });
      updated[sIndex].talents[tIndex].selected = true;
    } else {
      // group: toggle particular talent
      updated[sIndex].talents[tIndex].selected = !updated[sIndex].talents[tIndex].selected;
    }
    setSections(updated);
  };

  const updateTalentField = (sIndex, tIndex, field, value) => {
    const updated = [...sections];
    updated[sIndex].talents[tIndex][field] = value;
    setSections(updated);
  };

  const addAnotherSection = () => {
    setSections((prev) => [...prev, JSON.parse(JSON.stringify(emptySection))]);
  };

  const removeSection = (index) => {
    if (sections.length === 1) return;
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  // Render
  return (
    <div className="form-section mt-3">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Talent Detail</h5>
        {/* "+ Add Another" visible only when PO type is Group (per your requirement) */}
        <div>
          {poType === "Group" && !disabled && (
            <button type="button" className="btn btn-outline-secondary btn-sm btn-add" onClick={addAnotherSection}>
              + Add Another
            </button>
          )}
        </div>
      </div>

      <div className="mt-3">
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="req-card">
            <div className="d-flex justify-content-end">
              {!disabled && sections.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeSection(sIndex)}
                >
                  −
                </button>
              )}
            </div>

            {/* Job title + req id row */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="small-muted">Job Title/REQ Name *</label>
                <select
                  className="form-control"
                  value={section.jobTitle}
                  onChange={(e) => handleJobChange(sIndex, e.target.value)}
                  disabled={disabled}
                >
                  <option value="">Select Job</option>
                  {jobList.map((j) => (
                    <option key={j.reqId} value={j.title}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="small-muted">Job ID/REQ ID *</label>
                <input type="text" className="form-control" value={section.reqId} readOnly />
              </div>
            </div>

            {/* Talents */}
            <div>
              {section.talents.map((t, tIndex) => (
                <div key={tIndex} className="talent-block">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={t.selected}
                      onChange={() => toggleTalent(sIndex, tIndex)}
                      disabled={disabled}
                      id={`s${sIndex}t${tIndex}`}
                    />
                    <label className="form-check-label" htmlFor={`s${sIndex}t${tIndex}`}>
                      {t.name}
                    </label>
                  </div>

                  {/* show the fields row (always visible in screenshot but disabled until selected).
                      To match screenshot closely we show them but disabled when not selected.
                  */}
                  <div className="row">
                    {/* Contract Duration */}
                    <div className="col-md-3">
                      <label className="small-muted">Contract Duration</label>
                      <div className="d-flex">
                        <input
                          className="form-control"
                          placeholder="Contract Duration"
                          value={t.contract}
                          onChange={(e) => updateTalentField(sIndex, tIndex, "contract", e.target.value)}
                          disabled={disabled || !t.selected}
                        />
                        <div className="ms-2 align-self-center small-muted" style={{ minWidth: 70 }}>
                          Months
                        </div>
                      </div>
                    </div>

                    {/* Bill Rate + currency */}
                    <div className="col-md-3">
                      <label className="small-muted">Bill Rate</label>
                      <div className="input-group">
                        <input
                          className="form-control"
                          placeholder="Bill Rate"
                          value={t.billRate}
                          onChange={(e) => updateTalentField(sIndex, tIndex, "billRate", e.target.value)}
                          disabled={disabled || !t.selected}
                        />
                        <select
                          className="form-select"
                          value={t.billCurrency}
                          onChange={(e) => updateTalentField(sIndex, tIndex, "billCurrency", e.target.value)}
                          disabled={disabled || !t.selected}
                        >
                          <option value="USD">USD - Dollars ($)</option>
                          <option value="INR">INR - Rupees</option>
                        </select>
                      </div>
                    </div>

                    {/* Standard Time BR */}
                    <div className="col-md-3">
                      <label className="small-muted">Standard Time BR</label>
                      <div className="input-group">
                        <input
                          className="form-control"
                          placeholder="Std. Time BR"
                          value={t.stBr}
                          onChange={(e) => updateTalentField(sIndex, tIndex, "stBr", e.target.value)}
                          disabled={disabled || !t.selected}
                        />
                        <select
                          className="form-select"
                          value={t.stCurrency}
                          onChange={(e) => updateTalentField(sIndex, tIndex, "stCurrency", e.target.value)}
                          disabled={disabled || !t.selected}
                        >
                          <option value="USD">USD - Dollars ($)</option>
                          <option value="INR">INR - Rupees</option>
                        </select>
                      </div>
                    </div>

                    {/* Over Time BR */}
                    <div className="col-md-3">
                      <label className="small-muted">Over Time BR</label>
                      <div className="input-group">
                        <input
                          className="form-control"
                          placeholder="Over Time BR"
                          value={t.otBr}
                          onChange={(e) => updateTalentField(sIndex, tIndex, "otBr", e.target.value)}
                          disabled={disabled || !t.selected}
                        />
                        <select
                          className="form-select"
                          value={t.otCurrency}
                          onChange={(e) => updateTalentField(sIndex, tIndex, "otCurrency", e.target.value)}
                          disabled={disabled || !t.selected}
                        >
                          <option value="USD">USD - Dollars ($)</option>
                          <option value="INR">INR - Rupees</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TalentDetails;