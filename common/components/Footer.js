import styles from '../../styles/footer.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer(){
    return (
        <>
            <footer>
            <div className={styles.footer_content}>
                <p>&copy; 2023 DAU-Management App. All rights reserved.</p>
                <span>Created by Yu-Chun Lin 
                &nbsp;
                <Link href="https://github.com/yuchun1214">
                    <Image src="/github-mark.svg" width={30} height={30} alt='github profile'></Image>
                </Link>
                </span>
            </div>
            </footer>
        </>
    )
}