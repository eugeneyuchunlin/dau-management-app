import styles from '../../styles/MonthBlock.module.css';
import OffcanvasContext from '../contexts/OffcanvasContext';
import { useContext } from 'react';

export default function MonthBlock({ children, onClick, item_name }) {

    const { onHide } = useContext(OffcanvasContext);

  return (
    <div className={styles.month_block} onClick={()=>{onClick(item_name); onHide()}}>
      <span className={styles.text}>{item_name}</span> {children}
    </div>
  );
}
