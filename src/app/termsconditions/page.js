import React from 'react';

const TermsConditions = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Privacy Policy</h1>
      <p style={styles.updated}>Last updated on Dec 4th 2024</p>

      <section style={styles.content}>
        <p>
          For the purpose of these Terms and Conditions, the term "we", "us", "our" used anywhere on this page shall mean 
          SDRB TECHNOLOGIES PRIVATE LIMITED, whose registered/operational office is located at:
        </p>
        <address style={styles.address}>
          42-3/1-82, R K Puram, Kallepalli Vari St, Gandhinagaram (Vijayawada), Vijayawada (Urban), Krishna, Andhra Pradesh 520003
        </address>
        <p>
          "You", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or 
          agreed to purchase from us.
        </p>

        <h2 style={styles.subHeader}>Terms and Conditions</h2>
        <p>
          Your use of the website and/or purchase from us are governed by the following Terms and Conditions:
        </p>
        <ul style={styles.list}>
          <li>The content of the pages of this website is subject to change without notice.</li>
          <li>
            Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, 
            completeness or suitability of the information and materials found or offered on this website for any particular purpose. 
            You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability 
            for any such inaccuracies or errors to the fullest extent permitted by law.
          </li>
          <li>
            Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which 
            we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available 
            through our website and/or product pages meet your specific requirements.
          </li>
          <li>
            Our website contains material which is owned by or licensed to us. This material includes, but is not limited to, 
            the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright 
            notice, which forms part of these terms and conditions.
          </li>
          <li>
            All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.
          </li>
          <li>
            Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
          </li>
          <li>
            From time to time, our website may also include links to other websites. These links are provided for your convenience 
            to provide further information.
          </li>
          <li>
            You may not create a link to our website from another website or document without SDRB TECHNOLOGIES PRIVATE LIMITED’s prior written consent.
          </li>
          <li>
            Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.
          </li>
          <li>
            We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization 
            for any transaction, on account of the cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
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
  address: {
    fontStyle: 'italic',
    marginBottom: '20px',
  },
  subHeader: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#34495e',
    marginTop: '20px',
    marginBottom: '10px',
  },
  list: {
    listStyleType: 'disc',
    marginLeft: '20px',
  },
};

export default TermsConditions;
