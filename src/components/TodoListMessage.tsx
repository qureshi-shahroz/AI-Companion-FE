interface TodoListMessageProps {
  content: string;
}

export const TodoListMessage = ({ content }: TodoListMessageProps) => {
  // Parse HTML content and render it safely
  // The content may contain HTML formatting from the AI response
  return (
    <div 
      className="text-sm [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1 [&_ul]:ml-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1 [&_ol]:ml-2 [&_p]:mb-2 [&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mb-1 [&_strong]:font-semibold"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

