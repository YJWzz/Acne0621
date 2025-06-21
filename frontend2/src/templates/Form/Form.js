import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Nav,
    Navbar,
    Container,
    Dropdown,
} from "react-bootstrap";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Formstyles from "./Form.module.css";

function Form() {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [images, setImages] = useState({
        left: null,
        middle: null,
        right: null,
    });
    const [previews, setPreviews] = useState({
        left: '',
        middle: '',
        right: '',
    });

    const handleUsernameSubmit = async () => {
        if (!username.trim()) {
            alert('Please enter your name before proceeding.');
            return;
        }

        const id = username.trim().toLowerCase().replace(/\s+/g, '_');

        try {
            const res = await fetch(`/check-user-id?user_id=${id}`);
            const data = await res.json();

            if (data.exists) {
                alert('這個名稱已被使用，請換一個名稱。');
                return;
            }

            setUserId(id);
            setShowUpload(true);
        } catch (err) {
            alert('檢查 user_id 時發生錯誤，請稍後再試。');
        }
    };

    const handleImageChange = (e, position) => {
        const file = e.target.files[0];
        if (file) {
            const newImages = { ...images, [position]: file };
            setImages(newImages);

            const reader = new FileReader();
            reader.onload = () => {
                setPreviews(prev => ({ ...prev, [position]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('left', images.left);
        formData.append('middle', images.middle);
        formData.append('right', images.right);

        try {
            const res = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await res.json();
            if (result.success) {
                window.location.href = `/AnalysisResult?user_id=${result.user_id}`;
            } else {
                alert('Upload failed. Please try again.');
            }
        } catch (err) {
            alert('Upload failed. Please try again.');
        }
    };

    return (
        <div>
            {/* <div className={Formstyles.container}>
                <div className={Formstyles.bodytitle} id="aaa">
                    aaa
                </div>
                <form method="POST" action="/submit" className={Formstyles.form}>
                    <label htmlFor="severity">Acne Severity:</label>
                    <select name="severity" id="severity">
                        <option value="Grade I">Grade I</option>
                        <option value="Grade II">Grade II</option>
                        <option value="Grade III">Grade III</option>
                        <option value="Grade IV">Grade IV</option>
                    </select>

                    <label htmlFor="skincare_routine">Describe your skincare routine:</label>
                    <textarea name="skincare_routine" id="skincare_routine" placeholder="Enter your routine here..."></textarea>

                    <button type="submit">Submit</button>
                </form>
            </div> */}

            <div className={Formstyles.container}>
                <div className={Formstyles.bodytitle} id="Upload Photo">
                    Upload Photo :
                </div>
                {!showUpload && (
                    <form className={Formstyles.form}>
                        <label htmlFor="username" className={Formstyles.label}>Enter Your Name:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter your name..."
                            required
                            className={Formstyles.input}
                        />
                        <button
                            type="button"
                            onClick={handleUsernameSubmit}
                            className={Formstyles.button}
                        >
                            Next
                        </button>
                    </form>
                )}

                {showUpload && (
                    <form onSubmit={handleUpload} encType="multipart/form-data" className={Formstyles.form}>
                        <input type="hidden" name="user_id" value={userId} />
                        <label className={Formstyles.label2}>
                            <div style={{ width: '33%', textAlign: 'left' }}>
                                <Button
                                    type="button"
                                    variant="outline-danger"
                                    style={{ width: 'auto', }}
                                    onClick={() => setShowUpload(false)}
                                >
                                    ← Back
                                </Button>
                            </div>
                            <div style={{ width: '33%' }}>
                                Upload 3 Images (Left, Middle, Right)
                            </div>
                            <div style={{ width: '33%' }}></div>
                        </label>
                        <div className={Formstyles.previewContainer}>
                            {['left', 'middle', 'right'].map((pos) => (
                                <div key={pos} className={Formstyles.previewBlock}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required
                                        onChange={(e) => handleImageChange(e, pos)}
                                        className={Formstyles.input}
                                    />
                                    {previews[pos] && (
                                        <>
                                            <img
                                                src={previews[pos]}
                                                alt={`${pos} Face`}
                                                className={Formstyles.previewImage}
                                            />
                                            <br />
                                            <Button
                                                type="button"
                                                variant="danger"
                                                style={{ margin: '2%' }}
                                                onClick={() => {
                                                    setImages(prev => ({ ...prev, [pos]: null }));
                                                    setPreviews(prev => ({ ...prev, [pos]: '' }));
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button type="submit" className={Formstyles.button}>Upload Images</button>

                    </form>
                )}

            </div>
        </div>
    );
}

export default Form;
