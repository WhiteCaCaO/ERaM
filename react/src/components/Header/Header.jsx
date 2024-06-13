import React from 'react';
import styles from './Header.module.css'; // 모듈 CSS import
import eram from '../../assets/images/eram.jpg'; // 로컬 이미지 import

const Header = function Header() {
  return (
    <div
      className={`${styles.header} ${styles.darken}`} // 백그라운드 이미지 어둡게 처리
      style={{
        backgroundImage: `url(${eram})`, // 로컬 이미지로 설정
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '60vh', // 이미지 높이를 절반으로 줄임
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div className={styles.headerContent}>
        <h1 className={styles.whiteText}>
          주변의 이색스포츠 시설을 찾아주고 정보를 제공하며 다양한<br />
          커뮤니티 서비스를 제공합니다
        </h1>
        <p className={styles.smallText}>Exotic Recreation And Matching</p>
        <a href="/eram/posts/page/1" className={`${styles.btn} ${styles.redBtn}`}>Community</a>
      </div>
    </div>
  );
};

export default Header;
