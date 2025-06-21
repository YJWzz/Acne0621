import React, { useRef, useEffect, useState } from 'react';
import Informstyles from "./Inform.module.css";
import {
  Carousel
} from "react-bootstrap";

function Inform() {
  // const scrollRef = useRef(null);
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const sections = [0, 1, 2];

  // const scrollToIndex = (index) => {
  //   const container = scrollRef.current;
  //   const sectionWidth = container.clientWidth * 0.8 + 16;
  //   container.scrollTo({ left: index * sectionWidth, behavior: 'smooth' });
  //   setCurrentIndex(index);
  // };

  // const handlePrev = () => {
  //   const newIndex = (currentIndex - 1 + sections.length) % sections.length;
  //   scrollToIndex(newIndex);
  // };

  // const handleNext = () => {
  //   const newIndex = (currentIndex + 1) % sections.length;
  //   scrollToIndex(newIndex);
  // };

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     handleNext();
  //   }, 10000);
  //   return () => clearInterval(timer);
  // }, [currentIndex]);

  return (
    <div className={Informstyles.container}>
      <h1 className={Informstyles.title}>日常青春痘護理指南</h1>
      <Carousel interval={10000}>
      <Carousel.Item className={Informstyles.carouselItem}>
        <h2 className={Informstyles.sectionTitle}>一、日常皮膚保養</h2>
          <ul className={Informstyles.list}>
            <li className={Informstyles.listItem}><strong>清潔：</strong>每日洗臉 2-3 次，使用溫水及溫和無皂洗面乳，避免過度清潔及使用磨砂膏或電動洗臉機。</li>
            <li className={Informstyles.listItem}><strong>保濕：</strong>使用成分單純且清爽的保濕乳液，避免油性或致粉刺成分。</li>
            <li className={Informstyles.listItem}><strong>防曬：</strong>選擇物理性防曬，搭配長袖衣物、帽子或陽傘防護。</li>
            <li className={Informstyles.listItem}><strong>化妝品：</strong>減少化妝，避免含油性或致粉刺成分的底妝，妝後使用卸妝乳或液卸妝。</li>
            <li className={Informstyles.listItem}>避免使用潤髮乳、造型髮品及霜類產品。</li>
            <li className={Informstyles.listItem}>慎選牙膏，含氟牙膏可能引起嘴周痘痘。</li>
            <li className={Informstyles.listItem}>切勿用手擠痘，以免感染或留下疤痕。</li>
          </ul>
      </Carousel.Item>
      <Carousel.Item className={Informstyles.carouselItem}>
        <h2 className={Informstyles.sectionTitle}>二、日常飲食</h2>
          <ul className={Informstyles.list}>
            <li className={Informstyles.listItem}>避免高 GI/GL 食物，如精緻澱粉、甜食、汽水等。</li>
            <li className={Informstyles.listItem}>少吃高熱量高油脂食品，如堅果類、乳酪製品。</li>
            <li className={Informstyles.listItem}>減少奶製品攝取，以免加重痤瘡。</li>
            <li className={Informstyles.listItem}>避免辛辣、油炸食物。</li>
            <li className={Informstyles.listItem}>攝取高纖維蔬果，有助於降低升糖指數並改善痤瘡。</li>
          </ul>
      </Carousel.Item>
      <Carousel.Item className={Informstyles.carouselItem}>
        <h2 className={Informstyles.sectionTitle}>三、日常生活</h2>
          <ul className={Informstyles.list}>
            <li className={Informstyles.listItem}>保持規律作息，避免熬夜及過度壓力。</li>
            <li className={Informstyles.listItem}>減少長時間處於悶熱環境，避免大量流汗。</li>
            <li className={Informstyles.listItem}>女性若出現生理期不規則或多毛症狀，需就醫檢查是否為多囊性卵巢症候群。</li>
            <li className={Informstyles.listItem}>按皮膚科醫師指示規律用藥，避免使用來路不明或含類固醇的藥膏。</li>
          </ul>
      </Carousel.Item>
    </Carousel>

      {/* <button onClick={() => window.location.href = '/'} className={Informstyles.button}>
        前往護膚平台
      </button> */}
    </div>
  );
}

export default Inform;
