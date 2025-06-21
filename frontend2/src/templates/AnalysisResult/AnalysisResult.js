import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import AnalysisResultstyles from './AnalysisResult.module.css';

function AnalysisResult() {
  const [results, setResults] = useState([]);
  const [userId, setUserId] = useState('');
  const [uploadTime, setUploadTime] = useState('');
  const [advice, setAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adviceLoading, setAdviceLoading] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('user_id');
    if (uid) {
      setUserId(uid);
      fetch(`/result?user_id=${uid}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.results || []);
          if (data.results?.length > 0) {
            setUploadTime(data.results[0].upload_time);
            return requestAdvice(data.results);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const requestAdvice = async (resultList) => {
    setAdviceLoading(true); // ✅ 顯示建議區塊 loading 狀態
    const prompt = resultList.map(r => `${r.face_part} face: ${r.severity}`).join('\n');
    try {
      const res = await fetch('http://localhost:5678/webhook/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `根據以下痘痘分析結果提供衛教建議和可參考資源：\n${prompt}` })
      });
      const data = await res.json();
      setAdvice([marked(data.reply || '')]);
    } catch (err) {
      setAdvice(['無法取得衛教建議，請稍後再試。']);
    } finally {
      setAdviceLoading(false); // ✅ 停止 loading 狀態
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className={AnalysisResultstyles.wrapper}>
      {loading ? (
        <div className={AnalysisResultstyles.loadingOverlay}>
          <div className={AnalysisResultstyles.spinner}></div>
          <p>資料載入中，請稍候...</p>
        </div>
      ) : (
        <>
          <h1 className={AnalysisResultstyles.title}>Analysis Results for User: {userId}</h1>
          <p className={AnalysisResultstyles.uploadTime}>Upload Time: {uploadTime}</p>

          <div className={AnalysisResultstyles.resultContainer}>
            <div className={AnalysisResultstyles.imageContainer}>
              {results.map((result, index) => (
                <div key={index} className={AnalysisResultstyles.resultCard}>
                  <h3>{capitalize(result.face_part)} Face</h3>
                  <img
                    src={`/uploads/${userId}/${result.filename}`}
                    alt={`${result.face_part} face`}
                    className={AnalysisResultstyles.resultImage}
                  />
                  <p>Severity: {result.severity}</p>
                  <p>Confidence: {result.confidence}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={AnalysisResultstyles.adviceSection}>
            <h2>AI 衛教建議與參考資料</h2>
            {adviceLoading ? (
              <div className={AnalysisResultstyles.adviceLoading}>
                <div className={AnalysisResultstyles.spinner}></div>
                <p>正在生成建議中，請稍候...</p>
              </div>
            ) : (
              advice.map((html, idx) => (
                <div
                  key={idx}
                  className={AnalysisResultstyles.adviceHTML}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ))
            )}
          </div>

          <a href="/" className={AnalysisResultstyles.backLink}>Back to Home</a>
        </>
      )}
    </div>
  );
}

export default AnalysisResult;
