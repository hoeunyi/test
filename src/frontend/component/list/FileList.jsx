import React from 'react';
import styled from 'styled-components' 

const FileListContainer = styled.div`
    margin-top: 16px; 
`; 

const FileItem = styled.div`
    margin-bottom : 8px;
    display : flex; 
    justify-content : space-between;
    align-items : center; 
`; 

const FileLink = styled.a`
    color : #007bff; 
    text-decoration: none; 
    
    & hover {
    text-decoration : underline; 
    }
`; 
function FileList(props){
    const {files} = props; 

    return (
        <FileListContainer>
            <FileItem>
                 <FileLink> 
                   {files.name}
                    </FileLink>
                </FileItem> 
        </FileListContainer>
    ); 
}; 

export default FileList; 