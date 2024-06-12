import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AudienceForm.css'; // Import the CSS file

const AudienceForm = () => {
  const navigate = useNavigate();
  const fields = ['total_spends', 'visits'];
  const [campaignName, setCampaignName] = useState('');
  const [rules, setRules] = useState([{ field: '', operator: '', value: '', logical: 'AND' }]);
  const [audienceSize, setAudienceSize] = useState(null);

  const addRule = () => {
    if (rules.length < fields.length) {
      setRules([...rules, { field: '', operator: '', value: '', logical: 'AND' }]);
    }
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newRules = rules.map((rule, i) => {
      if (i === index) {
        return { ...rule, [name]: value };
      }
      return rule;
    });
    setRules(newRules);
  };

  const checkAudienceSize = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/customers/check-audience-size', { rules });
      setAudienceSize(response.data.audienceSize);
    } catch (error) {
      console.error('There was an error checking the audience size!', error);
    }
  };

  const saveAudience = async () => {
    try {
      await axios.post('http://localhost:5000/api/communication-log', { campaign_name: campaignName, rules });
      alert('Audience saved successfully');
      navigate('/campaigns'); // Navigate to campaigns list page
    } catch (error) {
      console.error('There was an error saving the audience!', error);
    }
  };

  return (
    <div className="audience-form">
      <h2>Create Audience</h2>
      <input
        type="text"
        placeholder="Campaign Name"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
        className="form-input"
      />
      {rules.map((rule, index) => (
        <div key={index} className="rule-group">
          {index > 0 && (
            <select name="logical" onChange={(e) => handleChange(index, e)} value={rule.logical} className="form-select">
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          )}
          <select name="field" onChange={(e) => handleChange(index, e)} value={rule.field} className="form-select">
            <option value="">Select Field</option>
            {fields.map((field) => (
              <option key={field} value={field}>
                {field === 'total_spends' ? 'Total Spends' : 'Number of Visits'}
              </option>
            ))}
          </select>
          <select name="operator" onChange={(e) => handleChange(index, e)} value={rule.operator} className="form-select">
            <option value=">">greater than</option>
            <option value="<">less than</option>
            <option value="=">equal to</option>
          </select>
          <input name="value" placeholder="Value" onChange={(e) => handleChange(index, e)} value={rule.value} className="form-input" />
        </div>
      ))}
      <div className="button-group">
        <button onClick={addRule} disabled={rules.length >= fields.length} className="form-button">Add Rule</button>
        <button onClick={checkAudienceSize} className="form-button">Check Audience Size</button>
        <button onClick={saveAudience} className="form-button">Save Audience</button>
      </div>
      {audienceSize !== null && <p>Audience Size: {audienceSize}</p>}
    </div>
  );
};

export default AudienceForm;
