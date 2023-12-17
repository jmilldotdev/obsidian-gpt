import * as React from "react";

interface TagsInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, setTags }) => {
  const removeTag = (i: number): void => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
  };

  const removeAllTags = (): void => {
    setTags([]);
  };

  const inputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const val = e.currentTarget.value;
    if (e.key === "Enter" && val) {
      e.preventDefault();
      if (tags.find((tag) => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      setTags([...tags, val]);
      e.currentTarget.value = null;
    } else if (e.key === "Backspace" && !val) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="input-tag">
      <ul className="input-tag__tags">
        {tags.map((tag, i) => (
          <li key={tag} style={{ lineHeight: "2em" }}>
            {tag}
            <button
              type="button"
              onClick={() => {
                removeTag(i);
              }}
              style={{ float: "right" }}
            >
              X
            </button>
          </li>
        ))}
        <li className="input-tag__tags__input">
          <input type="text" onKeyDown={inputKeyDown} />
        </li>
      </ul>
      <button type="button" onClick={removeAllTags}>
        Remove All
      </button>
    </div>
  );
};

interface StopSequenceInputProps {
  stopSequences: string[];
  onChange: (stopSequences: string[]) => void;
}

const StopSequenceInput: React.FC<StopSequenceInputProps> = ({
  stopSequences,
  onChange: onChangeProp,
}) => {
  const [tags, setTags] = React.useState(stopSequences);

  const onChange = React.useCallback(onChangeProp, []);

  React.useEffect(() => {
    const processedSequences = tags.map((seq) => seq.replace(/\\n/g, "\n"));
    onChange(processedSequences);
  }, [tags, onChange]);

  return (
    <>
      <label htmlFor="stopSequence">Stop Sequences:</label>
      <TagsInput tags={tags} setTags={setTags} />
    </>
  );
};

export default StopSequenceInput;
