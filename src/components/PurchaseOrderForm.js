import React, { useState } from "react";
import TalentDetails from "./TalentDetails";


function PurchaseOrderForm() {
  <h1 className="mb-4">Purchase Order Form</h1>
  const [formData, setFormData] = useState({
    clientName: "",
    poType: "",
    poNumber: "",
    receivedOn: "",
    receivedFromName: "",
    receivedFromEmail: "",
    startDate: "",
    endDate: "",
    budget: "",
    currency: "USD",
  });

  // Talent section state is managed inside TalentDetails component, but we need data at submit.
  // We'll use a callback from TalentDetails to get the current sections when submitting.
  const [talentSections, setTalentSections] = useState([]); // receives data from child
  const [errors, setErrors] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleChildSectionsChange = (sections) => {
    // TalentDetails will call this on every change to keep parent updated
    setTalentSections(sections);
  };

  const handleReset = () => {
    setFormData({
      clientName: "",
      poType: "",
      poNumber: "",
      receivedOn: "",
      receivedFromName: "",
      receivedFromEmail: "",
      startDate: "",
      endDate: "",
      budget: "",
      currency: "USD",
    });
    setTalentSections([]);
    setErrors([]);
    setIsSaved(false);
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    const newErrors = [];

    // basic required checks
    if (!formData.clientName) newErrors.push("Client Name is required.");
    if (!formData.poType) newErrors.push("Purchase Order Type is required.");
    if (!formData.poNumber) newErrors.push("Purchase Order Number is required.");
    if (!formData.receivedOn) newErrors.push("Received On is required.");
    if (!formData.receivedFromName) newErrors.push("Received From is required.");
    if (!formData.receivedFromEmail) newErrors.push("Received From (Email) is required.");
    if (!formData.startDate) newErrors.push("PO Start Date is required.");
    if (!formData.endDate) newErrors.push("PO End Date is required.");
    if (!formData.budget) newErrors.push("Budget is required.");

    // date check
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.push("PO End Date cannot be before PO Start Date.");
    }

    // talent selection counts across all REQ sections
    let totalSelected = 0;
    talentSections.forEach((sec) => {
      if (Array.isArray(sec.talents)) {
        totalSelected += sec.talents.filter((t) => t.selected).length;
      }
    });

    if (formData.poType === "Individual") {
      if (totalSelected !== 1) newErrors.push("Individual PO must have exactly 1 selected talent.");
    } else if (formData.poType === "Group") {
      if (totalSelected < 2) newErrors.push("Group PO must have at least 2 selected talents.");
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      // build final payload
      const payload = {
        ...formData,
        talentSections,
      };
      console.log("Form submitted payload:", payload);
      setIsSaved(true);
      alert("Form saved — check console for payload");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <form className="form-section" onSubmit={validateAndSubmit}>
      {/* ⭐ Heading OUTSIDE the MAIN BOX ⭐ */}
      <h1 className="text-center mb-4">Purchase Order Form | New</h1>  
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="row mb-3">
        <div className="col-md-4">
          <label>Client Name *</label>
          <select
            className="form-control"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            disabled={isSaved}
          >
            <option value="">Select Client</option>
            <option value="Collabera">Collabera - Collabera Inc</option>
            <option value="Acme">Acme Corp</option>
          </select>
        </div>

        <div className="col-md-4">
          <label>Purchase Order Type *</label>
          <select
            className="form-control"
            name="poType"
            value={formData.poType}
            onChange={handleChange}
            disabled={isSaved}
          >
            <option value="">Select</option>
            <option value="Group">Group PO</option>
            <option value="Individual">Individual PO</option>
          </select>
        </div>

        <div className="col-md-4">
          <label>Purchase Order No *</label>
          <input
            type="text"
            className="form-control"
            name="poNumber"
            value={formData.poNumber}
            onChange={handleChange}
            disabled={isSaved}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label>Received On *</label>
          <input
            type="date"
            className="form-control"
            name="receivedOn"
            value={formData.receivedOn}
            onChange={handleChange}
            disabled={isSaved}
          />
        </div>

        <div className="col-md-4">
          <label>Received From *</label>
          <input
            type="text"
            className="form-control"
            name="receivedFromName"
            value={formData.receivedFromName}
            onChange={handleChange}
            disabled={isSaved}
          />
        </div>

        <div className="col-md-4">
          <label>Received From (Email) *</label>
          <input
            type="email"
            className="form-control"
            name="receivedFromEmail"
            value={formData.receivedFromEmail}
            onChange={handleChange}
            disabled={isSaved}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label>PO Start Date *</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            disabled={isSaved}
          />
        </div>

        <div className="col-md-4">
          <label>PO End Date *</label>
          <input
            type="date"
            className="form-control"
            name="endDate"
            min={formData.startDate || undefined}
            value={formData.endDate}
            onChange={handleChange}
            disabled={isSaved}
          />
        </div>

        <div className="col-md-2">
          <label>Budget *</label>
          <input
            type="number"
            className="form-control"
            name="budget"
            max="99999"
            value={formData.budget}
            onChange={handleChange}
            disabled={isSaved}
          />
        </div>

        <div className="col-md-2">
          <label>Currency</label>
          <select
            className="form-control"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            disabled={isSaved}
          >
            <option>USD</option>
            <option>INR</option>
            <option>EUR</option>
          </select>
        </div>
      </div>

      {/* Talent details component: receives props to know if form is saved and the PO type */}
      <TalentDetails
        poType={formData.poType}
        disabled={isSaved}
        onSectionsChange={handleChildSectionsChange}
      />

      <div className="d-flex justify-content-end mt-3">
        <button
          type="button"
          className="btn btn-secondary me-3"
          onClick={handleReset}
        >
          Reset
        </button>

        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}

export default PurchaseOrderForm;
