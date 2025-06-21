import React, { useState, useEffect, useRef, createContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Nav,
  Navbar,
  Container,
  Dropdown,
} from "react-bootstrap";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Mainpagestyles from "./Mainpage.module.css";
import Inform from "../Inform/Inform.js"
import Form from "../Form/Form.js"
import Chatbot from "../Chatbot/Chatbot.js"
import TMUlogo from "../../image/TMU logo.png"
import NTUTlogo from "../../image/NTUT logo.png"

// export const GlobalFunctionsContext = createContext();
// export const GlobalFunctionsProvider = ({ children }) => {
//   const sayHello = (name) => {
//     alert(`Hello, ${name}`);
//   };

//   return (
//     <GlobalFunctionsContext.Provider value={{ sayHello }}>
//       {children}
//     </GlobalFunctionsContext.Provider>
//   );
// };

function Mainpage() {
  const informRef = useRef(null);
  const formRef = useRef(null);
  const chatbotRef = useRef(null);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const scrollToRef = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div>
      <Navbar expand="lg" variant="light" fixed="top" className={`${Mainpagestyles.header} ${hideHeader ? Mainpagestyles.hidden : ''}`}>
        <Container>
          <div style={{ width: '33%' }}></div>
          <Navbar.Brand className={Mainpagestyles.title}>
            Welcome to the Acne platform
          </Navbar.Brand>
          <div style={{ width: '33%', textAlign: 'right' }}>
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
                <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => scrollToRef(informRef)}>護理指南</Dropdown.Item>
                <Dropdown.Item onClick={() => scrollToRef(chatbotRef)}>互動機器人</Dropdown.Item>
                <Dropdown.Item onClick={() => scrollToRef(formRef)}>AI即時偵測</Dropdown.Item>
                {/* <Dropdown.Divider />
                <Dropdown.Item onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? '日間模式' : '夜間模式'}
                </Dropdown.Item> */}
                {/* <Dropdown.Item href="/">Log out</Dropdown.Item> */}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>

      <div ref={informRef}>
        <Inform />
      </div>

      <div ref={chatbotRef}>
        <Chatbot />
      </div>

      <div ref={formRef}>
        <Form />
      </div>

      <footer className={Mainpagestyles.footer}>
        <div className={Mainpagestyles.footerContainer}>
          <div className={Mainpagestyles.footerSection}>
            <h4>關於我們</h4>
            <p>本平台致力於提供青春痘評估、個人化護理建議與互動式問答，協助使用者改善肌膚健康。</p>
          </div>

          <div className={Mainpagestyles.footerSection}>
            <h4>快速導覽</h4>
            <ul>
              <li><button onClick={() => scrollToRef(informRef)} className={Mainpagestyles.linkBtn}>護理指南</button></li>
              <li><button onClick={() => scrollToRef(chatbotRef)} className={Mainpagestyles.linkBtn}>互動機器人</button></li>
              <li><button onClick={() => scrollToRef(formRef)} className={Mainpagestyles.linkBtn}>AI即時偵測</button></li>
            </ul>
          </div>

          <div className={Mainpagestyles.footerSection}>
            <h4>聯絡資訊</h4>
            <p>Email: support@acnecare.com</p>
            <p>電話: 0800-123-456</p>
          </div>

          <div className={Mainpagestyles.footerSection}>
            <h4>致謝</h4>
            <a href="https://www.tmu.edu.tw/">
              <img src={TMUlogo} alt="TMU Logo" className={Mainpagestyles.footerlogo} />
            </a>
            <br/>
            <a href="https://www.ntut.edu.tw/">
              <img src={NTUTlogo} alt="NTUT Logo" className={Mainpagestyles.footerlogo} />
            </a>
          </div>
        </div>
        <div className={Mainpagestyles.footerBottom}>
          <p>© 2025 AcneCare Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Mainpage;


