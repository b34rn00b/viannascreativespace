'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Heading1, Heading2, Heading3,
    List, ListOrdered, CheckSquare, Quote, Code,
    Link as LinkIcon, Image as ImageIcon, Youtube as YoutubeIcon,
    Table as TableIcon, Undo, Redo, Minus
} from 'lucide-react';
import styles from './RichEditor.module.css';

interface RichEditorProps {
    content: string;
    onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('Image URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const addYoutube = () => {
        const url = window.prompt('YouTube URL');
        if (url) editor.commands.setYoutubeVideo({ src: url });
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className={styles.toolbar}>
            {/* History */}
            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={styles.button} title="Undo">
                <Undo size={16} />
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={styles.button} title="Redo">
                <Redo size={16} />
            </button>

            <div className={styles.divider} />

            {/* Basic Formatting */}
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`${styles.button} ${editor.isActive('bold') ? styles.isActive : ''}`} title="Bold">
                <Bold size={16} />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`${styles.button} ${editor.isActive('italic') ? styles.isActive : ''}`} title="Italic">
                <Italic size={16} />
            </button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${styles.button} ${editor.isActive('underline') ? styles.isActive : ''}`} title="Underline">
                <UnderlineIcon size={16} />
            </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`${styles.button} ${editor.isActive('strike') ? styles.isActive : ''}`} title="Strikethrough">
                <Strikethrough size={16} />
            </button>

            <div className={styles.divider} />

            {/* Headings */}
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${styles.button} ${editor.isActive('heading', { level: 1 }) ? styles.isActive : ''}`} title="H1">
                <Heading1 size={16} />
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${styles.button} ${editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}`} title="H2">
                <Heading2 size={16} />
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${styles.button} ${editor.isActive('heading', { level: 3 }) ? styles.isActive : ''}`} title="H3">
                <Heading3 size={16} />
            </button>

            <div className={styles.divider} />

            {/* Lists & Alignment */}
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${styles.button} ${editor.isActive('bulletList') ? styles.isActive : ''}`} title="Bullet List">
                <List size={16} />
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${styles.button} ${editor.isActive('orderedList') ? styles.isActive : ''}`} title="Ordered List">
                <ListOrdered size={16} />
            </button>
            <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`${styles.button} ${editor.isActive('taskList') ? styles.isActive : ''}`} title="Task List">
                <CheckSquare size={16} />
            </button>

            <div className={styles.divider} />

            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`${styles.button} ${editor.isActive({ textAlign: 'left' }) ? styles.isActive : ''}`} title="Align Left">
                <AlignLeft size={16} />
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`${styles.button} ${editor.isActive({ textAlign: 'center' }) ? styles.isActive : ''}`} title="Align Center">
                <AlignCenter size={16} />
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`${styles.button} ${editor.isActive({ textAlign: 'right' }) ? styles.isActive : ''}`} title="Align Right">
                <AlignRight size={16} />
            </button>

            <div className={styles.divider} />

            {/* Inserts */}
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${styles.button} ${editor.isActive('blockquote') ? styles.isActive : ''}`} title="Quote">
                <Quote size={16} />
            </button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`${styles.button} ${editor.isActive('codeBlock') ? styles.isActive : ''}`} title="Code Block">
                <Code size={16} />
            </button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={styles.button} title="Horizontal Rule">
                <Minus size={16} />
            </button>

            <div className={styles.divider} />

            <button onClick={setLink} className={`${styles.button} ${editor.isActive('link') ? styles.isActive : ''}`} title="Link">
                <LinkIcon size={16} />
            </button>
            <button onClick={addImage} className={styles.button} title="Image">
                <ImageIcon size={16} />
            </button>
            <button onClick={addYoutube} className={styles.button} title="YouTube">
                <YoutubeIcon size={16} />
            </button>
            <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={styles.button} title="Insert Table">
                <TableIcon size={16} />
            </button>
        </div>
    );
};

export default function RichEditor({ content, onChange }: RichEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight,
            Image,
            Youtube.configure({ controls: false }),
            Link.configure({ openOnClick: false }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            TaskList,
            TaskItem.configure({ nested: true }),
            Placeholder.configure({ placeholder: 'Start writing your story...' })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false
    });

    if (!editor) return null;

    return (
        <div className={styles.editorWrapper}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className={styles.content} />
        </div>
    );
}
