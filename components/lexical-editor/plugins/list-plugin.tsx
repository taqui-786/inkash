"use client";

import { ListPlugin as LexicalListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";

export default function ListPlugin() {
  return (
    <>
      <LexicalListPlugin />
      <CheckListPlugin />
    </>
  );
}
