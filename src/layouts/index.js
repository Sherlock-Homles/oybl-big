import styles from './index.css';
import { Provider } from 'mobx-react';
import services from '../services';

function BasicLayout(props) {
  return (
    <Provider {...services}>
      <div className={styles.normal}>{props.children}</div>
    </Provider>
  );
}

export default BasicLayout;
