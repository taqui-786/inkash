"use client";

import React, { useState } from 'react'
import { LexicalEditor } from './lexical-editor'

function MainClient() {
    const [markdown, setMarkdown] = useState("");
    console.log(markdown);
    
  return (
      <div className="max-w-5xl mx-auto w-full">
        <LexicalEditor onChange={(editorState, md) => setMarkdown(md)} />
      </div>
  )
}

export default MainClient