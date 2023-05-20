import styles from '../../styles/footer.module.css'

export default function Footer(){
    return (
        <>
            <footer>
            <div className={styles.footer_content}>
                <p>&copy; 2023 DAU-Management App. All rights reserved.</p>
                <p>Created by Yu-Chun Lin</p>
            </div>
            </footer>
        </>
    )
}