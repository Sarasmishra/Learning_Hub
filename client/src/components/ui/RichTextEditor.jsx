import { AlignVerticalJustifyCenter } from 'lucide-react';
import React, { useState,useEffect,useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({input, setInput}) => {
  const quillRef = useRef(null);

    const handleChange = (content) => {
        setInput({...input, description:content});
    }
    useEffect(() => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor(); // Access Quill instance
        // You can now manipulate editor if needed
      }
    }, []);
   
  return <ReactQuill  ref={quillRef} theme="snow"  value={input.description} onChange={handleChange}   />;



}
export default RichTextEditor