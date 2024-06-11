import React from 'react';
import styles from './index.css';
import TransportChart from '../TransportChart';
import VASChart from '../VASChart';
import VASDetail from '../VASDetail';

const TransportAndService = () => (
  <div className={styles.wrapper}>
   {/* <TransportChart />*/}
    {/* <VASChart /> */}
    <VASDetail />
  </div>
);
export default TransportAndService;
