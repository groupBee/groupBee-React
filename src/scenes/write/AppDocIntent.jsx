import {useEffect, useState} from "react";

const AppDocIntent=({handleAdditionalFieldChange,setValidator})=>{
    const [title,setTitle]=useState('');
    const [content,setContent]=useState('');
    const [errors, setErrors] = useState({});

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        handleAdditionalFieldChange("title", e.target.value);
    };
    const handleContentChange = (e) => {
        setContent(e.target.value);
        handleAdditionalFieldChange("content", e.target.value);
    };
    // const validateForm = () => {
    //     const newErrors = {};
    //     if (!title) newErrors.title = "제목을 입력해주세요.";
    //     if (!content) newErrors.content = "내용을 입력해주세요.";
    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };
    //
    // // 부모 컴포넌트에서 검증 함수를 사용할 수 있게 설정
    // useEffect(() => {
    //     setValidator(validateForm);
    // }, [title, content]);

    return(
        <>
            <tr>
                <td style={{fontSize:'23px'}}>제목</td>
                <td colSpan={7}>
                    <input type='text' value={title} name='title' onChange={handleTitleChange}
                    style={{width:'100%',fontSize:'23px'}}/>
                    {/*{errors.title && <p style={{ color: 'red', margin: '0' }}>{errors.title}</p>}*/}
                </td>
            </tr>
            <tr>
                <td colSpan={8} style={{height:'50px',fontSize:'23px'}}>품의내용</td>
            </tr>
            <tr>
                <td colSpan={8}>
                    <textarea value={content} name='content' onChange={handleContentChange}
                           style={{height:'650px', width:'100%',fontSize:'23px',border:'none',resize:'none'}}/>
                    {/*{errors.content && <p style={{color:'red'}}>{errors.content}</p>}*/}
                </td>
            </tr>
            <tr>
                <td colSpan={8} style={{height:'50px',fontSize:'23px'}}>위와 같이 품의사유로 검토 후 결제 바랍니다.</td>
            </tr>
        </>
    )
}
export default AppDocIntent;