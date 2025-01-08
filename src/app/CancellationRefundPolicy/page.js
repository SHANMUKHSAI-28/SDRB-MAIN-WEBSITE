import React from 'react';

const CancellationRefundPolicy = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Cancellation & Refund Policy</h1>
      <p style={styles.updated}>Last updated on Dec 4th 2024</p>

      <section style={styles.content}>
        <p>
          SDRB TECHNOLOGIES PRIVATE LIMITED believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
        </p>
        <ul style={styles.list}>
          <li>
            Cancellations will be considered only if the request is made within 2-3 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
          </li>
          <li>
            SDRB TECHNOLOGIES PRIVATE LIMITED does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
          </li>
          <li>
            In case of receipt of damaged or defective items, please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 2-3 days of receipt of the products.
          </li>
          <li>
            In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 2-3 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
          </li>
          <li>
            In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
          </li>
          <li>
            In case of any refunds approved by SDRB TECHNOLOGIES PRIVATE LIMITED, it’ll take 3-4 days for the refund to be processed to the end customer.
          </li>
        </ul>
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
  list: {
    listStyleType: 'disc',
    marginLeft: '20px',
  },
};

export default CancellationRefundPolicy;
