import { ChangeEventHandler, FC, MouseEventHandler, useState } from 'react';

type EditableFieldType = {
  name: string;
  initialValue: string;
  onUpdate: (new_text: string) => void;
};

const EditableField: FC<EditableFieldType> = (props) => {
  const { name, initialValue, onUpdate } = props;
  const [editMode, setEditMode] = useState<boolean>(false);
  const [text, setText] = useState<string>(initialValue);
  const [lastValidText, setLastValidText] = useState<string>(initialValue);

  const onEdit: MouseEventHandler<HTMLButtonElement> = () => {
    if (editMode) {
      if (text.trim() !== '') {
        onUpdate(text);
      } else {
        setText(lastValidText);
      }
    } else {
      setLastValidText(text);
    }
    setEditMode(!editMode);
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setText(event.target.value);
  };

  return editMode ? (
    <p>
      <input value={text} onChange={onInputChange} /> <button onClick={onEdit}>💾</button>
    </p>
  ) : (
    <p>
      {name}: {text} <button onClick={onEdit}>🖉</button>
    </p>
  );
};

export default EditableField;
