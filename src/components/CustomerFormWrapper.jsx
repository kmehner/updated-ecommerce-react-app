import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerForm from './CustomerForm'; // Assuming CustomerForm is your class component

// Wrapper component
function CustomerFormWrapper() {
  let params = useParams();
  let navigate = useNavigate();

  return <CustomerForm params={params} navigate={navigate} />;
}

export default CustomerFormWrapper;
