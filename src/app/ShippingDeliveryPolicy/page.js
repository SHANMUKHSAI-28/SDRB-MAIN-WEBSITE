import React from 'react';

const ShippingDeliveryPolicy = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Shipping & Delivery Policy</h1>
      <p style={styles.updated}>Last updated on Dec 4th 2024</p>

      <section style={styles.content}>
        <p>
          For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. 
          For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only.
        </p>
        <p>
          Orders are shipped within 0-7 days or as per the delivery date agreed at the time of order confirmation and delivery of the shipment is subject to Courier Company / post office norms. 
          SDRB TECHNOLOGIES PRIVATE LIMITED is not liable for any delay in delivery by the courier company/postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 0-7 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
        </p>
        <p>
          Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration.
        </p>
        <p>
          For any issues in utilizing our services, you may contact our helpdesk on <strong>9063091887</strong> or <strong>support@sdrbtechnologies.com</strong>.
        </p>
      </section>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    color: '#333',
  },
  header: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  updated: {
    fontSize: '14px',
    fontStyle: 'italic',
    color: '#7f8c8d',
    marginBottom: '20px',
  },
  content: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
};

export default ShippingDeliveryPolicy;
