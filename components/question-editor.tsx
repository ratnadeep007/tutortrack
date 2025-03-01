import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface QuestionEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>, text: string) => void;
  placeholder?: string;
}

export function QuestionEditor({ content, onChange }: QuestionEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON(), editor.getText());
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-secondary' : ''}
          >
            Bold
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-secondary' : ''}
          >
            Italic
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-secondary' : ''}
          >
            Bullet List
          </Button>
        </div>
        <EditorContent editor={editor} />
      </CardContent>
    </Card>
  );
}
