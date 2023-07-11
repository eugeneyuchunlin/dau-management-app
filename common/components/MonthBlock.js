import styles from '../../styles/MonthBlock.module.css';

export default function MonthBlock({ children, onClick, item_name }) {

    
  return (
    <div className={styles.month_block} onClick={()=>{onClick(item_name)}}>
      <span className={styles.text}>{item_name}</span> {children}
    </div>
  );
}
