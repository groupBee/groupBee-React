import { useEffect, useState } from "react";
import axios from "axios"; // axios 추가

const AppDocIntent = ({ handleAdditionalFieldChange, additionalFields, appId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (appId){
            getFormData();
        }else {
            setTitle('');
            setContent('');
        }

    }, [appId]);

    const getFormData = () => {
        if (appId) {
            axios.get(`/api/elecapp/findById?elecAppId=${appId}`)
                .then(res => {
                    setTitle(res.data.additionalFields.title);
                    setContent(res.data.additionalFields.content);
                })
                .catch(err => {
                    console.error("문서 불러오기 실패:", err);
                });
        }
    }

    // 제목 입력 핸들러
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        handleAdditionalFieldChange("title", e.target.value);
    };

    // 내용 입력 핸들러
    const handleContentChange = (e) => {
        setContent(e.target.value);
        handleAdditionalFieldChange("content", e.target.value);
    };

    return (
        <>
            <tr>
                <td style={{ fontSize: '23px' }}>제목</td>
                <td colSpan={7}>
                    <input
                        type='text'
                        value={title}
                        name='title'
                        onChange={handleTitleChange}
                        style={{ width: '100%', fontSize: '23px',textAlign:'center'}}
                    />
                    {/*{errors.title && <p style={{ color: 'red', margin: '0' }}>{errors.title}</p>}*/}
                </td>
            </tr>
            <tr>
                <td colSpan={8} style={{ height: '50px', fontSize: '23px' }}>품의내용</td>
            </tr>
            <tr>
                <td colSpan={8}>
                    <textarea
                        value={content}
                        name='content'
                        onChange={handleContentChange}
                        style={{ height: '650px', width: '100%', fontSize: '23px', border: 'none', resize: 'none' }}
                    />
                    {/*{errors.content && <p style={{ color: 'red' }}>{errors.content}</p>}*/}
                </td>
            </tr>
            <tr>
                <td colSpan={8} style={{ height: '50px', fontSize: '23px' }}>위와 같이 품의사유로 검토 후 결제 바랍니다.</td>
            </tr>
        </>
    );
};

export default AppDocIntent;
