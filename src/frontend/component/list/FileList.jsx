import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTrash, FaDownload } from "react-icons/fa";

const FileListContainer = styled.div`
    margin-top: 16px; 
    align-items: flex-start;
`; 

const FileItem = styled.div`
    margin-bottom: 8px;
    display: flex; 
    justify-content: space-between;
    align-items: center; 
`; 

const FileLink = styled.a`
    color: #007bff; 
    text-decoration: none; 
    
    &:hover {
        text-decoration: underline; 
    }
`; 

function FileList(props) {
    const { files } = props;

    // 첨부파일 다운로드
    const handleDownload = (id) => {
        console.log("try download!"); 
        const downloadConfirm = window.confirm(`다운로드 하시겠습니까?`); 
        if (downloadConfirm) {
            window.location.href = `http://localhost:3000/files/${id}`; 
        }
    };

    return (
        <FileListContainer>
            {files.map((file) => (
                <FileItem key={file.id}>
                    <FileLink onClick={() => handleDownload(file.id)}> 
                        {file.name}
                    </FileLink>
                </FileItem> 
            ))}
        </FileListContainer>
    ); 
}

export default FileList;
