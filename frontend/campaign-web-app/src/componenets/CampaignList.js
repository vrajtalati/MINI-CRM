import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./CampaignList.css";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/communication-logs');
        setCampaigns(response.data);
      } catch (error) {
        console.error('There was an error fetching the campaigns!', error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="campaign-list-page">
      <header>
        <h1>Mini CRM</h1>
      </header>
      <div className="campaign-list">
        <h2>Past Campaigns</h2>
        <ul>
          {campaigns.map((campaign) => (
            <li key={campaign._id} className="campaign-item">
              <h3>{campaign.campaign_name}</h3>
              <p>Created At: {new Date(campaign.createdAt).toLocaleString()}</p>
              <p>Audience Size: {campaign.audience.length}</p>
            </li>
          ))}
        </ul>
      </div>
      <footer>
        Made by Vraj Talati
      </footer>
    </div>
  );
};

export default CampaignList;
