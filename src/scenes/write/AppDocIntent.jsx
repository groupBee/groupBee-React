import {useState} from "react";

const AppDocIntent=({handleAdditionalFieldChange})=>{
    const [title,setTitle]=useState('');
    const [content,setContent]=useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        handleAdditionalFieldChange("title", e.target.value);
    };
    const handleContentChange = (e) => {
        setContent(e.target.value);
        handleAdditionalFieldChange("content", e.target.value);
    };

    return(
        <>
            <tr>
                <td style={{fontSize:'23px'}}>제목</td>
                <td colSpan={7}>
                    <input type='text' value={title} name='title' onChange={handleTitleChange}
                    style={{width:'100%',fontSize:'23px'}}/>
                </td>
            </tr>
            <tr>
                <td colSpan={8} style={{height:'50px',fontSize:'23px'}}>품의내용</td>
            </tr>
            <tr>
                <td colSpan={8}>
                    <input type='text' value={content} name='content' onChange={handleContentChange}
                           style={{height:'650px', width:'100%',fontSize:'23px'}}/>
                </td>
            </tr>
            <tr>
                <td colSpan={8} style={{height:'50px',fontSize:'23px'}}>위와 같이 품의사유로 검토 후 결제 바랍니다.</td>
            </tr>
        </>
    )
}
export default AppDocIntent;